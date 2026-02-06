# Feature Parity Matrix

Complete feature availability across VariScout platforms.

---

## Platform Overview

| Platform         | Primary Use                   | Status      | Distribution      |
| ---------------- | ----------------------------- | ----------- | ----------------- |
| **Azure App**    | Production (teams/enterprise) | **PRIMARY** | Azure Marketplace |
| **Excel Add-in** | Excel-native workflows        | Production  | AppSource (FREE)  |
| **PWA**          | Evaluation & demos            | Demo only   | Direct URL        |
| **Power BI**     | Dashboard integration         | Planned     | AppSource         |

> Per [ADR-007](../07-decisions/adr-007-azure-marketplace-distribution.md), Azure App is the primary commercial offering.

---

## Core Analysis Features

| Feature                  | Azure App | Excel Add-in | PWA (Demo) | Power BI |
| ------------------------ | :-------: | :----------: | :--------: | :------: |
| **I-Chart**              |     ✓     |      ✓       |     ✓      | Planned  |
| **Boxplot**              |     ✓     |      ✓       |     ✓      | Planned  |
| **Pareto**               |     ✓     |      ✓       |     ✓      | Planned  |
| **Capability Histogram** |     ✓     |      ✓       |     ✓      | Planned  |
| **Probability Plot**     |     ✓     |      ✓       |     ✓      |    -     |
| **Scatter/Regression**   |     ✓     |      ✓       |     ✓      |    -     |
| **Gage R&R**             |     ✓     |      ✓       |     ✓      |    -     |
| **Performance Mode**     |     ✓     |      ✓       |     ✓      |    -     |

---

## Statistical Calculations

All platforms share `@variscout/core` and produce **identical results**.

| Calculation          | Azure | Excel | PWA | Formula Reference   |
| -------------------- | :---: | :---: | :-: | ------------------- |
| Mean, Std Dev        |   ✓   |   ✓   |  ✓  | Standard            |
| UCL/LCL (3σ)         |   ✓   |   ✓   |  ✓  | x̄ ± 3σ              |
| Cp, Cpk              |   ✓   |   ✓   |  ✓  | (USL-LSL)/6σ        |
| η² (Eta-squared)     |   ✓   |   ✓   |  ✓  | SS_between/SS_total |
| F-statistic, p-value |   ✓   |   ✓   |  ✓  | ANOVA               |
| R², Adjusted R²      |   ✓   |   ✓   |  ✓  | Regression          |
| VIF                  |   ✓   |   ✓   |  ✓  | Multicollinearity   |
| %GRR                 |   ✓   |   ✓   |  ✓  | AIAG standard       |
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

| Feature                       | Azure App | Excel Add-in | PWA (Demo) | Notes                      |
| ----------------------------- | :-------: | :----------: | :--------: | -------------------------- |
| **CSV upload**                |     ✓     |      -       |     ✓      | Excel reads from worksheet |
| **Excel upload**              |     ✓     |    Native    |     ✓      | Excel is the data source   |
| **Paste data**                |     ✓     |      -       |     ✓      |                            |
| **Sample datasets**           |     ✓     |      -       |     ✓      | PWA pre-loaded with cases  |
| **Wide format (Performance)** |     ✓     |      ✓       |     ✓      |                            |
| **Column mapping**            |     ✓     |      -       |     ✓      | Excel auto-detects         |
| **Data validation**           |     ✓     |      ✓       |     ✓      |                            |

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

| Feature                     | Azure App | Excel Add-in | PWA (Demo) | Notes             |
| --------------------------- | :-------: | :----------: | :--------: | ----------------- |
| **Microsoft SSO**           |     ✓     |      ✓       |     -      | PWA has no auth   |
| **Azure AD / Entra ID**     |     ✓     |      ✓       |     -      |                   |
| **Data in customer tenant** |     ✓     |      ✓       |    N/A     | PWA is local only |
| **No data transmission**    |     ✓     |      ✓       |     ✓      | All client-side   |

---

## Theming & Customization

| Feature                  | Azure App | Excel Add-in | PWA (Demo) | Notes                  |
| ------------------------ | :-------: | :----------: | :--------: | ---------------------- |
| **Dark/Light theme**     |     ✓     |  Dark only   |     ✓      | Content add-in is dark |
| **System theme follow**  |     ✓     |      -       |     ✓      |                        |
| **Company accent color** |     ✓     |      -       |     ✓      | Licensed editions      |
| **Branding removal**     | Licensed  |   Licensed   |  Licensed  | Per edition            |

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

| Aspect           | Azure App                | Excel Add-in        | PWA (Demo)  |
| ---------------- | ------------------------ | ------------------- | ----------- |
| **Distribution** | Azure Marketplace        | AppSource           | Direct      |
| **Pricing**      | €99/€499/€1,790 per year | FREE                | N/A         |
| **Unlocking**    | Subscription tier        | Azure App in tenant | N/A         |
| **Trial**        | Free tier limited        | Free tier limited   | Full access |

---

## Platform-Specific Features

### Azure App Only

- OneDrive project sync
- Team collaboration (Team/Enterprise tiers)
- MSAL authentication flow
- ARM template deployment

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
| Multi-tenant admin     | Azure App       | Backlog |
| API export             | Azure App       | Backlog |

---

## See Also

- [Products Overview](index.md)
- [Azure App](azure/index.md)
- [Excel Add-in](excel/index.md)
- [PWA (Demo)](pwa/index.md)
- [ADR-007: Distribution Strategy](../07-decisions/adr-007-azure-marketplace-distribution.md)
