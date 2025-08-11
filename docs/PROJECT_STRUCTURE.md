# VeteranLawAI Platform - Project Structure

## Directory Overview

```
src/
├── components/           # React UI components
│   ├── chat/            # AI chat interface
│   ├── ErrorBoundary/   # Error handling with tests
│   ├── layout/          # Layout components (Header, Sidebar)
│   ├── modals/          # Modal dialogs
│   ├── tools/           # Core feature tools
│   │   ├── Analytics/
│   │   ├── AudioTranscription/
│   │   ├── CameraOCR/
│   │   ├── CaseResearch/
│   │   ├── ClaimGuidance/
│   │   └── LegalKnowledgeBase/
│   └── ui/              # Reusable UI components
│
├── contexts/            # React contexts
│   └── AuthContext.jsx  # Authentication state management
│
├── hooks/               # Custom React hooks
│   ├── useKeyboardNavigation.js
│   └── useLoading.js
│
├── services/            # Business logic and data services
│   ├── databases/       # Data storage modules
│   │   ├── DocumentDatabase.js
│   │   ├── VACaseLawDatabase.js
│   │   └── VAConditionsDatabase.js
│   ├── engines/         # Processing engines
│   │   ├── AIAnalysisEngine.js
│   │   ├── AnalyticsDataEngine.js
│   │   ├── CaseAnalysisEngine.js
│   │   └── FormGenerator.js
│   ├── ocrService.js    # OCR processing
│   └── speechToTextService.js # Speech recognition
│
├── test/                # Test configuration
│   └── setup.js         # Test environment setup
│
├── utils/               # Utility functions
│   ├── accessibility.js # WCAG compliance utilities
│   └── reporting.js     # Report generation
│
├── App.jsx              # Main application component
├── index.css            # Global styles
└── main.jsx            # Application entry point
```

## Key Architectural Decisions

### 1. Services Layer Separation
- **Databases**: Centralized data modules in `services/databases/`
- **Engines**: Business logic processors in `services/engines/`
- **APIs**: OCR and speech services in `services/`

### 2. Component Organization
- **Tools**: Each major feature has its own directory
- **UI**: Shared UI components with consistent styling
- **Layout**: Application structure components

### 3. Testing Structure
- Tests colocated with components in `__tests__` directories
- Shared test utilities in `src/test/`
- Comprehensive accessibility testing

### 4. Accessibility First
- Dedicated accessibility utilities
- Veteran-specific accommodations
- WCAG 2.1 AA compliance throughout

## Import Conventions

### Relative Import Examples
```javascript
// From a tool component to services
import { VAConditionsDatabase } from '../../../services/databases/VAConditionsDatabase'
import { AIAnalysisEngine } from '../../../services/engines/AIAnalysisEngine'

// From services to other services
import { VACaseLawDatabase } from '../databases/VACaseLawDatabase'

// From components to utilities
import { announceToScreenReader } from '../../utils/accessibility'
```

## File Naming Conventions

- **Components**: PascalCase (e.g., `ErrorBoundary.jsx`)
- **Utilities**: camelCase (e.g., `accessibility.js`)
- **Services**: camelCase with descriptive suffix (e.g., `ocrService.js`)
- **Tests**: Component name + `.test.jsx` (e.g., `ErrorBoundary.test.jsx`)

## Build Output

```
dist/
├── assets/              # Bundled JS/CSS files
├── index.html          # Production HTML
└── [hash].js/css       # Versioned bundles
```

## Configuration Files

- `vite.config.js` - Build configuration
- `vitest.config.js` - Test configuration
- `tailwind.config.js` - Styling configuration
- `postcss.config.js` - CSS processing
- `vercel.json` - Deployment configuration

## Next Steps for Structure Improvements

1. **Add TypeScript** - Migrate to `.ts/.tsx` files
2. **Extract Routes** - Create dedicated route components
3. **Add State Management** - Implement Zustand/Redux if needed
4. **Create API Layer** - Centralize external API calls
5. **Add E2E Tests** - Playwright test structure