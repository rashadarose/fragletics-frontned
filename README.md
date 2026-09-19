# Fragletics Frontend

Simple React e-commerce frontend for Fragletics using Vite.

## Setup

```bash
npm install
npm run dev
```

Development server runs on http://localhost:3000

## Build

```bash
npm run build
```

## Deployment

Built files in `dist/` can be deployed to AWS S3 with CloudFront or any static hosting.

## Environment

If you want the Stripe checkout return flow to work locally, set the backend environment variable `FRONTEND_URL=http://localhost:3000`.
