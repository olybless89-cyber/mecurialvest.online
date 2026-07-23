/**
 * Vercel serverless entry point — wraps the Express app so all /api/* requests
 * are handled by the same Express router that runs on Render in dev.
 *
 * Vercel routes every request matching /api/** here automatically because of the
 * [..path] catch-all filename convention.  The original URL is forwarded intact,
 * so Express sees e.g. GET /api/auth/login and matches routes normally.
 */
import app from '../artifacts/api-server/src/app';

export default app;
