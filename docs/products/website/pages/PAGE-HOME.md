# Page Specification: Homepage

## Overview

| Property       | Value                  |
| -------------- | ---------------------- |
| URL            | `/`                    |
| Template       | Landing page           |
| Content Source | `content/COPY-HOME.md` |
| Priority       | High                   |

---

## Wireframe

```
┌─────────────────────────────────────────────────────────────────────┐
│  HEADER (sticky)                                                    │
│  🔍 VaRiScout   Journey   Explore ▼   Tools ▼   Product ▼  [Try Free]│
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                    HERO SECTION                                     │
│                                                                     │
│              See Beyond Averages. Find your 46%.                    │
│                                                                     │
│              [Try Free]    [Take the Journey]                       │
│                                                                     │
│     ┌─────────────────────────────────────────────────────────┐    │
│     │  YOUR DASHBOARD SAYS:                                   │    │
│     │                                                         │    │
│     │   [████ 96%] [████ 94%] [████ 95%]                     │    │
│     │   Factor A   Factor B   Factor C                       │    │
│     │                                                         │    │
│     │   "Everything looks fine. 95% pass rate."              │    │
│     └─────────────────────────────────────────────────────────┘    │
│                                                                     │
│                      But is it?                                     │
│                                                                     │
│              [↓ See what's hiding]                                  │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                    MINI-JOURNEY SECTION                             │
│                    "The Transformation"                             │
│                                                                     │
│   ┌───────────────────────┐   ┌───────────────────────┐            │
│   │  ALL DATA MIXED       │   │  FILTERED BY FACTOR   │            │
│   │                       │   │                       │            │
│   │  [Chaotic I-Chart]    │   │  [Clean I-Chart]      │            │
│   │                       │   │                       │            │
│   │  "Looks unstable"     │   │  "Factor A is stable" │            │
│   └───────────────────────┘   └───────────────────────┘            │
│                                                                     │
│          Same data. Different questions.                            │
│          46% of variation in one place.                             │
│                                                                     │
│              [Take the Full Journey →]                              │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                    FOUR PILLARS SECTION                             │
│                "Four Questions. Four Tools."                        │
│                                                                     │
│   ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐  │
│   │   CHANGE    │ │    FLOW     │ │   FAILURE   │ │    VALUE    │  │
│   │   (blue)    │ │  (orange)   │ │    (red)    │ │   (green)   │  │
│   │             │ │             │ │             │ │             │  │
│   │ "Is it      │ │ "Which      │ │ "Where do   │ │ "Does it    │  │
│   │  stable?"   │ │  factor?"   │ │  problems   │ │  meet       │  │
│   │             │ │             │ │  cluster?"  │ │  specs?"    │  │
│   │  [I-Chart]  │ │  [Boxplot]  │ │  [Pareto]   │ │[Capability] │  │
│   └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘  │
│                                                                     │
│              [Experience the full journey →]                        │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                    USE CASES (2 columns)                            │
│                    "Two Worlds, One Tool"                           │
│                                                                     │
│   ┌───────────────────┐   ┌───────────────────┐                     │
│   │ LSS Training      │   │ Quality &         │                     │
│   │ & Projects        │   │ Operations        │                     │
│   │                   │   │                   │                     │
│   │ [Learn More]      │   │ [Learn More]      │                     │
│   └───────────────────┘   └───────────────────┘                     │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                    PRODUCTS (4 cards)                               │
│                    "Choose Your Platform"                           │
│                                                                     │
│   [Web App]  [Excel]  [Power BI]  [Azure]                          │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                    FINAL CTA                                        │
│                                                                     │
│              Where's YOUR 46%?                                      │
│    Your data is hiding opportunity.                                 │
│    Find it. Fix it. Check it. Continue.                            │
│                                                                     │
│         [Try Free - No Signup]   [Take the Journey]                │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                    FOOTER                                           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Sections Detail

### 1. Header

| Property   | Value                                |
| ---------- | ------------------------------------ |
| Component  | `Header`                             |
| Position   | Sticky top                           |
| Background | White (scrolled) / Transparent (top) |

**Navigation order:** Journey | Explore ▼ | Tools ▼ | Learn ▼ | Product ▼ | Pricing

### 2. Hero Section

| Property   | Value                            |
| ---------- | -------------------------------- |
| Component  | `Hero` with `showAveragesHook`   |
| Layout     | Centered text + dashboard visual |
| Background | White                            |
| Padding    | `--space-20` vertical            |

**Content Mapping:**

```yaml
headline: 'See Beyond Averages.'
headline_emphasis: 'Find your 46%.'
subhead: '46% of your improvement potential may be hiding in one place. VaRiScout finds WHERE to focus.'
cta_primary:
  text: 'Try Free'
  url: '/app'
cta_secondary:
  text: 'Take the Journey'
  url: '/journey'
showAveragesHook: true
```

**AVERAGES Hook Visual:**

- Bar chart showing 96%, 94%, 95% for Factors A, B, C
- Message: "Everything looks fine. 95% pass rate."
- Hook: "But is it?"
- Link: "See what's hiding ↓" → scrolls to MiniJourney

### 3. MiniJourney Section

| Property   | Value                 |
| ---------- | --------------------- |
| Component  | `MiniJourney`         |
| Background | `--color-neutral-900` |
| Text Color | White                 |
| Padding    | `--space-24` vertical |

**Content:**

- Header: "The Transformation"
- Before/After I-Chart comparison
- Discovery: "46% of variation in one place"
- CTA: "Take the Full Journey →" → `/journey`

### 4. Four Pillars Section

| Property   | Value                                 |
| ---------- | ------------------------------------- |
| Component  | `FourPillars`                         |
| Background | `--color-neutral-50`                  |
| Layout     | 4 columns desktop, 2 tablet, 1 mobile |

**Pillars:**
| Pillar | Color | Tool | Question |
|--------|-------|------|----------|
| CHANGE | blue-500 | I-Chart | "Is it stable over time?" |
| FLOW | orange-500 | Boxplot | "Which factor drives variation?" |
| FAILURE | red-500 | Pareto | "Where do problems concentrate?" |
| VALUE | green-500 | Capability | "Does it meet customer specs?" |

Each card links to respective tool page.

### 5. Use Cases

| Property   | Value                        |
| ---------- | ---------------------------- |
| Component  | `TwoColumnCards`             |
| Layout     | 2 columns desktop, 1 mobile  |
| Card Style | Clickable, with hover effect |

### 6. Products Overview

| Property   | Value                                |
| ---------- | ------------------------------------ |
| Component  | `ProductCards`                       |
| Layout     | 4 columns desktop, 2 tablet          |
| Card Style | Compact with icon, title, price hint |

### 7. Final CTA

| Property   | Value                                  |
| ---------- | -------------------------------------- |
| Component  | `CTASection`                           |
| Background | Brand primary                          |
| Text Color | White                                  |
| Headline   | "Where's YOUR 46%?"                    |
| Tagline    | "Find it. Fix it. Check it. Continue." |

---

## Journey Integration

The homepage now serves as the **entry point** to the VaRiScout Journey:

```
Hero (AVERAGES hook)
    ↓ "See what's hiding"
MiniJourney (transformation teaser)
    ↓ "Take the Full Journey"
/journey (full 9-section experience)
    ↓
/app (apply to your data)
```

---

## Responsive Behavior

| Breakpoint | Changes                          |
| ---------- | -------------------------------- |
| < 768px    | Stack all multi-column sections  |
| < 768px    | Hero text smaller (`--text-3xl`) |
| < 768px    | Four Pillars → 1 column          |
| < 1024px   | Four Pillars → 2 columns         |

---

## Performance

| Metric | Target  |
| ------ | ------- |
| LCP    | < 2.5s  |
| FID    | < 100ms |
| CLS    | < 0.1   |

---

## SEO

| Element          | Content                                                                                         |
| ---------------- | ----------------------------------------------------------------------------------------------- | -------------------- |
| Title            | "VaRiScout                                                                                      | See Beyond Averages" |
| Meta Description | "46% of your improvement potential may be hiding in one place. VaRiScout finds WHERE to focus." |
| H1               | "See Beyond Averages. Find your 46%."                                                           |

---

## Analytics Events

| Event                 | Trigger                   |
| --------------------- | ------------------------- |
| `hero_cta_click`      | Primary CTA click         |
| `journey_link_click`  | Journey button click      |
| `averages_hook_click` | "See what's hiding" click |
| `mini_journey_cta`    | MiniJourney CTA click     |
| `pillar_card_click`   | Four Pillars card click   |
| `use_case_click`      | Use case card click       |
| `product_card_click`  | Product card click        |
| `final_cta_click`     | Final CTA click           |
