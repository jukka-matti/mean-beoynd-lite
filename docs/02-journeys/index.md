# User Journeys

How different users find, navigate, and convert on VariScout.

---

## Personas

| Persona                                            | Role                           | Goal                         | Entry Point                |
| -------------------------------------------------- | ------------------------------ | ---------------------------- | -------------------------- |
| [**Green Belt Gary**](personas/green-belt-gary.md) | Quality Engineer, GB certified | Find better tools than Excel | Google, LinkedIn, YouTube  |
| [**Curious Carlos**](personas/curious-carlos.md)   | Operations Supervisor          | Understand variation better  | YouTube, TikTok, Instagram |
| [**OpEx Olivia**](personas/opex-olivia.md)         | OpEx Manager                   | Find tools for team          | Referral, LinkedIn         |
| [**Student Sara**](personas/student-sara.md)       | LSS student / trainee          | Learn methodology            | Course link, Google        |
| [**Evaluator Erik**](personas/evaluator-erik.md)   | IT/Procurement                 | Assess for organization      | Direct link from colleague |
| [**Trainer Tina**](personas/trainer-tina.md)       | LSS Trainer / Consultant       | Tools for courses & clients  | LinkedIn, YouTube          |

**Secondary personas:** Consultant Chris, Academic Anna, Coffee Coop Carmen

---

## Entry Points

```
                                ┌─────────────────┐
                                │   variscout.com │
                                └────────┬────────┘
                                         │
    ┌────────────────┬───────────────────┼───────────────────┬────────────────┐
    │                │                   │                   │                │
    ▼                ▼                   ▼                   ▼                ▼
┌───────────┐ ┌───────────┐ ┌───────────────┐ ┌───────────┐ ┌───────────┐
│  Google   │ │ LinkedIn  │ │   YouTube /   │ │  Referral │ │  Direct   │
│  Search   │ │           │ │   Social      │ │           │ │   URL     │
└─────┬─────┘ └─────┬─────┘ └───────┬───────┘ └─────┬─────┘ └─────┬─────┘
      │             │               │               │             │
      ▼             ▼               ▼               ▼             ▼
┌───────────┐ ┌───────────┐ ┌───────────────┐ ┌───────────┐ ┌───────────┐
│ Tool Page │ │ Homepage  │ │ Blog / Tool   │ │ Homepage  │ │ Homepage  │
│ /tools/X  │ │     /     │ │    Page       │ │     /     │ │  or /app  │
└───────────┘ └───────────┘ └───────────────┘ └───────────┘ └───────────┘
```

### First Impression by Entry

| Entry Point                  | Lands On            | First Question                  | Must Answer in 5 Seconds        |
| ---------------------------- | ------------------- | ------------------------------- | ------------------------------- |
| Google "how to read boxplot" | /tools/boxplot      | "Does this answer my question?" | Yes - with visual + explanation |
| LinkedIn post about case     | /cases/bottleneck   | "Is this relevant to me?"       | Yes - industry recognition      |
| YouTube video link           | /blog/X or /tools/X | "Is there more?"                | Yes - deeper content + CTA      |
| TikTok/Instagram clip        | /tools/X or /       | "What is this tool?"            | Clear value prop + demo         |
| Colleague referral           | / (homepage)        | "What is this?"                 | Clear value prop + demo         |
| Return visit                 | / or /app           | "Where was I?"                  | Easy navigation to app/cases    |

---

## User Flows

<div class="grid cards" markdown>

- :material-magnify:{ .lg .middle } **SEO Learner**

  ***

  Google search → Tool page → Product

  [:octicons-arrow-right-24: Flow details](flows/seo-learner.md)

- :material-share-variant:{ .lg .middle } **Social Discovery**

  ***

  LinkedIn → Case → Product

  [:octicons-arrow-right-24: Flow details](flows/social-discovery.md)

- :material-youtube:{ .lg .middle } **Content & YouTube**

  ***

  YouTube/Content → Website → Product

  [:octicons-arrow-right-24: Flow details](flows/content-youtube.md)

- :material-domain:{ .lg .middle } **Enterprise**

  ***

  Referral → Enterprise evaluation

  [:octicons-arrow-right-24: Flow details](flows/enterprise.md)

- :material-redo:{ .lg .middle } **Return Visitor**

  ***

  Existing user → App

  [:octicons-arrow-right-24: Flow details](flows/return-visitor.md)

</div>

---

## Flow Priorities

| Priority | Flow                      | Why                             |
| -------- | ------------------------- | ------------------------------- |
| 1        | SEO → Tool Page → Product | Highest volume potential        |
| 2        | Social → Case → Product   | Best conversion story           |
| 3        | YouTube/Content → Website | Authority + warm leads          |
| 4        | Enterprise evaluation     | Self-serve, documentation-first |
| 5        | Return user → App         | Retention/activation            |

---

## Cross-Linking Strategy

```
                ┌─────────────┐
                │  Homepage   │
                └──────┬──────┘
                       │
      ┌────────────────┼────────────────┐
      │                │                │
      ▼                ▼                ▼
┌───────────┐    ┌───────────┐    ┌───────────┐
│  Journey  │    │   Cases   │    │   Tools   │
└─────┬─────┘    └─────┬─────┘    └─────┬─────┘
      │                │                │
      └────────────────┼────────────────┘
                       │
            CROSS-LINKS:
            Journey ←→ Cases (same methodology)
            Cases ←→ Tools (tool used in case)
            Tools ←→ Learn (deeper concepts)
            Tools ←→ Tools (workflow: I-Chart→Box)
            All ──→ Products (CTA)
                       │
                       ▼
                ┌─────────────┐
                │  Products   │ → Pricing → CONVERSION
                └─────────────┘
```

---

## Architecture Principles

1. **Multiple entry points** — Every page can be a landing page
2. **Clear paths to conversion** — CTA on every page
3. **Cross-linking** — No dead ends, always "what's next"
4. **Progressive depth** — Surface → Middle → Deep layers
5. **Mobile-first** — Sticky CTAs, simplified navigation
6. **No login needed** — License stored locally, "We don't have your data"

> **The website is a collection of interconnected experiences, not a linear funnel.**
>
> Users can enter anywhere, explore in any order, and convert when ready.
> Every page must stand alone AND connect to the whole.
