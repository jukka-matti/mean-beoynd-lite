# VariScout Design System

A unified design system for VariScout Lite covering both PWA and Excel Add-in platforms.

## Principles

1. **Dark-first** - Optimized for dark theme across both platforms
2. **Data-focused** - Colors prioritize data visibility and status communication
3. **Consistent semantics** - Same meaning for colors across platforms
4. **Responsive** - Adapts to screen size without losing functionality
5. **Accessible** - WCAG AA compliant contrast ratios

## Platform Differences

| Aspect     | PWA                  | Excel Add-in                 |
| ---------- | -------------------- | ---------------------------- |
| Styling    | Tailwind CSS classes | Fluent UI tokens + CSS-in-JS |
| Theme      | Dark slate palette   | darkTheme token system       |
| Icons      | Lucide React         | Fluent UI icons              |
| Components | Custom + Tailwind    | Fluent UI components         |

Both platforms share the same **color values** and **semantic meanings**.

## Quick Reference

### Tokens

- [Colors](./tokens/colors.md) - Color palette and semantic usage
- [Typography](./tokens/typography.md) - Fonts, sizes, weights
- [Spacing](./tokens/spacing.md) - Spacing scale and units

### Charts

- [Overview](./charts/overview.md) - Chart styling principles
- [Colors](./charts/colors.md) - Data visualization palette
- [Responsive](./charts/responsive.md) - Breakpoints and scaling

### Components

- [Buttons](./components/buttons.md) - Button variants
- [Cards](./components/cards.md) - Cards and panels
- [Modals](./components/modals.md) - Modal patterns
- [Forms](./components/forms.md) - Form elements

### Patterns

- [Layout](./patterns/layout.md) - Page layouts
- [Feedback](./patterns/feedback.md) - Status and loading states

## Platform-Specific Docs

For detailed Excel Add-in patterns using Fluent UI:

- [Excel Add-in Design System](../EXCEL_ADDIN_DESIGN_SYSTEM.md)

## Usage

### PWA (Tailwind)

```jsx
<button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2">
  Primary Button
</button>
```

### Excel Add-in (darkTheme)

```tsx
import { darkTheme } from '../lib/darkTheme';

const styles = {
  button: {
    backgroundColor: darkTheme.colorBrandBackground,
    color: darkTheme.colorNeutralForeground1,
  },
};
```

### Charts (Visx)

```tsx
<Circle fill="#22c55e" /> // In-spec point
<Circle fill="#ef4444" /> // Out of spec (high)
```
