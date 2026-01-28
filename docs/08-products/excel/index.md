# Excel Add-in

VariScout charts embedded in Microsoft Excel.

---

## Overview

The Excel Add-in brings VariScout's statistical charts into Excel workbooks:

- Works with Excel data directly
- Uses native Excel slicers for filtering
- Visx charts in Content Add-in
- Fluent UI for task pane

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
- [Office.js API](office-js-api.md)
- [Design System](design-system.md)
