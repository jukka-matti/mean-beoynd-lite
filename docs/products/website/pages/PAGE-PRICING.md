# Page Specification: Pricing

## Overview

| Property       | Value                     |
| -------------- | ------------------------- |
| URL            | `/pricing`                |
| Template       | Pricing page              |
| Content Source | `content/COPY-PRICING.md` |
| Priority       | High                      |

**Note**: This page is **informational only**. No checkout happens on the website. Users upgrade inside the PWA or purchase through Microsoft AppSource/Azure Marketplace.

---

## Wireframe

```
┌─────────────────────────────────────────────────────────────────────┐
│  HEADER                                                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                    HERO                                             │
│                                                                     │
│              Simple pricing. Start free.                           │
│                                                                     │
│   Demo in your browser. Install to upload your data.               │
│   License to save projects.                                        │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                    PRICING TIERS (4 cards)                          │
│                                                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐               │
│  │   Demo   │ │   Free   │ │ Licensed │ │  Excel   │               │
│  │          │ │    ★     │ │          │ │          │               │
│  │   €0     │ │   €0     │ │ €99/year │ │ €99/year │               │
│  │ forever  │ │ forever  │ │          │ │          │               │
│  │          │ │          │ │          │ │          │               │
│  │• Samples │ │• Upload  │ │• Save    │ │• Add-in  │               │
│  │• Charts  │ │• Entry   │ │• Export  │ │• In Excel│               │
│  │• Explore │ │• Tools   │ │• No mark │ │• Workbook│               │
│  │• Learn   │ │• Offline │ │• Themes  │ │• Native  │               │
│  │          │ │          │ │          │ │          │               │
│  │ ────────│ │ ────────│ │          │ │          │               │
│  │⚫ Samples │ │⚫ Session │ │          │ │          │               │
│  │⚫ No save │ │⚫ Mark    │ │          │ │          │               │
│  │          │ │          │ │          │ │          │               │
│  │[Try Demo]│ │[Install] │ │[License] │ │[Add-in]  │               │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘               │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                    HOW IT WORKS                                     │
│                                                                     │
│   Three simple steps                                               │
│                                                                     │
│   ①─────────────②─────────────③                                    │
│                                                                     │
│   ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                 │
│   │ ▶ Try Demo  │ │ ⬇ Install   │ │ 🔑 License  │                 │
│   │             │ │   Free      │ │  (Optional) │                 │
│   │ Explore     │ │             │ │             │                 │
│   │ samples in  │ │ Upload your │ │ Save your   │                 │
│   │ browser     │ │ own data    │ │ work €99/yr │                 │
│   └─────────────┘ └─────────────┘ └─────────────┘                 │
│                                                                     │
│   🛡 Secure payment    ⚡ Instant         🔄 30-day               │
│      via Paddle         activation         money-back              │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                    COMPARISON TABLE                                 │
│                                                                     │
│  ┌───────────────────┬──────┬──────┬──────────┐                    │
│  │ Feature           │ Demo │ Free │ Licensed │                    │
│  ├───────────────────┼──────┼──────┼──────────┤                    │
│  │ Sample datasets   │  ✓   │  ✓   │    ✓     │                    │
│  │ All chart types   │  ✓   │  ✓   │    ✓     │                    │
│  │ Upload CSV/Excel  │  ✗   │  ✓   │    ✓     │                    │
│  │ Manual data entry │  ✗   │  ✓   │    ✓     │                    │
│  │ Save projects     │  ✗   │  ✗   │    ✓     │                    │
│  │ Export .vrs       │  ✗   │  ✗   │    ✓     │                    │
│  │ No watermark      │  ✗   │  ✗   │    ✓     │                    │
│  │ Works offline     │  ✗   │  ✓   │    ✓     │                    │
│  │ Platform          │ Web  │ PWA  │   PWA    │                    │
│  └───────────────────┴──────┴──────┴──────────┘                    │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                    FAQ (accordion)                                  │
│                                                                     │
│  ▶ Why can't I upload files in my browser?                        │
│  ▶ What's the difference between Demo and Free?                   │
│  ▶ How do I upgrade from Free to Licensed?                        │
│  ▶ Where does my data go?                                          │
│  ▶ Is there a money-back guarantee?                                │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                    DATA PRIVACY CALLOUT                             │
│                                                                     │
│   🛡️ Your Data Stays Yours                                         │
│                                                                     │
│   VaRiScout runs entirely on your side. Your data never            │
│   leaves your browser/device.                                      │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                    TEAM OPTIONS                                     │
│                                                                     │
│   Need Team or Enterprise Features?                                │
│                                                                     │
│              ┌─────────────────────────────────┐                   │
│              │ ☁️ Azure Deployment              │                   │
│              │                                 │                   │
│              │ For organizations wanting       │                   │
│              │ full control                    │                   │
│              │                                 │                   │
│              │ • Custom domain                 │                   │
│              │ • SSO integration (Azure AD)    │                   │
│              │ • Custom branding               │                   │
│              │ • Unlimited users               │                   │
│              │ • Data stays in your tenant     │                   │
│              │                                 │                   │
│              │ €1799/year + ~€10-20/mo hosting │                   │
│              │                                 │                   │
│              │ [View in Azure Marketplace] →   │                   │
│              └─────────────────────────────────┘                   │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                    TRUST SIGNALS                                    │
│                                                                     │
│  ✓ 30-day money-back  ✓ Microsoft AppSource  ✓ Data stays local   │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                    FINAL CTA                                        │
│                                                                     │
│  Start with Demo                                                   │
│  No signup. No credit card. Just open and explore.                 │
│                                                                     │
│  [Try Demo]                                                        │
│  Install to upload your data. License to save projects.           │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                    FOOTER                                           │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Section Components

### Pricing Tiers

| Property       | Value                                              |
| -------------- | -------------------------------------------------- |
| Component      | `PricingTiers`                                     |
| Layout         | 4 cards, responsive grid (2 cols md, 4 cols lg)    |
| Highlight      | Free tier (second card, border/background)         |
| Mobile         | Stack vertically, highlighted first                |
| **Key Change** | CTAs link to /app, /app?upgrade=true, or AppSource |

#### Card Structure

```
┌─────────────────────┐
│ [Badge: Popular]    │  ← Optional (Free tier)
│                     │
│ TIER NAME           │
│                     │
│ €XX                 │
│ /year or forever    │
│                     │
│ Description         │
│                     │
│ • Feature 1         │
│ • Feature 2         │
│                     │
│ ─────────────────── │  ← Limitations (Demo/Free only)
│ ⚫ Limitation 1      │
│ ⚫ Limitation 2      │
│                     │
│ [CTA Button]        │  ← Links to /app
│ (note)              │  ← e.g. "Opens in browser"
└─────────────────────┘
```

### How It Works Section

| Property  | Value                                |
| --------- | ------------------------------------ |
| Component | `StepProcess`                        |
| Layout    | 3 steps in horizontal row, connected |
| Mobile    | Stack vertically                     |
| Icons     | Play, Download, Key                  |

### Comparison Table

| Property  | Value                       |
| --------- | --------------------------- |
| Component | `ComparisonTable`           |
| Layout    | Responsive table            |
| Mobile    | Horizontal scroll           |
| Sticky    | Header row                  |
| Columns   | Demo, Free, Licensed, Excel |

### Data Privacy Callout

| Property  | Value                      |
| --------- | -------------------------- |
| Component | `CalloutBox`               |
| Style     | Highlighted, icon (shield) |
| Position  | After comparison table     |

### Team Options

| Property  | Value                |
| --------- | -------------------- |
| Component | `TeamOptionsCard`    |
| Layout    | Single centered card |
| Content   | Azure Deployment     |

### FAQ

| Property      | Value                   |
| ------------- | ----------------------- |
| Component     | `Accordion`             |
| Schema        | FAQPage structured data |
| Initial State | All collapsed           |

---

## CTA Destinations (No Checkout)

| Tier     | CTA Text    | Destination                     | Notes                   |
| -------- | ----------- | ------------------------------- | ----------------------- |
| Demo     | Try Demo    | /app                            | Opens browser demo      |
| Free     | Install App | /app                            | Shows install prompt    |
| Licensed | Get License | /app?upgrade=true               | Goes to upgrade flow    |
| Excel    | Get Add-in  | https://appsource.microsoft.com | Via Microsoft AppSource |

**Important**: No checkout flows on website. PWA upgrades happen inside the app via Paddle. Excel Add-in purchased via Microsoft AppSource.

---

## External Links

| Product      | Destination                                  |
| ------------ | -------------------------------------------- |
| Excel Add-in | `https://appsource.microsoft.com/...`        |
| Azure        | `https://azuremarketplace.microsoft.com/...` |

Use `target="_blank" rel="noopener"` for all external links.

---

## Anchor Links

Support direct linking to sections:

- `/pricing#tiers`
- `/pricing#how-it-works`
- `/pricing#comparison`
- `/pricing#faq`

---

## SEO

| Element | Content                                                   |
| ------- | --------------------------------------------------------- |
| Title   | VaRiScout Pricing \| Demo Free, Install Free, License €99 |
| H1      | Simple pricing. Start free.                               |
| Schema  | FAQPage, Product with offers                              |

---

## Analytics Events

| Event             | Trigger                             |
| ----------------- | ----------------------------------- |
| `pricing_view`    | Page load                           |
| `tier_click`      | Tier CTA click (with tier name)     |
| `comparison_view` | Comparison table scrolled into view |
| `external_link`   | AppSource/Azure link clicked        |
| `faq_expand`      | FAQ item opened                     |

---

## Mobile Considerations

- Pricing cards: 1 column on mobile, swipeable
- Show highlighted tier (Free) first
- Comparison table: horizontal scroll with sticky first column
- Large touch targets on CTAs
- External link icons visible
