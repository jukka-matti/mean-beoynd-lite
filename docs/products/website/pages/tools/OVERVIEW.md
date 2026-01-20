# VaRiScout Tool Pages: Overview

> Design principles and page structure for tool pages

---

## Design Principles

### 1. Answer First

The user came with a question. Answer it immediately.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ❌ DON'T                                                       │
│                                                                 │
│  "Welcome to VaRiScout's I-Chart page. VaRiScout is a          │
│  powerful tool developed by RDMAIC Oy that helps you           │
│  understand variation in your processes. The I-Chart,          │
│  also known as an Individuals Chart, is one of five..."        │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ✅ DO                                                          │
│                                                                 │
│  I-CHART                                                        │
│  "What patterns does time reveal?"                              │
│                                                                 │
│  [VISUAL OF I-CHART]                                           │
│                                                                 │
│  Plot every data point in time order.                          │
│  See patterns that averages hide.                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2. Visual Before Verbal

Show, then explain.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ❌ DON'T                                                       │
│                                                                 │
│  "A boxplot, also called a box-and-whisker plot, displays      │
│  the distribution of data based on a five-number summary:      │
│  minimum, first quartile (Q1), median, third quartile (Q3),    │
│  and maximum. The interquartile range (IQR) represents..."     │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ✅ DO                                                          │
│                                                                 │
│       ┌───────┐                                                │
│   ────┤       ├────   ← Whiskers show full range               │
│       │   ─   │       ← Line = median                          │
│       │       │       ← Box = middle 50%                       │
│       └───────┘                                                │
│                                                                 │
│  "Where does the spread come from?"                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3. Progressive Disclosure

Layer information. Don't overwhelm.

```
LAYER 1 (visible)     → One-sentence answer + visual
LAYER 2 (scroll)      → How to read it
LAYER 3 (scroll)      → Patterns to find
LAYER 4 (scroll)      → VaRiScout features
LAYER 5 (expand/click)→ Deep details, edge cases
```

### 4. Consistent But Not Boring

Same structure across tools, but each has personality.

| Tool       | Color Accent | Icon/Vibe                 |
| ---------- | ------------ | ------------------------- |
| I-Chart    | Blue         | Time, sequence, rhythm    |
| Boxplot    | Orange       | Comparison, spread        |
| Pareto     | Red/Yellow   | Priority, focus           |
| Capability | Green        | Pass/fail, specs          |
| Regression | Purple       | Relationship, correlation |

### 5. Mobile-First

Many users will come from mobile search.

---

## Page Layout

### Overall Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER (sticky)                                                │
│  VaRiScout    Tools ▼    Cases    Learn    Pricing    [Get it] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  HERO SECTION                                                   │
│  ─────────────────────────────────────────────────────────────  │
│  Big visual + Core question + One-sentence answer               │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  WHEN TO USE                                                    │
│  ─────────────────────────────────────────────────────────────  │
│  Quick bullets: situations that call for this tool              │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  WHAT DATA DO YOU NEED?                                         │
│  ─────────────────────────────────────────────────────────────  │
│  Data type, how much, what factors to capture                   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  HOW TO READ                                                    │
│  ─────────────────────────────────────────────────────────────  │
│  Annotated visual with callouts                                 │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PATTERNS TO FIND                                               │
│  ─────────────────────────────────────────────────────────────  │
│  Visual examples of what to look for                            │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  TRY IT (Interactive Demo)                                      │
│  ─────────────────────────────────────────────────────────────  │
│  Pre-loaded case data, clickable chart                          │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  VARISCOUT FEATURES                                             │
│  ─────────────────────────────────────────────────────────────  │
│  What's special about our implementation                        │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  TWO MINDSETS                                                   │
│  ─────────────────────────────────────────────────────────────  │
│  EDA (VaRiScout) vs Traditional — know the difference           │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  WHAT'S NEXT? (Connected tools)                                 │
│  ─────────────────────────────────────────────────────────────  │
│  Links to related tools in the workflow                         │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  CTA                                                            │
│  ─────────────────────────────────────────────────────────────  │
│  "Where's YOUR 46%?"                                            │
│  [PWA]  [Excel]  [Enterprise]                                   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  FOOTER                                                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## See Also

- [Section Structure](./SECTION-STRUCTURE.md) - Hero, When to Use, Data Requirements
- [Chart Reading](./CHART-READING.md) - How to Read, Patterns
- [Interactive Features](./INTERACTIVE-FEATURES.md) - Demo, Features, CTA
- [Mobile UX](./MOBILE-UX.md) - Responsive design, interactions
