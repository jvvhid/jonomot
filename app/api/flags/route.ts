import { NextRequest, NextResponse } from "next/server";
import { insertContentFlagToDB } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reportId, reason, details, userId } = body;

    if (!reportId || !reason) {
      return NextResponse.json(
        { error: "Missing required fields (reportId, reason)" },
        { status: 400 }
      );
    }

    const result = await insertContentFlagToDB({
      reportId,
      reason,
      details,
      userId,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
