# Shakham Project

A full-stack application with React + Vite frontend and Express backend.

## Prerequisites

- Node.js (v18 or higher)
- npm (Node Package Manager)

## Project Structure

```
shakham/
├── client/          # React + Vite frontend
├── server/          # Express backend
└── package.json     # Root package.json for concurrent execution
```

## Quick Start

1. **Install Dependencies**

   Install all dependencies for client, server, and root project:
   ```bash
   npm run install-all
   ```

2. **Environment Setup**

   Create `.env` file in the server directory:
   ```
   PORT=5000
   ```

3. **Start Development Server**

   Run both frontend and backend concurrently:
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend at: `http://localhost:5173`
   - Backend at: `http://localhost:5000`

## Available Scripts

- `npm run dev` - Start both client and server in development mode
- `npm run client` - Start only the frontend
- `npm run server` - Start only the backend
- `npm run install-all` - Install dependencies for client, server, and root project

## Tech Stack

### Frontend
- React
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui

### Backend
- Express.js
- Node.js
- CORS enabled
