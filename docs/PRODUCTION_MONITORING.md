# Production Monitoring Notes

The current production deployment uses:

- Frontend: Vercel
- Backend: Render Web Service
- Database: MongoDB Atlas
- Redis: Render Key Value
- Media: Cloudinary

## What To Monitor

## Render Backend

Check Render logs for:

- MongoDB connection failures
- Redis connection failures
- API 500 errors
- Cloudinary upload failures
- JWT/cookie auth issues
- Rate limit warnings

Important log messages:

```txt
Mongoose connected
Redis connected
Redis connection failed. Continuing without cache.
[QUEUE FAILED] video.published job not added