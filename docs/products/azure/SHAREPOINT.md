# SharePoint Integration

## Team Collaboration

SharePoint enables team-wide project sharing and template libraries.

---

## Folder Structure

```
SharePoint Site: VaRiScout
─────────────────────────────────────────────────────────────────

/VaRiScout/
├── Team/                    # Shared team projects
│   ├── Q1-2026-Analysis.vrs
│   └── Machine-A-Study.vrs
│
├── Templates/               # Shared templates
│   ├── Standard-Cp-Analysis.vrs
│   └── Monthly-Report.vrs
│
└── Archive/                 # Completed projects
    └── 2025/
```

---

## Sharing Permissions

| Role   | Team/ | Templates/ | Personal/ |
| ------ | ----- | ---------- | --------- |
| Owner  | Edit  | Edit       | Full      |
| Member | Edit  | Read       | N/A       |
| Guest  | Read  | Read       | N/A       |

---

## Template Library

```typescript
async function getTemplates(): Promise<Template[]> {
  const graphClient = getGraphClient();

  const items = await graphClient
    .api('/sites/{site-id}/drive/root:/VaRiScout/Templates:/children')
    .get();

  return items.value.map(item => ({
    id: item.id,
    name: item.name,
    modified: item.lastModifiedDateTime,
  }));
}
```

---

## See Also

- [OVERVIEW](./OVERVIEW.md) - Azure overview
- [OneDrive Sync](./ONEDRIVE-SYNC.md) - File storage
