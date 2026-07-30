import { NextRequest, NextResponse } from "next/server";
import {
  fetchAllInstitutionsFromDB,
  insertInstitutionToDB,
  seedSupabaseIfEmpty,
} from "@/lib/supabase";
import { searchInstitutions } from "@/lib/searchUtils";

export async function GET(request: NextRequest) {
  try {
    // Automatically seed Supabase with the 25 institutions if table is empty
    await seedSupabaseIfEmpty();

    const institutions = await fetchAllInstitutionsFromDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "ALL";

    if (search || category !== "ALL") {
      const result = searchInstitutions(institutions, search, category);
      return NextResponse.json({
        success: true,
        count: result.matches.length,
        didYouMean: result.didYouMean,
        data: result.matches,
      });
    }

    return NextResponse.json({
      success: true,
      count: institutions.length,
      data: institutions,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to load institutions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      nameBn,
      address,
      category,
      division,
      district,
      hours,
      contact,
      googleMapUrl,
      imageUrl,
      isAdmin,
    } = body;

    if (!name || !address) {
      return NextResponse.json(
        { success: false, error: "Name and Address are required" },
        { status: 400 }
      );
    }

    // If submitted by normal citizen, verified is FALSE (requires Admin dashboard verification)
    // If submitted by Admin, verified is TRUE
    const isVerified = Boolean(isAdmin);

    const res = await insertInstitutionToDB(
      {
        id: body.id,
        name,
        nameBn,
        address,
        category,
        division,
        district,
        hours,
        contact,
        googleMapUrl,
        imageUrl,
      },
      isVerified
    );

    if (!res.success) {
      return NextResponse.json(
        { success: false, error: res.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      id: res.id,
      verified: isVerified,
      message: isVerified
        ? "Institution added immediately to database"
        : "Institution submitted for Admin verification",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to insert institution" },
      { status: 500 }
    );
  }
}
