# VariScout Lite: Design System

## 1. Design Philosophy
**"Engineer's Dashboard"**: Dark, data-dense, but uncluttered. The design prioritizes legibility of charts and statistics over decorative elements.

## 2. Color Palette (Slate Dark Mode)

We utilize the Tailwind `slate` scale for maximum contrast without the harshness of pure black (`#000000`).

| Usage | Color Token | Hex Code |
| :--- | :--- | :--- |
| **Background** | `bg-slate-900` | `#0f172a` |
| **Surface/Card** | `bg-slate-800/50` | `#1e293b` (50% opacity) |
| **Borders** | `border-slate-700` | `#334155` |
| **Text (Primary)** | `text-slate-200` | `#e2e8f0` |
| **Text (Muted)** | `text-slate-400` | `#94a3b8` |
| **Accent (Primary)** | `text-blue-400` | `#60a5fa` |
| **Success** | `text-green-500` | `#22c55e` |
| **Danger/Alert** | `text-red-400` | `#f87171` |

## 3. Typography
-   **Font Family**: `Inter`, system-ui (Standard, clean sans-serif).
-   **Numbers**: `font-mono` is used for all tabular data, specs, and statistical results (Mean, UCL, Cpk) to ensure alignment.

## 4. Responsive Strategy
The application is **mobile-first**, optimized for factory floor tablets and phones while scaling up beautifully to desktop.

-   **Grid Layout**:
    -   **Mobile (<640px)**: Single column stack. Charts fill width, scroll vertically.
    -   **Tablet (640-1024px)**: Charts stack vertically with comfortable touch targets.
    -   **Desktop (>1024px)**: Fixed 2-row layout. I-Chart on top (flex-1), Analysis Row on bottom (fixed height).
-   **Charts**:
    -   All charts use `withParentSize` HOC from Visx to redraw automatically on window resize.
-   **Touch Interactions**:
    -   Larger hit targets for boxplot clicks and filter buttons.
    -   Touch-friendly filter chips and modal controls.
    -   Swipe-friendly scrolling on mobile.

## 5. Components

### 5.1 Card Container
Every major section (Chart, Panel) is wrapped in a standard card container:
```jsx
<div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
  {/* Content */}
</div>
```

### 5.2 Stats Panel
Designed for "glanceability". Key metrics (Pass Rate, Cpk) are large and bolded. Secondary info (USL/LSL) is muted and pushed to the bottom.
