# Licensing UI Components

## Settings UI

### License Section States

**Community Edition (No License)**

```
┌─────────────────────────────────────────────────────────────┐
│  License                                                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Status: Community (Free)                                    │
│  Charts include "VariScout Lite" branding                    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Upgrade to remove branding                          │    │
│  │                                                      │    │
│  │  €49/year + VAT                                      │    │
│  │  • Remove chart branding                             │    │
│  │  • Support development                               │    │
│  │                                                      │    │
│  │  [Subscribe with Paddle]                             │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  Already have a license?                                     │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ VSL-____-____-____                                   │    │
│  └─────────────────────────────────────────────────────┘    │
│  [Activate]                                                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Licensed Edition (Active)**

```
┌─────────────────────────────────────────────────────────────┐
│  License                                                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Status: Licensed ✓                                          │
│  License: VSL-A1B2-C3D4-E5F6                                 │
│  Renewal: December 30, 2025 (365 days remaining)             │
│                                                              │
│  [Manage Subscription]  →  Opens Paddle customer portal      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Expiring Soon (< 30 days)**

```
┌─────────────────────────────────────────────────────────────┐
│  License                                                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ⚠️ Status: Licensed (Expiring Soon)                         │
│  License: VSL-A1B2-C3D4-E5F6                                 │
│  Expires: January 15, 2025 (16 days remaining)               │
│                                                              │
│  Your subscription will renew automatically.                 │
│  [Manage Subscription]                                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Paddle Checkout Integration

```tsx
import { initializePaddle, Paddle } from '@paddle/paddle-js';

// Initialize Paddle
const paddle = await initializePaddle({
  environment: 'production',
  token: 'your_client_token',
});

// Open checkout
function openCheckout() {
  paddle.Checkout.open({
    items: [{ priceId: 'pri_xxx', quantity: 1 }],
    successCallback: async data => {
      // Instant activation
      await activateLicenseFromTransaction(data.transactionId);
    },
  });
}
```

---

## See Also

- [OVERVIEW](./OVERVIEW.md) - Licensing overview
- [Client Storage](./CLIENT-STORAGE.md) - How licenses are stored
