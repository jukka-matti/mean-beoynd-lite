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

---

## Technical Reference

VariScout's implementation follows AIAG standards:

```typescript
// From @variscout/core
import { calculateGageRR } from '@variscout/core';

const grr = calculateGageRR(data, {
  partColumn: 'PartID',
  operatorColumn: 'Operator',
  measureColumn: 'Value',
});
// Returns: { grrPercent, repeatability, reproducibility, partToPartVariation, ... }
```

**Test coverage:** See `packages/core/src/__tests__/stats.test.ts` for Gage R&R tests.

---

## See Also

- [Glossary: %GRR](../../glossary.md#grr)
- [Glossary: Repeatability](../../glossary.md#repeatability)
- [Glossary: Reproducibility](../../glossary.md#reproducibility)
- [I-Chart](i-chart.md) - Verify stability before MSA
- [Capability](capability.md) - Assess after confirming measurement
- [Chart Design](../../06-design-system/charts/gage-rr.md)
- [Case: Coffee](../../04-cases/coffee/index.md) - MSA use case
- [Case: Avocado](../../04-cases/avocado/index.md) - MSA use case
