# replit.md

## Overview

This is a React + Express full-stack application called "Explore The World" that provides an educational experience for users to discover random countries and learn about them through rich, interactive content. The app integrates with multiple external APIs to fetch country data, Wikipedia summaries, and images from Unsplash.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and production builds
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: PostgreSQL session store via connect-pg-simple
- **Development**: Hot reloading with Vite middleware integration

### Build System
- **TypeScript**: Strict mode enabled with path mapping
- **Build Process**: Vite for client, esbuild for server
- **Development**: Integrated Vite dev server with Express
- **Production**: Static assets served by Express

## Key Components

### External API Integrations
1. **REST Countries API** (`https://restcountries.com/v3.1/independent?status=true`)
   - Fetches comprehensive country data including flags, population, capital, languages
   - Provides Google Maps integration links
   - Includes fallback endpoints and sample data for reliability

2. **Wikipedia REST API** (`https://en.wikipedia.org/api/rest_v1/page/summary/{country}`)
   - Retrieves educational summaries about countries
   - Includes historical and cultural information

3. **Unsplash API** (`https://api.unsplash.com/search/photos`)
   - Fetches high-quality images for landmarks, food, and culture
   - Requires API key configuration via environment variables

4. **OpenAI API** (`gpt-4o` model)
   - Generates detailed, engaging descriptions for landmarks, cuisine, and cultural highlights
   - Provides rich educational content to complement images
   - Requires API key configuration via environment variables

### Core Features
1. **Random Country Selection**: Algorithm to randomly select from all available countries
2. **Country Information Display**: Structured presentation of country data
3. **Image Galleries**: Dynamic image loading with fallback handling
4. **User Authentication**: Replit Auth integration for secure user management
5. **User Profiles**: Comprehensive profile system with public/private settings
6. **Review System**: Country reviews with ratings, anonymous posting options
7. **Responsive Design**: Mobile-first approach with Tailwind CSS
8. **Loading States**: Skeleton components and loading indicators
9. **Error Handling**: Graceful error states with user-friendly messages

### UI Components
- **CountryDisplay**: Main component showing country information
- **CountryWheel**: Interactive country selection interface
- **ImageGallery**: Reusable image grid component
- **ReviewForm**: Component for users to submit country reviews with ratings
- **ReviewList**: Component displaying community reviews for countries
- **Profile**: Comprehensive user profile management interface
- **Landing**: Welcome page for non-authenticated users
- **Authentication Components**: Login/logout integration with Replit Auth
- **Custom UI Components**: Extensive shadcn/ui component library

## Data Flow

1. **Initial Load**: App fetches all countries from REST Countries API
2. **Country Selection**: User triggers random country selection or uses country wheel
3. **Data Fetching**: Parallel requests to Wikipedia and Unsplash APIs
4. **State Management**: TanStack Query handles caching, loading states, and error handling
5. **UI Updates**: Components reactively update based on query states

### Type System
- **Country Interface**: Comprehensive typing for REST Countries API response
- **Wikipedia Summary**: Typed interface for Wikipedia API responses
- **Unsplash Images**: Typed interface for Unsplash API responses
- **Shared Types**: Located in `/shared` directory for client-server consistency

## External Dependencies

### API Keys Required
- **Unsplash Access Key**: Required for image fetching
  - Environment variable: `VITE_UNSPLASH_ACCESS_KEY`
  - Fallback environment variables supported

- **OpenAI API Key**: Required for AI-generated descriptions
  - Environment variable: `OPENAI_API_KEY`
  - Used to generate detailed descriptions for landmarks, cuisine, and culture

### Database Configuration
- **PostgreSQL**: Database URL required via `DATABASE_URL` environment variable
- **Drizzle**: ORM with PostgreSQL dialect
- **Migrations**: Located in `/migrations` directory

### Key Libraries
- **UI**: Radix UI primitives, Tailwind CSS, class-variance-authority
- **State**: TanStack Query, React Hook Form
- **Utilities**: date-fns, clsx, zod
- **Development**: Vite, TypeScript, ESBuild

## Deployment Strategy

### Environment Setup
- **Development**: Uses Vite dev server with Express middleware
- **Production**: Builds client to `/dist/public`, server to `/dist`
- **Database**: Supports Neon Database with connection pooling

### Build Process
1. **Client Build**: Vite builds React app to static assets
2. **Server Build**: ESBuild bundles Express server
3. **Type Checking**: TypeScript compilation validation
4. **Database Migration**: Drizzle push command for schema updates

### Performance Optimizations
- **Query Caching**: TanStack Query with stale-while-revalidate strategy
- **Image Optimization**: Progressive loading with fallback states
- **Bundle Splitting**: Vite's automatic code splitting
- **Static Assets**: Served directly by Express in production

### Development Features
- **Hot Reloading**: Both client and server hot reload
- **Error Overlay**: Runtime error modal for development
- **Replit Integration**: Cartographer plugin for Replit environment
- **TypeScript**: Strict type checking with path mapping

The application follows a modern full-stack architecture with emphasis on type safety, performance, and user experience. The external API integrations provide rich educational content while maintaining graceful error handling and loading states.