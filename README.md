# VariScout Lite

A lightweight, offline-first variation analysis tool for quality professionals. No AI, no subscriptions, no API keys — just fast, linked charts that reveal hidden variation.

**Tagline:** *"Cut through your watermelons — without the cloud."*

## What Is It?

VariScout Lite is a Progressive Web App (PWA) designed for environments where simplicity and privacy are paramount. It offers a powerful 3-chart dashboard (I-Chart, Boxplot, Pareto) with linked brushing and filtering, running entirely in your browser.

**Works on any device** — phones, tablets, and desktops. Install it like an app, use it offline.

## Key Features

- **Offline First**: Works without internet after first visit. All processing happens in your browser.
- **Mobile Friendly**: Responsive design optimized for factory floor tablets and phones.
- **Data Import**: Drag-and-drop CSV and Excel (.xlsx) support.
- **Manual Entry**: Enter data directly from paper with running statistics, spec compliance feedback, and 56px touch targets for tablets.
- **Interactive Dashboard**:
    - **I-Chart**: Time series tracking with auto-calculated control limits.
    - **Boxplot**: Factor comparison (e.g., Shift A vs Shift B).
    - **Pareto**: Defect categorization.
    - **Linked Filtering**: Click a bar in the Pareto to filter the I-Chart instantly.
- **Statistics**: Conformance (Pass/Fail) and Capability (Cp, Cpk) analysis.
- **Save & Load**: Save analyses to browser storage or download as .vrs files.
- **Export**:
    - **PNG**: Save charts as images for reports.
    - **CSV**: Export filtered data as Excel-compatible CSV with spec status.
- **Large Mode**: Toggle 30% larger fonts for presentations and training sessions.

## Tech Stack

- **Runtime**: Progressive Web App (PWA) with Service Worker
- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Visualization**: Visx (D3 primitives for React)
- **Storage**: IndexedDB + localStorage (via `idb`)
- **Testing**: Vitest

## Getting Started

### Prerequisites
- Node.js (v18+)

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Open http://localhost:5173 in your browser.

### Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Deployment

### Vercel (Recommended)
```bash
npx vercel
```
Or connect your GitHub repository to Vercel for automatic deployments.

### Manual Deployment
```bash
npm run build
# Deploy the `dist/` folder to any static hosting service
```

### Install as App
After visiting the deployed URL:
- **Mobile**: Tap "Add to Home Screen" in your browser menu
- **Desktop**: Click the install icon in the browser address bar

## Data Privacy

- **100% browser-based** — no data leaves your device
- **No server** — all processing happens locally
- **No tracking** — we don't collect any usage data
- **Your data, your control** — stored only in your browser

## Contributing

See `PRODUCT_OVERVIEW.md` for product philosophy and what we built.
See `Specs.md` for detailed functional requirements.
See `ARCHITECTURE.md` for technical details.
See `UX_RESEARCH.md` for user personas and use cases.
