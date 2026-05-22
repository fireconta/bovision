# 🐄 BOVISION AI - Documentação Completa

**Visão Inteligente para a Nova Pecuária**

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura do Projeto](#arquitetura-do-projeto)
3. [Funcionalidades Principais](#funcionalidades-principais)
4. [Estrutura de Diretórios](#estrutura-de-diretórios)
5. [Banco de Dados](#banco-de-dados)
6. [APIs e Procedures tRPC](#apis-e-procedures-trpc)
7. [Autenticação](#autenticação)
8. [Temas e Design](#temas-e-design)
9. [Instalação e Setup](#instalação-e-setup)
10. [Deploy](#deploy)

---

## 🎯 Visão Geral

**BOVISION AI** é uma plataforma AgroTech completa para gestão inteligente de rebanhos bovinos. Utiliza inteligência artificial, análise de dados em tempo real e interface mobile profissional para otimizar a produção pecuária.

### Características Principais

- **PIN Login Seguro**: Autenticação com 6 dígitos e validação bancária
- **Dashboard Profissional**: Interface responsiva com sidebar dinâmica
- **Assistente IA**: Recomendações inteligentes com LLM (Gemini 2.5 Flash)
- **Gestão de Rebanho**: Cadastro, monitoramento e análise de animais
- **Saúde Animal**: Registros de temperatura, vacinações e diagnósticos
- **Relatórios Financeiros**: Controle de receitas e despesas
- **Exportação de Dados**: CSV para análises externas
- **Admin Panel**: Gestão de usuários e rebanhos

---

## 🏗️ Arquitetura do Projeto

```
BOVISION AI
├── Frontend (React 19 + Tailwind 4)
│   ├── Aplicativo.tsx (PIN Login)
│   ├── App.tsx (Dashboard Layout)
│   ├── Pages (8 módulos Agro)
│   └── Components (50+ componentes)
│
├── Backend (Express 4 + tRPC 11)
│   ├── Routers (16 procedures)
│   ├── Database (17 tabelas MySQL)
│   └── LLM Integration (Gemini 2.5 Flash)
│
└── Database (MySQL)
    ├── Users & Devices
    ├── Animals & Health
    ├── Financial Records
    └── Conversations
```

### Stack Tecnológico

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | React 19, Tailwind CSS 4, Framer Motion |
| **Backend** | Express 4, tRPC 11, Node.js |
| **Database** | MySQL (Manus) |
| **Auth** | PIN + Device ID + Session Storage |
| **LLM** | Google Gemini 2.5 Flash |
| **Testes** | Vitest (34 testes passando) |

---

## ✨ Funcionalidades Principais

### 1. **Autenticação com PIN** (/aplicativo)

- Tela ultra futurista com animações
- 6 dígitos com validação bancária (8 regras)
- Device ID único e persistente
- Session storage com expiração 8h
- Suporte a teclado físico

**Fluxo:**
```
Primeiro Acesso → Criar PIN → Confirmar PIN → Entrada
Acessos Futuros → Digitar PIN → Validar → Dashboard
```

### 2. **Dashboard** (/app)

- Sidebar responsivo (Desktop + Mobile)
- 8 módulos Agro com ícones
- 4 stats cards em tempo real
- Atividades recentes
- Top bar com busca e notificações

**Módulos:**
1. **Rebanho** - Gestão de animais
2. **Saúde** - Monitoramento de saúde
3. **Peso** - Histórico de pesagem
4. **Pastagem** - Gestão de piquetes
5. **Nutrição** - Planos alimentares
6. **Vacinação** - Calendário de vacinas
7. **Análises** - Gráficos e relatórios
8. **IA** - Assistente inteligente

### 3. **Assistente IA** (/app/ai)

- Chat estilo ChatGPT
- Integração com LLM (Gemini 2.5 Flash)
- Histórico de conversas persistente
- Recomendações sobre:
  - Manejo de rebanho
  - Nutrição e alimentação
  - Vacinação e saúde
  - Análises de produção

### 4. **Gestão de Rebanho** (/app/herd)

- Cadastro de animais (nome, raça, idade, peso)
- Filtros avançados por raça, idade, saúde
- Busca por nome ou ID
- Histórico de peso
- Registros de vacinação
- Estatísticas do rebanho

### 5. **Monitoramento de Saúde** (/app/health)

- Registros de temperatura
- Frequência cardíaca
- Frequência respiratória
- Score de saúde
- Diagnósticos IA
- Alertas automáticos

### 6. **Relatórios Financeiros** (/app/financial)

- Receitas e despesas
- Análise por categoria
- Cálculo de lucro e margem
- Exportação em CSV
- Gráficos de análise

### 7. **Painel Admin** (/admin)

- Overview de rebanhos
- Gráficos de acessos
- Gestão de usuários
- Ações: premium, bloquear, deletar
- Visualização de PIN

### 8. **Sistema de Notificações**

- Toast notifications (success, error, warning, info)
- Auto-dismiss customizável
- Integração em toda interface
- Alertas de vacinação
- Alertas de licença expirando

---

## 📁 Estrutura de Diretórios

```
bovision-ai/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Aplicativo.tsx (PIN Login)
│   │   │   ├── App.tsx (Dashboard)
│   │   │   ├── Admin.tsx (Admin Panel)
│   │   │   ├── Analytics.tsx
│   │   │   ├── Health.tsx
│   │   │   ├── AiAssistant.tsx
│   │   │   └── ... (8 módulos)
│   │   ├── components/
│   │   │   ├── DashboardApp.tsx
│   │   │   ├── NotificationContainer.tsx
│   │   │   ├── AIChatBox.tsx
│   │   │   ├── Map.tsx
│   │   │   └── ui/ (50+ componentes shadcn)
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useNotifications.ts
│   │   │   └── ...
│   │   ├── lib/
│   │   │   └── trpc.ts
│   │   ├── App.tsx (Rotas)
│   │   ├── main.tsx
│   │   └── index.css
│   ├── public/
│   └── index.html
│
├── server/
│   ├── routers/
│   │   ├── auth.ts (Autenticação)
│   │   ├── aiAssistant.ts (IA)
│   │   ├── conversations.ts (Histórico)
│   │   ├── herd.ts (Rebanho)
│   │   ├── financial.ts (Financeiro)
│   │   ├── export.ts (Exportação)
│   │   ├── payments.ts (Pagamento)
│   │   └── routers.ts (Agregador)
│   ├── db.ts (Query helpers)
│   └── storage.ts (S3)
│
├── drizzle/
│   ├── schema.ts (Definição de tabelas)
│   ├── migrations/ (SQL migrations)
│   └── relations.ts
│
├── shared/
│   ├── types.ts
│   └── const.ts
│
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
└── README.md
```

---

## 🗄️ Banco de Dados

### Tabelas Principais

#### **users**
```sql
- id (VARCHAR 36) - Primary Key
- email (VARCHAR 255) - Unique
- name (VARCHAR 255)
- role (ENUM: admin, user)
- pin_hash (VARCHAR 255)
- device_id (VARCHAR 255)
- created_at (BIGINT)
- updated_at (BIGINT)
```

#### **devices**
```sql
- id (VARCHAR 36) - Primary Key
- user_id (VARCHAR 36) - Foreign Key
- device_id (VARCHAR 255) - Unique
- created_at (BIGINT)
```

#### **animals**
```sql
- id (VARCHAR 36) - Primary Key
- user_id (VARCHAR 36) - Foreign Key
- name (VARCHAR 255)
- breed (VARCHAR 255)
- age (INT)
- weight (DECIMAL 10,2)
- health_score (INT)
- last_weight_date (BIGINT)
- created_at (BIGINT)
- updated_at (BIGINT)
```

#### **health_records**
```sql
- id (VARCHAR 36) - Primary Key
- animal_id (VARCHAR 36) - Foreign Key
- temperature (DECIMAL 5,2)
- heart_rate (INT)
- respiratory_rate (INT)
- notes (TEXT)
- recorded_at (BIGINT)
- created_at (BIGINT)
```

#### **vaccinations**
```sql
- id (VARCHAR 36) - Primary Key
- animal_id (VARCHAR 36) - Foreign Key
- vaccine_name (VARCHAR 255)
- vaccination_date (BIGINT)
- next_dose_date (BIGINT)
- notes (TEXT)
- created_at (BIGINT)
```

#### **financial**
```sql
- id (VARCHAR 36) - Primary Key
- user_id (VARCHAR 36) - Foreign Key
- type (ENUM: income, expense)
- category (VARCHAR 255)
- amount (DECIMAL 12,2)
- description (TEXT)
- date (BIGINT)
- created_at (BIGINT)
```

#### **conversations**
```sql
- id (VARCHAR 36) - Primary Key
- user_id (VARCHAR 36) - Foreign Key
- title (VARCHAR 255)
- created_at (BIGINT)
- updated_at (BIGINT)
```

#### **conversation_messages**
```sql
- id (VARCHAR 36) - Primary Key
- conversation_id (VARCHAR 36) - Foreign Key
- role (VARCHAR 50)
- content (TEXT)
- created_at (BIGINT)
```

### Índices de Performance

```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_animals_user_id ON animals(user_id);
CREATE INDEX idx_health_records_animal_id ON health_records(animal_id);
CREATE INDEX idx_vaccinations_animal_id ON vaccinations(animal_id);
CREATE INDEX idx_financial_user_id ON financial(user_id);
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversation_messages_conversation_id ON conversation_messages(conversation_id);
```

---

## 🔌 APIs e Procedures tRPC

### Auth Router (5 procedures)

```typescript
// Criar novo PIN
auth.createPin({ pin: string, confirmPin: string })

// Verificar PIN
auth.verifyPin({ pin: string, deviceId: string })

// Obter usuário atual
auth.me()

// Logout
auth.logout()

// Verificar sessão
auth.checkSession()
```

### AI Assistant Router (4 procedures)

```typescript
// Chat com IA
aiAssistant.chat({ message: string })

// Análise de rebanho
aiAssistant.analyzeHerd({ animalIds: string[] })

// Recomendações nutricionais
aiAssistant.getNutritionRecommendations({ animalId: string })

// Diagnóstico de saúde
aiAssistant.getHealthDiagnosis({ animalId: string })
```

### Herd Router (7 procedures)

```typescript
// Obter todos os animais
herd.getAll()

// Obter animal por ID
herd.getById({ id: string })

// Buscar animais
herd.search({ query: string })

// Filtrar animais
herd.filter({ breed?: string, ageMin?: number, ageMax?: number })

// Obter estatísticas
herd.getStats()

// Criar animal
herd.create({ name: string, breed: string, age: number, weight: number })

// Adicionar peso
herd.addWeight({ animalId: string, weight: number })

// Adicionar vacinação
herd.addVaccine({ animalId: string, vaccineName: string })
```

### Financial Router (4 procedures)

```typescript
// Obter registros financeiros
financial.getRecords({ type?: 'income' | 'expense' })

// Obter resumo financeiro
financial.getSummary()

// Adicionar registro
financial.addRecord({ type: 'income' | 'expense', category: string, amount: number })

// Deletar registro
financial.deleteRecord({ id: string })
```

### Conversations Router (5 procedures)

```typescript
// Obter todas as conversas
conversations.getAll()

// Obter conversa por ID
conversations.getById({ id: string })

// Criar conversa
conversations.create({ title: string })

// Adicionar mensagem
conversations.addMessage({ conversationId: string, role: string, content: string })

// Deletar conversa
conversations.delete({ id: string })
```

### Export Router (4 procedures)

```typescript
// Exportar animais em CSV
export.exportAnimals()

// Exportar financeiro em CSV
export.exportFinancial()

// Exportar estatísticas em CSV
export.exportHerdStats()

// Exportar resumo financeiro em CSV
export.exportFinancialSummary()
```

### Payments Router (2 procedures)

```typescript
// Gerar QR Code PIX
payments.generatePixQrCode({ amount: number, planId: string })

// Gerar código de boleto
payments.generateBoletoCode({ amount: number, planId: string })
```

---

## 🔐 Autenticação

### Fluxo de Autenticação

1. **Primeiro Acesso**
   - Usuário acessa `/aplicativo`
   - Sistema detecta ausência de PIN
   - Exibe tela de criação de PIN
   - Usuário digita 6 dígitos (validação: 8 regras)
   - Usuário confirma PIN
   - Device ID é gerado e salvo
   - Usuário é autenticado

2. **Acessos Futuros**
   - Usuário acessa `/aplicativo`
   - Sistema verifica se existe PIN salvo
   - Exibe tela de entrada
   - Usuário digita PIN
   - Sistema valida contra PIN salvo
   - Session é criada (8 horas)
   - Usuário é redirecionado ao dashboard

### Validação de PIN (8 Regras)

1. Deve ter exatamente 6 dígitos
2. Não pode ser sequência (123456, 654321)
3. Não pode ter 4+ dígitos iguais (111122)
4. Não pode ser data comum (010101, 121212)
5. Não pode ser todos iguais (111111)
6. Não pode ser padrão de teclado (123123)
7. Deve ter pelo menos 3 dígitos diferentes
8. Não pode ser PIN anterior (se houver)

### Session Storage

```javascript
// Armazenado no localStorage
{
  userId: "user-id",
  deviceId: "BV-XXXXXXXX",
  sessionToken: "token-xxx",
  expiresAt: 1716336000000 + (8 * 60 * 60 * 1000)
}
```

---

## 🎨 Temas e Design

### Paleta de Cores (Tema Agro)

| Cor | Hex | Uso |
|-----|-----|-----|
| **Emerald** | #10b981 | Primária (sucesso, ativo) |
| **Cyan** | #06b6d4 | Secundária (info, destaque) |
| **Amber** | #f59e0b | Avisos (warning) |
| **Red** | #ef4444 | Erros (danger) |
| **Slate** | #1e293b | Background |
| **White** | #ffffff | Texto principal |

### Design System

- **Typography**: Inter, Geist Sans
- **Spacing**: 4px base unit
- **Border Radius**: 8px, 12px, 16px
- **Shadows**: Glassmorphism com backdrop blur
- **Animations**: Framer Motion (300ms max)
- **Responsividade**: Mobile-first

### Componentes Principais

- **DashboardApp** - Layout com sidebar
- **AIChatBox** - Chat com streaming
- **Map** - Google Maps integrado
- **NotificationContainer** - Toast notifications
- **50+ shadcn/ui components** - UI padrão

---

## 🚀 Instalação e Setup

### Pré-requisitos

- Node.js 22.13.0
- pnpm 9.x
- MySQL 8.0+
- Git

### Instalação Local

```bash
# 1. Clonar repositório
git clone <repo-url>
cd bovision-ai

# 2. Instalar dependências
pnpm install

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais

# 4. Criar banco de dados
mysql -u root -p < DATABASE_BACKUP.sql

# 5. Executar migrações
pnpm drizzle-kit generate
pnpm drizzle-kit migrate

# 6. Iniciar servidor de desenvolvimento
pnpm dev

# 7. Acessar em http://localhost:3000
```

### Variáveis de Ambiente

```env
# Database
DATABASE_URL=mysql://user:password@localhost:3306/bovision_ai

# Auth
JWT_SECRET=seu-secret-key-aqui
OAUTH_SERVER_URL=https://api.manus.im

# LLM
BUILT_IN_FORGE_API_KEY=sua-api-key
BUILT_IN_FORGE_API_URL=https://api.manus.im/forge

# Frontend
VITE_APP_ID=seu-app-id
VITE_OAUTH_PORTAL_URL=https://manus.im/login
```

### Testes

```bash
# Rodar todos os testes
pnpm test

# Rodar testes específicos
pnpm test server/routers/auth.ts

# Coverage
pnpm test -- --coverage
```

---

## 📦 Deploy

### Deploy na Manus

1. **Criar checkpoint**
   ```bash
   # Via interface ou CLI
   ```

2. **Publicar**
   - Clique no botão "Publish" na interface
   - Selecione o checkpoint
   - Confirme o deploy

3. **Domínio**
   - Domínio automático: `bovisionai-t2vqu6st.manus.space`
   - Domínio customizado: Configure em Settings > Domains

### Deploy em Servidor Externo

```bash
# Build para produção
pnpm build

# Iniciar servidor
NODE_ENV=production node dist/server.js
```

### Variáveis de Produção

```env
NODE_ENV=production
DATABASE_URL=mysql://prod-user:prod-pass@prod-host:3306/bovision_ai
JWT_SECRET=prod-secret-key-muito-seguro
# ... outras variáveis
```

---

## 📊 Estatísticas do Projeto

| Métrica | Valor |
|---------|-------|
| **Linhas de Código** | ~5000+ |
| **Componentes** | 50+ |
| **Procedures tRPC** | 16 |
| **Tabelas DB** | 17 |
| **Testes** | 34 (100% passando) |
| **Páginas** | 23 rotas |
| **Animações** | 100+ efeitos |
| **Responsividade** | Mobile-first |

---

## 🐛 Troubleshooting

### Problema: PIN não funciona

**Solução:**
```bash
# Limpar localStorage
localStorage.clear()

# Verificar banco de dados
SELECT * FROM users WHERE email = 'seu-email';
```

### Problema: Dashboard não carrega

**Solução:**
```bash
# Verificar autenticação
curl -H "Cookie: session=..." http://localhost:3000/api/trpc/auth.me

# Reiniciar servidor
pnpm dev
```

### Problema: Erro de conexão com IA

**Solução:**
```bash
# Verificar API key
echo $BUILT_IN_FORGE_API_KEY

# Testar conexão
curl -H "Authorization: Bearer $BUILT_IN_FORGE_API_KEY" \
  https://api.manus.im/forge/health
```

---

## 📞 Suporte

Para dúvidas ou problemas:

1. Consulte a documentação em `/docs`
2. Verifique os logs em `.manus-logs/`
3. Abra uma issue no repositório
4. Contate o time de desenvolvimento

---

## 📄 Licença

BOVISION AI © 2026. Todos os direitos reservados.

---

**Última atualização:** 21 de Maio de 2026

**Versão:** 1.0.0

**Status:** ✅ Produção
