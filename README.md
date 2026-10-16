# 🚀 POD Rocket | Print-On-Demand & Merch Research Suite

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Status](https://img.shields.io/badge/Status-Active%20Production-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

<p align="center">
  <b>The next-generation intelligence and analytics dashboard for Merch on Demand, KDP, and Print-on-Demand sellers.</b>
  <br />
  Track real-time BSR velocity, discover breakout trends, uncover evergreen low-competition niches, reverse-engineer top competitors, and protect your seller account with instant trademark checks.
</p>

[Key Features](#-key-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [Environment Variables](#-environment-variables) • [Project Structure](#-project-structure)

</div>

---

## 🌟 Overview

**POD Rocket** (POD Analytics Pro) is an all-in-one market research and competitor intelligence platform designed specifically for Amazon Merch on Demand (MBA/AMOD), Redbubble, Etsy, Teepublic, and KDP creators.

Finding winning designs in Print-On-Demand usually requires multiple subscriptions and risky manual trademark checks. **POD Rocket** consolidates live marketplace analytics, sales velocity estimation, BSR history tracking, keyword extraction, and trademark safety verification into a single, high-performance web dashboard.

---

## ⚡ Key Features

### 1. 📊 Executive Dashboard & Live Velocity
- **At-a-Glance Metrics**: Monitor overall tracked niches, average BSR, highest-velocity products, and trademark safety rate.
- **Top BSR Droppers**: Real-time tracking of designs making massive rank leaps.
- **Instant Clipboard Actions**: One-click copying of ASINs, titles, and top-ranking keywords.

### 2. 🔥 Viral Trend Finder
- **Velocity Tracker**: Detect emerging trends before saturation occurs.
- **Smart Filters**: Filter by product type (Standard T-Shirts, Hoodies, Popsockets, etc.), price points, and review thresholds.
- **Growth Indicators**: Visual trajectory indicators (Surging, Hot, Steady, Declining).

### 3. 🌲 Evergreen Niche Discovery
- **Low-Competition Hunter**: Identify year-round profitable niches with consistent search volume and lower listing saturation.
- **Seasonality Scores**: Focus on designs that generate passive income 365 days a year without relying solely on holidays.

### 4. 🕵️ Competitor Spy & ASIN Deep-Dive
- **ASIN & URL Lookup**: Inspect any Amazon product instantly by pasting its ASIN or full product URL.
- **Sales & Revenue Estimation**: Real-time estimated daily and monthly unit sales derived from BSR dynamics and review counts.
- **BSR History Trajectory**: Interactive data visualization powered by Recharts.
- **Keyword & Tag Extraction**: Automated breakdown of primary keywords, secondary search terms, and title tags to optimize your listings.

### 5. 🛡️ Trademark & Brand Safety Shield
- **Account Protection**: Prevent Amazon account suspensions and takedowns.
- **Multi-Class Inspection**: Real-time cross-referencing against high-risk apparel trademarks (USPTO Class 025).
- **Risk Score Breakdown**: Clear safety badges (*Safe*, *Caution*, *High Risk*) with direct reference to potentially infringing phrases.

### 6. 🔄 Resilient Architecture & Caching
- **Multi-Provider API Engine**: Connect RapidAPI real-time Amazon data with seamless local caching to minimize API usage costs.
- **Auto-Failover Simulation**: Built-in test sandbox and offline mock mode for continuous testing and development without live API consumption.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict typing)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & Vanilla CSS custom scrollbars
- **Animations**: [Motion](https://motion.dev/) (Framer Motion)
- **Charts & Visualization**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **AI Integration**: [@google/genai](https://www.npmjs.com/package/@google/genai) (Google Gemini API)

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.18.0 or later recommended)
- `npm`, `pnpm`, or `bun`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/pod-rocket.git
   cd pod-rocket
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your API credentials:
   ```env
   # RapidAPI Real-Time Amazon Data API Key
   RAPIDAPI_KEY=your_rapidapi_key_here

   # Google Gemini API Key (Optional / AI Features)
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   bun dev
   ```

5. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

---

## ⚙️ Environment Variables

| Variable | Required | Description |
| :--- | :---: | :--- |
| `RAPIDAPI_KEY` | Optional | RapidAPI key for real-time live Amazon data scraping. |
| `GEMINI_API_KEY` | Optional | Google Gemini API key for automated AI listing assistance. |
| `APP_URL` | Optional | Production deployment URL for hosting callbacks. |

> **Note**: The app includes a built-in mock mode and test dataset, allowing full UI exploration even without active API keys.

---

## 📂 Project Structure

```text
POD Rocket/
├── app/
│   ├── api/
│   │   └── amazon-data/       # Backend route for real-time Amazon scraping & BSR estimations
│   ├── globals.css            # Global Tailwind styling and dark theme variables
│   ├── layout.tsx             # Root layout with font and metadata configuration
│   └── page.tsx               # Main Dashboard view switcher
├── components/
│   ├── competitor/            # Competitor Spy and ASIN analyzer components
│   ├── dashboard/             # Executive Overview, quick stats, top droppers
│   ├── evergreen/             # Evergreen niche discovery explorer
│   ├── layout/                # Sidebar navigation, Header, and breadcrumbs
│   ├── settings/              # API Provider settings, cache management, test failover
│   ├── trademark/             # USPTO & Class 025 trademark inspection tools
│   ├── trends/                # Viral trend finder and velocity rankers
│   └── ui/                    # Reusable button, modal, badge, and input primitives
├── context/
│   └── ApiContext.tsx         # Global state provider for queries, caching, and tabs
├── lib/
│   ├── cacheStorage.ts        # Local client storage for caching search results
│   ├── mockData.ts            # Curated fallback data for offline mode
│   └── trademarkChecker.ts    # Trademark phrase matching & safety evaluation engine
├── types/
│   └── amazon.ts              # TypeScript interfaces for products, BSR, and API responses
└── README.md
```

---

## 🔒 Security Best Practices

- Never commit `.env` or `.env.local` containing live API keys to public repositories.
- Use environment variables (`process.env.RAPIDAPI_KEY`) on the server-side to protect your quota.
- Always verify trademarks manually on the official [USPTO TESS Database](https://www.uspto.gov/trademarks) before publishing live commercial products.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
