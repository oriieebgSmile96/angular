# Bareeq Al-Aeeq

Prestige interior atelier — a luxury interior-design brand experience built as three frontends that share one design language.

| App       | Stack                          | Purpose                                                              |
| --------- | ------------------------------ | -------------------------------------------------------------------- |
| `web/`    | Angular 21 + SCSS              | Marketing site with a 3-step consultation booking dialog             |
| `portal/` | Angular 21 + SCSS              | Signed-in client dashboard: timeline, approvals, progress invoice    |
| `mobile/` | Expo (React Native) + TypeScript | Collections, product detail, and consultation booking             |
| `shared/` | JSON design tokens + generator | Single source of truth for colour, type, spacing, and motion         |

Frontend only — no backend. Catalogues and the OTP flow are in-memory mocks behind service interfaces so a real API can replace them later.

## Getting started

```bash
npm install
npm run install:all
npm run tokens
```

```bash
npm run web       # http://localhost:4200
npm run portal    # http://localhost:4400
npm run mobile    # Expo Go / simulator
```

```bash
npm run check     # tokens, icons, lint, typecheck, tests
npm run clean     # build caches and generated artifacts
```

## Design tokens

Edit `shared/design-tokens/tokens.json` only, then regenerate:

```bash
npm run tokens
npm run tokens:check
```

| Generated file                   | Used by        |
| -------------------------------- | -------------- |
| `web/src/styles/_tokens.scss`    | Web SCSS / CSS |
| `portal/src/styles/_tokens.scss` | Portal SCSS    |
| `mobile/src/theme/tokens.ts`     | React Native   |

## Conventions

- **Tokens only** — no raw hex or magic spacing in component styles; use `$bq-*` / `tokens.*`
- **No lazy dialog imports** — import dialog classes at the top of the file; route `loadComponent` stays lazy
- **Signals** on Angular apps (`input`, `output`, `computed`, `signal`)
- **Private fields** use `#name`; dependencies via `inject()`
- **Service boundaries** for anything that would be a network call
