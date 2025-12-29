# Statistics Reference

This document explains the statistical calculations used in VariScout Lite. Understanding these formulas helps quality professionals interpret results and explain findings to stakeholders.

## Table of Contents

- [Basic Statistics](#basic-statistics)
- [Control Limits (I-Chart)](#control-limits-i-chart)
- [Process Capability (Cp & Cpk)](#process-capability-cp--cpk)
- [Conformance Metrics](#conformance-metrics)
- [Multi-Tier Grading](#multi-tier-grading)
- [Effect Size (Eta-Squared)](#effect-size-eta-squared)

---

## Basic Statistics

### Mean (Average)

The arithmetic mean of all measurements:

```
Mean = (x₁ + x₂ + ... + xₙ) / n
```

Where `n` is the total number of data points.

### Standard Deviation (StdDev)

Measures the spread of data around the mean. VariScout uses the **sample standard deviation**:

```
StdDev = √[ Σ(xᵢ - Mean)² / (n - 1) ]
```

A larger standard deviation indicates more variation in your process.

---

## Control Limits (I-Chart)

The Individual (I) Chart uses **3-sigma control limits** to identify unusual variation:

### Upper Control Limit (UCL)

```
UCL = Mean + (3 × StdDev)
```

### Lower Control Limit (LCL)

```
LCL = Mean - (3 × StdDev)
```

### Interpretation

- **Points within control limits**: Normal process variation
- **Points outside control limits**: Special cause variation (investigate)
- **~99.7%** of data should fall within control limits for a stable process

### Important Notes

- Control limits are calculated from your **data**, not specifications
- They show what your process **is doing**, not what it **should do**
- Specification limits (USL/LSL) are separate—they define what is acceptable

---

## Process Capability (Cp & Cpk)

Capability indices compare your process variation to specification limits.

### Cp (Potential Capability)

Cp measures how well your process **could** perform if it were perfectly centered:

```
Cp = (USL - LSL) / (6 × StdDev)
```

**Requires both USL and LSL to be defined.**

| Cp Value | Interpretation |
|----------|----------------|
| < 1.00 | Process is not capable |
| 1.00 - 1.33 | Marginally capable |
| 1.33 - 1.67 | Capable |
| > 1.67 | Highly capable |

### Cpk (Actual Capability)

Cpk accounts for how **centered** your process is:

```
CPU = (USL - Mean) / (3 × StdDev)
CPL = (Mean - LSL) / (3 × StdDev)
Cpk = min(CPU, CPL)
```

**Works with one-sided specifications too:**
- Only USL defined: `Cpk = (USL - Mean) / (3 × StdDev)`
- Only LSL defined: `Cpk = (Mean - LSL) / (3 × StdDev)`

| Cpk Value | Interpretation |
|-----------|----------------|
| < 1.00 | Process is not meeting specs |
| 1.00 - 1.33 | Meeting specs, but with little margin |
| 1.33 - 1.67 | Good capability |
| > 1.67 | Excellent capability |

### Cp vs Cpk: When to Use Each

| Metric | Use When | Tells You |
|--------|----------|-----------|
| **Cp** | Assessing potential | How capable the process could be if centered |
| **Cpk** | Assessing actual performance | How capable the process actually is |

**Key Insight**: If Cpk < Cp, your process is off-center. Focus on centering (reducing bias) before reducing variation.

---

## Conformance Metrics

### Out of Spec Percentage

The percentage of measurements that fall outside specification limits:

```
Out of Spec % = (Count outside specs / Total count) × 100
```

A measurement is "out of spec" if:
- Value > USL (exceeds upper limit)
- Value < LSL (below lower limit)

### Pass Rate

```
Pass Rate = 100% - Out of Spec %
```

---

## Multi-Tier Grading

For quality systems with multiple grades (e.g., coffee defects, textile grades), VariScout supports tiered classification.

### Grade Assignment

Each measurement is assigned to the **first grade** where the value is ≤ the grade's maximum threshold:

```
Example: Coffee defect count = 7

Grades:
- Specialty: max 5  → 7 > 5, skip
- Premium: max 8    → 7 ≤ 8, ASSIGN
- Exchange: max 23
- Below: max 86

Result: Grade = "Premium"
```

### Grade Summary

For each grade, VariScout calculates:
- **Count**: Number of measurements in this grade
- **Percentage**: `(Count / Total) × 100`

---

## Effect Size (Eta-Squared)

Eta-squared (η²) measures how much of the total variation is explained by a grouping factor.

```
η² = SS_between / SS_total
```

Where:
- **SS_total**: Total sum of squares (overall variation)
- **SS_between**: Sum of squares between groups

### Calculation

1. Calculate overall mean of the outcome variable
2. Calculate SS_total: `Σ(xᵢ - overall mean)²`
3. For each group, calculate group mean
4. Calculate SS_between: `Σ nⱼ × (group mean - overall mean)²`
5. η² = SS_between / SS_total

### Interpretation

| η² Value | Interpretation |
|----------|----------------|
| 0.01 - 0.06 | Small effect |
| 0.06 - 0.14 | Medium effect |
| > 0.14 | Large effect |

**Example**: If η² = 0.34 for "Supplier" factor, it means 34% of the variation in your outcome can be attributed to differences between suppliers.

---

## Code Reference

All statistics are calculated in `src/logic/stats.ts`:

```typescript
// Main statistics function
calculateStats(data: number[], usl?: number, lsl?: number, grades?: Grade[]): StatsResult

// Effect size function
getEtaSquared(data: any[], factor: string, outcome: string): number
```

---

## Further Reading

- [NIST Engineering Statistics Handbook](https://www.itl.nist.gov/div898/handbook/)
- [ASQ Quality Glossary](https://asq.org/quality-resources/quality-glossary)
- Montgomery, D.C. (2012). *Statistical Quality Control*
