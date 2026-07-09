FROM node:20-bullseye

# Install system dependencies for sharp
RUN apt-get update && apt-get install -y \
  libvips-dev \
  python3 \
  make \
  g++ \
  && rm -rf /var/lib/apt/lists/*

# Set env
ENV NODE_ENV=production

# App directory
WORKDIR /app

# Copy package files first (better cache)
COPY package.json package-lock.json ./

# Install ALL dependencies (needed for build)
RUN npm ci

# Copy app source
COPY . .

# Build Strapi admin
RUN npm run build

# Remove dev dependencies, keep only production + reinstall sharp for linux-x64
RUN npm prune --production && \
    npm install --platform=linux --arch=x64 sharp

# Expose Strapi port
EXPOSE 1337

# Start Strapi
CMD ["npm", "run", "start"]