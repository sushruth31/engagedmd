# Credit Card Validator

Validates credit card numbers with the **Luhn checksum** on the backend, with live feedback
and card-network detection in the UI.

| Valid                                | Invalid                                  |
| ------------------------------------ | ---------------------------------------- |
| ![Valid card](screenshots/valid.png) | ![Invalid card](screenshots/invalid.png) |

## Stack

React 19 · Vite · TypeScript (client) — Node · Express 5 · TypeScript (server) — axios ·
Vitest · Supertest · Testing Library — npm workspaces.

## Setup

Node ≥ 18.

```bash
git clone https://github.com/sushruth31/credit-card-validator.git
cd credit-card-validator
npm install
npm run dev   # API :3001 · UI :5173
```

`npm run build` · `npm test` (17 tests). Env config: `PORT`, `CORS_ORIGIN`, `VITE_API_URL`.

## API

`POST /api/validate` — body `{ "cardNumber": "4532 0151 1283 0366" }` (spaces and dashes allowed).

```json
{ "valid": true, "cardType": "Visa" }
{ "valid": false, "error": "Card number failed the Luhn checksum." }
```

A well-formed request returns `200` with validity in the body; a malformed one returns a `4xx`
with `{ valid, error, code }`. `cardType`: Visa · Mastercard · Amex · Discover · Unknown.

## Notes

- **Validation runs on the backend** (per spec) — the client only renders the result.
- **Luhn is a pure function**, composed inside a `CardValidator` service and tested in isolation.
- **No database or auth** — intentionally out of scope.
- Request/response types live in `shared/`, so the client and server can't drift.
