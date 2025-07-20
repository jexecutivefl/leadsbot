import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock AWS Amplify
vi.mock('aws-amplify', () => ({
  Amplify: {
    configure: vi.fn(),
    getConfig: vi.fn(() => ({})),
  },
  Auth: {
    signIn: vi.fn(),
    signOut: vi.fn(),
    getCurrentUser: vi.fn(),
    fetchAuthSession: vi.fn(),
  },
  API: {
    graphql: vi.fn(),
    post: vi.fn(),
    get: vi.fn(),
  },
  Storage: {
    get: vi.fn(),
    put: vi.fn(),
    remove: vi.fn(),
  },
}))

// Mock CSS Modules
vi.mock('*.module.css', () => ({
  default: {
    container: 'container',
    header: 'header',
    sidebar: 'sidebar',
    content: 'content',
    button: 'button',
    card: 'card',
    input: 'input',
    modal: 'modal',
    table: 'table',
    form: 'form',
    label: 'label',
    error: 'error',
    success: 'success',
    loading: 'loading',
    active: 'active',
    disabled: 'disabled',
  },
}))

// Global test utilities
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

global.matchMedia = vi.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
})) 