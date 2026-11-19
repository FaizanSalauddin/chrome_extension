# AI Website Analyzer – Chrome Extension + React Dashboard

A cutting-edge, offline-first Chrome Extension and SaaS Dashboard engineered for website content extraction, DOM hierarchy mapping, visual asset cataloging, and future FastAPI AI-detection pipeline integration.

---

## 🌟 Key Highlights & Architectural Strengths

- **Automatic Website Detection**: Automatically extracts DOM content (text, headings, metadata, images) whenever you visit a website. No manual button pressing needed.
- **Auto-Extract on Popup Open**: Opening the extension popup immediately scans the active tab and presents stats within milliseconds.
- **Auto-Detect Toggle Control**: Users can easily toggle auto-detection ON/OFF from the popup card.
- **Manifest V3 Extension**: Uses standard Chrome Scripting and Storage APIs (`chrome.scripting.executeScript`, `chrome.storage.local`).
- **Offline Browser-First**: 100% of the extraction, persistent storage, and visualization run locally inside the browser. No localhost or external servers required.
- **FastAPI Backend Ready**: Centralized `prepareWebsiteAnalysisPayload(record)` function transforms extracted records into standardized JSON payloads ready for `POST /api/analyze/website`.
- **Reactive Live Sync**: Subscribed to `chrome.storage.onChanged`—the React dashboard updates automatically the instant a user extracts a webpage from the extension popup.
- **Privacy & Security Compliant**: Zero credential capture; scripts, styles, forms, and sensitive input fields are filtered out during extraction.
- **Professional SaaS Dark Theme**: Designed with `#0B0B12` dark background, `#141420` cards, `#8B5CF6` purple accents, Lucide React icons, and Recharts analytics.

---

## What This Project Is

AI Website Analyzer is a Manifest V3 Chrome extension with a React and TypeScript dashboard. It scans the active webpage and locally records useful page information, including:

- Page title and URL
- Visible text and headings
- Page metadata
- Images and their source URLs
- DOM structure and analysis statistics

Everything is stored in Chrome's local extension storage. No account or backend service is required.

## How to Use It

### 1. Open a Website

Visit an ordinary `http://` or `https://` webpage. The extension does not run on restricted Chrome pages such as `chrome://extensions` or `chrome://settings`.

### 2. Open the Extension

Click the puzzle-piece icon in the Chrome toolbar and pin **AI Website Analyzer**. Then click the extension icon to open its popup.

### 3. Scan the Page

- The extension can extract the page automatically when the popup opens.
- Use the **Scan** or **Analyze** button in the popup to start a manual scan.
- Enable or disable automatic analysis using the popup toggle.
- The scan result is saved in Chrome's local extension storage.

### 4. Open the Dashboard

Open the extension popup and use the dashboard or detail button to launch the React dashboard. You can also open `dist/index.html` through the extension interface after loading the unpacked extension.

### 5. Explore Saved Results

In the dashboard, you can:

- View overview statistics and recent activity
- Search through scanned websites
- Open a website to inspect extracted text, headings, metadata, and images
- Copy or delete individual scan records
- Clear all saved records
- Inspect the structured JSON payload prepared for a future FastAPI analysis endpoint

## Privacy

The extractor runs locally in the browser. It does not collect passwords or account credentials and filters scripts, styles, forms, and sensitive input fields. Review the content of a page before exporting or sharing extracted results.

## Development

Start a local Vite development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

To rebuild and reload the Chrome extension after code changes, run `npm run build`, then click **Reload** on the extension's card at `chrome://extensions/`.

---

## 📁 Project Structure

```
ai-website-analyzer/
│
├── public/
│   ├── manifest.json       # Chrome Manifest V3 configuration
│   ├── popup.html          # Modern 360px Dark Theme Popup UI
│   ├── popup.js            # DOM extraction script & storage handler
│   ├── popup.css           # Popup styling with status pulse indicators
│   └── icons/              # 16x16, 48x48, 128x128 extension icons
│
├── src/
│   ├── components/
│   │   ├── Sidebar.tsx         # SaaS navigation & environment status
│   │   ├── Header.tsx          # Real-time sync badge & refresh controls
│   │   ├── StatCard.tsx        # Dynamic metric cards with trend indicators
│   │   ├── WebsiteCard.tsx     # Extracted site cards with copy/details/delete
│   │   ├── ImageGallery.tsx    # Responsive grid with broken fallback & modal
│   │   ├── ImageModal.tsx      # Full-resolution preview & metadata inspector
│   │   ├── EmptyState.tsx      # Step-by-step scanner onboarding guide
│   │   └── PayloadModal.tsx    # FastAPI JSON payload inspector for evaluators
│   │
│   ├── pages/
│   │   ├── Dashboard.tsx       # Overview telemetry & Recharts activity graph
│   │   ├── Websites.tsx        # Search, sort, and batch management repository
│   │   └── WebsiteDetails.tsx  # In-depth DOM text, images, and AI module
│   │
│   ├── services/
│   │   ├── storage.ts          # chrome.storage.local service + reactive listener
│   │   └── api.ts              # FastAPI endpoints architecture & payload serializer
│   │
│   ├── types/
│   │   └── index.ts            # Shared TypeScript interfaces
│   │
│   ├── hooks/
│   │   └── useWebsites.ts      # Live reactive storage state hook
│   │
│   ├── App.tsx                 # Root router and layout container
│   ├── main.tsx                # React 19 entry point
│   ├── index.css               # Tailwind CSS & custom scrollbars
│   └── vite-env.d.ts           # TypeScript environment declarations
│
├── index.html              # Packaged extension dashboard page
├── vite.config.ts          # Bundler config with relative path handling
├── tailwind.config.js      # Custom SaaS dark theme color palette
└── package.json            # Project dependencies & build scripts
```

---

## 🚀 Installation & Loading into Google Chrome

### Step 1: Install Dependencies

Open PowerShell or Terminal in the project root:

```bash
cd D:\chrome_extension
npm install
```

### Step 2: Build the Extension Package

```bash
npm run build
```

This compiles the React TypeScript dashboard and merges it with the extension assets into the `dist/` directory.

### Step 3: Load into Google Chrome

1. Open Google Chrome.
2. Navigate to: `chrome://extensions/`
3. Toggle on **"Developer mode"** in the top right corner.
4. Click the **"Load unpacked"** button in the top left.
5. In the file picker, select the **`dist`** folder:
   ```
   D:\chrome_extension\dist
   ```
6. Click **Select Folder**. The **"AI Website Analyzer"** extension will appear in your extensions list.
7. Click the Extensions puzzle piece icon on your Chrome toolbar and **Pin** the AI Website Analyzer.
