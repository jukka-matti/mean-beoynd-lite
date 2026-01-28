# Navigation Patterns

Navigation patterns used across VariScout applications.

---

## Drill-Down Breadcrumb

The breadcrumb shows the analysis path and cumulative variation:

```
All Data → Shift (67%) → Night (89%) → Machine C (78%)
```

### Implementation

```tsx
<FilterBreadcrumb items={breadcrumbs} onNavigate={handleNavigate} showCumulative={true} />
```

### Visual Design

| Element         | Style                 |
| --------------- | --------------------- |
| Separator       | `→` or `›`            |
| Percentage      | Muted, in parentheses |
| Current level   | Bold, no link         |
| Previous levels | Clickable links       |

---

## Tab Navigation

For switching between analysis modes.

### PWA

```tsx
<Tabs value={activeTab} onChange={setActiveTab}>
  <Tab value="analysis">Analysis</Tab>
  <Tab value="performance">Performance</Tab>
  <Tab value="data">Data</Tab>
</Tabs>
```

### Excel Add-in

Uses Fluent UI Pivot:

```tsx
<Pivot selectedKey={activeTab} onLinkClick={handleTabChange}>
  <PivotItem headerText="Analysis" itemKey="analysis" />
  <PivotItem headerText="Performance" itemKey="performance" />
</Pivot>
```

---

## Sidebar Navigation

Desktop layouts use a sidebar for factor selection.

```
FACTORS
─────────────────
○ Shift
● Machine [selected]
○ Operator
○ Product

MEASURES
─────────────────
○ Fill Weight
● Moisture [selected]
○ Defects
```

---

## Mobile Menu

Mobile uses a hamburger menu with drawer:

```tsx
<MobileMenu>
  <MenuItem icon={<BarChart />}>Analysis</MenuItem>
  <MenuItem icon={<Settings />}>Settings</MenuItem>
  <MenuItem icon={<HelpCircle />}>Help</MenuItem>
</MobileMenu>
```

---

## Keyboard Navigation

| Key         | Action                        |
| ----------- | ----------------------------- |
| `←` / `→`   | Navigate between factors      |
| `↑` / `↓`   | Navigate within factor levels |
| `Enter`     | Select/drill into             |
| `Backspace` | Go back one level             |
| `Escape`    | Exit focus mode               |

---

## See Also

- [Drill-Down Feature](../../03-features/navigation/drill-down.md)
- [Breadcrumbs](../../03-features/navigation/breadcrumbs.md)
- [Accessibility](../foundations/accessibility.md)
