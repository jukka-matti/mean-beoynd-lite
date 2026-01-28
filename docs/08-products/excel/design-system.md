# Excel Add-in Design System

Design tokens and styling for the Excel Add-in.

---

## Token Systems

| Context        | Token System       |
| -------------- | ------------------ |
| Task Pane      | Fluent UI `tokens` |
| Content Add-in | Custom `darkTheme` |

---

## Dark Theme Tokens

The Content Add-in uses a custom dark theme matching VariScout:

```typescript
// lib/darkTheme.ts
export const darkTheme = {
  // Backgrounds
  colorNeutralBackground1: '#0f172a', // slate-900
  colorNeutralBackground2: '#1e293b', // slate-800
  colorNeutralBackground3: '#334155', // slate-700

  // Foregrounds
  colorNeutralForeground1: '#f1f5f9', // slate-100
  colorNeutralForeground2: '#cbd5e1', // slate-300
  colorNeutralForeground3: '#94a3b8', // slate-400

  // Brand
  colorBrandBackground: '#3b82f6', // blue-500
  colorBrandBackgroundHover: '#2563eb', // blue-600

  // Status
  colorPaletteGreenBackground: '#22c55e', // green-500
  colorPaletteRedBackground: '#ef4444', // red-500
  colorPaletteYellowBackground: '#f59e0b', // amber-500
};
```

---

## Usage

### Content Add-in

```tsx
import { darkTheme } from '../lib/darkTheme';

const styles = {
  container: {
    backgroundColor: darkTheme.colorNeutralBackground1,
    color: darkTheme.colorNeutralForeground1,
    padding: '16px',
  },
  label: {
    color: darkTheme.colorNeutralForeground3,
    fontSize: '12px',
  },
};
```

### Task Pane (Fluent UI)

```tsx
import { tokens } from '@fluentui/react-components';

const styles = {
  container: {
    backgroundColor: tokens.colorNeutralBackground1,
    padding: tokens.spacingVerticalM,
  },
};
```

---

## Color Mapping

| Semantic Use     | Dark Theme Token               | Tailwind Equivalent |
| ---------------- | ------------------------------ | ------------------- |
| Page background  | `colorNeutralBackground1`      | `bg-slate-900`      |
| Panel background | `colorNeutralBackground2`      | `bg-slate-800`      |
| Primary text     | `colorNeutralForeground1`      | `text-slate-100`    |
| Secondary text   | `colorNeutralForeground3`      | `text-slate-400`    |
| Pass/success     | `colorPaletteGreenBackground`  | `text-green-500`    |
| Fail/error       | `colorPaletteRedBackground`    | `text-red-500`      |
| Warning          | `colorPaletteYellowBackground` | `text-amber-500`    |

---

## See Also

- [Design System Overview](../../06-design-system/index.md)
- [Chart Colors](../../06-design-system/charts/colors.md)
