# Excel Add-in

VariScout core SPC charts embedded in Microsoft Excel. **Free forever** on AppSource.

---

## Overview

The Excel Add-in brings VariScout's core statistical charts into Excel workbooks:

- Works with Excel data directly
- Uses native Excel slicers for filtering
- Visx charts in Content Add-in
- Fluent UI for task pane
- **Always free** — no license detection, no Graph API

### Feature Scope

| Feature              | Excel Add-in | Azure App |
| -------------------- | :----------: | :-------: |
| I-Chart              |      ✓       |     ✓     |
| Boxplot              |      ✓       |     ✓     |
| Pareto               |      ✓       |     ✓     |
| Capability Histogram |      ✓       |     ✓     |
| Performance Mode     |      -       |     ✓     |
| Gage R&R             |      -       |     ✓     |
| Regression           |      -       |     ✓     |
| Probability Plot     |      -       |     ✓     |

The Excel Add-in provides core SPC analysis. Users who need multi-channel Performance Mode, Gage R&R, or team collaboration upgrade to the [Azure App](../azure/index.md) (€150/month).

---

## Architecture

**Hybrid Approach:**

- **Task Pane**: Setup wizard, configuration, settings (Fluent UI)
- **Content Add-in**: Embedded Visx charts (dark theme)

```
┌─────────────────────────────────────────────────────────────────┐
│                        EXCEL WORKBOOK                            │
├─────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    EXCEL TABLE                             │  │
│  │   Data rows with columns for measures and factors         │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│  ┌───────────┐  ┌───────────────────────────────────────────┐  │
│  │ Task Pane │  │          Content Add-in (Charts)          │  │
│  │           │  │  ┌─────────┐  ┌─────────┐  ┌─────────┐   │  │
│  │ - Setup   │  │  │ I-Chart │  │ Boxplot │  │ Pareto  │   │  │
│  │ - Config  │  │  └─────────┘  └─────────┘  └─────────┘   │  │
│  │ - Help    │  │                                           │  │
│  └───────────┘  └───────────────────────────────────────────┘  │
│                              │                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    EXCEL SLICERS                          │  │
│  │   Native filtering (Shift, Machine, Operator, etc.)       │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Styling

| Component      | Styling System           |
| -------------- | ------------------------ |
| Task Pane      | Fluent UI `tokens`       |
| Content Add-in | `darkTheme` token system |

**Never hardcode colors** - always use token references:

```tsx
import { darkTheme } from '../lib/darkTheme';

const styles = {
  backgroundColor: darkTheme.colorNeutralBackground1,
  color: darkTheme.colorNeutralForeground1,
};
```

---

## State Management

- State sync via Custom Document Properties (`stateBridge.ts`)
- Charts poll for slicer changes (no native events)
- Use `getFilteredTableData()` to read visible rows

---

## Office.js APIs

| API Level      | Required For |
| -------------- | ------------ |
| ExcelApi 1.9+  | Chart types  |
| ExcelApi 1.10+ | Slicers      |

---

## See Also

- [Architecture](architecture.md)
- [Strategy](strategy.md)
- [Design System](design-system.md)
- [License Model](license-detection.md)
