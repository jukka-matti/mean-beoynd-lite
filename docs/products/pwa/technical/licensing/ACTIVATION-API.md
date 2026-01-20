# Activation API

## Payment Provider: Paddle

### Why Paddle

| Feature                 | Benefit                           |
| ----------------------- | --------------------------------- |
| Merchant of Record      | Paddle handles VAT/tax globally   |
| Checkout overlay        | No redirect, stays on our site    |
| Subscription management | Auto-renewals, cancellations      |
| EU VAT handling         | Critical for selling from Finland |

---

## API Endpoints

| Endpoint                      | Purpose                                      |
| ----------------------------- | -------------------------------------------- |
| `POST /license/activate`      | Instant activation after Paddle checkout     |
| `POST /webhook/paddle`        | Handle subscription events (renewal, cancel) |
| `GET /license/lookup?email=x` | Support tool: resend license                 |

### POST /license/activate

Called by PWA immediately after successful Paddle checkout:

```
POST api.variscout.com/license/activate
{
  "transactionId": "txn_abc123"
}

Response:
{
  "license": "VSL-XXXX-XXXX-XXXX-XXXX",
  "email": "user@example.com",
  "expires": "2027-01-03T12:00:00Z"
}
```

### POST /webhook/paddle

Handles subscription lifecycle events:

```typescript
// Events handled:
// - subscription.activated → Create license record
// - subscription.canceled → Mark as canceled (grace period)
// - subscription.updated → Update expiry
```

---

## Environment Variables

```bash
# Paddle Configuration
PADDLE_VENDOR_ID=your_vendor_id
PADDLE_API_KEY=your_api_key
PADDLE_WEBHOOK_SECRET=your_webhook_secret
PADDLE_ENVIRONMENT=production

# License Generation
LICENSE_PRIVATE_KEY=your_rsa_private_key_base64
LICENSE_PUBLIC_KEY=your_rsa_public_key_base64
```

---

## See Also

- [OVERVIEW](./OVERVIEW.md) - Licensing overview
- [License Key](./LICENSE-KEY.md) - Key format
