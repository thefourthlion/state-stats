# Use the official Node.js LTS image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (including dev dependencies needed for build)
# Use --legacy-peer-deps to bypass react-simple-maps peer dependency conflict
RUN npm install --legacy-peer-deps

# Copy the .env file first (for build time)
COPY .env ./

# Copy the rest of your application files
COPY . .

# Build the Next.js app for production
RUN npm run build

# Remove dev dependencies after build
RUN npm prune --production --legacy-peer-deps

# Expose the port your app runs on
EXPOSE 3000

# Set the PORT environment variable
ENV PORT=3000
ENV NODE_ENV=production

# Start the Next.js app in production mode
CMD ["npm", "start"]