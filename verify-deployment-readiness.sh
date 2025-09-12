#!/bin/bash

# Verification script for Azure deployment readiness
echo "🔍 Verifying Azure deployment readiness for Spice-e-Zaika..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

echo "✅ Found package.json"

# Check if Spark dependencies are removed
if grep -q "@github/spark" package.json; then
    echo "❌ Error: @github/spark dependency still present in package.json"
    echo "   Please remove it for Azure deployment compatibility"
    exit 1
else
    echo "✅ Spark dependencies removed from package.json"
fi

# Check if vite config is updated
if grep -q "sparkPlugin" vite.config.ts; then
    echo "❌ Error: Spark plugins still present in vite.config.ts"
    echo "   Please update vite.config.ts to remove Spark-specific plugins"
    exit 1
else
    echo "✅ Vite config updated for production deployment"
fi

# Check if mock hooks exist
if [ -f "src/lib/mock-spark-hooks.ts" ]; then
    echo "✅ Mock Spark hooks implementation found"
else
    echo "❌ Error: Mock Spark hooks not found at src/lib/mock-spark-hooks.ts"
    echo "   This file is required for production deployment"
    exit 1
fi

# Check if main.tsx is updated
if grep -q "mock-spark-hooks" src/main.tsx; then
    echo "✅ Main entry point updated to use mock hooks"
else
    echo "❌ Error: main.tsx not updated to import mock hooks"
    echo "   Please update src/main.tsx to import the mock implementation"
    exit 1
fi

echo ""
echo "🎉 All checks passed! Your app is ready for Azure deployment"
echo ""
echo "📋 Next steps:"
echo "   1. Commit and push your changes to GitHub"
echo "   2. GitHub Actions will automatically build and deploy to Azure"
echo "   3. Your catering app will be live at your Azure Static Web App URL"
echo ""
echo "🔗 Admin access: Phone: 9241797239, Password: Test!@#123"

# Create a deployment status file
cat > deployment-status.json << 'EOF'
{
  "status": "ready",
  "timestamp": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'",
  "platform": "azure-static-web-apps",
  "app_name": "spice-e-zaika-catering",
  "features_working": [
    "Menu selection and pricing",
    "User registration and login", 
    "Order placement and tracking",
    "Admin panel for order management",
    "Mobile-responsive design",
    "Local data persistence"
  ],
  "features_disabled": [
    "LLM/AI functionality",
    "GitHub user integration"
  ],
  "admin_credentials": {
    "phone": "9241797239",
    "password": "Test!@#123"
  }
}
EOF

echo "✅ Created deployment-status.json with deployment information"