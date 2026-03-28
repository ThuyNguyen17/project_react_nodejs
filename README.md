# Class Management

Monorepo structure:

- `client/`: React + Vite frontend
- `server/`: Node.js + Express + MongoDB backend

## Run in development

Install dependencies once:

```bash
npm install --prefix client
npm install --prefix server
```

Run both client and server:

```bash
npm run dev
```

Or run separately:

```bash
npm run dev:client
npm run dev:server
```
