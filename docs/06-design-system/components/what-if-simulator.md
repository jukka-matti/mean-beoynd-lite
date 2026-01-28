# What-If Simulator

Interactive component for exploring process improvement scenarios.

---

## Purpose

The What-If Simulator allows users to explore hypothetical improvements:

- "What if we reduced variation in Factor X by 50%?"
- "What would happen to Cpk if we centered the process?"
- "How much defect reduction would we see?"

---

## Component Structure

```tsx
<WhatIfSimulator
  baselineStats={currentStats}
  factors={drillFactors}
  specs={specLimits}
  onScenarioChange={handleScenarioChange}
/>
```

---

## Props

| Prop               | Type                 | Description                      |
| ------------------ | -------------------- | -------------------------------- |
| `baselineStats`    | `StatsResult`        | Current process statistics       |
| `factors`          | `Factor[]`           | Factors available for adjustment |
| `specs`            | `SpecLimits`         | USL/LSL/Target                   |
| `onScenarioChange` | `(scenario) => void` | Callback when scenario changes   |

---

## User Interaction

1. Select a factor from drill-down results
2. Adjust the "reduction" slider (0-100%)
3. See projected impact on:
   - Cpk improvement
   - Defect reduction
   - Variation reduction

---

## Visual Design

- Slider with current and projected values
- Before/after capability comparison
- Clear labeling of assumptions

---

## See Also

- [Variation Funnel](variation-funnel.md)
- [Drill-Down Feature](../../03-features/navigation/drill-down.md)
