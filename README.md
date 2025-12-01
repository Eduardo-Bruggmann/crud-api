Simple REST API for user management with CRUD.

## Requirements

- Node.js LTS
- npm or yarn
- Environment variables (.env)

## Setup

1. Clone the repository.
2. Install dependencies:
   - npm install
   - or yarn
3. Configure `.env`:
   - JWT_SECRET="yoursecret"
   - DATABASE_URL="postgresql://user:pass@host:port/db"
   - PORT=8080

## Run

- npm run dev
- npm run build
- npm run start

## Run Migrations

- npx prisma migrate deploy
- npx prisma generate
