# GreyCRM Setup Guide

## Quick Start

### 1. Start PostgreSQL Database
Make sure PostgreSQL is running and create the database:
```bash
psql -U postgres -c "CREATE DATABASE greycrm;"
```

### 2. Run Database Migrations
```bash
npx prisma db push
```

### 3. Seed Demo Data
```bash
npm run seed
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Open Browser
Visit: http://localhost:3000

## Demo Login Credentials
- **Admin (Owner):** admin@greycrm.com / demo123
- **Admin:** laura@greycrm.com / demo123
- **Vendedor 1:** ana@greycrm.com / demo123
- **Vendedor 2:** carlos@greycrm.com / demo123
- **Técnico:** roberto@greycrm.com / demo123

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Prisma ORM + PostgreSQL
- NextAuth.js
- Recharts
- shadcn/ui components

## Available Routes
- `/login` - Login page
- `/register` - Company registration
- `/dashboard` - Main dashboard with analytics
- `/messages` - Inbox (coming soon)
- `/leads` - Sales pipeline (coming soon)
- `/customers` - Customer management (coming soon)
- `/products` - Product catalog (coming soon)
- `/quotes` - Quotations (coming soon)
- `/sales` - Sales tracking (coming soon)
- `/installations` - Installation management (coming soon)
- `/warranties` - Warranty management (coming soon)
- `/returns` - Returns management (coming soon)
- `/meta-ads` - Meta Ads integration (coming soon)
- `/web-forms` - Web forms (coming soon)
- `/settings` - Settings (coming soon)
