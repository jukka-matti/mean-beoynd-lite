# Excel Add-in Components

## Task Pane Components (Fluent UI)

### Buttons

```tsx
import { Button } from '@fluentui/react-components';

// Primary action
<Button appearance="primary">Save Settings</Button>

// Secondary action
<Button appearance="secondary">Cancel</Button>

// Subtle action
<Button appearance="subtle" icon={<SettingsIcon />}>Settings</Button>
```

### Form Inputs

```tsx
import { Input, Label, Field } from '@fluentui/react-components';

<Field label="Upper Spec Limit (USL)">
  <Input type="number" value={usl} onChange={(e, data) => setUsl(data.value)} />
</Field>;
```

### Dropdowns

```tsx
import { Dropdown, Option } from '@fluentui/react-components';

<Dropdown
  placeholder="Select column"
  value={selectedColumn}
  onOptionSelect={(e, data) => setSelectedColumn(data.optionValue)}
>
  {columns.map(col => (
    <Option key={col} value={col}>
      {col}
    </Option>
  ))}
</Dropdown>;
```

### Cards

```tsx
import { Card, CardHeader, CardPreview } from '@fluentui/react-components';

<Card>
  <CardHeader header={<Text weight="semibold">I-Chart</Text>} />
  <CardPreview>{/* Chart content */}</CardPreview>
</Card>;
```

---

## Content Add-in Components

### Chart Card

```tsx
// Custom dark-themed card for charts
const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div
    style={{
      backgroundColor: darkTheme.colorNeutralBackground2,
      borderRadius: '8px',
      padding: darkTheme.spacingMedium,
    }}
  >
    <h3 style={{ color: darkTheme.colorNeutralForeground1 }}>{title}</h3>
    {children}
  </div>
);
```

### FilterBar

```tsx
// Breadcrumb filter display
const FilterBar: React.FC<{ filters: Filter[]; onClear: () => void }> = ({ filters, onClear }) => (
  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
    {filters.map(f => (
      <span
        key={f.factor}
        style={{
          backgroundColor: darkTheme.colorNeutralBackground3,
          padding: '4px 8px',
          borderRadius: '4px',
        }}
      >
        {f.factor}: {f.value}
      </span>
    ))}
    <button onClick={onClear}>Clear</button>
  </div>
);
```

---

## Status Indicators

### Capability Grade Badge

```tsx
const CpkBadge: React.FC<{ cpk: number }> = ({ cpk }) => {
  const grade = cpk >= 1.33 ? 'good' : cpk >= 1.0 ? 'warning' : 'poor';
  const colors = {
    good: { bg: 'green', text: 'white' },
    warning: { bg: 'orange', text: 'black' },
    poor: { bg: 'red', text: 'white' },
  };

  return (
    <Badge
      style={{
        backgroundColor: colors[grade].bg,
        color: colors[grade].text,
      }}
    >
      Cpk: {cpk.toFixed(2)}
    </Badge>
  );
};
```

---

## See Also

- [OVERVIEW](./OVERVIEW.md) - Design system overview
- [Colors](./COLORS.md) - Color tokens
- [Patterns](./PATTERNS.md) - Layout patterns
