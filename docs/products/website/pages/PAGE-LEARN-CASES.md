# Case Study Pages Specification

## Overview

Interactive case study pages that embed the VariScout PWA with pre-loaded sample data. Each case combines:

- Problem context and learning objectives
- Embedded interactive app (iframe)
- Guided prompts for hands-on exploration

## URL Structure

```
/learn/mango-export     - Factor identification case
/learn/textiles-strength - Process capability case
/learn/coffee-defects   - Defect prioritization case
```

## Embed URL Format

```
https://app.variscout.com?sample=mango-export&embed=true
```

**Parameters:**

- `sample=<urlKey>` - Auto-loads the specified sample dataset
- `embed=true` - Hides header/footer for clean iframe display

**Available sample keys:**
| URL Key | Sample Name | Focus |
|---------|-------------|-------|
| `mango-export` | Agri-Food: Mango Export | Factor identification, ANOVA |
| `textiles-strength` | Textiles: Fabric Strength | Process capability, Cpk |
| `coffee-defects` | Coffee: Defect Analysis | Pareto, grade breakdown |

## Page Layout

### Desktop (>768px)

```
┌─────────────────────────────────────────────────────────────────┐
│                        Page Header                              │
├────────────────────────────┬────────────────────────────────────┤
│                            │                                    │
│  Tutorial Content          │   Embedded PWA                     │
│  (40% width)               │   (60% width)                      │
│                            │                                    │
│  - Problem Statement       │   [Interactive app with            │
│  - Learning Objectives     │    pre-loaded sample data]         │
│  - Guided Prompts          │                                    │
│  - Concept Explanations    │   iframe:                          │
│                            │   src="?sample=xxx&embed=true"     │
│                            │   min-height: 600px                │
│                            │                                    │
├────────────────────────────┴────────────────────────────────────┤
│                        Footer Links                             │
└─────────────────────────────────────────────────────────────────┘
```

### Mobile (<768px)

```
┌─────────────────────────────┐
│       Page Header           │
├─────────────────────────────┤
│                             │
│   Tutorial Content          │
│   (full width)              │
│                             │
├─────────────────────────────┤
│                             │
│   Embedded PWA              │
│   (full width)              │
│   min-height: 500px         │
│                             │
├─────────────────────────────┤
│       Footer Links          │
└─────────────────────────────┘
```

## Page Components

### 1. Problem Statement Card

```html
<div class="problem-card">
  <h2>The Problem</h2>
  <p class="lead">Which farm is causing weight compliance failures?</p>
  <p class="context">
    A mango exporter needs to identify which supplying farm produces the most inconsistent fruit
    weights, causing EU compliance failures.
  </p>
</div>
```

### 2. Learning Objectives

```html
<div class="objectives">
  <h3>What You'll Learn</h3>
  <ul>
    <li>How to compare group variation using Boxplots</li>
    <li>Interpreting ANOVA results (p-value, eta-squared)</li>
    <li>Using drill-down to explore data interactively</li>
  </ul>
</div>
```

### 3. Guided Prompts (Numbered Steps)

```html
<div class="guided-steps">
  <div class="step">
    <span class="step-number">1</span>
    <div class="step-content">
      <h4>Look at the Boxplot</h4>
      <p>
        Notice how Farm A (Smallholder) has a much wider box than Farm C (Commercial). The wider the
        box, the more variation.
      </p>
    </div>
  </div>

  <div class="step">
    <span class="step-number">2</span>
    <div class="step-content">
      <h4>Check the ANOVA Results</h4>
      <p>
        Below the Boxplot, you'll see "p = 0.001". This means the difference between farms is
        statistically significant (not due to random chance).
      </p>
    </div>
  </div>

  <div class="step interactive">
    <span class="step-number">3</span>
    <div class="step-content">
      <h4>Try It: Click on Farm A</h4>
      <p>
        Click the "Farm A" box in the Boxplot. Watch how all charts update to show only Farm A's
        data. This is drill-down filtering.
      </p>
    </div>
  </div>
</div>
```

### 4. Embedded App (iframe)

```html
<div class="app-embed">
  <iframe
    src="https://app.variscout.com?sample=mango-export&embed=true"
    title="VariScout Interactive Analysis"
    width="100%"
    height="600"
    frameborder="0"
    allow="clipboard-write"
  ></iframe>
</div>
```

### 5. Footer Links

```html
<div class="case-footer">
  <div class="next-case">
    <span>Next Case Study:</span>
    <a href="/learn/textiles-strength">Process Capability Analysis →</a>
  </div>
  <div class="try-own">
    <a href="https://app.variscout.com" class="cta-button"> Try With Your Own Data </a>
  </div>
</div>
```

## Styling Guidelines

### Colors (from design system)

```css
--bg-page: #0f172a; /* slate-900 */
--bg-card: #1e293b; /* slate-800 */
--text-primary: #f1f5f9; /* slate-100 */
--text-secondary: #94a3b8; /* slate-400 */
--accent: #3b82f6; /* blue-500 */
--success: #22c55e; /* green-500 */
```

### Typography

- Page title: 24px, font-weight 700
- Section headings: 18px, font-weight 600
- Body text: 14px, line-height 1.6
- Step numbers: 20px, font-weight 700, accent color

### Interactive Prompts

Highlight "try it" steps with a distinct border:

```css
.step.interactive {
  border-left: 3px solid var(--accent);
  background: rgba(59, 130, 246, 0.1);
}
```

## Accessibility

- All images have descriptive alt text
- Step numbers are ARIA-hidden (content provides context)
- iframe has descriptive title attribute
- Focus visible on all interactive elements
- Sufficient color contrast (WCAG AA)

## SEO Metadata

```html
<title>Find the Problem Farm - VariScout Case Study</title>
<meta
  name="description"
  content="Learn how to identify which factor
      drives process variation using interactive Boxplot and ANOVA
      analysis in VariScout."
/>
<meta property="og:image" content="/images/case-mango-preview.png" />
```

## Implementation Notes

1. **iframe Security**: Same-origin policy allows clipboard-write
2. **Responsive iframe**: Use CSS aspect-ratio or min-height
3. **Loading State**: Show spinner while iframe loads
4. **Error Handling**: Graceful fallback if app fails to load

## File Structure

```
/learn/
├── mango-export/
│   └── index.html (or page component)
├── textiles-strength/
│   └── index.html
└── coffee-defects/
    └── index.html
```
