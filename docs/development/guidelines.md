# Development Guidelines

## 🎯 Core Principles

### Code Quality
- **TypeScript Strict Mode**: All code must compile without errors
- **ESLint Compliance**: Follow all linting rules
- **Component Isolation**: Each component should be self-contained
- **Performance First**: Optimize for bundle size and runtime performance

### Parallel Development
- **Clear Interfaces**: Define explicit prop types for all components
- **Service Isolation**: Keep API services independent
- **State Management**: Use isolated context providers
- **File Organization**: Follow consistent naming and structure

## 📁 File Organization

### Component Structure
```
ComponentName/
├── ComponentName.tsx      # Main component
├── ComponentName.module.css # Styles
├── ComponentName.test.tsx # Tests
└── index.ts              # Export
```

### Naming Conventions
- **Components**: PascalCase (`LeadCard.tsx`)
- **Files**: PascalCase for components, camelCase for utilities
- **CSS Classes**: kebab-case with BEM methodology
- **Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Types**: PascalCase with descriptive names

## 🎨 Styling Guidelines

### CSS Modules
```css
/* ComponentName.module.css */
.container {
  /* Base styles */
}

.container--variant {
  /* Modifier styles */
}

.container__element {
  /* Element styles */
}
```

### Design Tokens
```css
/* Use tokens from src/styles/tokens.css */
.container {
  color: var(--color-primary);
  padding: var(--space-md);
  border-radius: var(--radius-md);
}
```

### Responsive Design
```css
/* Mobile-first approach */
.container {
  padding: var(--space-sm);
}

@media (min-width: 768px) {
  .container {
    padding: var(--space-md);
  }
}
```

## 🔧 Component Development

### Component Template
```tsx
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
      <h2>{title}</h2>
      {onAction && (
        <button onClick={onAction} className={styles.button}>
          Action
        </button>
      )}
    </div>
  );
};
```

### Props Guidelines
- **Required Props**: Only make props required if absolutely necessary
- **Default Values**: Provide sensible defaults for optional props
- **Type Safety**: Use specific types, avoid `any`
- **Documentation**: Add JSDoc comments for complex props

### State Management
```tsx
// Use React hooks for local state
const [isLoading, setIsLoading] = useState(false);
const [data, setData] = useState<DataType[]>([]);

// Use context for shared state
const { user } = useAuth();
const { leads } = useLeads();
```

## 🧪 Testing Guidelines

### Test Structure
```tsx
import { render, screen } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('handles user interactions', () => {
    const mockAction = vi.fn();
    render(<ComponentName title="Test" onAction={mockAction} />);
    
    screen.getByRole('button').click();
    expect(mockAction).toHaveBeenCalled();
  });
});
```

### Testing Requirements
- **Unit Tests**: Test all component logic
- **Integration Tests**: Test component interactions
- **Accessibility Tests**: Ensure ARIA compliance
- **Coverage**: Minimum 80% coverage

## 🔌 API Integration

### Service Pattern
```tsx
// services/leadService.ts
export class LeadService {
  static async getLeads(): Promise<Lead[]> {
    try {
      const response = await fetch('/api/leads');
      return response.json();
    } catch (error) {
      console.error('Failed to fetch leads:', error);
      throw error;
    }
  }
}
```

### Error Handling
```tsx
const [error, setError] = useState<string | null>(null);

try {
  const data = await LeadService.getLeads();
  setData(data);
} catch (err) {
  setError(err instanceof Error ? err.message : 'Unknown error');
}
```

## 🚀 Performance Guidelines

### Bundle Optimization
- **Code Splitting**: Use React.lazy for route-based splitting
- **Tree Shaking**: Import only what you need
- **Image Optimization**: Use WebP format and proper sizing

### Runtime Performance
```tsx
// Use React.memo for expensive components
export const ExpensiveComponent = React.memo<Props>(({ data }) => {
  return <div>{/* Component content */}</div>;
});

// Use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return data.filter(item => item.active).map(item => item.value);
}, [data]);

// Use useCallback for event handlers
const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies]);
```

## 🔍 Code Review Checklist

### Before Submitting
- [ ] TypeScript compiles without errors
- [ ] ESLint passes with no warnings
- [ ] All tests pass
- [ ] Component is responsive
- [ ] Accessibility requirements met
- [ ] Performance impact assessed
- [ ] Documentation updated

### Review Criteria
- **Functionality**: Does it work as expected?
- **Code Quality**: Is the code clean and maintainable?
- **Performance**: Any performance concerns?
- **Security**: Any security vulnerabilities?
- **Accessibility**: WCAG 2.1 AA compliance
- **Testing**: Adequate test coverage

## 🎯 Parallel Development Tips

### Avoiding Conflicts
1. **Component Boundaries**: Keep components self-contained
2. **Service Isolation**: Don't modify shared services without coordination
3. **State Management**: Use isolated contexts for different features
4. **Styling**: CSS Modules prevent style conflicts

### Coordination
1. **Task Assignment**: Pick tasks from the sprint backlog
2. **Communication**: Update project status regularly
3. **Code Reviews**: Review each other's work
4. **Documentation**: Keep docs current

### Best Practices
1. **Small Commits**: Make frequent, small commits
2. **Clear Messages**: Write descriptive commit messages
3. **Branch Strategy**: Use feature branches for major changes
4. **Testing**: Write tests as you develop

## 📚 Resources

- [React Best Practices](https://react.dev/learn)
- [TypeScript Guidelines](https://www.typescriptlang.org/docs/)
- [CSS Modules Documentation](https://github.com/css-modules/css-modules)
- [Testing Library Best Practices](https://testing-library.com/docs/guiding-principles) 