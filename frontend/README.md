# Frontend - React Application

This is the frontend application built with React and Vite.

## Prerequisites

- Node.js 22+
- Yarn or npm
- Git

## Local Development Setup

### 1. Install Dependencies

```bash
# Using Yarn (recommended)
yarn install

# Or using npm
npm install
```

### 2. Start Development Server

```bash
# Using Yarn
yarn dev

# Or using npm
npm run dev
```

The application will be available at: http://localhost:5173

## Docker Setup

### Build and Run with Docker

```bash
# Build the Docker image
docker build -t astroblock-frontend .

# Run the container
docker run -p 5173:5173 -v $(pwd):/app -v /app/node_modules astroblock-frontend
```

### Using Docker Compose (from root directory)

```bash
# Start only frontend service
docker-compose up frontend

# Start frontend with dependencies
docker-compose up frontend backend mongodb
```

## Available Scripts

```bash
# Start development server
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview

# Run tests (if configured)
yarn test

# Lint code
yarn lint

# Format code
yarn format
```

## Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API services
│   ├── utils/            # Utility functions
│   ├── contexts/         # Contexts
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx           # Main App component
│   └── main.tsx          # Entry point
├── package.json
├── vite.config.js
├── Dockerfile
└── README.md
```

## API Integration

The frontend communicates with the backend API. Ensure the backend is running on port 8000.

## Building for Production

```bash
# Build the application
yarn build

# The built files will be in the 'dist' directory
# You can serve them with any static file server
```

### Serve Production Build Locally

```bash
# Preview the production build
yarn preview

# Or serve with a static server
npx serve dist
```

## Deployment

### Docker Deployment

```bash
# Build production image
docker build -t astroblock-frontend:prod --target production .

# Run production container
docker run -p 80:80 astroblock-frontend:prod
```

### Static Hosting

The built files in the `dist` directory can be deployed to:

- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages
- Any static hosting service

## Troubleshooting

### Common Issues

1. **Port 5173 already in use**

   ```bash
   # Kill process using the port
   lsof -ti:5173 | xargs kill -9

   # Or use a different port
   yarn dev --port 3000
   ```

2. **API connection refused**

   - Ensure backend is running on port 8000
   - Check CORS settings in backend
   - Verify VITE_API_URL in .env file

3. **Dependencies installation fails**

   ```bash
   # Clear cache and reinstall
   yarn cache clean
   rm -rf node_modules
   yarn install
   ```

4. **Hot reload not working**
   - Ensure volume mounts are correct in Docker
   - Check file permissions
   - Restart development server

### Development Tips

- Use React DevTools browser extension
- Enable source maps for debugging
- Use the Vite plugin ecosystem for additional features
- Check browser console for errors and warnings

## Testing

```bash
# Run unit tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:coverage
```

## Linting and Formatting

```bash
# Lint code
yarn lint

# Fix linting issues
yarn lint:fix

# Check formatting
yarn format:check

# Format code
yarn format
```

## Tech Stack

- **React**: UI framework
- **Vite**: Build tool and dev server
- **TypeScript**: Type safety
- **Tailwindcss**: Styling
