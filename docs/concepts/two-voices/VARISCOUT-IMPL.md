# VaRiScout Implementation: Showing Both Voices

> Part of [Two Voices](./OVERVIEW.md)

---

## VaRiScout Shows Both Situations

When you add specification limits to the I-Chart, you immediately see which situation you're in:

**Situation A: Special Cause Present**

```
┌─────────────────────────────────────────────────────────────────┐
│  USL ━━━━━━━━━━━━━━━━━━━━━━━━━                                  │
│  UCL ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─       ●  ← Special cause!           │
│           ●  ●     ●    ●                                       │
│  x̄   ═══════════════════════════                                │
│           ●    ●       ●                                        │
│  LCL ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─                                     │
│  LSL ━━━━━━━━━━━━━━━━━━━━━━━━━                                  │
│                                                                 │
│  Action: Find what caused that point. Local investigation.      │
└─────────────────────────────────────────────────────────────────┘
```

**Situation B: Stable but Not Capable (Common Cause Issue)**

```
┌─────────────────────────────────────────────────────────────────┐
│  USL ━━━━━━━━━━━━━━━━━━━━━━━━━                                  │
│  UCL ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─   ← Stable! But UCL > USL       │
│           ●  ●     ●    ●                                       │
│  x̄   ═══════════════════════════                                │
│           ●    ●       ●                                        │
│  LCL ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─   ← Stable! But LCL < LSL       │
│  LSL ━━━━━━━━━━━━━━━━━━━━━━━━━                                  │
│                                                                 │
│  Action: System change needed. Escalate to management/OpEx.     │
└─────────────────────────────────────────────────────────────────┘
```

**Situation C: The Goal State**

```
┌─────────────────────────────────────────────────────────────────┐
│  USL ━━━━━━━━━━━━━━━━━━━━━━━━━                                  │
│                                                                 │
│  UCL ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─                                     │
│           ●  ●     ●    ●        ← Stable AND capable!         │
│  x̄   ═══════════════════════════                                │
│           ●    ●       ●                                        │
│  LCL ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─                                     │
│                                                                 │
│  LSL ━━━━━━━━━━━━━━━━━━━━━━━━━                                  │
│                                                                 │
│  Action: Maintain. Monitor. Celebrate.                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## I-Chart: Both Voices in One View

**VaRiScout Lite shows BOTH control limits AND specification limits on the I-Chart when specs are added.** This lets you see both voices simultaneously:

```
┌─────────────────────────────────────────────────────────────────┐
│  I-CHART: Process Stability with Customer Requirements          │
│                                                                 │
│  USL ━━━━━━━━━━━━━━━━━━━━━━━━━    Voice of Customer            │
│                                                                 │
│  UCL ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─    Voice of Process            │
│           ●  ●     ●    ●                                       │
│        ●        ●     ●     ●                                   │
│  x̄   ═══════════════════════════   Process mean                │
│           ●    ●       ●                                        │
│        ●     ●    ●       ●                                     │
│  LCL ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─    Voice of Process            │
│                                                                 │
│  LSL ━━━━━━━━━━━━━━━━━━━━━━━━━    Voice of Customer            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

━━━ Specification Limits (customer requirements)
─ ─ Control Limits (calculated from process data)
```

**What you can see instantly:**

| Observation             | Meaning                                       |
| ----------------------- | --------------------------------------------- |
| UCL/LCL inside USL/LSL  | ✅ Process capable — naturally meets specs    |
| UCL/LCL outside USL/LSL | ⚠️ Process not capable — will produce defects |
| Points within UCL/LCL   | Normal variation — don't adjust               |
| Points outside UCL/LCL  | Special cause — investigate                   |
| Points outside USL/LSL  | Defect — customer impact                      |

**The power of seeing both:**

| Without Both             | With Both (VaRiScout)                                              |
| ------------------------ | ------------------------------------------------------------------ |
| "Is this point bad?"     | "Is this point normal for the process AND acceptable to customer?" |
| React to every variation | Understand which variation matters                                 |
| Chase specs              | Improve process capability                                         |

---

## Capability Chart: Both Voices

```
┌─────────────────────────────────────────────────────────────────┐
│  CAPABILITY: Process vs Requirements                            │
│                                                                 │
│  USL ━━━━━━━━━━━━━━━━━━━━━    Voice of Customer               │
│                                                                 │
│        ▂▄▆█▆▄▂                 Distribution of                 │
│       ▄████████▄               process output                  │
│      ████████████              (Voice of Process)              │
│                                                                 │
│  LSL ━━━━━━━━━━━━━━━━━━━━━    Voice of Customer               │
│                                                                 │
│  Question: "Does it meet customer specs?"                       │
│  Answer: % within spec, Cp/Cpk indices                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## The VaRiScout Workflow

```
CHANGE (I-Chart)                    FLOW (Boxplot)         VALUE (Capability)
─────────────────                   ──────────────         ──────────────────
Both Voices visible                 Find the source        Detailed capability
when specs added                    of variation           analysis

● Control Limits                    ● Variation %          ● Distribution shape
  (Voice of Process)                  by factor            ● Cp/Cpk indices
● Spec Limits                       ● Which subgroup       ● % within spec
  (Voice of Customer)                 drives it?           ● Where is the gap?

"Is it stable AND                   "Where does it         "How capable
within specs?"                      come from?"            are we really?"
```

**The Goal Through the Workflow:**

| Step       | Question                                 | Goal State               |
| ---------- | ---------------------------------------- | ------------------------ |
| I-Chart    | "Are control limits within spec limits?" | Yes — stable AND capable |
| Boxplot    | "Which factors drive variation?"         | Identify what to improve |
| Capability | "What's our actual capability?"          | Cp > 1.33, Cpk > 1.33    |

---

## See Also

- [OVERVIEW](./OVERVIEW.md) - Two Voices introduction
- [Four Scenarios](./SCENARIOS.md) - Different combinations of stability and capability
- [Four Pillars](../four-pillars/OVERVIEW.md) - The methodology behind the charts
