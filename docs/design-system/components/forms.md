# Form Elements

Form input patterns for PWA.

## Text Input

```jsx
<input
  type="text"
  placeholder="Enter value"
  className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm placeholder-slate-500 outline-none focus:border-blue-500 transition-colors"
/>
```

## Number Input

```jsx
<input
  type="number"
  step="0.01"
  className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm font-mono text-right outline-none focus:border-blue-500"
/>
```

## Select Dropdown

```jsx
<select className="bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 cursor-pointer">
  <option value="">Select...</option>
  <option value="a">Option A</option>
  <option value="b">Option B</option>
</select>
```

### Small Select

```jsx
<select className="bg-slate-900 border border-slate-700 text-xs text-white rounded px-2 py-1 outline-none focus:border-blue-500">
  ...
</select>
```

## Checkbox

```jsx
<label className="flex items-center gap-2 cursor-pointer">
  <input
    type="checkbox"
    checked={checked}
    onChange={e => setChecked(e.target.checked)}
    className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
  />
  <span className="text-sm text-slate-300">Show Cpk</span>
</label>
```

## Radio Group

```jsx
<div className="flex flex-col gap-2">
  {options.map(option => (
    <label key={option.value} className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        name="group"
        value={option.value}
        checked={selected === option.value}
        onChange={() => setSelected(option.value)}
        className="w-4 h-4 border-slate-600 bg-slate-900 text-blue-600"
      />
      <span className="text-sm text-slate-300">{option.label}</span>
    </label>
  ))}
</div>
```

## Toggle Switch (Custom)

```jsx
<button
  onClick={() => setEnabled(!enabled)}
  className={`relative w-10 h-6 rounded-full transition-colors ${
    enabled ? 'bg-blue-600' : 'bg-slate-600'
  }`}
>
  <span
    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
      enabled ? 'left-5' : 'left-1'
    }`}
  />
</button>
```

## Form Field with Label

```jsx
<div className="flex flex-col gap-1.5">
  <label className="text-xs text-slate-400 font-medium">Upper Spec Limit (USL)</label>
  <input
    type="number"
    className="px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white"
  />
</div>
```

## Inline Form

```jsx
<div className="flex items-center gap-2">
  <label className="text-sm text-slate-400 whitespace-nowrap">Factor:</label>
  <select className="flex-1 bg-slate-900 border border-slate-700 ...">...</select>
</div>
```

## Input with Button

```jsx
<div className="flex">
  <input className="flex-1 px-3 py-2 bg-slate-900 border border-slate-600 rounded-l-lg text-white" />
  <button className="px-4 py-2 bg-blue-600 text-white rounded-r-lg">Apply</button>
</div>
```

## File Input

```jsx
<label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-600 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-slate-800/50 transition-colors">
  <Upload className="text-slate-400" />
  <span className="text-sm text-slate-400">Drop file or click to browse</span>
  <input type="file" className="hidden" onChange={handleFile} />
</label>
```

## Validation States

### Error

```jsx
<input className="... border-red-500 focus:border-red-500" />
<span className="text-xs text-red-400 mt-1">Invalid value</span>
```

### Success

```jsx
<input className="... border-green-500" />
```

## Disabled State

```jsx
<input disabled className="... opacity-50 cursor-not-allowed bg-slate-800" />
```

## Excel Add-in Forms (Fluent UI)

```tsx
import { Field, Input, Dropdown } from '@fluentui/react-components';

<Field label="Value">
  <Input type="number" />
</Field>

<Field label="Select">
  <Dropdown options={options} />
</Field>
```
