#!/bin/bash

# Pre-deployment verification script for Azure Static Web Apps

echo "🚀 Spice-e-Zaika - Azure Deployment Preparation"
echo "================================================"

echo ""
echo "✅ Files created for Azure deployment:"
echo "   📁 staticwebapp.config.json - Azure routing configuration"
echo "   📁 .github/workflows/azure-static-web-apps.yml - CI/CD pipeline"
echo "   📁 AZURE_DEPLOYMENT_GUIDE.md - Detailed deployment guide"
echo "   📁 DEPLOY_TO_AZURE.md - Quick deployment instructions"

echo ""
echo "📋 Deployment Requirements Check:"

# Check if package.json exists
if [ -f "package.json" ]; then
    echo "   ✅ package.json found"
else
    echo "   ❌ package.json missing"
    exit 1
fi

# Check if index.html exists
if [ -f "index.html" ]; then
    echo "   ✅ index.html found"
else
    echo "   ❌ index.html missing"
    exit 1
fi

# Check if src directory exists
if [ -d "src" ]; then
    echo "   ✅ src/ directory found"
else
    echo "   ❌ src/ directory missing"
    exit 1
fi

# Check if App.tsx exists
if [ -f "src/App.tsx" ]; then
    echo "   ✅ src/App.tsx found"
else
    echo "   ❌ src/App.tsx missing"
    exit 1
fi

# Check vite config
if [ -f "vite.config.ts" ]; then
    echo "   ✅ vite.config.ts found"
else
    echo "   ❌ vite.config.ts missing"
    exit 1
fi

echo ""
echo "🎯 Ready for Azure deployment!"
echo ""
echo "Next Steps:"
echo "1. Push this code to your GitHub repository"
echo "2. Go to Azure Portal: https://portal.azure.com"
echo "3. Create a new Static Web App"
echo "4. Connect to your GitHub repository"
echo "5. Use these build settings:"
echo "   - App location: /"
echo "   - Output location: dist"
echo "   - Build preset: React"
echo ""
echo "📖 For detailed instructions, see AZURE_DEPLOYMENT_GUIDE.md"
echo ""
echo "🌐 Your Spice-e-Zaika catering app will be live on Azure!"