# Kachra League - Fantasy Football Platform

A modern fantasy football betting platform built with React, TypeScript, and Vite.

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6.2 (with fast refresh)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Routing**: React Router DOM
- **Database**: Supabase
- **AI Integration**: Google Gemini API

## 📋 Prerequisites

- **Node.js** (version 18 or higher)
- **npm** (included with Node.js)
- **Supabase Account** (for database)
- **Google Gemini API Key** (for AI features)

## 🚀 Quick Start

### 1. Clone and Install Dependencies

```bash
# Install dependencies
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory and add your environment variables:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

**Note**: Also update the Supabase credentials in `src/supabaseCredentials.ts` with your actual Supabase URL and key.

### 3. Development Server

```bash
# Start the development server
npm run dev
```

The app will open automatically in your browser at `http://localhost:3000`.

## 📜 Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Type checking (without compilation)
npm run lint
```

## 🏗️ Project Structure

```
├── public/                 # Static assets
├── src/                   # Source code
│   ├── components/        # React components (all in src/)
│   ├── types.ts          # TypeScript type definitions
│   ├── constants.tsx     # App constants
│   ├── supabaseClient.ts # Database client
│   ├── AppContext.tsx    # Global state management
│   ├── index.tsx         # Main entry point
│   ├── index.css         # Global styles
│   └── App.tsx           # Root component
├── index.html            # HTML template
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies and scripts
```

## ⚡ Vite Optimizations

This project includes several Vite optimizations:

- **Fast Refresh**: Instant hot reloading for React components
- **Code Splitting**: Automatic vendor and feature-based chunk splitting
- **Tree Shaking**: Eliminates unused code in production builds
- **Dependency Pre-bundling**: Optimizes third-party dependencies
- **Source Maps**: Enabled for better debugging experience

### Chunk Strategy

The build process automatically splits code into optimized chunks:
- `vendor`: React and React DOM
- `router`: React Router DOM
- `motion`: Framer Motion
- `supabase`: Supabase client
- `genai`: Google Gemini AI

## 🔧 Development Features

- **TypeScript Support**: Full type checking and IntelliSense
- **Path Aliases**: Use `@/` to import from the src directory
- **ESLint Integration**: Code quality checks
- **Hot Module Replacement**: Instant updates without page refresh
- **Environment Variables**: Automatic loading of `.env.local`

## 🌟 Key Features

- **Fantasy Team Management**: Create and manage fantasy football teams
- **Live Betting**: Real-time betting on match outcomes
- **Market System**: Player trading and market dynamics
- **Analytics Dashboard**: Comprehensive performance analytics
- **Leaderboards**: Multiple ranking systems
- **Admin Panel**: Administrative tools and controls
- **Database Setup**: Automated database configuration

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The optimized build will be created in the `dist/` directory.

### Deploy to Static Hosting

The built application can be deployed to any static hosting service:

- **Vercel**: `npm i -g vercel && vercel`
- **Netlify**: Drag and drop the `dist/` folder
- **GitHub Pages**: Configure with GitHub Actions
- **Cloudflare Pages**: Connect your repository

### Environment Variables for Production

Make sure to set your environment variables in your hosting platform:

```
GEMINI_API_KEY=your_production_api_key
```

## 🔒 Security Notes

- Never commit API keys or sensitive credentials to version control
- Use environment variables for all sensitive configuration
- Update Supabase credentials in `src/supabaseCredentials.ts` for your instance
- Consider implementing proper authentication and authorization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes
4. Run the linter: `npm run lint`
5. Build the project: `npm run build`
6. Commit your changes: `git commit -m 'Add new feature'`
7. Push to the branch: `git push origin feature/new-feature`
8. Submit a pull request

## 📝 License

This project is private and proprietary.

---

For support or questions, please contact the development team.
