# Excel Add-in Architecture

Technical architecture for the Excel Add-in.

---

## Component Structure

```
apps/excel-addin/
├── src/
│   ├── taskpane/           # Task Pane (Fluent UI)
│   │   ├── components/     # Setup wizard, config forms
│   │   └── TaskPane.tsx    # Main entry
│   ├── content/            # Content Add-in (Charts)
│   │   ├── ContentDashboard.tsx
│   │   └── ContentPerformanceDashboard.tsx
│   ├── lib/
│   │   ├── darkTheme.ts    # Token definitions
│   │   └── stateBridge.ts  # State persistence
│   └── components/         # Shared components
```

---

## Data Flow

```
EXCEL TABLE                 STATE BRIDGE              CHARTS
    │                            │                       │
    │── getTableData() ─────────▶│                       │
    │                            │── Store in CDP ──────▶│
    │                            │   (Custom Doc Props)  │
    │                            │                       │
    │── Slicer filter ──────────▶│                       │
    │                            │── getFilteredData() ─▶│
    │                            │                       │
    │                            │── Update charts ─────▶│
```

---

## State Bridge

Since Excel lacks real-time events for slicer changes, we use polling:

```typescript
// stateBridge.ts
export async function getFilteredTableData(): Promise<DataRow[]> {
  return Excel.run(async context => {
    const table = context.workbook.tables.getItem('DataTable');
    const visibleRange = table.getDataBodyRange().getVisibleView();
    visibleRange.load('values');
    await context.sync();
    return parseRows(visibleRange.values);
  });
}
```

Charts poll every 500ms for changes.

---

## Custom Document Properties

State persisted in the workbook:

| Property             | Content                            |
| -------------------- | ---------------------------------- |
| `variscout_settings` | JSON: column mappings, spec limits |
| `variscout_state`    | JSON: current view, selections     |

---

## See Also

- [Office.js API](office-js-api.md)
- [State Bridge Implementation](../../05-technical/integrations/shared-ui.md)
