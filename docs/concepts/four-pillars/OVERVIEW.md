# VaRiScout Lite: Watson's Four Pillars as Software

> "VaRiScout doesn't just display charts — it embodies a methodology for profound process understanding."

---

## The Philosophy

**VaRiScout is EDA for process improvement — not statistical verification.**

| Academic Statistician            | Process Improvement Practitioner |
| -------------------------------- | -------------------------------- |
| "Is this significant at p<0.05?" | "Where should I focus?"          |
| Hypothesis testing               | Pattern finding                  |
| Prove with math                  | See with eyes                    |
| Statistical correctness          | Directional guidance             |
| Analysis as end goal             | Analysis as starting point       |

**The goal:**

- Find where to focus
- See where to apply Lean thinking
- Guide improvement effort
- Move fast, iterate, improve

**The key insight:**

> VaRiScout finds WHERE to focus. Apply Lean thinking to find WHY — and what to do about it.

**The promise:**

> 46% of your variation may be hiding in one place. Find it. Fix it. Check it. Continue.

---

## The Core Insight

VaRiScout Lite's four core charts aren't random statistical outputs. Each chart directly maps to one of Watson's Four Pillars of Process Knowledge:

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

> **Note:** Regression in VaRiScout Lite serves as a **first step** to visually check if correlation exists between two continuous variables. It answers "is there a relationship?" before investing in deeper predictive modeling. For most variation analysis, the Four Pillars are sufficient.

---

## Target Audience

VaRiScout Lite is designed for practitioners who need to **find and act on variation sources quickly**:

| Role                    | Primary Need                          | How VaRiScout Helps                   |
| ----------------------- | ------------------------------------- | ------------------------------------- |
| **Fresh Green Belts**   | Apply LSS training to real data       | Guided methodology, no Minitab needed |
| **Operations Managers** | Quick answers, clear actions          | Breadcrumb trail, cumulative %        |
| **Supervisors**         | Identify which shift/machine/operator | Boxplot + linked filtering            |
| **Quality Teams**       | Capability reporting, spec compliance | Cp/Cpk, pass/fail %                   |
| **OpEx Teams**          | Prioritize improvement projects       | Pareto, variation contribution %      |

**What they DON'T need (initially):**

- Complex predictive models
- Response surface methodology
- DOE analysis software

**What they DO need:**

- "Where is the variation coming from?" → Boxplot
- "Is it stable over time?" → I-Chart
- "What defects matter most?" → Pareto
- "Are we meeting specs?" → Capability
- "Is there a relationship?" → Regression (add-on)

---

## The System Dynamics: How Pillars Interconnect

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

**VaRiScout's Linked Filtering = Gear Meshing**

When you click on one chart, all others respond. This isn't just a UI feature — it's how the pillars interconnect:

| Action                       | System Response                                            |
| ---------------------------- | ---------------------------------------------------------- |
| Click "Machine B" in Boxplot | I-Chart shows only Machine B's timeline                    |
|                              | Pareto shows only Machine B's failure modes                |
|                              | Capability recalculates for Machine B alone                |
| Click "Above UCL" in I-Chart | Boxplot highlights which factors had out-of-control points |
|                              | Pareto shows defect types during unstable periods          |

---

## The Process Detective's Toolkit

VaRiScout's four core charts map to four detective questions:

| Tool                   | Detective Question                                                         |
| ---------------------- | -------------------------------------------------------------------------- |
| **I-Chart (CHANGE)**   | "What changed between yesterday's shift and today's shift?"                |
| **Boxplot (FLOW)**     | "Retrace the footprints upstream. Where did this come from?"               |
| **Pareto (FAILURE)**   | "Where is the 'blood spatter'? The chaotic, mixed data?"                   |
| **Capability (VALUE)** | "Am I looking at a clue (customer issue) or just noise (irrelevant spec)?" |

**Add-on:**
| Tool | Detective Question |
|------|-------------------|
| **Regression (CORRELATION)** | "Is there a connection between these two clues?" |

---

## The Guided Frustration Pedagogy

The Sock Mystery teaches through "guided frustration":

1. **Phase 1: Immersion in Chaos** — Let them fail so they ask why
2. **Phase 2: Physical Stratification** — Peel back layers with questions
3. **Phase 3: System Understanding** — Connect statistics to the real system

VaRiScout enables this same journey with real data:

1. Upload data → see chaotic I-Chart (frustration)
2. Click through factors → discover subgroups (stratification)
3. Drill down → find the actual variation source (understanding)

---

## See Also

- [CHANGE (I-Chart)](./CHANGE.md) - Time-based stability analysis
- [FLOW (Boxplot)](./FLOW.md) - Upstream variation sources
- [FAILURE (Pareto)](./FAILURE.md) - Problem concentration
- [VALUE (Capability)](./VALUE.md) - Customer specification alignment
- [DRILLDOWN](./DRILLDOWN.md) - Progressive analysis methodology

---

_Source: Based on Watson's Four Pillars framework, the Sock Mystery experiential exercise, and the VaRiScout Lite product design._
