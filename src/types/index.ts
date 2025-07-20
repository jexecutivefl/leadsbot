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

// AWS Amplify Generated Types (from Schema)
export interface AmplifyLead {
  id: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone: string;
  status: LeadStatus | null;
  source: LeadSource | null;
  assignedToId?: string | null;
  assignedTo?: any;
  notes?: string | null;
  documents?: any;
  communications?: any;
  createdAt: string;
  updatedAt: string;
  lastContacted?: string | null;
  priority?: 'hot' | 'warm' | 'cold' | null;
  tags?: string[] | null;
  propertyInterest?: any;
  budget?: any;
  timeline?: 'immediate' | 'one_to_three_months' | 'three_to_six_months' | 'six_to_twelve_months' | 'just_browsing' | null;
  preApproved?: boolean | null;
  consentGiven?: boolean | null;
  optOutDate?: string | null;
  aiConversationActive?: boolean | null;
  lastAiMessage?: string | null;
  totalMessages?: number | null;
  responseRate?: number | null;
  nextFollowUp?: string | null;
}

// Lead Types (Compatible with our app)
export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone: string;
  status: LeadStatus | null;
  source: LeadSource | null;
  assignedToId?: string | null;
  assignedTo?: any;
  notes?: string | null;
  documents?: Document[];
  communications: Communication[];
  createdAt: string;
  updatedAt: string;
  lastContacted?: string;
  priority?: 'hot' | 'warm' | 'cold';
  tags?: string[] | null;
  propertyInterest?: any;
  budget?: any;
  timeline?: 'immediate' | 'one_to_three_months' | 'three_to_six_months' | 'six_to_twelve_months' | 'just_browsing';
  preApproved?: boolean;
  consentGiven?: boolean;
  optOutDate?: string;
  aiConversationActive?: boolean;
  lastAiMessage?: string;
  totalMessages?: number;
  responseRate?: number | null;
  nextFollowUp?: string;
}

// Type adapter functions
export const adaptAmplifyLeadToLead = (amplifyLead: AmplifyLead): Lead => {
  return {
    ...amplifyLead,
    lastContacted: amplifyLead.lastContacted || undefined,
    priority: amplifyLead.priority || undefined,
    timeline: amplifyLead.timeline || undefined,
    preApproved: amplifyLead.preApproved || undefined,
    consentGiven: amplifyLead.consentGiven || undefined,
    optOutDate: amplifyLead.optOutDate || undefined,
    aiConversationActive: amplifyLead.aiConversationActive || undefined,
    lastAiMessage: amplifyLead.lastAiMessage || undefined,
    totalMessages: amplifyLead.totalMessages || undefined,
    responseRate: amplifyLead.responseRate || undefined,
    nextFollowUp: amplifyLead.nextFollowUp || undefined,
    documents: amplifyLead.documents ? [] : [], // Convert to Document[] if needed
    communications: amplifyLead.communications ? [] : [], // Convert to Communication[] if needed
  };
};

export const adaptLeadToAmplifyLead = (lead: Lead): AmplifyLead => {
  return {
    ...lead,
    documents: undefined, // Remove documents for Amplify
    communications: undefined, // Remove communications for Amplify
  };
};

export type LeadStatus = 
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'proposal'
  | 'negotiation'
  | 'closedWon'
  | 'closedLost'
  | 'nurture'
  | 'optedOut';

export type LeadSource = 
  | 'website'
  | 'referral'
  | 'socialMedia'
  | 'coldOutreach'
  | 'event'
  | 'advertising'
  | 'zillow'
  | 'realtorCom'
  | 'homesCom'
  | 'manualEntry'
  | 'emailParsing'
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
  size?: 'small' | 'medium' | 'large' | 'sm';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'leading' | 'trailing';
  children: React.ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'number' | 'tel' | 'date';
  label?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  maxLength?: number;
  icon?: React.ReactNode;
  iconPosition?: 'leading' | 'trailing';
  className?: string;
  options?: { value: string; label: string }[];
  rows?: number;
}

export interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  className?: string;
  onClick?: () => void;
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

// Table Component Types
export interface TableColumn<T = any> {
  key: string;
  header: string;
  sortable?: boolean;
  width?: string;
  render?: (item: T) => React.ReactNode;
}

export interface TablePagination {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface TableProps<T extends { id: string }> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  selectedRows?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  pagination?: TablePagination;
  className?: string;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
} 