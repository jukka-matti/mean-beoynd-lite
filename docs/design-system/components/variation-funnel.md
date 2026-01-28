# Variation Funnel

Factor ranking component showing which factors explain the most variation, with category breakdown and What-If integration.

## Overview

The Variation Funnel helps users identify the optimal 1-3 filter settings that explain ~70% of process variation. It guides users through a systematic approach to variation analysis:

1. **Factor ranking** - Factors sorted by η² (eta-squared), highest first
2. **Cumulative tracking** - Shows combined variation as factors are selected
3. **Category breakdown** - Per-category statistics within each factor
4. **Exclusion projections** - "What if we remove this category?"
5. **What-If integration** - Direct link to interactive simulation

## Usage

```tsx
import VariationFunnel from './components/VariationFunnel';

<VariationFunnel
  data={measurements}
  factors={['Machine', 'Operator', 'Shift']}
  outcome="Weight"
  specs={{ usl: 110, lsl: 90, target: 100 }}
  onDrillFactor={(factor, value) => handleDrill(factor, value)}
/>;
```

## Props

| Prop           | Type                                                      | Default   | Description                             |
| -------------- | --------------------------------------------------------- | --------- | --------------------------------------- |
| data           | `any[]`                                                   | required  | Raw measurement data array              |
| factors        | `string[]`                                                | required  | Column names of categorical factors     |
| outcome        | `string`                                                  | required  | Column name of numeric outcome variable |
| columnAliases  | `Record<string, string>`                                  | `{}`      | Display names for columns               |
| specs          | `{ usl?: number; lsl?: number; target?: number }`         | undefined | Specification limits for Cpk            |
| targetPct      | number                                                    | 70        | Target percentage to explain            |
| onApplyFilters | `(filters: Record<string, (string \| number)[]>) => void` | undefined | Called when Apply Filters clicked       |
| onDrillFactor  | `(factor: string, value: string \| number) => void`       | undefined | Called when Drill button clicked        |
| onOpenPopout   | `() => void`                                              | undefined | Called to open in new window            |
| onClose        | `() => void`                                              | undefined | Called to close panel                   |
| isPopout       | boolean                                                   | false     | Whether rendered in popout window       |

## Factor Ranking

Factors are ranked by their η² (eta-squared) value, which represents the proportion of variance explained:

```
Machine (67%)       ████████████████████████████████░░░
├── Highest impact: Machine C
└── [Drill →]

Operator (45%)      ████████████████████░░░░░░░░░░░░░░░
├── Highest impact: Bob
└── [Drill →]

Shift (23%)         ██████████░░░░░░░░░░░░░░░░░░░░░░░░░
├── Highest impact: Night
└── [Drill →]
```

**Color coding by impact:**

| Threshold | Level    | Bar Color      | Text Color       |
| --------- | -------- | -------------- | ---------------- |
| ≥ 50%     | high     | `bg-green-500` | `text-green-400` |
| 30-50%    | moderate | `bg-amber-500` | `text-amber-400` |
| < 30%     | low      | `bg-blue-500`  | `text-blue-400`  |

## Category Breakdown

Expand any factor to see per-category statistics:

```
▼ Show categories (3)
┌────────────────────────────────────────────────────────┐
│ [✓] Machine A   μ: 98.2   σ: 1.1   (12%)              │
│ [✓] Machine B   μ: 99.1   σ: 1.3   (15%)              │
│ [✓] Machine C   μ: 104.3  σ: 2.8   (40%) worst ⚡+0.32│
└────────────────────────────────────────────────────────┘
```

**Category stats displayed:**

- **μ (mean)** - Average value for this category
- **σ (stdDev)** - Standard deviation within category
- **Contribution %** - Percentage of total variation from this category
- **worst** badge - Applied to highest contributor (>20%)

## Exclusion Projections

Click category checkboxes to toggle exclusion and see projected impact:

```
┌───────────────────────────────────────────────────────┐
│ Projected if excluded                        [Reset] │
│ Mean: 100.5 → 98.7                                   │
│ σ:    2.3   → 1.2   (-48%)                           │
│ Cpk:  0.82  → 1.45  (+77%)                           │
│ Samples: 150 → 100                                   │
└───────────────────────────────────────────────────────┘
```

**Exclusion behavior:**

1. Unchecking a category marks it as "excluded"
2. Real-time projection recalculates stats without excluded data
3. Shows improvement percentages for mean centering, σ reduction, Cpk improvement
4. Sample count shows remaining data points

## Inline Cpk Badges

For worst categories with significant improvement potential, an inline badge appears:

```
[✓] Machine C   μ: 104.3  σ: 2.8  (40%) worst [⚡+0.32 Cpk]
```

**Badge conditions:**

- Category must be marked as "worst" (first in sorted list)
- Contribution must be >20% of variation
- Projected Cpk improvement must be >0.05

**Badge behavior:**

1. Click opens the What-If Simulator section
2. Automatically applies a preset based on the exclusion projection
3. Scrolls simulator into view for immediate exploration

## What-If Simulator Integration

The Variation Funnel includes an embedded What-If Simulator (when specs are provided):

```tsx
<WhatIfSimulator
  currentStats={currentStats}
  specs={specs}
  presets={simulatorPresets}
  isExpanded={simulatorExpanded}
  onExpandChange={setSimulatorExpanded}
  initialPreset={activePreset}
/>
```

**Preset generation:**

The component automatically generates presets based on category analysis:

1. **Center on target** - If mean differs from target/midpoint
2. **Exclude worst** - Based on highest-variation category's projection
3. **Standardize to best** - Match lowest-variation category's σ

## Cumulative Tracking

As factors are selected, cumulative variation explained is calculated:

```
Combined Explained: 72%
[███████████████████████████████░░░░░]
                    ↑
                 70% Target

These 2 factors explain 72% of your variation
```

**Formula:** Cumulative uses product of remaining variation:

- Factor 1 (67%): 67% explained, 33% remaining
- Factor 2 (45%): 45% of 33% = 14.85% additional
- Combined: 67% + 14.85% = 81.85%

## Visual Design

```
┌──────────────────────────────────────────────────────────┐
│ 🔍 Variation Funnel                           [↗] [×]   │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ > 🧪 What-If Simulator                                  │
│                                                          │
│ ─────────────────────────────────────────────────────── │
│                                                          │
│ Total Variation (100%)                                   │
│ [░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] │
│                                                          │
│ ┌────────────────────────────────────────────────────┐  │
│ │ [✓] Machine (67%)                         67%      │  │
│ │ ████████████████████████████████░░░░░░░░░░░        │  │
│ │ Highest impact: Machine C         [Drill →]        │  │
│ │ ▼ Show categories (3)                              │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
│ ┌────────────────────────────────────────────────────┐  │
│ │ [✓] Operator (45%)                        45%      │  │
│ │ ██████████████████████░░░░░░░░░░░░░░░░░░░░         │  │
│ │ Highest impact: Bob                [Drill →]       │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
│ ─ ─ ─ ─ ─ ─ ─ 🎯 70% Target ─ ─ ─ ─ ─ ─ ─              │
│                                                          │
│ ┌────────────────────────────────────────────────────┐  │
│ │ Combined Explained                        72%      │  │
│ │ ███████████████████████████████░░░░░░░░░░          │  │
│ │ These 2 factors explain 72% of your variation      │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
├──────────────────────────────────────────────────────────┤
│              [🔍 Apply 2 Filters]                        │
│     Filters to highest-impact values for selected        │
└──────────────────────────────────────────────────────────┘
```

## State Management

The component manages several internal states:

```typescript
// Factor selection
const [selectedFactors, setSelectedFactors] = useState<Set<string>>();

// Category expansion
const [expandedFactors, setExpandedFactors] = useState<Set<string>>();

// Category exclusions for projections
const [excludedCategories, setExcludedCategories] = useState<Map<string, Set<string | number>>>();

// What-If Simulator control
const [simulatorExpanded, setSimulatorExpanded] = useState(false);
const [activePreset, setActivePreset] = useState<SimulatorPreset | null>(null);
```

## Dependencies

- `@variscout/core` - `findOptimalFactors()`, `getCategoryStats()`, `calculateProjectedStats()`, `calculateStats()`, `toNumericValue()`, `getVariationImpactLevel()`
- `lucide-react` - Icons (Filter, Target, ChevronRight, ChevronDown, ExternalLink, X, RotateCcw, TrendingUp, Zap)
- `./WhatIfSimulator` - Embedded simulation component

## Files

| File                                          | Purpose                       |
| --------------------------------------------- | ----------------------------- |
| `apps/pwa/src/components/VariationFunnel.tsx` | Main component implementation |
| `apps/pwa/src/components/WhatIfSimulator.tsx` | Embedded simulator            |
| `apps/pwa/src/components/FunnelPanel.tsx`     | Slide-in panel wrapper        |
| `packages/core/src/variation.ts`              | Analysis functions            |

## Related Components

- [What-If Simulator](./what-if-simulator.md) - Embedded improvement simulation
- [VariationBar](./variation-bar.md) - Breadcrumb variation indicator
- [FunnelPanel](./funnel-panel.md) - Slide-in panel container
- [Improvement Simulator Concept](../../concepts/improvement-simulator/OVERVIEW.md) - Strategy document
