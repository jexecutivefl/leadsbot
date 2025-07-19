import { useState } from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import styles from './AISettings.module.css';

export interface AIModel {
  id: string;
  name: string;
  description: string;
  provider: string;
  tier: 'free' | 'premium' | 'enterprise';
  features: string[];
}

export interface AISettings {
  selectedModel: string;
  responseStyle: 'professional' | 'friendly' | 'casual' | 'technical';
  responseLength: 'concise' | 'detailed' | 'comprehensive';
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  enableMemory: boolean;
  enablePersonalization: boolean;
  autoSuggestResponses: boolean;
}

export interface AISettingsProps {
  settings: AISettings;
  onSettingsChange: (settings: AISettings) => void;
  onSave: () => void;
  isLoading?: boolean;
}

const availableModels: AIModel[] = [
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    description: 'Most capable model with enhanced reasoning and knowledge',
    provider: 'OpenAI',
    tier: 'premium',
    features: ['Advanced reasoning', 'Code generation', 'Multi-language support', '128k context']
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: 'Fast and efficient for most conversational tasks',
    provider: 'OpenAI',
    tier: 'free',
    features: ['Quick responses', 'General conversation', 'Cost-effective', '16k context']
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    description: 'Superior performance on complex tasks and analysis',
    provider: 'Anthropic',
    tier: 'enterprise',
    features: ['Complex reasoning', 'Code analysis', 'Document understanding', '200k context']
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    description: 'Balanced performance and speed for business applications',
    provider: 'Anthropic',
    tier: 'premium',
    features: ['Business focus', 'Balanced speed', 'High accuracy', '200k context']
  }
];

const responseStyles = [
  { value: 'professional', label: 'Professional', description: 'Formal and business-appropriate' },
  { value: 'friendly', label: 'Friendly', description: 'Warm and approachable' },
  { value: 'casual', label: 'Casual', description: 'Relaxed and conversational' },
  { value: 'technical', label: 'Technical', description: 'Detailed and precise' }
];

const responseLengths = [
  { value: 'concise', label: 'Concise', description: 'Brief and to the point' },
  { value: 'detailed', label: 'Detailed', description: 'Comprehensive with examples' },
  { value: 'comprehensive', label: 'Comprehensive', description: 'Thorough and exhaustive' }
];

const AISettings = ({ settings, onSettingsChange, onSave, isLoading = false }: AISettingsProps) => {
  const [activeTab, setActiveTab] = useState<'model' | 'style' | 'advanced'>('model');
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const updateSettings = (updates: Partial<AISettings>) => {
    const newSettings = { ...settings, ...updates };
    onSettingsChange(newSettings);
    setUnsavedChanges(true);
  };

  const handleSave = () => {
    onSave();
    setUnsavedChanges(false);
  };

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'free': return 'var(--color-success-500)';
      case 'premium': return 'var(--color-warning-500)';
      case 'enterprise': return 'var(--color-primary-500)';
      default: return 'var(--color-gray-500)';
    }
  };

  return (
    <div className={styles.aiSettings}>
      <div className={styles.header}>
        <div>
          <h2>AI Configuration</h2>
          <p>Customize your AI assistant's behavior and capabilities</p>
        </div>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={!unsavedChanges || isLoading}
          className={styles.saveButton}
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'model' ? styles.active : ''}`}
          onClick={() => setActiveTab('model')}
        >
          Model Selection
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'style' ? styles.active : ''}`}
          onClick={() => setActiveTab('style')}
        >
          Response Style
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'advanced' ? styles.active : ''}`}
          onClick={() => setActiveTab('advanced')}
        >
          Advanced Settings
        </button>
      </div>

      {/* Model Selection Tab */}
      {activeTab === 'model' && (
        <div className={styles.tabContent}>
          <h3>Choose AI Model</h3>
          <p>Select the AI model that best fits your needs. Different models have varying capabilities and costs.</p>
          
          <div className={styles.modelGrid}>
            {availableModels.map((model) => (
              <Card
                key={model.id}
                className={`${styles.modelCard} ${settings.selectedModel === model.id ? styles.selected : ''}`}
                onClick={() => updateSettings({ selectedModel: model.id })}
              >
                <div className={styles.modelHeader}>
                  <div>
                    <h4>{model.name}</h4>
                    <p className={styles.provider}>{model.provider}</p>
                  </div>
                  <span
                    className={styles.tierBadge}
                    style={{ backgroundColor: getTierBadgeColor(model.tier) }}
                  >
                    {model.tier}
                  </span>
                </div>
                <p className={styles.modelDescription}>{model.description}</p>
                <div className={styles.features}>
                  {model.features.map((feature, index) => (
                    <span key={index} className={styles.feature}>
                      {feature}
                    </span>
                  ))}
                </div>
                {settings.selectedModel === model.id && (
                  <div className={styles.selectedIndicator}>
                    ✓ Currently Selected
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Response Style Tab */}
      {activeTab === 'style' && (
        <div className={styles.tabContent}>
          <div className={styles.settingSection}>
            <h3>Response Style</h3>
            <p>Choose how the AI should communicate with your leads</p>
            
            <div className={styles.optionGroup}>
              {responseStyles.map((style) => (
                <label key={style.value} className={styles.optionCard}>
                  <input
                    type="radio"
                    name="responseStyle"
                    value={style.value}
                    checked={settings.responseStyle === style.value}
                    onChange={(e) => updateSettings({ responseStyle: e.target.value as any })}
                  />
                  <div className={styles.optionContent}>
                    <strong>{style.label}</strong>
                    <span>{style.description}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.settingSection}>
            <h3>Response Length</h3>
            <p>Control how detailed the AI responses should be</p>
            
            <div className={styles.optionGroup}>
              {responseLengths.map((length) => (
                <label key={length.value} className={styles.optionCard}>
                  <input
                    type="radio"
                    name="responseLength"
                    value={length.value}
                    checked={settings.responseLength === length.value}
                    onChange={(e) => updateSettings({ responseLength: e.target.value as any })}
                  />
                  <div className={styles.optionContent}>
                    <strong>{length.label}</strong>
                    <span>{length.description}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.settingSection}>
            <h3>Behavioral Settings</h3>
            <div className={styles.checkboxGroup}>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={settings.enableMemory}
                  onChange={(e) => updateSettings({ enableMemory: e.target.checked })}
                />
                <span>Enable conversation memory</span>
                <small>AI remembers previous conversations with each lead</small>
              </label>
              
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={settings.enablePersonalization}
                  onChange={(e) => updateSettings({ enablePersonalization: e.target.checked })}
                />
                <span>Enable personalization</span>
                <small>Customize responses based on lead profile and history</small>
              </label>
              
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={settings.autoSuggestResponses}
                  onChange={(e) => updateSettings({ autoSuggestResponses: e.target.checked })}
                />
                <span>Auto-suggest responses</span>
                <small>Show suggested responses during conversations</small>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Settings Tab */}
      {activeTab === 'advanced' && (
        <div className={styles.tabContent}>
          <div className={styles.settingSection}>
            <h3>Model Parameters</h3>
            <p>Fine-tune the AI model's behavior for optimal performance</p>
            
            <div className={styles.parameterGrid}>
              <div className={styles.parameter}>
                <label>Temperature: {settings.temperature}</label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={settings.temperature}
                  onChange={(e) => updateSettings({ temperature: parseFloat(e.target.value) })}
                  className={styles.slider}
                />
                <div className={styles.sliderLabels}>
                  <span>Focused</span>
                  <span>Creative</span>
                </div>
              </div>
              
              <div className={styles.parameter}>
                <label>Max Tokens</label>
                <Input
                  type="number"
                  value={settings.maxTokens}
                  onChange={(e) => updateSettings({ maxTokens: parseInt(e.target.value) || 0 })}
                  min={100}
                  max={4000}
                  step={100}
                />
                <small>Maximum length of AI responses (100-4000)</small>
              </div>
            </div>
          </div>

          <div className={styles.settingSection}>
            <h3>System Prompt</h3>
            <p>Define the AI's role and behavior instructions</p>
            
            <textarea
              value={settings.systemPrompt}
              onChange={(e) => updateSettings({ systemPrompt: e.target.value })}
              placeholder="You are a helpful AI assistant for a lead management system. Your role is to help users manage their leads effectively..."
              rows={8}
              className={styles.systemPrompt}
            />
            <small>This prompt defines how the AI should behave and what its role is</small>
          </div>

          <div className={styles.settingSection}>
            <h3>Training Data</h3>
            <p>Manage custom training data to improve AI responses</p>
            
            <div className={styles.trainingActions}>
              <Button variant="outline">Upload Training Data</Button>
              <Button variant="outline">Export Conversations</Button>
              <Button variant="outline">Reset to Defaults</Button>
            </div>
          </div>
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

export default AISettings;