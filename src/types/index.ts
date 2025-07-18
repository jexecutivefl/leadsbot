// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'agent' | 'manager';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// Lead Types
export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: LeadStatus;
  source: LeadSource;
  assignedTo?: string;
  notes?: string;
  documents?: Document[];
  communications: Communication[];
  createdAt: string;
  updatedAt: string;
  lastContacted?: string;
}

export type LeadStatus = 
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'proposal'
  | 'negotiation'
  | 'closed_won'
  | 'closed_lost'
  | 'nurture';

export type LeadSource = 
  | 'website'
  | 'referral'
  | 'social_media'
  | 'cold_outreach'
  | 'event'
  | 'advertising'
  | 'other';

// Communication Types
export interface Communication {
  id: string;
  leadId: string;
  type: 'email' | 'call' | 'text' | 'ai_chat';
  direction: 'inbound' | 'outbound';
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  metadata?: Record<string, any>;
}

// Document Types
export interface Document {
  id: string;
  leadId: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
}

// AI Chat Types
export interface ChatMessage {
  id: string;
  leadId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metadata?: {
    model?: string;
    tokens?: number;
    responseTime?: number;
  };
}

export interface AIConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  customInstructions?: string;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    custom?: (value: any) => string | null;
  };
}

// UI Component Types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'leading' | 'trailing';
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'textarea' | 'select';
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'leading' | 'trailing';
  className?: string;
}

export interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'full';
  className?: string;
}

// Table Types
export interface TableColumn<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  selectedRows?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  className?: string;
}

// Analytics Types
export interface AnalyticsData {
  totalLeads: number;
  newLeads: number;
  conversionRate: number;
  averageResponseTime: number;
  leadsBySource: { source: string; count: number }[];
  leadsByStatus: { status: string; count: number }[];
  monthlyTrends: { month: string; leads: number; conversions: number }[];
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// Theme Types
export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// Navigation Types
export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon?: React.ReactNode;
  children?: NavigationItem[];
  badge?: number;
}

// Settings Types
export interface UserSettings {
  theme: Theme;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  aiPreferences: {
    autoRespond: boolean;
    responseStyle: 'professional' | 'casual' | 'friendly';
    maxResponseLength: number;
  };
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
} 