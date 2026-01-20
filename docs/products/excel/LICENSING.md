# Excel Add-in Licensing

## Distribution: Microsoft AppSource

The Excel Add-in is distributed through Microsoft AppSource for corporate-friendly purchasing.

---

## Pricing Model

| Tier       | Price    | Features                  |
| ---------- | -------- | ------------------------- |
| Free       | €0       | Full analysis, no save    |
| Individual | €49/year | Save settings in workbook |

### Feature Comparison

```
FREE TIER
─────────────────────────────────────────────────────────────────
• All 4 charts (I-Chart, Boxplot, Pareto, Capability)
• Performance Mode (multi-measure analysis)
• ANOVA with F-stat, p-value, insight text
• Control limit calculations (UCL, LCL)
• Capability analysis (Cp, Cpk)
• Copy charts to clipboard
• Insert charts into Excel
• Write stats to cells

PAID TIER (€49/year)
─────────────────────────────────────────────────────────────────
Everything in Free, plus:
• Save settings in workbook (Custom Document Properties)
• Save spec limits
• Save column mappings
• Settings persist when sharing workbook
```

---

## Upgrade Triggers

```
FREE USER EXPERIENCE
─────────────────────────────────────────────────────────────────

1. Select data → Open VaRiScout → Full analysis works ✓
2. Set spec limits, configure charts → All works ✓
3. Close task pane or workbook
4. Reopen later → Settings GONE, must reconfigure

Upgrade prompts:
• Close task pane → "Save your settings? [Upgrade to save]"
• Click Save button → "Upgrade to save settings in workbook"
```

---

## AppSource Integration

### License Validation

```typescript
// Check AppSource license via Office.js
async function checkAppSourceLicense(): Promise<LicenseStatus> {
  return Office.run(async context => {
    // AppSource provides license info via context
    const license = Office.context.license;

    if (license.licenseType === 'trial') {
      return { type: 'trial', daysRemaining: license.trialDaysRemaining };
    }

    if (license.licenseType === 'paid') {
      return { type: 'paid', valid: true };
    }

    return { type: 'free', valid: true };
  });
}
```

### Why AppSource?

| Benefit              | Description                        |
| -------------------- | ---------------------------------- |
| Corporate purchasing | Invoicing, PO support, procurement |
| Microsoft billing    | Familiar for enterprise customers  |
| Auto-updates         | Updates deployed via AppSource     |
| Trust                | Microsoft-vetted, secure           |

---

## See Also

- [Overview](./OVERVIEW.md) - Product summary
- [Settings Storage](./SETTINGS-STORAGE.md) - How settings are saved
