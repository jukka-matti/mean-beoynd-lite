# Instant Activation Flow

> Part of [Licensing Architecture](./OVERVIEW.md)

**CRITICAL:** License is delivered directly to the PWA after Paddle checkout — no waiting for email.

---

## Instant Activation Flow

```
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
  Body: { transactionId: "txn_abc123" }
         │
         ▼
Server (Cloudflare Worker):
  1. Verify transaction with Paddle API ✓
  2. Generate signed license key (RSA-SHA256)
  3. Store in KV (idempotent by transactionId)
  4. Send backup email (async, don't wait)
  5. Return license to PWA
         │
         ▼
PWA stores in IndexedDB
         │
         ▼
✅ Activated! (2-3 seconds total)
```

---

## Why Instant Activation?

| Benefit           | How                                       |
| ----------------- | ----------------------------------------- |
| No email wait     | License returned directly to PWA          |
| No copy/paste     | Key stored automatically in IndexedDB     |
| Works immediately | Features unlock in 2 seconds              |
| Email as backup   | For new devices, still sent in background |

---

## PWA Integration: After Checkout

```javascript
// Called by Paddle.js successCallback
async function activateLicenseFromTransaction(transactionId) {
  const response = await fetch('https://api.variscout.com/license/activate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transactionId }),
  });

  if (!response.ok) {
    // Fallback: Ask user to check email
    return { success: false, fallback: 'Check your email for the license key' };
  }

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

## API Endpoints

### Location: Cloudflare Workers

Edge-deployed serverless functions for license management.

### Endpoints

| Method | Path                    | Purpose                                     |
| ------ | ----------------------- | ------------------------------------------- |
| `POST` | `/api/paddle/webhook`   | Handle Paddle subscription events           |
| `GET`  | `/api/license/validate` | Validate license key, return status         |
| `POST` | `/api/license/activate` | Activate license for email (after checkout) |

### POST /api/paddle/webhook

Handles subscription lifecycle events from Paddle:

```typescript
// Webhook events handled:
// - subscription.created → Create license record
// - subscription.updated → Update status/expiry
// - subscription.canceled → Mark as canceled (grace period)
// - subscription.past_due → Mark as past_due
```

**Security:** Verify Paddle webhook signature before processing.

### GET /api/license/validate

```
GET /api/license/validate?key=VSL-XXXX-XXXX-XXXX

Response:
{
  "valid": true,
  "status": "active",
  "expiresAt": "2025-12-30T00:00:00Z",
  "daysRemaining": 365
}
```

### POST /api/license/activate

Called after successful Paddle checkout to create license:

```
POST /api/license/activate
{
  "email": "user@example.com",
  "paddle_subscription_id": "sub_xxx"
}

Response:
{
  "license_key": "VSL-XXXX-XXXX-XXXX",
  "expiresAt": "2025-12-30T00:00:00Z"
}
```

---

## Database Schema (Vercel KV)

### Key Structure

```
license:{key}     → License record JSON
email:{email}     → License key (for lookups by email)
sub:{sub_id}      → License key (for webhook updates)
```

### License Record

```json
{
  "key": "VSL-A1B2-C3D4-E5F6",
  "email": "user@example.com",
  "paddle_subscription_id": "sub_xxx",
  "status": "active",
  "created_at": "2024-12-30T00:00:00Z",
  "expires_at": "2025-12-30T00:00:00Z",
  "updated_at": "2024-12-30T00:00:00Z"
}
```

### Status Values

| Status     | Meaning                                   |
| ---------- | ----------------------------------------- |
| `active`   | Subscription active, license valid        |
| `past_due` | Payment failed, in grace period           |
| `canceled` | Subscription canceled, valid until expiry |
| `expired`  | Subscription ended, license invalid       |

---

## Webhook Security

```typescript
// Verify Paddle webhook signature
import crypto from 'crypto';

function verifyPaddleSignature(rawBody: string, signature: string, secret: string): boolean {
  const expectedSignature = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
}
```

---

## See Also

- [OVERVIEW](./OVERVIEW.md) - Licensing architecture
- [License Key](./LICENSE-KEY.md) - Key format and validation
- [Hybrid Validation](./HYBRID-VALIDATION.md) - Cache strategy
