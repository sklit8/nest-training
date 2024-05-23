# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Copy the rest of the application code
COPY . .


# Copy shared libraries
COPY ../../libs ./libs

# Build the application
RUN pnpm build

# Expose the application port
EXPOSE 3001

# Command to run the application
CMD ["pnpm", "start:prod"]
