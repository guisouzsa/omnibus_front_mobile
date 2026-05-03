# Guia de Deployment - Aplicação Mobile Omnibus

## 🚀 Build para Produção

### 1. Preparar Variáveis de Ambiente

Criar arquivo `.env.production`:
```
NEXT_PUBLIC_API_URL=https://api.omnibus.com/api
NEXT_PUBLIC_API_TIMEOUT=30000
```

### 2. Build da Aplicação

```bash
npm run build
```

Isso gera:
- `.next/` - Código compilado otimizado
- Pode ser deployado em qualquer servidor Node.js

### 3. Iniciar em Produção

```bash
npm start
```

---

## 🐳 Docker (Recomendado)

### Dockerfile

```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Runtime stage
FROM node:20-alpine

WORKDIR /app

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

USER nextjs

EXPOSE 3000

ENV NODE_ENV production

CMD ["npm", "start"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  omnibus-mobile:
    build: .
    container_name: omnibus-mobile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000/api
      - NODE_ENV=production
    restart: unless-stopped
    networks:
      - omnibus-network

networks:
  omnibus-network:
    driver: bridge
```

### Executar com Docker

```bash
docker-compose up -d
```

---

## 🔄 CI/CD (GitHub Actions)

### .github/workflows/deploy.yml

```yaml
name: Deploy to Production

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.API_URL }}
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd /var/www/omnibus-mobile
            git pull origin main
            npm ci
            npm run build
            npm run start
```

---

## ☁️ Deployment em Vercel (Recomendado para Next.js)

### 1. Conectar ao Vercel

```bash
npm i -g vercel
vercel
```

### 2. Configurar Variáveis

No dashboard do Vercel:
- Ir para Settings > Environment Variables
- Adicionar:
  ```
  NEXT_PUBLIC_API_URL=https://api.omnibus.com/api
  ```

### 3. Deploy Automático

Toda push para `main` será automaticamente deployado.

---

## 🎯 Performance Otimizations

### 1. Next.js Config

```javascript
// next.config.ts
const nextConfig = {
  compress: true,
  swcMinify: true,
  images: {
    minimumCacheTTL: 60,
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: {
      '@/': ['components', 'services', 'contexts', 'hooks'],
    },
  },
}
```

### 2. API Response Caching

Em `src/services/api.ts`, adicionar:

```typescript
const cacheConfig = {
  'GET /routes': 5 * 60 * 1000,        // 5 minutos
  'GET /drivers/me': 10 * 60 * 1000,   // 10 minutos
}

// No interceptor de requisição:
if (request.method === 'GET') {
  const key = `${request.method} ${request.url}`
  const cached = sessionStorage.getItem(key)
  if (cached && cacheConfig[key]) {
    return JSON.parse(cached)
  }
}
```

---

## 📱 Progressive Web App (PWA)

### Adicionar suporte a PWA

```bash
npm install next-pwa
```

### next.config.ts

```typescript
import withPWA from 'next-pwa'

export default withPWA({
  dest: 'public',
  sw: 'sw.js',
  skipWaiting: true,
})
```

### public/manifest.json

```json
{
  "name": "Omnibus Motorista",
  "short_name": "Omnibus",
  "description": "App para motoristas do sistema Omnibus",
  "start_url": "/",
  "display": "standalone",
  "scope": "/",
  "orientation": "portrait-primary",
  "background_color": "#ffffff",
  "theme_color": "#1A2B4A",
  "icons": [
    {
      "src": "/logo.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/logo.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## 🔐 Segurança

### 1. Headers de Segurança

Em `next.config.ts`:

```typescript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    },
  ]
}
```

### 2. Rate Limiting

Adicionar ao backend (Laravel):

```php
Route::middleware('throttle:60,1')->group(function () {
    // Endpoints da API
});
```

### 3. HTTPS Obrigatório

```typescript
// Em middleware ou na raiz do app
if (typeof window !== 'undefined' && window.location.protocol !== 'https:') {
  window.location.protocol = 'https:'
}
```

---

## 📊 Monitoramento

### Adicionar Sentry para Error Tracking

```bash
npm install @sentry/nextjs
```

```typescript
// lib/sentry.ts
import * as Sentry from '@sentry/nextjs'

export function initSentry() {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0,
  })
}
```

### Analytics

Usar Google Analytics ou Mixpanel para monitorar uso:

```typescript
// lib/analytics.ts
export function trackEvent(eventName: string, data?: any) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, data)
  }
}
```

---

## 🧪 Testes

### Testes Unitários

```bash
npm install --save-dev vitest @testing-library/react
```

### Testes E2E

```bash
npm install --save-dev playwright
```

---

## 📋 Checklist pré-Produção

- [ ] Variáveis de ambiente configuradas
- [ ] API backend validada e testada
- [ ] Testes unitários passando
- [ ] Build sem erros: `npm run build`
- [ ] Performance otimizada (Lighthouse score > 80)
- [ ] HTTPS habilitado
- [ ] CORS configurado corretamente
- [ ] Rate limiting implementado
- [ ] Error handling robusto
- [ ] Monitoring/Analytics configurado
- [ ] Documentação atualizada
- [ ] Backup strategy definida

---

## 📞 Troubleshooting em Produção

### Logs

```bash
# Ver logs em tempo real
npm start > logs/app.log 2>&1 &

# Com PM2
pm2 logs omnibus-mobile
```

### Restart

```bash
# Com PM2
pm2 restart omnibus-mobile

# Com Docker
docker-compose restart omnibus-mobile
```

### Database Backup

```bash
# Backup automático (cron job)
0 2 * * * /backup/backup-db.sh
```

---

**Data**: 02/05/2026
**Versão**: 1.0
