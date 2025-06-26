# Use Node.js v22-slim for development
FROM node:22-slim

# Set the working directory in the container
WORKDIR /app

# Copy package.json and yarn.lock to install dependencies
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the entire application
COPY . .

# Expose Vite's default development server port
EXPOSE 5173

# Start the development server
CMD ["yarn", "run", "dev", "--host"]
