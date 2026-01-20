# License Key Format and Validation

> Part of [Licensing Architecture](./OVERVIEW.md)

---

## Format: `VSL-XXXX-XXXX-XXXX`

- **Prefix:** `VSL-` (VariScout License)
- **Payload:** 8 alphanumeric characters (first two groups)
- **Checksum:** 4 characters (last group, derived from payload)

---

## Validation

```typescript
// Offline validation (checksum)
function isValidLicenseFormat(key: string): boolean {
  const pattern = /^VSL-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
  if (!pattern.test(key.toUpperCase())) return false;

  const parts = key.toUpperCase().split('-');
  const payload = parts[1] + parts[2];
  const checksum = parts[3];

  return checksum === calculateChecksum(payload);
}

// Online validation (subscription status + expiry)
async function checkLicense(key: string): Promise<LicenseStatus> {
  // Try online first
  // Fall back to cache if offline
  // Return status with expiry info
}
```

---

## Server-Side: License Generation (RSA Signature)

```javascript
// generateLicense.js - Cloudflare Worker

import { createSign } from 'crypto';

export function generateLicenseKey(data) {
  const payload = {
    v: 1,
    email: data.email,
    product: data.product, // 'variscout-lite' or 'variscout-excel'
    issued: new Date().toISOString(),
    expires: data.expires, // ISO string or null for lifetime
    paddle_sub: data.subscriptionId,
    paddle_txn: data.transactionId,
  };

  // Sign the payload (RSA-SHA256)
  const sign = createSign('RSA-SHA256');
  sign.update(JSON.stringify(payload));
  const signature = sign.sign(process.env.LICENSE_PRIVATE_KEY, 'base64');

  payload.sig = signature;

  // Encode to base64url, format as VSL-XXXX-XXXX-XXXX-XXXX
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return formatLicenseKey(encoded);
}
```

---

## Client-Side: License Validation (Web Crypto API)

```javascript
// licenseValidator.js - Runs in PWA (browser), works OFFLINE

const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhki... (embedded in app, safe to expose)
-----END PUBLIC KEY-----`;

export async function validateLicense(licenseKey) {
  try {
    const decoded = decodeLicenseKey(licenseKey);
    const { sig, ...payload } = decoded;

    // Verify signature using Web Crypto API
    const isValid = await verifySignature(JSON.stringify(payload), sig, PUBLIC_KEY);

    if (!isValid) return { valid: false, reason: 'invalid_signature' };

    // Check expiry
    if (decoded.expires && new Date(decoded.expires) < new Date()) {
      return { valid: false, reason: 'expired', expiredAt: decoded.expires };
    }

    return {
      valid: true,
      email: decoded.email,
      product: decoded.product,
      expires: decoded.expires,
      isLifetime: !decoded.expires,
    };
  } catch (error) {
    return { valid: false, reason: 'malformed' };
  }
}
```

---

## Security Considerations

### License Key Security

- Keys are generated server-side only
- Checksum prevents random guessing
- Online validation prevents key sharing (one subscription = one key)
- Keys tied to email for account recovery

### Data Privacy

- License keys stored in Vercel KV (encrypted at rest)
- No personal data stored except email
- Paddle handles all payment data (PCI compliant)
- No usage tracking or telemetry

---

## See Also

- [OVERVIEW](./OVERVIEW.md) - Licensing architecture
- [Activation](./ACTIVATION.md) - How licenses are created
- [Hybrid Validation](./HYBRID-VALIDATION.md) - Offline validation strategy
