# Pareto Charts

Frequency analysis and ranking charts with cumulative percentage lines.

## Overview

VariScout provides two Pareto chart variants for different analysis contexts:

| Component             | Purpose                     | Context           | Data Source                |
| --------------------- | --------------------------- | ----------------- | -------------------------- |
| **ParetoChart**       | Category frequency analysis | Standard Analysis | Derived from `DataContext` |
| **PerformancePareto** | Channel Cpk ranking         | Performance Mode  | `ChannelResult[]` (props)  |

**Source:** `apps/pwa/src/components/charts/ParetoChart.tsx` (PWA), `packages/charts/src/PerformancePareto.tsx` (shared)

---

## Standard ParetoChart

Shows frequency distribution with bars sorted by count (highest first) and a cumulative percentage line. Classic Pareto analysis for identifying the "vital few" causes.

### Props Interface

```typescript
interface ParetoChartProps {
  /** Factor column name for grouping */
  factor: string;
  /** Parent container width (from withParentSize) */
  parentWidth: number;
  /** Parent container height (from withParentSize) */
  parentHeight: number;
  /** Callback for drill-down on bar click */
  onDrillDown?: (factor: string, value: string) => void;
  /** Show ghost bars comparing filtered to full population */
  showComparison?: boolean;
  /** Callback to toggle comparison view */
  onToggleComparison?: () => void;
  /** Callback to hide the Pareto panel */
  onHide?: () => void;
  /** Callback to open factor selector */
  onSelectFactor?: () => void;
  /** Callback to open Pareto file upload dialog */
  onUploadPareto?: () => void;
  /** Available factors for selection (determines if "Select Factor" button shows) */
  availableFactors?: string[];
}
```

### Internal Data Structure

The component derives Pareto data internally from `DataContext.filteredData`:

```typescript
interface ParetoDataPoint {
  key: string; // Category identifier
  value: number; // Count for this category
  cumulative: number; // Running total
  cumulativePercentage: number; // Cumulative % (0-100)
}
```

Data is automatically sorted by value (descending) with cumulative percentages calculated.

### Display Features

- **Bars:** Count for each category (left Y-axis)
- **Cumulative line:** Running percentage with circle markers
- **80% threshold:** Dashed orange reference line
- **Dual Y-axes:** Count (left) and Cumulative % (right)

### Panel Controls

The Pareto chart includes optional control buttons in the top-right corner:

| Button         | Icon       | Condition                                      | Action                           |
| -------------- | ---------- | ---------------------------------------------- | -------------------------------- |
| **Hide**       | EyeOff     | `onHide` provided                              | Hides the Pareto panel from view |
| **Comparison** | Eye/EyeOff | Filters active + `onToggleComparison` provided | Toggles ghost bar comparison     |

When both buttons are visible, the hide button appears to the left of the comparison toggle.

### Comparison Mode

When filters are active, the comparison toggle shows ghost bars representing the full population distribution:

- **Ghost bars:** Dashed outline, 30% opacity, shows expected count based on overall distribution
- **Solid bars:** Current filtered data
- **Tooltip (with comparison):** Shows filtered %, overall %, and difference with directional arrow (↑/↓)

This helps identify whether a category is over- or under-represented in the filtered subset.

### Empty State

When no Pareto data is available, an actionable empty state is shown with:

- **Select Factor** button - visible if `availableFactors.length > 0` and `onSelectFactor` provided
- **Upload** button - visible if `onUploadPareto` provided
- **Hide** button - visible if `onHide` provided

### Separate Pareto Data Mode

When `paretoMode === 'separate'` in DataContext, the chart uses pre-aggregated data from `separateParetoData` instead of deriving counts from filtered data. An amber info banner indicates this mode: "Using separate Pareto file (not linked to filters)". Comparison mode is disabled when using separate data.

### Example

```tsx
import ParetoChart from './components/charts/ParetoChart';

// Basic usage - data is derived from DataContext based on factor column
<div className="h-[400px]">
  <ParetoChart
    factor="Shift"
    onDrillDown={(factor, value) => console.log('Drill:', factor, value)}
  />
</div>

// With panel controls and comparison
<div className="h-[400px]">
  <ParetoChart
    factor="Shift"
    onDrillDown={handleDrillDown}
    showComparison={showComparison}
    onToggleComparison={() => setShowComparison(prev => !prev)}
    onHide={() => setParetoVisible(false)}
    onSelectFactor={() => setFactorModalOpen(true)}
    onUploadPareto={() => setParetoUploadOpen(true)}
    availableFactors={['Shift', 'Machine', 'Operator']}
  />
</div>
```

### Selection Behavior

Clicking a bar either:

1. Calls `onDrillDown(factor, value)` if provided, or
2. Falls back to toggling the bar in `filters[factor]` via DataContext

Selected bars are highlighted using `chartColors.selected`, unselected bars use `chrome.boxDefault`.

---

## PerformancePareto

Shows channels ranked by Cpk (worst first) in Pareto-style bar chart. Helps identify which channels need the most attention.

### Props Interface

```typescript
interface PerformanceParetoProps extends BaseChartProps {
  /** Channel results for ranking */
  channels: ChannelResult[];
  /** Currently selected measure/channel */
  selectedMeasure?: string | null;
  /** Maximum number of channels to display (default: 20) */
  maxDisplayed?: number;
  /** Callback when a bar is clicked */
  onChannelClick?: (channelId: string) => void;
}
```

### Display Behavior

| State            | Display                                              |
| ---------------- | ---------------------------------------------------- |
| No selection     | Worst N channels by Cpk (ascending sort)             |
| Channel selected | Selected channel highlighted, others dimmed (0.4)    |
| Empty channels   | Placeholder: "No channel performance data available" |

### Sorting and Limiting

Channels are automatically sorted by Cpk ascending (worst first) using `sortChannels(channels, 'cpk-asc')` from `@variscout/core`. The `maxDisplayed` prop limits display (default: 20).

### Health-Based Coloring

Bar color reflects channel capability health:

| Health      | Cpk Range   | Color                         |
| ----------- | ----------- | ----------------------------- |
| `critical`  | < 1.0       | Red (`chartColors.fail`)      |
| `warning`   | 1.0 - 1.33  | Amber (`chartColors.warning`) |
| `capable`   | 1.33 - 1.67 | Green (`chartColors.pass`)    |
| `excellent` | >= 1.67     | Blue (`chartColors.mean`)     |

### Reference Lines

| Line     | Value | Color | Meaning                  |
| -------- | ----- | ----- | ------------------------ |
| Critical | 1.0   | Red   | Minimum acceptable Cpk   |
| Target   | 1.33  | Green | Industry standard target |

### Example

```tsx
import PerformancePareto from '@variscout/charts/PerformancePareto';

<PerformancePareto
  channels={channelResults}
  selectedMeasure={selectedId}
  maxDisplayed={15}
  onChannelClick={handleChannelSelect}
/>;
```

---

## Visual Elements

| Element             | Standard ParetoChart       | PerformancePareto          |
| ------------------- | -------------------------- | -------------------------- |
| **Bars**            | Count values (descending)  | Cpk values (ascending)     |
| **Bar color**       | Default or selected        | Health-based               |
| **Cumulative line** | Orange with circle markers | Orange with circle markers |
| **Left Y-axis**     | Count                      | Cpk                        |
| **Right Y-axis**    | Cumulative %               | Cumulative %               |
| **Reference line**  | 80% threshold (orange)     | Cpk 1.0 & 1.33 (red/green) |
| **Grid**            | Horizontal rows            | Horizontal rows            |
| **X-axis labels**   | Category names             | Channel labels (truncated) |

---

## Data Flow

### Standard ParetoChart (PWA)

```
DataContext
    | filteredData, rawData, paretoMode, separateParetoData
    |
ParetoChart (responsive wrapper)
    | Derives counts from filteredData (or uses separateParetoData)
    | Sorts by value (descending)
    | Computes cumulative percentages
    | Calculates full population comparison (if enabled)
    |
SVG rendering with Visx primitives
```

### PerformancePareto

```
DataContext (PWA/Azure)
    | analyzePerformanceData()
PerformanceDashboard.tsx
    | channels: ChannelResult[]
PerformancePareto (responsive wrapper)
    | sortChannels(channels, 'cpk-asc')
    | slice(0, maxDisplayed)
PerformanceParetoBase (renders SVG)
```

---

## Interactions

### Click Behavior

```tsx
// Standard ParetoChart - toggle category selection
onBarClick={(key) => {
  if (selectedBars.includes(key)) {
    setSelectedBars(bars => bars.filter(b => b !== key));
  } else {
    setSelectedBars(bars => [...bars, key]);
  }
}}

// PerformancePareto - single channel selection (toggle)
onChannelClick={(channelId) => {
  setSelectedMeasure(prev => prev === channelId ? null : channelId);
}}
```

### Hover Tooltip

Standard ParetoChart tooltip shows:

- Category key
- Count value
- Cumulative percentage
- **When comparison mode active:**
  - Filtered % (current selection)
  - Overall % (full population)
  - Difference with directional arrow (↑/↓/→)

PerformancePareto tooltip shows:

- Channel label
- Rank (e.g., #1, #2)
- Cpk value
- Sample size (n)
- Health status (colored)

---

## Cross-App Usage

### PWA

The PWA uses a custom ParetoChart component in `apps/pwa/src/components/charts/ParetoChart.tsx` that derives data from DataContext:

```tsx
import ParetoChart from './components/charts/ParetoChart';

// Data is derived from DataContext based on factor column
<div className="h-[400px]">
  <ParetoChart
    factor="Shift"
    onDrillDown={handleDrillDown}
    showComparison={showComparison}
    onToggleComparison={() => setShowComparison(prev => !prev)}
    onHide={() => setParetoVisible(false)}
  />
</div>;
```

### PerformancePareto (Shared)

Use the responsive wrapper from `@variscout/charts` for Performance Mode:

```tsx
import PerformancePareto from '@variscout/charts/PerformancePareto';

<div className="h-[300px]">
  <PerformancePareto channels={channels} onChannelClick={handleClick} />
</div>;
```

### Excel Add-in

Use the Base variant with explicit sizing:

```tsx
import { PerformanceParetoBase } from '@variscout/charts/PerformancePareto';

<PerformanceParetoBase parentWidth={400} parentHeight={300} channels={channels} />;
```

---

## Colors and Theming

### Bar Colors

| Variant             | Condition    | Fill Color                |
| ------------------- | ------------ | ------------------------- |
| Standard (default)  | Unselected   | `chromeColors.boxDefault` |
| Standard (selected) | In selection | `chartColors.selected`    |
| Performance         | By health    | Health color (see above)  |

### Theme-Aware Colors

PerformancePareto uses `useChartTheme()` for automatic light/dark adaptation:

```typescript
const { chrome } = useChartTheme();

// Chrome colors adapt to theme:
// chrome.gridLine, chrome.axisPrimary, chrome.labelPrimary, etc.
```

Standard ParetoChart also uses `useChartTheme()` for theme-aware chrome colors.

### Cumulative Line & Reference Colors

```typescript
// Cumulative line
stroke={chartColors.cumulative}  // orange-500

// 80% threshold (standard)
stroke={chartColors.threshold80} // orange-500

// Cpk thresholds (performance)
stroke={chartColors.fail}        // red-500 (1.0)
stroke={chartColors.pass}        // green-500 (1.33)
```

---

## Responsive Behavior

X-axis labels are rotated 45 degrees when there are more than 10 categories in PerformancePareto. Labels longer than 8 characters are truncated with ellipsis.

---

## Exports

```typescript
// PWA Standard Pareto (local component, derives data from DataContext)
import ParetoChart from './components/charts/ParetoChart';

// Shared Performance Pareto (responsive wrapper)
import PerformancePareto from '@variscout/charts/PerformancePareto';

// Base component for manual sizing (Excel Add-in)
import { PerformanceParetoBase } from '@variscout/charts/PerformancePareto';

// Types
import type { PerformanceParetoProps } from '@variscout/charts';
```

---

## See Also

- [README](./README.md) - Chart design system overview and selection guide
- [Colors](./colors.md) - Chart color constants and health classification
- [Responsive](./responsive.md) - Breakpoints and scaling utilities
- [Hooks](./hooks.md) - useChartLayout, useChartTooltip, useSelectionState
- [Performance Mode](./performance-mode.md) - Full Performance Mode documentation
- [Overview](./overview.md) - All chart types and common patterns
- [Boxplot](./boxplot.md) - Distribution comparison charts
