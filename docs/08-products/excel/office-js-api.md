# Office.js API Reference

Key Office.js APIs used in the Excel Add-in.

---

## API Requirements

| Feature           | API Level     | Notes                 |
| ----------------- | ------------- | --------------------- |
| Tables            | ExcelApi 1.1  | Core functionality    |
| Slicers           | ExcelApi 1.10 | For linked filtering  |
| Custom Properties | ExcelApi 1.4  | For state persistence |
| Data Validation   | ExcelApi 1.8  | For spec input        |

---

## Common Operations

### Reading Table Data

```typescript
await Excel.run(async context => {
  const table = context.workbook.tables.getItem('DataTable');
  const range = table.getDataBodyRange();
  range.load('values');
  await context.sync();

  const data = range.values;
  // Process data...
});
```

### Getting Filtered Data (via Slicer)

```typescript
await Excel.run(async context => {
  const table = context.workbook.tables.getItem('DataTable');
  const visibleRange = table.getDataBodyRange().getVisibleView();
  visibleRange.load('values');
  await context.sync();

  // Only visible (filtered) rows
  const filteredData = visibleRange.values;
});
```

### Persisting State

```typescript
await Excel.run(async context => {
  const customProps = context.workbook.properties.custom;
  customProps.add('variscout_settings', JSON.stringify(settings));
  await context.sync();
});
```

### Reading State

```typescript
await Excel.run(async context => {
  const customProps = context.workbook.properties.custom;
  const settingsProp = customProps.getItemOrNullObject('variscout_settings');
  settingsProp.load('value');
  await context.sync();

  if (!settingsProp.isNullObject) {
    const settings = JSON.parse(settingsProp.value);
  }
});
```

---

## Slicer Events

Excel doesn't provide slicer change events, so we poll:

```typescript
let lastFilterState = '';

setInterval(async () => {
  const currentState = await getFilterHash();
  if (currentState !== lastFilterState) {
    lastFilterState = currentState;
    await refreshCharts();
  }
}, 500);
```

---

## Best Practices

1. **Batch operations** - Use single `Excel.run()` for multiple operations
2. **Load only what you need** - Specify properties to load
3. **Handle errors** - Excel.run can throw; wrap in try/catch
4. **Sync strategically** - Minimize `context.sync()` calls

---

## See Also

- [Office.js Documentation](https://docs.microsoft.com/en-us/office/dev/add-ins/excel/)
- [Architecture](architecture.md)
