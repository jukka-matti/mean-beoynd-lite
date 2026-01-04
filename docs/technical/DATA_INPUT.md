# Data Input System

Technical documentation for data parsing, validation, and auto-mapping in VariScout Lite.

## File Locations

| File                                            | Purpose                                             |
| ----------------------------------------------- | --------------------------------------------------- |
| `packages/core/src/parser.ts`                   | **Shared** parsing, validation, and detection logic |
| `apps/pwa/src/logic/parser.ts`                  | Re-exports from @variscout/core (backwards compat)  |
| `apps/pwa/src/hooks/useDataIngestion.ts`        | File upload handlers                                |
| `apps/pwa/src/components/ColumnMapping.tsx`     | Column selection UI                                 |
| `apps/pwa/src/components/DataQualityBanner.tsx` | Validation summary component                        |
| `apps/pwa/src/components/DataTableModal.tsx`    | Data view with excluded row support                 |
| `apps/pwa/src/context/DataContext.tsx`          | State management for data and validation            |

**Cross-platform availability**: All parser functions are in `@variscout/core` and can be used by:

- PWA (apps/pwa)
- Azure/Teams app (apps/azure)
- Excel Add-in (apps/excel-addin) - if needed for file import features

---

## Smart Auto-Mapping

### Keyword Detection

Column type detection uses keyword matching for intelligent suggestions. When a column name contains these keywords, it's prioritized for that role.

**Outcome Keywords** (numeric columns):

```
time, duration, cycle, lead, ct
weight, length, width, height, thickness
temperature, temp, pressure
value, measurement, result, y, response
yield, output, reading
```

**Factor Keywords** (categorical columns):

```
shift, operator, machine, line, cell
product, batch, supplier, day, week
station, tool, lot, group, team
```

**Time Keywords** (date/time columns):

```
date, time, timestamp, datetime, created, recorded
```

### Detection Algorithm

The `detectColumns()` function in `parser.ts` follows this logic:

1. **Analyze each column**:
   - Sample multiple rows (not just first) to determine type
   - Check if >90% of values are numeric → `numeric` type
   - Check for date patterns → `date` type
   - Otherwise → `categorical` type

2. **Select Outcome (Y)**:
   - First priority: Numeric column with keyword match
   - Fallback: First numeric column with variation

3. **Select Factors (X)**:
   - Priority: Categorical columns with keyword matches
   - Fallback: First 3 categorical columns
   - Maximum: 3 factors

4. **Select Time Column**:
   - Priority: Column matching time keywords
   - Used for I-Chart ordering when available

### Return Type

```typescript
interface DetectedColumns {
  outcome: string | null;
  factors: string[];
  timeColumn: string | null;
}
```

---

## Data Validation

### Validation Rules

Rows are excluded from analysis when the outcome column has:

| Issue       | Description                      | Example              |
| ----------- | -------------------------------- | -------------------- |
| Missing     | null, undefined, or empty string | `""`, `null`         |
| Non-numeric | Cannot be parsed as a number     | `"N/A"`, `"pending"` |

Validation is **informational only** - users can inspect excluded rows but analysis proceeds with valid data.

### DataQualityReport Interface

```typescript
interface DataQualityReport {
  totalRows: number;
  validRows: number;
  excludedRows: ExcludedRow[];
  columnIssues: ColumnIssue[];
}

interface ExcludedRow {
  index: number; // Original row index (0-based)
  reasons: ExclusionReason[];
}

interface ExclusionReason {
  type: 'missing' | 'non_numeric' | 'empty';
  column: string;
  value?: string; // The problematic value
}

interface ColumnIssue {
  column: string;
  type: 'missing' | 'non_numeric' | 'no_variation' | 'all_empty';
  count: number;
  severity: 'warning' | 'info';
}
```

### Validation Flow

```
File Upload
    │
    ▼
parseCSV() / parseExcel()
    │
    ▼
detectColumns() → suggest outcome/factors
    │
    ▼
validateData(data, outcome) → DataQualityReport
    │
    ▼
Store in DataContext.dataQualityReport
    │
    ▼
Show DataQualityBanner in ColumnMapping
    │
    ├─► "View Excluded Rows" → DataTableModal (filtered)
    │
    └─► "Start Analysis" → Dashboard with valid rows
```

### User Interface

**DataQualityBanner** displays:

- Total rows and valid rows count
- Excluded row count with breakdown by issue type
- "View Excluded Rows" button opens DataTableModal

**DataTableModal** excluded row features:

- "Show Excluded Only" toggle button
- Amber background highlighting for excluded rows
- AlertTriangle icon with tooltip showing exclusion reasons

---

## Pareto Data Sources

### Derived Mode (Default)

- Counts computed from selected factors via `d3.rollup()`
- Linked to main data filters (updates when filters change)
- Uses `factors[1] || factors[0]` by default

```typescript
// In ParetoChart.tsx
const counts = d3.rollup(
  filteredData,
  v => v.length,
  d => d[factor]
);
```

### Separate Mode

For pre-aggregated count data (e.g., from ERP/MES systems):

- Upload separate CSV/Excel file in ColumnMapping
- Auto-detects category (first string) and count (first numeric) columns
- **NOT linked to main data filters**
- Shows info banner: "Using separate Pareto file (not linked to filters)"

### ParetoRow Interface

```typescript
interface ParetoRow {
  category: string;
  count: number;
}
```

### State in DataContext

```typescript
// Mode selection
paretoMode: 'derived' | 'separate';

// Separate Pareto data
separateParetoData: ParetoRow[] | null;
separateParetoFilename: string | null;

// Setters
setParetoMode: (mode: 'derived' | 'separate') => void;
setSeparateParetoData: (data: ParetoRow[] | null) => void;
setSeparateParetoFilename: (name: string | null) => void;
```

### Separate Pareto File Format

CSV or Excel with at least two columns:

```csv
Category,Count
Machine A,45
Machine B,32
Machine C,18
```

The parser auto-detects:

- **Category column**: First string/text column
- **Count column**: First numeric column

---

## Performance Limits

| Threshold           | Behavior                              |
| ------------------- | ------------------------------------- |
| < 5,000 rows        | Loads immediately                     |
| 5,000 - 50,000 rows | Warning prompt (may slow performance) |
| > 50,000 rows       | Rejected with error message           |

Constants in `useDataIngestion.ts`:

```typescript
const ROW_WARNING_THRESHOLD = 5000;
const ROW_HARD_LIMIT = 50000;
```

---

## Supported File Formats

### CSV

- Parsed with PapaParse
- UTF-8 encoding recommended
- First row = headers
- Comma delimiter

### Excel (.xlsx, .xls)

- Parsed with SheetJS (xlsx library)
- First sheet only
- First row = headers
- Numeric columns should be formatted as numbers

---

## Key Functions

### parser.ts

| Function                      | Purpose                                        |
| ----------------------------- | ---------------------------------------------- |
| `parseCSV(file)`              | Parse CSV file to array of objects             |
| `parseExcel(file)`            | Parse Excel file to array of objects           |
| `detectColumns(data)`         | Auto-detect column roles with keyword matching |
| `validateData(data, outcome)` | Validate rows and return quality report        |
| `parseParetoFile(file)`       | Parse separate Pareto file to ParetoRow[]      |

### useDataIngestion.ts

| Function                       | Purpose                      |
| ------------------------------ | ---------------------------- |
| `handleFileUpload(e)`          | Main file upload handler     |
| `handleParetoFileUpload(file)` | Separate Pareto file handler |
| `clearParetoFile()`            | Reset to derived Pareto mode |
| `loadSample(sample)`           | Load sample dataset          |
| `clearData()`                  | Reset all data state         |
