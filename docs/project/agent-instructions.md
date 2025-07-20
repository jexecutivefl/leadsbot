# AI Agent Development Instructions

## 🎯 Agent Mission

You are an AI development agent working on the **Leadsbot** project - an AI-powered real estate lead follow-up agent. Your role is to contribute to parallel development efforts by implementing specific features, components, or improvements while maintaining code quality and project standards.

## 📋 Project Context

### Technology Stack
- **Frontend**: React 18.2.0 + TypeScript 5.4.5 + Vite 5.4.10
- **Backend**: AWS Amplify Gen2 (Cognito, AppSync, DynamoDB)
- **Styling**: CSS Modules (NO Tailwind) with premium theme
- **Testing**: Vitest + React Testing Library + Playwright
- **Forms**: React Hook Form + Zod validation

### Current Phase
**Phase 5: Analytics Dashboard & Reporting** (60% complete)
- Focus: Analytics components, data visualization, reporting features
- Priority: Chart components, metrics cards, export functionality

### Project Structure
```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── layout/       # Layout components
│   ├── leads/        # Lead management
│   ├── ai/           # AI chat interface
│   └── analytics/    # Analytics components
├── pages/            # Page components
├── services/         # API services
├── types/            # TypeScript definitions
└── styles/           # Global styles and tokens
```

## 🔧 Development Guidelines

### Code Quality Standards
1. **TypeScript Strict Mode**: All code must compile without errors
2. **ESLint Compliance**: Follow all linting rules
3. **Component Isolation**: Each component should be self-contained
4. **Performance First**: Optimize for bundle size and runtime performance

### Component Development Pattern
```tsx
// ComponentName.tsx
import React from 'react';
import styles from './ComponentName.module.css';

interface ComponentNameProps {
  // Define all props with types
  title: string;
  onAction?: () => void;
  variant?: 'primary' | 'secondary';
}

export const ComponentName: React.FC<ComponentNameProps> = ({
  title,
  onAction,
  variant = 'primary'
}) => {
  return (
    <div className={`${styles.container} ${styles[`container--${variant}`]}`}>
      <h3>{title}</h3>
      {onAction && (
        <button onClick={onAction} className={styles.button}>
          Action
        </button>
      )}
    </div>
  );
};
```

### CSS Modules Pattern
```css
/* ComponentName.module.css */
.container {
  padding: var(--space-4);
  border-radius: var(--radius-md);
  background-color: white;
  box-shadow: var(--shadow-md);
}

.container--primary {
  border: 1px solid var(--color-primary-500);
}

.container--secondary {
  border: 1px solid var(--color-gray-300);
}

.button {
  padding: var(--space-2) var(--space-4);
  background-color: var(--color-primary-600);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.button:hover {
  background-color: var(--color-primary-700);
}
```

### Testing Requirements
```tsx
// ComponentName.test.tsx
import { render, screen } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const mockAction = vi.fn();
    render(<ComponentName title="Test" onAction={mockAction} />);
    
    screen.getByRole('button').click();
    expect(mockAction).toHaveBeenCalled();
  });
});
```

## 🎨 Design System

### Color Palette
```css
:root {
  --color-primary-600: #3b82f6;  /* Primary blue */
  --color-primary-700: #2563eb;  /* Darker blue */
  --color-gray-100: #f3f4f6;     /* Light gray */
  --color-gray-300: #d1d5db;     /* Medium gray */
  --color-gray-500: #6b7280;     /* Base gray */
  --color-gray-700: #374151;     /* Dark gray */
  --color-gray-900: #111827;     /* Darkest gray */
}
```

### Spacing System
```css
:root {
  --space-2: 0.5rem;   /* 8px */
  --space-4: 1rem;     /* 16px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-12: 3rem;    /* 48px */
}
```

### Typography
```css
:root {
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
}
```

## 🚀 Current Development Priorities

### High Priority Tasks (Phase 5)
1. **Chart Components** (`src/components/analytics/Chart/`)
   - Line charts for lead trends
   - Bar charts for performance comparison
   - Pie charts for lead distribution
   - Area charts for cumulative data

2. **Metrics Cards** (`src/components/analytics/MetricsCard/`)
   - Key performance indicators
   - Trend indicators and percentage changes
   - Real-time data updates

3. **Analytics Page** (`src/pages/analytics/`)
   - Dashboard layout and navigation
   - Data filtering and date range selection
   - Responsive design implementation

### Medium Priority Tasks
1. **Export Functionality**
   - PDF report generation
   - Excel export capabilities
   - Custom report templates

2. **Data Aggregation Services**
   - Lead performance analytics
   - Real-time data calculation
   - Caching strategies

### Low Priority Tasks
1. **Advanced Analytics**
   - Lead scoring algorithms
   - Predictive analytics
   - Custom dashboard widgets

## 🔄 Parallel Development Coordination

### File Organization for Conflict Prevention
- **Components**: Each component in its own directory with clear interfaces
- **Pages**: Modular page structure with minimal dependencies
- **Services**: Isolated service layers for API calls
- **Types**: Centralized TypeScript definitions

### Coordination Guidelines
1. **Task Assignment**: Pick tasks from the sprint backlog
2. **Component Boundaries**: Keep components self-contained
3. **Service Isolation**: Don't modify shared services without coordination
4. **State Management**: Use isolated context providers
5. **Styling**: CSS Modules prevent style conflicts

### Communication Protocol
1. **Task Updates**: Update project status when starting/completing tasks
2. **Code Reviews**: Review each other's work when possible
3. **Documentation**: Keep docs current as you work
4. **Conflict Resolution**: Coordinate through clear task boundaries

## 📚 Available Resources

### Documentation
- **Development Setup**: `docs/development/setup.md`
- **Development Guidelines**: `docs/development/guidelines.md`
- **Component Library**: `docs/development/components.md`
- **Testing Strategy**: `docs/development/testing.md`
- **Design System**: `docs/design/design-system.md`

### Project Status
- **Current Status**: `docs/project/status.md`
- **Sprint Backlog**: `docs/project/sprint-backlog.md`
- **Daily Tasks**: `docs/project/daily-tasks.md`

### Code Examples
- **Existing Components**: `src/components/ui/`
- **Page Examples**: `src/pages/`
- **Service Examples**: `src/services/`
- **Type Definitions**: `src/types/`

## 🎯 Task Execution Process

### Before Starting Work
1. **Review Current Status**: Check `docs/project/status.md`
2. **Pick Up Tasks**: Assign yourself tasks from the backlog
3. **Understand Requirements**: Read relevant documentation
4. **Plan Implementation**: Consider dependencies and conflicts

### During Development
1. **Follow Patterns**: Use established component patterns
2. **Write Tests**: Include unit tests for all components
3. **Maintain Quality**: Ensure TypeScript and ESLint compliance
4. **Document Changes**: Update relevant documentation

### After Completing Work
1. **Test Thoroughly**: Run all tests and verify functionality
2. **Update Status**: Mark tasks as complete in project status
3. **Code Review**: Review your own work before considering complete
4. **Documentation**: Update any relevant documentation

## 🔍 Quality Assurance Checklist

### Before Submitting Work
- [ ] TypeScript compiles without errors
- [ ] ESLint passes with no warnings
- [ ] All tests pass
- [ ] Component is responsive
- [ ] Accessibility requirements met
- [ ] Performance impact assessed
- [ ] Documentation updated

### Code Review Criteria
- **Functionality**: Does it work as expected?
- **Code Quality**: Is the code clean and maintainable?
- **Performance**: Any performance concerns?
- **Security**: Any security vulnerabilities?
- **Accessibility**: WCAG 2.1 AA compliance
- **Testing**: Adequate test coverage

## 🚨 Common Issues and Solutions

### TypeScript Errors
```bash
# Check for TypeScript errors
npm run type-check

# Common fixes:
# 1. Add proper type definitions
# 2. Use proper interface inheritance
# 3. Handle optional props correctly
```

### ESLint Issues
```bash
# Check for linting issues
npm run lint

# Auto-fix issues
npm run lint -- --fix

# Common fixes:
# 1. Use proper import statements
# 2. Follow naming conventions
# 3. Handle unused variables
```

### Build Issues
```bash
# Clear build cache
rm -rf node_modules package-lock.json
npm install

# Check build output
npm run build
```

### Testing Issues
```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Common fixes:
# 1. Mock external dependencies
# 2. Use proper test utilities
# 3. Handle async operations correctly
```

## 📞 Support and Resources

### When You Need Help
1. **Check Documentation**: Review relevant docs first
2. **Look at Examples**: Examine existing components
3. **Check Project Status**: Understand current state
4. **Review Patterns**: Follow established conventions

### Available Tools
- **Development Server**: `npm run dev`
- **Testing**: `npm test`
- **Linting**: `npm run lint`
- **Type Checking**: `npm run type-check`
- **Build**: `npm run build`

### External Resources
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [AWS Amplify Docs](https://docs.amplify.aws/)
- [Vite Documentation](https://vitejs.dev/)
- [Vitest Documentation](https://vitest.dev/)

## 🎯 Success Metrics

### Individual Agent Metrics
- **Task Completion**: Complete assigned tasks on time
- **Code Quality**: Maintain high code quality standards
- **Documentation**: Keep documentation current
- **Collaboration**: Coordinate effectively with other agents

### Project Success Criteria
- **Feature Completeness**: All planned features implemented
- **Code Quality**: < 5% bug rate in production
- **Performance**: < 3s initial load time
- **Accessibility**: 100% WCAG 2.1 AA compliance
- **Test Coverage**: > 80% test coverage

## 🔄 Continuous Improvement

### Learning Opportunities
1. **Code Reviews**: Learn from other agents' work
2. **Documentation**: Contribute to project documentation
3. **Pattern Development**: Help establish new patterns
4. **Process Improvement**: Suggest workflow improvements

### Feedback Loop
1. **Self-Assessment**: Regularly assess your own work
2. **Peer Review**: Review and learn from others
3. **Process Feedback**: Provide feedback on development process
4. **Documentation Updates**: Keep documentation current

This comprehensive guide ensures effective parallel development while maintaining code quality and project standards. Follow these instructions to contribute effectively to the Leadsbot project. 