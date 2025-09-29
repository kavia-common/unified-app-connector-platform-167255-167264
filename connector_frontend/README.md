# Connector Frontend (Next.js 14)

Ocean Professional styled Next.js app for the connector platform.

## Quick Start

1. Copy .env.example to .env and set:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

2. Install and run:
```
npm install
npm run dev
```

3. Open http://localhost:3000

## Routes

- / — Overview
- /chat — Chat and LLM tools with typeahead (@jira_ / @confluence_)
- /connect — Connect Provider (OAuth and API Key)
- /projects — Projects list and quick actions (Jira)
- /spaces — Spaces list and actions (Confluence)
- /admin/connectors — Admin registry and token controls

## API

Set NEXT_PUBLIC_API_BASE_URL to your FastAPI backend. Expected endpoints:
- GET /oauth/login?provider=...
- POST /connect/{provider}/api-key
- POST /connect/{provider}/disconnect
- POST /connect/{provider}/refresh
- GET /projects
- GET /spaces
- POST /create
- GET /search
- POST /chat

All requests include credentials for cookie-based auth.
