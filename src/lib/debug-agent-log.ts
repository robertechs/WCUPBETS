import { appendFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

/** Temporary debug ingest (session f6856c). Do not log secrets / PII. */
export function agentDebugLog(payload: Record<string, unknown>) {
  // #region agent log
  const body = JSON.stringify(payload);
  fetch("http://127.0.0.1:7422/ingest/47cffc3c-3b04-430b-910e-1bf2712b11af", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "f6856c",
    },
    body,
  }).catch(() => {});
  try {
    const dir = join(process.cwd(), ".cursor");
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    appendFileSync(join(dir, "debug-f6856c.log"), `${body}\n`);
  } catch {
    /* noop */
  }
  // #endregion
}
