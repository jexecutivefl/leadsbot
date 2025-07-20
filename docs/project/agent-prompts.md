# Cursor Agent Prompts for Leadsbot Development

## General Development Prompts

### Starting a New Component
```
Create a new React component for [ComponentName] following these requirements:
- Use TypeScript with proper interfaces
- Implement CSS Modules styling with premium theme design
- Follow the design token system in src/styles/tokens.css
- Include proper accessibility attributes
- Add loading and error states
- Make it responsive for mobile/tablet/desktop
- Export from index.ts file

Requirements:
[Specific component requirements]

File structure should be:
src/components/[category]/[ComponentName]/
├── [ComponentName].tsx
├── [ComponentName].module.css
└── index.ts
```

### Styling a Component
```
Style this component using CSS Modules with premium admin theme design:
- Use design tokens from src/styles/tokens.css
- Implement hover and focus states
- Add subtle animations and transitions
- Ensure responsive design
- Follow the color palette (primary blues, elegant grays)
- Use proper spacing (8px-based system)
- Add subtle shadows and modern styling
- Make it look like Cuba, Porto, or Metronic themes
```

### Creating a Page
```
Create a new page component for [PageName] with:
- Proper TypeScript interfaces
- Responsive layout using the Layout component
- Integration with AWS Amplify for data/authentication
- Error boundaries and loading states
- SEO-friendly structure
- Accessibility compliance
- Premium theme styling

The page should include:
[Specific page requirements]
```

## Specific Component Prompts

### Button Component
```
Create a premium Button component with:
- Variants: primary, secondary, outline, ghost, destructive
- Sizes: small (32px), medium (40px), large (48px)
- States: default, hover, active, disabled, loading
- Icon support (leading/trailing)
- Proper TypeScript props interface
- CSS Modules styling with premium design
- Accessibility features (ARIA labels, keyboard navigation)
- Smooth transitions and micro-interactions
```

### Card Component
```
Build a Card component with premium styling:
- Header, body, and footer sections
- Optional actions in header
- Hover effects with subtle lift
- Shadow variations (sm, md, lg)
- Responsive padding and spacing
- Border radius and modern styling
- Support for different content types
- Loading skeleton state
```

### Input Component
```
Create a premium Input component with:
- Types: text, email, password, textarea, select
- Label and helper text support
- Error states with validation messages
- Focus states with brand color outline
- Icon support (leading/trailing)
- Disabled and readonly states
- Character count for textareas
- Proper form integration
- Accessibility features
```

### Table Component
```
Build a premium Table component with:
- Sortable columns with indicators
- Pagination controls
- Row selection (single/multiple)
- Action buttons per row
- Responsive design (horizontal scroll on mobile)
- Loading states with skeletons
- Empty states
- Export functionality
- Search and filtering
```

### Modal Component
```
Create a Modal component with:
- Backdrop with click-to-close
- ESC key to close
- Focus trap for accessibility
- Responsive sizing
- Header, body, and footer sections
- Close button in header
- Smooth enter/exit animations
- Z-index management
- Body scroll lock when open
```

## Layout Component Prompts

### Header Component
```
Build a premium Header component with:
- Logo/branding on the left
- Navigation menu in center
- User profile dropdown on right
- Search functionality
- Notification bell
- Mobile hamburger menu
- Sticky positioning
- Shadow on scroll
- Responsive design
```

### Sidebar Component
```
Create a premium Sidebar component with:
- Navigation items with icons
- Collapsible sections
- Active state indicators
- Hover effects
- Mobile overlay mode
- Smooth collapse/expand animations
- User profile section at bottom
- Branding at top
- Responsive behavior
```

### Layout Component
```
Build a Layout wrapper that:
- Combines Header, Sidebar, and main content
- Handles responsive behavior
- Manages sidebar collapse state
- Provides proper spacing and structure
- Supports different page layouts
- Handles mobile navigation
- Maintains consistent spacing
```

## Page-Specific Prompts

### Dashboard Page
```
Create a premium Dashboard page with:
- Welcome message with user name
- Stats cards showing key metrics
- Recent leads table
- Quick action buttons
- Charts for lead trends
- Responsive grid layout
- Loading states for data
- Error handling
- Real-time updates
```

### Login Page
```
Build a premium Login page with:
- Clean, centered form design
- Email and password inputs
- Remember me checkbox
- Forgot password link
- Sign up link
- Form validation
- Error message display
- Loading state on submit
- Responsive design
- Integration with AWS Amplify Auth
```

### Leads List Page
```
Create a premium Leads list page with:
- Search and filter functionality
- Sortable data table
- Bulk action buttons
- Add new lead button
- Pagination controls
- Export options
- Status indicators
- Quick action buttons per row
- Responsive design
- Loading and empty states
```

## AI Integration Prompts

### Chat Interface
```
Build a premium AI Chat interface with:
- Message history display
- User and AI message styling
- Typing indicators
- Message input with send button
- File attachment support
- Message timestamps
- Scroll to bottom functionality
- Responsive design
- Loading states
- Error handling
```

### AI Settings
```
Create AI Settings component with:
- Model selection dropdown
- Response customization options
- Training data management
- API key configuration
- Usage statistics
- Test conversation button
- Save/cancel actions
- Form validation
- Responsive design
```

## Utility Prompts

### Custom Hooks
```
Create a custom React hook for [HookName] that:
- Handles [specific functionality]
- Returns proper TypeScript types
- Includes error handling
- Has loading states
- Is reusable across components
- Follows React best practices
- Includes proper cleanup
```

### Utility Functions
```
Create utility functions for [Functionality] that:
- Are pure functions where possible
- Have proper TypeScript types
- Include error handling
- Are well-documented
- Are easily testable
- Follow functional programming principles
```

## Testing Prompts

### Component Testing
```
Add comprehensive tests for [ComponentName]:
- Unit tests for all props and states
- Integration tests for user interactions
- Accessibility tests
- Responsive design tests
- Error state tests
- Loading state tests
- Snapshot tests for UI consistency
```

## Performance Prompts

### Optimization
```
Optimize [ComponentName] for performance:
- Use React.memo where appropriate
- Implement lazy loading
- Optimize re-renders
- Add proper loading states
- Implement error boundaries
- Optimize bundle size
- Add performance monitoring
```

## Accessibility Prompts

### Accessibility Enhancement
```
Enhance accessibility for [ComponentName]:
- Add proper ARIA labels
- Implement keyboard navigation
- Ensure color contrast compliance
- Add screen reader support
- Include focus management
- Test with accessibility tools
- Follow WCAG 2.1 AA guidelines
```

## Error Handling Prompts

### Error Boundaries
```
Create error boundaries for [Component/Page]:
- Catch and display errors gracefully
- Provide user-friendly error messages
- Include retry functionality
- Log errors for debugging
- Maintain app stability
- Show fallback UI
```

## Integration Prompts

### AWS Amplify Integration
```
Integrate [Component/Page] with AWS Amplify:
- Use Amplify Auth for authentication
- Connect to AppSync for data
- Handle loading and error states
- Implement proper error handling
- Use Amplify UI components where appropriate
- Follow Amplify best practices
- Add proper TypeScript types
``` 