# Excel Add-in Icons

## Icon Library

Use **Fluent UI System Icons** for Task Pane components.

```tsx
import {
  Settings24Regular,
  ChartMultiple24Regular,
  Info24Regular,
  Checkmark24Regular,
  Warning24Regular,
  Dismiss24Regular,
} from '@fluentui/react-icons';
```

---

## Icon Usage

### Navigation & Actions

| Icon                     | Usage           | Component        |
| ------------------------ | --------------- | ---------------- |
| `Settings24Regular`      | Settings button | Task Pane header |
| `ChartMultiple24Regular` | Charts tab      | Tab navigation   |
| `Info24Regular`          | Help tooltips   | Info buttons     |
| `Dismiss24Regular`       | Close, clear    | Clear filters    |

### Status Indicators

| Icon                   | Usage   | Context             |
| ---------------------- | ------- | ------------------- |
| `Checkmark24Regular`   | Success | Valid configuration |
| `Warning24Regular`     | Warning | Medium Cpk          |
| `ErrorCircle24Regular` | Error   | Invalid input       |

---

## Icon Sizing

| Size | Token       | Usage            |
| ---- | ----------- | ---------------- |
| 16px | `16Regular` | Inline with text |
| 20px | `20Regular` | Small buttons    |
| 24px | `24Regular` | Standard buttons |
| 32px | `32Regular` | Large emphasis   |

---

## Icon Colors

### Task Pane

```tsx
// Primary icon
<SettingsIcon style={{ color: tokens.colorNeutralForeground1 }} />

// Accent icon
<CheckmarkIcon style={{ color: tokens.colorPaletteGreenForeground1 }} />

// Subtle icon
<InfoIcon style={{ color: tokens.colorNeutralForeground2 }} />
```

### Content Add-in

```tsx
// Use chart colors from @variscout/charts
<WarningIcon style={{ color: chartColors.warning }} />
<ErrorIcon style={{ color: chartColors.fail }} />
```

---

## See Also

- [OVERVIEW](./OVERVIEW.md) - Design system overview
- [Components](./COMPONENTS.md) - Component patterns
