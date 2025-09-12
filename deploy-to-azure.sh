#!/bin/bash

# Deploy to Azure - Deployment preparation script
echo "🚀 Preparing Spice-e-Zaika for Azure deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Step 1: Backup original files
echo "📦 Backing up original files..."
cp package.json package.json.backup
cp vite.config.ts vite.config.ts.backup

# Step 2: Replace with production-ready files
echo "🔧 Configuring for production deployment..."
cp package.production.json package.json
cp vite.config.production.ts vite.config.ts

# Step 3: Ensure mock hooks are in place
echo "🛠️  Setting up production hooks..."
if [ ! -f "src/lib/mock-spark-hooks.ts" ]; then
    echo "❌ Error: mock-spark-hooks.ts not found. Please ensure it exists."
    exit 1
fi

# Step 4: Initialize mock spark object in index.html
echo "🌐 Configuring index.html for production..."
# Add the mock spark initialization to index.html before the main script
if ! grep -q "mock-spark-hooks" index.html; then
    sed -i 's|<script type="module" src="/src/main.tsx"></script>|<script type="module" src="/src/lib/mock-spark-hooks.ts"></script>\n    <script type="module" src="/src/main.tsx"></script>|' index.html
fi

# Step 5: Install production dependencies
echo "📦 Installing production dependencies..."
npm install --production=false

# Step 6: Build the application
echo "🔨 Building application for production..."
npm run build

# Step 7: Verify build
if [ -d "dist" ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Build output is in the 'dist' directory"
    
    # Show build info
    echo ""
    echo "📊 Build Information:"
    echo "   - Build directory: dist/"
    echo "   - Total files: $(find dist -type f | wc -l)"
    echo "   - Build size: $(du -sh dist | cut -f1)"
    
    echo ""
    echo "🎉 Ready for Azure deployment!"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Push your changes to your GitHub repository"
    echo "   2. In Azure Portal, go to your Static Web App"
    echo "   3. The GitHub Action will automatically deploy from the 'dist' folder"
    echo ""
    echo "🔗 Your app will be available at your Azure Static Web App URL"
else
    echo "❌ Build failed! Please check the error messages above."
    exit 1
fi

# Step 8: Create deployment info file
cat > DEPLOYMENT_INFO.md << 'EOF'
# Deployment Information

## Production Build Status
✅ Application built successfully for production deployment

## Changes Made for Production
- Removed Spark-specific dependencies
- Added localStorage-based state persistence
- Created mock implementations for Spark APIs
- Optimized build configuration for external deployment

## Deployment Notes
- This build uses localStorage instead of Spark's KV store
- LLM functionality is disabled (shows warning messages)
- All core catering functionality works normally
- User registration and order management fully functional

## Azure Deployment
- Build output: `dist/` directory  
- Static files ready for Azure Static Web Apps
- No server-side dependencies required

EOF

echo "📄 Created DEPLOYMENT_INFO.md with deployment details"
echo ""
echo "🚀 Deployment preparation complete!"