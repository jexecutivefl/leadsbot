# AI Chat Setup Guide

## Overview
The AI chat system is now fully integrated with the real database and ready for production use. It includes:

- Real-time AI conversations with OpenAI GPT-4
- Lead-specific context and conversation history
- Follow-up email generation
- Sentiment analysis
- Conversation analytics

## Setup Instructions

### 1. Environment Variables
Create a `.env` file in the root directory with your OpenAI API key:

```bash
# Copy the template
cp env.template .env

# Edit .env and add your OpenAI API key
VITE_OPENAI_API_KEY=your_actual_openai_api_key_here
```

### 2. OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add it to your `.env` file

### 3. Database Schema
The backend is already configured with the necessary models:
- `Conversation` - Tracks chat sessions
- `Communication` - Stores individual messages
- `Lead` - Lead information
- `User` - User accounts

### 4. Features Available

#### AI Chat Interface
- Real-time conversations with AI assistant
- Lead selection and context switching
- Message history persistence
- Error handling and loading states

#### AI Capabilities
- **Lead Management**: Ask about leads, status updates, follow-ups
- **Email Generation**: Create personalized follow-up emails
- **Sentiment Analysis**: Analyze lead communication sentiment
- **Insights**: Get analytics and recommendations

#### Quick Actions
- Show recent leads
- Follow-up assistance
- Generate insights
- Create email templates (when lead selected)
- Analyze sentiment (when lead selected)

### 5. Usage

1. **Start a Conversation**: Navigate to the AI Chat page
2. **Select a Lead**: Choose a lead from the sidebar for context-specific assistance
3. **Ask Questions**: Type natural language questions about leads, follow-ups, etc.
4. **Use Quick Actions**: Click suggestion buttons for common tasks

### 6. Production Deployment

The system is ready for production deployment:

```bash
# Build the application
npm run build

# Deploy to AWS Amplify
npx ampx push
```

### 7. Monitoring

- All conversations are stored in the database
- Communication records track message history
- Analytics available for conversation performance
- Error handling with user-friendly messages

### 8. Security

- API keys are stored in environment variables
- User authentication required for all operations
- Data access controlled by AWS Amplify authorization rules

## Troubleshooting

### Common Issues

1. **"OpenAI API key not configured"**
   - Check your `.env` file has the correct API key
   - Restart the development server

2. **"Failed to send message"**
   - Check internet connection
   - Verify OpenAI API key is valid
   - Check OpenAI account has sufficient credits

3. **"Failed to load leads"**
   - Ensure Amplify sandbox is running
   - Check database connection
   - Verify user authentication

### Support

For issues or questions, check the console logs for detailed error messages and refer to the AWS Amplify documentation. 