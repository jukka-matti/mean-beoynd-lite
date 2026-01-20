# OneDrive Sync

## Storage Architecture

Projects are stored in OneDrive/SharePoint via Microsoft Graph API.

```
Microsoft 365
─────────────────────────────────────────────────────────────────

┌─────────────────┐  ┌─────────────────┐
│  SharePoint     │  │  OneDrive       │
│                 │  │                 │
│  /VaRiScout/    │  │  /VaRiScout/    │
│  ├── Team/      │  │  └── Personal/  │
│  │   └── *.vrs  │  │      └── *.vrs  │
│  └── Templates/ │  │                 │
│      └── *.vrs  │  │                 │
└─────────────────┘  └─────────────────┘
```

---

## File Operations

### Save to OneDrive

```typescript
async function saveToOneDrive(project: Project, path: string): Promise<void> {
  const graphClient = getGraphClient();

  const content = JSON.stringify(project);

  await graphClient.api(`/me/drive/root:/${path}:/content`).put(content);
}
```

### Load from OneDrive

```typescript
async function loadFromOneDrive(path: string): Promise<Project> {
  const graphClient = getGraphClient();

  const content = await graphClient.api(`/me/drive/root:/${path}:/content`).get();

  return JSON.parse(content);
}
```

---

## Offline-First Sync

```
LOCAL (IndexedDB)                    REMOTE (OneDrive)
─────────────────                    ─────────────────
Edit project locally                 Sync when online
         │                                   │
         ▼                                   │
Store pending changes                        │
         │                                   │
         └─── Network available ────────────▶│
                                             │
                                             ▼
                                     Update OneDrive
```

---

## See Also

- [OVERVIEW](./OVERVIEW.md) - Azure overview
- [SharePoint](./SHAREPOINT.md) - Team sharing
