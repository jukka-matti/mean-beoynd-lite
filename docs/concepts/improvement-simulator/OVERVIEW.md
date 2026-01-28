# Process Improvement Simulator

## Implementation Status

| Phase | Feature                     | Status      |
| ----- | --------------------------- | ----------- |
| 1     | Category Breakdown          | ✅ Complete |
| 2     | Interactive Category Toggle | ✅ Complete |
| 3     | Direct Adjustment Sliders   | ✅ Complete |
| 4     | Preset Scenario Buttons     | ✅ Complete |
| 5     | Inline Cpk Badges           | ✅ Complete |

---

## Problem Statement

The Variation Funnel currently shows **what** factors contribute to variation (e.g., "Machine explains 67% of variation") but not the **so what**:

- How much would Cpk improve if we fixed this?
- How much tighter would the process spread become?
- What if we just fixed the mean? Or just reduced variation?

## Vision

An interactive **"What-If" Simulator** that lets users explore the three levers of process improvement:

1. **Shift mean** → Better centering toward target
2. **Reduce variation** → Tighter spread
3. **Both** → Maximum Cpk improvement

## Improvement Metrics

| Metric         | Example                   | Audience    |
| -------------- | ------------------------- | ----------- |
| **Mean shift** | 102.5g → 100.0g           | Everyone    |
| **StdDev**     | 2.3g → 1.6g (30% tighter) | Everyone    |
| **Cpk**        | 0.82 → 1.56               | LSS trained |
| **% in spec**  | 96.2% → 99.92%            | Everyone    |
| **Defect PPM** | 38,000 → 800              | Business    |

## Implementation Phases

### Phase 1: Category Breakdown

Show per-category statistics within each factor:

```
Machine (67% of variation)
├── Machine A: μ 98.2g, σ 1.1g (12%)
├── Machine B: μ 99.1g, σ 1.3g (15%)
└── Machine C: μ 104.3g, σ 2.8g (40%) ← worst
```

**Value:** Users understand WHERE variation comes from

**Implementation:**

- `getCategoryStats()` function in `packages/core/src/variation.ts`
- Expandable category breakdown in `VariationFunnel.tsx`
- Unit tests in `packages/core/src/__tests__/categoryStats.test.ts`

### Phase 2: Interactive Category Toggle

Toggle categories on/off, see real-time projections:

```
☑ Machine A  ☑ Machine B  ☐ Machine C

Projected if Machine C excluded:
  Mean: 100.5g → 98.7g
  Spread: 2.3g → 1.2g
  Cpk: 0.82 → 1.45
```

**Value:** "What if we exclude the worst performer?"

### Phase 3: Direct Adjustment Sliders

Sliders to explore mean shift and variation reduction:

```
Adjust Mean      ─────●───────  -2.5g
Reduce Variation ───────●─────  -30%

Projected:
  Cpk: 0.82 → 1.56
  In spec: 96.2% → 99.92%
```

**Value:** Direct exploration of improvement levers

### Phase 4: Preset Scenario Buttons

Quick-access scenarios:

- **[Standardize to best]** - All categories match best performer
- **[Exclude worst]** - Remove highest-variation category
- **[Center on target]** - Shift mean to target value

**Value:** One-click insights for common questions

### Phase 5: Inline Cpk Badges (Discoverability Enhancement)

Proactive hints on worst categories showing improvement potential:

```
[✓] Machine A   μ: 250.1  σ: 1.2  (12%)
[✓] Machine B   μ: 249.8  σ: 1.5  (15%)
[✓] Machine C   μ: 251.2  σ: 2.8  (40%) worst  [⚡+0.32 Cpk]
                                               ↑ Click to explore
```

**Value:** Surfaces improvement potential where users already look (in the category breakdown)

**Behavior:**

1. Badge appears on "worst" categories with >20% contribution and >0.05 Cpk improvement potential
2. Click badge → Expands What-If Simulator → Applies preset → Scrolls into view
3. Preset auto-populated with mean shift and variation reduction from exclusion projection

**Implementation:**

- `worstCategoryCpkImprovements` memo calculates improvement for each factor's worst category
- `handleCpkBadgeClick` applies preset and controls simulator expansion
- Controlled expansion via `isExpanded`/`onExpandChange` props on WhatIfSimulator
- Imperative handle (`WhatIfSimulatorHandle`) for `applyPreset()` and `expand()` methods

---

## Statistical Background

### The Three Levers of Improvement

Process capability (Cpk) can be improved through:

1. **Centering (mean shift)**
   - Moving the process mean closer to the target/center of specs
   - Formula impact: Cpk = min((USL - μ), (μ - LSL)) / (3σ)
   - Shifting μ toward center increases the minimum value

2. **Spread reduction (lower σ)**
   - Reducing process variation makes the distribution tighter
   - Formula impact: Smaller σ in denominator → higher Cpk
   - Often achieved by eliminating assignable causes

3. **Both (optimal)**
   - Combining centering and spread reduction
   - Maximum improvement when both levers are pulled

### Category-Level Statistics

For each category within a factor:

```typescript
interface CategoryStats {
  value: string | number; // Category identifier (e.g., "Machine A")
  count: number; // Number of samples
  mean: number; // Category mean (μ)
  stdDev: number; // Category standard deviation (σ)
  contributionPct: number; // % of total variation from this category
}
```

**Contribution calculation:**

- Category contribution = n_i × (category_mean - overall_mean)²
- Contribution % = category_contribution / SS_total × 100

### Projection Formulas

**If category excluded:**

- New mean = Σ(remaining values) / remaining count
- New σ = stdDev(remaining values)
- Projected Cpk = min((USL - new*mean), (new_mean - LSL)) / (3 × new*σ)

**If all categories standardized to best:**

- New σ = best*category*σ
- New mean = target or current overall mean
- Projected Cpk = (USL - LSL) / (6 × new_σ)

---

## UX Wireframes

### Phase 1: Category Breakdown

```
┌─────────────────────────────────────┐
│ Machine (67%)                       │
│ ████████████████████████████████░░░ │
│ Highest impact: Machine C           │
│                                     │
│ ▼ Show categories                   │
├─────────────────────────────────────┤
│   Machine A    μ: 98.2   σ: 1.1     │
│                                (12%)│
│   Machine B    μ: 99.1   σ: 1.3     │
│                                (15%)│
│   Machine C    μ: 104.3  σ: 2.8     │
│                          (40%) worst│
└─────────────────────────────────────┘
```

### Phase 2: Category Toggle

```
┌─────────────────────────────────────┐
│ Machine (67%)                       │
│ ████████████████████████████████░░░ │
│                                     │
│ ☑ Machine A  ☑ Machine B  ☐ Mach C  │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Projected (excluding Machine C) │ │
│ │ Mean: 100.5g → 98.7g            │ │
│ │ σ: 2.3g → 1.2g                  │ │
│ │ Cpk: 0.82 → 1.45 (+77%)        │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Phase 3: Adjustment Sliders

```
┌─────────────────────────────────────┐
│ What-If Simulator                   │
│                                     │
│ Adjust Mean                         │
│ ───────────────●─────────  -2.5g    │
│                                     │
│ Reduce Variation                    │
│ ─────────●───────────────  -30%     │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │        Current → Projected      │ │
│ │ Mean:  102.5g → 100.0g          │ │
│ │ σ:     2.3g   → 1.6g            │ │
│ │ Cpk:   0.82   → 1.56 (+90%)     │ │
│ │ Yield: 96.2%  → 99.92%          │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [Reset] [Apply to filters]          │
└─────────────────────────────────────┘
```

### Phase 5: Inline Cpk Badge

```
┌─────────────────────────────────────┐
│ Machine (67%)                       │
│ ████████████████████████████████░░░ │
│                                     │
│ ▼ Show categories (3)               │
├─────────────────────────────────────┤
│   [✓] Machine A  μ:98.2  σ:1.1 (12%)│
│   [✓] Machine B  μ:99.1  σ:1.3 (15%)│
│   [✓] Machine C  μ:104.3 σ:2.8 (40%)│
│        worst  [⚡+0.32 Cpk]         │
│                  ↑                  │
│         Click to explore in         │
│         What-If Simulator           │
└─────────────────────────────────────┘
```

**Badge behavior:**

1. Appears only on worst category row (first in sorted list)
2. Only shown when contribution >20% and Cpk improvement >0.05
3. Click scrolls to What-If Simulator and applies preset
4. Uses `<Zap>` icon from lucide-react

---

## File Map

| File                                                 | Purpose                                                                 |
| ---------------------------------------------------- | ----------------------------------------------------------------------- |
| `docs/concepts/improvement-simulator/OVERVIEW.md`    | This document                                                           |
| `packages/core/src/variation.ts`                     | `getCategoryStats()`, `calculateProjectedStats()`, simulation functions |
| `packages/core/src/index.ts`                         | Export types/functions                                                  |
| `packages/core/src/__tests__/categoryStats.test.ts`  | Category stats unit tests                                               |
| `packages/core/src/__tests__/projectedStats.test.ts` | Projection calculation tests                                            |
| `apps/pwa/src/components/VariationFunnel.tsx`        | Factor list, categories, inline Cpk badges, exclusion toggle            |
| `apps/pwa/src/components/WhatIfSimulator.tsx`        | Sliders, presets, projections panel                                     |
| `apps/pwa/src/components/FunnelPanel.tsx`            | Slide-in panel wrapper                                                  |
| `docs/design-system/components/what-if-simulator.md` | Component documentation                                                 |
| `docs/design-system/components/variation-funnel.md`  | Component documentation                                                 |

---

## Scope

- **PWA only** initially (Azure/Excel later based on feedback)
- **Build in phases** - each phase delivers standalone value
- **Mobile-friendly** - collapsible sections work on small screens
