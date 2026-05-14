FROM node:18-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app directory
WORKDIR /app

# Copy package files
COPY auto-resolver/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY auto-resolver/ .

# Create log directory
RUN mkdir -p /app/logs

# Run as non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the resolver
CMD ["node", "market-resolver.js"]

