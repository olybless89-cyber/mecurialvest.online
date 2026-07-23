// Diagnostic — no external deps, confirms Vercel functions are routing correctly
export default function handler(_req: any, res: any) {
  res.json({ pong: true });
}
