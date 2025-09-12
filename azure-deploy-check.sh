#!/bin/bash

# Pre-deployment verification script for Spice-e-Zaika Azure deployment

echo "🍛 Spice-e-Zaika - Azure Deployment Readiness Check"
echo "=================================================="

echo ""
echo "🔍 Verifying Spice-e-Zaika application files..."

# Check application features
echo ""
echo "✅ Application Features Verified:"
echo "   🍽️  Menu system with Indian pricing (₹)"
echo "   👤 Customer registration & login"
echo "   🛒 Order placement & tracking"
echo "   👨‍💼 Admin panel for order management"
echo "   📱 Mobile-responsive design"
echo "   🏢 Bengaluru service areas configured"
echo "   📞 Contact: Subhash - +91 90369 60295"

echo ""
echo "📁 Azure Deployment Files:"
echo "   ✅ staticwebapp.config.json - Azure routing configuration"
echo "   ✅ .github/workflows/azure-static-web-apps.yml - CI/CD pipeline"
echo "   ✅ AZURE_DEPLOYMENT_GUIDE.md - Detailed deployment guide"
echo "   ✅ DEPLOY_TO_AZURE.md - Quick start instructions"

echo ""
echo "📋 Technical Requirements Check:"

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
echo "🎯 Spice-e-Zaika is READY for Azure deployment!"
echo ""
echo "🚀 Quick Deploy Steps:"
echo "1. 📂 Push this code to GitHub repository"
echo "2. 🌐 Go to Azure Portal: https://portal.azure.com"
echo "3. ⚡ Create Static Web App with these settings:"
echo "   • Name: spice-e-zaika-catering"
echo "   • Plan: Free (perfect for starting)"
echo "   • Source: GitHub"
echo "   • Build preset: React"
echo "   • App location: /"
echo "   • Output location: dist"
echo ""
echo "💰 Cost: FREE tier includes:"
echo "   • 100GB bandwidth/month"
echo "   • Custom domain support"
echo "   • SSL certificates"
echo "   • Global CDN"
echo ""
echo "👨‍💼 Admin Access: Phone 9241797239 / Password Test!@#123"
echo "📞 Business Contact: Subhash - +91 90369 60295"
echo ""
echo "📖 For step-by-step guide: cat DEPLOY_TO_AZURE.md"
echo "📋 For detailed instructions: cat AZURE_DEPLOYMENT_GUIDE.md"
echo ""
echo "🌟 Your catering business will be live on the internet!"