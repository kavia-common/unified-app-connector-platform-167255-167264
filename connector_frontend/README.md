This is a [Next.js](https://nextjs.org) application implementing the Ocean Professional UI for a unified connector platform.

Features included:
- Modern chat UI with typeahead search suggestions
- Connector selector overlay
- Admin Integrations page (API Key management)
- OAuth flow UI (login initialization)
- Search and Create overlays
- Multi-tenant org context display in top bar
- API client modules integrated with backend endpoints

Getting Started
1. Install dependencies
   npm install

2. Configure backend base URL (optional)
   If the backend runs on a different origin, set:
   NEXT_PUBLIC_BACKEND_BASE_URL="http://localhost:8000"

3. Run the dev server
   npm run dev

App Structure
- src/app/page.tsx: Chat + overlays
- src/app/integrations: Admin integration management
- src/app/oauth: OAuth flow UI
- src/components: Reusable UI elements
- src/lib/api.ts: Backend API client

Notes
- Tenant and authorization header are mocked in src/lib/config.ts for demo. Replace with real auth/session in production.
- All API calls include x-tenant-id and authorization headers when available.
