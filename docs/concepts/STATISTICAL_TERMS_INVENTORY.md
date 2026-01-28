# Statistical Terms Inventory

Master list of all statistical concepts displayed in VariScout apps, tracking tooltip coverage, glossary pages, and methodology documentation.

## Purpose

This document tracks:

- Which statistical terms are exposed in each app
- Tooltip implementation status across PWA, Azure, and Excel
- Website glossary and methodology page coverage
- What's needed to achieve consistent contextual learning

## Coverage Matrix

### Control Limits & Specifications

| Term   | ID       | PWA Tooltip | Azure Tooltip | Excel Tooltip | Glossary | Methodology                            |
| ------ | -------- | ----------- | ------------- | ------------- | -------- | -------------------------------------- |
| UCL    | `ucl`    | ✅          | ✅            | ✅            | ✅       | ✅ `/learn/methodology-control-limits` |
| LCL    | `lcl`    | ✅          | ✅            | ✅            | ✅       | (same page)                            |
| USL    | `usl`    | ✅          | -             | -             | ✅       | -                                      |
| LSL    | `lsl`    | ✅          | -             | -             | ✅       | -                                      |
| Target | `target` | ✅          | -             | -             | ✅       | -                                      |

### Capability Metrics

| Term      | ID         | PWA Tooltip | Azure Tooltip | Excel Tooltip | Glossary | Methodology                        |
| --------- | ---------- | ----------- | ------------- | ------------- | -------- | ---------------------------------- |
| Cp        | `cp`       | ✅          | ✅            | ✅            | ✅       | ✅ `/learn/methodology-capability` |
| Cpk       | `cpk`      | ✅          | ✅            | ✅            | ✅       | (same page)                        |
| Pass Rate | `passRate` | ✅          | ✅            | -             | ✅       | -                                  |
| Rejected  | `rejected` | ✅          | ✅            | -             | ✅       | -                                  |

### Basic Statistics

| Term    | ID       | PWA Tooltip | Azure Tooltip | Excel Tooltip | Glossary | Methodology |
| ------- | -------- | ----------- | ------------- | ------------- | -------- | ----------- |
| Mean    | `mean`   | ✅          | ✅            | ✅            | ✅       | -           |
| Std Dev | `stdDev` | ✅          | ✅            | ✅            | ✅       | -           |

### ANOVA Statistics

| Term             | ID           | PWA Tooltip | Azure Tooltip | Excel Tooltip | Glossary | Methodology                         |
| ---------------- | ------------ | ----------- | ------------- | ------------- | -------- | ----------------------------------- |
| F-Statistic      | `fStatistic` | ✅          | ✅            | -             | ✅       | -                                   |
| p-value          | `pValue`     | ✅          | ✅            | -             | ✅       | -                                   |
| η² (Eta-squared) | `etaSquared` | ✅          | ✅            | -             | ✅       | ✅ `/learn/methodology-eta-squared` |

### Regression Statistics

| Term      | ID          | PWA Tooltip | Azure Tooltip | Excel Tooltip | Glossary | Methodology |
| --------- | ----------- | ----------- | ------------- | ------------- | -------- | ----------- |
| R²        | `rSquared`  | ✅          | ✅            | N/A           | ✅       | -           |
| Slope     | `slope`     | ✅          | ✅            | N/A           | ✅       | -           |
| Intercept | `intercept` | ❌          | ❌            | N/A           | ✅       | -           |

### Gage R&R Statistics

| Term            | ID                | PWA Tooltip | Azure Tooltip | Excel Tooltip | Glossary | Methodology |
| --------------- | ----------------- | ----------- | ------------- | ------------- | -------- | ----------- |
| %GRR            | `grr`             | ✅          | ✅            | N/A           | ✅       | -           |
| Repeatability   | `repeatability`   | ✅          | ✅            | N/A           | ✅       | -           |
| Reproducibility | `reproducibility` | ✅          | ✅            | N/A           | ✅       | -           |

### Methodology Terms

| Term             | ID                | PWA Tooltip | Azure Tooltip | Excel Tooltip | Glossary | Methodology                             |
| ---------------- | ----------------- | ----------- | ------------- | ------------- | -------- | --------------------------------------- |
| Staged Analysis  | `stagedAnalysis`  | N/A         | N/A           | N/A           | ✅       | ✅ `/learn/methodology-staged-analysis` |
| Probability Plot | `probabilityPlot` | ✅          | ✅            | N/A           | ✅       | -                                       |

### Legend

- ✅ Implemented using shared HelpTooltip component
- ❌ Not implemented
- `-` Not displayed in this app
- N/A Not applicable (feature not in this app)

## Methodology Pages (Completed)

These pages explain HOW we calculate things and WHY we chose our approach:

| Page            | URL                                  | Status |
| --------------- | ------------------------------------ | ------ |
| Control Limits  | `/learn/methodology-control-limits`  | ✅     |
| Capability      | `/learn/methodology-capability`      | ✅     |
| Eta-Squared     | `/learn/methodology-eta-squared`     | ✅     |
| Our Approach    | `/learn/methodology-our-approach`    | ✅     |
| Staged Analysis | `/learn/methodology-staged-analysis` | ✅     |

### Content Covered

**Control Limits**: How UCL/LCL are calculated (mean ± 3σ), why we chose simple 3σ method vs moving range, worked example with actual numbers, when each method is appropriate.

**Capability**: Cp and Cpk formulas with step-by-step calculation, normality assumption and when it matters, Pp vs Ppk (long-term vs short-term), defect rate estimation.

**Eta-Squared**: η² formula (SS_between / SS_total), effect size interpretation (small < 0.06, medium 0.06-0.14, large > 0.14), cumulative variation tracking math.

**Our Approach**: Why we chose simpler calculation methods, when to use specialized tools (Minitab, JMP) instead, Two Voices on one chart philosophy.

**Staged Analysis**: Why control limits are calculated independently per stage, the mathematical formulas for each stage, worked example showing combined vs staged results.

## Glossary Term Sources

All terms are defined in `packages/core/src/glossary/terms.ts`:

```typescript
// Example term structure
{
  id: 'cpk',
  label: 'Cpk',
  definition: 'Process Capability Index. Like Cp, but accounts for how well centered the process is. ≥1.33 is good.',
  description: 'Cpk considers both spread and centering...',
  category: 'capability',
  learnMorePath: '/tools/capability',
  relatedTerms: ['cp', 'usl', 'lsl', 'mean'],
}
```

## Implementation Locations

### PWA (`apps/pwa/`)

| File                                  | Terms Displayed                      |
| ------------------------------------- | ------------------------------------ |
| `src/components/StatsPanel.tsx`       | Pass Rate, Cp, Cpk, Rejected         |
| `src/components/AnovaResults.tsx`     | F-Statistic, p-value, η²             |
| `src/components/GageRRPanel.tsx`      | %GRR, Repeatability, Reproducibility |
| `src/components/RegressionPanel.tsx`  | R², Slope, p-value                   |
| `src/components/views/IChartView.tsx` | UCL, LCL, Mean (MISSING)             |

### Azure (`apps/azure/`)

| File                                 | Terms Displayed                      | Status    |
| ------------------------------------ | ------------------------------------ | --------- |
| `src/components/StatsPanel.tsx`      | Pass Rate, Cp, Cpk, Rejected         | 🔄 Inline |
| `src/components/AnovaResults.tsx`    | F-Statistic, p-value, η²             | 🔄 Inline |
| `src/components/GageRRPanel.tsx`     | %GRR, Repeatability, Reproducibility | 🔄 Inline |
| `src/components/RegressionPanel.tsx` | R², Slope, p-value                   | 🔄 Inline |

### Excel Add-in (`apps/excel-addin/`)

| File                                       | Terms Displayed                 | Status     |
| ------------------------------------------ | ------------------------------- | ---------- |
| `src/taskpane/components/StatsDisplay.tsx` | Mean, StdDev, UCL, LCL, Cp, Cpk | ❌ Missing |
| `src/content/AnovaResults.tsx`             | F-Statistic, p-value, η²        | ❌ Missing |

## Adding New Terms Checklist

When adding a new statistical value to the UI:

1. [ ] Add term to `@variscout/core/glossary/terms.ts`
2. [ ] Add HelpTooltip in PWA component
3. [ ] Add HelpTooltip in Azure component
4. [ ] Add HelpTooltip in Excel component (if applicable)
5. [ ] Create glossary page on website (if user-facing concept)
6. [ ] Consider if methodology page needed (calculation explanation)
7. [ ] Update this inventory document

## Related Documentation

- [Contextual Learning System](./CONTEXTUAL_LEARNING_SYSTEM.md) - Architecture overview
- [Glossary Terms Source](../../packages/core/src/glossary/terms.ts) - Term definitions
- [HelpTooltip Component](../../packages/ui/src/components/HelpTooltip/) - UI component
- [Excel HelpTooltip](../../apps/excel-addin/src/components/HelpTooltip.tsx) - Fluent UI variant
