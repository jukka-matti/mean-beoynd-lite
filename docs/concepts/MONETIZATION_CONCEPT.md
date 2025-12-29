# Concept: VariScout Excel Add-in Monetization

**Status:** Concept / Planning
**Date:** December 2024
**Author:** Product Team

---

## Overview

Two complementary monetization approaches for the VariScout Excel add-in:

1. **Paddle** - License key sales via your website (individuals + SMEs)
2. **Microsoft Transactable SaaS** - Enterprise purchases via AppSource (future)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Dual Monetization Strategy                                             │
│                                                                         │
│  ┌───────────────────────────────┐  ┌───────────────────────────────┐  │
│  │  Path A: Paddle               │  │  Path B: Microsoft SaaS       │  │
│  │  (Start Here)                 │  │  (Add Later)                  │  │
│  │                               │  │                               │  │
│  │  • Individual users           │  │  • Enterprise buyers          │  │
│  │  • SMEs worldwide             │  │  • Work/school accounts       │  │
│  │  • One-time €39-49            │  │  • Buy in AppSource           │  │
│  │  • Your website checkout      │  │  • Microsoft bills them       │  │
│  │  • You keep ~95% revenue      │  │  • Requires SaaS backend      │  │
│  │  • Minimal backend needed     │  │  • Set up in 2-3 weeks        │  │
│  └───────────────────────────────┘  └───────────────────────────────┘  │
│                                                                         │
│  Both paths serve the same Excel add-in from AppSource                 │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Path A: Paddle (Recommended Start)

### Why Paddle?

| Feature | Benefit |
|---------|---------|
| Merchant of Record | Handles VAT, sales tax, compliance globally |
| Chargeback Protection | Paddle handles disputes |
| Global Payments | 200+ countries, local payment methods |
| Subscription Support | Can switch to yearly later if desired |
| No Monthly Fees | Only pay when you sell |

### Paddle Pricing

| Fee | Amount |
|-----|--------|
| Transaction fee | **5% + $0.50** per sale |
| Setup fee | $0 |
| Monthly fee | $0 |

On a €39 sale: ~€2.45 fee → you keep ~€36.55 (~94%)

### License Key Strategy with Paddle

Paddle offers three fulfillment methods. For VariScout, **Option 1** is recommended:

#### Option 1: Webhook + Your License Generator (Recommended)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Paddle Webhook Flow                                                    │
│                                                                         │
│  1. Customer pays via Paddle checkout                                   │
│                    │                                                    │
│                    ▼                                                    │
│  2. Paddle calls your webhook: POST /api/paddle-webhook                │
│                    │                                                    │
│                    ▼                                                    │
│  3. Your server generates license key (using existing license.ts)      │
│                    │                                                    │
│                    ▼                                                    │
│  4. Return license key in webhook response                             │
│                    │                                                    │
│                    ▼                                                    │
│  5. Paddle emails license key to customer                              │
│     + Shows on order confirmation page                                 │
│                    │                                                    │
│                    ▼                                                    │
│  6. Customer enters key in Excel add-in → Branding removed             │
└─────────────────────────────────────────────────────────────────────────┘
```

**Backend needed:** Simple serverless function (Vercel/Netlify/Azure Function)

```typescript
// api/paddle-webhook.ts (Vercel serverless function)
import { generateLicenseKey } from '../lib/license';

export default async function handler(req, res) {
  // Verify Paddle signature (security)
  const signature = req.headers['paddle-signature'];
  if (!verifyPaddleSignature(req.body, signature)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const { alert_name, passthrough, email } = req.body;

  if (alert_name === 'payment_succeeded') {
    // Generate license using your existing logic
    const licenseKey = generateLicenseKey();

    // Optionally store in database for records
    // await db.licenses.create({ key: licenseKey, email, createdAt: new Date() });

    // Return to Paddle - this gets emailed to customer
    return res.status(200).json({
      license_key: licenseKey,
    });
  }

  return res.status(200).json({ received: true });
}
```

#### Option 2: License List (Simpler, Less Flexible)

Pre-generate license keys and upload to Paddle:

1. Generate 100 keys using `generateLicenseKey()`
2. Save to `licenses.txt` (one per line)
3. Upload to Paddle product settings
4. Paddle picks one per sale and emails it

**Pros:** No backend needed
**Cons:** Must manually refill, can't track who got which key

#### Option 3: Keygen.sh Integration (Enterprise)

Use [Keygen.sh](https://keygen.sh/integrate/paddle/) for advanced licensing:
- Device limits
- Feature flags
- Subscription tiers
- Usage tracking

**Pros:** Professional licensing system
**Cons:** Additional cost ($49-299/month), more complexity

### Recommended: Option 1 with Existing License Logic

You already have `src/lib/license.ts` with:
- `generateLicenseKey()` - Creates VSL-XXXX-XXXX-XXXX format
- `isValidLicenseFormat()` - Validates with checksum
- `hasValidLicense()` - Checks localStorage

This works perfectly with Paddle webhooks. Just deploy a simple function to generate keys on purchase.

---

## Purchase Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Complete Purchase Journey                                              │
│                                                                         │
│  ┌────────────────────┐                                                │
│  │  AppSource         │                                                │
│  │  User finds add-in │                                                │
│  │  Downloads FREE    │                                                │
│  └─────────┬──────────┘                                                │
│            │                                                            │
│            ▼                                                            │
│  ┌────────────────────┐                                                │
│  │  Excel Add-in      │                                                │
│  │  Free with branding│                                                │
│  │                    │                                                │
│  │  User clicks       │                                                │
│  │  "Buy License"     │                                                │
│  └─────────┬──────────┘                                                │
│            │                                                            │
│            ▼                                                            │
│  ┌────────────────────┐                                                │
│  │  variscout.com/buy │                                                │
│  │                    │                                                │
│  │  Paddle Checkout   │                                                │
│  │  €39 one-time      │                                                │
│  │                    │                                                │
│  │  Card / PayPal /   │                                                │
│  │  Apple Pay / etc   │                                                │
│  └─────────┬──────────┘                                                │
│            │                                                            │
│            ▼                                                            │
│  ┌────────────────────┐     ┌────────────────────┐                    │
│  │  Paddle            │────▶│  Your Webhook      │                    │
│  │  Payment success   │     │  Generates key     │                    │
│  └─────────┬──────────┘     └─────────┬──────────┘                    │
│            │                          │                                │
│            │◀─────────────────────────┘                                │
│            │  Returns: VSL-XXXX-XXXX-XXXX                              │
│            ▼                                                            │
│  ┌────────────────────┐                                                │
│  │  Email to Customer │                                                │
│  │                    │                                                │
│  │  "Your license:    │                                                │
│  │   VSL-A1B2-C3D4-   │                                                │
│  │   E5F6"            │                                                │
│  └─────────┬──────────┘                                                │
│            │                                                            │
│            ▼                                                            │
│  ┌────────────────────┐                                                │
│  │  Excel Add-in      │                                                │
│  │  Settings → License│                                                │
│  │                    │                                                │
│  │  Enter key → Done! │                                                │
│  │  Branding removed  │                                                │
│  └────────────────────┘                                                │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Path B: Microsoft Transactable SaaS (Future)

### When to Add This

Add Microsoft SaaS billing when:
- Enterprise customers request Microsoft invoicing
- Volume deals where IT needs central license management
- You have bandwidth for backend complexity

### Architecture Required

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Microsoft Transactable SaaS Architecture                               │
│                                                                         │
│  ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐   │
│  │  AppSource      │     │  Your SaaS      │     │  Excel Add-in   │   │
│  │                 │     │  Backend        │     │                 │   │
│  │  User clicks    │────▶│                 │◀────│  Checks license │   │
│  │  "Buy"          │     │  • Landing page │     │  on load        │   │
│  │                 │     │  • Webhook      │     │                 │   │
│  └────────┬────────┘     │    handler      │     └─────────────────┘   │
│           │              │  • License DB   │                           │
│           ▼              │  • Graph API    │                           │
│  ┌─────────────────┐     └────────┬────────┘                           │
│  │  Microsoft      │              │                                    │
│  │  Commerce       │──────────────┘                                    │
│  │                 │  Webhooks: subscribe, unsubscribe, change         │
│  │  Handles:       │                                                   │
│  │  • Billing      │                                                   │
│  │  • Invoicing    │                                                   │
│  │  • Renewals     │                                                   │
│  └─────────────────┘                                                   │
└─────────────────────────────────────────────────────────────────────────┘
```

### Microsoft Sample Code

- **Repository:** [OfficeDev/office-add-in-saas-monetization-sample](https://github.com/OfficeDev/office-add-in-saas-monetization-sample)
- Includes: Landing page, webhooks, license management
- Fee: 3% (lower than Paddle's 5%)

### Limitations

| Limitation | Workaround |
|------------|------------|
| Work/school accounts only | Offer Paddle for personal accounts |
| Requires backend | Use Azure Functions |
| Complex setup | Start with Paddle first |

---

## Pricing Tiers

### Individual Users (via Paddle)

| Tier | Price | Use Case |
|------|-------|----------|
| **Licensed** | €39 one-time | Remove branding |
| **Team** | €99 one-time | Small team (future) |

### Enterprise (via Microsoft SaaS - Future)

| Tier | Price | Use Case |
|------|-------|----------|
| **Department** | €500/year | Per 25 users |
| **Enterprise** | Custom | Organization-wide |

### Self-Hosted Azure Deployment (Separate)

| Tier | Price |
|------|-------|
| Deployment License | €1,000-2,000 one-time |
| Support Contract | €500/year (optional) |

---

## License Validation in Add-in

The Excel add-in validates licenses using your existing `license.ts` logic:

```typescript
// In Excel add-in
import { isValidLicenseFormat, hasValidLicense } from './lib/license';

function checkLicenseStatus(): 'free' | 'licensed' {
  if (hasValidLicense()) {
    return 'licensed';
  }
  return 'free';
}

function activateLicense(key: string): boolean {
  if (isValidLicenseFormat(key)) {
    localStorage.setItem('variscout_license', key.toUpperCase());
    return true;
  }
  return false;
}
```

### Add-in License UI

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Settings → License                                                     │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Current Status: FREE (with branding)                             │ │
│  │                                                                   │ │
│  │  Enter License Key:                                               │ │
│  │  ┌─────────────────────────────────────────────────────────────┐ │ │
│  │  │ VSL-____-____-____                                          │ │ │
│  │  └─────────────────────────────────────────────────────────────┘ │ │
│  │                                                                   │ │
│  │  [Activate]                                                       │ │
│  │                                                                   │ │
│  │  ─────────────────────────────────────────────────────────────── │ │
│  │                                                                   │ │
│  │  Don't have a license?                                           │ │
│  │                                                                   │ │
│  │  [Buy License - €39]  →  Opens variscout.com/buy (Paddle)        │ │
│  │                                                                   │ │
│  │  Enterprise? Contact sales@variscout.com                          │ │
│  │                                                                   │ │
│  └───────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Implementation Checklist

### Phase 1: Paddle Setup (1-2 days)

- [ ] Create Paddle account at paddle.com
- [ ] Set up product: "VariScout Lite License"
- [ ] Configure pricing: €39 one-time
- [ ] Set fulfillment method: Webhook
- [ ] Create webhook endpoint URL

### Phase 2: Webhook Endpoint (1 day)

- [ ] Create serverless function for webhook
- [ ] Verify Paddle signature
- [ ] Generate license key using existing `license.ts`
- [ ] Return key in response
- [ ] Test purchase flow end-to-end

### Phase 3: Checkout Page (1 day)

- [ ] Create variscout.com/buy landing page
- [ ] Embed Paddle checkout overlay
- [ ] Add success page with license key display
- [ ] Style to match VariScout branding

### Phase 4: Add-in Integration (1 day)

- [ ] Add "License" section to add-in settings
- [ ] License key input + validate button
- [ ] "Buy License" button linking to checkout
- [ ] Show status (Free/Licensed)
- [ ] Handle validation errors

### Phase 5: Microsoft SaaS (Future - 2-3 weeks)

- [ ] Set up Azure AD application
- [ ] Create landing page
- [ ] Implement webhook handlers
- [ ] Integrate SaaS Fulfillment API
- [ ] Create Partner Center SaaS offer
- [ ] Link add-in to SaaS offer

---

## Fee Comparison

| Platform | Fee Structure | On €39 Sale | You Keep |
|----------|---------------|-------------|----------|
| **Paddle** | 5% + $0.50 | ~€2.45 | ~€36.55 (94%) |
| **Microsoft AppSource** | 3% | ~€1.17 | ~€37.83 (97%) |
| **Stripe** (DIY tax) | 2.9% + $0.30 | ~€1.43 | ~€37.57 (96%)* |

*Stripe requires you to handle tax compliance yourself (extra work).

---

## Sources

### Paddle
- [Paddle Pricing](https://www.paddle.com/pricing)
- [What is Merchant of Record](https://www.paddle.com/blog/what-is-merchant-of-record)
- [Fulfillment Methods](https://www.paddle.com/help/start/set-up-paddle/which-fulfillment-method-to-choose)
- [Using Webhooks](https://paddle.com/docs/reference-using-webhooks/)
- [Subscriptions Can Send License Keys](https://new.paddle.com/subscriptions-can-now-send-license-keys-164205)
- [Custom License Generator Integration](https://codeboje.de/licensegenerator-paddle/)

### Microsoft SaaS Monetization
- [Monetize Office Add-ins](https://learn.microsoft.com/en-us/partner-center/marketplace-offers/monetize-addins-through-microsoft-commercial-marketplace)
- [Office Add-in SaaS Monetization Sample](https://github.com/OfficeDev/office-add-in-saas-monetization-sample)
- [Plan a SaaS Offer](https://learn.microsoft.com/en-us/partner-center/marketplace-offers/plan-saas-offer)

### Third-Party Licensing
- [Keygen + Paddle Integration](https://keygen.sh/integrate/paddle/)
- [Keygen Example App](https://github.com/keygen-sh/example-paddle-integration)
