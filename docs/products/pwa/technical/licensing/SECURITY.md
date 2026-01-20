# Licensing Security

## Cryptographic Protection

### RSA Signature

License keys are signed with RSA-SHA256:

- **Private key**: Server-side only (Cloudflare Worker environment)
- **Public key**: Embedded in PWA (safe to expose)

```javascript
// Server-side signing
const sign = createSign('RSA-SHA256');
sign.update(JSON.stringify(payload));
const signature = sign.sign(privateKey, 'base64');

// Client-side verification (Web Crypto API)
const isValid = await crypto.subtle.verify(
  { name: 'RSASSA-PKCS1-v1_5' },
  publicKey,
  signature,
  data
);
```

### Why RSA over HMAC?

| Feature             | RSA Signature | HMAC            |
| ------------------- | ------------- | --------------- |
| Client verification | ✅ Safe       | ❌ Leaks secret |
| Offline validation  | ✅ Yes        | ✅ Yes          |
| Key embedded in app | ✅ Safe       | ❌ Dangerous    |
| Forgery protection  | ✅ Strong     | ✅ Strong       |

---

## Webhook Security

```typescript
// Verify Paddle webhook signature
function verifyPaddleSignature(rawBody: string, signature: string, secret: string): boolean {
  const expectedSignature = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
}
```

---

## Data Privacy

| Data            | Storage Location | Notes                    |
| --------------- | ---------------- | ------------------------ |
| License key     | User's browser   | Never sent to our server |
| Email           | In license key   | Self-contained           |
| Payment data    | Paddle only      | PCI compliant            |
| Usage/telemetry | None             | No tracking              |

### GDPR Compliance

- **We don't store user data** - Paddle is merchant of record
- **License is self-contained** - No user database lookup needed
- **No tracking** - No analytics on license usage

---

## Key Security Measures

1. **Checksum validation** - Quick offline format check
2. **Signature verification** - Cryptographic authenticity
3. **Expiry check** - Time-based validity
4. **Transaction binding** - License tied to Paddle transaction
5. **Webhook verification** - Secure subscription updates

---

## See Also

- [OVERVIEW](./OVERVIEW.md) - Licensing overview
- [License Key](./LICENSE-KEY.md) - Key format
