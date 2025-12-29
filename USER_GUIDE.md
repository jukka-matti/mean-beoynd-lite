# VariScout Lite: User Guide

This guide covers advanced features and workflows in VariScout Lite, focusing on interactive customization and specification management.

## Interactive Chart Customization

VariScout Lite allows you to customize chart labels and axis names directly on the dashboard without altering your original data source. This is called **Aliasing**.

### Renaming Axis Titles
You can rename the Y-axis (Outcome) and X-axis (Factor/Category) labels to make charts more presentation-ready.

1.  **Hover** over any axis label (e.g., "Weight" on the Y-axis). The cursor will change to a pointer.
2.  **Click** the label. A small popup editor will appear.
3.  **Type** the new name (e.g., "Net Weight (g)").
4.  **Click Save** (Check icon).
    *   *Note: This creates an "alias". Your original data column name remains unchanged.*

### Renaming Categories (Boxplot)
If your data has cryptic codes (e.g., "M1", "M2"), you can rename them to meaningful labels (e.g., "Machine 1", "Machine 2") directly on the Boxplot.

1.  **Click** the X-axis label of the Boxplot (e.g., "MachineID").
2.  The **Label & Category Editor** will open.
3.  You will see a list of all unique values found in that column.
4.  Enter a **Display Name** next to any value you wish to rename.
5.  **Click Save**. The chart will update immediately.

---

## Specification Management

Specifications (Spec Limits) define what is considered "acceptable" quality. VariScout Lite supports both standard limits and complex multi-tier grading.

### Setting Standard Limits (USL/LSL)
1.  Locate the **Stats Panel** (the card with Cp/Cpk stats).
2.  Click the **"Add Specs"** area at the bottom, or the **Settings Icon** in the panel header.
3.  Enter your limits:
    *   **LSL (Lower Spec Limit)**: Minimum acceptable value.
    *   **Target**: Ideal value (optional, drawn in green).
    *   **USL (Upper Spec Limit)**: Maximum acceptable value.
4.  **Result**:
    *   Red dotted lines appear on charts (I-Chart & Boxplot).
    *   Cp, Cpk, and Pass/Fail rates are instantly calculated.
    *   Histogram updates to show spec boundaries.

### Multi-Tier Grading
For industries like Coffee or Textiles, simple Pass/Fail isn't enough. You can define multiple grades (e.g., Specialty, Premium, Commercial).

1.  Open the **Spec Editor** (same as above).
2.  In the "Grades" section, click **"+ Add"**.
3.  Define a grade:
    *   **Label**: e.g., "Grade A".
    *   **Max**: The upper limit for this grade (inclusive).
    *   **Color**: Pick a color for visualization.
4.  Add as many grades as needed. Ensure they are sorted logic (the editor usually handles sorting by max value).
5.  **Result**: Charts will show colored background bands corresponding to these grades.

---

## Visualization Options

You can toggle visibility of chart elements in the global **Settings**.

1.  Click the **Gear Icon** (top right of the header).
2.  Scroll to **"2. Visualization"**.
3.  Toggle options:
    *   **Show Cp**: Capability of the process width (ignoring centering).
    *   **Show Cpk**: Capability considering process centering (real-world performance).
    *   **Show Spec Limits**: Toggle the red USL/LSL lines on charts on/off.

---

## Manual Data Entry

VariScout Lite includes a touch-optimized data entry mode for field use or when you need to quickly input measurements.

### Accessing Manual Entry

1. From the home screen (before uploading data), click **"Enter Data Manually"**
2. Or use the **Manual Entry** option in the upload area dropdown

### Step 1: Configure Your Measurement

1. **Outcome (Y)**: Name of the measurement you're recording (e.g., "Weight", "Diameter", "pH")
2. **Factors (X)**: Grouping variables (e.g., "Operator", "Machine", "Batch")
   - Click **+ Add Factor** to add more (up to 3 recommended)
   - Click the **X** to remove a factor
3. Click **Continue** to proceed to data entry

### Step 2: Enter Your Data

The data entry grid has these features:

#### Keyboard Navigation
| Key | Action |
|-----|--------|
| `Tab` | Move to next cell |
| `Shift+Tab` | Move to previous cell |
| `Enter` | Move to next cell (same as Tab) |
| `Enter` on last cell | Creates a new row |

#### Touch-Optimized Design
- Large **56px input fields** for easy tablet/phone use
- Clear visual feedback on focus
- **Add Row** button prominently placed

#### Spec Limit Feedback
1. Enter **USL** and/or **LSL** in the header area
2. Each measurement shows instant visual feedback:
   - **Green border**: Within spec (PASS)
   - **Red border + text**: Exceeds USL
   - **Amber border + text**: Below LSL

#### Running Statistics
As you enter data, live statistics appear:
- **Count**: Number of valid measurements
- **Mean**: Running average
- **Min/Max**: Range of values
- **Pass Rate**: Percentage meeting specs (if limits defined)

#### Paste from Clipboard
Click the **Paste** button to paste tab-separated data from Excel:
1. Copy cells in Excel (columns should match your factor + outcome order)
2. Click **Paste from Clipboard**
3. Data is appended to existing rows

### Analyzing Your Data

1. Enter at least one measurement
2. Click **Analyze** to proceed to the dashboard
3. Your spec limits (if set) carry over to the analysis

---

## Data Import Formats

### Supported File Types

| Format | Extension | Notes |
|--------|-----------|-------|
| CSV | `.csv` | Comma-separated, UTF-8 recommended |
| Excel | `.xlsx` | First sheet only, first row = headers |

### CSV Requirements

```csv
Supplier,Shift,Weight
Farm A,Morning,325.5
Farm B,Afternoon,318.2
Farm A,Morning,330.1
```

- **First row**: Column headers (required)
- **Encoding**: UTF-8 preferred (for international characters)
- **Delimiter**: Comma (`,`)
- **Numeric columns**: Use period (`.`) for decimals

### Excel Requirements

- **Sheet**: Only the first sheet is read
- **Headers**: First row must contain column names
- **Data types**: Numeric columns should be formatted as numbers
- **Limit**: Maximum 50,000 rows

### Data Size Limits

| Threshold | Behavior |
|-----------|----------|
| < 5,000 rows | Loads immediately |
| 5,000 - 50,000 rows | Warning prompt (may slow performance) |
| > 50,000 rows | Rejected (file too large) |

### Auto-Detection

VariScout automatically detects:
- **Numeric columns** → Suggested as Outcome (Y)
- **Categorical columns** → Suggested as Factors (X)
- **Date/time columns** → Used for I-Chart ordering

You can always override these suggestions in Settings.

---

## Tips & Tricks

*   **Keyboard Shortcuts**: Press `Esc` to instantly clear all chart filters.
*   **Reset Scaling**: If you manually zoomed or panned, double-click the chart area or use the "Reset" button in scale settings to fit to data.
*   **Large Mode**: Presenting to a group? Open Settings and toggle "Large Mode" for 30% larger text.
*   **Export Charts**: Click the camera icon to save individual charts as PNG images.
*   **Linked Filtering**: Click any bar in Pareto or group in Boxplot to filter all charts instantly.

---

## Troubleshooting / FAQ

### Data Issues

**Q: My data isn't showing up after upload**

A: Check that:
1. Your file has a header row
2. At least one column contains numeric data
3. File size is under 50,000 rows

**Q: Numeric column is being treated as text**

A: Excel may format numbers as text. Re-format the column as "Number" in Excel and re-export.

**Q: Special characters (é, ü, etc.) look wrong**

A: Save your CSV as UTF-8 encoding. In Excel: Save As → CSV UTF-8.

### Charts

**Q: I-Chart control limits seem wrong**

A: Control limits (UCL/LCL) are calculated from your data using the 3-sigma rule:
- UCL = Mean + 3 × StdDev
- LCL = Mean − 3 × StdDev

They reflect what your process **is doing**, not what it **should do**. Specification limits (USL/LSL) are separate.

**Q: Charts are too small on my screen**

A: Enable **Large Mode** in Settings for 30% larger fonts and touch targets.

### Offline Use

**Q: Can I use VariScout without internet?**

A: Yes! After visiting once, the app caches itself for offline use. You can even "Add to Home Screen" for an app-like experience.

**Q: Where is my data stored?**

A: All data stays in your browser:
- **Auto-save**: localStorage (survives page refresh)
- **Saved Projects**: IndexedDB (larger storage)
- **No cloud**: Nothing is sent to any server

### Projects & Export

**Q: How do I share my analysis?**

A: Use **File → Export as .vrs** to save a portable JSON file. Others can import it with File → Import.

**Q: Can I open .vrs files in Excel?**

A: Not directly. Export your data as CSV instead (File → Export CSV).
