# Excel Add-in Layout Patterns

## Task Pane Layout

### Standard Page Structure

```tsx
const TaskPanePage: React.FC = () => (
  <div className={styles.container}>
    <header className={styles.header}>
      <Text size={600} weight="semibold">
        Page Title
      </Text>
      <Button appearance="subtle" icon={<SettingsIcon />} />
    </header>

    <main className={styles.content}>
      <section className={styles.section}>{/* Section content */}</section>
    </main>

    <footer className={styles.footer}>
      <Button appearance="primary">Save</Button>
      <Button appearance="secondary">Cancel</Button>
    </footer>
  </div>
);
```

### Setup Wizard Pattern

Multi-step configuration flow:

```
┌─────────────────────────────────────┐
│  VaRiScout Setup                    │
├─────────────────────────────────────┤
│  ● Step 1   ○ Step 2   ○ Step 3    │
├─────────────────────────────────────┤
│                                     │
│  Select your data                   │
│                                     │
│  [Value Column ▼]                   │
│  [Factor Columns ▼]                 │
│                                     │
├─────────────────────────────────────┤
│  [Back]                    [Next →] │
└─────────────────────────────────────┘
```

---

## Content Add-in Layout

### Dashboard Grid

```
┌───────────────────────────────────────────────────────┐
│  FilterBar: All Data → Machine (67%)         [Clear] │
├───────────────────────────────────────────────────────┤
│                                                       │
│  ┌─────────────────┐  ┌─────────────────┐            │
│  │    I-Chart      │  │    Boxplot      │            │
│  │                 │  │                 │            │
│  │   [chart]       │  │   [chart]       │            │
│  └─────────────────┘  └─────────────────┘            │
│                                                       │
│  ┌─────────────────┐  ┌─────────────────┐            │
│  │    Pareto       │  │   Capability    │            │
│  │                 │  │                 │            │
│  │   [chart]       │  │   [chart]       │            │
│  └─────────────────┘  └─────────────────┘            │
│                                                       │
└───────────────────────────────────────────────────────┘
```

### Responsive Behavior

- **> 800px**: 2x2 grid
- **600-800px**: 2x2 grid, smaller charts
- **< 600px**: Single column stack

---

## Form Patterns

### Field Group

```tsx
<div className={styles.fieldGroup}>
  <Field label="Upper Spec Limit (USL)" hint="Maximum acceptable value">
    <Input type="number" />
  </Field>
  <Field label="Lower Spec Limit (LSL)" hint="Minimum acceptable value">
    <Input type="number" />
  </Field>
</div>
```

### Inline Form

```tsx
<div className={styles.inlineForm}>
  <Dropdown placeholder="Select column" />
  <Button icon={<AddIcon />}>Add Factor</Button>
</div>
```

---

## Status & Feedback

### Loading State

```tsx
<div className={styles.loadingOverlay}>
  <Spinner size="large" />
  <Text>Analyzing data...</Text>
</div>
```

### Success Message

```tsx
<MessageBar intent="success">Configuration saved successfully!</MessageBar>
```

### Error State

```tsx
<MessageBar intent="error">Unable to read data. Please select a valid range.</MessageBar>
```

---

## See Also

- [OVERVIEW](./OVERVIEW.md) - Design system overview
- [Components](./COMPONENTS.md) - Component patterns
- [Spacing](./SPACING.md) - Spacing tokens
