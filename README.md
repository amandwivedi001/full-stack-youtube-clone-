## Architecture

This project is a MERN-based video sharing platform with a production-style local infrastructure.

### Services

- **Frontend**: React/Vite application built into static files and served by Nginx.
- **API Backend**: Node.js/Express REST API for authentication, videos, comments, playlists, subscriptions, and dashboard data.
- **Worker**: BullMQ worker process for asynchronous background jobs such as video-published notifications.
- **Redis**: Shared cache, rate-limit store, and BullMQ queue backend.
- **MongoDB Atlas**: Managed source-of-truth database.
- **Cloudinary**: Media storage for videos, thumbnails, avatars, and cover images.
- **Root Nginx**: Reverse proxy and load balancer.

### Request Flow

```text
Browser
    │
    ▼
Nginx Reverse Proxy
    ├── /            ──► Frontend (Nginx)
    └── /api/v1      ──► Backend API
                            ├── Redis (Cache / Rate Limits / BullMQ)
                            ├── MongoDB Atlas
                            └── Cloudinary
```

### Background Job Flow

```text
Video Upload Request
        │
        ▼
API uploads media to Cloudinary
        │
        ▼
API saves video metadata in MongoDB
        │
        ▼
API enqueues BullMQ job in Redis
        │
        ▼
Worker consumes job
        │
        ▼
Worker creates subscriber notifications
```

### Scaling

The backend runs behind Nginx as multiple instances.

```text
                 Nginx Upstream
                       │
        ┌──────────────┴──────────────┐
        ▼                             ▼
   backend-1                    backend-2
        │                             │
        └──────────────┬──────────────┘
                       ▼
                    Redis
                       │
         Shared cache, rate limits,
          and BullMQ job queues
```

Redis is shared across all backend instances so that caching, rate limiting, and background job processing remain consistent across the application.

---

## Running With Docker

### 1. Create the environment file

Copy the example environment configuration:

```bash
cp .env.example .env
```

### 2. Start the application stack

Build and start all services:

```bash
docker compose up -d --build
```

### 3. Open the application

Frontend:

```text
http://localhost
```

Health Check API:

```text
http://localhost/api/v1/healthcheck
```

### Useful Docker Commands

View running containers:

```bash
docker compose ps
```

View Nginx logs:

```bash
docker compose logs -f nginx
```

View Backend Instance 1 logs:

```bash
docker compose logs -f backend-1
```

View Backend Instance 2 logs:

```bash
docker compose logs -f backend-2
```

View Worker logs:

```bash
docker compose logs -f video-worker
```

Stop the entire stack:

```bash
docker compose down
```

---

## Production Concepts Implemented

This project demonstrates several production-oriented backend engineering concepts:

- JWT authentication with secure HTTP-only cookies
- Cloudinary media storage for videos, thumbnails, avatars, and cover images
- MongoDB aggregation pipelines for dashboard and feed queries
- MongoDB indexes optimized for common access patterns
- Zod request validation for robust API input validation
- Helmet security headers
- Redis caching with TTL and cache invalidation
- Redis-backed rate limiting
- BullMQ background job processing
- Dockerized backend, worker, Redis, and frontend services
- Nginx reverse proxy and load balancing across backend instances
- Health check endpoint with dependency status reporting