# VaRiScout Power BI Visuals — Overview

VaRiScout Power BI brings variation analysis directly into Power BI dashboards.

```
PRODUCT LINEUP
─────────────────────────────────────────────────────────────────

📦 VaRiScout Dashboard      All-in-one, internal linked filtering
📦 VaRiScout I-Chart        Individual, Power BI cross-filtering
📦 VaRiScout Boxplot        Individual, Power BI cross-filtering
📦 VaRiScout Pareto         Individual, Power BI cross-filtering
📦 VaRiScout Capability     Individual, Power BI cross-filtering

Pricing:
  • Team (10 users): €399/year
  • Department (50 users): €999/year
  • Enterprise (unlimited): €1,999/year
```

---

## Two Approaches

1. **VaRiScout Dashboard** — Single visual with all 4 charts linked internally (PWA-like experience)
2. **Individual Visuals** — 4 separate visuals that cross-filter with native Power BI

---

## Shared Core Package

All visuals share `@variscout/core` for consistent analysis:

```
@variscout/core
├── analysis/
│   ├── statistics.ts       # Mean, stdDev, percentiles
│   ├── controlLimits.ts    # UCL, LCL calculations
│   └── capability.ts       # Cp, Cpk, Pp, Ppk
├── charts/
│   ├── IChart.tsx, Boxplot.tsx, Pareto.tsx, Capability.tsx
└── utils/
    ├── dataTransform.ts    # Power BI dataView → analysis
    └── colors.ts           # Consistent palette
```

---

## Related Documentation

- [Capabilities](./CAPABILITIES.md) - Data roles and mappings
- [Visual Implementation](./VISUAL-IMPLEMENTATION.md) - Visual structure
- [Development](./DEVELOPMENT.md) - Development setup
- [Marketplace](./MARKETPLACE.md) - AppSource submission
