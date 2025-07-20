# Deployment Guide

## 🚀 Overview

This guide covers the deployment process for the Leadsbot application using AWS Amplify Gen2. The application is deployed as a full-stack solution with frontend, backend, and database services.

## 📋 Prerequisites

### Required Tools
- **Node.js 18+**: For local development and build processes
- **AWS CLI**: For AWS service management
- **AWS Amplify CLI**: For Amplify-specific commands
- **Git**: For version control and deployment triggers

### AWS Account Setup
- **AWS Account**: Active AWS account with appropriate permissions
- **IAM User**: User with Amplify and related service permissions
- **AWS Region**: Choose your preferred region (e.g., us-east-1)

## 🔧 Environment Configuration

### Local Environment Setup
```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /

# Configure AWS CLI
aws configure

# Install Amplify CLI
npm install -g @aws-amplify/cli

# Configure Amplify
amplify configure
```

### Environment Variables
Create `.env.local` for local development:
```env
VITE_APP_NAME=Leadsbot
VITE_APP_VERSION=1.0.0
VITE_API_ENDPOINT=your-api-endpoint
VITE_AWS_REGION=us-east-1
```

### Amplify Configuration
```bash
# Initialize Amplify in project
amplify init

# Add authentication
amplify add auth

# Add data layer
amplify add data

# Add storage (if needed)
amplify add storage

# Add functions (if needed)
amplify add function
```

## 🏗️ Build Process

### Local Build
```bash
# Install dependencies
npm install

# Type checking
npm run type-check

# Linting
npm run lint

# Testing
npm test
npm run test:coverage

# Build for production
npm run build
```

### Build Verification
```bash
# Preview production build
npm run preview

# Analyze bundle size
npm run build:analyze
```

## 🚀 Deployment Options

### 1. Amplify Console Deployment (Recommended)

#### Automatic Deployment
```bash
# Push to Git repository
git add .
git commit -m "Deploy to production"
git push origin main

# Amplify Console will automatically build and deploy
```

#### Manual Deployment
```bash
# Build and deploy
amplify push

# Deploy to production
amplify push --yes
```

### 2. AWS CLI Deployment

#### Build and Deploy
```bash
# Build the application
npm run build

# Deploy to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### 3. CI/CD Pipeline Deployment

#### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to AWS Amplify

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build application
      run: npm run build
    
    - name: Deploy to Amplify
      run: |
        npm install -g @aws-amplify/cli
        amplify push --yes
```

## 🌍 Environment Management

### Development Environment
```bash
# Switch to development environment
amplify env checkout dev

# Deploy to development
amplify push
```

### Staging Environment
```bash
# Create staging environment
amplify env add staging

# Deploy to staging
amplify env checkout staging
amplify push
```

### Production Environment
```bash
# Create production environment
amplify env add prod

# Deploy to production
amplify env checkout prod
amplify push --yes
```

## 📊 Monitoring and Logs

### Amplify Console Monitoring
- **Build Logs**: View build process and errors
- **Performance Monitoring**: Track application performance
- **Error Tracking**: Monitor application errors
- **Access Logs**: Track user access patterns

### CloudWatch Integration
```bash
# View CloudWatch logs
aws logs describe-log-groups

# Get specific log streams
aws logs describe-log-streams --log-group-name /aws/amplify/your-app
```

### Application Monitoring
```typescript
// Add monitoring to your application
import { Amplify } from 'aws-amplify';

Amplify.configure({
  // ... other config
  Analytics: {
    disabled: false,
    autoTrack: true
  }
});
```

## 🔒 Security Configuration

### Authentication Setup
```bash
# Configure authentication
amplify add auth

# Choose authentication method
? Do you want to use the default authentication and security configuration? 
  ❯ Default configuration
    Default configuration with Social Provider (Federation)
    Manual configuration
    I want to learn more.
```

### Authorization Rules
```graphql
# GraphQL schema with authorization
type Lead @model @auth(rules: [
  { allow: owner }
  { allow: groups, groups: ["Admins"] }
]) {
  id: ID!
  name: String!
  email: String!
  owner: String
}
```

### Environment Variables Security
```bash
# Set sensitive environment variables
amplify env add --name prod
amplify env checkout prod

# Add environment variables
amplify env add --name prod --env-vars API_KEY=your-api-key
```

## 🔄 Database Migrations

### Schema Changes
```bash
# Update GraphQL schema
# Edit amplify/backend/api/your-api/schema.graphql

# Push schema changes
amplify push

# Generate TypeScript types
amplify codegen
```

### Data Migration
```bash
# Export data from development
amplify env checkout dev
# Export data using AWS CLI or console

# Import data to production
amplify env checkout prod
# Import data using AWS CLI or console
```

## 🚨 Rollback Procedures

### Application Rollback
```bash
# Rollback to previous version
amplify env checkout prod
amplify env rollback

# Or rollback specific resources
amplify env rollback --resource api
```

### Database Rollback
```bash
# Restore from backup
aws dynamodb restore-table-from-backup \
  --target-table-name your-table-name \
  --backup-arn your-backup-arn
```

## 📈 Performance Optimization

### Build Optimization
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@aws-amplify/ui-react'],
          charts: ['recharts']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
```

### CDN Configuration
```bash
# Configure CloudFront for better performance
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json
```

### Caching Strategy
```typescript
// Service worker for caching
// public/sw.js
const CACHE_NAME = 'leadsbot-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});
```

## 🔍 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear build cache
rm -rf node_modules package-lock.json
npm install

# Clear Amplify cache
amplify env checkout dev
amplify push --force
```

#### Deployment Issues
```bash
# Check Amplify status
amplify status

# View detailed logs
amplify console

# Force push
amplify push --force
```

#### Environment Issues
```bash
# List environments
amplify env list

# Remove problematic environment
amplify env remove prod

# Recreate environment
amplify env add prod
```

### Debug Commands
```bash
# Check AWS credentials
aws sts get-caller-identity

# Check Amplify configuration
amplify configure

# View environment variables
amplify env get --name prod

# Check API status
aws apigateway get-rest-apis
```

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] All tests pass (`npm test`)
- [ ] Code coverage meets requirements (`npm run test:coverage`)
- [ ] Linting passes (`npm run lint`)
- [ ] Type checking passes (`npm run type-check`)
- [ ] Build succeeds locally (`npm run build`)
- [ ] Environment variables configured
- [ ] Database migrations tested
- [ ] Security review completed

### Deployment
- [ ] Switch to target environment (`amplify env checkout prod`)
- [ ] Deploy backend changes (`amplify push`)
- [ ] Deploy frontend changes (`amplify push`)
- [ ] Verify deployment in Amplify Console
- [ ] Test critical user flows
- [ ] Monitor error logs
- [ ] Update documentation

### Post-Deployment
- [ ] Monitor application performance
- [ ] Check error rates
- [ ] Verify all features work correctly
- [ ] Update deployment documentation
- [ ] Notify stakeholders
- [ ] Schedule monitoring review

## 🎯 Best Practices

### Deployment Strategy
1. **Blue-Green Deployment**: Use multiple environments for zero-downtime deployments
2. **Feature Flags**: Use feature flags for gradual rollouts
3. **Automated Testing**: Run tests before every deployment
4. **Monitoring**: Set up comprehensive monitoring and alerting
5. **Backup Strategy**: Regular backups of database and configuration

### Security Best Practices
1. **Environment Isolation**: Separate development, staging, and production environments
2. **Secret Management**: Use AWS Secrets Manager for sensitive data
3. **Access Control**: Implement least-privilege access policies
4. **Regular Updates**: Keep dependencies and infrastructure updated
5. **Security Scanning**: Regular security scans and vulnerability assessments

### Performance Best Practices
1. **CDN Usage**: Use CloudFront for global content delivery
2. **Caching Strategy**: Implement appropriate caching at multiple levels
3. **Bundle Optimization**: Minimize and optimize JavaScript bundles
4. **Image Optimization**: Compress and optimize images
5. **Database Optimization**: Optimize queries and indexes

This deployment guide ensures reliable, secure, and performant deployments of the Leadsbot application. 