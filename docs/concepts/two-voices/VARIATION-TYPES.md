# Two Types of Variation, Two Types of Action

> Part of [Two Voices](./OVERVIEW.md)

The I-Chart reveals patterns — but what you DO about them depends on what TYPE of variation you're seeing.

---

## Special Cause Variation

```
UCL ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
                              ●        ← Point outside limits
         ●  ●     ●    ●
      ●        ●     ●     ●
x̄   ═══════════════════════════════════
         ●    ●       ●
      ●     ●    ●       ●
LCL ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
```

| Characteristic | Special Cause                                          |
| -------------- | ------------------------------------------------------ |
| **What it is** | Assignable, identifiable event                         |
| **Signal**     | Point outside control limits, patterns, trends         |
| **Examples**   | New operator, material batch change, equipment failure |
| **Who acts**   | Local level: Operator, Supervisor, Team                |
| **Action**     | Find it, remove it, prevent recurrence                 |
| **Goal**       | Restore stability                                      |

---

## Common Cause Variation

```
USL ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

UCL ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  ← Process is STABLE
         ●  ●     ●    ●                  but control limits
      ●        ●     ●     ●              exceed specs!
x̄   ═══════════════════════════════════
         ●    ●       ●
      ●     ●    ●       ●
LCL ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─

LSL ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

| Characteristic | Common Cause                                                            |
| -------------- | ----------------------------------------------------------------------- |
| **What it is** | Inherent to the system as designed                                      |
| **Signal**     | Stable process BUT control limits outside specs                         |
| **Examples**   | Equipment capability, process design, material specs                    |
| **Who acts**   | System level: Management, Corporate Quality, Business Improvement, OpEx |
| **Action**     | Fundamental process change, investment, redesign                        |
| **Goal**       | Reduce variation, improve capability                                    |

---

## The Critical Insight

**Looking at stability is the traditional use of control charts — but it's only half the story.**

| Situation                  | I-Chart Shows                                      | Action Required                               |
| -------------------------- | -------------------------------------------------- | --------------------------------------------- |
| **Special cause present**  | Points outside limits, patterns                    | Find and remove the cause (local action)      |
| **Stable but not capable** | All points within limits, BUT limits outside specs | Reduce common cause variation (system action) |

**The trap:** When a process is stable but not capable, local actions won't help. "Trying harder" or adjusting individual points just adds variation. The **system itself** must change.

---

## Who Does What?

| Role                            | Focus                | Type of Variation     | Typical Actions                       |
| ------------------------------- | -------------------- | --------------------- | ------------------------------------- |
| **Operator**                    | Run the process      | Detect special causes | Flag abnormalities, follow procedures |
| **Supervisor**                  | Daily management     | Remove special causes | Investigate, correct, document        |
| **Quality Team**                | Monitor & measure    | Both                  | Track Cp/Cpk, report trends           |
| **OpEx / Business Improvement** | System improvement   | Common cause          | Projects, Kaizen, process redesign    |
| **Corporate Quality**           | Strategy & standards | Common cause          | Capability targets, investment cases  |
| **Management**                  | Resource allocation  | Common cause          | Approve changes, fund improvements    |

**Deming's insight:** Management is responsible for the system. If the system produces common cause variation that's too high, only management can authorize the changes needed to fix it.

---

## The Business Improvement Function's Role

When VaRiScout reveals a "stable but not capable" situation, this is where **Corporate Quality / Business Improvement / OpEx** comes in:

| They Ask                                          | VaRiScout Provides                                  |
| ------------------------------------------------- | --------------------------------------------------- |
| "Which processes need fundamental improvement?"   | Capability analysis showing stable but not capable  |
| "Where should we invest in process redesign?"     | Prioritized list by gap between UCL/LCL and USL/LSL |
| "What's the potential ROI of improvement?"        | Variation % that could be reduced                   |
| "Which factors drive the common cause variation?" | Boxplot showing factor contribution                 |

**The workflow:**

```
LOCAL LEVEL                         SYSTEM LEVEL
─────────────────                   ─────────────────
I-Chart reveals                     I-Chart reveals
special cause                       stable but not capable
       ↓                                   ↓
Supervisor                          Corporate Quality /
investigates                        Business Improvement
       ↓                                   ↓
Find & remove                       Fundamental process
the cause                           change project
       ↓                                   ↓
Restore stability                   Reduce common cause
                                    variation
       ↓                                   ↓
BACK TO NORMAL                      NEW CAPABILITY LEVEL
```

---

## VaRiScout Connects Both Levels

**For local teams:** I-Chart with control limits → "Is something unusual happening?"

**For improvement functions:** I-Chart with BOTH limits → "Is the system capable?" + Boxplot → "What drives the variation?"

> VaRiScout finds WHERE to focus — whether it's a special cause for local action or common cause variation for system improvement. Apply Lean thinking to find WHY — and what to do about it.

---

## See Also

- [OVERVIEW](./OVERVIEW.md) - Two Voices introduction
- [Four Scenarios](./SCENARIOS.md) - Different combinations of stability and capability
- [VaRiScout Implementation](./VARISCOUT-IMPL.md) - How VaRiScout shows both situations
