# Pareto Chart

The Pareto Chart is VariScout's tool for the **FAILURE** pillar - finding where problems concentrate.

---

## Purpose

_"Where do problems concentrate? Is 'chaotic data' actually mixed streams?"_

The Pareto reveals:

- Which categories contain most defects/issues
- The vital few vs trivial many (80/20 rule)
- Hidden patterns in "generic scrap buckets"
- Whether failure modes are being masked

---

## Key Elements

| Element         | Description                        |
| --------------- | ---------------------------------- |
| Bars            | Category counts, sorted descending |
| Cumulative line | Running total percentage           |
| 80% marker      | Visual guide for vital few         |

---

## Interpretation

| Pattern                | Meaning                  |
| ---------------------- | ------------------------ |
| Steep cumulative curve | Few categories dominate  |
| Flat curve             | Many small contributors  |
| First bar >50%         | Single dominant category |
| Top 3 bars >80%        | Classic 80/20 pattern    |

---

## Linked Filtering

Click any bar to:

- Filter all charts to that category
- See which factors affect that defect type
- Understand root causes

---

## Use Cases

| Scenario        | What to Analyze             |
| --------------- | --------------------------- |
| Defect analysis | Count by defect type        |
| Downtime        | Count by stoppage reason    |
| Complaints      | Count by complaint category |
| Scrap           | Count by rejection reason   |

---

## See Also

- [FAILURE Pillar](../../01-vision/four-pillars/failure.md)
- [Chart Design](../../06-design-system/charts/pareto.md)
