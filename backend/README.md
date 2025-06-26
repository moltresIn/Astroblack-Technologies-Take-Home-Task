# Backend - FastAPI Application

This is the backend API built with FastAPI and Python 3.13.

## Prerequisites

- Python 3.13+
- pip or pipenv
- MongoDB (local installation or MongoDB Atlas)
- Git

## Local Development Setup

### 1. Create Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### 2. Install Dependencies

```bash
# Install all dependencies
pip install -r requirements.txt

# Or install development dependencies
pip install -r requirements-dev.txt  # if you have dev-specific requirements
```

### 3. Environment Configuration

Create a `.env` file in the backend directory:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=Testing
```

### 4. Database Setup

#### Local MongoDB

```bash
# Install MongoDB (Ubuntu/Debian)
sudo apt-get install mongodb

# Start MongoDB service
sudo systemctl start mongodb

# Or start MongoDB directly
mongod --dbpath /path/to/your/db
```

#### MongoDB Atlas (Cloud)

1. Create a MongoDB Atlas account
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

### 5. Start Development Server

```bash
# Start the FastAPI server with hot reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Or if you have a start script
python -m app.main
```

The API will be available at:

- API: http://localhost:8000
- Interactive API docs: http://localhost:8000/docs
- Alternative API docs: http://localhost:8000/redoc

## Docker Setup

### Build and Run with Docker

```bash
# Build the Docker image
docker build -t astroblock-backend .

# Run with environment variables
docker run -p 8000:8000 \
  -e MONGODB_URI=mongodb://host.docker.internal:27017 \
  -e MONGODB_DB_NAME=Testing \
  astroblock-backend
```

### Using Docker Compose (from root directory)

```bash
# Start backend with MongoDB
docker-compose up backend mongodb

# Start all services
docker-compose up
```

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry point
│   ├── db/                  # Database connection and related configurations
│   ├── models/              # Pydantic models and database schemas
│   │   ├── __init__.py
│   │   └── ...              # Other model files
│   ├── routers/             # API route handlers
│   │   ├── __init__.py
│   │   └── ...              # Other route files
│   ├── services/            # Business logic
│   │   ├── __init__.py
│   │   └── ...              # Other service files
│   ├── utils/               # Utility functions
│   │   ├── __init__.py
│   │   └── ...              # Other utility files
│   └── __pycache__/         # Compiled Python files
├── tests/                   # Test files
├── Dockerfile               # Docker configuration
├── requirements.txt         # Python dependencies
├── venv/                    # Virtual environment (excluded in production)
├── README.md                # Project documentation
```

Visit http://localhost:8000/docs for API documentation.

## Deployment

### Production Setup

1. **Set environment variables**

   ```bash
   export MONGODB_URI=mongodb://your-production-uri
   export SECRET_KEY=your-production-secret
   export ENVIRONMENT=production
   export DEBUG=false
   ```

2. **Install production dependencies**

   ```bash
   pip install -r requirements.txt
   ```

3. **Run with Gunicorn**
   ```bash
   gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
   ```

### Docker Production

```dockerfile
# Multi-stage Dockerfile for production
FROM python:3.13-alpine as builder
WORKDIR /code
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

FROM python:3.13-alpine
WORKDIR /code
COPY --from=builder /usr/local/lib/python3.13/site-packages /usr/local/lib/python3.13/site-packages
COPY . .
CMD ["gunicorn", "app.main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000"]
```

## Monitoring and Logging

### Logging Configuration

```python
import logging
from app.config import settings

logging.basicConfig(
    level=logging.INFO if settings.ENVIRONMENT == "production" else logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

logger = logging.getLogger(__name__)
```

### Health Checks

```python
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow(),
        "version": "1.0.0"
    }
```

## Troubleshooting

### Common Issues

1. **MongoDB connection failed**

   ```bash
   # Check MongoDB status
   sudo systemctl status mongodb

   # Check connection string
   echo $MONGODB_URI
   ```

2. **Import errors**

   ```bash
   # Ensure virtual environment is activated
   source venv/bin/activate

   # Reinstall dependencies
   pip install -r requirements.txt
   ```

3. **Port already in use**

   ```bash
   # Find process using port 8000
   lsof -i :8000

   # Kill the process
   kill -9 <PID>
   ```

4. **CORS errors**
   - Check `ALLOWED_ORIGINS` in configuration
   - Ensure frontend URL is included in CORS settings

### Debug Mode

```bash
# Run with debug logging
uvicorn app.main:app --reload --log-level debug
```

## Tech Stack

- **FastAPI**: Modern, fast web framework
- **Python 3.13**: Programming language
- **MongoDB**: NoSQL database
- **Motor**: Async MongoDB driver
- **Pydantic**: Data validation
- **Uvicorn**: ASGI server
