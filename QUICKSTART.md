# ⚡ Quick Start - Aplicação Mobile Omnibus

## 🚀 Começar em 5 Minutos

### 1️⃣ Clonar e Instalar (1 min)
```bash
cd omnibus_mobile
npm install
```

### 2️⃣ Configurar (30 seg)
```bash
# Editar arquivo: omnibus_mobile/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 3️⃣ Iniciar (30 seg)
```bash
npm run dev
```
👉 Acesse: **http://localhost:3000**

---

## 🧪 Testar Localmente

### Login
```
Email: motorista@example.com
Senha: senha123
```

### O que Você Verá
✅ Dashboard com rotas previstas  
✅ Formulário para cadastrar gastos  
✅ Clique em uma rota para ver o mapa  
✅ Botão de logout no canto superior direito

---

## 📁 Arquivos Importantes

| Arquivo | Propósito |
|---------|-----------|
| `.env.local` | Config da API |
| `src/contexts/AuthContext.tsx` | Autenticação global |
| `src/components/MapComponent.tsx` | Mapa interativo |
| `app/dashboard/page.tsx` | Página principal |
| `IMPLEMENTACAO.md` | Documentação completa |

---

## 🔗 Endpoints Utilizados

```
POST   /api/drivers/login              → Login
GET    /api/drivers/me                 → Dados do motorista
GET    /api/routes                     → Lista rotas
GET    /api/routes/{id}                → Detalhes rota
GET    /api/drivers/expenses           → Lista despesas
POST   /api/drivers/expenses           → Cadastrar despesa
GET    /api/drivers/expenses-monthly-total → Total mensal
```

---

## 🐛 Troubleshooting Rápido

| Erro | Solução |
|------|---------|
| "Erro de conexão" | Backend não está rodando (php artisan serve) |
| "Token inválido" | Fazer login novamente |
| "Página branca" | Abrir console (F12) e verificar erros |
| "Mapa não carrega" | Verificar internet (usa OpenStreetMap) |

---

## 📱 Testar em Mobile

### Opção 1: Navegador
- F12 → Device toolbar (Ctrl+Shift+M)
- Escolher "iPhone SE" ou similar

### Opção 2: Celular Real
```bash
# Descobrir seu IP local
ipconfig getifaddr en0  # macOS
hostname -I             # Linux
ipconfig                # Windows (procure por IPv4)

# Acessar no celular
http://seu-ip-local:3000
```

---

## 🎨 Visualizar Design

Cores principais:
- **Azul**: #1A2B4A
- **Amarelo**: #F5B800
- **Fundo**: #F4F6FA

Font: **Montserrat** (Google Fonts)

---

## 🔒 Segurança

Token é armazenado em `localStorage` com a chave:
```
localStorage.getItem('authToken')
localStorage.getItem('driver')
```

Para limpar (se necessário):
```javascript
localStorage.clear()
location.reload()
```

---

## 📊 Build para Produção

```bash
npm run build       # Compila
npm start          # Inicia servidor
```

Ou com Docker:
```bash
docker-compose up -d
```

---

## 📚 Leia Depois

1. **IMPLEMENTACAO.md** - Guia completo
2. **BACKEND_CONFIG.md** - Config backend
3. **DEPLOYMENT.md** - Deploy em produção

---

## 💡 Dicas Rápidas

```javascript
// Acessar contexto de autenticação em qualquer página
import { useAuth } from '@/hooks/useAuth'

export default function MyPage() {
  const { driver, logout, isAuthenticated } = useAuth()
  
  return <div>Olá, {driver?.name}</div>
}
```

```javascript
// Fazer requisição à API
import { routesService } from '@/services/routes'

const routes = await routesService.getRoutes()
```

---

## ✅ Checklist Rápido

- [ ] npm install rodou sem erros
- [ ] .env.local está configurado
- [ ] npm run dev inicia sem problemas
- [ ] http://localhost:3000 carrega
- [ ] Login funciona
- [ ] Dashboard exibe rotas
- [ ] Clique em rota mostra mapa

---

## 🆘 Precisa de Ajuda?

1. Verificar console: F12 → Console
2. Verificar network: F12 → Network
3. Ler IMPLEMENTACAO.md
4. Verificar BACKEND_CONFIG.md

---

**Tempo total**: ~5 minutos ⚡

Bom desenvolvimento! 🚀
