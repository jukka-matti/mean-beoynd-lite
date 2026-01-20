# Excel Add-in Color System

## Light Theme (Task Pane)

The Task Pane uses Fluent UI's standard light theme (`webLightTheme`).

### Brand Colors

| Token                   | Usage                          | Example                 |
| ----------------------- | ------------------------------ | ----------------------- |
| `colorBrandForeground1` | Primary accent, headers, icons | Step icons, page titles |

### Neutral Colors

| Token                     | Usage                | Example                       |
| ------------------------- | -------------------- | ----------------------------- |
| `colorNeutralBackground1` | Main background      | Root container                |
| `colorNeutralBackground3` | Secondary background | Data preview areas            |
| `colorNeutralForeground1` | Primary text         | Body content                  |
| `colorNeutralForeground2` | Secondary text       | Descriptions, hints, disabled |
| `colorNeutralStroke1`     | Borders, dividers    | Section separators            |

### Status Colors

| Token                             | Meaning            | Usage                     |
| --------------------------------- | ------------------ | ------------------------- |
| `colorPaletteGreenBackground1`    | Success background | Config success banner     |
| `colorPaletteGreenForeground1`    | Success text       | Pass indicators, good Cpk |
| `colorPaletteMarigoldForeground1` | Warning text       | Medium Cpk (1.0-1.33)     |
| `colorPaletteYellowForeground2`   | Warning (alt)      | Warning messages          |
| `colorPaletteRedForeground1`      | Error text         | Errors, poor Cpk (<1.0)   |

---

## Dark Theme (Content Add-in)

The Content Add-in uses a **token-based dark theme** defined in `apps/excel-addin/src/lib/darkTheme.ts`.

**Important:** Always use `darkTheme` tokens instead of hardcoded hex values.

```tsx
import { darkTheme } from '../lib/darkTheme';

// ✅ Correct
backgroundColor: darkTheme.colorNeutralBackground1,

// ❌ Incorrect
backgroundColor: '#1e293b',
```

### Dark Theme Token Reference

| Token                          | Hex       | Usage                     |
| ------------------------------ | --------- | ------------------------- |
| `colorNeutralBackground1`      | `#1e293b` | Main container background |
| `colorNeutralBackground2`      | `#334155` | Card/section backgrounds  |
| `colorNeutralBackground3`      | `#475569` | Elevated surfaces         |
| `colorNeutralForeground1`      | `#f1f5f9` | Primary text              |
| `colorNeutralForeground2`      | `#94a3b8` | Secondary text            |
| `colorNeutralStroke1`          | `#475569` | Borders                   |
| `colorNeutralStrokeAccessible` | `#64748b` | Focus rings               |

### Chart Colors (Content Add-in)

Uses `@variscout/charts` color constants:

| Color                 | Hex       | Usage                |
| --------------------- | --------- | -------------------- |
| `chartColors.pass`    | `#22c55e` | Within spec          |
| `chartColors.fail`    | `#ef4444` | Above USL            |
| `chartColors.warning` | `#f59e0b` | Below LSL            |
| `chartColors.mean`    | `#3b82f6` | Center line          |
| `chartColors.spec`    | `#ef4444` | Specification limits |

---

## See Also

- [OVERVIEW](./OVERVIEW.md) - Design system overview
- [Typography](./TYPOGRAPHY.md) - Font sizes
