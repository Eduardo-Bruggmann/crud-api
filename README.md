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
   - JWT_SECRET="yoursecrethere"
   - DATABASE_URL="database://your_user:your_password@your_host/database_name"
   - EMAIL_HOST="smtp.gmail.com"
   - EMAIL_PORT=465
   - EMAIL_USER="your-email@example.com"
   - EMAIL_APP_PASSWORD="your-app-password"
   - PORT=8001

## Run

- npm run dev
- npm run build
- npm run start

## Run Migrations

- npx prisma migrate deploy
- npx prisma generate

## Postman Workspace

https://app.getpostman.com/join-team?invite_code=245bc1377a6507e04f8e24b7f22e33d4d96e56105805a1ed9aaa5743dd5e60c5&target_code=06f1b71cbb97950ceca8676a8f2f3e8e