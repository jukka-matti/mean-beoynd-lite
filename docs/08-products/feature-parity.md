# Feature Parity Matrix

Complete feature availability across VariScout platforms.

---

## Platform Overview

| Platform         | Primary Use                | Status      | Distribution      |
| ---------------- | -------------------------- | ----------- | ----------------- |
| **Azure App**    | Production (full features) | **PRIMARY** | Azure Marketplace |
| **Excel Add-in** | Excel-native core SPC      | Production  | AppSource (FREE)  |
| **PWA**          | Evaluation & demos         | Demo only   | Direct URL        |
| **Power BI**     | Dashboard integration      | Planned     | AppSource         |

> Per [ADR-007](../07-decisions/adr-007-azure-marketplace-distribution.md), Azure App is the only paid product (€150/month as Managed Application). Excel Add-in is free forever with core SPC only.

---

## Core Analysis Features

| Feature                  | Azure App | Excel Add-in | PWA (Demo) | Power BI |
| ------------------------ | :-------: | :----------: | :--------: | :------: |
| **I-Chart**              |     ✓     |      ✓       |     ✓      | Planned  |
| **Boxplot**              |     ✓     |      ✓       |     ✓      | Planned  |
| **Pareto**               |     ✓     |      ✓       |     ✓      | Planned  |
| **Capability Histogram** |     ✓     |      ✓       |     ✓      | Planned  |
| **Probability Plot**     |     ✓     |      -       |     ✓      |    -     |
| **Scatter/Regression**   |     ✓     |      -       |     ✓      |    -     |
| **Gage R&R**             |     ✓     |      -       |     ✓      |    -     |
| **Performance Mode**     |     ✓     |      -       |     ✓      |    -     |

> Excel Add-in provides the four core SPC charts. Advanced analysis (Performance Mode, Gage R&R, Regression, Probability Plot) requires the Azure App.

---

## Statistical Calculations

All platforms share `@variscout/core` and produce **identical results** for the features they support.

| Calculation          | Azure | Excel | PWA | Formula Reference   |
| -------------------- | :---: | :---: | :-: | ------------------- |
| Mean, Std Dev        |   ✓   |   ✓   |  ✓  | Standard            |
| UCL/LCL (3σ)         |   ✓   |   ✓   |  ✓  | x̄ ± 3σ              |
| Cp, Cpk              |   ✓   |   ✓   |  ✓  | (USL-LSL)/6σ        |
| η² (Eta-squared)     |   ✓   |   -   |  ✓  | SS_between/SS_total |
| F-statistic, p-value |   ✓   |   -   |  ✓  | ANOVA               |
| R², Adjusted R²      |   ✓   |   -   |  ✓  | Regression          |
| VIF                  |   ✓   |   -   |  ✓  | Multicollinearity   |
| %GRR                 |   ✓   |   -   |  ✓  | AIAG standard       |
| Nelson Rule 2        |   ✓   |   ✓   |  ✓  | 9-point run         |

---

## Navigation & Interaction

| Feature                   | Azure App | Excel Add-in | PWA (Demo) | Notes                      |
| ------------------------- | :-------: | :----------: | :--------: | -------------------------- |
| **Drill-down**            |     ✓     | Via slicers  |     ✓      | Excel uses native slicers  |
| **Linked filtering**      |     ✓     | Via slicers  |     ✓      | Excel uses native slicers  |
| **Breadcrumb navigation** |     ✓     |      -       |     ✓      | Not applicable in Excel    |
| **Multi-select filters**  |     ✓     |      ✓       |     ✓      |                            |
| **Variation funnel**      |     ✓     |      -       |     ✓      |                            |
| **Keyboard navigation**   |     ✓     |   Partial    |     ✓      | Excel has its own patterns |

---

## Data Handling

| Feature             | Azure App | Excel Add-in | PWA (Demo) | Notes                      |
| ------------------- | :-------: | :----------: | :--------: | -------------------------- |
| **CSV upload**      |     ✓     |      -       |     ✓      | Excel reads from worksheet |
| **Excel upload**    |     ✓     |    Native    |     ✓      | Excel is the data source   |
| **Paste data**      |     ✓     |      -       |     ✓      |                            |
| **Sample datasets** |     ✓     |      -       |     ✓      | PWA pre-loaded with cases  |
| **Column mapping**  |     ✓     |      -       |     ✓      | Excel auto-detects         |
| **Data validation** |     ✓     |      ✓       |     ✓      |                            |

---

## Persistence & Storage

| Feature               | Azure App | Excel Add-in | PWA (Demo) | Notes                    |
| --------------------- | :-------: | :----------: | :--------: | ------------------------ |
| **Local storage**     | IndexedDB |  Doc Props   | IndexedDB  |                          |
| **Cloud sync**        | OneDrive  |   OneDrive   |     -      |                          |
| **Offline support**   |  Cached   |      ✓       |     ✓      | Azure caches for offline |
| **Project save/load** |     ✓     | In workbook  |     ✓      |                          |
| **Export CSV**        |     ✓     |      -       |     ✓      | Excel is already Excel   |
| **Export JSON**       |     ✓     |      -       |     ✓      |                          |
| **Screenshot export** |     ✓     |      ✓       |     ✓      |                          |

---

## Authentication & Security

| Feature                     | Azure App | Excel Add-in | PWA (Demo) | Notes                 |
| --------------------------- | :-------: | :----------: | :--------: | --------------------- |
| **Microsoft SSO**           |     ✓     |      -       |     -      | Excel: no auth needed |
| **Azure AD / Entra ID**     |     ✓     |      -       |     -      |                       |
| **Data in customer tenant** |     ✓     |      ✓       |    N/A     | PWA is local only     |
| **No data transmission**    |     ✓     |      ✓       |     ✓      | All client-side       |

> Excel Add-in no longer requires SSO or Graph API permissions. It operates without authentication.

---

## Theming & Customization

| Feature                  | Azure App | Excel Add-in | PWA (Demo) | Notes                  |
| ------------------------ | :-------: | :----------: | :--------: | ---------------------- |
| **Dark/Light theme**     |     ✓     |  Dark only   |     ✓      | Content add-in is dark |
| **System theme follow**  |     ✓     |      -       |     ✓      |                        |
| **Company accent color** |     ✓     |      -       |     ✓      | Azure App only         |
| **Branding removal**     |     ✓     |      -       |     -      | Azure App only         |

---

## Learning & Help

| Feature                  | Azure App | Excel Add-in | PWA (Demo) | Notes           |
| ------------------------ | :-------: | :----------: | :--------: | --------------- |
| **Help tooltips**        |     ✓     |      ✓       |     ✓      |                 |
| **Glossary integration** |     ✓     |      ✓       |     ✓      |                 |
| **"Learn more" links**   |     ✓     |      ✓       |     ✓      | Link to website |
| **Sample case studies**  |     ✓     |      -       |     ✓      | PWA pre-loaded  |

---

## Licensing & Pricing

| Aspect           | Azure App         | Excel Add-in   | PWA (Demo) |
| ---------------- | ----------------- | -------------- | ---------- |
| **Distribution** | Azure Marketplace | AppSource      | Direct     |
| **Pricing**      | €150/month        | FREE (forever) | N/A        |
| **Features**     | All (full)        | Core SPC only  | All (demo) |
| **Auth**         | MSAL / Entra ID   | None required  | None       |

---

## Platform-Specific Features

### Azure App Only

- All analysis types (Performance Mode, Gage R&R, Regression, Probability Plot)
- OneDrive project sync
- Team collaboration
- MSAL authentication flow
- Company accent color / branding removal
- ARM template deployment (Managed Application)

### Excel Add-in Only

- Native Excel table integration
- Native Excel slicer integration
- Worksheet-embedded charts
- Task pane setup wizard

### PWA Only

- PWA installation (Add to Home Screen)
- Service Worker offline caching
- Pre-loaded case study datasets

---

## Planned Features (Roadmap)

| Feature                | Target Platform | Status  |
| ---------------------- | --------------- | ------- |
| Power BI visuals       | Power BI        | Planned |
| Real-time data binding | Excel           | Backlog |

---

## See Also

- [Products Overview](index.md)
- [Azure App](azure/index.md)
- [Excel Add-in](excel/index.md)
- [PWA (Demo)](pwa/index.md)
- [ADR-007: Distribution Strategy](../07-decisions/adr-007-azure-marketplace-distribution.md)
