# License Key Format

## Structure

License keys are self-contained and cryptographically signed, enabling offline validation.

```
LICENSE KEY FORMAT
─────────────────────────────────────────────────────────────────

Human-readable: VSL-XXXX-XXXX-XXXX-XXXX

Decoded structure (JSON):
{
  "v": 1,                           // Schema version
  "email": "user@example.com",      // Customer email
  "product": "variscout-lite",      // Product identifier
  "issued": "2026-01-03T12:00:00Z", // Issue timestamp
  "expires": "2027-01-03T12:00:00Z",// Expiry (null = lifetime)
  "paddle_sub": "sub_abc123",       // Paddle subscription ID
  "paddle_txn": "txn_xyz789",       // Paddle transaction ID
  "sig": "base64_signature..."      // RSA signature
}

Encoding: Base64URL(JSON) → formatted as VSL-XXXX-XXXX-XXXX-XXXX
```

---

## Key Generation (Server-side)

```javascript
// Cloudflare Worker
import { createSign } from 'crypto';

export function generateLicenseKey(data) {
  const payload = {
    v: 1,
    email: data.email,
    product: data.product,
    issued: new Date().toISOString(),
    expires: data.expires,
    paddle_sub: data.subscriptionId,
    paddle_txn: data.transactionId,
  };

  // Sign the payload
  const sign = createSign('RSA-SHA256');
  sign.update(JSON.stringify(payload));
  const signature = sign.sign(process.env.LICENSE_PRIVATE_KEY, 'base64');

  payload.sig = signature;

  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return formatLicenseKey(encoded);
}
```

---

## Validation (Client-side)

```javascript
// Runs in PWA browser, works OFFLINE
const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhki... (embedded in app, safe to expose)
-----END PUBLIC KEY-----`;

export async function validateLicense(licenseKey) {
  const decoded = decodeLicenseKey(licenseKey);
  const { sig, ...payload } = decoded;

  // Verify signature using Web Crypto API
  const isValid = await verifySignature(JSON.stringify(payload), sig, PUBLIC_KEY);

  if (!isValid) return { valid: false, reason: 'invalid_signature' };

  // Check expiry
  if (decoded.expires && new Date(decoded.expires) < new Date()) {
    return { valid: false, reason: 'expired' };
  }

  return { valid: true, email: decoded.email, expires: decoded.expires };
}
```

---

## See Also

- [OVERVIEW](./OVERVIEW.md) - Licensing overview
- [Activation API](./ACTIVATION-API.md) - How keys are issued
