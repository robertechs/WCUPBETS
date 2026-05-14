import { NextResponse } from "next/server";
import { assertAdminToken } from "@/lib/cron-auth";
import { getSupabaseAdmin } from "@/lib/supabase-server";

type Body = { outcome: "YES" | "NO" };

export async function POST(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    assertAdminToken(request);
    const { id } = await ctx.params;
    const body = (await request.json()) as Body;
    if (body.outcome !== "YES" && body.outcome !== "NO") {
      return NextResponse.json({ error: "outcome must be YES or NO" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from("markets")
      .update({
        outcome: body.outcome,
        resolved_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    const status = (e as Error & { status?: number }).status ?? 500;
    const msg = e instanceof Error ? e.message : "error";
    return NextResponse.json({ error: msg }, { status });
  }
}
