# ADR-007: Azure Marketplace Distribution Strategy

**Status**: Accepted (Revised 2026-02-13)

**Date**: 2026-02-05 (Original), 2026-02-13 (Revised)

---

## Context

VariScout has evolved from a single PWA product to a multi-platform offering. The previous licensing model used:

- **Paddle** for payment processing (PWA license)
- **Custom license keys** for feature gating
- **Backend webhook** for key generation and validation

This approach had several limitations:

1. **Backend dependency** - Required server infrastructure for license validation
2. **Payment complexity** - Paddle's fees plus VAT handling complexity
3. **No enterprise support** - Single-user licensing only
4. **Limited distribution** - Manual installation via URL

### Revision Context (2026-02-13)

A technical viability review against current Microsoft documentation revealed critical issues with the original plan:

1. **Solution Templates are not transactable** - Microsoft will not bill customers for Solution Template offers. They support free/BYOL only.
2. **Per-user pricing is unenforceable** - Managed Applications are per-deployment; there is no mechanism to enforce user-count tiers.
3. **Graph API license detection for Excel was over-engineered** - The complexity and admin consent requirements outweighed the benefits.

These findings led to a simplified model: one paid product (Azure App as Managed Application) and one free product (Excel Add-in with no license detection).

---

## Decision

**Adopt Azure Marketplace as the primary distribution channel using a Managed Application offer:**

```
┌─────────────────────────────────────────────────────────────┐
│  VariScout on Azure Marketplace                             │
│                                                             │
│  Single Plan       €150/month   All features, unlimited    │
│                                  users in tenant            │
│                                                             │
│  Offer type: Managed Application                           │
│  Billing: Microsoft (3% fee, monthly)                      │
│  Customer access: Full control                             │
│  Publisher access: Disabled (zero access)                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Excel Add-in on AppSource (FREE FOREVER)                   │
│                                                             │
│  • Core SPC charts: I-Chart, Boxplot, Pareto, Capability   │
│  • No Performance Mode (Azure App exclusive)               │
│  • No license detection needed                             │
│  • Marketing funnel → users upgrade to Azure App           │
└─────────────────────────────────────────────────────────────┘
```

### Product Hierarchy

| Product          | Role                    | Distribution      | Price                            |
| ---------------- | ----------------------- | ----------------- | -------------------------------- |
| **Azure App**    | ONLY PAID PRODUCT       | Azure Marketplace | €150/month (Managed Application) |
| **Excel Add-in** | FREE (marketing funnel) | AppSource         | Free forever, core SPC only      |
| **PWA**          | DEPRECATED (demo only)  | Internal/website  | N/A                              |

### Pricing Rationale

| Aspect            | Value                                              |
| ----------------- | -------------------------------------------------- |
| Price             | €150/month (all features, unlimited users)         |
| Annual equivalent | €1,800/year                                        |
| Microsoft fee     | 3% (€4.50/month)                                   |
| Net revenue       | €145.50/month (€1,746/year)                        |
| Billing           | Monthly only (Managed Application limitation)      |
| Model             | Per-deployment (one subscription per Azure tenant) |

**Why single plan**: Managed Applications are per-deployment, not per-user. There is no mechanism to enforce user-count tiers within a tenant. A single all-inclusive plan is simpler to market, purchase, and support.

---

## Why Managed Application

### Offer Type Comparison

| Capability                         | Solution Template | Managed Application  |
| ---------------------------------- | :---------------: | :------------------: |
| Microsoft-billed (transactable)    |        No         |   **Yes** (3% fee)   |
| Deploys to customer's subscription |        Yes        | **Yes** (managed RG) |
| Data stays in customer's tenant    |        Yes        |       **Yes**        |
| Publisher access to customer       |        N/A        | Optional (disabled)  |
| No backend needed                  |        Yes        |       **Yes**        |
| Monthly pricing                    |  N/A (free only)  |       **Yes**        |

### Permission Model

| Setting              | Configuration | Notes                                       |
| -------------------- | ------------- | ------------------------------------------- |
| Publisher Management | **DISABLED**  | Zero publisher access to customer resources |
| Customer Access      | **ENABLED**   | Full customer control over their deployment |

These settings are **immutable after publishing** the offer in Partner Center.

**Why disable publisher access**: VariScout is a client-side SPA with no backend. There is nothing for the publisher to manage. Disabling access builds customer trust and simplifies compliance.

### Managed Application Package

The deployment package is a `.zip` file containing:

```
variscout-managed-app.zip
├── mainTemplate.json         # ARM template for resources
└── createUiDefinition.json   # Azure portal deployment wizard
```

---

## Consequences

### Benefits

1. **No backend required**
   - App deploys as Static Web App in customer's managed resource group
   - All processing in browser, data stays local
   - Zero infrastructure to maintain

2. **Microsoft handles billing**
   - 3% transaction fee (lower than Paddle's ~5% + VAT complexity)
   - Automatic VAT handling in all Microsoft markets
   - Enterprise procurement integration (purchase orders, invoicing)
   - Monthly billing with automatic renewal

3. **Simplified product model**
   - One paid product, one free product
   - No per-user tier confusion
   - No license detection complexity
   - Excel Add-in just works, always free

4. **Distribution advantage**
   - Azure Marketplace visibility to enterprise buyers
   - AppSource visibility for Excel Add-in
   - Trust signal from Microsoft certification

5. **Data sovereignty**
   - App deploys to customer's Azure tenant
   - Data never leaves their environment
   - Meets enterprise compliance requirements

### Trade-offs

1. **Microsoft platform dependency**
   - Tied to Azure/Microsoft 365 ecosystem
   - Subject to Microsoft certification requirements
   - Marketplace listing approval process

2. **Monthly billing only**
   - Managed Applications do not support annual billing
   - Monthly billing may create higher churn risk
   - But also lower purchase friction (no large upfront commitment)

3. **PWA deprecation**
   - Existing PWA users need migration path
   - PWA remains as demo/reference implementation only

4. **Excel Add-in feature reduction**
   - Performance Mode removed from Excel (Azure App exclusive)
   - Intentional to create clear upgrade incentive
   - Core SPC analysis remains fully functional

5. **No per-user pricing**
   - Cannot charge differently based on team size
   - Single plan must be attractive to both small teams and large organizations
   - €150/month is competitive: cheaper than most alternatives for teams >2 users

---

## Azure App Tier Configuration

License tier is set by deployment — all Managed Application deployments get full features:

```typescript
// Deployment writes tier to app configuration
const tier = import.meta.env.VITE_LICENSE_TIER; // Always 'enterprise' for Managed App
```

The existing `tier.ts` infrastructure remains, with Managed Application deployments always configured as the highest tier.

---

## Excel Add-in: Free Forever

The Excel Add-in is **always free** with no license detection:

- **Core charts**: I-Chart, Boxplot, Pareto, Capability Histogram
- **No Performance Mode**: Multi-channel analysis is Azure App exclusive
- **No Gage R&R**: Measurement system analysis is Azure App exclusive
- **No Graph API**: No `Application.Read.All` permission needed
- **No admin consent**: Zero friction for IT departments

### Strategic Rationale

1. **Marketing funnel**: Free Add-in brings users into the ecosystem
2. **Upsell path**: Power users who need Performance Mode upgrade to Azure App
3. **Zero friction**: No permission popups, no admin consent, no license detection
4. **Lower support burden**: No Graph API debugging, no "license not detected" issues

### Previous Approach (Superseded)

The original ADR-007 proposed using Graph API to detect Azure App registration in the tenant and automatically unlock full Excel features. This was abandoned because:

- `Application.Read.All` requires admin consent (blocks adoption)
- The correct endpoint is `/servicePrincipals`, not `/applications` (the original plan used the wrong API)
- Over-engineered for the business value delivered
- Simpler to make Excel always-free and reserve advanced features for Azure App

---

## Migration Path

### For Existing PWA Users

1. PWA continues to function for demo/evaluation
2. Direct to Azure Marketplace for full-featured deployment
3. Provide migration documentation

### For New Customers

1. Direct to Azure Marketplace for purchase
2. Excel Add-in available free on AppSource (core SPC)
3. PWA available for evaluation only

---

## Implementation Phases

### Phase 1: Documentation (This Revision)

- Updated all documentation to reflect Managed Application model
- Simplified Excel Add-in strategy (free forever, no license detection)
- Updated pricing to single plan at €150/month

### Phase 2: Core Tier Infrastructure (Complete)

- Created `packages/core/src/tier.ts` with tier configuration
- Implemented `getTier()`, `isPaidTier()`, `getMaxChannels()` functions
- Created `packages/hooks/src/useTier.ts` React hook
- Added `TierBadge` and `UpgradePrompt` UI components
- Integrated tier-aware channel limits (5 free / 1,500 paid)

### Phase 3: Azure Marketplace (Q2 2026)

- Partner Center account setup
- Managed Application offer creation
- Deployment package (mainTemplate.json + createUiDefinition.json)
- Single plan at €150/month
- Certification and launch

### Phase 4: Excel AppSource (Q2 2026)

- Partner Center submission
- Hardcode to free tier (no license detection)
- Remove Performance Mode from Excel Add-in
- Certification and launch

### Phase 5: Code Cleanup (Post-Launch)

- Remove `licenseDetection.ts` from Excel Add-in
- Hardcode `featureLimits.ts` to free tier
- Remove Graph API dependencies from Excel Add-in

---

## Related Decisions

- [ADR-006: Edition System](adr-006-edition-system.md) - Superseded, kept for historical context
- [ADR-004: Offline-First](adr-004-offline-first.md) - Unchanged, still applies

---

## See Also

- [Azure Marketplace Guide](../08-products/azure/marketplace.md)
- [Pricing Tiers](../08-products/azure/pricing-tiers.md)
- [ARM Template](../08-products/azure/arm-template.md)
- [Excel AppSource Guide](../08-products/excel/appsource.md)
- [Excel Add-in License Model](../08-products/excel/license-detection.md)
