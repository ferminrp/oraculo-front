# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application that displays prediction markets related to Argentina from the Oraculo.ar API. The project is optimized for **zero-cost deployment** by using static export and client-side rendering.

## Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production (generates static export in /out)
npm run build

# Run linting
npm run lint

# Start production server (after build)
npm start
```

## Architecture & Cost Optimization

### Zero-Cost Strategy
This application is designed to incur **$0 in hosting costs**. All key architectural decisions prioritize this:

1. **Client-Side Rendering Only**: All pages use `'use client'` directive. API calls are made from the browser, not the server.
2. **Static Export**: `next.config.ts` is configured with `output: 'export'` to generate static HTML/CSS/JS files.
3. **No Image Optimization**: Uses native `<img>` tags instead of Next.js `<Image>` component to avoid Vercel's image optimization costs.
4. **No Server-Side Features**: No SSR, no API routes, no server components, no Edge Functions.

### Data Flow

```
Browser (Client Component)
    ↓
Direct fetch to https://api.oraculo.ar/api/curated/events
Direct fetch to https://data912.com/live/usa_adrs (for ADRs)
Direct fetch to https://data912.com/live/arg_bonds (for bonds)
    ↓
Event data with nested markets + ADR quotes + Bond quotes
    ↓
ADRTicker → BondTicker → EventCard components → MarketCard components
```

- **API Endpoints**:
  - `/events` - Returns events with nested markets array
  - `/markets` - Returns standalone markets
  - `https://data912.com/live/usa_adrs` - Real-time ADR quotes (external API)
  - `https://data912.com/live/arg_bonds` - Real-time Argentine bond quotes (external API)

- **Data Structure**:
  - Events group related markets under a theme
  - Markets contain `outcomes` and `outcomePrices` as JSON strings that need parsing
  - Many fields are optional (icon, image, groupItemTitle, etc.)

### Key Implementation Details

**Client Components**: The main page (`src/app/page.tsx`) uses `useEffect` to fetch data on mount. Always check for optional fields before parsing JSON strings.

**Image Handling**: All images use standard `<img>` tags with full URLs from `polymarket-upload.s3.us-east-2.amazonaws.com`. Never use Next.js `<Image>` component as it triggers costly optimization.

**Type Safety**:
- `src/types/market.ts` defines all Polymarket API response types. Note that `outcomes` and `outcomePrices` are JSON string arrays, not native arrays.
- `src/types/adr.ts` defines types for ADR quotes from data912.com API
- `src/types/bond.ts` defines types for Argentine bond quotes from data912.com API

**API Integration**:
- Helper functions in `src/lib/api.ts` use plain `fetch()` with no caching options for Polymarket data
- `src/lib/adrs.ts` handles ADR quotes with automatic filtering by whitelist and sorting by price change
- `src/lib/bonds.ts` handles bond quotes with automatic filtering by whitelist and sorting by price change
- All caching happens in the browser naturally

**ADR Component**:
- `src/components/ADRTicker.tsx` displays real-time Argentine ADR prices
- Auto-refreshes every 30 seconds (configurable in `src/config/adrs.ts`)
- Whitelisted symbols configured in `src/config/adrs.ts` (CEPU, SUPV, BMA, PAM, EDN, GGAL, BBAR, VIST, YPF, IRS)
- Uses logo.dev for company logos with fallback on error
- Sorted by percentage change (highest to lowest)

**Bond Component**:
- `src/components/BondTicker.tsx` displays real-time Argentine sovereign bond prices
- Auto-refreshes every 30 seconds (configurable in `src/config/bonds.ts`)
- Whitelisted symbols configured in `src/config/bonds.ts` (AL30D, AL29D, GD30D, AL35D, GD35D, AE38D)
- Uses Argentine flag icon from Wikimedia Commons for all bonds
- Sorted by percentage change (highest to lowest)

## Critical Rules

- **Never** add server-side rendering or server components
- **Never** use `next/image` or any image optimization features
- **Never** add API routes or server-side functionality
- **Never** add caching with `next: { revalidate }` or similar server options
- **Never** remove `output: 'export'` from `next.config.ts`
- **Always** use `'use client'` for any component that uses hooks or browser APIs
- **Always** handle optional fields when parsing Market data (outcomes, outcomePrices, icons, etc.)

## Technology Stack

- Next.js 15.5.4 with Turbopack
- React 19.1.0
- TypeScript 5
- Tailwind CSS 4
- No additional dependencies (keep it minimal)
