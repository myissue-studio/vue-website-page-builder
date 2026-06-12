#!/bin/bash

# Vue Website Page Builder - Local Development Setup Script

echo "🚀 Setting up Vue Website Page Builder for local development..."

# Build the library
echo "📦 Building the library..."
npm run build:lib

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

echo "✅ Setup complete!"
echo ""
echo "🔄 Development workflow:"
echo "- Make changes to the Vue page builder"
echo "- Run: make dev (or npm run build:lib)"
echo "- Restart your Laravel dev server" 