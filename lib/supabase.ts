import { createClient } from "@supabase/supabase-js";
import { INSTITUTIONS, InstitutionItem, INITIAL_REPORTS, ReportItem } from "./mockData";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://whzxmqbbjimhizwgjtre.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_dNcGY8jD3TUdJA6zs_frKQ_FqrEY1e5";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

/**
 * SQL Schema needed in Supabase SQL Editor:
 *
 * CREATE TABLE IF NOT EXISTS institutions (
 *   id TEXT PRIMARY KEY,
 *   name TEXT NOT NULL,
 *   name_bn TEXT,
 *   address TEXT,
 *   category TEXT,
 *   division TEXT,
 *   district TEXT,
 *   trust_score NUMERIC DEFAULT 3.0,
 *   jonomot_rating NUMERIC DEFAULT 60.0,
 *   hours TEXT,
 *   contact TEXT,
 *   image_url TEXT,
 *   google_map_url TEXT,
 *   report_count INTEGER DEFAULT 0,
 *   verified BOOLEAN DEFAULT TRUE,
 *   created_at TIMESTAMPTZ DEFAULT NOW()
 * );
 *
 * CREATE TABLE IF NOT EXISTS reports (
 *   id TEXT PRIMARY KEY,
 *   institution_id TEXT REFERENCES institutions(id) ON DELETE CASCADE,
 *   institution_name TEXT,
 *   user_id TEXT,
 *   user_name TEXT,
 *   user_role TEXT,
 *   title TEXT,
 *   description TEXT,
 *   visit_date TEXT,
 *   civic_tag TEXT,
 *   rating INTEGER,
 *   upvotes INTEGER DEFAULT 0,
 *   downvotes INTEGER DEFAULT 0,
 *   status TEXT DEFAULT 'APPROVED',
 *   verified BOOLEAN DEFAULT FALSE,
 *   has_video_proof BOOLEAN DEFAULT FALSE,
 *   created_at TIMESTAMPTZ DEFAULT NOW()
 * );
 *
 * CREATE TABLE IF NOT EXISTS bookmarks (
 *   id TEXT PRIMARY KEY,
 *   user_id TEXT NOT NULL,
 *   institution_id TEXT NOT NULL,
 *   created_at TIMESTAMPTZ DEFAULT NOW(),
 *   UNIQUE(user_id, institution_id)
 * );
 */

export function deduplicateInstitutions(list: InstitutionItem[]): InstitutionItem[] {
  const seenIds = new Set<string>();
  const seenNames = new Set<string>();
  const result: InstitutionItem[] = [];

  for (const inst of list) {
    if (!inst) continue;
    const idKey = (inst.id || "").trim();
    const nameKey = (inst.name || "").trim().toLowerCase();
    const nameBnKey = (inst.nameBn || "").trim().toLowerCase();

    if (
      seenIds.has(idKey) ||
      (nameKey && seenNames.has(nameKey)) ||
      (nameBnKey && seenNames.has(nameBnKey))
    ) {
      continue;
    }
    seenIds.add(idKey);
    if (nameKey) seenNames.add(nameKey);
    if (nameBnKey) seenNames.add(nameBnKey);
    result.push(inst);
  }
  return result;
}

export async function seedSupabaseIfEmpty(): Promise<{ seeded: boolean; error?: string }> {
  try {
    const { data: existing, error: countErr } = await supabase
      .from("Institution")
      .select("id")
      .limit(1);

    if (countErr) {
      // Table may not be created yet in schema cache; silently fall back to local mock data
      return { seeded: false, error: countErr.message };
    }

    if (!existing || existing.length === 0) {
      // Seed all institutions from mockData
      const rows = INSTITUTIONS.map((inst) => ({
        id: inst.id,
        name: inst.name,
        nameBn: inst.nameBn || inst.name,
        address: inst.address,
        category: inst.category,
        division: inst.division,
        district: inst.district,
        trustScore: inst.trustScore,
        jonomotRating: inst.jonomotRating,
        hours: inst.hours,
        contact: inst.contact,
        imageUrl: inst.imageUrl,
        googleMapUrl: inst.googleMapUrl || "",
        reportCount: inst.reportCount,
        verified: true,
      }));

      const { error: insErr } = await supabase.from("Institution").insert(rows);
      if (insErr) {
        console.error("Failed to seed institutions:", insErr.message);
        return { seeded: false, error: insErr.message };
      }
      return { seeded: true };
    }

    return { seeded: false };
  } catch (err: any) {
    return { seeded: false, error: err.message };
  }
}

export async function fetchAllInstitutionsFromDB(): Promise<InstitutionItem[]> {
  try {
    const { data, error } = await supabase
      .from("Institution")
      .select("*")
      .order("jonomotRating", { ascending: false });

    if (error || !data || data.length === 0) {
      return INSTITUTIONS;
    }

    return data.map((row: any) => ({
      id: row.id,
      name: row.name,
      nameBn: row.nameBn || row.name_bn,
      address: row.address,
      category: row.category,
      division: row.division,
      district: row.district,
      trustScore: Number(row.trustScore ?? row.trust_score) || 3.0,
      jonomotRating: Number(row.jonomotRating ?? row.jonomot_rating) || 60,
      hours: row.hours || "9:00 AM – 5:00 PM",
      contact: row.contact || "N/A",
      imageUrl: row.imageUrl ?? row.image_url ?? "/prelilogin.png",
      googleMapUrl: row.googleMapUrl ?? row.google_map_url ?? "",
      photos: [row.imageUrl ?? row.image_url ?? "/prelilogin.png"],
      reportCount: Number(row.reportCount ?? row.report_count) || 0,
      verified: row.verified ?? true,
    }));
  } catch (err) {
    return INSTITUTIONS;
  }
}

export async function insertInstitutionToDB(
  inst: Partial<InstitutionItem> & { googleMapUrl?: string },
  isVerified: boolean = false
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const id = inst.id || `inst-${Date.now()}`;
    const name = inst.name || "Unnamed Institution";
    const googleMapUrl =
      inst.googleMapUrl ||
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`;
    const imageUrl =
      inst.imageUrl ||
      `/api/google-map-image?url=${encodeURIComponent(googleMapUrl)}&query=${encodeURIComponent(name)}`;

    const row = {
      id,
      name,
      nameBn: inst.nameBn || name,
      address: inst.address || "Bangladesh",
      category: inst.category || "Municipal & City Services",
      division: inst.division || "Dhaka",
      district: inst.district || "Dhaka",
      trustScore: inst.trustScore || 3.0,
      jonomotRating: inst.jonomotRating || 50.0,
      hours: inst.hours || "Sun–Thu: 9:00 AM – 5:00 PM",
      contact: inst.contact || "N/A",
      imageUrl: imageUrl,
      googleMapUrl: googleMapUrl,
      reportCount: 0,
      verified: isVerified,
    };

    const { error } = await supabase.from("Institution").insert([row]);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, id };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function verifyInstitutionInDB(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("Institution")
      .update({ verified: true })
      .eq("id", id);
    return !error;
  } catch {
    return false;
  }
}

export async function deleteInstitutionFromDB(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("Institution").delete().eq("id", id);
    return !error;
  } catch {
    return false;
  }
}

/**
 * REPORTS CRUD
 */
declare global {
  var __jonomot_custom_reports: ReportItem[] | undefined;
}
if (!globalThis.__jonomot_custom_reports) {
  globalThis.__jonomot_custom_reports = [];
}

export function getMergedClientReports(apiReports: ReportItem[] = []): ReportItem[] {
  if (typeof window === "undefined") return apiReports;
  try {
    const localStr = localStorage.getItem("jonomot_submitted_reports") || "[]";
    const localReports: ReportItem[] = JSON.parse(localStr);
    const combined = [...localReports, ...apiReports];
    const map = new Map<string, ReportItem>();
    for (const r of combined) {
      if (r && r.id && !map.has(r.id)) {
        map.set(r.id, r);
      }
    }
    return Array.from(map.values()).filter((r) => r.status !== "REJECTED");
  } catch {
    return apiReports;
  }
}

export async function fetchAllReportsFromDB(options?: {
  institutionId?: string;
  userId?: string;
}): Promise<ReportItem[]> {
  try {
    let query = supabase
      .from("Report")
      .select("*")
      .order("createdAt", { ascending: false });

    if (options?.institutionId) {
      query = query.eq("institutionId", options.institutionId);
    }
    if (options?.userId) {
      query = query.eq("userId", options.userId);
    }

    const { data, error } = await query;
    let baseList: ReportItem[] = [];

    if (error || !data || data.length === 0) {
      baseList = INITIAL_REPORTS;
    } else {
      baseList = data.map((row: any) => ({
        id: row.id,
        title: row.title || row.civicTag || row.civic_tag || "সেবা অভিজ্ঞতা রিপোর্ট",
        description: row.description || "সেবা ও আচরণ সম্পর্কিত মতামত",
        visitDate: row.visitDate || row.visit_date || "সাম্প্রতিক",
        rating: Number(row.rating) || 5,
        upvotes: Number(row.upvotes) || 0,
        institutionId: row.institutionId || row.institution_id || "",
        institutionName: row.institutionName || row.institution_name || "সরকারি প্রতিষ্ঠান",
        userName: row.userName || row.user_name || "নাগরিক",
        userRole: (row.userRole as any) || (row.user_role as any) || "CITIZEN",
        createdAt: row.createdAt
          ? new Date(row.createdAt).toISOString().split("T")[0]
          : "আজকে",
        status: (row.status as any) || "APPROVED",
        verified: row.verified ?? false,
        civicTag: (row.civicTag as any) || (row.civic_tag as any) || "ভালো ব্যবহার (Helpful Staff)",
        hasVideoProof: row.hasVideoProof ?? row.has_video_proof ?? false,
        photoUrls: Array.isArray(row.photoUrls) ? row.photoUrls : (Array.isArray(row.photo_urls) ? row.photo_urls : []),
        videoUrl: row.videoUrl || row.video_url || undefined,
      }));
    }

    const customReports = globalThis.__jonomot_custom_reports || [];
    const combined = [...customReports, ...baseList];
    const map = new Map<string, ReportItem>();
    for (const r of combined) {
      if (r && r.id && !map.has(r.id)) {
        map.set(r.id, r);
      }
    }

    let result = Array.from(map.values()).filter((r) => r.status !== "REJECTED");

    if (options?.institutionId) {
      result = result.filter(
        (r) =>
          r.institutionId === options.institutionId ||
          r.institutionName === options.institutionId
      );
    }
    if (options?.userId) {
      result = result.filter((r) => r.userId === options.userId);
    }

    return result;
  } catch {
    let fallback = INITIAL_REPORTS;
    if (options?.institutionId) {
      fallback = fallback.filter((r) => r.institutionId === options.institutionId);
    }
    return fallback;
  }
}

export async function insertReportToDB(
  report: Partial<ReportItem> & { userId?: string }
): Promise<{ success: boolean; id?: string; error?: string }> {
  const id = report.id || `rep-${Date.now()}`;
  const row = {
    id,
    institutionId: report.institutionId,
    institutionName: report.institutionName || "সরকারি প্রতিষ্ঠান",
    userId: report.userId || null,
    userName: report.userName || "নাগরিক",
    userRole: report.userRole || "CITIZEN",
    title: report.title || report.civicTag || "সেবা অভিজ্ঞতা রিপোর্ট",
    description: report.description || "",
    visitDate: report.visitDate || new Date().toISOString().split("T")[0],
    civicTag: report.civicTag || "ভালো ব্যবহার (Helpful Staff)",
    rating: report.rating || 5,
    upvotes: report.upvotes || 0,
    status: report.status || "APPROVED",
    verified: report.verified ?? false,
    hasVideoProof: report.hasVideoProof ?? false,
    photoUrls: report.photoUrls || [],
    videoUrl: report.videoUrl || null,
  };

  const cleanReport: ReportItem = {
    id,
    title: report.title || report.civicTag || "সেবা অভিজ্ঞতা রিপোর্ট",
    description: report.description || "সেবা ও আচরণ সম্পর্কিত মতামত",
    visitDate: report.visitDate || new Date().toISOString().split("T")[0],
    rating: Number(report.rating) || 5,
    upvotes: Number(report.upvotes) || 1,
    institutionId: report.institutionId || "brta-mirpur-1",
    institutionName: report.institutionName || "সরকারি প্রতিষ্ঠান",
    userName: report.userName || "নাগরিক",
    userRole: (report.userRole as any) || "CITIZEN",
    createdAt: report.createdAt || new Date().toISOString().split("T")[0],
    status: (report.status as any) || "APPROVED",
    verified: report.verified ?? false,
    civicTag: (report.civicTag as any) || "ভালো ব্যবহার (Helpful Staff)",
    hasVideoProof: report.hasVideoProof ?? false,
    photoUrls: report.photoUrls || [],
    videoUrl: report.videoUrl || undefined,
  };

  if (!globalThis.__jonomot_custom_reports) {
    globalThis.__jonomot_custom_reports = [];
  }
  globalThis.__jonomot_custom_reports = [
    cleanReport,
    ...globalThis.__jonomot_custom_reports.filter((r) => r.id !== id),
  ];

  try {
    const { error } = await supabase.from("Report").insert([row]);
    if (error) {
      console.error("Supabase Report insert error:", error.message);
    }
  } catch (e) {
    console.error("Supabase Report insert exception:", e);
  }
  return { success: true, id };
}

export async function updateReportStatusInDB(
  id: string,
  status: "APPROVED" | "PENDING" | "REJECTED" | string,
  verified?: boolean
): Promise<boolean> {
  if (globalThis.__jonomot_custom_reports) {
    globalThis.__jonomot_custom_reports = globalThis.__jonomot_custom_reports.map((r) =>
      r.id === id ? { ...r, status: status as any, verified: verified ?? r.verified } : r
    );
  }
  try {
    const updatePayload: any = { status };
    if (typeof verified === "boolean") {
      updatePayload.verified = verified;
    }
    await supabaseAdmin.from("Report").update(updatePayload).eq("id", id);
    return true;
  } catch {
    return true;
  }
}

export async function deleteReportFromDB(id: string): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin.from("Report").delete().eq("id", id);
    return !error;
  } catch {
    return false;
  }
}

export async function upvoteReportInDB(
  id: string,
  currentUpvotes: number
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("Report")
      .update({ upvotes: currentUpvotes + 1 })
      .eq("id", id);
    return !error;
  } catch {
    return false;
  }
}

/**
 * BOOKMARKS CRUD
 */
export async function fetchUserBookmarksFromDB(userId: string): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("institution_id")
      .eq("user_id", userId);

    if (error || !data) {
      return [];
    }
    return data.map((row: any) => row.institution_id);
  } catch {
    return [];
  }
}

export async function toggleBookmarkInDB(
  userId: string,
  institutionId: string
): Promise<{ success: boolean; bookmarked?: boolean; error?: string }> {
  try {
    const { data: existing, error: checkErr } = await supabase
      .from("bookmarks")
      .select("id")
      .eq("user_id", userId)
      .eq("institution_id", institutionId)
      .limit(1);

    if (existing && existing.length > 0) {
      const { error: delErr } = await supabase
        .from("bookmarks")
        .delete()
        .eq("user_id", userId)
        .eq("institution_id", institutionId);

      if (delErr) {
        return { success: false, error: delErr.message };
      }
      return { success: true, bookmarked: false };
    } else {
      const row = {
        id: `bm-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        user_id: userId,
        institution_id: institutionId,
      };
      const { error: insErr } = await supabase.from("bookmarks").insert([row]);
      if (insErr) {
        return { success: false, error: insErr.message };
      }
      return { success: true, bookmarked: true };
    }
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Synchronize a Supabase Auth session into local storage so the Citizen Dashboard unlocks immediately.
 */
export function syncSupabaseSessionToLocal(session: any) {
  if (typeof window === "undefined" || !session?.user) return null;

  try {
    let savedAvatar = null;
    try {
      const emailKey = session.user.email || "default_citizen";
      const savedAvatars = JSON.parse(localStorage.getItem("jonomot_user_avatars") || "{}");
      savedAvatar = savedAvatars[emailKey] || localStorage.getItem("jonomot_last_avatar");
    } catch {}

    const defaultAvatarUrl =
      savedAvatar ||
      session.user.user_metadata?.avatar_url ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80";

    const citizenData = {
      name:
        session.user.user_metadata?.full_name ||
        session.user.user_metadata?.name ||
        session.user.email?.split("@")[0] ||
        "নাগরিক (Citizen)",
      email: session.user.email,
      avatar_url: defaultAvatarUrl,
      role: "citizen",
      isLoggedIn: true,
      verified_by_supabase: true,
      loggedInAt: new Date().toISOString(),
    };

    localStorage.setItem("jonomot_user", JSON.stringify(citizenData));
    window.dispatchEvent(new Event("jonomot_auth_change"));
    return citizenData;
  } catch (err) {
    console.warn("Error syncing session to local storage:", err);
    return null;
  }
}

/**
 * Verify OTP or token against Supabase Auth using multiple possible token types
 * (email OTP code, magiclink token, or signup confirmation token).
 */
export async function verifySupabaseOtpToken(email: string, token: string) {
  const cleanEmail = email.trim();
  const cleanToken = token.trim();

  // 1. Try standard email OTP (when 6-digit code is sent)
  let res = await supabase.auth.verifyOtp({
    email: cleanEmail,
    token: cleanToken,
    type: "email",
  });
  if (!res.error && res.data?.session) {
    syncSupabaseSessionToLocal(res.data.session);
    return res;
  }

  // 2. Try magiclink token (when token is copied from confirmation link)
  const resMagic = await supabase.auth.verifyOtp({
    email: cleanEmail,
    token: cleanToken,
    type: "magiclink",
  });
  if (!resMagic.error && resMagic.data?.session) {
    syncSupabaseSessionToLocal(resMagic.data.session);
    return resMagic;
  }

  // 3. Try signup token
  const resSignup = await supabase.auth.verifyOtp({
    email: cleanEmail,
    token: cleanToken,
    type: "signup",
  });
  if (!resSignup.error && resSignup.data?.session) {
    syncSupabaseSessionToLocal(resSignup.data.session);
    return resSignup;
  }

  // Return original error if all fail
  return res;
}

/**
 * Fully log out a citizen from Supabase Auth and LocalStorage, then redirect to landing page.
 */
export function handleCitizenLogout(router?: any) {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem("jonomot_user");
      window.dispatchEvent(new Event("jonomot_auth_change"));
    }
    // Non-blocking signout to prevent UI lag
    supabase.auth.signOut().catch(() => {});
  } finally {
    if (router && typeof router.push === "function") {
      router.push("/");
    } else if (typeof window !== "undefined" && window.location.pathname !== "/") {
      window.location.href = "/";
    }
  }
}

// ==========================================
// CROWDSOURCED DOCUMENT TIPS & CONTENT FLAGS
// ==========================================

export interface DocumentTip {
  id: string;
  institution_id: string;
  title: string;
  category?: string;
  upvotes: number;
  created_at: string;
  user_id?: string;
}

export async function fetchDocumentTipsFromDB(institutionId: string): Promise<DocumentTip[]> {
  try {
    const { data, error } = await supabase
      .from("document_tips")
      .select("*")
      .eq("institution_id", institutionId)
      .order("upvotes", { ascending: false });

    if (error) {
      console.warn("fetchDocumentTipsFromDB Supabase error (falling back):", error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    return [];
  }
}

export async function insertDocumentTipToDB(tip: {
  institutionId: string;
  title: string;
  category?: string;
  userId?: string;
}): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const payload = {
      institution_id: tip.institutionId,
      title: tip.title,
      category: tip.category || "GENERAL",
      upvotes: 1,
      user_id: tip.userId || "anonymous",
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("document_tips")
      .insert([payload])
      .select("id")
      .single();

    if (error) {
      console.warn("insertDocumentTipToDB Supabase error:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function upvoteDocumentTipInDB(id: string, currentUpvotes: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("document_tips")
      .update({ upvotes: currentUpvotes + 1 })
      .eq("id", id);

    if (error) {
      console.warn("upvoteDocumentTipInDB error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
}

export async function insertContentFlagToDB(flag: {
  reportId: string;
  reason: string;
  details?: string;
  userId?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = {
      report_id: flag.reportId,
      reason: flag.reason,
      details: flag.details || "",
      user_id: flag.userId || "anonymous",
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("content_flags").insert([payload]);

    if (error) {
      console.warn("insertContentFlagToDB error:", error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
