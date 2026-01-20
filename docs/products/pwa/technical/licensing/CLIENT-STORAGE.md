# Client-Side License Storage

## Storage Location

Licenses are stored in IndexedDB using Dexie.js (same database as projects).

```javascript
// src/db/database.js
db.version(1).stores({
  settings: 'key',
  // ...
});

// License settings
{ key: 'license', value: 'VSL-XXXX-XXXX-XXXX-XXXX' }
{ key: 'licenseValidated', value: 1704288000000 }
{ key: 'licenseEmail', value: 'user@example.com' }
{ key: 'licenseExpires', value: '2027-01-03T12:00:00Z' }
```

---

## Activation Storage

After successful Paddle checkout:

```javascript
async function activateLicenseFromTransaction(transactionId) {
  const response = await fetch('https://api.variscout.com/license/activate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transactionId }),
  });

  const { license, email, expires } = await response.json();

  // Store in IndexedDB
  await db.settings.bulkPut([
    { key: 'license', value: license },
    { key: 'licenseValidated', value: Date.now() },
    { key: 'licenseEmail', value: email },
    { key: 'licenseExpires', value: expires },
  ]);

  return { success: true, email, expires };
}
```

---

## Validation Cache

For offline support, validation results are cached:

```typescript
interface CachedLicenseStatus {
  key: string;
  valid: boolean;
  status: 'active' | 'past_due' | 'canceled' | 'expired';
  expiresAt: string;
  cachedAt: string;
  daysRemaining: number;
}
```

### Cache Rules

| Scenario       | Action                           |
| -------------- | -------------------------------- |
| Online success | Use online result, update cache  |
| Offline        | Use cache if < 7 days old        |
| Cache expired  | Show "connect to verify" message |

---

## See Also

- [OVERVIEW](./OVERVIEW.md) - Licensing overview
- [Security](./SECURITY.md) - Security considerations
