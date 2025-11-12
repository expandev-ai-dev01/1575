# TODO List - Backend API

Sistema de gerenciamento de tarefas - API REST

## Tecnologias

- Node.js
- TypeScript
- Express.js
- MS SQL Server
- Zod (validação)

## Estrutura do Projeto

```
src/
├── api/                    # API controllers
│   └── v1/                 # API version 1
│       ├── external/       # Public endpoints
│       └── internal/       # Authenticated endpoints
├── routes/                 # Route definitions
│   └── v1/                 # Version 1 routes
├── middleware/             # Express middleware
├── services/               # Business logic
├── utils/                  # Utility functions
├── constants/              # Application constants
├── instances/              # Service instances
├── config/                 # Configuration
└── server.ts               # Application entry point
```

## Configuração

1. Instalar dependências:
```bash
npm install
```

2. Configurar variáveis de ambiente:
```bash
cp .env.example .env
# Editar .env com suas configurações
```

3. Executar em desenvolvimento:
```bash
npm run dev
```

4. Build para produção:
```bash
npm run build
npm start
```

## Endpoints

### Health Check
- `GET /health` - Verifica status da API

### API v1
- Base URL: `/api/v1`
- External (público): `/api/v1/external`
- Internal (autenticado): `/api/v1/internal`

## Funcionalidades

- ✅ Estrutura base configurada
- ✅ Roteamento versionado
- ✅ Middleware de erro
- ✅ Validação com Zod
- ✅ Conexão com SQL Server
- ✅ CORS configurado
- ✅ Compressão de resposta
- ✅ Segurança com Helmet
- ⏳ Autenticação (a implementar)
- ⏳ Features de negócio (a implementar)

## Desenvolvimento

Este projeto segue os padrões definidos em `backend_architecture_rest.md` e `database_SQL_server_architecture.md`.

### Adicionando Novas Features

1. Criar estrutura de banco de dados em `database/functional/[entity]/`
2. Criar serviços em `src/services/[entity]/`
3. Criar controllers em `src/api/v1/internal/[entity]/`
4. Adicionar rotas em `src/routes/v1/internalRoutes.ts`

## Licença

ISC