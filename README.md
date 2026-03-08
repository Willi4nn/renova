# Renova

Sistema de gestão para estofadores e reformadores de móveis. Controle de clientes, serviços, custos e financeiro.

## Stack

**Backend**

- Node.js + Express + TypeScript
- Prisma ORM + PostgreSQL
- JWT via httpOnly cookies + refresh token
- Zod (validação), Helmet, rate limiting, bcryptjs

**Frontend**

- React + TypeScript + Vite
- Tailwind CSS
- Zustand (estado global), React Hook Form + Zod
- Recharts (gráficos), React Router, Axios

## Funcionalidades

- Autenticação completa (registro, login, logout, refresh)
- Gestão de clientes (CRUD)
- Gestão de serviços com cálculo automático de custos (tecido, espuma, mão de obra, frete, outros) e lucro líquido
- Rastreamento de status do serviço: `IN_PROGRESS → COMPLETED → DELIVERED → PAID`
- Painel financeiro com KPIs, histórico mensal e distribuição de custos por período

## Pré-requisitos

- Node.js 20+
- Docker + Docker Compose

## Setup

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp backend/.env.example .env
# Editar .env com suas credenciais

# 3. Subir o banco e rodar
npm run dev
```
