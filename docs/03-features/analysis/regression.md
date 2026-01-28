# Regression Analysis

Regression is VariScout's tool for exploring relationships between continuous variables.

---

## Purpose

_"Is there a relationship between X and Y?"_

Regression answers:

- Does X predict Y?
- How strong is the relationship?
- What's the direction (positive/negative)?

---

## Key Metrics

| Metric      | Description                            |
| ----------- | -------------------------------------- |
| R²          | Proportion of variance explained (0-1) |
| Adjusted R² | R² adjusted for number of predictors   |
| Slope       | Change in Y per unit X                 |
| Intercept   | Y value when X = 0                     |
| p-value     | Significance of relationship           |

---

## Interpretation Guide

| R² Value  | Interpretation |
| --------- | -------------- |
| 0.90-1.00 | Very strong    |
| 0.70-0.89 | Strong         |
| 0.50-0.69 | Moderate       |
| 0.30-0.49 | Weak           |
| <0.30     | Very weak      |

---

## Use in VariScout

!!! note
Regression in VariScout serves as a **first step** to visually check if correlation exists. It answers "is there a relationship?" before investing in deeper predictive modeling.

For most variation analysis, the Four Pillars (I-Chart, Boxplot, Pareto, Capability) are sufficient.

---

## Multiple Regression

When using multiple predictors:

| Metric      | Purpose                                  |
| ----------- | ---------------------------------------- |
| Adjusted R² | Compare models with different predictors |
| VIF         | Check for multicollinearity              |
| p-values    | Significance of each predictor           |

---

## See Also

- [Glossary: R²](../../glossary.md#r²)
- [Glossary: VIF](../../glossary.md#vif)
- [Chart Design](../../06-design-system/charts/scatter.md)
