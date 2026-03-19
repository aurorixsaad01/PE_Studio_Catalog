# Use Node
FROM node:18

# Set working directory
WORKDIR /app

# Copy files
COPY package*.json ./
RUN npm install

COPY . .

# Build app
RUN npm run build

# Install serve
RUN npm install -g serve

# Expose port
EXPOSE 8080

# Start app
CMD ["serve", "-s", "dist", "-l", "8080"]
