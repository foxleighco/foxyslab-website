# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Foxy's Lab - A modern Next.js 15 website for a YouTube channel focused on smart home technology and tech education. Built with TypeScript, Tailwind CSS, and optimized for performance and accessibility.

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
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

### Tailwind Utilities
- `gradient-primary`: Primary gradient background (primary → orange)
- `gradient-text`: Gradient text effect (primary → yellow)
- Custom focus indicators: `outline-2 outline-offset-2 outline-primary`

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
├── loading.tsx         # Global loading state
├── error.tsx           # Global error boundary
├── not-found.tsx       # 404 page
├── videos/
│   └── page.tsx        # Videos gallery page
└── about/
    └── page.tsx        # About page
```

### Components
```
components/
├── Navigation.tsx      # Main navigation (server component)
├── MobileMenu.tsx      # Mobile menu (client component)
├── Footer.tsx          # Site footer with links
├── VideoCard.tsx       # YouTube video display
└── Newsletter.tsx      # Email signup form
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
- Tailwind for utility classes
- Custom CSS in `app/globals.css` for global styles
- CSS variables in :root for design tokens
- Mobile-first responsive breakpoints

## Future Enhancements

- Implement real YouTube API integration
- Add newsletter service integration (Mailchimp, ConvertKit)
- Implement video filtering and pagination
- Add analytics (Google Analytics, Plausible)
- Set up testing (Vitest, Playwright)
- Add CI/CD pipeline
- Implement rate limiting for forms
