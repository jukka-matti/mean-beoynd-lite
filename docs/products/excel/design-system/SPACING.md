# Excel Add-in Spacing System

## Spacing Scale

Fluent UI uses an 8px base unit for spacing.

| Token                  | Size | Common Usage          |
| ---------------------- | ---- | --------------------- |
| `spacingHorizontalXXS` | 2px  | Icon-text gap         |
| `spacingHorizontalXS`  | 4px  | Tight grouping        |
| `spacingHorizontalS`   | 8px  | Related items         |
| `spacingHorizontalM`   | 12px | Standard gap          |
| `spacingHorizontalL`   | 16px | Section padding       |
| `spacingHorizontalXL`  | 20px | Large gaps            |
| `spacingHorizontalXXL` | 24px | Major section padding |

### Vertical Equivalents

| Token                | Size |
| -------------------- | ---- |
| `spacingVerticalXXS` | 2px  |
| `spacingVerticalXS`  | 4px  |
| `spacingVerticalS`   | 8px  |
| `spacingVerticalM`   | 12px |
| `spacingVerticalL`   | 16px |
| `spacingVerticalXL`  | 20px |
| `spacingVerticalXXL` | 24px |

---

## Task Pane Layout

### Standard Padding

```tsx
const useStyles = makeStyles({
  taskPane: {
    padding: tokens.spacingHorizontalL, // 16px
  },
  section: {
    marginBottom: tokens.spacingVerticalXL, // 20px
  },
  formGroup: {
    gap: tokens.spacingVerticalM, // 12px
  },
});
```

### Component Spacing

| Context           | Token                 | Size |
| ----------------- | --------------------- | ---- |
| Card padding      | `spacingHorizontalL`  | 16px |
| Form field gap    | `spacingVerticalM`    | 12px |
| Button group gap  | `spacingHorizontalS`  | 8px  |
| Icon-text gap     | `spacingHorizontalXS` | 4px  |
| Section separator | `spacingVerticalXL`   | 20px |

---

## Content Add-in Layout

### Chart Margins

```tsx
const chartMargins = {
  top: 20,
  right: 20,
  bottom: 40,
  left: 60,
};
```

### Panel Spacing

```tsx
const darkTheme = {
  spacingSmall: '8px',
  spacingMedium: '12px',
  spacingLarge: '16px',
};
```

---

## See Also

- [OVERVIEW](./OVERVIEW.md) - Design system overview
- [Components](./COMPONENTS.md) - Component patterns
