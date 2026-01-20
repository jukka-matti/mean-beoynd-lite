# Visual Implementation

## Visual Structure

Each Power BI visual follows this structure:

```
variscout-{visual}/
├── src/
│   ├── visual.ts           # Main visual class (IVisual)
│   ├── settings.ts         # Visual settings (VisualSettings)
│   ├── dataTransform.ts    # dataView → chart data
│   └── components/         # React components
│
├── capabilities.json       # Data roles, objects
├── pbiviz.json            # Visual metadata
├── package.json
└── tsconfig.json
```

---

## IVisual Interface

```typescript
import { Visual } from '@variscout/powerbi-core';

export class VaRiScoutIChart implements powerbi.extensibility.IVisual {
  private target: HTMLElement;
  private settings: VisualSettings;

  constructor(options: powerbi.extensibility.VisualConstructorOptions) {
    this.target = options.element;
  }

  public update(options: powerbi.extensibility.VisualUpdateOptions) {
    const dataView = options.dataViews[0];
    const data = transformData(dataView);
    const settings = VisualSettings.parse(dataView);

    render(
      <IChart data={data} settings={settings} />,
      this.target
    );
  }

  public destroy(): void {
    // Cleanup
  }
}
```

---

## Data Transformation

```typescript
function transformData(dataView: powerbi.DataView): ChartData {
  const categorical = dataView.categorical;
  const values = categorical.values[0].values as number[];
  const timestamps = categorical.categories[0].values;

  return {
    points: values.map((y, i) => ({
      x: i,
      y,
      timestamp: timestamps[i],
    })),
    mean: calculateMean(values),
    ucl: calculateUCL(values),
    lcl: calculateLCL(values),
  };
}
```

---

## Selection & Cross-Filter

```typescript
// Enable cross-filtering with other visuals
const selectionManager = host.createSelectionManager();

function handlePointClick(point: DataPoint) {
  const selectionId = host
    .createSelectionIdBuilder()
    .withCategory(categorical.categories[0], point.index)
    .createSelectionId();

  selectionManager.select(selectionId);
}
```

---

## See Also

- [OVERVIEW](./OVERVIEW.md) - Power BI overview
- [Capabilities](./CAPABILITIES.md) - Data roles
