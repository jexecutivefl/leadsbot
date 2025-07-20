# Development Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- AWS Account
- AWS Amplify CLI
- Git

### Installation
```bash
# Clone the repository
git clone [repository-url]
cd leadsbot

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔧 Environment Setup

### AWS Amplify Configuration
```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Configure Amplify
amplify configure

# Initialize Amplify in project
amplify init

# Add authentication
amplify add auth

# Add data layer
amplify add data

# Push to AWS
amplify push
```

### Environment Variables
Create `.env.local` file:
```env
VITE_APP_NAME=Leadsbot
VITE_APP_VERSION=1.0.0
VITE_API_ENDPOINT=your-api-endpoint
```

## 🛠️ Development Commands

### Core Commands
```bash
# Development server
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check

# Linting
npm run lint

# Testing
npm test
npm run test:ui
npm run test:coverage
npm run test:e2e
```

### AWS Commands
```bash
# Deploy to AWS
npm run deploy

# Deploy to production
npm run deploy:prod

# View Amplify status
amplify status

# Pull latest changes
amplify pull
```

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── ui/             # Base UI components
│   ├── layout/         # Layout components
│   ├── leads/          # Lead management
│   ├── ai/             # AI chat interface
│   └── analytics/      # Analytics components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── services/           # API services
├── types/              # TypeScript definitions
├── styles/             # Global styles
└── test/               # Test files
```

## 🎨 Design System

### CSS Modules
- All components use CSS Modules
- Global styles in `src/styles/global.css`
- Design tokens in `src/styles/tokens.css`

### Component Structure
```
ComponentName/
├── ComponentName.tsx
├── ComponentName.module.css
└── index.ts
```

## 🧪 Testing

### Unit Tests
- Vitest for unit testing
- React Testing Library for component tests
- Tests in `src/test/` directory

### E2E Tests
- Playwright for end-to-end testing
- Tests in `playwright/` directory

### Test Coverage
- Minimum 80% coverage required
- Run `npm run test:coverage` to check

## 🔍 Code Quality

### TypeScript
- Strict mode enabled
- All components must have proper types
- No `any` types allowed

### ESLint
- Strict linting rules
- Auto-fix with `npm run lint -- --fix`

### Prettier
- Automatic code formatting
- Configured in `.prettierrc`

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Staging
```bash
npm run build
npm run preview
```

### Production
```bash
npm run build
npm run deploy:prod
```

## 🔧 Troubleshooting

### Common Issues

#### Amplify Issues
```bash
# Reset Amplify
amplify env remove dev
amplify init

# Clear cache
amplify env checkout dev
```

#### Build Issues
```bash
# Clear node_modules
rm -rf node_modules package-lock.json
npm install

# Clear build cache
npm run build -- --force
```

#### Test Issues
```bash
# Clear test cache
npm test -- --clearCache

# Update snapshots
npm test -- --updateSnapshot
```

## 📚 Additional Resources

- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Vitest Documentation](https://vitest.dev/) 