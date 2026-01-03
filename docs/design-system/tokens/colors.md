# Color System

VariScout uses a dark theme based on Tailwind's slate palette with semantic color assignments.

## Background Colors

| Token                  | Hex       | PWA (Tailwind) | Excel (darkTheme)         | Usage                 |
| ---------------------- | --------- | -------------- | ------------------------- | --------------------- |
| background-app         | `#0f172a` | `bg-slate-900` | `colorNeutralBackground1` | App background        |
| background-card        | `#1e293b` | `bg-slate-800` | `colorNeutralBackground2` | Cards, panels         |
| background-elevated    | `#334155` | `bg-slate-700` | `colorNeutralBackground3` | Hover states, inputs  |
| background-interactive | `#475569` | `bg-slate-600` | `colorNeutralBackground4` | Active/pressed states |

## Text Colors

| Token          | Hex       | PWA (Tailwind)   | Excel (darkTheme)         | Usage                 |
| -------------- | --------- | ---------------- | ------------------------- | --------------------- |
| text-primary   | `#f1f5f9` | `text-slate-100` | `colorNeutralForeground1` | Main text, headings   |
| text-secondary | `#94a3b8` | `text-slate-400` | `colorNeutralForeground2` | Labels, descriptions  |
| text-tertiary  | `#64748b` | `text-slate-500` | `colorNeutralForeground3` | Placeholder, disabled |
| text-muted     | `#475569` | `text-slate-600` | `colorNeutralForeground4` | Very subtle text      |

## Border Colors

| Token              | Hex       | PWA (Tailwind)     | Excel (darkTheme)     | Usage         |
| ------------------ | --------- | ------------------ | --------------------- | ------------- |
| border-default     | `#334155` | `border-slate-700` | `colorNeutralStroke1` | Card borders  |
| border-subtle      | `#1e293b` | `border-slate-800` | `colorNeutralStroke2` | Dividers      |
| border-interactive | `#475569` | `border-slate-600` | `colorNeutralStroke3` | Input borders |

## Status Colors

These colors have **consistent semantic meaning** across the entire application.

| Token   | Hex       | PWA (Tailwind)   | Excel (darkTheme)    | Usage                           |
| ------- | --------- | ---------------- | -------------------- | ------------------------------- |
| success | `#22c55e` | `text-green-500` | `colorStatusSuccess` | Pass, in-spec, valid            |
| danger  | `#ef4444` | `text-red-500`   | `colorStatusDanger`  | Fail, out of spec (high), error |
| warning | `#f59e0b` | `text-amber-500` | `colorStatusWarning` | Warning, out of spec (low)      |

### Status Usage in Data Analysis

| Scenario                 | Color             | Meaning              |
| ------------------------ | ----------------- | -------------------- |
| Value within spec limits | Green (`#22c55e`) | Pass                 |
| Value > USL              | Red (`#ef4444`)   | Fail (too high)      |
| Value < LSL              | Amber (`#f59e0b`) | Fail (too low)       |
| Cpk >= 1.33              | Green             | Excellent capability |
| Cpk 1.0-1.33             | Amber             | Acceptable, monitor  |
| Cpk < 1.0                | Red               | Needs improvement    |

## Brand Colors

| Token         | Hex       | PWA (Tailwind)      | Excel (darkTheme)           | Usage                    |
| ------------- | --------- | ------------------- | --------------------------- | ------------------------ |
| brand-primary | `#3b82f6` | `bg-blue-600`       | `colorBrandBackground`      | Primary buttons, accents |
| brand-hover   | `#2563eb` | `hover:bg-blue-700` | `colorBrandBackgroundHover` | Hover state              |
| brand-light   | `#60a5fa` | `text-blue-400`     | `colorBrandForeground1`     | Links, highlights        |

## Chart-Specific Colors

See [Charts > Colors](../charts/colors.md) for data visualization colors.

## Accessibility

All color combinations meet WCAG AA contrast requirements:

- Text on background: minimum 4.5:1 ratio
- Large text: minimum 3:1 ratio
- UI components: minimum 3:1 ratio

| Combination                       | Contrast Ratio | Pass |
| --------------------------------- | -------------- | ---- |
| text-primary on background-app    | 13.5:1         | AAA  |
| text-secondary on background-card | 5.2:1          | AA   |
| success on background-card        | 4.8:1          | AA   |
| danger on background-card         | 4.6:1          | AA   |

## Implementation Examples

### PWA Button

```jsx
// Primary button
<button className="bg-blue-600 hover:bg-blue-700 text-white">
  Save
</button>

// Success state
<span className="text-green-500">In Spec</span>

// Danger state
<span className="text-red-500">Out of Spec</span>
```

### Excel Add-in

```tsx
import { darkTheme } from '../lib/darkTheme';

const styles = {
  card: {
    backgroundColor: darkTheme.colorNeutralBackground2,
    borderColor: darkTheme.colorNeutralStroke1,
  },
  successText: {
    color: darkTheme.colorStatusSuccess,
  },
};
```

### Chart SVG

```tsx
// Data point colors
const getPointColor = (value: number, usl?: number, lsl?: number) => {
  if (usl !== undefined && value > usl) return '#ef4444'; // Red
  if (lsl !== undefined && value < lsl) return '#f59e0b'; // Amber
  return '#22c55e'; // Green
};
```
