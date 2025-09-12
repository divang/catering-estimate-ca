# Azure Deployment Guide for Spice-e-Zaika

This guide will help you deploy your Spice-e-Zaika catering application to Azure Static Web Apps, making it publicly accessible.

## Prerequisites

1. **Azure Account**: Sign up for a free Azure account at [azure.microsoft.com](https://azure.microsoft.com)
2. **GitHub Account**: Your code should be in a GitHub repository
3. **Azure CLI** (optional): For command-line deployment

## Deployment Methods

### Method 1: Azure Portal Deployment (Recommended for beginners)

#### Step 1: Create Azure Static Web App

1. **Login to Azure Portal**
   - Go to [portal.azure.com](https://portal.azure.com)
   - Sign in with your Azure account

2. **Create a new Static Web App**
   - Click "Create a resource" 
   - Search for "Static Web Apps"
   - Click "Create"

3. **Configure the Static Web App**
   - **Subscription**: Select your Azure subscription
   - **Resource Group**: Create new or use existing
   - **Name**: `spice-e-zaika-catering` (or your preferred name)
   - **Plan type**: Free (for testing) or Standard (for production)
   - **Region**: Choose closest to your users (e.g., East US, West Europe)
   - **Deployment source**: GitHub

4. **Connect to GitHub**
   - Sign in to GitHub when prompted
   - **Organization**: Select your GitHub username/organization
   - **Repository**: Select your repository containing this code
   - **Branch**: main (or your default branch)

5. **Build Configuration**
   - **Build Presets**: React
   - **App location**: `/` (root of repository)
   - **Api location**: `` (leave empty)
   - **Output location**: `dist`

6. **Review and Create**
   - Click "Review + create"
   - Click "Create"

#### Step 2: Configure GitHub Secrets

The deployment will create a GitHub Action workflow automatically, but you need to ensure the secrets are properly set:

1. Go to your GitHub repository
2. Click on "Settings" tab
3. Go to "Secrets and variables" → "Actions"
4. The `AZURE_STATIC_WEB_APPS_API_TOKEN` should be automatically created
5. If not present, you can find it in the Azure portal under your Static Web App → "Manage deployment token"

### Method 2: Azure CLI Deployment

```bash
# Install Azure CLI
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Login to Azure
az login

# Create resource group
az group create --name spice-e-zaika-rg --location eastus

# Create static web app
az staticwebapp create \\
  --name spice-e-zaika-catering \\
  --resource-group spice-e-zaika-rg \\
  --source https://github.com/YOUR_USERNAME/YOUR_REPO_NAME \\
  --location eastus \\
  --branch main \\
  --app-location "/" \\
  --output-location "dist"
```

## Configuration Files Included

### `staticwebapp.config.json`
This file configures Azure Static Web Apps routing and includes:
- Single Page Application (SPA) routing support
- MIME type configurations
- Caching headers
- Fallback routing for React Router

### `.github/workflows/azure-static-web-apps.yml`
GitHub Actions workflow that:
- Automatically builds and deploys on push to main branch
- Uses Node.js 18
- Runs `npm run build`
- Deploys to Azure Static Web Apps

## Domain Configuration

### Default Domain
After deployment, your app will be available at:
```
https://YOUR_APP_NAME-RANDOM_STRING.azurestaticapps.net
```

### Custom Domain (Optional)

1. **Purchase a domain** from any domain registrar
2. **In Azure Portal**:
   - Go to your Static Web App
   - Click "Custom domains" in the left menu
   - Click "Add custom domain"
   - Enter your domain (e.g., `spice-e-zaika.com`)
   - Follow the DNS configuration instructions

3. **Configure DNS** with your domain registrar:
   - Add a CNAME record pointing to your Azure Static Web App URL

## Environment Variables

If you need environment variables for production:

1. **In Azure Portal**:
   - Go to your Static Web App
   - Click "Configuration" in the left menu
   - Add application settings as needed

2. **In GitHub Secrets**:
   - Add any build-time secrets needed

## Monitoring and Logs

### View Deployment Logs
1. Go to your GitHub repository
2. Click "Actions" tab
3. Click on the latest workflow run to see build and deployment logs

### View Application Logs
1. In Azure Portal, go to your Static Web App
2. Click "Functions" → "Application Insights" for detailed monitoring

## Cost Estimation

### Free Tier Includes:
- 100 GB bandwidth per month
- 0.5 GB storage
- Custom domains
- SSL certificates
- Global distribution

### Paid Tier (Standard):
- $9/month base cost
- Additional bandwidth: $0.20/GB
- Additional storage: $0.05/GB

## Security Features

- **Automatic HTTPS**: SSL certificates are automatically managed
- **Global CDN**: Content delivered from edge locations worldwide
- **DDoS Protection**: Built-in protection against attacks
- **Authentication**: Can integrate with Azure AD, GitHub, Twitter, etc.

## Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check GitHub Actions logs
   - Ensure all dependencies are in package.json
   - Verify Node.js version compatibility

2. **Routing Issues**
   - Check `staticwebapp.config.json`
   - Ensure SPA fallback routing is configured

3. **Performance Issues**
   - Enable caching headers
   - Optimize images and assets
   - Use Azure CDN for better global performance

## Maintenance

### Regular Updates:
1. **Dependencies**: Keep npm packages updated
2. **Security**: Monitor for security updates
3. **Performance**: Use Azure Application Insights for monitoring
4. **Backups**: GitHub repository serves as your backup

### Scaling:
- Azure Static Web Apps automatically scales based on traffic
- No server management required
- Global distribution included

## Support

- **Azure Documentation**: [docs.microsoft.com/azure/static-web-apps](https://docs.microsoft.com/azure/static-web-apps)
- **GitHub Issues**: Create issues in your repository
- **Azure Support**: Available through Azure portal

## Next Steps After Deployment

1. **Test the live application** thoroughly
2. **Set up monitoring** and alerts
3. **Configure custom domain** if needed
4. **Set up backup/recovery** procedures
5. **Document the deployment** process for your team

Your Spice-e-Zaika catering application will be publicly accessible and professionally hosted on Azure's global infrastructure!