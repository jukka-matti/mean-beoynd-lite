> **ARCHIVED DOCUMENT**
>
> This document represents an exploratory design phase that was **not implemented**.
> We evaluated this 4-mode architecture but decided to "stay lite" with a simpler approach.
> The actual implementation is documented in `PRODUCT_OVERVIEW.md` in the project root.
>
> Preserved here for reference as it contains valuable UX research insights.

---

# VariScout Lite: Product Concept & Architecture

## Executive Summary

Based on UX research with quality professionals in developing countries, we developed four distinct product modes that address core user needs. All modes share the same core functionality while optimizing for different contexts.

**Architecture Decision: Unified product with Mode Switcher**

```
┌─────────────────────────────────────────────────────────────┐
│  MODE:  [Field] [Analysis] [Presentation] [Certification]   │
└─────────────────────────────────────────────────────────────┘
```

---

## Concept Comparison Matrix

| Dimension | A: Analyst | B: Educator | C: Field | D: Certification |
|-----------|-----------|-------------|----------|------------------|
| **Primary User** | Grace, Raj (experts) | Carlos (trainers) | Field inspectors | Export managers |
| **Core Value** | Speed & efficiency | Communication | Reliability | Compliance proof |
| **Key Metric** | 4 hrs → 1 hr | Non-experts understand | Zero data loss | Audit-ready docs |
| **UI Philosophy** | Dense, keyboard | Simple, visual | Touch-optimized | Traceability focus |
| **Learning Curve** | Moderate (course available) | Minimal | Minimal | Moderate |

---

## Concept A: The Analyst's Power Tool

### One-Line Summary
> "From raw data to defensible insights in under 60 seconds."

### Key Features
1. **Command Palette (Cmd+K)** - Keyboard-driven access to all functions
2. **Multi-Factor Drill-Down** - Eta-squared (η²) showing which factors explain variation
3. **Analysis Templates** - Save/load configurations for repeat analyses
4. **Compare Mode** - Side-by-side before/after analysis
5. **Batch Processing** - Queue multiple files, export all at once

### UX Philosophy
- **Density over simplicity** - Show more data, less whitespace
- **Keyboard first** - Every action via shortcut
- **Speed over guidance** - No confirmation dialogs for reversible actions

### Success Metrics
- Time to first insight: < 60 seconds
- Task completion: 75% faster than Excel
- Template adoption: 50%+ users save templates

---

## Concept B: The Quality Educator

### One-Line Summary
> "Transform data into stories that everyone understands."

### Key Features
1. **Annotated Grade Zones** - Charts with human-readable labels ("Specialty Zone", "Premium Zone")
2. **Plain-Language Insight Cards** - "8 of 10 samples reached Specialty this week"
3. **Presentation Mode** - Large fonts, high contrast, minimal chrome
4. **Interactive Chart Tutorials** - Step-by-step explainer overlays
5. **Before/After Comparison** - Visual improvement tracking

### Visualization Strategy for Non-Statisticians
- Boxplot: "Where most samples fall" instead of "interquartile range"
- I-Chart: Colored zones instead of UCL/LCL lines
- Pareto: "Focus here: These 2 farms cause 80% of issues"

### Success Metrics
- 5-second test: 80% correctly identify good/bad
- Users can explain boxplot to colleague after 1 use
- Image exports: 2+ per session

---

## Concept C: Field-First Mobile

### One-Line Summary
> "Quality decisions at the point of collection - works offline on any tablet."

### Key Features
1. **Quick-Entry Mode** - Large numpad (80px buttons), auto-advance, running stats
2. **Instant Decision Banner** - Green/Yellow/Red verdict visible at arm's length
3. **Offline Templates** - Pre-configured specs saved locally
4. **Resilient Sync Queue** - Background sync when connectivity returns
5. **One-Handed Operation** - Bottom-focused UI, gesture navigation

### UX Philosophy
- **Sunlight-readable** - 7:1 contrast ratio, large typography
- **Bulletproof persistence** - Auto-save every keystroke, multi-layer backup
- **Interrupted workflow design** - Restore exact state on return
- **Touch-optimized** - 56px primary actions, swipe gestures

### Success Metrics
- Time to first decision: < 3 minutes
- Data entry speed: 30 values per minute
- Zero data loss: 100% recovery rate

---

## Concept D: Certification & Compliance

### One-Line Summary
> "Generate audit-ready documentation that certification bodies trust."

### Target Certifications
- **Q Mark Kenya** (Kenya Bureau of Standards)
- **GlobalGAP** certification
- **EU import compliance**
- **Buyer-specific quality requirements**

### Key Features
1. **Certification Period Manager** - Track data within specific certification windows
2. **Traceability Chain** - Link every data point to source (farm, batch, date, collector)
3. **Spec Compliance Dashboard** - Cpk trend, pass rates, non-conformance tracking
4. **Audit Trail** - SHA-256 hash of data, timestamped action log
5. **One-Click Compliance Package** - ZIP with CSV + reports + methodology statement

### Data Export (CSV Format)
All collected data exportable to Excel-compatible CSV:

```csv
row_number,sample_id,source_id,collection_date,measurement,unit,spec_status,grade,origin_farm,variety
1,MANGO-001,FARM-A-2024,2024-03-15,325.4,g,PASS,Grade_A,Farm A,Kent
```

**Required Traceability Columns:**
- `sample_id` - Unique identifier
- `source_id` - Farm/Supplier/Batch code
- `collection_date` - When sample was collected
- `measurement` - The outcome value
- `spec_status` - PASS / FAIL_USL / FAIL_LSL
- `grade` - Grade classification (if using tiers)

### Audit Trail System
```typescript
interface AuditEntry {
  timestamp: string;       // ISO 8601
  action: 'data_import' | 'spec_change' | 'filter_applied' | 'report_generated';
  details: Record<string, any>;
  datasetHash: string;     // SHA-256 for integrity verification
}
```

### Compliance Reports
1. **Specification Compliance Summary** - Cpk, pass rate, non-conforming count
2. **Traceability Register** - Full data with source tracking (CSV)
3. **Statistical Methodology Statement** - How calculations are performed
4. **Non-Conformance Register** - All out-of-spec samples with details
5. **Trend Analysis Report** - Cpk over time, process stability

### Success Metrics
- Audit preparation time: 50% reduction
- Export adoption: 80% use CSV export
- Data integrity: 100% valid hash on export

---

## Technical Architecture

### Mode System Design

#### State Management
New `ModeContext` alongside existing `DataContext`:

```typescript
export type AppMode = 'field' | 'analysis' | 'presentation' | 'certification';

export interface ModeFeatures {
  touchOptimized: boolean;
  keyboardShortcuts: boolean;
  largeTypography: boolean;
  commandPalette: boolean;
  quickEntry: boolean;
  chartAnnotations: boolean;
  auditTrail: boolean;
  csvExport: boolean;
  showDecisionBanner: boolean;
  showEtaSquared: boolean;
  showInsightCards: boolean;
}
```

#### Feature Matrix

| Feature | Field | Analysis | Presentation | Certification |
|---------|-------|----------|--------------|---------------|
| Quick Entry Numpad | ✓ | | | |
| Decision Banner | ✓ | | | |
| Command Palette | | ✓ | | ✓ |
| Keyboard Shortcuts | | ✓ | | ✓ |
| Eta-squared (η²) | | ✓ | | ✓ |
| Chart Annotations | | | ✓ | |
| Insight Cards | | | ✓ | |
| Large Typography | | | ✓ | |
| Audit Trail | | | | ✓ |
| CSV Export | | | | ✓ |
| Templates | | ✓ | | |

#### Styling Strategy
CSS custom properties scoped to mode classes:

```css
:root {
  --font-size-base: 14px;
  --touch-target-min: 32px;
}

.mode-field {
  --font-size-base: 16px;
  --touch-target-min: 56px;
}

.mode-presentation {
  --font-size-base: 18px;
}
```

### Component Architecture

```
src/
├── components/
│   ├── core/                    # Mode-agnostic, shared
│   │   ├── Dashboard.tsx
│   │   ├── StatsPanel.tsx
│   │   └── charts/
│   │
│   └── mode/                    # Mode-specific
│       ├── ModeSwitcher.tsx
│       ├── field/
│       │   ├── DecisionBanner.tsx
│       │   └── QuickEntryPad.tsx
│       ├── analysis/
│       │   ├── CommandPalette.tsx
│       │   └── TemplatesPanel.tsx
│       ├── presentation/
│       │   ├── ChartAnnotation.tsx
│       │   └── InsightCard.tsx
│       └── certification/
│           ├── AuditTrailPanel.tsx
│           └── CSVExporter.tsx
│
├── context/
│   ├── DataContext.tsx          # Existing
│   └── ModeContext.tsx          # New
│
├── lib/
│   ├── persistence.ts           # Extended for audit trail
│   ├── auditTrail.ts            # New
│   └── export.ts                # New (CSV generation)
│
└── config/
    └── modeConfig.ts            # Mode feature definitions
```

### Data Layer Extensions

#### CSV Export
```typescript
export function exportToCSV(
  data: any[],
  stats: StatsResult,
  options: ExportOptions
): string {
  // Generates Excel-compatible CSV with traceability columns
}
```

#### Audit Trail Storage
```typescript
// IndexedDB schema extension
interface VariScoutDB extends DBSchema {
  projects: { ... },
  auditTrail: {
    key: string;
    value: AuditEntry;
    indexes: { 'by-project': string };
  };
}
```

### Performance Strategy

#### Code Splitting
Mode-specific components loaded on demand:

```typescript
const FieldComponents = React.lazy(() => import('./mode/field'));
const CertificationComponents = React.lazy(() => import('./mode/certification'));
```

#### Bundle Estimates
| Bundle | Size | Dependencies |
|--------|------|--------------|
| Core | ~150KB | React, Visx, idb |
| Field Mode | ~5KB | Simple UI |
| Analysis Mode | ~15KB | Command palette |
| Presentation Mode | ~8KB | Annotations |
| Certification Mode | ~10KB | CSV, date-fns |

---

## Implementation Roadmap

### Phase 1: Foundation (Core + Mode Switcher)
- Create `ModeContext` and mode configuration
- Add `ModeSwitcher` to header
- Implement CSS custom properties
- Mode persistence (localStorage)

### Phase 2: Field Mode
- `DecisionBanner` component (Green/Yellow/Red)
- `QuickEntryPad` (large numpad, running stats)
- Touch target optimization
- Enhanced auto-save reliability

### Phase 3: Analysis Mode
- Command palette (Cmd+K)
- Keyboard shortcuts system
- Templates save/load
- Eta-squared in StatsPanel
- Compare mode

### Phase 4: Presentation Mode
- Chart annotations with labels
- `InsightCard` components
- Plain-language insight generation
- Large typography mode

### Phase 5: Certification Mode
- Audit trail system (IndexedDB + UI)
- CSV export with traceability columns
- Certification period manager
- Compliance package generator (ZIP)

### Phase 6: Polish
- Code splitting optimization
- Performance testing
- Mobile/tablet testing
- Documentation

---

## Critical Files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Mode switcher in header |
| `src/context/DataContext.tsx` | Pattern for ModeContext |
| `src/context/ModeContext.tsx` | New - mode state |
| `src/components/Dashboard.tsx` | Core to wrap with modes |
| `src/lib/persistence.ts` | Extend for audit trail |
| `src/lib/export.ts` | New - CSV generation |
| `src/config/modeConfig.ts` | New - feature flags |

---

## Design Principles (All Modes)

1. **Offline by default** - Every feature works without network
2. **Data stays local** - Zero external data transmission
3. **Transparent math** - Show formulas, explain metrics
4. **CSV exportable** - All data can be opened in Excel
5. **Linked exploration** - Charts filter each other
6. **Fast to first insight** - Under 30 seconds from upload
7. **Export-ready outputs** - Professional charts for reports
8. **Audit-ready** - Traceability and methodology documented

---

*See also:*
- `UX_RESEARCH.md` - User personas, JTBD, use cases
- `ARCHITECTURE.md` - Technical architecture
- `Specs.md` - Detailed specifications
