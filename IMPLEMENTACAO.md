# Guia de Implementação - Aplicação Mobile Omnibus Motorista

## 📋 Resumo das Implementações Realizadas

### 1. ✅ Autenticação e Contexto Global
- **Arquivo**: `src/contexts/AuthContext.tsx`
- **Serviço**: `src/services/auth.ts`
- Login integrado com API backend (Sanctum)
- Token armazenado em localStorage
- Contexto global para compartilhar estado de autenticação
- Hook `useAuth()` para fácil acesso

**Como usar:**
```typescript
import { useAuth } from '@/hooks/useAuth'

export default function MyComponent() {
  const { driver, login, logout, isAuthenticated } = useAuth()
  // ...
}
```

---

### 2. ✅ Integração de Rotas
- **Arquivo**: `app/dashboard/page.tsx`
- **Serviço**: `src/services/routes.ts`
- Dashboard busca rotas do motorista autenticado da API
- Exibe rotas organizadas por horário
- Cards clicáveis que levam aos detalhes de cada rota

**Endpoint consumido:**
```
GET /api/routes
Authorization: Bearer {token}
```

---

### 3. ✅ Cadastro de Despesas/Gastos
- **Arquivo**: `app/dashboard/page.tsx`
- **Serviço**: `src/services/routes.ts` (ExpensesService)
- Formulário para cadastrar gastos do motorista
- Campos: Placa do ônibus, valor, descrição
- Upload de comprovantes (estrutura preparada)

**Endpoint consumido:**
```
POST /api/drivers/expenses
Authorization: Bearer {token}
Content-Type: application/json

{
  "vehicle_plate": "ABC-1234",
  "value": 150.50,
  "description": "Combustível"
}
```

---

### 4. ✅ Mapa Interativo na Tela de Rota
- **Componente**: `src/components/MapComponent.tsx`
- **Arquivo**: `app/acompanharRota/[id]/page.tsx`
- Mapa com Leaflet + OpenStreetMap
- Marcadores de início (azul) e fim (amarelo)
- Linha de rota conectando os pontos
- Zoom automático para enquadrar toda a rota
- Responsivo para diferentes tamanhos de tela

**Uso:**
```typescript
<MapComponent
  startPoint={{ lat: -19.8226, lng: -43.9441, name: 'Centro' }}
  endPoint={{ lat: -19.9226, lng: -43.8441, name: 'Escola' }}
  height="308px"
/>
```

---

### 5. ✅ Sistema de Notificações
- **Arquivo**: `app/acompanharRota/[id]/page.tsx`
- **Serviço**: `src/services/notifications.ts`
- Dropdown com tipos de notificação predefinidos
- Campo de texto para notificações personalizadas
- Estrutura preparada para integração com API

**Tipos de notificação disponíveis:**
- Rota Iniciada
- Rota Finalizada
- Atraso na Rota
- Troca de Veículo
- Veículo apresenta mau funcionamento

**Endpoint estruturado (ainda não implementado no backend):**
```
POST /api/drivers/notifications
Authorization: Bearer {token}
Content-Type: application/json

{
  "type": "Rota Iniciada",
  "message": "Mensagem personalizada",
  "route_id": 1
}
```

---

### 6. ✅ Design Responsivo
- Todas as páginas adaptadas para mobile e tablet
- Layout fluido com max-width: 390px (padrão) para mobile
- Media queries para dispositivos maiores
- Componentes otimizados para toque
- Tipografia em Montserrat (fonte do design original)

---

## 🚀 Como Usar a Aplicação

### 1. Instalar Dependências
```bash
cd omnibus_mobile
npm install
```

### 2. Configurar Variáveis de Ambiente
Edite o arquivo `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_API_TIMEOUT=30000
```

### 3. Iniciar o Servidor de Desenvolvimento
```bash
npm run dev
```

Acesse: `http://localhost:3000`

### 4. Fluxo da Aplicação

#### Tela de Login
- URL: `/login`
- Email e senha do motorista (cadastrados pela secretaria no backend)
- Integração com `POST /api/drivers/login`

#### Dashboard
- URL: `/dashboard`
- Exibe rotas previstas para o motorista
- Permite cadastro de despesas
- Botão de logout (canto superior direito)

#### Detalhes da Rota
- URL: `/acompanharRota/[id]`
- Mapa interativo da rota
- Sistema para enviar notificações
- Informações de horário e distância

---

## 📁 Estrutura de Pastas

```
omnibus_mobile/
├── src/
│   ├── components/
│   │   └── MapComponent.tsx          # Componente de mapa reutilizável
│   ├── contexts/
│   │   └── AuthContext.tsx           # Contexto de autenticação global
│   ├── hooks/
│   │   └── useAuth.ts                # Hook customizado para autenticação
│   ├── services/
│   │   ├── api.ts                    # Serviço base de API com interceptors
│   │   ├── auth.ts                   # Serviço de autenticação
│   │   ├── routes.ts                 # Serviços de rotas e despesas
│   │   └── notifications.ts          # Serviço de notificações
│   └── types/
│       └── index.ts                  # Tipos TypeScript compartilhados
├── app/
│   ├── layout.tsx                    # Layout raiz com AuthProvider
│   ├── page.tsx                      # Home (pode redirecionar para login/dashboard)
│   ├── login/
│   │   └── page.tsx                  # Página de login com integração API
│   ├── dashboard/
│   │   └── page.tsx                  # Dashboard com rotas e despesas
│   └── acompanharRota/
│       └── [id]/
│           └── page.tsx              # Detalhes da rota com mapa e notificações
├── .env.local                        # Variáveis de ambiente
└── package.json
```

---

## 🔌 Endpoints Utilizados (Backend)

### Autenticação
```
POST /api/drivers/login
GET /api/drivers/me
POST /api/drivers/logout
```

### Rotas
```
GET /api/routes                        # Lista rotas (filtrada por driver_id)
GET /api/routes/{id}                   # Detalhes de uma rota
```

### Despesas/Gastos
```
GET /api/drivers/expenses              # Lista despesas do motorista
POST /api/drivers/expenses             # Cadastrar nova despesa
GET /api/drivers/expenses/{id}         # Detalhes de uma despesa
GET /api/drivers/expenses-monthly-total # Total mensal de despesas
```

### Notificações (Estrutura preparada, aguardando implementação no backend)
```
POST /api/drivers/notifications        # Enviar notificação
GET /api/drivers/notifications         # Listar notificações
GET /api/drivers/notifications/route/{id}  # Notificações por rota
```

---

## ⚙️ Recursos Adicionais

### Interceptadores de API
- Adiciona token automaticamente em todas as requisições
- Trata erros 401 (token expirado) redirecionando para login
- Trata erros de conexão com mensagens amigáveis

### Armazenamento Local
- Token: `localStorage.getItem('authToken')`
- Dados do motorista: `localStorage.getItem('driver')`

### Componentes Reutilizáveis
- `MapComponent`: Pode ser reutilizado em qualquer página que precisa de mapa

---

## 📝 Próximos Passos (Recomendações)

### No Backend (Laravel)
1. ✅ Garantir endpoints de autenticação (já existem)
2. ✅ Garantir endpoints de rotas filtradas por driver (já existem)
3. ✅ Garantir endpoints de despesas (já existem)
4. ⏳ **Implementar endpoints de notificações**
   - `POST /api/drivers/notifications` - Enviar notificação
   - `GET /api/drivers/notifications` - Listar notificações
   - Criar migration para tabela `notifications`
   - Criar model e controller

### No Mobile
1. ⏳ Integrar upload real de comprovantes (atualmente apenas estrutura)
2. ⏳ Implementar geolocalização em tempo real para o mapa
3. ⏳ Adicionar suporte a notificações push (FCM ou similar)
4. ⏳ Criar tela de histórico de despesas
5. ⏳ Adicionar filtros por período nas despesas

### Testes
1. ⏳ Adicionar testes unitários para serviços
2. ⏳ Adicionar testes de integração com API
3. ⏳ Testar em dispositivos reais (iOS/Android via Expo ou similar)

---

## 🐛 Troubleshooting

### "Erro de conexão com o servidor"
- Verificar se o backend está rodando em `http://localhost:8000`
- Verificar se a URL está correta em `.env.local`
- Verificar CORS no backend (Laravel)

### "Token expirado"
- Token será automaticamente limpo
- Usuário será redirecionado para `/login`
- Fazer login novamente

### Mapa não carrega
- Verificar conexão com internet (Leaflet carrega tiles do OpenStreetMap)
- Verificar console do navegador para erros de CSS do Leaflet

---

## 📞 Contato e Suporte

Para dúvidas sobre a integração, consulte:
- Backend API Docs: [API_DOCS.md](../Omnibus/API_DOCS.md)
- Estrutura do Backend: [Omnibus/](../Omnibus/)

---

**Status**: ✅ Pronto para desenvolvimento em produção
**Última atualização**: 02/05/2026
