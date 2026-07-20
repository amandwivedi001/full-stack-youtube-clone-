# API Testing Notes

The backend test suite uses Vitest and Supertest.

## Why Tests Were Added

The project includes authentication, ownership rules, caching, queues, and validation. These areas can easily break during refactoring, so automated tests were added to protect important backend behavior.

## Test Categories

## Health Check

Verifies that the API health endpoint returns service status such as API, MongoDB, Redis, uptime, environment, and timestamp.

## Authentication And Protected Routes

Verifies that protected routes reject requests without a valid JWT token.

Covered examples:

- Current user route
- Video upload route

## Validation Middleware

Verifies that invalid request data is rejected before reaching controllers.

Covered examples:

- Invalid ObjectId
- Invalid sort fields
- Invalid request body
- Safe parsed query stored in `req.validatedQuery`

## Ownership Authorization

Verifies that users cannot modify resources they do not own.

Covered resources:

- Comments
- Playlists
- Videos
- Notifications

Authentication answers:

```txt
Who are you?


# Backend Test Coverage

## Cache Fallback

Verifies that Redis cache failures do not break normal API behavior.

### Expected Behavior

- Cache read returns `null`
- Cache write is skipped
- Cache invalidation is skipped
- Invalid cached JSON does not crash request handling

This ensures the application continues functioning even when Redis is unavailable.

---

# Rate Limiting

Verifies that authentication rate limiting works correctly and can gracefully fall back when Redis is unavailable.

### Goals

- Protect the API from abuse
- Share rate-limit state across backend instances using Redis
- Continue enforcing limits with an in-memory fallback when Redis is unavailable

This prevents Redis from becoming a hard dependency during local development or temporary outages.

---

# BullMQ Worker

Verifies that processing a `video.published` job creates notification documents for all subscribers.

To simplify testing, the worker logic is extracted into a separate **processor function**, allowing it to be tested without:

- Starting Redis
- Running a real BullMQ worker process

---

# Queue Behavior

Verifies that publishing a video creates a BullMQ job with the expected payload.

### Job Payload

- `videoId`
- `ownerId`
- `title`

This ensures the worker receives all required information for background notification processing.

---

# Video Publish Controller

Verifies that publishing a video performs the complete workflow.

### Expected Flow

1. Upload media
2. Create the video document
3. Invalidate feed and recommendation caches
4. Add a background notification job to BullMQ

---

# Search and Recommendations

Verifies that:

- Video search builds the expected MongoDB aggregation pipeline.
- Recommendation queries exclude the currently viewed video.
- Only published videos are returned in recommendation results.

---

# Running Tests

## Run All Backend Tests

```bash
cd "Backend aur Chai"
npm test
```

## Run a Specific Test Group

```bash
npm test -- video-ownership
```

```bash
npm test -- cache-fallback
```

```bash
npm test -- notification-worker
```