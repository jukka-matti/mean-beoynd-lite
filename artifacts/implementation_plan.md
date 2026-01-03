# Implementation Plan - LSS Trainer Features

**Status:** Completed
**Goal:** Implement Green Belt training features (ANOVA, Regression, Gage R&R) in PWA.

## 1. Feature Verification & Gap Analysis

- [x] **ANOVA under Boxplot**
  - [x] Core logic (`packages/core`)
  - [x] UI Component (`AnovaResults.tsx`)
  - [x] Integration (`Dashboard.tsx`)
  - [x] **Gap Fixed:** F-statistic display added to `AnovaResults.tsx`.
- [x] **Regression Tab**
  - [x] Core logic (Linear + Quadratic auto-fit)
  - [x] 2x2 Grid Layout (`RegressionPanel.tsx`)
  - [x] Scatter Plot Component (`ScatterPlot.tsx`)
  - [x] Navigation Tab
- [x] **Gage R&R Tab**
  - [x] Core logic (ANOVA method)
  - [x] UI Panel (`GageRRPanel.tsx`)
  - [x] Variance Bar Chart (`GageRRChart.tsx`)
  - [x] Interaction Plot (`InteractionPlot.tsx`)
  - [x] Navigation Tab

## 2. Implementation Tasks

- [x] **Fix ANOVA Display**: Added F-statistic to `AnovaResults.tsx`.
- [x] **Verification**: Ensured all types and imports are correct between packages.
- [x] **Documentation**: Updated `task.md` to reflect completion.

## 3. Testing

- [x] Manual verification of ANOVA results code.
- [x] Verified Regression auto-fit switching logic via code review.
- [x] Verified Gage R&R calculations logic via code review.
