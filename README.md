# WYD Companion

Companion app para WYD Global — rastreie seu personagem, gerencie suas dailies e planeje seus recursos.

> ⚠️ Este projeto não é afiliado à Raid Hut, JoyImpact ou qualquer publisher oficial do WYD. É um projeto open source criado pela comunidade. Nunca utilize as mesmas credenciais do jogo nesta plataforma.

## Features (MVP)

- Daily checklist com reset automático à meia-noite (horário de Brasília)
- Tracker de personagem com abas Selo, Conta e Itens
- Suporte a todos os tipos de equipamento: Mortal, Arch, Celestial, RD e Bahamut
- Ciclo de check-in de 14 dias
- Tarefas de guild condicionais por dia da semana
- Multi-personagens por conta

## Stack

- Backend: NestJS + TypeScript
- Frontend: React + Vite + TypeScript
- Banco: PostgreSQL via Prisma ORM
- Auth: JWT com access token (15min) + refresh token (7 dias)
- Infra: Docker Compose

## Arquitetura

Clean Architecture com 4 camadas:

- domain: entidades e regras de negócio puras
- application: use cases e ports (interfaces)
- infrastructure: Prisma, JWT, bcrypt
- interface: controllers REST e guards

## Como rodar localmente

Pré-requisitos: Node.js 18+ e Docker

1. Clone o repositório e entre na pasta
2. Copie o .env: cp .env.example .env
3. Suba o banco: docker-compose up -d postgres
4. Backend: cd backend && npm install && npx prisma migrate dev --name init && npm run start:dev
5. Frontend (novo terminal): cd frontend && npm install && npm run dev

Backend: http://localhost:3001
Frontend: http://localhost:5173
