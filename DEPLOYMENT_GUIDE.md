# 🚀 Production Deployment Guide
## AI-Powered Real Estate Lead Follow-Up System

## 📋 Prerequisites

### AWS Account Setup
- AWS Account with appropriate permissions
- AWS CLI configured
- Amplify CLI installed (`npm install -g @aws-amplify/cli`)

### External Services
- **OpenAI API Key** (for AI chat functionality)
- **Twilio Account** (for SMS messaging)
- **Follow Up Boss Account** (for lead integration)
- **Domain for Email** (for AWS SES verification)

## 🔧 Step 1: Environment Configuration

### 1.1 Create Environment File
```bash
# Copy the template
cp env.template .env

# Edit with your values
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

### 1.2 Set Up AWS Secrets
```bash
# Set up secrets for Lambda functions
npx ampx secret set OPENAI_API_KEY
npx ampx secret set TWILIO_ACCOUNT_SID
npx ampx secret set TWILIO_AUTH_TOKEN
npx ampx secret set FUB_API_KEY
npx ampx secret set FUB_WEBHOOK_SECRET
```

## 📧 Step 2: AWS SES Configuration

### 2.1 Verify Email Domain
```bash
# Go to AWS SES Console
# Add and verify your domain (e.g., yourdomain.com)
# Update FROM_EMAIL in communication-service function
```

### 2.2 Request Production Access
```bash
# SES starts in sandbox mode
# Request production access through AWS Console
# Required for sending emails to unverified addresses
```

## 📱 Step 3: Twilio Configuration

### 3.1 Set Up Twilio Account
1. Create Twilio account at twilio.com
2. Get Account SID and Auth Token
3. Purchase a phone number for SMS
4. Note these values for secrets configuration

### 3.2 Configure SMS Settings
```bash
# In Twilio Console:
# - Enable SMS for your phone number
# - Set up webhooks if needed
# - Configure messaging service (optional)
```

## 🔗 Step 4: Follow Up Boss Integration

### 4.1 API Configuration
1. Log into Follow Up Boss admin panel
2. Go to Settings > Integrations > API
3. Generate API key
4. Configure webhook endpoints

### 4.2 Webhook Setup
```bash
# Your webhook URL will be:
# https://your-api-gateway-url/fub-webhook

# Configure in FUB:
# - Event types: person.created, person.updated
# - Include webhook secret for security
```

## 🚀 Step 5: Deploy Backend

### 5.1 Install Dependencies
```bash
npm install
```

### 5.2 Deploy Amplify Backend
```bash
# Deploy all resources (data, auth, functions)
npx ampx push

# This will create:
# - DynamoDB tables
# - Cognito user pools
# - Lambda functions
# - API Gateway endpoints
# - IAM roles and permissions
```

### 5.3 Verify Deployment
```bash
# Check function deployment
npx ampx status

# Test function endpoints
npx ampx logs --function lead-processor
```

## 🌐 Step 6: Deploy Frontend

### 6.1 Build Application
```bash
# Build for production
npm run build

# Verify build output
ls -la dist/
```

### 6.2 Deploy to Amplify Hosting
```bash
# Option 1: Amplify Console (Recommended)
# - Connect your Git repository
# - Amplify will auto-deploy on push

# Option 2: Manual deployment
npx amplify publish
```

## 🔒 Step 7: Security Configuration

### 7.1 Update CORS Settings
```typescript
// Update API Gateway CORS if needed
// Allow your domain origins
```

### 7.2 Configure IAM Roles
```bash
# Ensure Lambda functions have proper permissions:
# - DynamoDB read/write
# - SES send email
# - SNS publish
# - CloudWatch logs
```

### 7.3 Set Up Monitoring
```bash
# CloudWatch alarms for:
# - Function errors
# - High latency
# - Failed communications
```

## 📊 Step 8: Testing & Validation

### 8.1 End-to-End Testing
```bash
# Test the complete workflow:
# 1. Create a test lead
# 2. Verify auto-contact triggers
# 3. Check email/SMS delivery
# 4. Validate database updates
```

### 8.2 Integration Testing
```bash
# Test Follow Up Boss webhook
curl -X POST your-webhook-url \
  -H "Content-Type: application/json" \
  -d '{"type":"person.created","data":{...}}'

# Test communication functions
# Monitor CloudWatch logs
```

## 📋 Step 9: Production Checklist

### ✅ Backend Validation
- [ ] All Lambda functions deployed successfully
- [ ] DynamoDB tables created with correct schema
- [ ] API Gateway endpoints responding
- [ ] Secrets configured and accessible
- [ ] IAM permissions properly set

### ✅ External Integrations
- [ ] AWS SES domain verified and in production
- [ ] Twilio SMS working with test messages
- [ ] Follow Up Boss webhook configured
- [ ] OpenAI API key valid and working

### ✅ Frontend Application
- [ ] Application builds without errors
- [ ] Authentication working with Cognito
- [ ] Lead management features functional
- [ ] AI chat interface responsive
- [ ] Analytics dashboard displaying data

### ✅ Communication System
- [ ] Email delivery working via SES
- [ ] SMS delivery working via Twilio
- [ ] Communication logging to database
- [ ] Error handling for failed messages

### ✅ Monitoring & Alerts
- [ ] CloudWatch logs capturing function activity
- [ ] Error tracking and alerting set up
- [ ] Performance monitoring configured
- [ ] Cost monitoring alerts active

## 🔄 Step 10: Lead Workflow Testing

### 10.1 New Lead Workflow
```bash
# Test new lead processing:
# 1. Create lead via FUB webhook
# 2. Verify immediate contact sequence
# 3. Check follow-up scheduling
# 4. Validate communication delivery
```

### 10.2 Aged Lead Workflow
```bash
# Test aged lead reactivation:
# 1. Create old lead (or backdate)
# 2. Trigger aged lead check
# 3. Verify reactivation campaign
# 4. Check lead status updates
```

## 📈 Step 11: Performance Optimization

### 11.1 Lambda Optimization
```bash
# Monitor function performance:
# - Cold start times
# - Memory usage
# - Execution duration
# - Error rates
```

### 11.2 Database Optimization
```bash
# DynamoDB optimization:
# - Monitor read/write capacity
# - Set up auto-scaling
# - Review query patterns
# - Optimize indexes
```

## 💰 Step 12: Cost Management

### 12.1 AWS Cost Monitoring
- Set up billing alerts
- Monitor Lambda execution costs
- Track SES/SNS usage
- Review DynamoDB costs

### 12.2 External API Costs
- Monitor OpenAI API usage
- Track Twilio SMS costs
- Review Follow Up Boss API limits

## 🎯 Success Metrics

### Technical KPIs
- **Function Success Rate**: >99%
- **Response Time**: <5 minutes for new leads
- **Communication Delivery**: >98%
- **System Uptime**: >99.9%

### Business KPIs
- **Lead Response Rate**: Target 40% improvement
- **Conversion Rate**: Target 25% increase
- **Agent Productivity**: Target 50% improvement
- **Cost Per Lead**: Target 30% reduction

## 🔧 Troubleshooting

### Common Issues

#### Lambda Function Errors
```bash
# Check function logs
npx ampx logs --function lead-processor --tail

# Common fixes:
# - Verify environment variables
# - Check IAM permissions
# - Validate secrets configuration
```

#### Email Delivery Issues
```bash
# Check SES sending statistics
# Verify domain authentication
# Review bounce/complaint rates
# Check sandbox mode status
```

#### Database Connection Issues
```bash
# Verify DynamoDB table permissions
# Check Amplify configuration
# Review connection timeout settings
```

## 📞 Support & Maintenance

### Regular Maintenance Tasks
- [ ] Weekly: Review communication success rates
- [ ] Monthly: Analyze lead conversion metrics
- [ ] Quarterly: Review and optimize costs
- [ ] Yearly: Security audit and updates

### Monitoring Tools
- **CloudWatch**: Function monitoring and alerting
- **AWS X-Ray**: Distributed tracing (optional)
- **Third-party**: Sentry for error tracking (optional)

## 🎉 Go-Live Checklist

Before launching to production:

1. **Complete all testing scenarios**
2. **Verify all integrations working**
3. **Set up monitoring and alerts**
4. **Prepare rollback plan**
5. **Train users on new system**
6. **Have support plan ready**

## 📱 Mobile Optimization

The system is fully responsive and optimized for:
- **Desktop**: Full-featured experience
- **Tablet**: Touch-optimized interface
- **Mobile**: Streamlined mobile experience
- **Offline**: Basic functionality when offline

## 🔐 Security Best Practices

- **API Keys**: Stored as AWS Secrets
- **Data Encryption**: In transit and at rest
- **Access Control**: Role-based permissions
- **Audit Logging**: Complete activity tracking
- **GDPR Compliance**: Data retention policies

---

**Your AI-powered real estate lead follow-up system is now ready for production!** 🚀

The system will automatically:
- ✅ Contact new leads within 5 minutes
- ✅ Reactivate aged leads with personalized messages
- ✅ Manage multi-channel communication sequences
- ✅ Track all interactions and performance metrics
- ✅ Scale automatically based on demand

For support or questions, refer to the documentation or contact your development team.