# Chart Colors

Data visualization colors for VariScout charts.

## Data Point Colors

### Spec Status Colors

| Status             | Hex       | Usage                       |
| ------------------ | --------- | --------------------------- |
| In-spec            | `#22c55e` | Values within LSL-USL range |
| Out-of-spec (high) | `#ef4444` | Values > USL                |
| Out-of-spec (low)  | `#f59e0b` | Values < LSL                |

```tsx
const getPointColor = (value: number, usl?: number, lsl?: number): string => {
  if (usl !== undefined && value > usl) return '#ef4444';
  if (lsl !== undefined && value < lsl) return '#f59e0b';
  return '#22c55e';
};
```

### Control Status Colors

| Status         | Hex       | Usage           |
| -------------- | --------- | --------------- |
| In control     | `#22c55e` | Within UCL/LCL  |
| Out of control | `#ef4444` | Outside UCL/LCL |

## Line Colors

| Element    | Hex       | Style        | Usage            |
| ---------- | --------- | ------------ | ---------------- |
| USL        | `#ef4444` | Dashed (6,3) | Upper spec limit |
| LSL        | `#f59e0b` | Dashed (6,3) | Lower spec limit |
| Target     | `#22c55e` | Dashed (4,4) | Target value     |
| UCL/LCL    | `#3b82f6` | Dashed (4,4) | Control limits   |
| Mean/CL    | `#64748b` | Solid        | Center line      |
| Regression | `#3b82f6` | Solid        | Linear fit       |
| Quadratic  | `#8b5cf6` | Solid        | Polynomial fit   |

## Grid & Axis

| Element      | Hex       | Opacity | Usage           |
| ------------ | --------- | ------- | --------------- |
| Grid rows    | `#334155` | 50%     | Horizontal grid |
| Grid columns | `#334155` | 30%     | Vertical grid   |
| Axis stroke  | `#64748b` | 100%    | Axis lines      |
| Tick stroke  | `#64748b` | 100%    | Tick marks      |
| Axis labels  | `#94a3b8` | 100%    | Axis text       |

## Category Colors

For multi-series charts (Boxplot, InteractionPlot):

```tsx
const CATEGORY_COLORS = [
  '#3b82f6', // blue-500
  '#22c55e', // green-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#06b6d4', // cyan-500
  '#84cc16', // lime-500
];
```

## Pareto Chart

| Element         | Hex       | Usage                 |
| --------------- | --------- | --------------------- |
| Default bar     | `#3b82f6` | Unselected bars       |
| Selected bar    | `#0ea5e9` | Currently filtered    |
| Unselected bar  | `#475569` | When filtering active |
| Cumulative line | `#f97316` | 80% reference         |
| 80% threshold   | `#f97316` | Horizontal line       |

## Gage R&R Chart

| Component       | Hex       | Usage                   |
| --------------- | --------- | ----------------------- |
| Part-to-Part    | `#22c55e` | Good (actual variation) |
| Repeatability   | `#3b82f6` | Equipment variation     |
| Reproducibility | `#f59e0b` | Operator variation      |
| Background bar  | `#334155` | 100% reference          |
| 10% threshold   | `#22c55e` | Excellent GRR line      |
| 30% threshold   | `#ef4444` | Acceptable limit line   |

## Tooltip

```tsx
const tooltipStyle = {
  background: '#1e293b',
  border: '1px solid #334155',
  color: '#f1f5f9',
  fontSize: 12,
  padding: '8px 12px',
};
```

## Branding Bar

| Element     | Hex       | Usage            |
| ----------- | --------- | ---------------- |
| Background  | `#334155` | 60% opacity      |
| Accent bar  | `#3b82f6` | Left edge marker |
| Text        | `#94a3b8` | Branding text    |
| Sample size | `#64748b` | "n = X" text     |

## Implementation

### SVG Elements

```tsx
// Grid
<GridRows stroke="#334155" strokeOpacity={0.5} />

// Spec lines
<line
  stroke="#ef4444"
  strokeWidth={1.5}
  strokeDasharray="6,3"
/>

// Data points
<Circle
  fill={getPointColor(value, specs.usl, specs.lsl)}
  stroke="#fff"
  strokeWidth={1}
/>
```

### Consistent Application

All chart colors are defined inline in SVG for:

1. **Simplicity** - No external theme dependency
2. **Portability** - Charts work in any context
3. **Performance** - No runtime theme lookups

When adding new charts, reference this palette to maintain consistency.
