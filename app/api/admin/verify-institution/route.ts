import { NextRequest, NextResponse } from "next/server";
import { verifyInstitutionInDB, deleteInstitutionFromDB } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { id, action } = await request.json();

    if (!id || !action) {
      return NextResponse.json(
        { success: false, error: "id and action ('approve' | 'reject') are required" },
        { status: 400 }
      );
    }

    if (action === "approve") {
      const ok = await verifyInstitutionInDB(id);
      if (!ok) {
        return NextResponse.json(
          { success: false, error: "Failed to verify institution in database" },
          { status: 500 }
        );
      }
      return NextResponse.json({
        success: true,
        message: "Institution verified and added to database automatically",
      });
    } else if (action === "reject") {
      const ok = await deleteInstitutionFromDB(id);
      return NextResponse.json({
        success: true,
        message: "Institution submission rejected and removed",
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
