# Tool Pages: Chart Reading

> How to Read and Patterns to Find sections

---

## 4. How to Read

**Purpose:** Visual literacy — understand what you're seeing

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  HOW TO READ AN I-CHART                                         │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  USL ━━━━━━━━━━━━━━━━━━━━ ←─── Spec limit (customer)   │   │
│  │                                                         │   │
│  │  UCL ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ←─┬─ Control limits           │   │
│  │                             │   (calculated from data)  │   │
│  │        ●  ●     ●    ● ←───┼─ Individual data points   │   │
│  │     ●        ●     ●       │   in TIME ORDER           │   │
│  │  x̄ ════════════════════ ←─┼─ Process average          │   │
│  │        ●    ●       ●      │                           │   │
│  │     ●     ●    ●           │                           │   │
│  │                             │                           │   │
│  │  LCL ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ←─┘                           │   │
│  │                                                         │   │
│  │  LSL ━━━━━━━━━━━━━━━━━━━━ ←─── Spec limit (customer)   │   │
│  │                                                         │   │
│  │       TIME →                                            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  KEY CONCEPTS                                                   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Control Limits (UCL/LCL)          Spec Limits (USL/LSL)  │  │
│  │ ─────────────────────────         ────────────────────── │  │
│  │ Voice of the Process              Voice of the Customer  │  │
│  │ Calculated from your data         Defined by customer    │  │
│  │ "What the process does"           "What customer needs"  │  │
│  │                                                          │  │
│  │                    [Learn more: Two Voices →]            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Design Notes:**

- Annotated visual is the hero
- Callout lines connect labels to chart elements
- Key concepts below in simple table/comparison
- Link to deeper "Two Voices" content

**Interaction Option:** Hover/tap on element → highlight + tooltip

---

## 5. Patterns to Find

**Purpose:** Train the eye — what to look for

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  PATTERNS TO FIND                                               │
│                                                                 │
│  ┌─────────────────────────────┐  ┌─────────────────────────┐  │
│  │                             │  │                         │  │
│  │  ●                          │  │      ●  ●  ●  ●  ●     │  │
│  │     ●  ●                    │  │  ●  ●                  │  │
│  │  ═══════════════════════    │  │  ═══════════════════   │  │
│  │           ●  ●  ●           │  │                        │  │
│  │              ●              │  │                        │  │
│  │                             │  │                        │  │
│  │  ⚠️ TREND                   │  │  ⚠️ SHIFT               │  │
│  │  Consecutive rise or fall   │  │  Sudden level change   │  │
│  │                             │  │                        │  │
│  └─────────────────────────────┘  └─────────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────┐  ┌─────────────────────────┐  │
│  │                             │  │                         │  │
│  │  ●     ●     ●     ●       │  │  ●                      │  │
│  │     ●     ●     ●          │  │     ●  ●  ●  ●  ●  ●   │  │
│  │  ═══════════════════════    │  │  ═══════════════════   │  │
│  │                             │  │                        │  │
│  │                             │  │                ●       │  │
│  │                             │  │                        │  │
│  │  ⚠️ CYCLE                   │  │  ⚠️ OUT OF CONTROL      │  │
│  │  Repeating pattern          │  │  Point beyond limits   │  │
│  │                             │  │                        │  │
│  └─────────────────────────────┘  └─────────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────┐  ┌─────────────────────────┐  │
│  │                             │  │                         │  │
│  │  ●  ●  ●  ●  ●  ●  ●  ●    │  │      ●  ●  ●  ●  ●     │  │
│  │  ═══════════════════════    │  │  ●  ●           ●  ●   │  │
│  │                             │  │  ═══════════════════   │  │
│  │                             │  │                        │  │
│  │                             │  │                        │  │
│  │                             │  │                        │  │
│  │  ⚠️ RUN (same side)         │  │  ✅ STABLE              │  │
│  │  8+ points above/below mean │  │  Random around mean    │  │
│  │                             │  │                        │  │
│  └─────────────────────────────┘  └─────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Design Notes:**

- Grid of pattern cards
- Visual is primary, label + description secondary
- Each pattern is immediately recognizable
- Mix of "problems" (⚠️) and "good" (✅)

**Interaction:** Click pattern → more detail + what it means + what to do

---

## Pattern Summary

| Pattern            | Visual Indicator           | What It Means                |
| ------------------ | -------------------------- | ---------------------------- |
| **Trend**          | 6+ consecutive up/down     | Process drifting             |
| **Shift**          | Sudden level change        | Something changed            |
| **Cycle**          | Repeating wave pattern     | Periodic cause (shift, temp) |
| **Out of Control** | Point beyond limits        | Special cause present        |
| **Run**            | 8+ points same side        | Process off-center           |
| **Stable**         | Random scatter around mean | Process in control           |

---

## See Also

- [Overview](./OVERVIEW.md) - Design principles
- [Section Structure](./SECTION-STRUCTURE.md) - Hero, When to Use
- [Interactive Features](./INTERACTIVE-FEATURES.md) - Demo, Features, CTA
- [Mobile UX](./MOBILE-UX.md) - Responsive design
