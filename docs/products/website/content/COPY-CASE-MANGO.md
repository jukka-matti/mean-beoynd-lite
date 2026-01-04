# Case Study: Mango Export - Finding the Problem Farm

**URL:** `/learn/mango-export`
**Embed URL:** `?sample=mango-export&embed=true`
**Focus:** Factor identification, Boxplot comparison, ANOVA interpretation

---

## Hero Section

### Title

**Find the Problem Farm**

### Subtitle

Learn how to identify which factor drives process variation using interactive analysis.

---

## Problem Statement

### The Situation

A mango exporter ships fruit to EU markets. EU regulations require mangoes to be within a specific weight class (300-350g) for premium pricing. Recent shipments have had a 15% rejection rate - too many mangoes are outside specification.

The exporter sources from three farms:

- **Farm A (Smallholder)** - Traditional farming, minimal standardization
- **Farm B (Co-op)** - Farmer cooperative with some quality processes
- **Farm C (Commercial)** - Large-scale operation with strict quality control

**The Question:** Which farm is causing the weight compliance failures?

---

## Learning Objectives

By the end of this case study, you'll be able to:

1. **Read a Boxplot** - Understand what the box, whiskers, and median line tell you
2. **Interpret ANOVA results** - Know what p-value and eta-squared mean in plain language
3. **Use drill-down filtering** - Click to explore subsets of your data
4. **Identify the "vital" factor** - Determine which X variable has the biggest impact on Y

---

## Guided Exploration

### Step 1: Look at the Boxplot

In the embedded app, find the **Boxplot** chart (bottom left).

**What to notice:**

- Each box represents one farm's weight distribution
- The **box height** shows variation (taller = more inconsistent)
- The **line inside the box** is the median (middle value)

**Observation:** Farm A's box is much taller than Farm C's. This means Farm A produces mangoes with more weight variation.

---

### Step 2: Check the ANOVA Results

Below the Boxplot, you'll see the ANOVA results panel.

**What to look for:**

- **p-value** - The probability this difference happened by chance
- **p < 0.05** means the difference is statistically significant

**Observation:** The p-value is very small (< 0.001). This confirms the farms really do produce different weight distributions - it's not just random sampling.

---

### Step 3: Understand the Effect Size

Look for **η² (eta-squared)** in the ANOVA results.

**What it means:**

- η² tells you how much of the total variation is explained by the farm difference
- Small < 0.06, Medium 0.06-0.14, Large > 0.14

**Observation:** If η² = 0.34, that's a large effect. The farm you source from explains 34% of the weight variation.

---

### Step 4: Try It - Click on Farm A

**Interactive:** Click on the "Farm A" bar in the Boxplot.

**What happens:**

- All charts update to show only Farm A's data
- The I-Chart shows only Farm A's measurements over time
- The Stats Panel updates to show Farm A's capability

**Observation:** Notice how the I-Chart looks more scattered? Farm A's process is less stable.

---

### Step 5: Compare Farm C

**Interactive:** Click the "All Data" breadcrumb to reset, then click Farm C.

**What happens:**

- All charts update to show only Farm C's data
- Notice the I-Chart is tighter around the mean
- The Stats Panel shows better capability

**Observation:** Farm C's process is more consistent. They have better quality control.

---

### Step 6: Check the Stats Panel

Look at the **Stats Panel** (right side) to understand capability.

**Key metrics:**

- **Pass Rate** - What percentage of mangoes are within spec (300-350g)?
- **Cpk** - Process capability index (≥1.33 is typically required)

**Compare:**

- Farm A might show 70% pass rate
- Farm C might show 95% pass rate

---

## Key Takeaways

1. **The Boxplot reveals variation at a glance** - Look for tall boxes (high variation) vs. short boxes (consistent)

2. **ANOVA confirms statistical significance** - A low p-value means the difference is real, not random

3. **Effect size tells you if it matters** - A large η² means this factor has practical importance

4. **Drill-down lets you explore** - Click to filter and compare subgroups

---

## What's Next?

### In a Real Project

Now that you've identified Farm A as the problem:

1. **Root Cause Analysis** - Visit Farm A, use 5 Whys or Fishbone to understand why their weights vary
2. **Verify Measurement System** - Before blaming the farm, ensure your scales are accurate (Gage R&R)
3. **Monitor Improvement** - After implementing changes, use the I-Chart to verify stability

### Try Another Case Study

- **[Process Capability Analysis](/learn/textiles-strength)** - Learn how to interpret Cpk and determine if a process is capable
- **[Defect Prioritization](/learn/coffee-defects)** - Use Pareto analysis to focus improvement efforts

### Try With Your Own Data

Have your own process data? [Open VariScout →](https://app.variscout.com)

---

## Statistical Concepts Reference

### Boxplot Anatomy

```
     ┬  ← Maximum (or upper fence)
     │
   ┌─┴─┐ ← Upper quartile (Q3, 75th percentile)
   │   │
   │ ─ │ ← Median (Q2, 50th percentile)
   │   │
   └─┬─┘ ← Lower quartile (Q1, 25th percentile)
     │
     ┴  ← Minimum (or lower fence)
```

### ANOVA in Plain Language

**Question:** "Are these groups different?"

**p-value answers:** "How likely is this difference to occur by chance?"

- p < 0.05 → "Very unlikely by chance, the groups are different"
- p > 0.05 → "Could be random, no clear difference"

**η² answers:** "How much of the variation does this factor explain?"

- η² = 0.34 → "34% of all weight variation is due to which farm"

---

## Embed URL for This Case

```
https://app.variscout.com?sample=mango-export&embed=true
```
