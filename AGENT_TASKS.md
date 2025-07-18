# Cursor Agent Tasks for Leadsbot Development

## Phase 1: Foundation & Core Components (Day 1)

### 1.1 Setup Project Structure
- [ ] Create component directories: `src/components/ui/`, `src/components/layout/`, `src/components/forms/`
- [ ] Create utility directories: `src/hooks/`, `src/utils/`, `src/types/`
- [ ] Update `src/main.tsx` to import global styles
- [ ] Create basic TypeScript interfaces for leads, users, and forms

### 1.2 Core UI Components
- [ ] **Button Component** (`src/components/ui/Button/`)
  - Primary, secondary, outline, ghost variants
  - Small, medium, large sizes
  - Loading states
  - Icon support
  
- [ ] **Card Component** (`src/components/ui/Card/`)
  - Header, body, footer sections
  - Hover effects
  - Shadow variations
  
- [ ] **Input Component** (`src/components/ui/Input/`)
  - Text, email, password, textarea variants
  - Error states
  - Label and helper text
  
- [ ] **Modal Component** (`src/components/ui/Modal/`)
  - Backdrop
  - Close functionality
  - Responsive design

### 1.3 Layout Components
- [ ] **Header Component** (`src/components/layout/Header/`)
  - Logo/branding
  - Navigation menu
  - User profile dropdown
  - Search functionality
  
- [ ] **Sidebar Component** (`src/components/layout/Sidebar/`)
  - Navigation items
  - Collapsible sections
  - Active states
  
- [ ] **Layout Wrapper** (`src/components/layout/Layout/`)
  - Header + Sidebar + Main content
  - Responsive behavior

## Phase 2: Authentication & Dashboard (Day 2)

### 2.1 Authentication Pages
- [ ] **Login Page** (`src/pages/auth/Login/`)
  - Form with email/password
  - Error handling
  - "Remember me" functionality
  
- [ ] **Register Page** (`src/pages/auth/Register/`)
  - User registration form
  - Password confirmation
  - Terms acceptance

### 2.2 Dashboard
- [ ] **Dashboard Page** (`src/pages/dashboard/`)
  - Welcome message
  - Quick stats cards
  - Recent leads table
  - Action buttons

### 2.3 Data Tables
- [ ] **Table Component** (`src/components/ui/Table/`)
  - Sortable columns
  - Pagination
  - Row selection
  - Action buttons per row

## Phase 3: Lead Management (Day 3)

### 3.1 Lead Components
- [ ] **Lead Card** (`src/components/leads/LeadCard/`)
  - Lead information display
  - Status indicators
  - Quick actions
  
- [ ] **Lead Form** (`src/components/forms/LeadForm/`)
  - Add/edit lead form
  - Validation
  - File upload for documents

### 3.2 Lead Pages
- [ ] **Leads List Page** (`src/pages/leads/`)
  - Filterable table
  - Search functionality
  - Bulk actions
  
- [ ] **Lead Detail Page** (`src/pages/leads/[id]/`)
  - Lead information
  - Communication history
  - Notes section

## Phase 4: AI Integration & Settings (Day 4)

### 4.1 AI Features
- [ ] **AI Chat Interface** (`src/components/ai/ChatInterface/`)
  - Message history
  - Input field
  - Typing indicators
  
- [ ] **AI Settings** (`src/components/settings/AISettings/`)
  - Model selection
  - Response customization
  - Training data management

### 4.2 Settings Pages
- [ ] **User Settings** (`src/pages/settings/`)
  - Profile information
  - Notification preferences
  - Password change
  
- [ ] **System Settings** (`src/pages/settings/system/`)
  - AI configuration
  - Integration settings
  - Backup/restore

## Phase 5: Analytics & Reports (Day 5)

### 5.1 Analytics Components
- [ ] **Chart Components** (`src/components/analytics/`)
  - Line charts for lead trends
  - Bar charts for conversion rates
  - Pie charts for lead sources
  
- [ ] **Metrics Cards** (`src/components/analytics/MetricsCard/`)
  - Key performance indicators
  - Trend indicators
  - Comparison periods

### 5.2 Reports Pages
- [ ] **Analytics Dashboard** (`src/pages/analytics/`)
  - Overview charts
  - Date range selectors
  - Export functionality

## Development Guidelines for Agents

### Code Quality Standards
- Use TypeScript for all components
- Implement proper error handling
- Add loading states for async operations
- Ensure accessibility (ARIA labels, keyboard navigation)
- Write clean, documented code

### Styling Standards
- Use CSS Modules for all styling
- Follow the design token system
- Implement responsive design
- Add hover and focus states
- Ensure consistent spacing

### Component Structure
```typescript
// Example component structure
src/components/ui/Button/
├── Button.tsx
├── Button.module.css
└── index.ts
```

### Testing Considerations
- Test responsive behavior
- Verify accessibility
- Check cross-browser compatibility
- Validate form inputs
- Test error states

### Performance Optimization
- Lazy load components where appropriate
- Optimize images and assets
- Minimize bundle size
- Use React.memo for expensive components
- Implement proper loading states

## Agent Instructions

1. **Start with Phase 1** and work through each task systematically
2. **Create components incrementally** - build basic versions first, then enhance
3. **Test each component** as you build it
4. **Follow the design system** strictly - use tokens and maintain consistency
5. **Document any issues** or decisions in comments
6. **Commit frequently** with descriptive messages
7. **Ask for clarification** if requirements are unclear

## Success Criteria

- All components follow the premium theme design
- Responsive design works on all screen sizes
- TypeScript compilation passes without errors
- ESLint passes without warnings
- Components are reusable and well-documented
- Accessibility standards are met
- Performance is optimized 