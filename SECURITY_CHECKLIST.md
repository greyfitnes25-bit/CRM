# GreyCRM Security Checklist

## Why Chrome says "Not secure" locally

Chrome shows "No es seguro" when the app is opened with `http://10.0.0.7:3000`.
That address is a local development URL without an HTTPS certificate. It does not
mean the app was hacked, but it does mean traffic is not encrypted for visitors.

For client demos, use a deployed URL with HTTPS, for example:

```env
NEXTAUTH_URL="https://your-domain.com"
AUTH_URL="https://your-domain.com"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

Vercel provides HTTPS automatically for `*.vercel.app` domains and custom domains.

## Production requirements

- Use HTTPS only for public demos and production.
- Use a strong `NEXTAUTH_SECRET`, different from local development.
- Keep Supabase database credentials only in hosting environment variables.
- Do not commit `.env` files to Git.
- Enable Supabase Row Level Security before exposing direct client-side database access.
- Keep user roles scoped by company and role permissions.
- Rotate database passwords if they were shared in screenshots, chat, or logs.
- Require strong passwords for new accounts.
- Add rate limiting/WAF before public launch, especially on login and registration.
- Use separate demo data for clients.

## Headers already configured

The app sends production security headers from `next.config.js`:

- `Strict-Transport-Security` in production
- `Content-Security-Policy`
- `X-Content-Type-Options`
- `X-Frame-Options`
- `Referrer-Policy`
- `Permissions-Policy`
- `Cross-Origin-Opener-Policy`

## Local testing

Local HTTP URLs are acceptable only for development inside your own machine or Wi-Fi:

```text
http://localhost:3000
http://10.0.0.7:3000
```

Do not use those local URLs as client demo links.
