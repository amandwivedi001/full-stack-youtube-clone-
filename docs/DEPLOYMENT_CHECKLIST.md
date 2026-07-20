# Deployment Checklist

Use this checklist before merging scaling/backend infrastructure changes into `main`.

## Branch Safety

- `main` is the stable production branch.
- `testing-and-scaling` is used for tests, Docker, Redis, BullMQ, Nginx, and scaling work.
- Do not merge into `main` until CI passes and live deployment compatibility is checked.

## GitHub Actions

Before merging, confirm:

- Backend tests pass.
- Frontend build passes.
- Backend Docker image builds.
- Frontend Docker image builds.
- Docker Compose config validates.

## Secrets Safety

Never commit real secrets.

Check:

```bash
git ls-files | grep -E "\.env$|\.env.local$"


# Deployment Checklist

## Environment Files

No real `.env` files should be committed to the repository.

### Allowed Files

```text
.env.example
Backend aur Chai/.env.example
youtubeFrontend/.env.example
```

---

# Vercel Deployment Safety

Before merging into the production branch, verify the following:

## Production Branch

```text
Vercel Dashboard
→ Project
→ Settings
→ Git
→ Production Branch = main
```

## Frontend Environment Variables

Ensure the following environment variable is configured correctly:

| Variable | Requirement |
|----------|-------------|
| `VITE_API_BASE_URL` | Must point to the production backend URL |

---

# Render Deployment Safety

Before deploying backend changes to Render, verify that the following environment variables are configured:

| Required Environment Variables |
|--------------------------------|
| `MONGODB_URI` |
| `CORS_ORIGIN` |
| `ACCESS_TOKEN_SECRET` |
| `ACCESS_TOKEN_EXPIRY` |
| `REFRESH_TOKEN_SECRET` |
| `REFRESH_TOKEN_EXPIRY` |
| `CLOUDINARY_CLOUD_NAME` |
| `CLOUDINARY_API_KEY` |
| `CLOUDINARY_API_SECRET` |
| `REDIS_URL` |
| `CACHE_DEBUG` |

## Redis Fallback

If `REDIS_URL` is not configured:

- The application should still start successfully.
- Cache functionality will be disabled.
- Rate limiting falls back to in-memory storage.
- This behavior is an example of **graceful degradation**.

---

# Worker Deployment Safety

If BullMQ workers are used in production, deploy them as a **separate service**.

| Service | Start Command |
|----------|---------------|
| Backend Web Service | `npm start` |
| Video Worker Service | `npm run worker:video` |

> **Important:** Do not run the worker only inside the web server unless the application has been intentionally designed to do so.

---

# Manual Smoke Test

After every deployment, verify the following functionality:

- ✅ Signup and login
- ✅ Home feed loads
- ✅ Search works
- ✅ Video watch page opens
- ✅ Video upload
- ✅ Like and comment functionality
- ✅ Playlist create, update, and delete
- ✅ Notifications page opens
- ✅ Health check endpoint returns:
  - API status
  - MongoDB status
  - Redis status