# Astroblock Technologies Full-Stack Application

A full-stack application with React/Vite frontend and FastAPI backend, using MongoDB as the database.

## Project Structure

```
├── README.md                 # This file
├── docker-compose.yml        # Docker composition for full stack
├── frontend/                 # React/Vite application
│   ├── README.md            # Frontend-specific documentation
│   ├── Dockerfile           # Frontend Docker configuration
│   ├── package.json         # Node.js dependencies
│   └── ...
└── backend/                  # FastAPI application
    ├── README.md            # Backend-specific documentation
    ├── Dockerfile           # Backend Docker configuration
    ├── requirements.txt     # Python dependencies
    └── ...
```

## Quick Start (Docker - Recommended)

### Prerequisites

- Docker and Docker Compose installed
- Git

### Running the Full Stack

1. **Clone the repository**

   ```bash
   git clone https://github.com/moltresIn/Astroblack-Technologies-Take-Home-Task.git
   cd Astroblack-Technologies-Take-Home-Task
   ```

2. **Start all services**

   ```bash
   docker-compose up --build
   ```

3. **Access the applications**

   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - Backend API Docs: http://localhost:8000/docs
   - MongoDB: localhost:27018

4. **Stop all services**
   ```bash
   docker-compose down
   ```

### Docker Commands

- **Build and start in background**: `docker-compose up -d --build`
- **View logs**: `docker-compose logs -f [service-name]`
- **Restart a service**: `docker-compose restart [service-name]`
- **Remove volumes**: `docker-compose down -v`

## Development Setup (Local)

For local development without Docker, follow the individual setup instructions:

### Backend Setup

See [backend/README.md](./backend/README.md) for detailed instructions.

Quick start:

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend Setup

See [frontend/README.md](./frontend/README.md) for detailed instructions.

Quick start:

```bash
cd frontend
yarn install
yarn run dev
```

### Database Setup

- Install MongoDB locally or use MongoDB Atlas
- Update connection strings in backend configuration

## Environment Configuration

### Backend Environment Variables

- `MONGODB_URI`: MongoDB connection string (default: `mongodb://localhost:27017`)
- `MONGODB_DB_NAME`: Database name (default: `Testing`)

## API Documentation

When the backend is running, visit:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Troubleshooting

### Common Issues

1. **Port conflicts**: Change ports in docker-compose.yml if needed
2. **MongoDB connection issues**: Ensure MongoDB is running on correct port
3. **Frontend can't reach backend**: Check CORS settings and API URLs
4. **Docker build fails**: Clear Docker cache with `docker system prune`

### Logs

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs frontend
docker-compose logs backend
docker-compose logs mongodb
```

## Tech Stack

### Frontend

- React
- Vite
- TypeScript
- Tailwind CSS

### Backend

- FastAPI
- Python 3.13
- Uvicorn
- Pydantic

### Database

- MongoDB

### DevOps

- Docker
- Docker Compose
