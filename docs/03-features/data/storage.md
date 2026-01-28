# Data Storage

Local data persistence in VariScout.

---

## Storage Location

| Platform | Storage                      |
| -------- | ---------------------------- |
| PWA      | IndexedDB (browser)          |
| Excel    | Workbook (Custom Properties) |
| Azure    | IndexedDB + OneDrive sync    |

---

## What's Stored

| Data                | Storage               | Size     |
| ------------------- | --------------------- | -------- |
| Uploaded datasets   | IndexedDB             | Variable |
| Computed statistics | IndexedDB (cached)    | Small    |
| Settings            | IndexedDB             | Small    |
| License key         | IndexedDB (encrypted) | Tiny     |
| Theme preference    | localStorage          | Tiny     |

---

## Data Lifecycle

```
UPLOAD
  │
  ▼
PARSE & VALIDATE
  │
  ▼
STORE IN INDEXEDDB
  │
  ▼
ANALYZE (statistics computed, cached)
  │
  ▼
USER DELETES or BROWSER CLEARS
```

---

## Privacy

- **All data stays local** - Never sent to VariScout servers
- **No telemetry** - No usage tracking
- **GDPR simple** - We don't have your data
- **Clear = Gone** - Clearing browser data deletes everything

---

## Export Options

| Format | Contains                       |
| ------ | ------------------------------ |
| .vrs   | Full project (data + settings) |
| .csv   | Raw data only                  |
| .json  | Data + computed stats          |
| .png   | Chart screenshots              |

---

## See Also

- [PWA Storage](../../08-products/pwa/storage.md)
- [Offline-First Architecture](../../05-technical/architecture/offline-first.md)
