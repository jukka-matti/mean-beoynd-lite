# Excel Add-in Typography

## Font Family

The add-in uses Fluent UI's font stack, which defaults to Segoe UI on Windows for native Office feel.

```tsx
fontFamily: tokens.fontFamilyBase,
// Resolves to: 'Segoe UI', -apple-system, BlinkMacSystemFont, ...
```

---

## Font Sizes

### Task Pane (Light Theme)

| Token             | Size | Usage                      |
| ----------------- | ---- | -------------------------- |
| `fontSizeBase100` | 10px | Fine print, disclaimers    |
| `fontSizeBase200` | 12px | Captions, secondary labels |
| `fontSizeBase300` | 14px | Body text (default)        |
| `fontSizeBase400` | 16px | Emphasized body            |
| `fontSizeBase500` | 20px | Section headers            |
| `fontSizeBase600` | 24px | Page titles                |

### Content Add-in (Dark Theme)

```tsx
const darkTheme = {
  fontSizeSmall: '11px', // Axis labels, stat values
  fontSizeBase: '13px', // Tooltip text
  fontSizeMedium: '14px', // Chart titles
  fontSizeLarge: '16px', // Panel headers
};
```

---

## Font Weights

| Token                | Weight | Usage               |
| -------------------- | ------ | ------------------- |
| `fontWeightRegular`  | 400    | Body text           |
| `fontWeightSemibold` | 600    | Labels, button text |
| `fontWeightBold`     | 700    | Headers, emphasis   |

---

## Line Height

| Token               | Value | Usage               |
| ------------------- | ----- | ------------------- |
| `lineHeightBase100` | 14px  | Compact lists       |
| `lineHeightBase200` | 16px  | Small text          |
| `lineHeightBase300` | 20px  | Body text (default) |
| `lineHeightBase400` | 22px  | Larger body         |

---

## Usage Examples

### Task Pane

```tsx
const useStyles = makeStyles({
  pageTitle: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightBase400,
  },
  bodyText: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightRegular,
    lineHeight: tokens.lineHeightBase300,
  },
});
```

### Content Add-in

```tsx
const chartTitleStyle = {
  fontSize: darkTheme.fontSizeMedium,
  fontWeight: 600,
  color: darkTheme.colorNeutralForeground1,
};
```

---

## See Also

- [OVERVIEW](./OVERVIEW.md) - Design system overview
- [Colors](./COLORS.md) - Color tokens
