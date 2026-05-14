import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { agentDebugLog } from "@/lib/debug-agent-log";

let _admin: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (_admin) return _admin;
  const url = (
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    process.env.SUPABASE_URL?.trim()
  );
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  const hasUrl = Boolean(url);
  const hasKey = Boolean(key);
  const urlLen = url?.length ?? 0;
  const keyLen = key?.length ?? 0;
  const altUrlSet = Boolean(process.env.SUPABASE_URL?.trim?.());
  const altKeySet = Boolean(process.env.SUPABASE_SECRET?.trim?.());
  const altKey2Set = Boolean(process.env.SUPABASE_SECRET_KEY?.trim?.());

  // #region agent log
  agentDebugLog({
    sessionId: "f6856c",
    runId: "post-mcp-env",
    hypothesisId: "H1-H3",
    location: "supabase-server.ts:getSupabaseAdmin",
    message: "supabase env presence",
    data: { hasUrl, hasKey, urlLen, keyLen, altUrlSet, altKeySet, altKey2Set },
    timestamp: Date.now(),
  });
  // #endregion

  if (!url) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL). Use your Supabase project API URL.",
    );
  }
  if (!key) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY. Use the project's secret/service role API key.",
    );
  }
  _admin = createClient(url, key, { auth: { persistSession: false } });
  return _admin;
}
