# Design System

## 🎨 Color Palette

### Primary Colors
```css
:root {
  --color-primary-900: #1e3a8a;  /* Deep blue */
  --color-primary-600: #3b82f6;  /* Bright blue */
  --color-primary-500: #3b82f6;  /* Base blue */
  --color-primary-400: #60a5fa;  /* Light blue */
  --color-primary-100: #dbeafe;  /* Very light blue */
}
```

### Neutral Colors
```css
:root {
  --color-gray-900: #111827;  /* Darkest gray */
  --color-gray-800: #1f2937;  /* Dark gray */
  --color-gray-700: #374151;  /* Medium dark gray */
  --color-gray-600: #4b5563;  /* Medium gray */
  --color-gray-500: #6b7280;  /* Base gray */
  --color-gray-400: #9ca3af;  /* Light gray */
  --color-gray-300: #d1d5db;  /* Lighter gray */
  --color-gray-200: #e5e7eb;  /* Very light gray */
  --color-gray-100: #f3f4f6;  /* Lightest gray */
  --color-gray-50: #f9fafb;   /* Off white */
}
```

### Semantic Colors
```css
:root {
  --color-success: #10b981;   /* Green */
  --color-warning: #f59e0b;   /* Amber */
  --color-error: #ef4444;     /* Red */
  --color-info: #3b82f6;      /* Blue */
}
```

## 📝 Typography

### Font Family
```css
:root {
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
```

### Font Sizes
```css
:root {
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 1.875rem;  /* 30px */
  --font-size-4xl: 2.25rem;   /* 36px */
}
```

### Font Weights
```css
:root {
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
}
```

### Line Heights
```css
:root {
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
}
```

## 📏 Spacing System

### Base Unit: 8px
```css
:root {
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
}
```

## 🎯 Border Radius

```css
:root {
  --radius-sm: 0.25rem;   /* 4px */
  --radius-md: 0.375rem;  /* 6px */
  --radius-lg: 0.5rem;    /* 8px */
  --radius-xl: 0.75rem;   /* 12px */
  --radius-2xl: 1rem;     /* 16px */
  --radius-full: 9999px;  /* Full circle */
}
```

## 🌟 Shadows

```css
:root {
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
```

## 🎨 Component Styles

### Buttons
```css
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-normal);
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  border: none;
}

.button--primary {
  background-color: var(--color-primary-600);
  color: white;
}

.button--primary:hover {
  background-color: var(--color-primary-700);
}

.button--secondary {
  background-color: var(--color-gray-100);
  color: var(--color-gray-900);
  border: 1px solid var(--color-gray-300);
}

.button--secondary:hover {
  background-color: var(--color-gray-200);
}
```

### Cards
```css
.card {
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--space-6);
  border: 1px solid var(--color-gray-200);
}

.card--elevated {
  box-shadow: var(--shadow-lg);
}

.card--interactive:hover {
  box-shadow: var(--shadow-xl);
  transform: translateY(-2px);
  transition: all 0.2s ease-in-out;
}
```

### Forms
```css
.input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
  transition: border-color 0.2s ease-in-out;
}

.input:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input--error {
  border-color: var(--color-error);
}

.input--error:focus {
  border-color: var(--color-error);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}
```

## 📱 Responsive Breakpoints

```css
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}
```

### Usage
```css
/* Mobile first approach */
.container {
  padding: var(--space-4);
}

@media (min-width: 768px) {
  .container {
    padding: var(--space-6);
  }
}

@media (min-width: 1024px) {
  .container {
    padding: var(--space-8);
  }
}
```

## 🎭 Interactive States

### Hover Effects
```css
.interactive-element {
  transition: all 0.2s ease-in-out;
}

.interactive-element:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg);
}
```

### Focus States
```css
.focusable-element:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
```

### Loading States
```css
.loading {
  opacity: 0.6;
  pointer-events: none;
}

.loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin: -10px 0 0 -10px;
  border: 2px solid var(--color-gray-300);
  border-top-color: var(--color-primary-500);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

## 🎨 Theme Variations

### Light Theme (Default)
```css
:root {
  --bg-primary: white;
  --bg-secondary: var(--color-gray-50);
  --text-primary: var(--color-gray-900);
  --text-secondary: var(--color-gray-600);
  --border-color: var(--color-gray-200);
}
```

### Dark Theme
```css
[data-theme="dark"] {
  --bg-primary: var(--color-gray-900);
  --bg-secondary: var(--color-gray-800);
  --text-primary: var(--color-gray-100);
  --text-secondary: var(--color-gray-400);
  --border-color: var(--color-gray-700);
}
```

## 📐 Layout Guidelines

### Container Max Widths
```css
.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

.container--sm {
  max-width: 640px;
}

.container--md {
  max-width: 768px;
}

.container--lg {
  max-width: 1024px;
}

.container--xl {
  max-width: 1280px;
}
```

### Grid System
```css
.grid {
  display: grid;
  gap: var(--space-6);
}

.grid--cols-1 {
  grid-template-columns: repeat(1, 1fr);
}

.grid--cols-2 {
  grid-template-columns: repeat(2, 1fr);
}

.grid--cols-3 {
  grid-template-columns: repeat(3, 1fr);
}

@media (max-width: 768px) {
  .grid--cols-2,
  .grid--cols-3 {
    grid-template-columns: repeat(1, 1fr);
  }
}
```

## 🎯 Accessibility

### Color Contrast
- **Normal Text**: Minimum 4.5:1 contrast ratio
- **Large Text**: Minimum 3:1 contrast ratio
- **Interactive Elements**: Minimum 3:1 contrast ratio

### Focus Indicators
```css
.focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}
```

### Screen Reader Support
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

## 📚 Usage Examples

### Component Implementation
```tsx
import styles from './Button.module.css';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick
}) => {
  return (
    <button
      className={`${styles.button} ${styles[`button--${variant}`]} ${styles[`button--${size}`]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

### CSS Module Implementation
```css
/* Button.module.css */
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  border: none;
}

.button--primary {
  background-color: var(--color-primary-600);
  color: white;
}

.button--secondary {
  background-color: var(--color-gray-100);
  color: var(--color-gray-900);
  border: 1px solid var(--color-gray-300);
}

.button--sm {
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-sm);
}

.button--md {
  padding: var(--space-3) var(--space-4);
  font-size: var(--font-size-base);
}

.button--lg {
  padding: var(--space-4) var(--space-6);
  font-size: var(--font-size-lg);
}
``` 