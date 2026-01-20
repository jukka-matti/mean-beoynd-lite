# Settings Storage (State Bridge)

## Overview

Settings are persisted using **Custom Document Properties** - a feature of Office documents that allows add-ins to store custom data within the workbook.

---

## Storage Mechanism

### Custom Document Properties

```typescript
// apps/excel-addin/src/lib/stateBridge.ts

interface VaRiScoutState {
  version: 1;
  columns: {
    value: string;
    timestamp: string;
    factors: string[];
  };
  specs: {
    usl: number | null;
    lsl: number | null;
    target: number | null;
  };
  filters: Array<{ factor: string; value: string }>;
  settings: {
    showControlLimits: boolean;
    showSpecLimits: boolean;
    decimalPlaces: number;
  };
}
```

### Save Operation

```typescript
export async function saveState(state: VaRiScoutState): Promise<void> {
  // Check license first
  const license = await checkLicense();
  if (!license.canSave) {
    throw new UpgradeRequiredError('Upgrade to save settings');
  }

  return Excel.run(async context => {
    const props = context.workbook.properties.custom;

    // Remove existing if present
    const existing = props.getItemOrNullObject('VaRiScout_State');
    await context.sync();

    if (!existing.isNullObject) {
      existing.delete();
      await context.sync();
    }

    // Add new state
    props.add('VaRiScout_State', JSON.stringify(state));
    await context.sync();
  });
}
```

### Load Operation

```typescript
export async function loadState(): Promise<VaRiScoutState | null> {
  return Excel.run(async context => {
    const props = context.workbook.properties.custom;
    const stateProp = props.getItemOrNullObject('VaRiScout_State');
    stateProp.load('value');
    await context.sync();

    if (stateProp.isNullObject) return null;

    try {
      return JSON.parse(stateProp.value);
    } catch {
      return null;
    }
  });
}
```

---

## State Synchronization

### Task Pane ↔ Content Add-in

Since Task Pane and Content Add-in run in separate contexts, they communicate via document settings:

```typescript
// Task Pane writes
await Office.context.document.settings.set('variscout_live_state', state);
await Office.context.document.settings.saveAsync();

// Content Add-in polls (no events available)
setInterval(async () => {
  const state = Office.context.document.settings.get('variscout_live_state');
  if (state !== lastState) {
    updateCharts(state);
    lastState = state;
  }
}, 500);
```

---

## Free vs Paid Behavior

| Action             | Free Tier              | Paid Tier               |
| ------------------ | ---------------------- | ----------------------- |
| Configure settings | Works during session   | Works                   |
| Close task pane    | Settings lost          | Settings preserved      |
| Close workbook     | Settings lost          | Settings in workbook    |
| Share workbook     | Recipient starts fresh | Recipient has settings  |
| Save button        | Shows upgrade prompt   | Saves to document props |

---

## See Also

- [Architecture](./ARCHITECTURE.md) - Overall architecture
- [Licensing](./LICENSING.md) - Free vs paid features
