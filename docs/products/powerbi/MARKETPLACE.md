# Power BI Marketplace

## AppSource Submission

### Requirements

| Requirement       | Details                           |
| ----------------- | --------------------------------- |
| Publisher account | Microsoft Partner Center          |
| Certification     | Pass Power BI certification tests |
| Privacy policy    | Required URL                      |
| Support URL       | Required URL                      |
| Screenshots       | 3-10 images showing visual        |
| Sample PBIX       | Demonstrate visual capabilities   |

---

## Certification Checklist

- [ ] No external service calls (data stays in Power BI)
- [ ] Follows visual guidelines
- [ ] Accessible (keyboard navigation)
- [ ] Responsive to container size
- [ ] Handles edge cases (empty data, single point)
- [ ] Performance tested with 10k+ rows

---

## Submission Process

1. **Package visual**: `pbiviz package`
2. **Create listing** in Partner Center
3. **Upload** .pbiviz file
4. **Submit** for certification
5. **Address feedback** if needed
6. **Publish** when approved

---

## Licensing Integration

```
POWER BI LICENSING
─────────────────────────────────────────────────────────────────

AppSource handles:
• Payment processing
• License assignment
• Per-user licensing

Visual checks license via:
• Power BI licensing API
• Host.licenseManager
```

---

## See Also

- [OVERVIEW](./OVERVIEW.md) - Power BI overview
- [Development](./DEVELOPMENT.md) - Development setup
