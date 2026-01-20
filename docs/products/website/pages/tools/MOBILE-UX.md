# Tool Pages: Mobile UX

> Responsive design, interaction patterns, animation, and accessibility

---

## Responsive Design

### Desktop (>1024px)

- Full layout as shown in other docs
- Side-by-side comparisons
- Large interactive demos

### Tablet (768-1024px)

- Slightly narrower
- 2-column grids remain 2-column
- Demo still interactive

### Mobile (<768px)

- Single column
- Stacked cards
- Simplified demo (still interactive)
- Collapsible sections more important
- Sticky "Get VaRiScout" button at bottom

```
┌─────────────────────────┐
│  ⏱️ I-CHART      CHANGE │
│                         │
│  [Chart visual]         │
│                         │
│  "What patterns does    │
│   time reveal?"         │
│                         │
│  ─────────────────────  │
│                         │
│  WHEN TO USE            │
│  ┌───────────────────┐  │
│  │ 📈 Track metric   │  │
│  └───────────────────┘  │
│  ┌───────────────────┐  │
│  │ 🔍 Spot patterns  │  │
│  └───────────────────┘  │
│  ...                    │
│                         │
│  ─────────────────────  │
│                         │
│  HOW TO READ            │
│  [Annotated visual]     │
│                         │
│  ...                    │
│                         │
├─────────────────────────┤
│  [Get VaRiScout]  STICKY│
└─────────────────────────┘
```

---

## Interaction Patterns

### Hover/Tap Reveals

| Element      | Action    | Result                 |
| ------------ | --------- | ---------------------- |
| Chart point  | Hover/tap | Show value + timestamp |
| Chart region | Hover     | Highlight + label      |
| Pattern card | Hover     | Subtle animation       |
| Feature card | Hover     | Expand slightly        |

### Clicks/Taps

| Element           | Action | Result                      |
| ----------------- | ------ | --------------------------- |
| Filter button     | Click  | Re-render chart with filter |
| Pattern card      | Click  | Expand with more detail     |
| "Learn more" link | Click  | Navigate to related page    |
| Mistake section   | Click  | Expand/collapse             |

### Scroll Behaviors

| Behavior                  | Purpose                      |
| ------------------------- | ---------------------------- |
| Sticky header             | Navigation always accessible |
| Smooth scroll to sections | Orientation                  |
| Lazy load demos           | Performance                  |
| Parallax on hero (subtle) | Polish                       |

---

## Animation & Motion

### Principles

- **Purposeful:** Animation serves understanding, not decoration
- **Subtle:** Don't distract from content
- **Fast:** 200-300ms transitions

### Specific Animations

| Element          | Animation               | Purpose                 |
| ---------------- | ----------------------- | ----------------------- |
| Hero chart       | Points draw in sequence | Show time-order concept |
| Pattern cards    | Fade in on scroll       | Progressive reveal      |
| Filter click     | Points fade/color       | Show filtering action   |
| Demo interaction | Smooth transitions      | Responsive feel         |
| Linked filtering | Synchronized updates    | Show connection         |

---

## Accessibility

| Requirement         | Implementation                 |
| ------------------- | ------------------------------ |
| Color contrast      | WCAG AA minimum                |
| Alt text            | All images and charts          |
| Keyboard navigation | All interactive elements       |
| Screen reader       | ARIA labels on charts          |
| Reduced motion      | Respect prefers-reduced-motion |
| Text sizing         | Responsive, not fixed          |

---

## Implementation Notes

### Mobile-First Approach

Many users will come from mobile search. Design for mobile first, then enhance for larger screens.

**Key Mobile Considerations:**

1. **Touch targets** — Minimum 44x44px for interactive elements
2. **Thumb-friendly** — Important actions within thumb reach
3. **Fast loading** — Lazy load images and demos below the fold
4. **Readable text** — Minimum 16px body text, no zoom required
5. **Sticky CTA** — Conversion action always visible

### Breakpoint Strategy

```css
/* Mobile first */
.container {
  /* Mobile styles */
}

/* Tablet */
@media (min-width: 768px) {
  /* Tablet enhancements */
}

/* Desktop */
@media (min-width: 1024px) {
  /* Full desktop layout */
}

/* Large desktop */
@media (min-width: 1440px) {
  /* Max-width constraints */
}
```

---

## Next Steps

1. **Create wireframes** for one tool page (I-Chart as pilot)
2. **Design system** — colors, typography, spacing, components
3. **Prototype** interactive demo
4. **Template** — finalize structure for all tools
5. **Content creation** — write each page

---

_"Design is not just what it looks like. Design is how it works." — Steve Jobs_

---

## See Also

- [Overview](./OVERVIEW.md) - Design principles
- [Section Structure](./SECTION-STRUCTURE.md) - Hero, When to Use
- [Chart Reading](./CHART-READING.md) - How to Read, Patterns
- [Interactive Features](./INTERACTIVE-FEATURES.md) - Demo, Features, CTA
