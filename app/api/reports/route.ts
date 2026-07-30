import { NextRequest, NextResponse } from "next/server";
import {
  fetchAllReportsFromDB,
  insertReportToDB,
  updateReportStatusInDB,
  deleteReportFromDB,
  upvoteReportInDB,
} from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const institutionId = searchParams.get("institutionId") || undefined;
    const userId = searchParams.get("userId") || undefined;

    const reports = await fetchAllReportsFromDB({ institutionId, userId });
    return NextResponse.json({ success: true, reports, data: reports }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Server-side Blueprint v3 rule: strip videoUrl if civicTag is not an evidence tag
    const tag = body.civicTag || "";
    const isEvidenceTag =
      tag.includes("ঘুষ") ||
      tag.includes("দালাল") ||
      tag.includes("দুর্ব্যবহার") ||
      tag.includes("Bribe") ||
      tag.includes("Middleman") ||
      tag.includes("Rude");

    if (!isEvidenceTag && body.videoUrl) {
      body.videoUrl = null;
      body.hasVideoProof = false;
    }

    const result = await insertReportToDB(body);

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
    const { id, action, currentUpvotes, status, verified } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing report ID" }, { status: 400 });
    }

    if (action === "upvote") {
      const success = await upvoteReportInDB(id, Number(currentUpvotes) || 0);
      return NextResponse.json({ success });
    } else if (action === "status") {
      const success = await updateReportStatusInDB(id, status || "APPROVED", verified);
      return NextResponse.json({ success });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get("id");
    let id = idParam;
    if (!id) {
      const body = await request.json().catch(() => ({}));
      id = body.id;
    }

    if (!id) {
      return NextResponse.json({ error: "Missing report ID" }, { status: 400 });
    }

    const success = await deleteReportFromDB(id);
    return NextResponse.json({ success }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
