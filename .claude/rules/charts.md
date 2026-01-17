# Charts Package Rules (@variscout/charts)

## Component Pattern

- All charts are **props-based** (no context dependency)
- Export both wrapped and base components:
  - `IChart` - Responsive wrapper (uses `withParentSize`)
  - `IChartBase` - Raw component for custom sizing

## Props Interface

```typescript
interface ChartProps extends BaseChartProps {
  data: DataType[];
  specs: SpecLimits;
  showBranding?: boolean;
  // ... chart-specific props
}
```

## Responsive Utilities

- `getResponsiveMargins(width, chartType, extraBottom)`
- `getResponsiveFonts(width)` - Returns tick/axis/stat font sizes
- `getResponsiveTickCount(size, axis)` - Optimal tick count

## Color Constants

All chart colors are centralized in `packages/charts/src/colors.ts`:

```typescript
import { chartColors, chromeColors, operatorColors } from './colors';

// Semantic data colors
chartColors.pass; // #22c55e - within spec
chartColors.fail; // #ef4444 - above USL
chartColors.warning; // #f59e0b - below LSL
chartColors.mean; // #3b82f6 - center line
chartColors.spec; // #ef4444 - specification limits

// UI chrome colors
chromeColors.tooltipBg; // #1e293b
chromeColors.labelSecondary; // #94a3b8
chromeColors.axisSecondary; // #64748b

// Multi-series colors
operatorColors; // 8-color array for operators/categories
```

**Never hardcode hex values** - always use color constants.

## Theme-Aware Colors

Charts support automatic theme switching via the `useChartTheme` hook:

### useChartTheme Hook

```typescript
import { useChartTheme } from '@variscout/charts';

const MyChart = () => {
  const { isDark, chrome, fontScale } = useChartTheme();

  // Use chrome.xxx instead of hardcoded hex colors:
  // chrome.gridLine, chrome.axisPrimary, chrome.labelPrimary, etc.
};
```

Returns:

- `isDark: boolean` - Whether dark theme is active
- `chrome: ChromeColorValues` - Theme-appropriate chrome colors
- `fontScale: number` - Font scale from `data-chart-scale` attribute

### Color Functions

- `getChromeColors(isDark)` - Get appropriate chrome colors for theme
- `getDocumentTheme()` - Detect theme from `data-theme` attribute

### Chrome Color Mapping

| Dark Theme | Light Theme | Property                |
| ---------- | ----------- | ----------------------- |
| `#1e293b`  | `#f1f5f9`   | `chrome.gridLine`       |
| `#94a3b8`  | `#64748b`   | `chrome.axisPrimary`    |
| `#64748b`  | `#94a3b8`   | `chrome.axisSecondary`  |
| `#cbd5e1`  | `#334155`   | `chrome.labelPrimary`   |
| `#94a3b8`  | `#64748b`   | `chrome.labelSecondary` |

## Branding

- `ChartSourceBar` component for footer branding
- `getSourceBarHeight(showBranding)` for margin calculations
- Controlled by edition system in `@variscout/core`

## Adding New Charts

1. Create `NewChart.tsx` with `NewChartBase` export
2. Add to `packages/charts/src/index.ts` exports
3. Add props interface to `types.ts`
