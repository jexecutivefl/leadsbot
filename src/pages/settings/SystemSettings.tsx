import { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import AISettings from '../../components/settings/AISettings';
import ChatInterface, { ChatMessage } from '../../components/ai/ChatInterface';
import type { AISettings as AISettingsType } from '../../components/settings/AISettings';
import styles from './SystemSettings.module.css';

export interface IntegrationSettings {
  emailProvider: 'smtp' | 'sendgrid' | 'mailgun' | 'ses';
  emailConfig: {
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    apiKey?: string;
  };
  crmIntegration: 'none' | 'salesforce' | 'hubspot' | 'pipedrive';
  crmConfig: {
    apiKey?: string;
    domain?: string;
    enabled: boolean;
  };
  webhookUrl?: string;
  slackWebhook?: string;
  analyticsEnabled: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  dataRetention: number; // days
}

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState<'ai' | 'integrations' | 'backup' | 'testing'>('ai');
  const [isLoading, setIsLoading] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // AI Settings
  const [aiSettings, setAiSettings] = useState<AISettingsType>({
    selectedModel: 'gpt-4-turbo',
    responseStyle: 'professional',
    responseLength: 'detailed',
    temperature: 0.7,
    maxTokens: 1000,
    systemPrompt: 'You are a helpful AI assistant for a lead management system. Your role is to help users manage their leads effectively, provide insights, and assist with communication. Be professional, helpful, and accurate in your responses.',
    enableMemory: true,
    enablePersonalization: true,
    autoSuggestResponses: true
  });

  // Integration Settings
  const [integrationSettings, setIntegrationSettings] = useState<IntegrationSettings>({
    emailProvider: 'smtp',
    emailConfig: {
      host: 'smtp.gmail.com',
      port: 587,
      username: '',
      password: ''
    },
    crmIntegration: 'none',
    crmConfig: {
      enabled: false
    },
    webhookUrl: '',
    slackWebhook: '',
    analyticsEnabled: true,
    backupFrequency: 'daily',
    dataRetention: 90
  });

  // Chat Testing
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI assistant. How can I help you manage your leads today?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleAISettingsChange = (settings: AISettingsType) => {
    setAiSettings(settings);
    setUnsavedChanges(true);
  };

  const handleSaveAISettings = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('AI settings saved:', aiSettings);
      setUnsavedChanges(false);
    } catch (error) {
      console.error('Failed to save AI settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateIntegrationSettings = (updates: Partial<IntegrationSettings>) => {
    setIntegrationSettings(prev => ({ ...prev, ...updates }));
    setUnsavedChanges(true);
  };

  const handleSaveIntegrations = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Integration settings saved:', integrationSettings);
      setUnsavedChanges(false);
    } catch (error) {
      console.error('Failed to save integration settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async (type: 'email' | 'crm' | 'webhook') => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log(`${type} connection test successful`);
      alert(`${type.toUpperCase()} connection test successful!`);
    } catch (error) {
      console.error(`${type} connection test failed:`, error);
      alert(`${type.toUpperCase()} connection test failed. Please check your settings.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackup = async (type: 'full' | 'leads' | 'settings') => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      console.log(`${type} backup completed`);
      alert(`${type.toUpperCase()} backup completed successfully!`);
    } catch (error) {
      console.error(`${type} backup failed:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendChatMessage = async (message: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setIsChatLoading(true);

    // Simulate AI response
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(message),
        sender: 'ai',
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
    } finally {
      setIsChatLoading(false);
    }
  };

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('lead') || lowerMessage.includes('customer')) {
      return 'I can help you manage your leads effectively. You can add new leads, update their status, or get insights about your lead pipeline. What specific task would you like assistance with?';
    }
    
    if (lowerMessage.includes('settings') || lowerMessage.includes('config')) {
      return 'I can guide you through the system settings. You can configure AI behavior, set up integrations with email providers and CRMs, or manage backup settings. Which area would you like to explore?';
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return 'Hello! I\'m here to help you with your lead management system. I can assist with lead operations, provide insights, and help you configure the system. How can I help you today?';
    }
    
    return 'Thank you for your message. I\'m designed to help with lead management tasks, system configuration, and provide insights about your business. Could you please be more specific about what you\'d like assistance with?';
  };

  return (
    <div className={styles.systemSettings}>
      <div className={styles.header}>
        <div>
          <h1>System Settings</h1>
          <p>Configure AI, integrations, and system-wide preferences</p>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'ai' ? styles.active : ''}`}
          onClick={() => setActiveTab('ai')}
        >
          AI Configuration
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'integrations' ? styles.active : ''}`}
          onClick={() => setActiveTab('integrations')}
        >
          Integrations
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'backup' ? styles.active : ''}`}
          onClick={() => setActiveTab('backup')}
        >
          Backup & Data
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'testing' ? styles.active : ''}`}
          onClick={() => setActiveTab('testing')}
        >
          AI Testing
        </button>
      </div>

      {/* AI Configuration Tab */}
      {activeTab === 'ai' && (
        <div className={styles.tabContent}>
          <AISettings
            settings={aiSettings}
            onSettingsChange={handleAISettingsChange}
            onSave={handleSaveAISettings}
            isLoading={isLoading}
          />
        </div>
      )}

      {/* Integrations Tab */}
      {activeTab === 'integrations' && (
        <div className={styles.tabContent}>
          <Card className={styles.settingsCard}>
            <div className={styles.cardHeader}>
              <h3>Email Integration</h3>
              <p>Configure email settings for automated communications</p>
            </div>

            <div className={styles.integrationSection}>
              <div className={styles.providerSelection}>
                <label>Email Provider</label>
                <select
                  value={integrationSettings.emailProvider}
                  onChange={(e) => updateIntegrationSettings({ 
                    emailProvider: e.target.value as any,
                    emailConfig: {} // Reset config when provider changes
                  })}
                  className={styles.select}
                >
                  <option value="smtp">SMTP</option>
                  <option value="sendgrid">SendGrid</option>
                  <option value="mailgun">Mailgun</option>
                  <option value="ses">Amazon SES</option>
                </select>
              </div>

              {integrationSettings.emailProvider === 'smtp' && (
                <div className={styles.configGrid}>
                  <div className={styles.formGroup}>
                    <label>SMTP Host</label>
                    <Input
                      value={integrationSettings.emailConfig.host || ''}
                      onChange={(e) => updateIntegrationSettings({
                        emailConfig: { ...integrationSettings.emailConfig, host: e.target.value }
                      })}
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Port</label>
                    <Input
                      type="number"
                      value={integrationSettings.emailConfig.port || ''}
                      onChange={(e) => updateIntegrationSettings({
                        emailConfig: { ...integrationSettings.emailConfig, port: parseInt(e.target.value) }
                      })}
                      placeholder="587"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Username</label>
                    <Input
                      value={integrationSettings.emailConfig.username || ''}
                      onChange={(e) => updateIntegrationSettings({
                        emailConfig: { ...integrationSettings.emailConfig, username: e.target.value }
                      })}
                      placeholder="your-email@domain.com"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Password</label>
                    <Input
                      type="password"
                      value={integrationSettings.emailConfig.password || ''}
                      onChange={(e) => updateIntegrationSettings({
                        emailConfig: { ...integrationSettings.emailConfig, password: e.target.value }
                      })}
                      placeholder="Your email password"
                    />
                  </div>
                </div>
              )}

              {(integrationSettings.emailProvider === 'sendgrid' || 
                integrationSettings.emailProvider === 'mailgun' || 
                integrationSettings.emailProvider === 'ses') && (
                <div className={styles.formGroup}>
                  <label>API Key</label>
                  <Input
                    type="password"
                    value={integrationSettings.emailConfig.apiKey || ''}
                    onChange={(e) => updateIntegrationSettings({
                      emailConfig: { ...integrationSettings.emailConfig, apiKey: e.target.value }
                    })}
                    placeholder="Enter your API key"
                  />
                </div>
              )}

              <div className={styles.testSection}>
                <Button
                  variant="outline"
                  onClick={() => handleTestConnection('email')}
                  disabled={isLoading}
                >
                  {isLoading ? 'Testing...' : 'Test Email Connection'}
                </Button>
              </div>
            </div>
          </Card>

          <Card className={styles.settingsCard}>
            <div className={styles.cardHeader}>
              <h3>CRM Integration</h3>
              <p>Connect with your existing CRM system</p>
            </div>

            <div className={styles.integrationSection}>
              <div className={styles.providerSelection}>
                <label>CRM Provider</label>
                <select
                  value={integrationSettings.crmIntegration}
                  onChange={(e) => updateIntegrationSettings({ 
                    crmIntegration: e.target.value as any,
                    crmConfig: { enabled: e.target.value !== 'none' }
                  })}
                  className={styles.select}
                >
                  <option value="none">None</option>
                  <option value="salesforce">Salesforce</option>
                  <option value="hubspot">HubSpot</option>
                  <option value="pipedrive">Pipedrive</option>
                </select>
              </div>

              {integrationSettings.crmIntegration !== 'none' && (
                <div className={styles.configGrid}>
                  <div className={styles.formGroup}>
                    <label>API Key</label>
                    <Input
                      type="password"
                      value={integrationSettings.crmConfig.apiKey || ''}
                      onChange={(e) => updateIntegrationSettings({
                        crmConfig: { ...integrationSettings.crmConfig, apiKey: e.target.value }
                      })}
                      placeholder="Enter your CRM API key"
                    />
                  </div>
                  {integrationSettings.crmIntegration === 'salesforce' && (
                    <div className={styles.formGroup}>
                      <label>Domain</label>
                      <Input
                        value={integrationSettings.crmConfig.domain || ''}
                        onChange={(e) => updateIntegrationSettings({
                          crmConfig: { ...integrationSettings.crmConfig, domain: e.target.value }
                        })}
                        placeholder="yourcompany.salesforce.com"
                      />
                    </div>
                  )}
                </div>
              )}

              {integrationSettings.crmIntegration !== 'none' && (
                <div className={styles.testSection}>
                  <Button
                    variant="outline"
                    onClick={() => handleTestConnection('crm')}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Testing...' : 'Test CRM Connection'}
                  </Button>
                </div>
              )}
            </div>
          </Card>

          <Card className={styles.settingsCard}>
            <div className={styles.cardHeader}>
              <h3>Webhooks & Notifications</h3>
              <p>Configure external integrations and notifications</p>
            </div>

            <div className={styles.integrationSection}>
              <div className={styles.formGroup}>
                <label>Webhook URL</label>
                <Input
                  value={integrationSettings.webhookUrl || ''}
                  onChange={(e) => updateIntegrationSettings({ webhookUrl: e.target.value })}
                  placeholder="https://your-webhook-url.com/endpoint"
                />
                <small>Receive real-time updates about lead activities</small>
              </div>

              <div className={styles.formGroup}>
                <label>Slack Webhook</label>
                <Input
                  value={integrationSettings.slackWebhook || ''}
                  onChange={(e) => updateIntegrationSettings({ slackWebhook: e.target.value })}
                  placeholder="https://hooks.slack.com/services/..."
                />
                <small>Send notifications to your Slack channel</small>
              </div>

              <div className={styles.checkboxGroup}>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={integrationSettings.analyticsEnabled}
                    onChange={(e) => updateIntegrationSettings({ analyticsEnabled: e.target.checked })}
                  />
                  <span>Enable analytics tracking</span>
                  <small>Collect usage analytics to improve the system</small>
                </label>
              </div>

              <div className={styles.testSection}>
                <Button
                  variant="outline"
                  onClick={() => handleTestConnection('webhook')}
                  disabled={isLoading}
                >
                  {isLoading ? 'Testing...' : 'Test Webhook'}
                </Button>
              </div>
            </div>

            <div className={styles.cardFooter}>
              <Button
                variant="primary"
                onClick={handleSaveIntegrations}
                disabled={!unsavedChanges || isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Integration Settings'}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Backup & Data Tab */}
      {activeTab === 'backup' && (
        <div className={styles.tabContent}>
          <Card className={styles.settingsCard}>
            <div className={styles.cardHeader}>
              <h3>Backup & Export</h3>
              <p>Manage your data backups and exports</p>
            </div>

            <div className={styles.backupSection}>
              <div className={styles.backupOptions}>
                <div className={styles.backupOption}>
                  <div>
                    <h4>Full System Backup</h4>
                    <p>Complete backup including all leads, settings, and configurations</p>
                  </div>
                  <Button
                    variant="primary"
                    onClick={() => handleBackup('full')}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating...' : 'Create Backup'}
                  </Button>
                </div>

                <div className={styles.backupOption}>
                  <div>
                    <h4>Leads Data Export</h4>
                    <p>Export all lead data in CSV format</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handleBackup('leads')}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Exporting...' : 'Export Leads'}
                  </Button>
                </div>

                <div className={styles.backupOption}>
                  <div>
                    <h4>Settings Backup</h4>
                    <p>Backup only system settings and configurations</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handleBackup('settings')}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating...' : 'Backup Settings'}
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className={styles.settingsCard}>
            <div className={styles.cardHeader}>
              <h3>Automated Backups</h3>
              <p>Configure automatic backup schedule and data retention</p>
            </div>

            <div className={styles.configGrid}>
              <div className={styles.formGroup}>
                <label>Backup Frequency</label>
                <select
                  value={integrationSettings.backupFrequency}
                  onChange={(e) => updateIntegrationSettings({ backupFrequency: e.target.value as any })}
                  className={styles.select}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Data Retention (days)</label>
                <Input
                  type="number"
                  value={integrationSettings.dataRetention}
                  onChange={(e) => updateIntegrationSettings({ dataRetention: parseInt(e.target.value) || 90 })}
                  min={30}
                  max={365}
                />
                <small>How long to keep backup files (30-365 days)</small>
              </div>
            </div>

            <div className={styles.cardFooter}>
              <Button
                variant="primary"
                onClick={handleSaveIntegrations}
                disabled={!unsavedChanges || isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Backup Settings'}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* AI Testing Tab */}
      {activeTab === 'testing' && (
        <div className={styles.tabContent}>
          <Card className={styles.settingsCard}>
            <div className={styles.cardHeader}>
              <h3>AI Chat Testing</h3>
              <p>Test your AI configuration and see how it responds to different queries</p>
            </div>

            <div className={styles.chatContainer}>
              <ChatInterface
                messages={chatMessages}
                onSendMessage={handleSendChatMessage}
                isLoading={isChatLoading}
                placeholder="Ask the AI something about lead management..."
              />
            </div>

            <div className={styles.testingInfo}>
              <h4>Testing Tips</h4>
              <ul>
                <li>Try asking about lead management tasks</li>
                <li>Test different conversation styles</li>
                <li>Check response length and tone</li>
                <li>Verify AI follows your system prompt</li>
              </ul>
            </div>
          </Card>
        </div>
      )}

      {unsavedChanges && (
        <div className={styles.unsavedNotice}>
          You have unsaved changes. Don't forget to save your settings.
        </div>
      )}
    </div>
  );
};

export default SystemSettings;