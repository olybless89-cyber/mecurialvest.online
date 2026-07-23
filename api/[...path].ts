/**
 * Vercel serverless entry point — wraps the Express app so all /api/* requests
 * are handled by the same Express router that runs on Render in dev.
 *
 * The api-server is pre-compiled by esbuild (pnpm --filter @workspace/api-server run build)
 * into dist/app.mjs which contains all workspace dependencies bundled in, so
 * Vercel's function bundler only needs to handle this single compiled file.
 */
// @ts-ignore — compiled by esbuild as part of buildCommand, not tracked by tsc
import app from '../artifacts/api-server/dist/app.mjs';

export default app;
