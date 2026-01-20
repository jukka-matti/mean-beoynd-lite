# Database Schema

## Dexie.js Setup

```javascript
import Dexie from 'dexie';

export const db = new Dexie('VaRiScoutDB');

db.version(1).stores({
  settings: 'key',
  projects: '++id, name, created, updated, [updated+id]',
  recentFiles: '++id, name, type, lastOpened',
});
```

---

## Data Models

### Settings

Key-value store for app settings:

```javascript
// License settings
{ key: 'license', value: 'VSL-XXXX-XXXX-XXXX-XXXX' }
{ key: 'licenseValidated', value: 1704288000000 }
{ key: 'licenseEmail', value: 'user@example.com' }
{ key: 'licenseExpires', value: '2027-01-03T12:00:00Z' }

// UI preferences
{ key: 'theme', value: 'dark' }
{ key: 'showWelcome', value: false }

// Upgrade prompt preferences (Free tier only)
{ key: 'hideUpgradePrompts', value: false }
{ key: 'hideCloseWarning', value: false }
```

### Projects

```typescript
interface Project {
  id?: number;
  name: string;
  created: Date;
  updated: Date;
  data: {
    rawData: any[][];
    columns: string[];
    specs: { usl?: number; lsl?: number; target?: number };
    settings: ProjectSettings;
  };
}
```

### Recent Files

```typescript
interface RecentFile {
  id?: number;
  name: string;
  type: 'csv' | 'xlsx' | 'project';
  lastOpened: Date;
  preview?: string;
}
```

---

## Schema Versioning

```javascript
// Add new tables/indexes in new versions
db.version(2).stores({
  // ... existing tables ...
  templates: '++id, name, type',
});
```

---

## See Also

- [OVERVIEW](./OVERVIEW.md) - Storage overview
- [Operations](./OPERATIONS.md) - CRUD operations
