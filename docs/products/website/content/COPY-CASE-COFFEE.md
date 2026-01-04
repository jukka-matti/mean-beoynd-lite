# Case Study: Coffee - Defect Prioritization

**URL:** `/learn/coffee-defects`
**Embed URL:** `?sample=coffee-defects&embed=true`
**Focus:** Pareto analysis, grade breakdown, 80/20 prioritization

---

## Hero Section

### Title

**Where Should You Focus Improvement?**

### Subtitle

Learn how to prioritize quality improvement efforts using Pareto analysis and grade breakdowns.

---

## Problem Statement

### The Situation

A coffee exporter sources green coffee from three cooperatives. Each batch is graded by counting defects per 300g sample according to SCA (Specialty Coffee Association) standards:

| Defects per 300g | Grade     | Premium         |
| ---------------- | --------- | --------------- |
| 0-5              | Specialty | Highest price   |
| 6-8              | Premium   | Good price      |
| 9-23             | Exchange  | Commodity price |
| 24+              | Off-Grade | Below commodity |

Recent analysis shows too many batches are falling into "Exchange" or "Off-Grade" categories, hurting profit margins.

**The Question:** Which cooperative should we focus our quality improvement efforts on?

---

## Learning Objectives

By the end of this case study, you'll be able to:

1. **Read a Pareto Chart** - Understand the 80/20 principle in practice
2. **Interpret grade breakdown** - Use categorical grading for defect analysis
3. **Identify the "vital few"** - Focus on factors that cause most problems
4. **Compare categories** - Use drill-down to see grade distribution by source

---

## Guided Exploration

### Step 1: Look at the Stats Panel

In the embedded app, find the **Stats Panel** on the right side.

**What's different here:**
Instead of Cpk, you'll see a **Grade Breakdown** showing:

- Count and percentage for each grade (Specialty, Premium, Exchange, Off-Grade)

**Observation:** What percentage is "Specialty" grade? What percentage is "Off-Grade"?

---

### Step 2: Understand the Pareto Chart

Look at the **Pareto Chart** (middle bottom).

**What to notice:**

- Bars are sorted from highest to lowest count/impact
- This shows which cooperative contributes most defects

**The 80/20 Principle:**
Often, 80% of problems come from 20% of causes. The Pareto chart helps identify the "vital few" categories to focus on.

**Observation:** Which cooperative appears to have the most defect-heavy samples?

---

### Step 3: Check the Boxplot

Look at the **Boxplot** showing defect count by Cooperative.

**What to notice:**

- Higher boxes = more defects (bad)
- Wider boxes = more inconsistent quality
- The target is LOW defects (closer to zero)

**Observation:** "Coop South" likely shows much higher defect counts than others.

---

### Step 4: Try It - Click on Coop South

**Interactive:** Click on "Coop South" in the Boxplot.

**What happens:**

- All charts filter to show only Coop South's data
- The Stats Panel shows Coop South's grade breakdown
- You'll see a high percentage of "Off-Grade" and "Exchange"

**Observation:** Compare Coop South's grade breakdown to the overall. Much worse?

---

### Step 5: Compare with Coop North

**Interactive:** Click "All Data" to reset, then click "Coop North".

**What happens:**

- The Stats Panel now shows Coop North's grades
- You'll likely see mostly "Specialty" and "Premium"

**Observation:** Coop North produces high-quality coffee. No improvement needed here.

---

### Step 6: Investigate Processing Method

Look at the **Pareto Chart** and change the factor selector to "Processing Method".

**What to notice:**

- Does "Washed" or "Natural" processing have more defects?
- This is a secondary factor worth investigating

**Observation:** Processing method might explain some variation within cooperatives.

---

## Key Takeaways

1. **Focus on the vital few** - Coop South causes most quality problems. Focus improvement efforts there first.

2. **Grade breakdown tells the story** - Knowing the distribution across grades is more actionable than just average defects.

3. **Pareto reveals priorities** - Don't try to improve everything. Target the biggest contributor.

4. **Drill-down confirms suspicions** - Clicking into Coop South shows exactly how bad the problem is.

---

## Action Planning

Based on your findings:

| Cooperative  | Current State            | Action                      |
| ------------ | ------------------------ | --------------------------- |
| Coop North   | High quality (Specialty) | Maintain, maybe expand      |
| Coop Central | Medium quality (Premium) | Minor improvement potential |
| Coop South   | Low quality (Off-Grade)  | Major intervention needed   |

### Recommended Actions for Coop South

1. **Site Visit** - Understand their harvesting and post-harvest processes
2. **Training** - Provide quality training on sorting and drying
3. **Equipment** - Consider investment in drying infrastructure
4. **Incentives** - Implement price premiums for quality improvement
5. **Monitoring** - Increase sampling frequency until quality improves

---

## What's Next?

### In a Real Project

Now that you've identified Coop South as the priority:

1. **Root Cause Analysis** - Why does Coop South have more defects? (Harvesting? Drying? Storage?)
2. **Improvement Plan** - Create specific interventions based on root causes
3. **Measure Progress** - Track grade breakdown monthly to verify improvement
4. **Celebrate Success** - When Specialty percentage increases, recognize the achievement

### Try Another Case Study

- **[Factor Identification](/learn/mango-export)** - Learn how to identify which factor drives variation
- **[Process Capability Analysis](/learn/textiles-strength)** - Learn how to interpret Cpk

### Try With Your Own Data

Have your own process data? [Open VariScout →](https://app.variscout.com)

---

## Statistical Concepts Reference

### The Pareto Principle (80/20 Rule)

In quality management:

- 80% of defects come from 20% of causes
- Focus improvement on the "vital few" causes
- Don't waste resources on the "trivial many"

**In this case:**
Coop South might contribute 60-70% of Off-Grade batches despite being only one of three suppliers.

### Grade Breakdown vs Cpk

| Approach        | Best For                                                     |
| --------------- | ------------------------------------------------------------ |
| Cpk             | Continuous variables with spec limits (weight, length, time) |
| Grade Breakdown | Categorical outcomes or multi-tier specifications            |

Coffee grading uses tiers, not simple pass/fail, so grade breakdown is more informative here.

### Defect Categories in Coffee

Understanding what you're counting:

| Category          | Examples                                   |
| ----------------- | ------------------------------------------ |
| Primary Defects   | Full black, full sour, fungus damage       |
| Secondary Defects | Partial black, broken beans, insect damage |

Each defect type has a weight - some count more than others toward the total.

---

## Embed URL for This Case

```
https://app.variscout.com?sample=coffee-defects&embed=true
```
