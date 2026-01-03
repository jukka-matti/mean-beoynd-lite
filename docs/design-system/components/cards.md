# Cards & Panels

Container components for content grouping.

## Standard Card (PWA)

```jsx
<div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Card Title</h3>
  <div className="text-white">Content goes here</div>
</div>
```

## Chart Card

Cards containing charts with header controls:

```jsx
<div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl shadow-black/20 flex flex-col">
  {/* Header */}
  <div className="flex justify-between items-center px-6 py-4 border-b border-slate-700/50">
    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
      Boxplot Analysis
    </h3>
    <select className="bg-slate-900 border border-slate-700 text-xs text-white rounded px-2 py-1">
      {/* Options */}
    </select>
  </div>

  {/* Chart container */}
  <div className="flex-1 min-h-0 p-6">
    <Chart />
  </div>
</div>
```

## Stats Card

Compact card for displaying statistics:

```jsx
<div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
  <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Cpk</div>
  <div className="text-2xl font-bold text-white">1.45</div>
</div>
```

## Inline Stats Bar

Horizontal stats display:

```jsx
<div className="flex gap-4 text-sm bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
  <span className="text-slate-400">
    UCL: <span className="text-white font-mono">13.45</span>
  </span>
  <span className="text-slate-400">
    Mean: <span className="text-white font-mono">10.23</span>
  </span>
</div>
```

## Collapsible Section

```jsx
<div className="border border-slate-700 rounded-lg overflow-hidden">
  <button
    onClick={() => setExpanded(!expanded)}
    className="w-full flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-700 transition-colors"
  >
    <span className="font-medium text-white">Section Title</span>
    <ChevronDown className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
  </button>
  {expanded && <div className="p-4 bg-slate-800/50">Content</div>}
</div>
```

## Filter Chip

Small card-like element for active filters:

```jsx
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-700/50 border border-slate-600 rounded-full text-xs text-white">
  Machine: A
  <button className="text-slate-400 hover:text-white">
    <X size={12} />
  </button>
</span>
```

## Excel Add-in Card

```tsx
import { Card } from '@fluentui/react-components';

<Card
  style={{
    backgroundColor: darkTheme.colorNeutralBackground2,
    borderColor: darkTheme.colorNeutralStroke1,
    padding: darkTheme.spacingL,
  }}
>
  <CardHeader header={<Text weight="semibold">Title</Text>} />
  Content
</Card>;
```

## Card Shadows

| Level     | Class        | Usage          |
| --------- | ------------ | -------------- |
| Subtle    | `shadow-lg`  | Standard cards |
| Elevated  | `shadow-xl`  | Chart cards    |
| Prominent | `shadow-2xl` | Modals         |

Add `shadow-black/20` for darker shadows on dark backgrounds.
