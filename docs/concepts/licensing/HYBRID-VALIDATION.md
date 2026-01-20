# Hybrid Validation Strategy

> Part of [Licensing Architecture](./OVERVIEW.md)

The system supports offline-first usage while ensuring subscription validity.

---

## Validation Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      HYBRID VALIDATION FLOW                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  App Launch / License Check                                              │
│       │                                                                  │
│       ▼                                                                  │
│  ┌──────────────────────────────────────┐                               │
│  │  1. Try online validation             │                               │
│  │     GET /api/license/validate         │                               │
│  └──────────────────────────────────────┘                               │
│       │                                                                  │
│       ├─── Success ───────────────────────────────────────┐             │
│       │                                                   │             │
│       │    ┌────────────────────────────────────────────┐ │             │
│       │    │  2a. Cache result in localStorage          │ │             │
│       │    │      - License status                      │ │             │
│       │    │      - Expiry date                         │ │             │
│       │    │      - Cached timestamp                    │ │             │
│       │    └────────────────────────────────────────────┘ │             │
│       │                                                   │             │
│       │                                                   ▼             │
│       │                                         ┌────────────────────┐  │
│       │                                         │  Return: VALID     │  │
│       │                                         │  (with expiry)     │  │
│       │                                         └────────────────────┘  │
│       │                                                                  │
│       └─── Offline/Error ─────────────────────────────────┐             │
│                                                           │             │
│            ┌────────────────────────────────────────────┐ │             │
│            │  2b. Check localStorage cache              │ │             │
│            │      - Is cache < 7 days old?              │ │             │
│            │      - Is cached expiry in future?         │ │             │
│            └────────────────────────────────────────────┘ │             │
│                 │                                         │             │
│                 ├─── Cache valid ──▶ Return: VALID (cached)             │
│                 │                                                        │
│                 └─── Cache expired/missing ──▶ Return: NEEDS_ONLINE     │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Cache Structure (localStorage)

```typescript
interface CachedLicenseStatus {
  key: string;
  valid: boolean;
  status: 'active' | 'past_due' | 'canceled' | 'expired';
  expiresAt: string; // ISO date
  cachedAt: string; // ISO date when cached
  daysRemaining: number;
}

// Storage keys
const LICENSE_KEY = 'variscout_license'; // The license key itself
const LICENSE_CACHE = 'variscout_license_cache'; // Cached validation result
```

---

## Validation Rules

| Scenario       | Online Result   | Cache Age       | Action                              |
| -------------- | --------------- | --------------- | ----------------------------------- |
| Online success | Valid           | Any             | Use online result, update cache     |
| Online success | Invalid/Expired | Any             | Clear cache, downgrade to Community |
| Offline        | N/A             | < 7 days, valid | Use cache, show "offline" indicator |
| Offline        | N/A             | > 7 days        | Show "connect to verify" message    |
| Offline        | N/A             | No cache        | Community edition                   |

---

## Grace Periods

| Event                | Grace Period             |
| -------------------- | ------------------------ |
| Subscription expires | 7 days before downgrade  |
| Payment fails        | 14 days (Paddle default) |
| Offline cache        | 7 days validity          |

---

## See Also

- [OVERVIEW](./OVERVIEW.md) - Licensing architecture
- [License Key](./LICENSE-KEY.md) - Key format and validation
- [Activation](./ACTIVATION.md) - How licenses are created
