# Gage R&R (Measurement System Analysis)

Gage R&R assesses whether your measurement system is capable of detecting real process variation.

---

## Purpose

_"Can we trust this measurement?"_

Before acting on variation data, verify the measurement system:

- Is the gage repeatable? (same operator, same part)
- Is it reproducible? (different operators)
- Is measurement error acceptable?

---

## Key Metrics

| Metric          | Description                        | Target   |
| --------------- | ---------------------------------- | -------- |
| %GRR            | Total measurement system variation | <30%     |
| Repeatability   | Equipment variation                | Minimize |
| Reproducibility | Operator variation                 | Minimize |
| Part-to-Part    | True product variation             | Maximize |

---

## Interpretation

| %GRR   | Interpretation | Action                              |
| ------ | -------------- | ----------------------------------- |
| <10%   | Excellent      | Measurement system acceptable       |
| 10-30% | Marginal       | May be acceptable, use with caution |
| >30%   | Unacceptable   | Fix measurement system first        |

---

## Study Design

A typical Gage R&R study:

| Element        | Typical Setup                          |
| -------------- | -------------------------------------- |
| Operators      | 2-3 people                             |
| Parts          | 10 parts representing range            |
| Trials         | 2-3 measurements per part per operator |
| Total readings | 60-90 measurements                     |

---

## Teaching Flow

The MSA question follows process analysis:

```
WEEK N: Analysis reveals a problem
         ↓
"Bed C has high moisture"
"Night shift underfills"
         ↓
WEEK N+1: "But wait..."
         ↓
"Can we trust this measurement?"
         ↓
GAGE R&R STUDY
         ↓
┌─────────────────┬─────────────────┬─────────────────┐
│   %GRR < 10%    │  %GRR 10-30%    │   %GRR > 30%    │
│   EXCELLENT     │    MARGINAL     │  UNACCEPTABLE   │
├─────────────────┼─────────────────┼─────────────────┤
│ Measurement OK  │ Proceed with    │ STOP - fix the  │
│ Problem is real │ caution         │ measurement     │
│ Investigate     │                 │ system first    │
│ process         │                 │                 │
└─────────────────┴─────────────────┴─────────────────┘
```

---

## See Also

- [Glossary: %GRR](../../glossary.md#grr)
- [Glossary: Repeatability](../../glossary.md#repeatability)
- [Glossary: Reproducibility](../../glossary.md#reproducibility)
- [Chart Design](../../06-design-system/charts/gage-rr.md)
