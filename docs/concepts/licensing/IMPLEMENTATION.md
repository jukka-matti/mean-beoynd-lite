# Implementation Details

> Part of [Licensing Architecture](./OVERVIEW.md)

---

## Purchase Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         SUBSCRIPTION PURCHASE FLOW                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  1. User in PWA or Excel Add-in                                         │
│       │                                                                  │
│       ▼                                                                  │
│  ┌──────────────────────────────────────┐                               │
│  │  Settings → License → "Subscribe"    │                               │
│  │                                       │                               │
│  │  Shows: €99/year + VAT               │                               │
│  │  Button: [Subscribe with Paddle]     │  (PWA)                        │
│  └──────────────────────────────────────┘                               │
│       │                                                                  │
│       │ User clicks Subscribe                                            │
│       ▼                                                                  │
│  ┌──────────────────────────────────────┐                               │
│  │  2. Paddle.js Checkout Overlay       │                               │
│  │                                       │                               │
│  │  • Email                             │                               │
│  │  • Payment method (card/PayPal/etc)  │                               │
│  │  • VAT handled automatically         │                               │
│  │  • Regional pricing shown            │                               │
│  └──────────────────────────────────────┘                               │
│       │                                                                  │
│       │ Payment successful                                               │
│       ▼                                                                  │
│  ┌──────────────────────────────────────┐     ┌──────────────────────┐  │
│  │  3. Paddle sends webhook             │────▶│ /api/paddle/webhook  │  │
│  │     subscription.created             │     │                      │  │
│  └──────────────────────────────────────┘     │ • Generate key       │  │
│                                               │ • Store in Vercel KV │  │
│                                               │ • Link to sub ID     │  │
│                                               └──────────────────────┘  │
│       │                                                                  │
│       │ Paddle checkout success callback                                 │
│       ▼                                                                  │
│  ┌──────────────────────────────────────┐                               │
│  │  4. App calls /api/license/activate  │                               │
│  │     with email from checkout         │                               │
│  │                                       │                               │
│  │  Response: { license_key: "VSL-..." }│                               │
│  └──────────────────────────────────────┘                               │
│       │                                                                  │
│       │ Auto-fill or user enters key                                     │
│       ▼                                                                  │
│  ┌──────────────────────────────────────┐                               │
│  │  5. License Activated                 │                               │
│  │                                       │                               │
│  │  • Key stored in localStorage        │                               │
│  │  • Branding removed                  │                               │
│  │  • Subscription status shown         │                               │
│  │  • Renewal date displayed            │                               │
│  └──────────────────────────────────────┘                               │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Settings UI

### License Section (PWA & Excel Add-in)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  License                                                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─ COMMUNITY EDITION (No License) ───────────────────────────────────┐ │
│  │                                                                     │ │
│  │  Status: Community (Free)                                          │ │
│  │  Charts include "VariScout Lite" branding                          │ │
│  │                                                                     │ │
│  │  ┌─────────────────────────────────────────────────────────────┐   │ │
│  │  │  Upgrade to remove branding                                  │   │ │
│  │  │                                                              │   │ │
│  │  │  €99/year + VAT                                              │   │ │
│  │  │  • Remove chart branding                                     │   │ │
│  │  │  • Support development                                       │   │ │
│  │  │  • License for this app only                                 │   │ │
│  │  │                                                              │   │ │
│  │  │  [Subscribe with Paddle]  (PWA)                              │   │ │
│  │  │  [Get on AppSource]       (Excel)                            │   │ │
│  │  └─────────────────────────────────────────────────────────────┘   │ │
│  │                                                                     │ │
│  │  Already have a license?                                           │ │
│  │  ┌─────────────────────────────────────────────────────────────┐   │ │
│  │  │ VSL-____-____-____                                          │   │ │
│  │  └─────────────────────────────────────────────────────────────┘   │ │
│  │  [Activate]                                                        │ │
│  │                                                                     │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌─ LICENSED EDITION (Active Subscription) ───────────────────────────┐ │
│  │                                                                     │ │
│  │  Status: Licensed ✓                                                │ │
│  │  License: VSL-A1B2-C3D4-E5F6                                       │ │
│  │  Renewal: December 30, 2025 (365 days remaining)                   │ │
│  │                                                                     │ │
│  │  [Manage Subscription]  →  Opens Paddle customer portal            │ │
│  │                                                                     │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌─ EXPIRING SOON (< 30 days) ────────────────────────────────────────┐ │
│  │                                                                     │ │
│  │  ⚠️ Status: Licensed (Expiring Soon)                               │ │
│  │  License: VSL-A1B2-C3D4-E5F6                                       │ │
│  │  Expires: January 15, 2025 (16 days remaining)                     │ │
│  │                                                                     │ │
│  │  Your subscription will renew automatically.                       │ │
│  │  [Manage Subscription]                                             │ │
│  │                                                                     │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Files to Create/Modify

### New Files

| File                               | Purpose                     |
| ---------------------------------- | --------------------------- |
| `apps/pwa/api/paddle/webhook.ts`   | Paddle webhook handler      |
| `apps/pwa/api/license/validate.ts` | License validation endpoint |
| `apps/pwa/api/license/activate.ts` | License activation endpoint |

### Modified Files

| File                                                    | Changes                                                        |
| ------------------------------------------------------- | -------------------------------------------------------------- |
| `packages/core/src/license.ts`                          | Add `checkLicense()`, `cacheLicenseStatus()`, expiration logic |
| `packages/core/src/types.ts`                            | Add `LicenseStatus`, `CachedLicenseStatus` interfaces          |
| `apps/pwa/src/components/SettingsModal.tsx`             | Subscription UI section                                        |
| `apps/excel-addin/src/taskpane/components/Settings.tsx` | Subscription UI section                                        |
| `apps/pwa/package.json`                                 | Add `@vercel/kv` dependency                                    |

---

## Implementation Phases

### Phase 1: Backend Setup

1. Create `/api/paddle/webhook.ts`
2. Create `/api/license/validate.ts`
3. Create `/api/license/activate.ts`
4. Set up Vercel KV storage
5. Add environment variables

### Phase 2: Core License Updates

1. Add `LicenseStatus` interface to types
2. Update `license.ts` with online validation
3. Implement caching logic
4. Add expiration handling

### Phase 3: Paddle Configuration

1. Create Paddle account
2. Create product "VariScout Pro"
3. Configure webhooks
4. Test in sandbox mode

### Phase 4: UI Updates

1. Update PWA Settings with subscription UI
2. Update Excel Add-in Settings
3. Add Paddle.js checkout integration
4. Implement expiration warnings

### Phase 5: Testing & Launch

1. End-to-end purchase flow testing
2. Offline validation testing
3. Webhook event testing
4. Production deployment

---

## See Also

- [OVERVIEW](./OVERVIEW.md) - Licensing architecture
- [Billing Channels](./BILLING-CHANNELS.md) - Paddle, AppSource details
- [Activation](./ACTIVATION.md) - API endpoints
