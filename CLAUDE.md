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
    ↓
Event data with nested markets
    ↓
EventCard components → MarketCard components
```

- **API Endpoints**:
  - `/events` - Returns events with nested markets array
  - `/markets` - Returns standalone markets (not currently used)

- **Data Structure**:
  - Events group related markets under a theme
  - Markets contain `outcomes` and `outcomePrices` as JSON strings that need parsing
  - Many fields are optional (icon, image, groupItemTitle, etc.)

### Key Implementation Details

**Client Components**: The main page (`src/app/page.tsx`) uses `useEffect` to fetch data on mount. Always check for optional fields before parsing JSON strings.

**Image Handling**: All images use standard `<img>` tags with full URLs from `polymarket-upload.s3.us-east-2.amazonaws.com`. Never use Next.js `<Image>` component as it triggers costly optimization.

**Type Safety**: `src/types/market.ts` defines all API response types. Note that `outcomes` and `outcomePrices` are JSON string arrays, not native arrays.

**API Integration**: Helper functions in `src/lib/api.ts` use plain `fetch()` with no caching options. All caching happens in the browser naturally.

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
