# Boxplot

The Boxplot is VariScout's tool for the **FLOW** pillar - comparing variation across factors.

---

## Purpose

_"Which upstream inputs explain the variation I see downstream?"_

The Boxplot reveals:

- Comparison across factors (Machine A vs B vs C)
- Between-group vs within-group variation
- Which subgroup contributes most variation
- The "soup ingredients" that create the output

---

## Key Elements

| Element     | Description                                     |
| ----------- | ----------------------------------------------- |
| Box         | Interquartile range (IQR, 25th-75th percentile) |
| Median line | Middle value (50th percentile)                  |
| Whiskers    | Extend to 1.5×IQR from box                      |
| Outliers    | Points beyond whiskers                          |

---

## ANOVA Statistics

When comparing factors, VariScout calculates:

| Statistic        | Description                      |
| ---------------- | -------------------------------- |
| F-statistic      | Ratio of between/within variance |
| p-value          | Probability of chance difference |
| η² (eta-squared) | Proportion of variance explained |

---

## Interpretation

| Pattern               | Meaning                         |
| --------------------- | ------------------------------- |
| Non-overlapping boxes | Significant difference          |
| High η²               | Factor explains much variation  |
| Wide box              | High variation within group     |
| Many outliers         | Check data quality or subgroups |

---

## Linked Filtering

Click any box to:

- Filter all charts to that subgroup
- See I-Chart for just that factor level
- Continue drill-down analysis

---

## See Also

- [FLOW Pillar](../../01-vision/four-pillars/flow.md)
- [Drill-Down](../navigation/drill-down.md)
- [Chart Design](../../06-design-system/charts/boxplot.md)
