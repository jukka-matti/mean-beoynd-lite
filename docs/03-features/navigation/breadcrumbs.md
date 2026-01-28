# Breadcrumb Navigation

The breadcrumb trail shows your drill-down path with cumulative variation percentages.

---

## Format

```
All Data → Shift (67%) → Night (89%) → Machine C (78%)
```

Each segment shows:

- **Factor/Level**: What you drilled into
- **Percentage**: Local variation explained at that level

---

## Cumulative Calculation

The displayed percentages are local, but cumulative impact is calculated:

| Breadcrumb  | Local % | Cumulative |
| ----------- | ------- | ---------- |
| All Data    | -       | 100%       |
| → Shift     | 67%     | 67%        |
| → Night     | 89%     | 59.6%      |
| → Machine C | 78%     | 46.5%      |

**Display:** "46.5% of total variation isolated"

---

## UI Implementation

```
┌─────────────────────────────────────────────────────────────────────────┐
│ 📍 ANALYSIS PATH                                                        │
│                                                                         │
│ All Data → Shift (67%) → Night (89%) → Machine C (78%)                 │
│                                                                         │
│ 📊 Cumulative Impact: 46.5% of total variation isolated                │
│ 💡 "Fix this combination to address nearly half your quality problems" │
│                                                                         │
│ [← Back to Night Shift]  [← Back to All Shifts]  [← Start Over]        │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Navigation

| Action               | Result                      |
| -------------------- | --------------------------- |
| Click previous level | Navigate back to that level |
| Click "All Data"     | Reset to unfiltered view    |
| Keyboard: Backspace  | Go back one level           |

---

## Component

```typescript
<DrillBreadcrumb
  items={breadcrumbs}
  onNavigate={handleNavigate}
  showCumulative={true}
/>
```

---

## See Also

- [Drill-Down](drill-down.md)
- [Four Pillars: Drill-Down](../../01-vision/four-pillars/drilldown.md)
