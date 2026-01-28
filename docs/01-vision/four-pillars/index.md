# Watson's Four Pillars of Process Knowledge

> "VariScout doesn't just display charts — it embodies a methodology for profound process understanding."

---

## The Core Insight

VariScout's four core charts aren't random statistical outputs. Each chart directly maps to one of Watson's Four Pillars of Process Knowledge:

| Chart                    | Pillar      | Core Question                     |
| ------------------------ | ----------- | --------------------------------- |
| **I-Chart**              | **CHANGE**  | "What's shifting over time?"      |
| **Boxplot**              | **FLOW**    | "Where does variation come from?" |
| **Pareto**               | **FAILURE** | "Where do problems cluster?"      |
| **Capability Histogram** | **VALUE**   | "Does it meet customer specs?"    |

### Add-on: Regression (Correlation Check)

| Chart          | Purpose           | Core Question                                   |
| -------------- | ----------------- | ----------------------------------------------- |
| **Regression** | Correlation Check | "Is there even a relationship between X and Y?" |

!!! note
Regression in VariScout serves as a **first step** to visually check if correlation exists between two continuous variables. It answers "is there a relationship?" before investing in deeper predictive modeling. For most variation analysis, the Four Pillars are sufficient.

---

## The Pillars

<div class="grid cards" markdown>

- :material-chart-line:{ .lg .middle } **CHANGE**

  ***

  I-Chart reveals time-based stability. "Is something shifting over time?"

  [:octicons-arrow-right-24: Learn more](change.md)

- :material-chart-box:{ .lg .middle } **FLOW**

  ***

  Boxplot traces variation upstream. "Which inputs explain the output?"

  [:octicons-arrow-right-24: Learn more](flow.md)

- :material-chart-bar:{ .lg .middle } **FAILURE**

  ***

  Pareto finds where problems concentrate. "What matters most?"

  [:octicons-arrow-right-24: Learn more](failure.md)

- :material-chart-histogram:{ .lg .middle } **VALUE**

  ***

  Capability compares to customer specs. "Are we meeting needs?"

  [:octicons-arrow-right-24: Learn more](value.md)

</div>

---

## The System Dynamics

The four pillars don't work in isolation — they're meshed gears:

```
        ┌─────────┐
        │ CHANGE  │ ← Dynamic factor: wear, shifts, seasons
        │(I-Chart)│
        └────┬────┘
             │
             ▼
┌─────────┐     ┌─────────┐
│  FLOW   │◄───►│ FAILURE │
│(Boxplot)│     │(Pareto) │
└────┬────┘     └────┬────┘
     │               │
     └───────┬───────┘
             │
             ▼
        ┌─────────┐
        │  VALUE  │ ← Drive gear: if undefined, nothing turns correctly
        │(Capable)│
        └─────────┘
```

**VariScout's Linked Filtering = Gear Meshing**

When you click on one chart, all others respond. This isn't just a UI feature — it's how the pillars interconnect:

| Action                       | System Response                                            |
| ---------------------------- | ---------------------------------------------------------- |
| Click "Machine B" in Boxplot | I-Chart shows only Machine B's timeline                    |
|                              | Pareto shows only Machine B's failure modes                |
|                              | Capability recalculates for Machine B alone                |
| Click "Above UCL" in I-Chart | Boxplot highlights which factors had out-of-control points |
|                              | Pareto shows defect types during unstable periods          |

---

## Progressive Analysis: Drill-Down

The pillars support progressive analysis through drill-down:

1. **Level 1:** All Data — identify top-level patterns
2. **Level 2:** Filter to dominant factor — zoom in
3. **Level 3:** Within filtered data, find next factor
4. **Continue** until actionable condition is isolated

[:octicons-arrow-right-24: Drill-Down Methodology](drilldown.md)

---

## Reference

Based on Watson's Four Pillars framework, the Sock Mystery experiential exercise, and the VariScout product design.
