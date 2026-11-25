# MovieBox Watch - Streaming Platform & Next-Gen MovieBox Competitor

A high-performance streaming web application built with **Next.js 16 (App Router)**, **React 19**, and **Material UI (MUI v9)**, specifically architected to outperform and outrank MovieBox across search engines (Google, Bing) and user engagement.

---

## 🚀 Key Competitive Enhancements vs. MovieBox

### 1. 🏆 Comprehensive SEO Dominance
- **JSON-LD Structured Data**:
  - `schema.org/Movie` & `schema.org/TVSeries`: Complete rich snippet attributes including star ratings (`aggregateRating`), release dates, director, cast members, and poster art for Google search carousel ranking.
  - `schema.org/WebSite`: Sitelinks Searchbox (`SearchAction`) integration allowing search engines to expose a direct search bar for MovieBox right in Google search results.
  - `schema.org/BreadcrumbList`: Structured hierarchy (`Home > Movies / TV Series > [Title]`) rendered on all pages.
  - `schema.org/FAQPage`: Embedded high-intent streaming FAQs on watch pages to capture featured snippets and *People Also Ask* queries.
- **Dynamic Multi-Entity Sitemap (`/sitemap.xml`)**:
  - Validated dynamic sitemap auto-discovering all core routes (`/`, `/movies`, `/tv`, `/trending`, `/search`), plus deduplicated dynamic watch URLs (`/watch/movie/[id]` and `/watch/tv/[id]`) with prioritized crawl weights.
- **Search Engine Crawler Directives (`/robots.txt`)**:
  - Full crawler support for Googlebot, Bingbot, and standard bots with sitemap declaration and internal asset shielding.
- **Canonical URLs & OpenGraph / Twitter Cards**:
  - Self-referencing canonical URLs on every page to prevent duplicate content penalties.
  - High-resolution OpenGraph banners (`1200x630`) and Twitter cards for viral social sharing.

---

### 2. 🎬 Streaming & UX Capabilities
- **Multi-Server Playback Engine**:
  - Instant server switcher (`Alpha`, `Bravo`, `Charlie`, etc.) powered by VidLink, Videasy, VidSrc, VidNest, and Rive providers.
- **Embedded Official Trailer Modal**:
  - Direct pop-up player for official YouTube trailers without leaving the viewing page.
- **Interactive Watchlist / Bookmarks (`/watchlist`)**:
  - Client-side persistence via `localStorage` allowing users to save movies and TV shows for quick access without requiring registration.
- **Cast & Crew Directory**:
  - Visual cast lineup with profile photos and character names.
- **Full TV Season & Episode Navigator**:
  - Smooth multi-season horizontal scroll bar and responsive episode selection grid.
- **Live Search & Suggestions Dropdown**:
  - Real-time debounced search bar with thumbnail previews and a dedicated search page (`/search?q=...`).
- **Dedicated Hub Routes**:
  - `/movies`: Discover Popular, Top Rated, and Trending Cinema.
  - `/tv`: Explore TV Series, anime, and mini-series.
  - `/trending`: Unified feed of today's most streamed titles.
- **PWA & "Download App" Modal**:
  - Step-by-step installation guides for Android APK/PWA, iOS Safari (*Add to Home Screen*), and Desktop Chrome.
  - Native Web App Manifest (`/manifest.webmanifest`).

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
- **UI Library**: [Material UI (MUI v9)](https://mui.com/) & [Emotion](https://emotion.sh/)
- **State & Data**: [Axios](https://axios-http.com/) with TMDB API integration + Built-in offline fallback catalog
- **Progress Bar**: [NextTopLoader](https://github.com/TheSGJ/nextjs-toploader)
- **Analytics**: Google Analytics tag support (`@next/third-parties/google`)

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables (Optional)
Create a `.env.local` file in the root directory:
```env
# TMDB API Read Access Token (v4) OR API Key (v3)
TMDB_TOKEN=your_tmdb_bearer_token_here
# or
TMDB_API_KEY=your_tmdb_api_key_here
```
> **Note**: Even without an API key, MovieBox Clone includes a built-in curated fallback catalog so the application and build process work out of the box.

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 🗺️ Project Structure

```
├── app/
│   ├── layout.js               # Global root layout, WebSite JSON-LD, metadata
│   ├── page.js                 # Homepage with hero slider and category grids
│   ├── movies/page.js          # Dedicated Movies directory
│   ├── tv/page.js              # Dedicated TV Series directory
│   ├── trending/page.js        # Trending Today media feed
│   ├── search/page.js          # Search results page
│   ├── watchlist/page.js       # Saved user bookmarks
│   ├── watch/[type]/[id]/      # Dynamic watch page with Movie/TV JSON-LD & FAQ schema
│   ├── sitemap.js              # Dynamic XML sitemap generator
│   ├── robots.js               # Dynamic robots.txt generator
│   └── manifest.js             # Web App Manifest (PWA)
├── components/
│   ├── AppLayoutClient.js      # App bar, live search, sidebar navigation, download modal
│   ├── HeroBanner.js           # Animated hero banner with "Watch Now" action & autoplay
│   ├── MovieCard.js            # Responsive movie card with hover effects & fallback art
│   ├── MoviePlayerDisplay.js   # Embed player, server switcher, trailer modal, cast, FAQs
│   └── MovieGridDisplay.js     # Categorized content rows with category links
├── config/
│   └── providers.js            # Video stream provider configurations & embed URL generators
├── lib/
│   ├── tmdb.js                 # TMDB API client, search, endpoints & resilient fallback catalog
│   ├── metadata.js             # Canonical URL, OpenGraph, and SEO metadata generators
│   └── schema.js               # JSON-LD Schema generators (Movie, TV, WebSite, Breadcrumbs, FAQs)
└── public/
    ├── fallback-poster.svg     # Clean fallback poster art
    └── og-default-banner.svg   # Social sharing OpenGraph banner
```
