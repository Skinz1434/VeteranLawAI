# VeteranLawAI Platform

A professional AI-powered legal platform designed exclusively for attorneys representing Veterans in VA disability claims. Built with React, Vite, and Tailwind CSS.

## Features

- **Camera OCR Processing**: AI-powered document digitization and text extraction
- **VA Legal Knowledge Base**: Comprehensive legal database with 14,500+ documents
- **Step-by-Step Claim Guidance**: AI-powered case analysis with evidence gap identification
- **Legal Audio Transcription**: Professional transcription service optimized for legal terminology
- **Case Precedent Research**: Advanced search through 10,000+ legal precedents
- **Claim Success Analytics**: Comprehensive analytics dashboard

## Tech Stack

- **Frontend**: React 18, Vite
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Build Tool**: Vite

## Project Structure

```
F:\VAadvocate\
├── public/
│   └── index.html
├── src/
│   ├── components/         # Reusable React components
│   ├── pages/             # Page components
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   ├── assets/            # Static assets (images, etc.)
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── backup/                # Backup of old files
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory:
   ```bash
   cd F:\VAadvocate
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Development

The project uses a modern React setup with:

- **Vite** for fast development and building
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for smooth animations
- **React Router** for client-side routing
- **ESLint** for code linting

### Component Organization

- `src/components/` - Individual tool components and UI elements
- `src/pages/` - Page-level components
- `src/utils/` - Utility functions and helpers

## Legal Tools

Each tool is accessible via dedicated routes:

- `/camera-ocr` - Camera OCR Processing
- `/legal-knowledge` - VA Legal Knowledge Base
- `/claim-guidance` - Step-by-Step Claim Guidance
- `/audio-transcription` - Legal Audio Transcription
- `/case-research` - Case Precedent Research
- `/analytics` - Claim Success Analytics

## License

Copyright © 2024 VeteranLawAI. All rights reserved.