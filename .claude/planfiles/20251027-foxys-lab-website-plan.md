# Project: Foxy's Lab YouTube Channel Website

## Overview

Build a high-performance, accessible Next.js 15 website for the Foxy's Lab YouTube channel, featuring dark contemporary design with YouTube API integration, optimized for tech education content delivery and community engagement.

## Critical Considerations

### Security

- Secure API key management using environment variables
- Implementation of Content Security Policy headers
- Rate limiting for API endpoints
- CORS configuration for external resource access
- Input sanitization for newsletter signup forms
- Protection against XSS in dynamic content rendering
- Secure cookie configuration for analytics/preferences

### Performance

- Target Lighthouse score of 95+ across all metrics
- Implement ISR (Incremental Static Regeneration) for video content
- Image optimization with Next.js Image component and blur placeholders
- Code splitting and lazy loading for non-critical components
- Edge runtime for API routes where applicable
- CDN strategy for static assets
- Bundle size optimization (target < 200KB initial JS)
- YouTube API response caching strategy

### Accessibility

- WCAG 2.1 AA compliance minimum
- Full keyboard navigation support
- Proper ARIA labels for all interactive elements
- Skip navigation links
- Focus management for route transitions
- Color contrast ratio of 4.5:1 minimum (7:1 for small text)
- Screen reader optimized video galleries
- Reduced motion preferences support

## Technology Stack

### Core Framework

- **Next.js 15.0+** with App Router
- **TypeScript 5.3+** with strict mode
- **React 19** (or latest stable)
- **Node.js 20 LTS**

### Styling & UI

- **Tailwind CSS 3.4+** with custom configuration
- **Radix UI** for accessible primitives
- **Framer Motion** for animations
- **next-themes** for dark mode management
- **lucide-react** for icons

### Data & State

- **TanStack Query v5** for server state
- **Zustand** for client state (if needed)
- **Zod** for schema validation

### Development & Quality

- **ESLint** with Next.js config
- **Prettier** for formatting
- **Husky** + **lint-staged** for pre-commit hooks
- **Vitest** for unit testing
- **Playwright** for E2E testing
- **Storybook** for component development

### Infrastructure

- **Vercel** for deployment (optimized for Next.js)
- **YouTube Data API v3** for video content
- **Resend** or **SendGrid** for newsletter
- **Vercel Analytics** for performance monitoring
- **Sentry** for error tracking

## File Structure

```
/Users/foxleigh81/dev/internal/Foxy's Lab/
├── .claude/
│   └── planfiles/
├── public/
│   ├── images/
│   │   ├── background.png
│   │   ├── foxys-lab-logo-round.png
│   │   └── og/
│   ├── fonts/
│   └── robots.txt
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── not-found.tsx
│   │   ├── error.tsx
│   │   ├── globals.css
│   │   ├── videos/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── newsletter/
│   │   │   └── page.tsx
│   │   └── api/
│   │       ├── youtube/
│   │       │   └── route.ts
│   │       └── newsletter/
│   │           └── route.ts
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── [other primitives]
│   │   ├── layout/
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── navigation.tsx
│   │   │   └── mobile-menu.tsx
│   │   ├── features/
│   │   │   ├── video-grid.tsx
│   │   │   ├── video-card.tsx
│   │   │   ├── newsletter-form.tsx
│   │   │   ├── social-links.tsx
│   │   │   └── youtube-player.tsx
│   │   └── common/
│   │       ├── seo.tsx
│   │       ├── loading-skeleton.tsx
│   │       └── error-boundary.tsx
│   ├── lib/
│   │   ├── youtube.ts
│   │   ├── newsletter.ts
│   │   ├── utils.ts
│   │   └── constants.ts
│   ├── hooks/
│   │   ├── use-youtube-videos.ts
│   │   ├── use-intersection-observer.ts
│   │   └── use-media-query.ts
│   ├── types/
│   │   ├── youtube.ts
│   │   └── global.d.ts
│   └── styles/
│       └── design-tokens.css
├── tests/
│   ├── unit/
│   └── e2e/
├── .env.example
├── .env.local
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## Task Breakdown

### Phase 1: Project Setup and Configuration

#### Task 1.1: Initialize Next.js Project with TypeScript

- **Assigned to**: setup-agent
- **Priority**: Critical
- **Dependencies**: None
- **Acceptance Criteria**:
  - [ ] Next.js 15 with App Router initialized
  - [ ] TypeScript configured with strict mode
  - [ ] ESLint and Prettier configured
  - [ ] Git repository initialized with .gitignore
  - [ ] Move existing image assets to public/images
- **Implementation Notes**: Use `npx create-next-app@latest` with TypeScript, Tailwind, and App Router options

#### Task 1.2: Configure Development Environment

- **Assigned to**: setup-agent
- **Priority**: Critical
- **Dependencies**: Task 1.1
- **Acceptance Criteria**:
  - [ ] Environment variables structure defined (.env.example)
  - [ ] Husky pre-commit hooks configured
  - [ ] VS Code settings and extensions recommended
  - [ ] Development scripts in package.json
- **Implementation Notes**: Include YOUTUBE_API_KEY, NEWSLETTER_API_KEY placeholders

#### Task 1.3: Setup Tailwind with Custom Design System

- **Assigned to**: frontend-agent
- **Priority**: High
- **Dependencies**: Task 1.1
- **Acceptance Criteria**:
  - [ ] Custom color palette configured (#d32365, #32002d, #ffe868, #df5a13)
  - [ ] Dark mode as default with system preference detection
  - [ ] Custom font configuration (Inter or similar)
  - [ ] Responsive breakpoints defined
  - [ ] Animation utilities configured
- **Implementation Notes**: Extend Tailwind config with custom colors and create CSS custom properties

### Phase 2: Core Infrastructure

#### Task 2.1: Implement Base Layout Components

- **Assigned to**: frontend-agent
- **Priority**: Critical
- **Dependencies**: Task 1.3
- **Acceptance Criteria**:
  - [ ] Root layout with metadata configuration
  - [ ] Header with navigation (responsive)
  - [ ] Footer with social links and copyright
  - [ ] Mobile menu with hamburger animation
  - [ ] Skip to content link for accessibility
- **Implementation Notes**: Use Radix UI for accessible navigation primitives

#### Task 2.2: Setup YouTube API Integration

- **Assigned to**: backend-agent
- **Priority**: Critical
- **Dependencies**: Task 1.2
- **Acceptance Criteria**:
  - [ ] YouTube Data API v3 client configured
  - [ ] Caching strategy implemented (24-hour cache)
  - [ ] Error handling and fallbacks
  - [ ] Rate limiting implementation
  - [ ] Type-safe API responses with Zod
- **Implementation Notes**: Use edge runtime for API routes, implement stale-while-revalidate

#### Task 2.3: Create Reusable UI Components

- **Assigned to**: frontend-agent
- **Priority**: High
- **Dependencies**: Task 1.3
- **Acceptance Criteria**:
  - [ ] Button component with variants
  - [ ] Card component for video display
  - [ ] Input components for forms
  - [ ] Loading skeletons
  - [ ] Error boundary component
- **Implementation Notes**: All components must be keyboard accessible with proper ARIA

### Phase 3: Feature Implementation

#### Task 3.1: Build Homepage

- **Assigned to**: frontend-agent
- **Priority**: Critical
- **Dependencies**: Tasks 2.1, 2.2, 2.3
- **Acceptance Criteria**:
  - [ ] Hero section with channel branding
  - [ ] Featured videos section (latest 3)
  - [ ] About preview section
  - [ ] Newsletter signup CTA
  - [ ] Responsive design for all breakpoints
  - [ ] Loading states and error handling
- **Implementation Notes**: Use background.png for hero, implement parallax if performance allows

#### Task 3.2: Implement Videos Page

- **Assigned to**: frontend-agent
- **Priority**: Critical
- **Dependencies**: Tasks 2.2, 2.3
- **Acceptance Criteria**:
  - [ ] Grid layout for video cards
  - [ ] Pagination or infinite scroll
  - [ ] Search/filter functionality
  - [ ] Category filtering
  - [ ] Responsive grid (1-2-3 columns)
  - [ ] Loading placeholders
- **Implementation Notes**: Implement virtual scrolling for performance with large lists

#### Task 3.3: Create Individual Video Pages

- **Assigned to**: frontend-agent
- **Priority**: High
- **Dependencies**: Task 3.2
- **Acceptance Criteria**:
  - [ ] Embedded YouTube player
  - [ ] Video metadata display
  - [ ] Related videos section
  - [ ] Share functionality
  - [ ] SEO metadata generation
- **Implementation Notes**: Use dynamic OG images, implement structured data for videos

#### Task 3.4: Build About Page

- **Assigned to**: content-agent
- **Priority**: Medium
- **Dependencies**: Task 2.1
- **Acceptance Criteria**:
  - [ ] Channel story section
  - [ ] Equipment/tools showcase
  - [ ] Contact information
  - [ ] Social media links grid
  - [ ] Responsive layout
- **Implementation Notes**: Include schema.org Person markup for SEO

#### Task 3.5: Implement Newsletter Integration

- **Assigned to**: backend-agent
- **Priority**: High
- **Dependencies**: Task 2.3
- **Acceptance Criteria**:
  - [ ] Newsletter signup form with validation
  - [ ] API endpoint for subscription
  - [ ] Success/error states
  - [ ] Double opt-in flow
  - [ ] GDPR compliance checkbox
- **Implementation Notes**: Integrate with Resend or SendGrid, implement honeypot for spam protection

### Phase 4: Performance Optimization

#### Task 4.1: Implement Image Optimization

- **Assigned to**: performance-agent
- **Priority**: High
- **Dependencies**: Phase 3 completion
- **Acceptance Criteria**:
  - [ ] All images using Next.js Image component
  - [ ] Blur placeholders generated
  - [ ] Responsive image sizes configured
  - [ ] WebP/AVIF format support
  - [ ] Lazy loading implemented
- **Implementation Notes**: Generate blur data URLs at build time

#### Task 4.2: Code Splitting and Bundle Optimization

- **Assigned to**: performance-agent
- **Priority**: High
- **Dependencies**: Phase 3 completion
- **Acceptance Criteria**:
  - [ ] Dynamic imports for non-critical components
  - [ ] Route-based code splitting verified
  - [ ] Bundle analyzer configured
  - [ ] Tree shaking verified
  - [ ] Initial bundle < 200KB
- **Implementation Notes**: Use dynamic imports for Framer Motion animations

#### Task 4.3: Implement Caching Strategy

- **Assigned to**: backend-agent
- **Priority**: High
- **Dependencies**: Task 2.2
- **Acceptance Criteria**:
  - [ ] ISR configured for video pages
  - [ ] API response caching
  - [ ] Static asset caching headers
  - [ ] Service worker for offline support
  - [ ] CDN cache purging strategy
- **Implementation Notes**: 1-hour revalidation for video content, 24-hour for channel info

### Phase 5: SEO and Analytics

#### Task 5.1: Implement SEO Optimization

- **Assigned to**: seo-agent
- **Priority**: High
- **Dependencies**: Phase 3 completion
- **Acceptance Criteria**:
  - [ ] Meta tags for all pages
  - [ ] Open Graph images configured
  - [ ] XML sitemap generation
  - [ ] Robots.txt configured
  - [ ] Structured data for videos
  - [ ] Canonical URLs set
- **Implementation Notes**: Use Next.js Metadata API, implement JSON-LD for videos

#### Task 5.2: Setup Analytics and Monitoring

- **Assigned to**: devops-agent
- **Priority**: Medium
- **Dependencies**: Phase 3 completion
- **Acceptance Criteria**:
  - [ ] Vercel Analytics integrated
  - [ ] Core Web Vitals monitoring
  - [ ] Error tracking with Sentry
  - [ ] Custom event tracking
  - [ ] Performance budgets configured
- **Implementation Notes**: Implement privacy-friendly analytics, GDPR compliant

### Phase 6: Testing and Quality Assurance

#### Task 6.1: Implement Unit Tests

- **Assigned to**: qa-agent
- **Priority**: High
- **Dependencies**: Phase 3 completion
- **Acceptance Criteria**:
  - [ ] Component tests with Vitest
  - [ ] Hook tests implemented
  - [ ] Utility function tests
  - [ ] 80% code coverage minimum
  - [ ] Test utilities configured
- **Implementation Notes**: Focus on critical business logic and complex components

#### Task 6.2: Setup E2E Testing

- **Assigned to**: qa-agent
- **Priority**: High
- **Dependencies**: Phase 3 completion
- **Acceptance Criteria**:
  - [ ] Playwright configured
  - [ ] Critical user flows tested
  - [ ] Cross-browser testing
  - [ ] Mobile testing included
  - [ ] CI pipeline integration
- **Implementation Notes**: Test video playback, newsletter signup, navigation flows

#### Task 6.3: Accessibility Audit

- **Assigned to**: accessibility-agent
- **Priority**: Critical
- **Dependencies**: Phase 3 completion
- **Acceptance Criteria**:
  - [ ] WCAG 2.1 AA compliance verified
  - [ ] Keyboard navigation tested
  - [ ] Screen reader testing completed
  - [ ] Color contrast validated
  - [ ] Focus management verified
  - [ ] ARIA implementation reviewed
- **Implementation Notes**: Use axe-core for automated testing, manual testing with NVDA/JAWS

#### Task 6.4: Performance Audit

- **Assigned to**: performance-agent
- **Priority**: High
- **Dependencies**: Phase 4 completion
- **Acceptance Criteria**:
  - [ ] Lighthouse score 95+ on all metrics
  - [ ] Core Web Vitals passing
  - [ ] Bundle size within budget
  - [ ] Load time < 3s on 3G
  - [ ] Time to Interactive < 5s
- **Implementation Notes**: Test on real devices, use WebPageTest for detailed analysis

### Phase 7: Deployment and Launch

#### Task 7.1: Setup Production Environment

- **Assigned to**: devops-agent
- **Priority**: Critical
- **Dependencies**: Phase 6 completion
- **Acceptance Criteria**:
  - [ ] Vercel project configured
  - [ ] Environment variables set
  - [ ] Custom domain configured
  - [ ] SSL certificate active
  - [ ] Preview deployments working
- **Implementation Notes**: Configure production branch protection, setup staging environment

#### Task 7.2: Implement CI/CD Pipeline

- **Assigned to**: devops-agent
- **Priority**: High
- **Dependencies**: Task 7.1
- **Acceptance Criteria**:
  - [ ] GitHub Actions workflow configured
  - [ ] Automated testing on PR
  - [ ] Build verification
  - [ ] Deployment automation
  - [ ] Rollback strategy defined
- **Implementation Notes**: Include performance budget checks in CI

#### Task 7.3: Production Readiness Checklist

- **Assigned to**: lead-agent
- **Priority**: Critical
- **Dependencies**: All previous tasks
- **Acceptance Criteria**:
  - [ ] Security headers configured
  - [ ] Error pages customized
  - [ ] 404 page implemented
  - [ ] Backup strategy defined
  - [ ] Monitoring alerts configured
  - [ ] Documentation complete
- **Implementation Notes**: Implement rate limiting, configure CSP headers

## Risk Assessment

### High Risk

- **YouTube API quota limits**: Could limit video fetching capabilities
  - Mitigation: Implement aggressive caching, consider backup data source
- **Performance degradation with large video libraries**: May impact user experience
  - Mitigation: Virtual scrolling, pagination, edge caching
- **SEO indexing issues with dynamic content**: Could affect discoverability
  - Mitigation: ISR implementation, structured data, sitemap generation

### Medium Risk

- **Third-party service downtime** (YouTube, Newsletter provider): Service disruption
  - Mitigation: Graceful degradation, offline fallbacks, status page
- **Browser compatibility issues**: Particularly with older browsers
  - Mitigation: Progressive enhancement, polyfills where necessary
- **Design system consistency**: Maintaining visual coherence across components
  - Mitigation: Storybook documentation, design tokens, component library

### Mitigation Strategies

1. Implement comprehensive error boundaries and fallback UI
2. Set up automated testing and monitoring from day one
3. Create detailed documentation for all integration points
4. Establish performance budgets and enforce in CI/CD
5. Regular dependency updates and security audits

## Success Metrics

- Lighthouse performance score consistently above 95
- Core Web Vitals in "Good" range for 90% of users
- Zero critical accessibility violations
- Page load time under 3 seconds on 4G networks
- 99.9% uptime for the website
- Successful YouTube API integration with < 0.1% error rate
- Newsletter signup conversion rate > 5%
- SEO: First page ranking for "Foxy's Lab" within 3 months

## Timeline Estimate

- **Total estimated effort**: 120-160 hours
- **Optimal team size**: 3-4 developers
- **Duration with parallel work**: 3-4 weeks

### Critical Path

1. Project Setup (Days 1-2)
2. Core Infrastructure (Days 3-5)
3. Homepage and Videos Implementation (Days 6-10)
4. YouTube API Integration (Days 7-9)
5. Performance Optimization (Days 11-13)
6. Testing and QA (Days 14-17)
7. Deployment Setup (Days 18-19)
8. Final Testing and Launch (Days 20-21)

## Additional Recommendations

### Post-Launch Enhancements

1. Implement A/B testing framework for conversion optimization
2. Add comment system integration (Disqus or custom)
3. Create member-only content area
4. Implement push notifications for new videos
5. Add RSS feed generation
6. Consider implementing AMP pages for mobile performance

### Maintenance Considerations

1. Weekly dependency updates schedule
2. Monthly performance audits
3. Quarterly accessibility reviews
4. Continuous SEO monitoring and optimization
5. Regular backup testing and disaster recovery drills

### Documentation Requirements

1. Complete API documentation
2. Component library documentation in Storybook
3. Deployment and rollback procedures
4. Performance optimization guidelines
5. Content management guidelines for non-technical users
