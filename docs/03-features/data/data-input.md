# Data Input

How VariScout handles file uploads and data parsing.

---

## Supported Formats

| Format | Extension   | Notes                        |
| ------ | ----------- | ---------------------------- |
| CSV    | .csv        | Comma or semicolon delimited |
| Excel  | .xlsx, .xls | First sheet used             |
| TSV    | .tsv        | Tab delimited                |

---

## Column Detection

VariScout auto-detects column types:

| Type            | Detection                            |
| --------------- | ------------------------------------ |
| Numeric measure | All values are numbers               |
| Date/time       | Parseable date formats               |
| Categorical     | Repeated string values               |
| Identifier      | Unique values (ignored for analysis) |

---

## Required Columns

| Column Type | Required?        | Purpose                 |
| ----------- | ---------------- | ----------------------- |
| Measure     | Yes (at least 1) | Values to analyze       |
| Factor      | No               | Categories for grouping |
| Date/Time   | No               | Time-series ordering    |

---

## Auto-Mapping

Keywords trigger automatic column assignment:

| Keywords                       | Maps To              |
| ------------------------------ | -------------------- |
| "value", "measure", "result"   | Measure column       |
| "shift", "machine", "operator" | Factor columns       |
| "date", "time", "timestamp"    | Time column          |
| "usl", "lsl", "target", "spec" | Specification values |

---

## Upload Flow

```
FILE SELECTED
     │
     ▼
PARSE (CSV/Excel)
     │
     ▼
DETECT COLUMNS
     │
     ▼
AUTO-MAP (if keywords found)
     │
     ▼
VALIDATE DATA
     │
     ▼
USER CONFIRMS/ADJUSTS
     │
     ▼
LOAD INTO ANALYSIS
```

---

## See Also

- [Validation](validation.md)
- [Storage](storage.md)
- [Technical: Data Input](../../05-technical/implementation/data-input.md)
