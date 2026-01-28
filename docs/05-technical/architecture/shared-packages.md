# Shared Packages

The monorepo contains several shared packages that provide common functionality across apps.

---

## Package Overview

| Package             | Purpose                     | React? |
| ------------------- | --------------------------- | ------ |
| `@variscout/core`   | Statistics, parsing, types  | No     |
| `@variscout/charts` | Visx chart components       | Yes    |
| `@variscout/hooks`  | Shared React hooks          | Yes    |
| `@variscout/ui`     | UI components and utilities | Yes    |
| `@variscout/data`   | Sample datasets             | No     |

---

## @variscout/core

**Pure logic with no React dependencies.**

### Key Exports

```typescript
// Statistics
import { calculateStats, calculateAnova, calculateGageRR } from '@variscout/core';

// Parsing
import { parseCSV, validateData, detectColumns } from '@variscout/core';

// Types
import type { StatsResult, SpecLimits, DataPoint } from '@variscout/core';

// Glossary
import { glossaryTerms, getTerm, hasTerm } from '@variscout/core';

// Edition
import { getEdition, isThemingEnabled } from '@variscout/core';

// Navigation
import type { DrillLevel, BreadcrumbItem } from '@variscout/core';
```

### Key Files

| File                | Purpose                                          |
| ------------------- | ------------------------------------------------ |
| `stats.ts`          | Statistics engine (mean, Cp, Cpk, ANOVA, GageRR) |
| `parser.ts`         | CSV/Excel parsing, validation, keyword detection |
| `types.ts`          | Shared TypeScript interfaces                     |
| `glossary/terms.ts` | Glossary content (~20 terms)                     |
| `edition.ts`        | Edition detection, feature gates                 |

---

## @variscout/charts

**React + Visx chart components.**

### Key Exports

```typescript
// Standard charts
import { IChart, Boxplot, ParetoChart, ScatterPlot, GageRRChart } from '@variscout/charts';

// Performance charts (multi-channel)
import {
  PerformanceIChart,
  PerformanceBoxplot,
  PerformancePareto,
  PerformanceCapability,
} from '@variscout/charts';

// Theme hook
import { useChartTheme } from '@variscout/charts';

// Colors
import { chartColors, chromeColors, operatorColors } from '@variscout/charts';
```

### Component Pattern

All charts are props-based:

```tsx
<IChart
  data={measurements}
  specs={{ lsl: 98, usl: 102, target: 100 }}
  stats={calculatedStats}
  showBranding={true}
/>
```

---

## @variscout/hooks

**Shared React hooks for state and behavior.**

### Key Exports

```typescript
import {
  useChartScale, // Y-axis scale calculation
  useDrillDown, // Drill-down navigation
  useVariationTracking, // Cumulative η² tracking
  useDataState, // Shared DataContext state
  useKeyboardNavigation, // Arrow key focus
  useResponsiveChartMargins, // Dynamic margins
} from '@variscout/hooks';
```

### Usage Example

```tsx
const { breadcrumbs, currentLevel, drillTo, goBack } = useDrillDown(initialData);
```

---

## @variscout/ui

**Shared UI components and utilities.**

### Key Exports

```typescript
// Components
import { HelpTooltip } from '@variscout/ui';

// Hooks
import { useGlossary, useIsMobile } from '@variscout/ui';

// Colors
import { gradeColors } from '@variscout/ui';

// Services
import { errorService } from '@variscout/ui';
```

---

## @variscout/data

**Sample datasets with pre-computed statistics.**

### Usage

```typescript
import { coffeeData, journeyData, bottleneckData } from '@variscout/data';

// Each dataset includes:
// - Raw data points
// - Pre-computed stats
// - Chart-ready data structures
```

---

## Import Rules

```typescript
// ✅ Correct: Apps import from packages
import { calculateStats } from '@variscout/core';
import { IChart } from '@variscout/charts';

// ❌ Wrong: Packages should not import from apps
// import { Dashboard } from '@variscout/pwa';

// ✅ Correct: Use workspace protocol in package.json
// "@variscout/core": "workspace:*"
```

---

## See Also

- [Monorepo Architecture](monorepo.md)
- [Charts Package](../../06-design-system/charts/overview.md)
