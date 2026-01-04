# Case Study: Textiles - Process Capability Analysis

**URL:** `/learn/textiles-strength`
**Embed URL:** `?sample=textiles-strength&embed=true`
**Focus:** Process capability, Cpk interpretation, specification limits

---

## Hero Section

### Title

**Is Your Process Capable?**

### Subtitle

Learn how to assess process capability using Cpk and understand what it means for quality.

---

## Problem Statement

### The Situation

A textile manufacturer produces cotton fabric for garment makers. The fabric's tensile strength must meet a minimum specification of 40 N (Newtons) - fabric weaker than this tears during sewing.

The factory uses two looms:

- **Loom #101 (Vintage)** - Older machine, been running for 15 years
- **Loom #205 (Modern)** - Newer machine with better controls

**The Question:** Is our fabric production process capable of consistently meeting the 40N specification?

---

## Learning Objectives

By the end of this case study, you'll be able to:

1. **Understand specification limits** - What LSL (Lower Spec Limit) means
2. **Interpret Cpk** - Know if your process is capable based on this index
3. **Read the Stats Panel** - Understand Pass Rate and capability metrics
4. **Compare processes** - Use factor drill-down to compare looms

---

## Guided Exploration

### Step 1: Look at the Stats Panel

In the embedded app, find the **Stats Panel** on the right side.

**Key metrics to find:**

- **Pass Rate** - Percentage meeting specification (above 40N)
- **Cpk** - Process capability index

**What Cpk values mean:**

- Cpk < 1.0 → Process is NOT capable (significant rejects)
- Cpk 1.0-1.33 → Marginal capability (some rejects)
- Cpk ≥ 1.33 → Good capability (very few rejects)
- Cpk ≥ 1.67 → Excellent capability (near-zero rejects)

**Observation:** Check the overall Cpk. Is it above 1.33?

---

### Step 2: Check the Histogram

Click the **Histogram** tab in the Stats Panel.

**What to notice:**

- The vertical red dashed line is the LSL (40N)
- The bell curve shows your process distribution
- Values to the LEFT of LSL are failures

**Observation:** How much of the distribution is to the left of the specification line?

---

### Step 3: Compare Looms with the Boxplot

Look at the **Boxplot** showing strength by Loom ID.

**What to notice:**

- Loom #101's box might be lower and wider
- Loom #205's box might be higher and narrower

**Observation:** The vintage loom produces weaker, more variable fabric.

---

### Step 4: Try It - Click on Loom #101

**Interactive:** Click on "Loom #101 (Vintage)" in the Boxplot.

**What happens:**

- All charts update to show only Loom #101's data
- The Stats Panel shows Loom #101's capability separately
- The I-Chart shows the vintage loom's process stability

**Observation:** What is Loom #101's Cpk? Is it below 1.0?

---

### Step 5: Compare with Loom #205

**Interactive:** Click "All Data" to reset, then click "Loom #205 (Modern)".

**What happens:**

- All charts update to show the modern loom's data
- The Stats Panel shows improved capability

**Observation:** Compare:

- Loom #101 Cpk: ~0.8 (not capable)
- Loom #205 Cpk: ~1.5 (good capability)

---

### Step 6: Understand the I-Chart

The **I-Chart** shows individual measurements over time.

**What to notice:**

- **UCL/LCL** (control limits) show the process's natural variation
- Points outside these lines indicate special cause variation
- The **Mean** line shows the process average

**For Loom #101:** More points may be near or below LSL
**For Loom #205:** Points cluster above LSL with less variation

---

## Key Takeaways

1. **Cpk tells you if specification is achievable** - Below 1.0 means you'll regularly produce out-of-spec product

2. **Different equipment performs differently** - The vintage loom needs attention or replacement

3. **Pass Rate confirms real-world impact** - Cpk is theoretical; Pass Rate shows actual rejects

4. **Drill-down reveals hidden problems** - Overall Cpk might look okay, but one machine could be dragging it down

---

## Decision Matrix

Based on your findings:

| Finding                 | Action                                |
| ----------------------- | ------------------------------------- |
| Overall Cpk < 1.0       | Process improvement needed urgently   |
| One loom Cpk < 1.0      | Focus improvement on that loom        |
| All looms Cpk > 1.33    | Process is capable, maintain it       |
| Cpk marginal (1.0-1.33) | Reduce variation or tighten centering |

---

## What's Next?

### In a Real Project

Now that you've identified Loom #101 as problematic:

1. **Root Cause** - Why is the vintage loom producing weaker fabric? (Wear, settings, materials?)
2. **Improve or Replace** - Can maintenance improve it, or is replacement needed?
3. **Control Plan** - Increase inspection frequency for Loom #101 until fixed
4. **Verify Improvement** - After changes, re-analyze to confirm Cpk improved

### Try Another Case Study

- **[Factor Identification](/learn/mango-export)** - Learn how to identify which factor drives variation
- **[Defect Prioritization](/learn/coffee-defects)** - Use Pareto analysis to focus improvement efforts

### Try With Your Own Data

Have your own process data? [Open VariScout →](https://app.variscout.com)

---

## Statistical Concepts Reference

### What is Cpk?

**Cpk = (Closer Spec - Mean) / (3 × σ)**

In plain language:

- Cpk measures how close your process is to failing the specification
- It considers both your process spread (variation) AND centering (mean position)

### Cpk vs Cp

| Metric | What it Measures                                                             |
| ------ | ---------------------------------------------------------------------------- |
| Cp     | Could your process fit within specs if perfectly centered?                   |
| Cpk    | Does your process fit within specs considering where it's actually centered? |

**Always use Cpk** - it's the practical measure.

### Cpk Benchmarks

| Cpk   | Interpretation    | Approx. Defect Rate |
| ----- | ----------------- | ------------------- |
| < 1.0 | Not capable       | > 2,700 ppm         |
| 1.0   | Minimally capable | ~2,700 ppm          |
| 1.33  | Capable           | ~66 ppm             |
| 1.67  | Very capable      | ~0.6 ppm            |
| 2.0   | Excellent         | ~0.002 ppm          |

---

## Embed URL for This Case

```
https://app.variscout.com?sample=textiles-strength&embed=true
```
