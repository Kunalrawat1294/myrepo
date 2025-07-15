# Explore The World

A React + Express full-stack application that provides an educational experience for users to discover random countries and learn about them through rich, interactive content.

## Features

- Random country discovery with interactive wheel
- Rich country information from REST Countries API
- Wikipedia summaries for educational content
- Beautiful image galleries from Unsplash
- AI-generated descriptions for landmarks, cuisine, and culture
- User authentication and profiles
- Country reviews and ratings system
- Responsive design with Tailwind CSS

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` with your actual values.

3. Set up the database:
```bash
npm run db:push
```

4. Start the development server:
```bash
npm run dev
```

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `VITE_UNSPLASH_ACCESS_KEY`: Unsplash API key for images
- `VITE_OPENAI_API_KEY`: OpenAI API key for AI descriptions
- `SESSION_SECRET`: Secret for session management
- `REPLIT_DOMAINS`: Domains for Replit Auth (optional for local dev)

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Shadcn/ui
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **APIs**: REST Countries, Wikipedia, Unsplash, OpenAI
- **Build**: Vite, ESBuild

## Development

The app runs on port 5000 and serves both the API and client.

For production deployment, run:
```bash
npm run build
npm start
```