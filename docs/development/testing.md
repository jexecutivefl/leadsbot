# Testing Strategy

## 🎯 Testing Philosophy

Our testing strategy follows the testing pyramid approach:
- **Unit Tests**: Fast, isolated tests for individual components and functions
- **Integration Tests**: Tests for component interactions and API integration
- **E2E Tests**: Full user journey tests for critical workflows

## 🧪 Testing Stack

### Unit Testing
- **Framework**: Vitest
- **React Testing**: React Testing Library
- **Assertions**: Vitest assertions + Jest DOM matchers
- **Coverage**: @vitest/coverage-v8

### E2E Testing
- **Framework**: Playwright
- **Browser Support**: Chromium, Firefox, Safari
- **Visual Testing**: Built-in screenshot comparison

### Testing Utilities
- **Mocking**: Vitest built-in mocks
- **Data Factory**: Custom test data generators
- **Test Helpers**: Shared testing utilities

## 📁 Test Organization

### File Structure
```
src/
├── components/
│   └── ComponentName/
│       ├── ComponentName.tsx
│       ├── ComponentName.module.css
│       └── ComponentName.test.tsx
├── pages/
│   └── PageName/
│       ├── PageName.tsx
│       └── PageName.test.tsx
├── services/
│   ├── serviceName.ts
│   └── serviceName.test.ts
└── test/
    ├── setup.ts
    ├── utils/
    │   ├── test-utils.tsx
    │   ├── data-factories.ts
    │   └── mocks.ts
    └── fixtures/
        └── sample-data.ts
```

### Test File Naming
- Unit tests: `ComponentName.test.tsx`
- Integration tests: `ComponentName.integration.test.tsx`
- E2E tests: `ComponentName.spec.ts`

## 🔧 Unit Testing

### Component Testing

#### Basic Component Test
```tsx
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    screen.getByRole('button').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct variant styles', () => {
    render(<Button variant="primary">Primary Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('button--primary');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

#### Complex Component Test
```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LeadForm } from './LeadForm';
import { createMockLead } from '@/test/utils/data-factories';

describe('LeadForm', () => {
  const mockLead = createMockLead();
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders form fields correctly', () => {
    render(<LeadForm onSubmit={mockOnSubmit} />);
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/company/i)).toBeInTheDocument();
  });

  it('populates form with existing lead data', () => {
    render(<LeadForm lead={mockLead} onSubmit={mockOnSubmit} />);
    
    expect(screen.getByDisplayValue(mockLead.name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockLead.email)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<LeadForm onSubmit={mockOnSubmit} />);
    
    const submitButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    render(<LeadForm onSubmit={mockOnSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' }
    });

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '',
        company: '',
        source: '',
        notes: '',
        status: 'new'
      });
    });
  });

  it('shows loading state during submission', async () => {
    const slowSubmit = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<LeadForm onSubmit={slowSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' }
    });

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled();
  });
});
```

### Hook Testing
```tsx
import { renderHook, act } from '@testing-library/react';
import { useLeads } from './useLeads';
import { LeadService } from '@/services/leadService';

vi.mock('@/services/leadService');

describe('useLeads', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads leads on mount', async () => {
    const mockLeads = [
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com' }
    ];

    vi.mocked(LeadService.getLeads).mockResolvedValue(mockLeads);

    const { result } = renderHook(() => useLeads());

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.leads).toEqual(mockLeads);
    expect(result.current.loading).toBe(false);
    expect(LeadService.getLeads).toHaveBeenCalledTimes(1);
  });

  it('handles error states', async () => {
    const error = new Error('Failed to fetch leads');
    vi.mocked(LeadService.getLeads).mockRejectedValue(error);

    const { result } = renderHook(() => useLeads());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.error).toBe(error.message);
    expect(result.current.loading).toBe(false);
  });
});
```

### Service Testing
```tsx
import { LeadService } from './leadService';
import { createMockLead } from '@/test/utils/data-factories';

describe('LeadService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getLeads', () => {
    it('fetches leads successfully', async () => {
      const mockLeads = [createMockLead(), createMockLead()];
      
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockLeads
      });

      const result = await LeadService.getLeads();

      expect(result).toEqual(mockLeads);
      expect(fetch).toHaveBeenCalledWith('/api/leads');
    });

    it('handles API errors', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      await expect(LeadService.getLeads()).rejects.toThrow('Failed to fetch leads');
    });

    it('handles network errors', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      await expect(LeadService.getLeads()).rejects.toThrow('Network error');
    });
  });

  describe('createLead', () => {
    it('creates lead successfully', async () => {
      const newLead = createMockLead({ name: 'New Lead' });
      const createdLead = { ...newLead, id: '123' };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => createdLead
      });

      const result = await LeadService.createLead(newLead);

      expect(result).toEqual(createdLead);
      expect(fetch).toHaveBeenCalledWith('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead)
      });
    });
  });
});
```

## 🔗 Integration Testing

### Component Integration Tests
```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LeadsPage } from './LeadsPage';
import { LeadService } from '@/services/leadService';
import { createMockLead } from '@/test/utils/data-factories';

vi.mock('@/services/leadService');

describe('LeadsPage Integration', () => {
  const mockLeads = [
    createMockLead({ id: '1', name: 'John Doe' }),
    createMockLead({ id: '2', name: 'Jane Smith' })
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(LeadService.getLeads).mockResolvedValue(mockLeads);
  });

  it('loads and displays leads', async () => {
    render(<LeadsPage />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  it('creates new lead through form', async () => {
    const newLead = createMockLead({ name: 'New Lead' });
    vi.mocked(LeadService.createLead).mockResolvedValue(newLead);

    render(<LeadsPage />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /add lead/i }));

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'New Lead' }
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'new@example.com' }
    });

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(LeadService.createLead).toHaveBeenCalledWith({
        name: 'New Lead',
        email: 'new@example.com',
        phone: '',
        company: '',
        source: '',
        notes: '',
        status: 'new'
      });
    });

    await waitFor(() => {
      expect(screen.getByText('New Lead')).toBeInTheDocument();
    });
  });
});
```

## 🌐 E2E Testing

### Page Object Model
```tsx
// test/e2e/pages/LeadsPage.ts
export class LeadsPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/leads');
  }

  async addNewLead(name: string, email: string) {
    await this.page.click('[data-testid="add-lead-button"]');
    await this.page.fill('[data-testid="lead-name-input"]', name);
    await this.page.fill('[data-testid="lead-email-input"]', email);
    await this.page.click('[data-testid="save-lead-button"]');
  }

  async getLeadByName(name: string) {
    return this.page.locator(`[data-testid="lead-card"]:has-text("${name}")`);
  }

  async editLead(name: string) {
    await this.page.click(`[data-testid="lead-card"]:has-text("${name}") [data-testid="edit-button"]`);
  }

  async deleteLead(name: string) {
    await this.page.click(`[data-testid="lead-card"]:has-text("${name}") [data-testid="delete-button"]`);
    await this.page.click('[data-testid="confirm-delete-button"]');
  }
}
```

### E2E Test Examples
```tsx
// test/e2e/leads.spec.ts
import { test, expect } from '@playwright/test';
import { LeadsPage } from './pages/LeadsPage';

test.describe('Leads Management', () => {
  let leadsPage: LeadsPage;

  test.beforeEach(async ({ page }) => {
    leadsPage = new LeadsPage(page);
    await leadsPage.goto();
  });

  test('should create a new lead', async ({ page }) => {
    const leadName = 'Test Lead';
    const leadEmail = 'test@example.com';

    await leadsPage.addNewLead(leadName, leadEmail);

    const leadCard = await leadsPage.getLeadByName(leadName);
    await expect(leadCard).toBeVisible();
    await expect(leadCard).toContainText(leadEmail);
  });

  test('should edit an existing lead', async ({ page }) => {
    const originalName = 'Original Name';
    const newName = 'Updated Name';

    // Create lead first
    await leadsPage.addNewLead(originalName, 'original@example.com');

    // Edit the lead
    await leadsPage.editLead(originalName);
    await page.fill('[data-testid="lead-name-input"]', newName);
    await page.click('[data-testid="save-lead-button"]');

    // Verify update
    const updatedLead = await leadsPage.getLeadByName(newName);
    await expect(updatedLead).toBeVisible();
  });

  test('should delete a lead', async ({ page }) => {
    const leadName = 'Lead to Delete';

    // Create lead first
    await leadsPage.addNewLead(leadName, 'delete@example.com');

    // Delete the lead
    await leadsPage.deleteLead(leadName);

    // Verify deletion
    const leadCard = await leadsPage.getLeadByName(leadName);
    await expect(leadCard).not.toBeVisible();
  });

  test('should filter leads by status', async ({ page }) => {
    // Create leads with different statuses
    await leadsPage.addNewLead('Active Lead', 'active@example.com');
    await leadsPage.addNewLead('Inactive Lead', 'inactive@example.com');

    // Filter by active status
    await page.selectOption('[data-testid="status-filter"]', 'active');

    // Verify only active leads are shown
    await expect(page.locator('text=Active Lead')).toBeVisible();
    await expect(page.locator('text=Inactive Lead')).not.toBeVisible();
  });
});
```

## 🛠️ Test Utilities

### Test Data Factories
```tsx
// test/utils/data-factories.ts
import { Lead, User, ChatMessage } from '@/types';

export const createMockLead = (overrides: Partial<Lead> = {}): Lead => ({
  id: Math.random().toString(36).substr(2, 9),
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  company: 'Acme Corp',
  source: 'website',
  status: 'new',
  notes: 'Test lead',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
});

export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: Math.random().toString(36).substr(2, 9),
  email: 'user@example.com',
  name: 'Test User',
  role: 'agent',
  createdAt: new Date().toISOString(),
  ...overrides
});

export const createMockChatMessage = (overrides: Partial<ChatMessage> = {}): ChatMessage => ({
  id: Math.random().toString(36).substr(2, 9),
  content: 'Test message',
  sender: 'user',
  timestamp: new Date().toISOString(),
  ...overrides
});
```

### Test Helpers
```tsx
// test/utils/test-utils.tsx
import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';

const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        {children}
      </AuthProvider>
    </BrowserRouter>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

### Mock Setup
```tsx
// test/utils/mocks.ts
import { vi } from 'vitest';

// Mock AWS Amplify
vi.mock('aws-amplify', () => ({
  Amplify: {
    configure: vi.fn(),
  },
  Auth: {
    signIn: vi.fn(),
    signOut: vi.fn(),
    getCurrentUser: vi.fn(),
  },
  API: {
    graphql: vi.fn(),
  },
}));

// Mock React Router
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({}),
  };
});

// Mock date-fns
vi.mock('date-fns', () => ({
  format: vi.fn((date) => date.toISOString()),
  parseISO: vi.fn((date) => new Date(date)),
}));
```

## 📊 Coverage Requirements

### Coverage Targets
- **Statements**: 80%
- **Branches**: 75%
- **Functions**: 80%
- **Lines**: 80%

### Coverage Configuration
```tsx
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/index.ts',
      ],
      thresholds: {
        global: {
          branches: 75,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
});
```

## 🚀 Performance Testing

### Component Performance Tests
```tsx
import { render } from '@testing-library/react';
import { LeadList } from './LeadList';
import { createMockLead } from '@/test/utils/data-factories';

describe('LeadList Performance', () => {
  it('renders large lists efficiently', () => {
    const largeLeadList = Array.from({ length: 1000 }, (_, i) =>
      createMockLead({ id: i.toString(), name: `Lead ${i}` })
    );

    const startTime = performance.now();
    render(<LeadList leads={largeLeadList} />);
    const endTime = performance.now();

    expect(endTime - startTime).toBeLessThan(100); // Should render in under 100ms
  });

  it('handles frequent updates efficiently', () => {
    const { rerender } = render(<LeadList leads={[]} />);
    
    const leads = [createMockLead()];
    
    const startTime = performance.now();
    rerender(<LeadList leads={leads} />);
    const endTime = performance.now();

    expect(endTime - startTime).toBeLessThan(50); // Should update in under 50ms
  });
});
```

## 🔍 Accessibility Testing

### Accessibility Test Examples
```tsx
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { LeadForm } from './LeadForm';

expect.extend(toHaveNoViolations);

describe('LeadForm Accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(<LeadForm onSubmit={vi.fn()} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper form labels', () => {
    render(<LeadForm onSubmit={vi.fn()} />);
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
  });

  it('should announce errors to screen readers', () => {
    render(<LeadForm onSubmit={vi.fn()} />);
    
    const submitButton = screen.getByRole('button', { name: /save/i });
    submitButton.click();

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
```

## 📋 Testing Checklist

### Before Writing Tests
- [ ] Understand the component's purpose and behavior
- [ ] Identify critical user interactions
- [ ] Plan test scenarios and edge cases
- [ ] Consider accessibility requirements

### Writing Tests
- [ ] Test happy path scenarios
- [ ] Test error states and edge cases
- [ ] Test user interactions (clicks, form submissions)
- [ ] Test accessibility features
- [ ] Test responsive behavior
- [ ] Test performance characteristics

### After Writing Tests
- [ ] Ensure all tests pass
- [ ] Check test coverage meets requirements
- [ ] Verify tests are maintainable and readable
- [ ] Update documentation if needed

## 🎯 Best Practices

### Test Organization
1. **Group related tests** using `describe` blocks
2. **Use descriptive test names** that explain the expected behavior
3. **Follow AAA pattern**: Arrange, Act, Assert
4. **Keep tests focused** on a single behavior
5. **Use setup and teardown** for common test data

### Test Data Management
1. **Use factories** for creating test data
2. **Keep test data realistic** but minimal
3. **Avoid hardcoded values** in assertions
4. **Clean up test data** after each test

### Mocking Strategy
1. **Mock external dependencies** (APIs, services)
2. **Don't mock implementation details**
3. **Use realistic mock responses**
4. **Verify mock interactions** when relevant

### Performance Considerations
1. **Keep tests fast** by avoiding unnecessary operations
2. **Use efficient selectors** (prefer `getByRole` over `getByText`)
3. **Avoid testing implementation details**
4. **Mock expensive operations** (API calls, file I/O)

This comprehensive testing strategy ensures code quality, reliability, and maintainability across the Leadsbot application. 