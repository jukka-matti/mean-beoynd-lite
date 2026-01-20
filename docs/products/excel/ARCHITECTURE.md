# Excel Add-in Architecture

## Add-in Type: Hybrid (Task Pane + Content Add-in)

The Excel Add-in uses a hybrid architecture combining Task Pane for configuration and Content Add-in for embedded charts.

```
OFFICE ADD-IN ARCHITECTURE
─────────────────────────────────────────────────────────────────

┌──────────────────────────────────────────────────────────────┐
│                         Excel                                 │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                   Workbook                              │  │
│  │                                                         │  │
│  │  ┌─────────────────┐     ┌──────────────────────────┐  │  │
│  │  │   Data Table    │     │  Content Add-in (Charts) │  │  │
│  │  │   A1:D500       │────▶│  Visx charts, dark theme │  │  │
│  │  │   (source)      │     │  Embedded in worksheet   │  │  │
│  │  └─────────────────┘     └──────────────────────────┘  │  │
│  │            │                         ▲                  │  │
│  │            │ Selection               │ State            │  │
│  │            ▼                         │                  │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │              Task Pane                              │ │  │
│  │  │  • Column mapping                                   │ │  │
│  │  │  • Spec limits (USL, LSL, Target)                  │ │  │
│  │  │  • Settings & configuration                        │ │  │
│  │  │  • License activation                              │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │                                                         │  │
│  │  Custom Document Properties: { settings JSON }          │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

---

## Component Roles

### Task Pane (Light Theme)

- **Purpose**: Configuration, setup, settings
- **Styling**: Fluent UI v9 with webLightTheme
- **Functions**:
  - Column mapping (Value, Timestamp, Factors)
  - Spec limit inputs
  - License management
  - Settings persistence controls

### Content Add-in (Dark Theme)

- **Purpose**: Chart visualization
- **Styling**: Custom dark palette (matches PWA)
- **Functions**:
  - Four core charts (I-Chart, Boxplot, Pareto, Capability)
  - Performance Mode charts
  - Interactive filtering
  - FilterBar breadcrumb display

---

## State Management

### State Bridge Pattern

```typescript
// State sync via Custom Document Properties
interface PersistedState {
  columns: { value: string; timestamp: string; factors: string[] };
  specs: { usl: number; lsl: number; target: number };
  filters: { factor: string; value: string }[];
  settings: { showControlLimits: boolean };
}

// Task Pane writes state
await Office.context.document.settings.set('variscout_state', JSON.stringify(state));
await Office.context.document.settings.saveAsync();

// Content Add-in reads state (polling)
const state = JSON.parse(Office.context.document.settings.get('variscout_state'));
```

---

## Data Flow

```
USER INTERACTION
─────────────────────────────────────────────────────────────────

1. Select range in Excel → Task Pane detects selection
2. Configure columns → State saved to Document Properties
3. Content Add-in polls → Detects state change
4. Charts render → Using selected data via Excel API
5. Click chart element → Filter state updated
6. All charts re-render → Filtered view
```

---

## See Also

- [Overview](./OVERVIEW.md) - Product summary
- [Office.js API](./OFFICE-JS-API.md) - Excel API usage
- [Settings Storage](./SETTINGS-STORAGE.md) - State persistence details
