# Scaling Notes

This document explains the scaling-related parts of the project: Redis, BullMQ, Docker, Nginx, backend replicas, and CI.

## Current Deployment

The live demo currently uses:

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas
- Media: Cloudinary

The Docker/Nginx setup is used as a local production-style scaling environment.

In the free production deployment, the backend uses Redis for cache and rate limiting. BullMQ worker processing is implemented and tested locally/Docker, but the production worker is disabled unless `ENABLE_VIDEO_WORKER=true` and a worker service is deployed.

## Why Docker Is Used

Docker gives every service a predictable runtime. Instead of relying on one developer machine, the app can run with the same Node.js version, Nginx config, Redis version, and service network every time.

In this project Docker is used to run:

- Backend API
- Frontend static server
- Redis
- BullMQ worker
- Nginx reverse proxy/load balancer

## Why Nginx Is Used

Nginx acts as the public gateway.

Request flow:

```txt
Browser → Nginx :80 → Frontend container or Backend container


# Request Routing

The application uses **Nginx** as a reverse proxy to route incoming requests.

### Routing Rules

| Route | Destination |
|--------|-------------|
| `/` | Frontend container |
| `/api/v1/...` | Backend container(s) |

Example:

```text
/             → frontend
/api/v1/...   → backend
```

When multiple backend containers are running, Nginx distributes incoming API requests using **round-robin load balancing**, allowing traffic to be shared evenly across all backend instances.

---

# Why the Backend Can Be Replicated

The backend is designed to be **stateless**, meaning it does not store user sessions or application state in server memory.

Instead, shared state is stored in external services:

- **JWT tokens** handle authentication.
- **MongoDB Atlas** stores persistent application data.
- **Redis** stores shared cache, rate-limit data, and BullMQ queues.
- **Cloudinary** stores uploaded media.

Because no request depends on a specific backend instance, any backend container can process any request. This makes horizontal scaling simple by adding more backend containers.

---

# Why Redis Is Used

Redis provides a fast, shared in-memory data store that is accessible by every backend instance.

In this project, Redis is used for:

- API response caching
- Rate limiting
- BullMQ queue storage

> **Note:** Redis is **not** the source of truth. MongoDB remains the primary database.

## Graceful Degradation

If Redis becomes unavailable:

- Cache reads return `null`.
- Cache writes are skipped.
- The application continues functioning normally.

This approach is known as **graceful degradation**, where Redis improves performance but is not required for core functionality.

---

# Cache Strategy

The application caches frequently requested data to reduce database load.

## Cached Data

- Home feed
- Recommended videos

## Cache Invalidation

Cache is automatically cleared whenever video data changes, including:

- New video published
- Video updated
- Video deleted
- Publish status toggled

This ensures users never receive stale feed or recommendation data.

---

# Why BullMQ Is Used

Some operations are time-consuming and should not delay the API response.

Instead of performing them synchronously, the application offloads them to a background queue using **BullMQ**.

### Example Workflow

When a user publishes a video:

1. The API saves the video.
2. A background job is added to BullMQ.
3. The API immediately returns a response.
4. A worker processes the queued job asynchronously.

The worker performs tasks such as:

- Finding subscribers
- Creating notification documents in MongoDB

Benefits include:

- Faster API responses
- Retry support for failed jobs
- Better scalability

---

# Queue Flow

```text
publishAVideo controller
        │
        ▼
addVideoPublishedJob()
        │
        ▼
BullMQ Queue (Redis)
        │
        ▼
Video Worker
        │
        ▼
Notification Documents (MongoDB)
```

---

# Rate Limiting

Rate limiting protects the API from abuse and excessive requests.

Different limits are applied based on route type:

- General API routes
- Authentication routes
- Upload routes

The application uses **Redis-backed rate limiting**, allowing all backend instances to share the same rate-limit state.

## Fallback Behavior

If Redis is unavailable, the application automatically falls back to **memory-based rate limiting**, ensuring protection remains active.

---

# CI Validation

GitHub Actions automatically validates the project on every push or pull request.

The CI pipeline performs the following checks:

- Backend tests
- Frontend production build
- Backend Docker image build
- Frontend Docker image build
- Docker Compose configuration validation