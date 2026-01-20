# PWA Licensing System

VaRiScout uses Paddle as merchant of record with **instant activation** and offline-capable license key validation. After payment, the PWA immediately retrieves the license — no waiting for email.

---

## Design Principles

```
✓ Instant activation: License issued immediately after payment
✓ Offline-first: License validation works without internet
✓ No user database: We don't store user data
✓ GDPR simple: Paddle is merchant of record
✓ Email as backup: License also sent via email for records
```

---

## Activation Flow

```
INSTANT ACTIVATION (Primary)
─────────────────────────────────────────────────────────────────

User clicks "Upgrade" in PWA
         │
         ▼
Paddle checkout overlay
         │
         ▼
User completes payment
         │
         ▼
Paddle returns success → { transactionId: "txn_abc123" }
         │
         ▼
PWA calls: POST api.variscout.com/license/activate
         │
         ▼
Server verifies + generates license
         │
         ▼
PWA stores in IndexedDB
         │
         ▼
✅ Activated! (2-3 seconds total)
```

---

## Related Documentation

- [License Key](./LICENSE-KEY.md) - Key format and structure
- [Activation API](./ACTIVATION-API.md) - API endpoints
- [Client Storage](./CLIENT-STORAGE.md) - IndexedDB storage
- [UI Components](./UI-COMPONENTS.md) - Settings UI
- [Security](./SECURITY.md) - Security considerations
