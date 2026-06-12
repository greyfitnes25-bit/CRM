# GreyCRM + Supabase

Esta guia deja el CRM listo para usar PostgreSQL en Supabase sin perder la base local.

## 1. Crear el proyecto en Supabase

1. Entra a https://supabase.com.
2. Crea un proyecto nuevo.
3. Guarda bien la password de la base de datos.
4. Espera a que el proyecto termine de crearse.

## 2. Copiar las conexiones

En Supabase ve a:

`Project Settings > Database > Connection string`

Necesitamos dos URLs:

- `DATABASE_URL`: para que la app se conecte durante uso normal.
- `DIRECT_URL`: para que Prisma pueda crear/actualizar tablas.

Ejemplo:

```env
DATABASE_URL="postgresql://postgres.PROJECT_REF:TU_PASSWORD@aws-0-region.pooler.supabase.com:5432/postgres?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://postgres:TU_PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres?sslmode=require"
```

Notas:

- Cambia `PROJECT_REF`, `TU_PASSWORD` y `region`.
- Mantén `sslmode=require`.
- No subas `.env` a GitHub.

## 3. Actualizar `.env`

En `.env`, cambia solo estas lineas:

```env
DATABASE_URL="TU_DATABASE_URL_DE_SUPABASE"
DIRECT_URL="TU_DIRECT_URL_DE_SUPABASE"
```

Deja `NEXTAUTH_URL`, `AUTH_URL` y `NEXT_PUBLIC_APP_URL` igual si sigues probando desde:

```env
http://10.0.0.7:3000
```

## 4. Crear las tablas en Supabase

Ejecuta:

```bash
npm run db:push
```

Esto usa `prisma/schema.prisma` para crear las tablas.

## 5. Cargar datos demo

Solo para demo o pruebas:

```bash
npm run seed
```

Importante: el seed borra y recrea datos demo. No lo uses en una base con clientes reales.

## 6. Probar conexion

Ejecuta:

```bash
node scripts/count-db.cjs
```

Si responde con conteos de `users`, `customers`, `leads`, etc., la conexion funciona.

## 7. Probar el CRM

Inicia el servidor:

```bash
npm run dev -- --hostname 0.0.0.0
```

Abre:

```text
http://10.0.0.7:3000
```

## Recomendacion

Para desarrollo podemos usar Supabase Free. Para empresas reales conviene pasar a un plan pago con backups, mas capacidad y mejores limites.
