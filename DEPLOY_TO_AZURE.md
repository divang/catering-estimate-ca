# Spice-e-Zaika - Azure Static Web Apps Deployment

## Quick Deployment Steps

### 1. Prerequisites
- Azure account (free tier available)
- GitHub repository with this code
- This repository should be public or have Azure access

### 2. Deploy to Azure Static Web Apps

#### Option A: One-Click Deploy Button

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.StaticApp)

#### Option B: Manual Setup

1. **Go to Azure Portal**: [portal.azure.com](https://portal.azure.com)

2. **Create Static Web App**:
   - Search for "Static Web Apps"
   - Click "Create"
   - Fill in the details:
     - **Name**: `spice-e-zaika-catering`
     - **Region**: Choose closest to your users
     - **GitHub Integration**: Connect your repository
     - **Build Configuration**:
       - Build Presets: `React`
       - App location: `/`
       - Output location: `dist`

3. **Automatic Deployment**:
   - GitHub Actions will automatically deploy your app
   - Check the "Actions" tab in your GitHub repo for progress

### 3. Your Live App

After deployment, your app will be available at:
```
https://YOUR-APP-NAME-RANDOM.azurestaticapps.net
```

### 4. Custom Domain (Optional)

To use your own domain:
1. Go to your Static Web App in Azure Portal
2. Click "Custom domains"
3. Add your domain and follow DNS instructions

## Configuration Files

This repository includes:
- `staticwebapp.config.json` - Azure routing configuration
- `.github/workflows/azure-static-web-apps.yml` - Automatic deployment
- `AZURE_DEPLOYMENT_GUIDE.md` - Detailed deployment guide

## Features Included

✅ **Free Hosting** with 100GB bandwidth  
✅ **Automatic HTTPS** with SSL certificates  
✅ **Global CDN** for fast worldwide access  
✅ **Automatic Deployments** from GitHub  
✅ **Custom Domains** support  
✅ **Mobile Responsive** design  

## Cost

- **Free Tier**: Perfect for most small businesses
- **Standard Tier**: $9/month for production use with higher limits

## Support

For deployment issues, check the detailed [Azure Deployment Guide](./AZURE_DEPLOYMENT_GUIDE.md) or contact support through Azure Portal.