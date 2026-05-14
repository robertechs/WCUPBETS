import type { NextRequest } from "next/server";

export function assertCronSecret(request: NextRequest | Request): void {
  const secret = process.env.CRON_SECRET;
  if (!secret) throw new Error("Missing CRON_SECRET");
  const auth = request.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (token !== secret) {
    const err = new Error("Unauthorized");
    (err as Error & { status?: number }).status = 401;
    throw err;
  }
}

export function assertAdminToken(request: NextRequest | Request): void {
  const secret = process.env.ADMIN_TOKEN;
  if (!secret) throw new Error("Missing ADMIN_TOKEN");
  const auth = request.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (token !== secret) {
    const err = new Error("Unauthorized");
    (err as Error & { status?: number }).status = 401;
    throw err;
  }
}
