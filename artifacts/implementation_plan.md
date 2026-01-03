# Implementation Plan - LSS Trainer Features

**Status:** In Progress
**Goal:** Implement Green Belt training features (ANOVA, Regression, Gage R&R) in PWA.

## 1. Feature Verification & Gap Analysis

- [x] **ANOVA under Boxplot**
  - [x] Core logic (`packages/core`)
  - [x] UI Component (`AnovaResults.tsx`)
  - [x] Integration (`Dashboard.tsx`)
  - [ ] **Gap:** Missing F-statistic display in UI (Spec requires "F-ratio and p-value")
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

- [ ] **Fix ANOVA Display**: Add F-statistic to `AnovaResults.tsx`
- [ ] **Verification**: Ensure all types and imports are correct between packages.
- [ ] **Documentation**: Update `task.md` to reflect completion.

## 3. Testing

- [ ] Manual verification of ANOVA results.
- [ ] Verify Regression auto-fit switching.
- [ ] Verify Gage R&R calculations with sample data.
