# Drill-Down: Progressive Variation Analysis

The drill-down methodology is the heart of VariScout's approach to finding where variation hides.

---

## The Drill-Down Logic

### Decision Thresholds

| Variation % | Action                                   |
| ----------- | ---------------------------------------- |
| **>50%**    | Auto-drill — this is the primary driver  |
| **>80%**    | Strong focus — highly concentrated issue |
| **30-50%**  | Recommend investigating, ask user        |
| **<30%**    | Multiple factors — check interactions    |

### Example Drill-Down Journey

```
LEVEL 1: ALL DATA
━━━━━━━━━━━━━━━━━
I-Chart: Shows instability
Boxplot: Compare Shift/Machine/Operator
Finding: SHIFT explains 67% of variation
Action: Drill into SHIFT
↓
LEVEL 2: WITHIN SHIFT
━━━━━━━━━━━━━━━━━━━━━
I-Chart: Shows only Night Shift timeline
Boxplot: Compare Machines within Night Shift
Finding: Night Shift = 89% of shift variation
Action: Drill into Night Shift
↓
LEVEL 3: WITHIN NIGHT SHIFT
━━━━━━━━━━━━━━━━━━━━━━━━━━━
I-Chart: Shows only Night Shift + Machine C
Boxplot: Compare Operators on Machine C at Night
Finding: Machine C = 78% of Night Shift variation
Action: Primary driver identified — investigate Machine C conditions
```

### Breadcrumb Trail

```
All Data → Shift (67%) → Night (89%) → Machine C (78%)
```

This path represents 46% of total variation — highly actionable.

---

## Cumulative Variation Tracking

!!! methodology "The Power of the Breadcrumb"
This is the killer insight of the entire methodology. The breadcrumb trail isn't just navigation — it's **cumulative math** that tells you exactly how much of your total problem you've isolated.

!!! warning "Important Terminology"
VariScout identifies **factors driving variation**, not "root causes." EDA shows _which_ factors explain variation — the _why_ requires further investigation (5 Whys, experimentation, Gemba walks). This distinction matters: we quantify contribution, not causation.

### The Math Behind the Breadcrumb

Each drill-down level multiplies to show cumulative impact:

```
LEVEL           LOCAL %     CUMULATIVE CALCULATION     TOTAL IMPACT
─────────────────────────────────────────────────────────────────────
All Data          100%      100%                       100% (baseline)
    ↓
Shift             67%       100% × 67%                 = 67% of total
    ↓
Night Shift       89%       100% × 67% × 89%           = 59.6% of total
    ↓
Machine C         78%       100% × 67% × 89% × 78%     = 46.5% of total
```

**The insight:** By drilling three levels deep, you've isolated 46.5% of ALL your variation into ONE specific condition: Machine C on Night Shift.

---

## Why This Changes Everything

| Traditional Approach                | VariScout Breadcrumb Approach                     |
| ----------------------------------- | ------------------------------------------------- |
| "Our Cp is 0.4, process is chaotic" | "46% of variation = Machine C on Nights"          |
| "We need to improve quality"        | "Fix this ONE combination = half the problem"     |
| Scatter resources across everything | Laser focus on highest-impact target              |
| Months of unfocused effort          | Days to targeted solution                         |
| "Quality is everyone's job"         | "Machine C Night Shift team: here's your mission" |

---

## The Actionability Hierarchy

As you drill deeper, actionability increases:

```
DEPTH    BREADCRUMB                    FINDING                 ACTIONABILITY
──────────────────────────────────────────────────────────────────────────────
Level 0  All Data                      "We have variation"     ❌ Not actionable
                                                               "Improve everything"

Level 1  → Shift (67%)                 "It's shift-related"    ⚠️ Somewhat actionable
                                                               "Look at shift practices"

Level 2  → → Night (89%)               "Night Shift is the     ✓ Actionable
                                        problem"               "Investigate Night Shift"

Level 3  → → → Machine C (78%)         "Machine C on Nights"   ✓✓ Highly actionable
                                                               "Fix Machine C setup/maint"

Level 4  → → → → New Operators (92%)   "Inexperienced staff    ✓✓✓ PRIMARY DRIVER
                                        on Machine C Nights"   "Training is top candidate"
```

---

## Reading the Breadcrumb

**Local Percentage (shown in breadcrumb):**

> "Of the variation at THIS level, how much does this factor explain?"

**Cumulative Percentage (calculated):**

> "Of TOTAL variation from the beginning, how much have we isolated?"

```
Example Breadcrumb:
All Data → Shift (67%) → Night (89%) → Machine C (78%)
           ↑             ↑              ↑
           Local: 67%    Local: 89%     Local: 78%
           of total      of Shift       of Night Shift

           Cumulative:   Cumulative:    Cumulative:
           67%           59.6%          46.5%
           of total      of total       of total
```

---

## The "Half Your Problem" Threshold

A practical rule of thumb:

| Cumulative % | Interpretation                        | Action                            |
| ------------ | ------------------------------------- | --------------------------------- |
| **>50%**     | "More than half your problem is HERE" | Strong case for immediate action  |
| **30-50%**   | "Significant chunk isolated"          | Worth focused improvement project |
| **<30%**     | "One of several contributors"         | Address after bigger factors      |

In our example, 46.5% means: **"Fix Machine C on Night Shift and nearly half your quality problems disappear."**

---

## Visual: The Variation Funnel

```
                    ALL VARIATION (100%)
                 ┌─────────────────────────┐
                 │░░░░░░░░░░░░░░░░░░░░░░░░░│
                 │░░░░░░░░░░░░░░░░░░░░░░░░░│
                 └───────────┬─────────────┘
                             │
          ┌──────────────────┴──────────────────┐
          │                                     │
    SHIFT (67%)                          Other (33%)
    ┌─────────────┐                      ┌─────────┐
    │█████████████│                      │░░░░░░░░░│
    │█████████████│                      └─────────┘
    └──────┬──────┘                      (park this)
           │
    ┌──────┴──────┐
    │             │
NIGHT (89%)    Day (11%)
┌─────────┐    ┌───┐
│█████████│    │░░░│
│█████████│    └───┘
└────┬────┘
     │
┌────┴────┐
│         │
MACH C   Others
(78%)    (22%)
┌─────┐  ┌──┐
│█████│  │░░│
└─────┘  └──┘
   │
   ▼
46.5% OF TOTAL
VARIATION ISOLATED
TO ONE CONDITION
```

---

## Practical Example: Cost of Inaction vs Action

**Scenario:** Production line with 10,000 units/month, 8% defect rate = 800 defects/month

| Approach                          | Defects Addressed       | Effort                     | ROI            |
| --------------------------------- | ----------------------- | -------------------------- | -------------- |
| "Improve everything"              | 800 (theoretically)     | High, scattered            | Low - no focus |
| Fix Machine C Nights (46.5%)      | ~372 defects eliminated | Focused, measurable        | **High**       |
| Then fix remaining Shift (20.5%)  | +164 more               | Next project               | Compounding    |
| **Total from 2 focused projects** | **536 defects (67%)**   | **Sequential, manageable** | **Maximum**    |

---

## The Breadcrumb as Communication Tool

**Before (traditional):**

> "ANOVA shows statistically significant differences between shifts (p<0.001) with eta-squared of 0.67, and within the night shift subset, machine effects show F(2,267)=45.3..."

**After (VariScout breadcrumb):**

> "All Data → Shift (67%) → Night (89%) → Machine C (78%)
>
> Translation: Machine C on Night Shift explains 46% of all our quality variation. Fix this one combination and nearly half our problems disappear."

**Which one does the plant manager act on?**

---

## Implementation in VariScout UI

The breadcrumb should always show:

```
┌─────────────────────────────────────────────────────────────────────────┐
│ 📍 ANALYSIS PATH                                                        │
│                                                                         │
│ All Data → Shift (67%) → Night (89%) → Machine C (78%)                 │
│                                                                         │
│ 📊 Cumulative Impact: 46.5% of total variation isolated                │
│ 💡 "Fix this combination to address nearly half your quality problems" │
│                                                                         │
│ [← Back to Night Shift]  [← Back to All Shifts]  [← Start Over]        │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## See Also

- [Four Pillars Overview](index.md)
- [FLOW](flow.md) — Boxplot for factor comparison
