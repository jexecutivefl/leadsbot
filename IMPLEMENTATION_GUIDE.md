# Implementation Guide - Remaining Features

## 🚀 Developer Implementation Roadmap

This guide provides step-by-step instructions for implementing the remaining features in the Leadsbot application. Follow these instructions in order for optimal results.

---

## 📋 PHASE 4 IMPLEMENTATION

### Step 1: Set Up Directory Structure

```bash
# Create all required directories
mkdir -p src/hooks
mkdir -p src/utils
mkdir -p src/services/{ai,analytics,lead,auth}
mkdir -p src/contexts
mkdir -p src/components/ai/{ChatInterface,MessageBubble,TypingIndicator,ChatInput}
mkdir -p src/components/settings/{AISettings,UserSettings,SystemSettings}
mkdir -p src/components/forms/{LeadForm,SettingsForm}
mkdir -p src/pages/settings/{user,system,ai}
mkdir -p src/pages/chat
```

### Step 2: Install Required Dependencies

```bash
npm install recharts react-hook-form react-query socket.io-client \
            react-markdown date-fns react-hotkeys-hook react-dropzone \
            emoji-picker-react react-virtualized jspdf xlsx \
            @aws-sdk/client-bedrock
```

### Step 3: Create Base Utility Files

#### `src/utils/dateUtils.ts`
```typescript
import { format, formatDistanceToNow } from 'date-fns';

export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return format(d, 'MMM dd, yyyy');
};

export const formatTime = (date: Date | string): string => {
  const d = new Date(date);
  return format(d, 'HH:mm');
};

export const formatRelativeTime = (date: Date | string): string => {
  const d = new Date(date);
  return formatDistanceToNow(d, { addSuffix: true });
};

export const formatChatTime = (date: Date | string): string => {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const hours = diff / (1000 * 60 * 60);
  
  if (hours < 24) {
    return format(d, 'HH:mm');
  } else if (hours < 168) { // 7 days
    return format(d, 'EEE HH:mm');
  } else {
    return format(d, 'MMM dd, HH:mm');
  }
};
```

#### `src/utils/apiUtils.ts`
```typescript
export const createApiClient = (baseURL: string) => {
  return {
    get: async (endpoint: string) => {
      const response = await fetch(`${baseURL}${endpoint}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    },
    
    post: async (endpoint: string, data: any) => {
      const response = await fetch(`${baseURL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    },
    
    put: async (endpoint: string, data: any) => {
      const response = await fetch(`${baseURL}${endpoint}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    },
    
    delete: async (endpoint: string) => {
      const response = await fetch(`${baseURL}${endpoint}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.ok;
    },
  };
};
```

#### `src/utils/validationUtils.ts`
```typescript
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

export const getValidationErrors = (data: any, rules: any): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  Object.keys(rules).forEach(field => {
    const value = data[field];
    const fieldRules = rules[field];
    
    if (fieldRules.required && !validateRequired(value)) {
      errors[field] = `${field} is required`;
      return;
    }
    
    if (fieldRules.email && !validateEmail(value)) {
      errors[field] = 'Please enter a valid email address';
      return;
    }
    
    if (fieldRules.phone && !validatePhone(value)) {
      errors[field] = 'Please enter a valid phone number';
      return;
    }
    
    if (fieldRules.minLength && !validateMinLength(value, fieldRules.minLength)) {
      errors[field] = `${field} must be at least ${fieldRules.minLength} characters`;
      return;
    }
    
    if (fieldRules.maxLength && !validateMaxLength(value, fieldRules.maxLength)) {
      errors[field] = `${field} must be no more than ${fieldRules.maxLength} characters`;
      return;
    }
  });
  
  return errors;
};
```

### Step 4: Create React Contexts

#### `src/contexts/AuthContext.tsx`
```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for stored auth data on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Replace with actual API call
      const mockUser: User = {
        id: '1',
        email,
        firstName: 'Demo',
        lastName: 'User',
        role: 'agent',
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

#### `src/contexts/ChatContext.tsx`
```typescript
import React, { createContext, useContext, useState, useCallback } from 'react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai' | 'system';
  timestamp: Date;
  leadId?: string;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  aiConfidence?: number;
}

interface Conversation {
  id: string;
  leadId: string;
  messages: Message[];
  status: 'active' | 'paused' | 'completed';
  aiModel: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ChatContextType {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  isTyping: boolean;
  sendMessage: (content: string, leadId?: string) => Promise<void>;
  setActiveConversation: (conversationId: string) => void;
  createConversation: (leadId: string) => void;
  markAsRead: (messageId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversationState] = useState<Conversation | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback(async (content: string, leadId?: string) => {
    if (!activeConversation) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
      leadId,
      status: 'sending',
    };

    // Add user message
    setConversations(prev => prev.map(conv => 
      conv.id === activeConversation.id 
        ? { ...conv, messages: [...conv.messages, newMessage] }
        : conv
    ));

    // Simulate AI typing
    setIsTyping(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate AI response
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `AI Response to: "${content}"`,
        sender: 'ai',
        timestamp: new Date(),
        leadId,
        status: 'sent',
        aiConfidence: 0.85,
      };

      setConversations(prev => prev.map(conv => 
        conv.id === activeConversation.id 
          ? { 
              ...conv, 
              messages: [...conv.messages.map(m => 
                m.id === newMessage.id ? { ...m, status: 'sent' } : m
              ), aiResponse],
              updatedAt: new Date(),
            }
          : conv
      ));
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsTyping(false);
    }
  }, [activeConversation]);

  const setActiveConversation = useCallback((conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    setActiveConversationState(conversation || null);
  }, [conversations]);

  const createConversation = useCallback((leadId: string) => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      leadId,
      messages: [],
      status: 'active',
      aiModel: 'gpt-4',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setConversations(prev => [...prev, newConversation]);
    setActiveConversationState(newConversation);
  }, []);

  const markAsRead = useCallback((messageId: string) => {
    setConversations(prev => prev.map(conv => ({
      ...conv,
      messages: conv.messages.map(msg => 
        msg.id === messageId ? { ...msg, status: 'read' } : msg
      ),
    })));
  }, []);

  return (
    <ChatContext.Provider value={{
      conversations,
      activeConversation,
      isTyping,
      sendMessage,
      setActiveConversation,
      createConversation,
      markAsRead,
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
```

### Step 5: Create Custom Hooks

#### `src/hooks/useLocalStorage.ts`
```typescript
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Get initial value from localStorage or use provided initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}
```

#### `src/hooks/useDebounce.ts`
```typescript
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

#### `src/hooks/useWebSocket.ts`
```typescript
import { useEffect, useRef, useState } from 'react';

interface UseWebSocketOptions {
  onMessage?: (data: any) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
  reconnectDelay?: number;
  maxReconnectAttempts?: number;
}

export function useWebSocket(url: string, options: UseWebSocketOptions = {}) {
  const {
    onMessage,
    onConnect,
    onDisconnect,
    onError,
    reconnectDelay = 3000,
    maxReconnectAttempts = 5,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = () => {
    try {
      wsRef.current = new WebSocket(url);

      wsRef.current.onopen = () => {
        setIsConnected(true);
        setReconnectAttempts(0);
        onConnect?.();
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage?.(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      wsRef.current.onclose = () => {
        setIsConnected(false);
        onDisconnect?.();

        // Attempt to reconnect
        if (reconnectAttempts < maxReconnectAttempts) {
          reconnectTimeoutRef.current = setTimeout(() => {
            setReconnectAttempts(prev => prev + 1);
            connect();
          }, reconnectDelay);
        }
      };

      wsRef.current.onerror = (error) => {
        onError?.(error);
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    wsRef.current?.close();
  };

  const sendMessage = (data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket is not connected');
    }
  };

  useEffect(() => {
    connect();
    return disconnect;
  }, [url]);

  return {
    isConnected,
    sendMessage,
    disconnect,
    reconnect: connect,
  };
}
```

### Step 6: Create AI Service Layer

#### `src/services/ai/aiService.ts`
```typescript
interface AIResponse {
  content: string;
  confidence: number;
  model: string;
  usage: {
    tokens: number;
    cost: number;
  };
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

class AIService {
  private apiKey: string;
  private baseURL: string;
  private defaultModel: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    this.baseURL = 'https://api.openai.com/v1';
    this.defaultModel = 'gpt-4';
  }

  async generateResponse(
    messages: ChatMessage[],
    options: {
      model?: string;
      maxTokens?: number;
      temperature?: number;
      leadContext?: any;
    } = {}
  ): Promise<AIResponse> {
    const {
      model = this.defaultModel,
      maxTokens = 1000,
      temperature = 0.7,
      leadContext,
    } = options;

    try {
      // Add lead context to system message if provided
      const systemMessage = leadContext ? 
        `You are a helpful real estate AI assistant. Here's the lead context: ${JSON.stringify(leadContext)}` :
        'You are a helpful real estate AI assistant.';

      const requestMessages = [
        { role: 'system', content: systemMessage },
        ...messages,
      ];

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: requestMessages,
          max_tokens: maxTokens,
          temperature,
        }),
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }

      const data = await response.json();
      const choice = data.choices[0];

      return {
        content: choice.message.content,
        confidence: 0.85, // Mock confidence score
        model,
        usage: {
          tokens: data.usage.total_tokens,
          cost: data.usage.total_tokens * 0.00002, // Mock cost calculation
        },
      };
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  async generateLeadResponse(
    userMessage: string,
    leadData: any,
    conversationHistory: ChatMessage[] = []
  ): Promise<AIResponse> {
    const leadPrompt = `
      Lead Information:
      - Name: ${leadData.firstName} ${leadData.lastName}
      - Email: ${leadData.email}
      - Phone: ${leadData.phone}
      - Status: ${leadData.status}
      - Source: ${leadData.source}
      - Notes: ${leadData.notes}
      
      Please respond as a professional real estate agent helping this lead.
      Be helpful, informative, and guide them towards making a decision.
    `;

    const messages: ChatMessage[] = [
      { role: 'system', content: leadPrompt },
      ...conversationHistory,
      { role: 'user', content: userMessage },
    ];

    return this.generateResponse(messages, {
      model: 'gpt-4',
      maxTokens: 500,
      temperature: 0.7,
      leadContext: leadData,
    });
  }

  async analyzeLeadScore(leadData: any): Promise<number> {
    try {
      const prompt = `
        Analyze this real estate lead and provide a score from 0-100 based on likelihood to convert:
        
        Lead Data:
        ${JSON.stringify(leadData, null, 2)}
        
        Consider factors like:
        - Contact information completeness
        - Lead source quality
        - Engagement level
        - Timeline indicators
        
        Respond with just a number between 0-100.
      `;

      const response = await this.generateResponse([
        { role: 'user', content: prompt }
      ], {
        model: 'gpt-3.5-turbo',
        maxTokens: 10,
        temperature: 0.1,
      });

      const score = parseInt(response.content.trim());
      return isNaN(score) ? 50 : Math.max(0, Math.min(100, score));
    } catch (error) {
      console.error('Lead scoring error:', error);
      return 50; // Default score
    }
  }
}

export const aiService = new AIService();
```

### Step 7: Implement Core AI Components

#### `src/components/ai/MessageBubble/MessageBubble.tsx`
```typescript
import React from 'react';
import styles from './MessageBubble.module.css';
import { formatChatTime } from '../../../utils/dateUtils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai' | 'system';
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  aiConfidence?: number;
}

interface MessageBubbleProps {
  message: Message;
  onCopy?: (content: string) => void;
  onReply?: (messageId: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onCopy,
  onReply,
}) => {
  const isUser = message.sender === 'user';
  const isSystem = message.sender === 'system';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    onCopy?.(message.content);
  };

  return (
    <div className={`${styles.messageContainer} ${styles[message.sender]}`}>
      {!isUser && (
        <div className={styles.avatar}>
          {isSystem ? '🤖' : 'AI'}
        </div>
      )}
      
      <div className={styles.messageContent}>
        <div className={styles.messageText}>
          {message.content}
        </div>
        
        <div className={styles.messageFooter}>
          <span className={styles.timestamp}>
            {formatChatTime(message.timestamp)}
          </span>
          
          {message.aiConfidence && (
            <span className={styles.confidence}>
              {Math.round(message.aiConfidence * 100)}% confident
            </span>
          )}
          
          <span className={`${styles.status} ${styles[message.status]}`}>
            {message.status === 'sending' && '⏳'}
            {message.status === 'sent' && '✓'}
            {message.status === 'delivered' && '✓✓'}
            {message.status === 'read' && '✓✓'}
          </span>
        </div>
      </div>
      
      <div className={styles.actions}>
        <button
          onClick={handleCopy}
          className={styles.actionButton}
          title="Copy message"
        >
          📋
        </button>
        
        {onReply && (
          <button
            onClick={() => onReply(message.id)}
            className={styles.actionButton}
            title="Reply to message"
          >
            ↩️
          </button>
        )}
      </div>
      
      {isUser && (
        <div className={styles.avatar}>
          👤
        </div>
      )}
    </div>
  );
};
```

#### `src/components/ai/MessageBubble/MessageBubble.module.css`
```css
.messageContainer {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  margin-bottom: 16px;
  max-width: 80%;
}

.messageContainer.user {
  flex-direction: row-reverse;
  margin-left: auto;
}

.messageContainer.ai,
.messageContainer.system {
  flex-direction: row;
  margin-right: auto;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-primary-500);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.messageContent {
  background: var(--color-gray-100);
  border-radius: 16px;
  padding: 12px 16px;
  position: relative;
  word-wrap: break-word;
}

.user .messageContent {
  background: var(--color-primary-500);
  color: white;
}

.system .messageContent {
  background: var(--color-yellow-100);
  border: 1px solid var(--color-yellow-300);
}

.messageText {
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 4px;
}

.messageFooter {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  opacity: 0.7;
}

.timestamp {
  color: inherit;
}

.confidence {
  color: var(--color-green-600);
  font-weight: 500;
}

.status {
  margin-left: auto;
}

.status.sending {
  color: var(--color-yellow-500);
}

.status.sent,
.status.delivered {
  color: var(--color-green-500);
}

.status.read {
  color: var(--color-blue-500);
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.messageContainer:hover .actions {
  opacity: 1;
}

.actionButton {
  background: none;
  border: none;
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  background: var(--color-gray-200);
  opacity: 0.8;
  transition: all 0.2s ease;
}

.actionButton:hover {
  opacity: 1;
  background: var(--color-gray-300);
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .messageContainer {
    max-width: 95%;
  }
  
  .messageContent {
    padding: 10px 14px;
  }
  
  .messageText {
    font-size: 13px;
  }
  
  .actions {
    opacity: 1;
  }
}
```

This implementation guide provides a solid foundation for implementing the remaining features. Continue with the remaining components following this pattern, ensuring:

1. **Type Safety**: Use TypeScript interfaces for all data structures
2. **Responsive Design**: Mobile-first CSS with proper breakpoints  
3. **Accessibility**: ARIA labels, keyboard navigation, screen reader support
4. **Performance**: Memoization, lazy loading, and efficient re-renders
5. **Error Handling**: Proper try-catch blocks and user feedback
6. **Testing**: Unit tests for utilities and integration tests for components

**Next Steps:**
1. Implement the remaining AI components (ChatInterface, TypingIndicator, ChatInput)
2. Build the Settings components and pages
3. Set up the analytics components for Phase 5
4. Update the AWS Amplify backend schema
5. Add comprehensive testing and documentation

Each component should follow this established pattern for consistency and maintainability.