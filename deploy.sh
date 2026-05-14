#!/bin/bash
# Deployment script for DigitalOcean

set -e

echo "🚀 Hivebets Auto-Resolver Deployment"
echo "======================================"

# Configuration
DROPLET_IP=${DROPLET_IP:-"your_droplet_ip"}
DROPLET_USER=${DROPLET_USER:-"root"}
DEPLOY_PATH="/opt/hivebets-resolver"

echo "Target: $DROPLET_USER@$DROPLET_IP"
echo "Path: $DEPLOY_PATH"
echo ""

# Check if we're running locally or on the server
if [ "$1" == "local" ]; then
    echo "📦 Local deployment mode"
    
    # Build Docker image
    echo "Building Docker image..."
    docker-compose build
    
    # Start services
    echo "Starting services..."
    docker-compose up -d
    
    echo "✅ Deployment complete!"
    echo "View logs: docker-compose logs -f resolver"
    exit 0
fi

# Remote deployment
echo "🌐 Remote deployment to DigitalOcean"

# Check if SSH key exists
if [ ! -f ~/.ssh/id_rsa ]; then
    echo "❌ SSH key not found. Please set up SSH access to your droplet."
    exit 1
fi

# Test SSH connection
echo "Testing SSH connection..."
ssh -o ConnectTimeout=5 "$DROPLET_USER@$DROPLET_IP" "echo 'SSH connection successful'" || {
    echo "❌ Cannot connect to droplet. Please check IP and SSH access."
    exit 1
}

# Create deployment directory on server
echo "Creating deployment directory..."
ssh "$DROPLET_USER@$DROPLET_IP" "mkdir -p $DEPLOY_PATH"

# Copy files to server
echo "Copying files..."
rsync -avz --progress \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude '.next' \
    --exclude 'auto-resolver/resolver.log' \
    ./ "$DROPLET_USER@$DROPLET_IP:$DEPLOY_PATH/"

# Install Docker on server if not present
echo "Checking Docker installation..."
ssh "$DROPLET_USER@$DROPLET_IP" << 'ENDSSH'
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    systemctl start docker
    systemctl enable docker
fi

if ! command -v docker-compose &> /dev/null; then
    echo "Installing Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi
ENDSSH

# Deploy on server
echo "Deploying on server..."
ssh "$DROPLET_USER@$DROPLET_IP" << ENDSSH
cd $DEPLOY_PATH

# Stop existing container
docker-compose down || true

# Build and start
docker-compose build
docker-compose up -d

# Show status
docker-compose ps

echo ""
echo "✅ Deployment complete!"
echo "View logs: docker-compose logs -f resolver"
echo "Stop: docker-compose down"
echo "Restart: docker-compose restart"
ENDSSH

echo ""
echo "🎉 Deployment successful!"
echo ""
echo "Useful commands:"
echo "  View logs: ssh $DROPLET_USER@$DROPLET_IP 'cd $DEPLOY_PATH && docker-compose logs -f'"
echo "  Restart: ssh $DROPLET_USER@$DROPLET_IP 'cd $DEPLOY_PATH && docker-compose restart'"
echo "  Admin CLI: ssh $DROPLET_USER@$DROPLET_IP 'cd $DEPLOY_PATH/auto-resolver && npm run admin'"

