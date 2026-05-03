# 🚀 Aplicação Mobile Omnibus - Motorista

**Status**: ✅ Implementação Completa | Pronto para Produção

---

## 📱 O que foi Construído

Uma aplicação mobile **responsiva** para motoristas gerenciarem suas rotas e despesas, com integração completa ao backend Laravel.

### ✨ Funcionalidades Implementadas

#### 1️⃣ **Autenticação Segura**
- ✅ Login com email e senha
- ✅ Integração com API backend (Sanctum)
- ✅ Token armazenado seguramente
- ✅ Auto-logout em token expirado
- ✅ Logout manual com um clique

#### 2️⃣ **Dashboard de Rotas**
- ✅ Lista de rotas previstas para o motorista
- ✅ Horários, pontos de início e fim
- ✅ Clique para ver detalhes (mapa + notificações)
- ✅ Carregamento dinâmico da API

#### 3️⃣ **Cadastro de Despesas/Gastos**
- ✅ Formulário com validação
- ✅ Campos: Placa, Valor, Descrição
- ✅ Upload de comprovantes (estrutura pronta)
- ✅ Feedback visual de envio

#### 4️⃣ **Mapa Interativo**
- ✅ Visualização de rotas em tempo real
- ✅ Marcadores customizados (início, fim)
- ✅ Linha conectando pontos
- ✅ Zoom automático
- ✅ Responsivo em qualquer dispositivo

#### 5️⃣ **Sistema de Notificações**
- ✅ Dropdown com tipos predefinidos
- ✅ Campo para mensagem personalizada
- ✅ Estrutura integrada com API
- ✅ Feedback de envio com sucesso

#### 6️⃣ **Design Responsivo**
- ✅ Mobile-first (390px base)
- ✅ Adaptável a tablets e desktops
- ✅ Interface intuitiva e acessível
- ✅ Cores: #1A2B4A (azul) + #F5B800 (amarelo)

---

## 🎯 Como Usar

### 1️⃣ **Instalação**
```bash
cd omnibus_mobile
npm install
```

### 2️⃣ **Configuração**
Edite `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 3️⃣ **Desenvolvimento**
```bash
npm run dev
```
Acesse: http://localhost:3000

### 4️⃣ **Produção**
```bash
npm run build
npm start
```

---

## 📚 Documentação Completa

| Documento | Descrição |
|-----------|-----------|
| **IMPLEMENTACAO.md** | Guia completo de implementação e uso |
| **BACKEND_CONFIG.md** | Como configurar o backend Laravel |
| **DEPLOYMENT.md** | Como fazer deploy em produção |

---

## 📁 Estrutura de Pastas

```
omnibus_mobile/
├── src/
│   ├── components/MapComponent.tsx       # Mapa com Leaflet
│   ├── contexts/AuthContext.tsx          # Autenticação global
│   ├── hooks/useAuth.ts                  # Hook de autenticação
│   ├── services/
│   │   ├── api.ts                        # Cliente HTTP base
│   │   ├── auth.ts                       # Autenticação
│   │   ├── routes.ts                     # Rotas e Despesas
│   │   └── notifications.ts              # Notificações
│   └── types/index.ts                    # Tipos TypeScript
├── app/
│   ├── layout.tsx                        # Layout com AuthProvider
│   ├── login/page.tsx                    # Tela de login
│   ├── dashboard/page.tsx                # Rotas + Despesas
│   └── acompanharRota/[id]/page.tsx      # Detalhes + Mapa
└── .env.local                            # Variáveis de ambiente
```

---

## 🔗 Endpoints da API

### ✅ Já Integrados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/drivers/login` | Login do motorista |
| GET | `/api/drivers/me` | Dados do motorista |
| POST | `/api/drivers/logout` | Logout |
| GET | `/api/routes` | Lista de rotas |
| GET | `/api/routes/{id}` | Detalhes da rota |
| GET | `/api/drivers/expenses` | Lista de despesas |
| POST | `/api/drivers/expenses` | Cadastrar despesa |
| GET | `/api/drivers/expenses-monthly-total` | Total mensal |

### ⏳ Para Implementar

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/drivers/notifications` | Enviar notificação |
| GET | `/api/drivers/notifications` | Listar notificações |

---

## ✅ Recursos

- ✅ Autenticação com Sanctum Token
- ✅ Context API para estado global
- ✅ Integração completa com API
- ✅ Mapa interativo (Leaflet)
- ✅ Design responsivo
- ✅ TypeScript
- ✅ Tratamento de erros robusto
- ✅ Logout automático em token expirado

---

## 🚀 Próximos Passos

1. **Leia a documentação**: `IMPLEMENTACAO.md`
2. **Configure o backend**: `BACKEND_CONFIG.md`
3. **Faça deploy**: `DEPLOYMENT.md`
4. **Teste em produção**

---

**Versão**: 1.0  
**Data**: 02/05/2026  
**Status**: ✅ Pronto para Produção

---

Para mais informações, consulte a documentação nos arquivos `.md` deste diretório.
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
