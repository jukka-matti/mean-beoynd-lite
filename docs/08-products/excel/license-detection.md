# Excel Add-in License Model

The Excel Add-in is **free forever** with no license detection.

---

## Current Model (Revised 2026-02-13)

The Excel Add-in is distributed FREE on AppSource with core SPC functionality. There is no license detection, no Graph API integration, and no tier unlocking.

### What's Included (Free)

- I-Chart with Nelson Rules
- Boxplot comparisons
- Pareto charts
- Capability Histogram (Cp/Cpk)

### What's Excluded (Azure App Only)

- Performance Mode (multi-channel analysis)
- Gage R&R (measurement system analysis)
- Regression analysis
- Probability plots
- OneDrive sync
- Team collaboration

### Why No License Detection

The original plan proposed using Microsoft Graph API to detect Azure App deployment in the tenant and automatically unlock full Excel features. This was abandoned because:

1. **`Application.Read.All` requires admin consent** - Most organizations' IT departments would not grant this permission for a free Excel Add-in, blocking adoption
2. **Wrong API endpoint** - The original plan used `GET /applications` which lists app registrations owned by the tenant. The correct endpoint for detecting installed apps is `/servicePrincipals`, which has the same permission requirements
3. **Over-engineered** - The complexity of Graph API integration, caching, offline fallback, and error handling was disproportionate to the business value
4. **Simpler alternative** - Making the Excel Add-in always-free with a clear feature boundary (core SPC vs. Performance Mode) is easier to understand, market, and support

---

## Feature Gating (Simplified)

The Excel Add-in hardcodes to free tier limits:

```typescript
// apps/excel-addin/src/lib/featureLimits.ts

export function getCurrentTier(): 'free' {
  return 'free'; // Always free, no detection needed
}

export function canUsePerformanceMode(): boolean {
  return false; // Azure App exclusive
}

export function canUseGageRR(): boolean {
  return false; // Azure App exclusive
}

export const CHANNEL_LIMIT = 5; // Free tier limit
```

### Upgrade Prompt

When users try to access Azure App-exclusive features, show an upgrade prompt:

```typescript
<UpgradePrompt
  feature="Performance Mode"
  message="Multi-channel analysis is available in the VariScout Azure App."
  link="https://azuremarketplace.microsoft.com/..."
/>
```

---

## Strategic Rationale

### Excel Add-in as Marketing Funnel

```
Free Excel Add-in (AppSource)
  └── User analyzes data with core SPC charts
       └── Needs multi-channel analysis or team features
            └── Discovers VariScout Azure App (€150/month)
                 └── Deploys via Azure Marketplace
```

### Benefits of "Free Forever"

| Benefit              | Description                                          |
| -------------------- | ---------------------------------------------------- |
| Zero friction        | No permission popups, no admin consent required      |
| IT-friendly          | No Graph API permissions to approve                  |
| Simple support       | No "license not detected" debugging                  |
| Clear value prop     | Core SPC free, advanced features in Azure App        |
| AppSource compliance | Simpler review process without Graph API permissions |

---

## Previous Approach (Superseded)

> The following describes the original license detection plan from ADR-007 (2026-02-05). It was **never implemented** and has been superseded by the "free forever" model above.

The original plan used Microsoft Graph API to check for Azure App Registration:

```
Excel Add-in startup
  → Check localStorage cache
  → If expired, get MSAL token with Application.Read.All scope
  → Query GET /applications?$filter=displayName eq 'VariScout'
  → If found → unlock full tier
  → Cache result for 24 hours
```

**Issues identified during review:**

- `Application.Read.All` requires admin consent (adoption blocker)
- `GET /applications` was the wrong endpoint (should be `/servicePrincipals`)
- Complex caching, offline fallback, and error handling needed
- Spoofing risk (localStorage-based tier could be modified by user)

The code files referenced in the original plan (`licenseDetection.ts`, `useLicense.ts`) were never created.

---

## Code Cleanup (Completed)

No stubs or dead code remain. The Excel Add-in hardcodes to free tier via `featureLimits.ts`.

---

## See Also

- [AppSource Guide](appsource.md)
- [Excel Strategy](strategy.md)
- [Azure App](../azure/index.md)
- [ADR-007: Distribution Strategy](../../07-decisions/adr-007-azure-marketplace-distribution.md)
