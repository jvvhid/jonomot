import { NextRequest, NextResponse } from "next/server";
import {
  fetchDocumentTipsFromDB,
  insertDocumentTipToDB,
  upvoteDocumentTipInDB,
} from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const institutionId = searchParams.get("institutionId");

    if (!institutionId) {
      return NextResponse.json(
        { error: "Missing institutionId parameter" },
        { status: 400 }
      );
    }

    const tips = await fetchDocumentTipsFromDB(institutionId);
    return NextResponse.json({ success: true, tips }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { institutionId, title, category, userId } = body;

    if (!institutionId || !title) {
      return NextResponse.json(
        { error: "Missing required fields (institutionId, title)" },
        { status: 400 }
      );
    }

    const result = await insertDocumentTipToDB({
      institutionId,
      title,
      category,
      userId,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(
      { success: true, id: result.id },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, currentUpvotes } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing tip id" }, { status: 400 });
    }

    const success = await upvoteDocumentTipInDB(id, Number(currentUpvotes) || 0);
    return NextResponse.json({ success }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
