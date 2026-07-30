import { NextRequest, NextResponse } from "next/server";
import { fetchUserBookmarksFromDB, toggleBookmarkInDB } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ bookmarkedIds: [] }, { status: 200 });
    }

    const bookmarkedIds = await fetchUserBookmarksFromDB(userId);
    return NextResponse.json({ bookmarkedIds }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, institutionId } = body;

    if (!userId || !institutionId) {
      return NextResponse.json(
        { error: "Missing userId or institutionId" },
        { status: 400 }
      );
    }

    const result = await toggleBookmarkInDB(userId, institutionId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
