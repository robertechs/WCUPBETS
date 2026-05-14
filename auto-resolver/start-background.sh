#!/bin/bash
# Start resolver in background using PM2

cd "$(dirname "$0")"

echo "🚀 Starting Hivebets Auto-Resolver in Background"
echo "================================================"

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    npm install -g pm2
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Stop existing process if running
pm2 stop hivebets-resolver 2>/dev/null || true
pm2 delete hivebets-resolver 2>/dev/null || true

# Start with PM2
echo "Starting resolver with PM2..."
pm2 start market-resolver.js --name hivebets-resolver --time

# Save PM2 process list
pm2 save

echo ""
echo "✅ Resolver started in background!"
echo ""
echo "Useful commands:"
echo "  View logs:    pm2 logs hivebets-resolver"
echo "  Status:       pm2 status"
echo "  Stop:         pm2 stop hivebets-resolver"
echo "  Restart:      pm2 restart hivebets-resolver"
echo "  Auto-start:   pm2 startup (to start on boot)"
echo ""
echo "📊 Current status:"
pm2 status

