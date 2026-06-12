# Deploy GreyCRM en Vercel

## Variables de entorno

Configura estas variables en Vercel:

```env
DATABASE_URL="postgresql://postgres.ddbydvimhoqfmyctkgqj:rTZ%3Fee_R_g9xcKa@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require"
DIRECT_URL="postgresql://postgres.ddbydvimhoqfmyctkgqj:rTZ%3Fee_R_g9xcKa@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require"
NEXTAUTH_SECRET="agBKJq7ClyzNXx7Pj6Ef3TXbqJgEGXySP5bBooHOCc0"
AUTH_TRUST_HOST="true"
NEXT_PUBLIC_APP_NAME="GreyCRM"
```

Despues del primer deploy, Vercel dara un dominio parecido a:

```text
https://greycrm.vercel.app
```

Cuando tengas ese dominio, agrega tambien:

```env
NEXTAUTH_URL="https://TU-DOMINIO-DE-VERCEL"
AUTH_URL="https://TU-DOMINIO-DE-VERCEL"
NEXT_PUBLIC_APP_URL="https://TU-DOMINIO-DE-VERCEL"
```

## Build settings

Vercel normalmente detecta Next.js automaticamente.

- Framework: Next.js
- Install command: `npm install`
- Build command: `npm run build`
- Output: automatico

El proyecto incluye:

```json
"postinstall": "prisma generate"
```

Esto permite que Prisma Client se genere durante el deploy.

## Credenciales demo

```text
admin@greycrm.com
demo123
```

## Nota de seguridad

No subas `.env` a GitHub. Ya esta ignorado por `.gitignore`.
