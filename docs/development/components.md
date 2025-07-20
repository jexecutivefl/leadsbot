# Component Library

## 🎯 Overview

This document provides a comprehensive guide to all reusable components in the Leadsbot application. Each component follows our design system and development guidelines.

## 📦 UI Components

### Button
**Location**: `src/components/ui/Button/`

**Props**:
```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}
```

**Usage**:
```tsx
import { Button } from '@/components/ui/Button';

<Button variant="primary" size="md" onClick={handleClick}>
  Save Lead
</Button>
```

**Variants**:
- `primary`: Blue background with white text
- `secondary`: Gray background with dark text
- `outline`: Transparent with border
- `ghost`: Transparent with hover effects

### Card
**Location**: `src/components/ui/Card/`

**Props**:
```tsx
interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
}
```

**Usage**:
```tsx
import { Card } from '@/components/ui/Card';

<Card padding="md" elevation="md">
  <h3>Lead Information</h3>
  <p>Lead details here...</p>
</Card>
```

### Input
**Location**: `src/components/ui/Input/`

**Props**:
```tsx
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  helperText?: string;
}
```

**Usage**:
```tsx
import { Input } from '@/components/ui/Input';

<Input
  type="email"
  label="Email Address"
  placeholder="Enter email"
  value={email}
  onChange={setEmail}
  error={emailError}
/>
```

### Modal
**Location**: `src/components/ui/Modal/`

**Props**:
```tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
}
```

**Usage**:
```tsx
import { Modal } from '@/components/ui/Modal';

<Modal isOpen={isModalOpen} onClose={closeModal} title="Add New Lead">
  <LeadForm onSubmit={handleSubmit} />
</Modal>
```

### Table
**Location**: `src/components/ui/Table/`

**Props**:
```tsx
interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  sortable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  onRowClick?: (row: T) => void;
  loading?: boolean;
}

interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}
```

**Usage**:
```tsx
import { Table } from '@/components/ui/Table';

const columns = [
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email' },
  { key: 'status', header: 'Status' },
  { key: 'actions', header: 'Actions', render: (_, row) => (
    <Button onClick={() => editLead(row)}>Edit</Button>
  )}
];

<Table data={leads} columns={columns} sortable pagination />
```

## 🏗️ Layout Components

### Header
**Location**: `src/components/layout/Header/`

**Props**:
```tsx
interface HeaderProps {
  user?: User;
  onLogout?: () => void;
  onMenuToggle?: () => void;
}
```

**Features**:
- User profile display
- Navigation menu
- Search functionality
- Notifications
- Mobile responsive

### Sidebar
**Location**: `src/components/layout/Sidebar/`

**Props**:
```tsx
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
}
```

**Navigation Items**:
- Dashboard
- Leads
- Analytics
- AI Chat
- Settings

### Layout
**Location**: `src/components/layout/Layout/`

**Props**:
```tsx
interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  showHeader?: boolean;
}
```

**Features**:
- Responsive layout
- Sidebar toggle
- Header integration
- Content area management

## 📊 Lead Management Components

### LeadCard
**Location**: `src/components/leads/LeadCard/`

**Props**:
```tsx
interface LeadCardProps {
  lead: Lead;
  onEdit?: (lead: Lead) => void;
  onDelete?: (lead: Lead) => void;
  onStatusChange?: (lead: Lead, status: LeadStatus) => void;
}
```

**Features**:
- Lead information display
- Status indicators
- Action buttons
- Responsive design

### LeadForm
**Location**: `src/components/leads/LeadForm/`

**Props**:
```tsx
interface LeadFormProps {
  lead?: Lead;
  onSubmit: (lead: LeadFormData) => void;
  onCancel?: () => void;
  loading?: boolean;
}
```

**Fields**:
- Name
- Email
- Phone
- Company
- Source
- Notes
- Status

## 🤖 AI Components

### ChatInterface
**Location**: `src/components/ai/ChatInterface/`

**Props**:
```tsx
interface ChatInterfaceProps {
  lead?: Lead;
  onSendMessage: (message: string) => void;
  messages: ChatMessage[];
  loading?: boolean;
}
```

**Features**:
- Real-time chat interface
- Message history
- Typing indicators
- File attachments
- Lead context integration

## 📈 Analytics Components

### Chart
**Location**: `src/components/analytics/Chart/`

**Props**:
```tsx
interface ChartProps {
  type: 'line' | 'bar' | 'pie' | 'area';
  data: ChartData[];
  options?: ChartOptions;
  height?: number;
  width?: number;
}
```

**Chart Types**:
- Line charts for trends
- Bar charts for comparisons
- Pie charts for distributions
- Area charts for cumulative data

### MetricsCard
**Location**: `src/components/analytics/MetricsCard/`

**Props**:
```tsx
interface MetricsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease';
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
}
```

**Features**:
- Metric display
- Trend indicators
- Percentage changes
- Icon support

## ⚙️ Settings Components

### AISettings
**Location**: `src/components/settings/AISettings/`

**Props**:
```tsx
interface AISettingsProps {
  settings: AISettings;
  onSave: (settings: AISettings) => void;
  loading?: boolean;
}
```

**Settings**:
- AI model selection
- Response length
- Tone configuration
- Custom prompts

## 🔧 Component Development Guidelines

### Creating New Components

1. **File Structure**:
```
ComponentName/
├── ComponentName.tsx
├── ComponentName.module.css
├── ComponentName.test.tsx
└── index.ts
```

2. **TypeScript Interface**:
```tsx
interface ComponentNameProps {
  // Required props
  title: string;
  
  // Optional props with defaults
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  
  // Event handlers
  onClick?: () => void;
  
  // Children
  children?: React.ReactNode;
}
```

3. **Component Implementation**:
```tsx
import React from 'react';
import styles from './ComponentName.module.css';

export const ComponentName: React.FC<ComponentNameProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  onClick,
  children
}) => {
  return (
    <div 
      className={`${styles.container} ${styles[`container--${variant}`]} ${styles[`container--${size}`]}`}
      onClick={onClick}
    >
      <h3>{title}</h3>
      {children}
    </div>
  );
};
```

4. **CSS Module**:
```css
.container {
  /* Base styles */
  padding: var(--space-4);
  border-radius: var(--radius-md);
}

.container--primary {
  background-color: var(--color-primary-600);
  color: white;
}

.container--secondary {
  background-color: var(--color-gray-100);
  color: var(--color-gray-900);
}

.container--sm {
  padding: var(--space-2);
}

.container--md {
  padding: var(--space-4);
}

.container--lg {
  padding: var(--space-6);
}
```

5. **Test File**:
```tsx
import { render, screen } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const mockClick = vi.fn();
    render(<ComponentName title="Test" onClick={mockClick} />);
    
    screen.getByText('Test').click();
    expect(mockClick).toHaveBeenCalled();
  });
});
```

6. **Index File**:
```tsx
export { ComponentName } from './ComponentName';
export type { ComponentNameProps } from './ComponentName';
```

### Component Best Practices

1. **Props Design**:
   - Keep props minimal and focused
   - Use sensible defaults
   - Provide clear TypeScript types
   - Document complex props

2. **Styling**:
   - Use CSS Modules for scoped styles
   - Follow design system tokens
   - Implement responsive design
   - Support theme variations

3. **Accessibility**:
   - Include proper ARIA labels
   - Support keyboard navigation
   - Maintain color contrast
   - Provide screen reader support

4. **Performance**:
   - Use React.memo for expensive components
   - Implement proper memoization
   - Optimize re-renders
   - Lazy load when appropriate

5. **Testing**:
   - Test all user interactions
   - Verify accessibility features
   - Test edge cases
   - Maintain good coverage

## 📚 Component Examples

### Complex Component Example
```tsx
import React, { useState, useCallback } from 'react';
import styles from './DataTable.module.css';

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowSelect?: (rows: T[]) => void;
  selectable?: boolean;
  sortable?: boolean;
  pagination?: boolean;
  pageSize?: number;
}

export const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  onRowSelect,
  selectable = false,
  sortable = false,
  pagination = false,
  pageSize = 10
}: DataTableProps<T>) => {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const handleSort = useCallback((column: keyof T) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  }, [sortColumn, sortDirection]);

  const handleRowSelect = useCallback((index: number) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRows(newSelected);
    onRowSelect?.(data.filter((_, i) => newSelected.has(i)));
  }, [selectedRows, data, onRowSelect]);

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            {selectable && <th className={styles.checkboxCell} />}
            {columns.map(column => (
              <th 
                key={String(column.key)}
                className={`${styles.headerCell} ${sortable ? styles.sortable : ''}`}
                onClick={() => sortable && handleSort(column.key)}
              >
                {column.header}
                {sortable && sortColumn === column.key && (
                  <span className={styles.sortIndicator}>
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className={styles.tableRow}>
              {selectable && (
                <td className={styles.checkboxCell}>
                  <input
                    type="checkbox"
                    checked={selectedRows.has(index)}
                    onChange={() => handleRowSelect(index)}
                  />
                </td>
              )}
              {columns.map(column => (
                <td key={String(column.key)} className={styles.cell}>
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

This component library provides a solid foundation for building consistent, accessible, and performant user interfaces across the Leadsbot application. 