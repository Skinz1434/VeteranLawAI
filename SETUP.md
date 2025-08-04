# VeteranLawAI Platform Setup Instructions

## Quick Start

1. **Install Dependencies**
   ```bash
   cd F:\VAadvocate
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Access the Application**
   Open your browser and go to `http://localhost:3000`

## Project Structure Overview

```
F:\VAadvocate\
├── public/index.html          # Main HTML template
├── src/
│   ├── main.jsx              # Application entry point
│   ├── App.jsx               # Main app component with routing
│   ├── index.css             # Global styles and Tailwind
│   ├── pages/
│   │   └── HomePage.jsx      # Home page component
│   ├── components/           # All React components
│   ├── assets/              # Images and static files
│   └── utils/               # Utility functions
├── package.json             # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── postcss.config.js       # PostCSS configuration
```

## Available Commands

- `npm run dev` - Start development server (port 3000)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run code linting

## Key Features

✅ Modern React 18 with Vite  
✅ Tailwind CSS for styling  
✅ Framer Motion for animations  
✅ React Router for navigation  
✅ Lucide React for icons  
✅ Proper project structure  
✅ ESLint configuration  
✅ Professional UI/UX design  

## Next Steps

1. Install dependencies: `npm install`
2. Start development: `npm run dev`
3. Begin customizing components in `/src/components/`
4. Add new pages in `/src/pages/`
5. Customize styling in `/src/index.css`

The platform is now properly organized and ready for development!