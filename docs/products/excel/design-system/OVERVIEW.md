# Excel Add-in Design System

This document defines the design system for the VariScout Excel Add-in, formalizing UI patterns, colors, typography, spacing, and component guidelines.

---

## Design Philosophy

The Excel Add-in follows Microsoft's **Fluent UI** design language to provide a native Office experience while maintaining VariScout's identity in chart visualizations.

### Core Principles

| Principle                  | Description                                                       |
| -------------------------- | ----------------------------------------------------------------- |
| **Native Feel**            | Use Fluent UI components to match Office 365 experience           |
| **Two-Theme Architecture** | Light theme for Task Pane, dark theme for Content Add-in (charts) |
| **Token-Based Styling**    | Use Fluent UI design tokens for consistency                       |
| **Accessibility First**    | WCAG 2.1 AA compliance through Fluent UI                          |
| **Professional Data Viz**  | Charts match PWA quality using Visx                               |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Excel Add-in UI Architecture                               │
│                                                             │
│  ┌───────────────────────┐  ┌───────────────────────────┐  │
│  │  TASK PANE            │  │  CONTENT ADD-IN           │  │
│  │  (Light Theme)        │  │  (Dark Theme)             │  │
│  │                       │  │                           │  │
│  │  • Fluent UI v9       │  │  • Custom dark palette    │  │
│  │  • webLightTheme      │  │  • Visx charts            │  │
│  │  • Setup & config     │  │  • Embedded in worksheet  │  │
│  └───────────────────────┘  └───────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Theme Configuration

### Task Pane Setup

```tsx
import { FluentProvider, webLightTheme } from '@fluentui/react-components';

root.render(
  <FluentProvider theme={webLightTheme}>
    <App />
  </FluentProvider>
);
```

### Styling Approach

```tsx
import { makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    backgroundColor: tokens.colorNeutralBackground1,
    padding: tokens.spacingVerticalM,
    gap: tokens.spacingVerticalL,
  },
});
```

**Important:** Never use hardcoded colors in Task Pane components. Always use Fluent UI tokens.

---

## Related Documentation

- [Colors](./COLORS.md) - Light and dark theme color tokens
- [Typography](./TYPOGRAPHY.md) - Font sizes and weights
- [Spacing](./SPACING.md) - Spacing scale
- [Components](./COMPONENTS.md) - Component patterns
- [Icons](./ICONS.md) - Icon guidelines
- [Patterns](./PATTERNS.md) - Layout patterns
