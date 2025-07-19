# Developer Quick Reference - Leadsbot

## 🚀 Quick Start

```bash
# Clone and setup
git clone <repository-url>
cd leadsbot
npm install

# Development
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # ESLint check
```

## 📁 Key Files & Directories

### ✅ Core Application Files
```
src/
├── App.tsx                    # Main application component
├── main.tsx                   # Application entry point
├── types/index.ts             # TypeScript interfaces
├── index.css                  # Global styles
└── vite-env.d.ts             # Vite type definitions
```

### ✅ Component Library
```
src/components/
├── ui/
│   ├── Button/                # 5 variants, 3 sizes, premium styling
│   ├── Input/                 # All input types, validation, icons
│   ├── Card/                  # Header/body/footer, 3 variants
│   ├── Modal/                 # 4 sizes, focus trap, animations
│   └── Table/                 # Sorting, pagination, bulk actions
├── layout/
│   ├── Header/                # Navigation, search, user menu
│   ├── Sidebar/               # Collapsible navigation
│   └── Layout/                # Main layout wrapper
└── leads/
    └── LeadCard/              # Lead information display
```

### ✅ Application Pages
```
src/pages/
├── auth/
│   └── Login/                 # Authentication with validation
├── dashboard/
│   └── Dashboard.tsx          # Stats cards, recent leads
└── leads/
    └── LeadsPage.tsx          # Lead management with filtering
```

### ✅ Styling System
```
src/styles/
├── global.css                 # Global styles and base setup
└── tokens.css                 # Design system tokens
```

### ❌ Missing Directories (To Be Created)
```
src/
├── hooks/                     # Custom React hooks
├── utils/                     # Utility functions
├── services/                  # API services
├── contexts/                  # React contexts
├── components/
│   ├── ai/                    # AI chat components
│   ├── settings/              # Settings components
│   ├── analytics/             # Chart components
│   └── forms/                 # Form components
└── pages/
    ├── settings/              # Settings pages
    ├── analytics/             # Analytics pages
    └── chat/                  # Chat pages
```

## 🔧 Technology Stack

### Frontend
- **React 18** - UI library with hooks
- **TypeScript** - Type safety and better DX
- **Vite** - Fast build tool and dev server
- **CSS Modules** - Component-scoped styling

### Backend (AWS Amplify)
- **Authentication** - Cognito email auth
- **Database** - Basic Todo model (needs expansion)
- **API** - GraphQL with AppSync
- **Hosting** - Amplify hosting

### Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "@aws-amplify/ui-react": "^6.5.5",
  "aws-amplify": "^6.6.6"
}
```

## 🎨 Design System

### Color Palette
```css
/* Primary Colors */
--color-primary-500: #3b82f6    /* Main brand blue */
--color-primary-800: #1e3a8a    /* Dark emphasis */

/* Neutral Colors */
--color-gray-50: #f9fafb        /* Main background */
--color-gray-100: #f3f4f6       /* Card surfaces */
--color-gray-700: #374151       /* Body text */
--color-gray-900: #111827       /* Headings */

/* Status Colors */
--color-green-500: #10b981      /* Success */
--color-red-500: #ef4444        /* Error */
--color-yellow-500: #f59e0b     /* Warning */
--color-blue-500: #3b82f6       /* Info */
```

### Typography
- **Font Family:** Inter (imported in global.css)
- **Base Size:** 16px with 1.5 line height
- **Headings:** h1-h6 with proper semantic hierarchy

### Spacing System
- **Base Unit:** 8px
- **Common Values:** 16px, 24px, 32px, 48px, 64px

## 🧩 Component Patterns

### File Structure
```
ComponentName/
├── ComponentName.tsx          # Main component
├── ComponentName.module.css   # Styles
└── index.ts                   # Export
```

### TypeScript Interface Pattern
```typescript
interface ComponentNameProps {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  onClick?: () => void;
}

export const ComponentName: React.FC<ComponentNameProps> = ({
  variant = 'primary',
  size = 'medium',
  children,
  onClick,
}) => {
  // Component logic
};
```

### CSS Module Pattern
```css
.componentName {
  /* Base styles */
}

.componentNamePrimary {
  /* Primary variant */
}

.componentNameSmall {
  /* Small size */
}

/* Mobile-first responsive */
@media (min-width: 768px) {
  .componentName {
    /* Tablet+ styles */
  }
}
```

## 📊 Current Features

### ✅ Authentication
- Email/password login
- Form validation
- Demo credentials: `demo@leadsbot.com` / `password123`

### ✅ Dashboard
- Welcome message
- Stats cards (leads, conversion rates)
- Recent leads table
- Quick action buttons

### ✅ Lead Management
- Lead list with filtering and search
- Table/Cards dual view modes
- Status indicators and badges
- Bulk operations (selection framework)
- Responsive design

### ✅ Navigation
- Header with user menu
- Collapsible sidebar
- Mobile hamburger menu
- Active state indicators

## 🔍 Key Data Structures

### Lead Interface
```typescript
interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed-won' | 'closed-lost';
  source: string;
  assignedAgent?: string;
  notes?: string;
  createdAt: Date;
  lastContactAt?: Date;
}
```

### User Interface
```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}
```

## 🎯 Development Guidelines

### Code Quality
- Use TypeScript strict mode
- Follow ESLint rules
- Use CSS Modules for styling
- Implement responsive design
- Add proper ARIA labels

### Component Development
1. Create TypeScript interface first
2. Build basic component structure
3. Add CSS Module styling
4. Implement responsive behavior
5. Add accessibility features
6. Test on different screen sizes

### Performance
- Use React.memo for expensive components
- Implement proper loading states
- Optimize images and assets
- Monitor bundle size growth

## 🚨 Common Issues & Solutions

### TypeScript Errors
- **Issue:** Type errors in components
- **Solution:** Define proper interfaces and use strict typing

### Styling Issues
- **Issue:** Styles not applying
- **Solution:** Check CSS Module import and class name spelling

### Build Errors
- **Issue:** Compilation failures
- **Solution:** Run `npm run lint` and fix ESLint warnings

### Performance Issues
- **Issue:** Slow rendering
- **Solution:** Use React DevTools to identify expensive re-renders

## 📋 Testing Checklist

### New Component Checklist
- [ ] TypeScript compilation passes
- [ ] Component renders without errors
- [ ] All props work correctly
- [ ] Responsive design works
- [ ] Accessibility features work
- [ ] Hover and focus states work
- [ ] ESLint passes without warnings

### Page Testing
- [ ] Navigation works correctly
- [ ] Loading states display properly
- [ ] Error states handle gracefully
- [ ] Mobile experience is optimized
- [ ] All interactive elements work

## 🛠️ Debug Information

### Development URLs
- **Dev Server:** http://localhost:5173
- **Build Preview:** After `npm run preview`

### Browser DevTools
- React DevTools for component debugging
- Chrome DevTools for performance profiling
- Network tab for API call monitoring

### Log Locations
- Console errors in browser DevTools
- Build errors in terminal
- Lint warnings in terminal

## 📚 Key Documentation Files

- `README.md` - Basic project information
- `TODO_DOCUMENTATION.md` - Complete remaining work list
- `IMPLEMENTATION_GUIDE.md` - Step-by-step development guide
- `PROJECT_STATUS_SUMMARY.md` - High-level project overview
- `PHASE_*_COMPLETION_REPORT.md` - Detailed phase reports

**This project has a solid foundation with premium quality components. Focus on AI integration and analytics for the next development phase.** 🚀