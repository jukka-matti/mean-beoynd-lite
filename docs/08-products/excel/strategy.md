# Excel Add-in Strategy

## Executive Summary

The Excel Add-in provides **core SPC analysis** (I-Chart, Boxplot, Pareto, Capability) as a **free forever** product on AppSource. It serves as a marketing funnel to the Azure App, which provides full features at €150/month. Performance Mode and advanced analysis are Azure App exclusive.

---

## Distribution Model

### AppSource (FREE FOREVER)

The Excel Add-in is distributed **FREE** via Microsoft AppSource. No license detection, no Graph API, no tier unlocking.

| Aspect       | Value                                          |
| ------------ | ---------------------------------------------- |
| **Price**    | Free (forever)                                 |
| **Features** | Core SPC: I-Chart, Boxplot, Pareto, Capability |
| **Auth**     | None required (no Graph API, no admin consent) |
| **Upgrade**  | Azure App for Performance Mode, Gage R&R, etc. |

### Strategic Rationale

1. **Lead generation**: Free Add-in brings users into ecosystem
2. **Upsell path**: Power users upgrade to Azure App (€150/month)
3. **Zero friction**: No permission popups, no admin consent
4. **IT-friendly**: No Graph API permissions to approve
5. **Excel-native discovery**: AppSource is where Excel users find add-ins

### Previous Model (Superseded)

The original plan used Graph API license detection to auto-unlock full features when the tenant had Azure App deployed. This was abandoned because `Application.Read.All` requires admin consent (blocking adoption) and the approach was over-engineered. See [License Model](license-detection.md) for details.

---

## Current State (Feb 2026)

### Feature Scope

| Category              | Feature              | Excel Add-in  | Azure App    |
| --------------------- | -------------------- | ------------- | ------------ |
| **Core SPC**          | I-Chart              | ✓             | ✓            |
|                       | Boxplot              | ✓             | ✓            |
|                       | Pareto               | ✓             | ✓            |
|                       | Capability Histogram | ✓             | ✓            |
| **Advanced Analysis** | Performance Mode     | -             | ✓            |
|                       | Gage R&R             | -             | ✓            |
|                       | Regression           | -             | ✓            |
|                       | Probability Plot     | -             | ✓            |
| **Filtering**         | Native controls      | Excel slicers | Filter chips |
|                       | Multi-select         | ✓             | ✓            |
|                       | Filter persistence   | ✓             | ✓            |
| **State Management**  | Persistence          | Custom Props  | localStorage |
|                       | Configuration save   | ✓             | ✓            |
|                       | Settings UI          | Task Pane     | ✓            |
| **Theming**           | Dark theme           | ✓             | ✓            |
|                       | Light theme          | -             | ✓            |
|                       | System theme         | -             | ✓            |

---

## Architectural Philosophy

### 1. Respect Platform Conventions

**Excel-Native Patterns:**

- Use Excel slicers instead of custom filter chips
- Use Excel Tables instead of in-memory data structures
- Use Custom Document Properties instead of localStorage
- Use Task Pane for configuration, Content Add-in for visualization

**Rationale:**

- Excel users expect Excel behaviors
- Native controls are more performant
- Better integration with Excel workflows

### 2. Core SPC Focus

**Priority:** Core statistical process control charts only

**Included:**

- ✓ I-Chart with Nelson Rules
- ✓ Boxplot comparisons
- ✓ Pareto charts
- ✓ Capability Histogram (Cp/Cpk)
- ✓ State persistence

**Excluded (Azure App exclusive):**

- Performance Mode (multi-channel Cpk analysis)
- Gage R&R (measurement system analysis)
- Regression / Probability plots
- Variation funnel
- OneDrive sync / team collaboration

### 3. Sample Datasets via Website

**Strategy:** Don't build in-app import mechanism

**Implementation:**

- Website provides downloadable .xlsx files
- Each case study (coffee, sachets, oven-zones, bottleneck, journey) as pre-configured template
- Users download and open in Excel
- Add-in auto-detects configuration from table structure

**Benefits:**

- Zero Excel Add-in development effort
- Better user experience (no complex import UI)
- SEO benefit from website traffic
- Easy to update samples without app release

---

## Panel Sizing & Responsive Design

### User Question: "Can panel dimensions be adjusted?"

**Answer:** Panels are NOT user-draggable, but they ARE responsive.

### How Excel Add-ins Handle Sizing

#### 1. Content Add-ins (Embedded Charts)

**Fixed dimensions:** Set in `manifest.xml`

```xml
<DefaultSize Width="800" Height="600" />
```

**Responsive behavior:**

- ResizeObserver monitors container size changes
- Charts adapt fonts, margins, tick counts dynamically
- User CAN resize the Excel window
- Charts respond to window resize automatically

#### 2. Task Panes (Setup Wizard)

**Variable width:**

- Fixed ~300px default width
- User CAN resize via drag handle
- Fluent UI components adapt automatically

### What's NOT Possible

- Split pane / draggable divider between Task Pane and Content Add-in
- Programmatic resize of Content Add-in dimensions
- User-controlled panel dimensions (drag to resize charts)

### What IS Possible

- Task Pane users can drag to resize width
- Content Add-ins adapt to window size changes
- Charts use responsive utilities from `@variscout/charts`

---

## Cpk Target: Simplified Approach

### Overview

All apps (PWA, Azure, Excel) use a **single Cpk requirement value** instead of multiple threshold zones. This matches how real manufacturing companies work: one minimum acceptable Cpk value.

**Note:** In the Excel Add-in, Cpk target is relevant only for the core Capability Histogram view, not for Performance Mode (which is Azure App exclusive).

---

## Future Roadmap

### Phase 1: Quality of Life

| Feature                         | Effort | Value  | Priority |
| ------------------------------- | ------ | ------ | -------- |
| Data Quality Banner (Task Pane) | 3-4h   | Medium | P2       |
| Light Theme support             | 4-5h   | Low    | P3       |

### Phase 2: Won't Implement in Excel

| Feature                | Reason                                  |
| ---------------------- | --------------------------------------- |
| Performance Mode       | Azure App exclusive (business decision) |
| Gage R&R               | Azure App exclusive                     |
| Regression             | Azure App exclusive                     |
| License detection      | No longer needed (free forever)         |
| Graph API integration  | No longer needed                        |
| Sample datasets import | Use website downloads instead           |
| Time extraction        | Excel handles dates natively            |
| IndexedDB              | Excel has built-in persistence          |
| PWA-specific features  | Offline mode, service workers           |
| User-draggable panels  | Office.js API limitation                |

---

## Excel-Specific Technical Details

### 1. State Persistence (Custom Document Properties)

**Storage:**

```typescript
// Save to workbook
properties.add('VariScoutState', JSON.stringify(state));

// Read from workbook
const item = properties.items.find(i => i.key === 'VariScoutState');
const state = JSON.parse(item.value);
```

**Benefits:**

- Survives workbook close/reopen
- Shared across Task Pane and Content Add-in
- No external dependencies
- Works offline

### 2. Filtering (Excel Slicers)

```typescript
// Create native Excel slicers
await createSlicerRow(sheetName, tableName, ['Operator', 'Shift']);

// Poll for slicer changes
setInterval(() => {
  const data = await getFilteredTableData(tableName);
  updateCharts(data);
}, 1000);
```

### 3. Chart Rendering (Base Variants)

**Excel Uses Base Variants (explicit sizing):**

```typescript
import { IChartBase } from '@variscout/charts';

<IChartBase
  data={filteredData}
  parentWidth={chartWidth}
  parentHeight={chartHeight}
  showBranding={true} // Free tier always shows branding
/>
```

---

## Deployment & Distribution

### AppSource Publication

**Status:** Planned for Q2 2026

**Distribution:**

- **Primary**: Microsoft AppSource (FREE listing)
- **Secondary**: Sideload for enterprise testing

### Development

**Dev Server:**

```bash
pnpm dev:excel  # localhost:3000
```

**Production Build:**

```bash
pnpm build --filter @variscout/excel-addin
```

### Publishing Checklist

- [ ] Production hosting setup (Azure Static Web Apps)
- [ ] Manifest URLs updated to production
- [ ] AppSource submission materials (screenshots, descriptions)
- [ ] Privacy policy and terms of service
- [ ] Security review (OWASP, dependency audit)
- [ ] Performance testing (large datasets)
- [ ] Accessibility audit (WCAG AA)
- [ ] Hardcode featureLimits.ts to free tier
- [ ] Remove license detection code
- [ ] Remove Performance Mode from UI

---

## Conclusion

The Excel Add-in strategy focuses on **core SPC analysis for free**, serving as a marketing funnel to the Azure App. By providing genuine value (I-Chart, Boxplot, Pareto, Capability) without friction (no auth, no admin consent, no license detection), we maximize adoption and create a natural upgrade path to the Azure App for users who need Performance Mode and team collaboration.

**Key Decisions:**

- ✓ Free forever on AppSource (no license detection)
- ✓ Core SPC only (Performance Mode is Azure App exclusive)
- ✓ Excel-native UX patterns (slicers, Custom Document Properties)
- ✓ Sample datasets via website downloads
- ✓ Task Pane for config, Content for viz

---

## See Also

- [AppSource Guide](appsource.md)
- [License Model](license-detection.md)
- [Azure App (Primary Product)](../azure/index.md)
- [ADR-007: Azure Marketplace Distribution](../../07-decisions/adr-007-azure-marketplace-distribution.md)
