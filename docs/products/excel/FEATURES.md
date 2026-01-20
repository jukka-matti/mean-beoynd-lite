# Excel Add-in Features

## Core Analysis Features

All analysis features are available in both Free and Paid tiers.

---

## Charts

### I-Chart (Individuals Control Chart)

- Auto-calculated control limits (x̄ ± 2.66MR̄)
- Specification limit overlay (USL/LSL)
- Time-based point plotting
- Out-of-control point highlighting

### Boxplot

- Factor comparison (Machine, Shift, Operator, etc.)
- IQR-based outlier detection
- Median and quartile visualization
- ANOVA integration (F-stat, p-value)

### Pareto Chart

- Frequency analysis of categorical columns
- Cumulative percentage line
- Click-to-filter interaction
- Category ranking

### Capability Analysis

- Cp/Cpk calculation
- Histogram with spec limits
- Pass/fail percentage
- Distribution visualization

---

## Performance Mode (Multi-Measure Analysis)

Analyze multiple measurement channels simultaneously:

- **Performance I-Chart**: Cpk scatter plot by channel
- **Performance Boxplot**: Distribution comparison (up to 5 channels)
- **Performance Pareto**: Cpk ranking (worst first, up to 20 channels)
- **Drill-down**: Click to navigate to standard I-Chart for detailed analysis

### Workflow

```
1. Select wide-format data (multiple measure columns)
2. VaRiScout detects performance mode opportunity
3. Configure spec limits per measure or shared
4. View Cpk comparison across all channels
5. Click worst performer → drill to detailed analysis
```

---

## Interactive Features

### FilterBar (Breadcrumb Trail)

Displays current filter state as clickable breadcrumbs:

```
All Data → Machine (67%) → Machine B (89%) → [Clear]
```

- Shows variation percentage at each level
- Click breadcrumb to go back
- Clear button resets all filters

### Click-to-Filter

Click any chart element to filter all charts:

- I-Chart point → Filter by that observation's factors
- Boxplot box → Filter to that category
- Pareto bar → Filter to that defect type

### Copy to Clipboard

- Copy individual chart as image
- Copy all charts as composite image
- Paste into PowerPoint, Word, email

### Insert to Worksheet

- Insert chart as static image in Excel
- Positioned near data or in specified range
- Good for documentation

### Write Stats to Cells

- Write Cp, Cpk, Mean, StdDev to worksheet cells
- Creates stats table adjacent to data
- Updates when data changes

---

## Excel-Specific Features

### Native Slicer Integration

- VaRiScout respects Excel slicer filters
- Filter data with slicers → charts update automatically
- No need to reconfigure

### Selection Detection

- Auto-detect selected range
- Smart column type inference (numeric, categorical, datetime)
- Suggest column mappings

---

## See Also

- [Overview](./OVERVIEW.md) - Product summary
- [Architecture](./ARCHITECTURE.md) - Technical architecture
