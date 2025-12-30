# VariScout Lite

Lightweight, offline-first variation analysis tool for quality professionals.

## Quick Reference

```bash
pnpm dev             # Start PWA development server (http://localhost:5173)
pnpm dev:excel       # Start Excel Add-in dev server (https://localhost:3000)
pnpm build           # Build all packages and apps
pnpm build:pwa       # Build PWA only
pnpm build:excel     # Build Excel Add-in only
pnpm preview         # Preview production build
pnpm test            # Run Vitest tests

# Edition-specific builds
pnpm build:pwa:community  # Free with "VariScout Lite" branding
pnpm build:pwa:itc        # ITC branding (separate distribution)
pnpm build:pwa:licensed   # No branding (for pre-licensed builds)
```

## Repository Structure

This is a **pnpm workspaces monorepo**:

```
variscout-lite/
├── packages/
│   ├── core/              # @variscout/core - Shared logic (stats, parser, license)
│   └── charts/            # @variscout/charts - Props-based Visx chart components
├── apps/
│   ├── pwa/               # @variscout/pwa - PWA website
│   └── excel-addin/       # @variscout/excel-addin - Excel Add-in (task pane + content)
├── docs/                  # Documentation
└── package.json           # Root scripts
```

## Key Files

### Shared Package (@variscout/core)

| File                          | Purpose                                                             |
| ----------------------------- | ------------------------------------------------------------------- |
| @packages/core/src/stats.ts   | Statistics (mean, Cp, Cpk, calculateConformance, groupDataByFactor) |
| @packages/core/src/parser.ts  | CSV/Excel file parsing                                              |
| @packages/core/src/license.ts | License key validation and storage                                  |
| @packages/core/src/edition.ts | Edition detection (community/itc/licensed)                          |
| @packages/core/src/export.ts  | CSV generation and spec status                                      |
| @packages/core/src/types.ts   | Shared TypeScript interfaces (StatsResult, ConformanceResult)       |

### Charts Package (@variscout/charts)

| File                                         | Purpose                                       |
| -------------------------------------------- | --------------------------------------------- |
| @packages/charts/src/IChart.tsx              | I-Chart (individual control chart) component  |
| @packages/charts/src/Boxplot.tsx             | Boxplot component for factor comparison       |
| @packages/charts/src/ParetoChart.tsx         | Pareto chart component                        |
| @packages/charts/src/CapabilityHistogram.tsx | Distribution histogram with spec limits       |
| @packages/charts/src/ProbabilityPlot.tsx     | Normal probability plot                       |
| @packages/charts/src/ChartSourceBar.tsx      | Branding footer bar component                 |
| @packages/charts/src/responsive.ts           | Responsive margin/font utilities              |
| @packages/charts/src/types.ts                | Chart prop interfaces and BoxplotStats helper |

### PWA Application (@variscout/pwa)

| File                                               | Purpose                                            |
| -------------------------------------------------- | -------------------------------------------------- |
| @apps/pwa/src/context/DataContext.tsx              | Central state management (rawData, filters, specs) |
| @apps/pwa/src/components/Dashboard.tsx             | Main 3-chart layout (conditionally renders mobile) |
| @apps/pwa/src/components/MobileDashboard.tsx       | Tab-based mobile chart navigation with swipe       |
| @apps/pwa/src/components/MobileStatsPanel.tsx      | Mobile stats with Summary/Histogram/Prob Plot tabs |
| @apps/pwa/src/components/MobileMenu.tsx            | Dropdown menu for mobile toolbar overflow          |
| @apps/pwa/src/components/StatsPanel.tsx            | Statistics display with Summary/Histogram tabs     |
| @apps/pwa/src/hooks/useResponsiveChartMargins.ts   | Dynamic chart margins, fonts, tick counts          |
| @apps/pwa/src/lib/persistence.ts                   | IndexedDB + localStorage operations                |
| @apps/pwa/src/lib/edition.ts                       | Edition wrapper (configures from Vite env)         |
| @apps/pwa/src/components/charts/ChartSourceBar.tsx | Chart footer branding component                    |

### Excel Add-in (@variscout/excel-addin)

**Task Pane (sidebar UI):**

| File                                                       | Purpose                                         |
| ---------------------------------------------------------- | ----------------------------------------------- |
| @apps/excel-addin/src/main.tsx                             | Task pane entry point, Office.js initialization |
| @apps/excel-addin/src/taskpane/App.tsx                     | Task pane root component                        |
| @apps/excel-addin/src/taskpane/components/SetupWizard.tsx  | 4-step configuration wizard                     |
| @apps/excel-addin/src/taskpane/components/ChartPanel.tsx   | I-Chart and Boxplot display                     |
| @apps/excel-addin/src/taskpane/components/StatsDisplay.tsx | Stats and conformance display                   |
| @apps/excel-addin/src/taskpane/components/DataSelector.tsx | Excel range picker                              |

**Content Add-in (embedded in worksheet):**

| File                                               | Purpose                                        |
| -------------------------------------------------- | ---------------------------------------------- |
| @apps/excel-addin/src/content/main.tsx             | Content add-in entry point                     |
| @apps/excel-addin/src/content/App.tsx              | Content add-in root component                  |
| @apps/excel-addin/src/content/ContentDashboard.tsx | Embedded I-Chart + Boxplot with live filtering |

**Excel Integration Utilities:**

| File                                       | Purpose                                    |
| ------------------------------------------ | ------------------------------------------ |
| @apps/excel-addin/src/lib/stateBridge.ts   | State sync via Custom Document Properties  |
| @apps/excel-addin/src/lib/tableManager.ts  | Excel Table creation and management        |
| @apps/excel-addin/src/lib/slicerManager.ts | Native Excel slicer creation and filtering |
| @apps/excel-addin/src/lib/dataFilter.ts    | Data filtering logic for slicer changes    |
| @apps/excel-addin/src/lib/excelData.ts     | Excel range reading and data extraction    |
| @apps/excel-addin/manifest.xml             | Office Add-in manifest (task pane)         |
| @apps/excel-addin/manifest-content.xml     | Content Add-in manifest                    |

> **Architecture:** Hybrid Approach - Native Excel slicers for filtering + Visx Content Add-in for charts. See [Excel Add-in Strategy](docs/concepts/EXCEL_ADDIN_STRATEGY.md).

## Architecture

**pnpm workspaces monorepo with "No Backend" philosophy:**

- All data processing happens in browser (TypeScript)
- No database server - data loaded from user files
- Persistence: localStorage (auto-save) + IndexedDB (named projects)
- `.vrs` files are JSON exports for sharing/backup
- Shared logic in `@variscout/core` package

**Data Flow:**

```
User File (CSV/XLSX) → Parser → RawData → FilterEngine → FilteredData → Charts
                                   ↓                          ↓
                              Auto-Save              Stats Calculation
```

## Code Style

- **Components**: React functional components with hooks
- **State**: Context API (DataContext.tsx) - no Redux
- **Styling**: Tailwind CSS utility classes
- **Charts**: Visx low-level primitives (not high-level abstractions)
- **TypeScript**: Strict mode enabled

**Naming:**

- Components: PascalCase (`StatsPanel.tsx`)
- Hooks: `use` prefix (`useDataIngestion.ts`)
- Utils: camelCase (`persistence.ts`)

**Color Conventions:**

- Green (`text-green-500`): Pass/in-spec
- Red (`text-red-400`): Fail USL
- Amber (`text-amber-500`): Fail LSL
- Slate palette: UI chrome

## Core Concepts

### Outcome vs Factor

- **Outcome**: Continuous measurement variable (Y-axis of I-Chart, Boxplot)
- **Factor**: Categorical grouping variable (Boxplot groups, Pareto bars)

### Linked Filtering

All charts react to all filters:

- I-Chart brush → `timeRange` filter
- Boxplot click → `factorValue` filter
- Pareto click → `category` filter

### Statistics

- **Conformance**: Pass/Fail counts against USL/LSL specs
- **Capability**: Cp (potential), Cpk (actual) - requires both USL and LSL

## Editions & Licensing

### Three Editions

| Edition       | Price | Branding                                 | Distribution           |
| ------------- | ----- | ---------------------------------------- | ---------------------- |
| **Community** | Free  | Footer bar: "VariScout Lite" + n=        | Public web             |
| **ITC**       | Free  | Footer bar: "International Trade Centre" | ITC network            |
| **Licensed**  | €39   | No branding                              | License key activation |

### Chart Footer Source Bar

All charts display a footer bar (in Community/ITC editions):

```
┌─────────────────────────────────────┐
│  [chart content]                    │
├─────────────────────────────────────┤
│ ▌VariScout Lite          n=50      │
└─────────────────────────────────────┘
```

- Blue accent bar + branding text on left
- Sample size (n=) on right
- Hidden when Licensed edition or valid license key

### License Key System

- **Format**: `VSL-XXXX-XXXX-XXXX` (alphanumeric with checksum)
- **Storage**: localStorage (`variscout_license`)
- **Validation**: Offline checksum verification (no server needed)
- **UI**: Settings modal → Section 4: License

### Build-time vs Runtime

- **Build-time**: `VITE_EDITION` env var sets default edition
- **Runtime**: License key can upgrade Community → Licensed
- Community users can activate Licensed by entering valid license key

### Generate Test License Key

```javascript
// In browser console:
import('./lib/license.js').then(m => console.log(m.generateLicenseKey()));
```

## Testing

```bash
pnpm test              # Run all tests
pnpm test -- --watch   # Watch mode
```

Tests use Vitest + React Testing Library. Test files in `__tests__/` directories.

## Documentation

- @README.md - Quick start and installation
- @PRODUCT_OVERVIEW.md - Product philosophy and features
- @ARCHITECTURE.md - Technical architecture details
- @docs/MONOREPO_ARCHITECTURE.md - Detailed monorepo documentation
- @Specs.md - Detailed functional specifications
- @UX_RESEARCH.md - User personas and use cases

### Excel Add-in Documentation

- @docs/concepts/EXCEL_ADDIN_STRATEGY.md - PWA vs Excel Add-in comparison, Hybrid approach decision
- @docs/concepts/EXCEL_COPILOT_CONCEPT.md - Copilot integration vision and examples
- @docs/concepts/MONETIZATION_CONCEPT.md - Licensing and pricing strategy
- @apps/excel-addin/README.md - Excel Add-in development setup
