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

# Sentry

These examples should be used as guidance when configuring Sentry functionality within a project.

# Exception Catching

Use `Sentry.captureException(error)` to capture an exception and log the error in Sentry.
Use this in try catch blocks or areas where exceptions are expected

# Tracing Examples

Spans should be created for meaningful actions within an applications like button clicks, API calls, and function calls
Use the `Sentry.startSpan` function to create a span
Child spans can exist within a parent span

## Custom Span instrumentation in component actions

The `name` and `op` properties should be meaninful for the activities in the call.
Attach attributes based on relevant information and metrics from the request

```javascript
function TestComponent() {
  const handleTestButtonClick = () => {
    // Create a transaction/span to measure performance
    Sentry.startSpan(
      {
        op: "ui.click",
        name: "Test Button Click",
      },
      (span) => {
        const value = "some config";
        const metric = "some metric";

        // Metrics can be added to the span
        span.setAttribute("config", value);
        span.setAttribute("metric", metric);

        doSomething();
      }
    );
  };

  return (
    <button type="button" onClick={handleTestButtonClick}>
      Test Sentry
    </button>
  );
}
```

## Custom span instrumentation in API calls

The `name` and `op` properties should be meaninful for the activities in the call.
Attach attributes based on relevant information and metrics from the request

```javascript
async function fetchUserData(userId) {
  return Sentry.startSpan(
    {
      op: "http.client",
      name: `GET /api/users/${userId}`,
    },
    async () => {
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();
      return data;
    }
  );
}
```

# Logs

Where logs are used, ensure Sentry is imported using `import * as Sentry from "@sentry/nextjs"`
Enable logging in Sentry using `Sentry.init({  enableLogs: true })`
Reference the logger using `const { logger } = Sentry`
Sentry offers a consoleLoggingIntegration that can be used to log specific console error types automatically without instrumenting the individual logger calls

## Configuration

In NextJS the client side Sentry initialization is in `instrumentation-client.(js|ts)`, the server initialization is in `sentry.server.config.ts` and the edge initialization is in `sentry.edge.config.ts`
Initialization does not need to be repeated in other files, it only needs to happen the files mentioned above. You should use `import * as Sentry from "@sentry/nextjs"` to reference Sentry functionality

### Baseline

```javascript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  enableLogs: true,
});
```

### Logger Integration

```javascript
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  integrations: [
    // send console.log, console.warn, and console.error calls as logs to Sentry
    Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
  ],
});
```

## Logger Examples

`logger.fmt` is a template literal function that should be used to bring variables into the structured logs.

```javascript
logger.trace("Starting database connection", { database: "users" });
logger.debug(logger.fmt`Cache miss for user: ${userId}`);
logger.info("Updated profile", { profileId: 345 });
logger.warn("Rate limit reached for endpoint", {
  endpoint: "/api/results/",
  isEnterprise: false,
});
logger.error("Failed to process payment", {
  orderId: "order_123",
  amount: 99.99,
});
logger.fatal("Database connection pool exhausted", {
  database: "users",
  activeConnections: 100,
});
```

## Future Enhancements

- Add newsletter service integration (Mailchimp, ConvertKit)
- Implement video filtering and pagination
- Set up testing (Vitest, Playwright)
- Add CI/CD pipeline
- Implement rate limiting for forms
