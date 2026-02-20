# Foxy's Lab

A modern, high-performance website for the Foxy's Lab YouTube channel, built with Next.js 15 and focused on accessibility, performance, and user experience.

## 🚀 Features

- **Modern Tech Stack**: Built with Next.js 15, React 19, TypeScript, and CSS Modules
- **Performance Optimized**: Server-side rendering, image optimization, and efficient code splitting
- **Fully Accessible**: WCAG 2.1 AA compliant with semantic HTML and ARIA labels
- **SEO Ready**: Dynamic metadata, sitemaps, and structured data
- **Responsive Design**: Mobile-first approach with beautiful dark theme
- **YouTube Integration**: Ready for YouTube Data API integration

## 🎨 Design System

The site uses a custom dark theme with the following color palette:

- **Primary**: `#d32365` (Pink/Magenta)
- **Secondary**: `#32002d` (Dark Purple)
- **Accent Yellow**: `#ffe868`
- **Accent Orange**: `#df5a13`

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Copy the environment variables:

```bash
cp .env.example .env
```

4. Add your YouTube API key to `.env`:

```
YOUTUBE_API_KEY=your_api_key_here
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

### Build

Create a production build:

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## 📁 Project Structure

```
├── app/                  # Next.js App Router pages
│   ├── layout.tsx       # Root layout with navigation
│   ├── page.tsx         # Homepage
│   ├── videos/          # Videos page
│   ├── about/           # About page
│   ├── globals.css      # Global styles
│   ├── sitemap.ts       # Dynamic sitemap
│   ├── robots.ts        # Robots.txt
│   └── manifest.ts      # PWA manifest
├── components/          # React components
│   ├── Navigation.tsx   # Main navigation
│   ├── Footer.tsx       # Site footer
│   ├── VideoCard.tsx    # Video display component
│   └── Newsletter.tsx   # Newsletter signup
├── lib/                 # Utility functions
│   └── youtube.ts       # YouTube API utilities
├── types/               # TypeScript type definitions
│   └── youtube.ts       # YouTube data types
└── public/             # Static assets
    └── images/         # Image files
```

## 🔧 Configuration

### Styling (CSS Modules)

Design tokens are defined as CSS custom properties in `app/globals.css`. Each component has a co-located `styles.module.css`. Global utilities include:

- `.gradient-primary` - Primary gradient background
- `.gradient-text` - Gradient text effect
- `.container` / `.container-md` - Page wrappers
- `.btn-primary` / `.btn-outline` - Shared button styles

### Next.js

Key configurations in `next.config.ts`:

- Image optimization for YouTube thumbnails
- ESLint configuration

## 🎯 YouTube API Integration

The site is ready for YouTube Data API integration. To use real data:

1. Get an API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Add it to your `.env` file
3. Update the `getLatestVideos()` function in `lib/youtube.ts`

Example API endpoint:
```
https://www.googleapis.com/youtube/v3/search?key=YOUR_API_KEY&channelId=YOUR_CHANNEL_ID&part=snippet,id&order=date&maxResults=20
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Other Platforms

The site can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Digital Ocean

## 📈 Performance

The site is optimized for:

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Excellent scores
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic route-based splitting

## ♿ Accessibility

- Semantic HTML5 elements
- ARIA labels and landmarks
- Keyboard navigation support
- Screen reader friendly
- Color contrast compliance (WCAG AA)

## 📝 License

This project is proprietary and owned by Foxy's Lab.

## 🤝 Contributing

This is a personal project for the Foxy's Lab YouTube channel. However, if you find bugs or have suggestions, feel free to open an issue.

## 📧 Contact

- YouTube: [@foxyslab](https://www.youtube.com/@foxyslab)
- Twitter: [@foxyslab](https://twitter.com/foxyslab)
- GitHub: [@foxleigh81](https://github.com/foxleigh81)

---

Built with ❤️ by Foxy's Lab
