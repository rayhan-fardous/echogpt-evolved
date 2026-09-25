# EchoGPT Evolved

A redesigned, modern, and accessible AI conversational workspace for writing, analysis, and creative work.

## Overview

EchoGPT Evolved improves the overall UI/UX of EchoGPT with a calm, glassmorphic design system, responsive navigation, thread persistence with Supabase, dynamic AI response interactions, and customizable themes.

### Key Features
- **Modern Workspace UI**: Clean glassmorphism styling (`glass-panel`), soft grid backgrounds (`soft-grid`), and typography with DM Sans & Space Grotesk.
- **Thread & Chat Management**: Organized conversation history, fast search filtering, starter prompts, and dynamic routing (`/` and `/chat/[threadId]`).
- **Interactive AI Feed**: Fluid conversation flow with message actions (copy response, status shimmer, stick-to-bottom auto-scroll).
- **Responsive Navigation**: Desktop sidebar paired with a mobile slide-out navigation sheet.
- **Dark & Light Mode**: Built-in theme toggling preserving accessibility and high-contrast tokens.
- **Authentication Ready**: Supabase integration supporting email auth, Google OAuth, and session persistence.
- **Studio Tools**: Fast shortcuts for Image Studio, Video Studio (Pro), and Archived chats.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, tw-animate-css
- **Components & Icons**: Radix UI primitives, Lucide React
- **Backend / Database**: Supabase

## Getting Started

### 1. Install dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Configure Environment Variables
Copy or verify `.env`:
```env
NEXT_PUBLIC_SUPABASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your-publishable-key"
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```
