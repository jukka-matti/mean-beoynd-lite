# I-Chart (Individuals Chart)

The I-Chart is VariScout's tool for the **CHANGE** pillar - analyzing time-based stability.

---

## Purpose

_"Is the process stable, or is something degrading/shifting over time?"_

The I-Chart reveals:

- Time-based stability or instability
- Trends, shifts, cycles
- Points outside control limits (UCL/LCL)
- Dynamic behavior: wear, degradation, seasonal effects

---

## Key Elements

| Element       | Description                               |
| ------------- | ----------------------------------------- |
| Data points   | Individual measurements plotted over time |
| Mean line (x̄) | Process average                           |
| UCL           | Upper Control Limit (x̄ + 2.66MR̄)          |
| LCL           | Lower Control Limit (x̄ - 2.66MR̄)          |
| Spec lines    | Optional USL/LSL overlay                  |

---

## Interpretation

| Pattern                      | Meaning              | Action      |
| ---------------------------- | -------------------- | ----------- |
| Points within limits, random | Stable process       | Maintain    |
| Point above UCL              | Special cause (high) | Investigate |
| Point below LCL              | Special cause (low)  | Investigate |
| 7+ points one side           | Shift in mean        | Investigate |
| Trending up/down             | Drift                | Investigate |

---

## Linked Filtering

Click any point to:

- See its factor values (Machine, Shift, Operator)
- Filter other charts to that subset
- Build drill-down path

---

## See Also

- [CHANGE Pillar](../../01-vision/four-pillars/change.md)
- [Two Voices](../../01-vision/two-voices/index.md) - Control limits vs specs
- [Chart Design](../../06-design-system/charts/ichart.md)
