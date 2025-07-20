# AI Agent Instructions for Leadsbot Development

## 🎯 Project Overview
You are building an AI-powered real estate lead follow-up agent with a premium admin theme. The app should look and feel like Cuba, Porto, or Metronic themes.

## 📋 Implementation Priority Matrix

### 🔥 HIGH PRIORITY (Complete First)
1. **Core UI Components** - Foundation for all other components
2. **Layout System** - Required for page structure
3. **Authentication** - Required for app functionality
4. **Data Layer** - Required for lead management

### 🟡 MEDIUM PRIORITY (Complete Second)
1. **Lead Management** - Core business functionality
2. **AI Chat Interface** - Key differentiator
3. **Analytics Dashboard** - User value proposition

### 🟢 LOW PRIORITY (Complete Last)
1. **Advanced Settings** - Nice to have features
2. **Performance Optimization** - Polish phase
3. **Advanced Analytics** - Enhancement features

## 🚀 Daily Implementation Guide

### Day 1: Project Foundation & Core UI Components
**Priority Order:**
1. Verify project structure and directories
2. Create Button component (most used)
3. Create Input component
4. Create Card component
5. Create Modal component

### Day 2: Layout System & Authentication Foundation
**Priority Order:**
1. Create Header component
2. Create Sidebar component
3. Create Layout wrapper
4. Create Modal component

### Day 3: Authentication System
**Priority Order:**
1. Build Login page
2. Build Register page
3. Create Protected Route wrapper

### Day 4: Dashboard & Data Layer Foundation
**Priority Order:**
1. Create Lead data models
2. Create Metrics Card component
3. Build Dashboard page
4. Create Recent Leads Table component

### Day 5: Lead Management System
**Priority Order:**
1. Build Lead List page
2. Build Lead Detail page
3. Create Lead Form component

### Day 6: AI Chat Interface
**Priority Order:**
1. Create Chat Interface component
2. Build AI Chat page
3. Integrate AI service

### Day 7: Analytics & Polish
**Priority Order:**
1. Create Chart components
2. Build Analytics page
3. Final polish and testing

## 🎨 Design System Rules

### Colors
- **Primary**: Use `var(--color-primary-500)` (#3b82f6) for main actions
- **Secondary**: Use `var(--color-primary-800)` (#1e3a8a) for emphasis
- **Background**: Use `var(--color-gray-50)` for main background
- **Surface**: Use `var(--color-gray-100)` for cards and components
- **Text**: Use `var(--color-gray-900)` for headings, `var(--color-gray-700)` for body

### Typography
- **Font**: Inter (already imported in global.css)
- **Headings**: Use semantic h1-h6 with proper font weights
- **Body**: 16px base size with 1.5 line height
- **Small text**: 14px for secondary information

### Spacing
- **Base unit**: 8px
- **Common spaces**: 16px, 24px, 32px, 48px, 64px
- **Component padding**: 24px for cards, 16px for buttons
- **Section spacing**: 48px between major sections

### Shadows
- **Cards**: `var(--shadow-md)` for default elevation
- **Buttons**: `var(--shadow-sm)` for subtle depth
- **Modals**: `var(--shadow-lg)` for prominent elevation

## 🏗️ Component Development Guidelines

### File Structure
```
src/components/[category]/[ComponentName]/
├── [ComponentName].tsx
├── [ComponentName].module.css
└── index.ts
```

### CSS Modules Naming
- Use camelCase for class names
- Prefix with component name: `.button`, `.buttonPrimary`, `.buttonLoading`
- Use BEM-like structure: `.card`, `.cardHeader`, `.cardBody`

### TypeScript Standards
- Always define proper interfaces for props
- Use strict typing
- Export types from component files
- Use React.FC for functional components

### Accessibility
- Add proper ARIA labels
- Ensure keyboard navigation
- Use semantic HTML elements
- Test with screen readers
- Maintain color contrast ratios

## 🚀 Development Workflow

### 1. Component Creation Process
1. Create the directory structure
2. Define TypeScript interfaces
3. Create the component file
4. Create the CSS module file
5. Create the index.ts export
6. Test the component
7. Document any issues

### 2. Styling Process
1. Start with basic layout and spacing
2. Add colors and typography
3. Implement hover and focus states
4. Add animations and transitions
5. Ensure responsive design
6. Test across different screen sizes

### 3. Testing Checklist
- [ ] Component renders without errors
- [ ] All props work correctly
- [ ] Responsive design works
- [ ] Accessibility features work
- [ ] Loading states display properly
- [ ] Error states handle gracefully
- [ ] Hover and focus states work
- [ ] TypeScript compilation passes

## 📱 Responsive Design Rules

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile-First Approach
- Start with mobile styles
- Use `@media (min-width: 768px)` for tablet+
- Use `@media (min-width: 1024px)` for desktop+

### Touch Targets
- Minimum 44px for interactive elements
- Adequate spacing between touch targets
- Clear visual feedback for touch interactions

## 🔧 Technical Requirements

### Performance
- Use React.memo for expensive components
- Implement proper loading states
- Optimize re-renders
- Lazy load components where appropriate

### Error Handling
- Implement error boundaries
- Show user-friendly error messages
- Log errors for debugging
- Provide retry mechanisms

### State Management
- Use React hooks for local state
- Keep state as close to where it's used as possible
- Use context for global state when needed
- Implement proper cleanup in useEffect

## 🎯 Quality Standards

### Code Quality
- Follow ESLint rules
- Use consistent naming conventions
- Write clean, readable code
- Add comments for complex logic
- Keep components focused and single-purpose

### UI/UX Quality
- Consistent visual hierarchy
- Clear user feedback
- Intuitive interactions
- Fast loading times
- Smooth animations

### Premium Theme Standards
- Professional appearance
- Modern design patterns
- Consistent spacing and typography
- Subtle animations and micro-interactions
- High-quality visual elements

## 🚨 Common Issues & Solutions

### CSS Modules Issues
- **Problem**: Styles not applying
- **Solution**: Check import path and class name spelling

### TypeScript Issues
- **Problem**: Type errors
- **Solution**: Define proper interfaces and use strict typing

### Responsive Issues
- **Problem**: Layout breaks on mobile
- **Solution**: Use flexbox/grid with proper breakpoints

### Performance Issues
- **Problem**: Slow rendering
- **Solution**: Use React.memo and optimize re-renders

## 📞 When to Ask for Help

### Ask for clarification when:
- Requirements are unclear
- Design decisions need input
- Technical approach needs validation
- Dependencies need to be added

### Don't ask for:
- Basic React/TypeScript questions
- Simple styling issues
- Standard component patterns

## ✅ Success Metrics

### Daily Goals
- Complete assigned components/pages
- All code compiles without errors
- Components are responsive
- Accessibility standards met
- Premium theme quality achieved

### End of Day Checklist
- [ ] All planned components completed
- [ ] Code committed with descriptive messages
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Components tested on different screen sizes
- [ ] Documentation updated if needed

## 🎨 Premium Theme Checklist

For each component, ensure:
- [ ] Professional appearance
- [ ] Consistent with design system
- [ ] Proper spacing and typography
- [ ] Hover and focus states
- [ ] Smooth animations
- [ ] Responsive design
- [ ] Accessibility compliance
- [ ] Performance optimized

Remember: The goal is to create a premium admin theme that rivals Cuba, Porto, and Metronic in quality and user experience. 