# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Foxy's Lab - A modern Next.js 15 website for a YouTube channel focused on smart home technology and tech education. Built with TypeScript, CSS Modules, and optimized for performance and accessibility.

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: CSS Modules + global CSS (`app/globals.css`)
- **Fonts**: Inter (Google Fonts)
- **Package Manager**: npm

## Common Commands

### Development
```bash
npm run dev          # Start development server on http://localhost:3000
npm run build        # Create production build
npm start            # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

### Important Notes
- The directory name contains special characters (`Foxy's Lab`) which can cause issues with Next.js dynamic metadata files (sitemap.ts, robots.ts, manifest.ts)
- Static files (robots.txt, sitemap.xml, manifest.webmanifest) are in the `public/` directory instead
- All builds complete successfully with static pre-rendering

## Design System

### Color Palette
- Primary: `#d32365` (pink/magenta)
- Secondary: `#32002d` (dark purple)
- Accent Yellow: `#ffe868`
- Accent Orange: `#df5a13`

### Global Utilities (in `app/globals.css`)
- `.gradient-primary`: Primary gradient background (primary → orange)
- `.gradient-text`: Gradient text effect (primary → yellow)
- `.container` / `.container-md`: Shared page wrapper with max-width and padding
- `.btn-primary` / `.btn-outline`: Shared button styles
- `.sr-only`: Screen-reader-only text
- `.text-balance`: Balanced text wrapping
- `.prose`: Markdown content styling system (for blog innerHTML)
- Custom focus indicators: `outline: 2px solid var(--primary); outline-offset: 2px`

### Design Principles
- Dark color scheme
- Mobile-first responsive design
- WCAG 2.1 AA accessibility compliance
- Performance-optimized images with Next.js Image component

## Architecture

### App Structure
```
app/
├── layout.tsx           # Root layout with navigation, SEO metadata, structured data
├── page.tsx            # Homepage with hero, featured videos, features, newsletter
├── globals.css         # Global styles, design tokens, shared utilities
├── styles.module.css   # Homepage-specific styles
├── loading.tsx         # Global loading state
├── error.tsx           # Global error boundary
├── not-found.tsx       # 404 page
├── videos/
│   └── page.tsx        # Videos gallery page
├── blog/
│   ├── page.tsx        # Blog listing page
│   └── [slug]/
│       └── page.tsx    # Individual blog post
├── about/
│   └── page.tsx        # About page
└── enquiries/
    └── page.tsx        # Enquiries/contact page
```

### Components
Each component lives in its own folder with `index.tsx` + `styles.module.css`:
```
components/
├── Navigation/         # Main navigation (server component)
├── MobileMenu/         # Mobile menu (client component)
├── Footer/             # Site footer with links
├── VideoCard/          # YouTube video display
├── Newsletter/         # Email signup form
├── PlaylistFilter/     # Playlist pill filter (client component)
├── EnquiryForm/        # Contact form (client component)
├── TransparentVideo/   # WebM video player (client component)
└── blog/
    ├── FeedItem/       # Blog feed wrapper
    ├── PostCard/       # Blog post card
    └── TableOfContents/ # TOC sidebar (client component)
```

### Utilities
```
lib/
├── youtube.ts          # YouTube API utilities (currently mock data)
├── validation.ts       # Input validation and sanitization
└── structured-data.ts  # JSON-LD schema.org data
```

## Key Features

### Performance
- Static pre-rendering for all pages
- Optimized images with width/height attributes
- Code splitting and lazy loading
- Server components by default, client components only when needed

### Accessibility
- Skip-to-main-content link
- Semantic HTML5 elements
- ARIA labels and landmarks
- Keyboard navigation support
- Focus indicators on all interactive elements
- Screen reader announcements (aria-live regions)

### SEO
- Metadata in layout.tsx with metadataBase
- Open Graph and Twitter cards
- JSON-LD structured data (Organization, WebSite)
- Sitemap (public/sitemap.xml)
- Robots.txt (public/robots.txt)
- Web manifest (public/manifest.webmanifest)

### Security
- Content Security Policy headers
- X-Frame-Options: DENY
- Input validation and sanitization
- Environment variable validation for production
- External links use rel="noopener noreferrer"

## YouTube Integration

Currently using mock data in `lib/youtube.ts`. To integrate with YouTube Data API v3:

1. Get API key from Google Cloud Console
2. Add to `.env`: `YOUTUBE_API_KEY=your_key`
3. Replace mock data functions in `lib/youtube.ts` with API calls
4. Update channel ID constant

## Important Patterns

### Component Split
- Navigation is a server component
- MobileMenu is a client component (uses useState)
- This pattern optimizes performance while maintaining interactivity

### Error Handling
- Global error boundary in `app/error.tsx`
- Loading states in `app/loading.tsx`
- 404 handling in `app/not-found.tsx`

### Styling
- **CSS Modules** (`styles.module.css`) for component/page-scoped styles
- **Global CSS** in `app/globals.css` for shared utilities, design tokens, and resets
- CSS custom properties in `:root` for design tokens (`--primary`, `--secondary`, `--accent-yellow`, `--accent-orange`)
- Mobile-first responsive breakpoints (640px, 768px, 1024px)
- Compose global + module classes: `className={`${styles.heading} gradient-text`}`
- Conditional classes: `className={`${styles.pill} ${isActive ? styles.active : styles.inactive}`}`

## Future Enhancements

- Implement real YouTube API integration
- Add newsletter service integration (Mailchimp, ConvertKit)
- Implement video filtering and pagination
- Add analytics (Google Analytics, Plausible)
- Set up testing (Vitest, Playwright)
- Add CI/CD pipeline
- Implement rate limiting for forms
