# Credit Card Validator

Validates credit card numbers against the **Luhn checksum** on the backend, with live
feedback and card-network detection on the frontend.

| Valid | Invalid |
|-------|---------|
| ![Valid card](screenshots/valid.png) | ![Invalid card](screenshots/invalid.png) |

## Stack

React 19 · Vite · TypeScript (client) — Node · Express 5 · TypeScript (server) — axios —
Vitest + Supertest — npm workspaces.

## Setup

Node ≥ 18.

```bash
git clone https://github.com/sushruth31/engagedmd.git
cd engagedmd
npm install   # both workspaces
npm run dev   # API :3001 · UI :5173
```

`npm run build` · `npm test` (25 tests across both packages).

## API

`POST /api/validate` — body `{ "cardNumber": "4532 0151 1283 0366" }` (spaces/dashes accepted).

```json
{ "valid": true, "cardType": "Visa" }
{ "valid": false, "error": "Card number failed the Luhn checksum." }
```

`cardType`: Visa · Mastercard · Amex · Discover · Unknown. Liveness: `GET /health`.

## Design

- **Validation is backend-only** — per spec, and the right call: client checks never gate trust.
- **Luhn is a pure function**; sanitisation, structural rules, and card-type detection compose
  it inside a `CardValidator` service — each piece unit-tested in isolation.
- **One axios interceptor** normalizes every transport failure client-side; one Express
  `errorHandler` does the same server-side. Centralized, not scattered.
- **No database or auth** — intentionally out of scope, not overlooked.

## Extending

Built to grow without rework:

- **New endpoint** → add a router, mount it in `app.ts`; CORS + error handling already apply.
- **New validation rule** → one method in `CardValidator`.
- **New card network** → one line in `cardType.ts`.
- `buildApp()` is decoupled from startup, so the API is tested without binding a port
  (`app.test.ts`, via Supertest).

## Tests

`npm test` — Luhn checksum, card-type detection, the validation pipeline, and the HTTP layer
(`200 / 400 / 413 / malformed JSON / health`) via Supertest; plus frontend digit-formatting
and interceptor error-mapping.

## Structure

```
client/src/  App.tsx · apiClient.ts (axios + interceptor) · format.ts · types.ts
server/src/  index.ts (bootstrap) · app.ts (factory) · validateRoute.ts · errorHandler.ts
             cardValidator.ts · luhn.ts · cardType.ts · types.ts
```
