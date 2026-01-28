# Drill-Down Navigation

Drill-down is VariScout's core methodology for isolating variation sources through progressive stratification.

---

## Concept

Start with all data, then progressively filter to find where variation concentrates:

```
All Data → Shift (67%) → Night (89%) → Machine C (78%)
```

Each step shows how much of the remaining variation is explained by the selected factor.

---

## Decision Thresholds

| Variation % | Action                                   |
| ----------- | ---------------------------------------- |
| **>50%**    | Auto-drill — this is the primary driver  |
| **>80%**    | Strong focus — highly concentrated issue |
| **30-50%**  | Recommend investigating, ask user        |
| **<30%**    | Multiple factors — check interactions    |

---

## Cumulative Impact

The real power is cumulative calculation:

```
Level           Local %     Cumulative
─────────────────────────────────────────
All Data          100%      100%
    ↓
Shift             67%       67% of total
    ↓
Night Shift       89%       59.6% of total
    ↓
Machine C         78%       46.5% of total
```

**Result:** 46.5% of ALL variation isolated to ONE condition.

---

## Implementation

```typescript
import { useDrillDown } from '@variscout/hooks';

const { breadcrumbs, currentData, drillTo, goBack, cumulativeVariation } =
  useDrillDown(initialData);
```

---

## User Interaction

1. **View Boxplot** - See factor comparison with η²
2. **Click highest** - Drill into that factor level
3. **Breadcrumb updates** - Shows path and percentages
4. **Repeat** - Until actionable condition found
5. **Navigate** - Click breadcrumb to go back

---

## See Also

- [Four Pillars: Drill-Down](../../01-vision/four-pillars/drilldown.md)
- [Breadcrumbs](breadcrumbs.md)
- [Linked Filtering](linked-filtering.md)
