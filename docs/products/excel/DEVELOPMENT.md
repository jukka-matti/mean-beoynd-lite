# Excel Add-in Development

## Prerequisites

- Node.js 18+
- pnpm
- Microsoft 365 subscription (for testing)

---

## Development Setup

### Start Development Server

```bash
# From repository root
pnpm --filter @variscout/excel-addin dev
```

This starts the development server at `https://localhost:3000`.

### Sideload the Add-in

1. Open Excel (desktop or web)
2. Go to Insert → Add-ins → My Add-ins
3. Click "Upload My Add-in"
4. Select `manifest.xml` from the project

### Debug in VS Code

1. Install "Office Add-in Debug" extension
2. Press F5 to start debugging
3. Excel opens with add-in loaded
4. Set breakpoints in VS Code

---

## Project Structure

```
apps/excel-addin/
├── src/
│   ├── taskpane/              # Task Pane UI
│   │   ├── components/        # React components
│   │   │   ├── SetupWizard/   # Column mapping
│   │   │   ├── SpecLimits/    # Spec input
│   │   │   └── Settings/      # License, preferences
│   │   └── index.tsx          # Task Pane entry
│   │
│   ├── content/               # Content Add-in (Charts)
│   │   ├── ContentDashboard.tsx
│   │   ├── ContentPerformanceDashboard.tsx
│   │   └── index.tsx          # Content entry
│   │
│   ├── lib/                   # Shared utilities
│   │   ├── stateBridge.ts     # State sync
│   │   ├── excelApi.ts        # Excel API helpers
│   │   └── darkTheme.ts       # Chart theme tokens
│   │
│   └── components/            # Shared components
│       └── HelpTooltip.tsx    # Fluent UI help tooltip
│
├── manifest.xml               # Add-in manifest
├── package.json
└── vite.config.ts
```

---

## Build Commands

```bash
# Development
pnpm --filter @variscout/excel-addin dev

# Production build
pnpm --filter @variscout/excel-addin build

# Type checking
pnpm --filter @variscout/excel-addin typecheck

# Tests
pnpm --filter @variscout/excel-addin test
```

---

## Key Files

| File                     | Purpose                                             |
| ------------------------ | --------------------------------------------------- |
| `src/lib/stateBridge.ts` | State synchronization between Task Pane and Content |
| `src/lib/darkTheme.ts`   | Dark theme tokens for Content Add-in                |
| `src/lib/excelApi.ts`    | Excel API helper functions                          |
| `manifest.xml`           | Office Add-in manifest                              |

---

## Theme Usage

### Task Pane (Light Theme)

```tsx
import { makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
  },
});
```

### Content Add-in (Dark Theme)

```tsx
import { darkTheme } from '../lib/darkTheme';

const style = {
  backgroundColor: darkTheme.colorNeutralBackground1,
  color: darkTheme.colorNeutralForeground1,
};
```

---

## See Also

- [Architecture](./ARCHITECTURE.md) - Technical architecture
- [Design System](./design-system/OVERVIEW.md) - UI design system
