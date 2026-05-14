#!/bin/bash
# Start resolver locally on your laptop

cd "$(dirname "$0")"

echo "🤖 Starting Hivebets Auto-Resolver Locally"
echo "==========================================="

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo "❌ .env.production not found!"
    echo "Please create .env.production with your resolver private key"
    exit 1
fi

echo "✅ Starting resolver..."
echo "Press Ctrl+C to stop"
echo ""

# Start the resolver
node market-resolver.js

