# Office.js API Usage

## API Requirements

| Feature            | Required API Version |
| ------------------ | -------------------- |
| Basic table access | ExcelApi 1.1         |
| Named ranges       | ExcelApi 1.4         |
| Chart types        | ExcelApi 1.9+        |
| Slicers            | ExcelApi 1.10+       |
| Custom properties  | ExcelApi 1.1         |

---

## Key API Operations

### Reading Data

```typescript
// Get selected range data
async function getSelectedData() {
  return Excel.run(async context => {
    const range = context.workbook.getSelectedRange();
    range.load(['values', 'address', 'rowCount', 'columnCount']);
    await context.sync();

    return {
      values: range.values,
      address: range.address,
      rows: range.rowCount,
      cols: range.columnCount,
    };
  });
}
```

### Writing to Cells

```typescript
// Write stats to cells
async function writeStatsToWorksheet(stats: StatsResult) {
  return Excel.run(async context => {
    const sheet = context.workbook.worksheets.getActiveWorksheet();
    const range = sheet.getRange('F1:G5');

    range.values = [
      ['Statistic', 'Value'],
      ['Mean', stats.mean],
      ['Std Dev', stats.stdDev],
      ['Cp', stats.cp],
      ['Cpk', stats.cpk],
    ];

    await context.sync();
  });
}
```

### Slicer Integration

```typescript
// Get filtered data from slicer
async function getFilteredTableData(tableName: string) {
  return Excel.run(async context => {
    const table = context.workbook.tables.getItem(tableName);
    const bodyRange = table.getDataBodyRange();
    bodyRange.load(['values']);

    // Get visible rows only
    const visibleRange = bodyRange.getVisibleView();
    visibleRange.load(['values']);

    await context.sync();

    return visibleRange.values;
  });
}
```

---

## Custom Document Properties

Used for settings persistence (paid tier):

```typescript
// Save settings
async function saveSettings(settings: VaRiScoutSettings) {
  return Excel.run(async context => {
    const docProperties = context.workbook.properties.custom;
    docProperties.add('VaRiScout_Settings', JSON.stringify(settings));
    await context.sync();
  });
}

// Load settings
async function loadSettings(): Promise<VaRiScoutSettings | null> {
  return Excel.run(async context => {
    const docProperties = context.workbook.properties.custom;
    const settingsProp = docProperties.getItemOrNullObject('VaRiScout_Settings');
    settingsProp.load('value');
    await context.sync();

    if (settingsProp.isNullObject) return null;
    return JSON.parse(settingsProp.value);
  });
}
```

---

## Platform Considerations

| Platform  | Notes                            |
| --------- | -------------------------------- |
| Excel Win | Full API support                 |
| Excel Mac | Full API support                 |
| Excel Web | Most features, some limitations  |
| Excel iOS | Basic support, limited task pane |

---

## See Also

- [Architecture](./ARCHITECTURE.md) - Overall architecture
- [Settings Storage](./SETTINGS-STORAGE.md) - Persistence details
