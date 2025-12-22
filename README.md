# CRUD API

Simple full-stack project with an Express/Prisma API and a Next.js frontend.

## Quick Start

1. Backend

```bash
cd backend
npm install
npm run dev
```

2. Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment

Create `backend/.env` with:

```env
FRONTEND_URL=http://localhost:3000
PORT=8001
# If using Prisma (Postgres, etc.)
# DATABASE_URL="postgresql://user:pass@localhost:5432/db"
```

## Structure

- backend/ — API, Prisma, and uploads
- frontend/ — Next.js UI

See the subproject READMEs for more: [backend/README.md](backend/README.md), [frontend/README.md](frontend/README.md).
