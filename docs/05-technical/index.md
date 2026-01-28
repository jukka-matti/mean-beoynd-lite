# Technical Documentation

Technical specifications for VariScout implementation. These documents are designed to be used by developers (human or AI) building the product.

---

## Architecture Overview

```
VARISCOUT ARCHITECTURE
─────────────────────────────────────────────────────────────────

┌─────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                    REACT APPLICATION                       │ │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐      │ │
│  │  │ I-Chart │  │ Boxplot │  │ Pareto  │  │Capability│      │ │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘      │ │
│  │                      │                                     │ │
│  │                      ↓                                     │ │
│  │              ┌───────────────┐                            │ │
│  │              │ Analysis Core │ (statistics, calculations)  │ │
│  │              └───────────────┘                            │ │
│  └───────────────────────────────────────────────────────────┘ │
│                           │                                     │
│                           ↓                                     │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                      IndexedDB                             │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                │ │
│  │  │ Projects │  │ Settings │  │ License  │                │ │
│  │  └──────────┘  └──────────┘  └──────────┘                │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                   Service Worker                           │ │
│  │              (offline caching, PWA)                        │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ (only for license activation)
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                         EXTERNAL                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐        ┌─────────────────┐               │
│  │     Paddle      │        │  Webhook API    │               │
│  │   (payments)    │───────→│ (license gen)   │               │
│  └─────────────────┘        └─────────────────┘               │
│                                      │                          │
│                                      ↓                          │
│                             ┌─────────────────┐               │
│                             │  Email (Resend) │               │
│                             │  License key    │               │
│                             └─────────────────┘               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Sections

<div class="grid cards" markdown>

- :material-source-branch:{ .lg .middle } **Architecture**

  ***

  Monorepo structure, offline-first design, shared packages

  [:octicons-arrow-right-24: Architecture](architecture/monorepo.md)

- :material-rocket-launch:{ .lg .middle } **Implementation**

  ***

  Deployment, testing strategy, data input handling

  [:octicons-arrow-right-24: Implementation](implementation/deployment.md)

- :material-puzzle:{ .lg .middle } **Integrations**

  ***

  Embed messaging, shared UI strategy

  [:octicons-arrow-right-24: Integrations](integrations/embed-messaging.md)

</div>

---

## Key Technical Decisions

| Decision                 | Choice            | Rationale                             |
| ------------------------ | ----------------- | ------------------------------------- |
| No backend for user data | Client-only       | GDPR simplicity, no hosting costs     |
| IndexedDB for storage    | Dexie.js          | Large data support, async, persistent |
| License validation       | Signed keys       | Offline-capable, no server roundtrip  |
| Payment provider         | Paddle            | VAT handling, merchant of record      |
| Hosting                  | Vercel/Cloudflare | Static files, edge caching            |

See [Architecture Decision Records](../07-decisions/index.md) for detailed rationale.

---

## Development Setup

```bash
# Clone repo
git clone https://github.com/your-org/variscout-lite.git
cd variscout-lite

# Install dependencies
pnpm install

# Development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

---

## Quick Reference

```bash
pnpm dev             # PWA dev server (localhost:5173)
pnpm dev:excel       # Excel Add-in dev server (localhost:3000)
pnpm --filter @variscout/azure-app dev  # Azure app dev server

pnpm build           # Build all packages and apps
pnpm test            # Run Vitest tests (all packages)
```
