# Power BI Development

## Prerequisites

- Node.js 18+
- Power BI Desktop
- pbiviz CLI: `npm install -g powerbi-visuals-tools`

---

## Project Setup

```bash
# Create new visual
pbiviz new variscout-ichart

# Install dependencies
cd variscout-ichart
npm install @variscout/core

# Start development server
pbiviz start
```

---

## Development Workflow

1. **Start dev server**: `pbiviz start`
2. **Enable developer mode** in Power BI Desktop
3. Add "Developer Visual" to report
4. Make changes → visual auto-reloads

---

## Building

```bash
# Create .pbiviz package
pbiviz package

# Output: dist/variscout-ichart.pbiviz
```

---

## Testing

```bash
# Run unit tests
npm test

# Visual testing in Power BI
# 1. Load .pbiviz into Power BI
# 2. Test with sample data
# 3. Verify cross-filtering
```

---

## See Also

- [OVERVIEW](./OVERVIEW.md) - Power BI overview
- [Marketplace](./MARKETPLACE.md) - Publishing
