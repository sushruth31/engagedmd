# Credit Card Validator

A full-stack credit card validator that checks card numbers against the **Luhn checksum
algorithm** on the backend and reports validity and card type in real time.

## Tech Stack

| Layer    | Tooling                                        |
| -------- | ---------------------------------------------- |
| Frontend | React 19, TypeScript, Vite                     |
| Backend  | Node.js, Express 5, TypeScript                 |
| Tests    | Vitest                                         |
| Tooling  | npm workspaces (no extra monorepo tooling)     |

## Setup

Requires Node.js ≥ 18.

```bash
git clone https://github.com/sushruth31/engagemd.git
cd engagemd
npm install      # installs both workspaces
npm run dev      # API on :3001, UI on http://localhost:5173
```

The Vite dev server proxies `/api` to the backend, so the frontend uses relative URLs and
there is no CORS friction during development.

### Other scripts

```bash
npm run build    # type-check + build both packages
npm test         # run the backend test suite
```

## API

### `POST /api/validate`

**Request**

```json
{ "cardNumber": "4532 0151 1283 0366" }
```

Spaces and dashes are accepted — the server sanitizes the input before validating.

**Response**

```json
{ "valid": true, "cardType": "Visa" }
```

When a number is rejected, the response includes a human-readable reason:

```json
{ "valid": false, "error": "Card number failed the Luhn checksum." }
```

| Field      | Type      | Notes                                                       |
| ---------- | --------- | ----------------------------------------------------------- |
| `valid`    | `boolean` | Whether the number passed every check.                      |
| `cardType` | `string?` | `Visa` · `Mastercard` · `Amex` · `Discover` · `Unknown`.    |
| `error`    | `string?` | Present only when `valid` is `false`.                       |

Validation runs in order: digits-only → length 13–19 → not all zeros → Luhn checksum.

## Design Decisions

- **Validation lives on the backend.** The spec requires it, and it mirrors production
  reality: client-side checks are a UX nicety, never a source of truth. The frontend only
  displays the verdict the server returns.
- **Luhn is a pure, dependency-free function.** `isValidLuhn` takes a digit string and
  returns a boolean — no side effects, trivially testable, and droppable into any project.
- **Checksum and business rules are separated.** `luhn.ts` answers only "does this satisfy
  the checksum?"; `validate.ts` owns format, length, and all-zeros rules plus card-type
  detection. This is why `isValidLuhn("0000…")` is `true` (it *does* satisfy Luhn) while the
  API correctly rejects all-zeros — the concerns are distinct and tested separately.
- **Real-time, debounced validation.** Results appear ~400 ms after typing stops — no submit
  button, no wait-for-click. Better UX with one `useState`-driven hook and no state library.
- **No database or authentication.** Intentionally excluded per the spec — there is no state
  to persist and nothing to protect. Adding either would be scope creep, not robustness.
- **Card-type detection was added.** ~12 lines of prefix matching delivers visible value the
  brief didn't strictly require, without pulling in a dependency.
- **npm workspaces, not monorepo tooling.** Two packages and a single `npm install` is the
  right-sized choice; Nx/Turborepo would be ceremony for a two-package project.
- **TypeScript strict everywhere, zero `any`.** Both packages compile under `strict` with
  no unused locals or parameters.

## Project Structure

```
credit-card-validator/
├── client/                 # React + Vite frontend
│   └── src/
│       ├── App.tsx         # input + live result (single component, useState)
│       ├── api.ts          # validateCard() — the entire API layer
│       └── format.ts       # groups digits by fours while typing
└── server/                 # Express API
    └── src/
        ├── index.ts        # one route: POST /api/validate
        ├── luhn.ts         # pure Luhn checksum
        ├── cardType.ts     # prefix-based card-network detection
        ├── validate.ts     # sanitize + rules + checksum pipeline
        └── *.test.ts       # Vitest coverage for the checksum and the pipeline
```

## Testing

The backend test suite (`npm test`) covers the Luhn checksum primitive and the full
validation pipeline: valid numbers for each network, formatting with spaces/dashes, and
every rejection path (non-numeric, empty, out-of-range length, all zeros, failed checksum).
