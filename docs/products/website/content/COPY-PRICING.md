# Pricing Copy

## Meta

```yaml
title: 'VaRiScout Pricing | Demo Free, Install Free, License €99'
description: 'VaRiScout pricing: Demo with samples in browser. Install free to upload your data. €99/year license for saving projects.'
keywords: 'VaRiScout pricing, SPC software cost, variation analysis pricing'
```

---

## hero

```yaml
headline: 'Simple pricing.'
headline_emphasis: 'Start free.'
subhead: 'Demo in your browser. Install to upload your data. License to save projects.'
```

---

## pricing_tiers

```yaml
section_id: 'tiers'

tiers:
  - name: 'Demo'
    price: '€0'
    period: 'forever'
    description: 'Explore sample analyses in your browser. No signup.'
    features:
      - '16 sample datasets'
      - 'Full chart gallery (I-Chart, Boxplot, Pareto, Capability)'
      - 'Interactive analysis'
      - 'Learn variation concepts'
    limitations:
      - 'Sample data only'
      - 'No file upload'
      - 'No saving'
    cta:
      text: 'Try Demo'
      url: '/app'
    cta_note: 'Opens in browser'
    highlight: false

  - name: 'Free'
    price: '€0'
    period: 'forever'
    description: 'Install to analyze your own data. No signup needed.'
    features:
      - 'Upload CSV/Excel files'
      - 'Manual data entry'
      - 'Full analysis tools'
      - 'Works offline'
      - 'Copy to clipboard'
    limitations:
      - 'Session-only (no save)'
      - 'Watermark on exports'
    cta:
      text: 'Install App'
      url: '/app'
    cta_note: 'PWA - works like native app'
    highlight: true
    badge: 'Most Popular'

  - name: 'Licensed'
    price: '€99'
    period: '/year'
    description: 'Save projects and export without watermarks.'
    features:
      - 'Everything in Free, plus:'
      - 'Save projects locally'
      - 'Export/import .vrs project files'
      - 'Save analysis templates'
      - 'No watermark on exports'
      - 'Theme customization'
    where_to_get: 'Upgrade inside the installed app'
    cta:
      text: 'Get License'
      url: '/app?upgrade=true'
    cta_note: 'One-time license key'
    highlight: false

  - name: 'Excel'
    price: '€99'
    period: '/year'
    description: 'VaRiScout inside Excel.'
    features:
      - 'Excel Add-in for Windows/Mac/Web'
      - 'Analyze data directly in spreadsheets'
      - 'Save settings in workbook'
      - 'Native Excel experience'
    where_to_get: 'Microsoft AppSource'
    cta:
      text: 'Get Add-in'
      url: 'https://appsource.microsoft.com/...'
      external: true
    cta_note: 'Via Microsoft AppSource'
    highlight: false
```

---

## how_buying_works

```yaml
section_id: 'how-it-works'
headline: 'How It Works'
subhead: 'Three simple steps'

steps:
  - number: 1
    icon: 'play'
    title: 'Try Demo'
    description: 'Open VaRiScout in your browser. Explore sample datasets and see all chart types in action.'
    detail: 'No signup, no installation. Just open and explore.'

  - number: 2
    icon: 'download'
    title: 'Install Free'
    description: 'Click "Install" in your browser to get the full app. Upload your own CSV/Excel files.'
    detail: 'Works offline. Your data never leaves your device.'

  - number: 3
    icon: 'key'
    title: 'License (Optional)'
    description: 'Need to save projects? Upgrade to Licensed (€99/year) inside the app. Instant activation.'
    detail: 'Payment via Paddle. Backup key emailed to you.'

trust_badges:
  - icon: 'shield'
    text: 'Secure payment via Paddle'
  - icon: 'zap'
    text: 'Instant activation'
  - icon: 'file-text'
    text: 'VAT invoice included'
  - icon: 'refresh-cw'
    text: '30-day money-back'
```

---

## about_paddle

```yaml
section_id: 'about-paddle'
headline: 'About Payment'

content: |
  Payments are handled by **Paddle**, a trusted payment provider used by over 3,000 software companies worldwide.

  When you upgrade:
  - Your payment goes to Paddle, not directly to us
  - Paddle handles VAT/tax automatically based on your location
  - You receive a proper invoice immediately by email
  - Credit cards, PayPal, and other methods accepted

  We never see your payment details. Paddle sends us a notification, we generate your license key, and email it to you.

link:
  text: 'Learn more about Paddle'
  url: 'https://www.paddle.com'
  external: true
```

---

## team_options

```yaml
section_id: 'team-options'
headline: 'Need Team or Enterprise Features?'
subhead: 'For organizations needing central deployment and full control'

options:
  - name: 'Azure Deployment'
    icon: 'cloud'
    for: 'Organizations wanting full control'
    description: |
      Deploy VaRiScout to your own Azure tenant.
      Your infrastructure, your domain, your branding.
    features:
      - 'Self-hosted on your Azure subscription'
      - 'Custom domain (e.g., analysis.yourcompany.com)'
      - 'SSO integration (Azure AD)'
      - 'Custom branding (your logo, colors)'
      - 'Unlimited users within your organization'
      - 'Data never leaves your Azure tenant'
    price: '€1799/year + ~€10-20/month Azure hosting'
    cta:
      text: 'View in Azure Marketplace'
      url: 'https://azuremarketplace.microsoft.com/...'
      external: true
    ideal_for:
      - 'IT teams needing control'
      - 'Organizations with data residency requirements'
      - 'Companies wanting internal branding'
      - 'Large-scale deployment (100+ users)'

comparison_note: |
  **Not sure which to choose?**
  - Just you? → **Licensed** (€99/year, upgrade in-app)
  - Need Excel integration? → **Excel Add-in** (€99/year, via AppSource)
  - Need self-hosted control? → **Azure** (€1799/year, via Marketplace)

  All options analyze data locally — we never see your data.
```

---

## tier_comparison

```yaml
section_id: 'comparison'
headline: 'Compare Plans'

columns:
  - 'Feature'
  - 'Demo'
  - 'Free'
  - 'Licensed'
  - 'Excel'

rows:
  - feature: 'Sample datasets'
    demo: '✓'
    free: '✓'
    licensed: '✓'
    excel: '✗'

  - feature: 'All chart types'
    demo: '✓'
    free: '✓'
    licensed: '✓'
    excel: '✓'

  - feature: 'Upload CSV/Excel'
    demo: '✗'
    free: '✓'
    licensed: '✓'
    excel: 'In Excel'

  - feature: 'Manual data entry'
    demo: '✗'
    free: '✓'
    licensed: '✓'
    excel: 'In Excel'

  - feature: 'Copy to clipboard'
    demo: '✓'
    free: '✓ (watermark)'
    licensed: '✓'
    excel: '✓'

  - feature: 'Export PNG/CSV'
    demo: '✗'
    free: '✓ (watermark)'
    licensed: '✓'
    excel: '✓'

  - feature: 'Save projects'
    demo: '✗'
    free: '✗'
    licensed: '✓'
    excel: 'In workbook'

  - feature: 'Export .vrs files'
    demo: '✗'
    free: '✗'
    licensed: '✓'
    excel: '✗'

  - feature: 'Save templates'
    demo: '✗'
    free: '✗'
    licensed: '✓'
    excel: 'In workbook'

  - feature: 'Works offline'
    demo: '✗'
    free: '✓'
    licensed: '✓'
    excel: '✓ (Desktop)'

  - feature: 'Theme customization'
    demo: '✗'
    free: '✗'
    licensed: '✓'
    excel: '✗'

  - feature: 'Platform'
    demo: 'Browser'
    free: 'Installed PWA'
    licensed: 'Installed PWA'
    excel: 'Excel Add-in'

  - feature: 'Support'
    demo: 'Community'
    free: 'Community'
    licensed: 'Email'
    excel: 'Email'
```

---

## faq

```yaml
section_id: 'faq'
headline: 'Pricing FAQ'

items:
  - question: "Why can't I upload files in my browser?"
    answer: 'For privacy, your data never leaves your device. This requires installing the app as a PWA (Progressive Web App). Installation is free and takes 2 clicks - no app store needed.'

  - question: "What's the difference between Demo and Free?"
    answer: 'Demo runs in your browser with sample data only - great for exploring and learning. Free is the installed app that works offline and lets you upload your own CSV/Excel files. Both are completely free.'

  - question: 'Can I use the Free tier for real work?'
    answer: "Absolutely. Free has full analysis features. It's great for quick analyses where you don't need to save. When you find yourself spending 20+ minutes on an analysis, you'll probably want to upgrade so you can save your work."

  - question: 'How do I upgrade from Free to Licensed?'
    answer: "Click 'Upgrade' in the app's Settings. Complete the secure checkout (powered by Paddle). Your license activates instantly — no waiting for email."

  - question: 'How does activation work?'
    answer: 'Instantly! After you pay, the app activates within 2-3 seconds. No need to check email or enter a license key. A backup key is emailed to you in case you need to set up on a new device later.'

  - question: 'What if I need to use VaRiScout on a new device?'
    answer: 'Check your email for the license key we sent after purchase. Enter it in Settings on your new device. The key format is VSL-XXXX-XXXX-XXXX-XXXX.'

  - question: 'Can I use my license on multiple devices?'
    answer: 'Yes. Your license key (sent via email as backup) works on any device. The license is tied to your email, not to a specific device.'

  - question: 'Why are Excel Add-in and Azure purchased through Microsoft?'
    answer: "Excel Add-in and Azure deployment are available through Microsoft AppSource and Azure Marketplace. This means familiar procurement, billing on your Microsoft invoice, and compliance with your organization's purchasing policies."

  - question: 'Is there a money-back guarantee?'
    answer: 'Yes. 30-day money-back guarantee for Licensed tier, no questions asked. For Microsoft purchases, their refund policies apply.'

  - question: 'Where does my data go?'
    answer: "Nowhere. VaRiScout runs entirely in your browser/device. Your data never leaves. We don't have servers that see your data — that's by design."
```

---

## data_privacy_callout

```yaml
section_id: 'data-privacy'
headline: 'Your Data Stays Yours'
icon: 'shield-check'

content: |
  VaRiScout is designed for sensitive operational data.
  That's why we built it to run entirely on your side:

  - **Demo**: Runs in your browser with sample data
  - **Free/Licensed**: Runs on your device. Data never uploaded.
  - **Excel**: Runs in your Excel. Data stays in your spreadsheets.
  - **Azure**: Deploy to your own Azure. Your infrastructure, your control.

note: "We don't operate servers that see your data. We can't access your analyses. That's by design."
```

---

## final_cta

```yaml
section_id: 'final-cta'
headline: 'Start with Demo'
subhead: 'No signup. No credit card. Just open and explore.'
cta:
  text: 'Try Demo'
  url: '/app'
note: 'Install to upload your data. License to save projects.'
```
