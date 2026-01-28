# Linked Filtering

Linked filtering connects all charts so clicking one filters all others.

---

## Concept

When you click on one chart, all others respond:

| Action                       | System Response                                            |
| ---------------------------- | ---------------------------------------------------------- |
| Click "Machine B" in Boxplot | I-Chart shows only Machine B's timeline                    |
|                              | Pareto shows only Machine B's failure modes                |
|                              | Capability recalculates for Machine B alone                |
| Click "Above UCL" in I-Chart | Boxplot highlights which factors had out-of-control points |
|                              | Pareto shows defect types during unstable periods          |

---

## Why It Matters

This isn't just a UI feature — it's how the Four Pillars interconnect:

```
        ┌─────────┐
        │ CHANGE  │ ← Click a time region
        │(I-Chart)│
        └────┬────┘
             │
             ▼
┌─────────┐     ┌─────────┐
│  FLOW   │◄───►│ FAILURE │ ← See which factors/failures
│(Boxplot)│     │(Pareto) │    were active then
└────┬────┘     └────┬────┘
     │               │
     └───────┬───────┘
             │
             ▼
        ┌─────────┐
        │  VALUE  │ ← Capability updates
        │(Capable)│    for filtered subset
        └─────────┘
```

---

## Implementation

### State Management

```typescript
// DataContext maintains filter state
const { filters, setFilter, clearFilters } = useDataContext();

// Filters propagate to all charts
<IChart data={filteredData} />
<Boxplot data={filteredData} />
<ParetoChart data={filteredData} />
```

### Click Handlers

```typescript
// Boxplot click handler
const handleBoxClick = (factor: string, level: string) => {
  setFilter(factor, level);
  // All charts automatically re-render with filtered data
};
```

---

## Platform Support

| Platform | Implementation          |
| -------- | ----------------------- |
| PWA      | React Context state     |
| Excel    | Native Excel slicers    |
| Azure    | React Context state     |
| Power BI | Native Power BI slicers |

---

## See Also

- [Drill-Down](drill-down.md)
- [Breadcrumbs](breadcrumbs.md)
- [Four Pillars](../../01-vision/four-pillars/index.md)
