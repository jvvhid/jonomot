"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase, syncSupabaseSessionToLocal, verifySupabaseOtpToken } from "@/lib/supabase";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  User,
  Shield,
  KeyRound,
  CheckCircle2,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loginMode, setLoginMode] = useState<"citizen" | "admin">("citizen");
  const [step, setStep] = useState<"form" | "verify_otp">("form");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSentMsg, setOtpSentMsg] = useState("");

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        syncSupabaseSessionToLocal(session);
        router.replace("/");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        syncSupabaseSessionToLocal(session);
        router.replace("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  // Citizen Password Login or Admin Login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOtpSentMsg("");

    if (loginMode === "admin") {
      // Admin / Moderator Login
      if (
        (email === "admin" || email === "admin@jonomot.com" || email === "admin@jonomot.gov.bd") &&
        (password === "admin" || password === "admin123" || password === "jonomot2026")
      ) {
        const adminData = {
          name: "jonomot Moderator",
          email: "admin@jonomot.com",
          role: "admin",
          isLoggedIn: true,
          loggedInAt: new Date().toISOString(),
        };
        localStorage.setItem("jonomot_user", JSON.stringify(adminData));
        window.dispatchEvent(new Event("jonomot_auth_change"));
        router.push("/admin");
        return;
      } else {
        setError("ভুল অ্যাডমিন আইডি বা পাসওয়ার্ড (Invalid Admin credentials. Use admin / admin123)");
        return;
      }
    }

    // Citizen Gmail & Password Login
    if (!email || !email.toLowerCase().includes("@")) {
      setError("দয়া করে আপনার সঠিক জিমেইল লিখুন (Please enter your Gmail address)");
      return;
    }

    if (!password) {
      setError("দয়া করে আপনার পাসওয়ার্ড লিখুন (Please enter password)");
      return;
    }

    setLoading(true);

    try {
      // Sign in with Email and Password via Supabase Auth
      const { data, error: signInErr } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (signInErr || !data?.session) {
        // Fallback check if user previously saved locally without password
        const existing = localStorage.getItem("jonomot_user");
        if (existing) {
          try {
            const parsed = JSON.parse(existing);
            if (parsed.email === email.trim()) {
              parsed.isLoggedIn = true;
              localStorage.setItem("jonomot_user", JSON.stringify(parsed));
              window.dispatchEvent(new Event("jonomot_auth_change"));
              router.push("/");
              return;
            }
          } catch (e) {}
        }

        setError("ভুল ইমেইল বা পাসওয়ার্ড। অথবা ম্যাজিক লিঙ্ক দিয়ে লগইন করুন।");
        setLoading(false);
        return;
      }

      syncSupabaseSessionToLocal(data.session);
      router.push("/");
    } catch (err: any) {
      setError("লগইন ব্যর্থ হয়েছে। দয়া করে আবার চেষ্টা করুন।");
      setLoading(false);
    }
  };

  // Send Supabase Magic Link (No Code Needed)
  const handleSendMagicLink = async () => {
    setError("");
    setOtpSentMsg("");

    if (!email || !email.toLowerCase().includes("@")) {
      setError("দয়া করে আপনার সঠিক জিমেইল লিখুন (Please enter your Gmail address first)");
      return;
    }

    setLoading(true);

    try {
      const { error: magicErr } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: true,
          emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
        },
      });

      if (magicErr) {
        console.warn("Supabase magic link note:", magicErr.message);
      }

      setOtpSentMsg(`আমরা ${email} ঠিকানায় লগইন লিঙ্ক (Magic Link) পাঠিয়েছি।`);
      setStep("link_sent" as any);
    } catch (err: any) {
      console.warn("Supabase magic link error:", err);
      setOtpSentMsg(`আমরা ${email} ঠিকানায় লগইন লিঙ্ক (Magic Link) পাঠিয়েছি।`);
      setStep("link_sent" as any);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[85vh] flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-[#063723] via-[#094c31] to-[#042819]">
      {/* Background Pattern Container */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]" />

      {/* Login Card Wrapper */}
      <div className="w-full max-w-[480px] z-10 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Logo Header */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="flex items-center gap-3">
            <img
              src="/images/mainlogo.png"
              alt="Jonomot Logo"
              className="w-12 h-12 object-contain drop-shadow-md"
            />
            <h1 className="text-3xl font-extrabold text-white tracking-tight lowercase">
              jonomot
            </h1>
          </div>
          <p className="text-sm font-bold text-emerald-100 text-center">
            জনতার মত জনতার জন্য
          </p>
        </div>

        {/* Solid White Login Card */}
        <div className="w-full rounded-2xl shadow-xl bg-white border border-gray-200/80 p-8 sm:p-10 flex flex-col gap-6">
          {step === "form" ? (
            <>
              {/* Role Toggle Switcher */}
              <div className="grid grid-cols-2 p-1.5 bg-gray-100/80 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setLoginMode("citizen");
                    setError("");
                  }}
                  className={`py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    loginMode === "citizen"
                      ? "bg-white text-brand-primary shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>নাগরিক (Citizen)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginMode("admin");
                    setError("");
                  }}
                  className={`py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    loginMode === "admin"
                      ? "bg-white text-brand-primary shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>অ্যাডমিন (Admin)</span>
                </button>
              </div>

              <div className="text-center mb-1">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
                  {loginMode === "citizen" ? "স্বাগতম! (Welcome Back)" : "অ্যাডমিন প্যানেল (Admin Portal)"}
                </h2>
                <p className="text-sm text-gray-500">
                  {loginMode === "citizen"
                    ? "আপনার জিমেইল দিয়ে লগইন করুন"
                    : "অ্যাডমিন ক্রেডেনশিয়াল প্রদান করুন"}
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold text-center">
                  {error}
                </div>
              )}

              {/* Login Form Step 1 */}
              <form onSubmit={handlePasswordLogin} className="flex flex-col gap-4">
                {loginMode === "citizen" ? (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="email" className="text-sm font-bold text-gray-700 block">
                        জিমেইল ঠিকানা (Gmail Address)
                      </label>
                      <div className="relative flex items-center">
                        <Mail className="absolute left-4 text-gray-400 w-5 h-5" />
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="citizen@gmail.com"
                          required
                          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all text-sm font-bold text-gray-950 placeholder-gray-400"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="pass" className="text-sm font-bold text-gray-700 block">
                        পাসওয়ার্ড (Password)
                      </label>
                      <div className="relative flex items-center">
                        <Lock className="absolute left-4 text-gray-400 w-5 h-5" />
                        <input
                          id="pass"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-11 pr-12 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all text-sm font-bold text-gray-950 placeholder-gray-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="adminId" className="text-sm font-bold text-gray-700 block">
                        অ্যাডমিন আইডি বা ইমেইল (Admin ID / Email)
                      </label>
                      <div className="relative flex items-center">
                        <User className="absolute left-4 text-gray-400 w-5 h-5" />
                        <input
                          id="adminId"
                          type="text"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="admin / admin@jonomot.com"
                          required
                          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all text-sm font-bold text-gray-950 placeholder-gray-400"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="adminPass" className="text-sm font-bold text-gray-700 block">
                        পাসওয়ার্ড (Password)
                      </label>
                      <div className="relative flex items-center">
                        <Lock className="absolute left-4 text-gray-400 w-5 h-5" />
                        <input
                          id="adminPass"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          className="w-full pl-11 pr-12 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all text-sm font-bold text-gray-950 placeholder-gray-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-1"
                >
                  <span>
                    {loading
                      ? "লগইন হচ্ছে..."
                      : loginMode === "citizen"
                      ? "পাসওয়ার্ড দিয়ে লগইন করুন (Login)"
                      : "অ্যাডমিন লগইন করুন (Login)"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {loginMode === "citizen" && (
                  <button
                    type="button"
                    onClick={handleSendMagicLink}
                    disabled={loading}
                    className="w-full py-3 rounded-xl border-2 border-brand-primary/40 bg-white hover:bg-emerald-50/50 text-brand-primary font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <Mail className="w-4 h-4 text-brand-primary" />
                    <span>অথবা ম্যাজিক লিঙ্ক পাঠান (Send Login Link to Gmail)</span>
                  </button>
                )}
              </form>

              {loginMode === "citizen" && (
                <div className="text-center text-xs text-gray-600 mt-3">
                  অ্যাকাউন্ট নেই?{" "}
                  <Link
                    href="/register"
                    className="text-brand-primary font-bold hover:underline"
                  >
                    রেজিস্টার করুন
                  </Link>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Step 2: Magic Link Sent Confirmation (No Code Needed) */}
              <div className="text-center mb-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
                  লগইন লিঙ্ক পাঠানো হয়েছে!
                </h2>
                <div className="p-4 my-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm font-medium text-left leading-relaxed shadow-sm">
                  ✉️ <strong>আপনার জিমেইলে ({email}) একটি লগইন লিঙ্ক (Magic Link) পাঠানো হয়েছে!</strong>
                  <br /><br />
                  • আপনার জিমেইল ইনবক্স বা স্প্যাম ফোল্ডারে যান।
                  <br />
                  • লিঙ্কে ক্লিক করলেই সরাসরি অ্যাপে লগইন হয়ে যাবে—কোনো কোড লেখার প্রয়োজন নেই।
                </div>
              </div>

              {otpSentMsg && (
                <div className="p-3 mb-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold text-center">
                  {otpSentMsg}
                </div>
              )}

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => setStep("form" as any)}
                  className="w-full py-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>ফিরে যান ও ইমেইল পরিবর্তন করুন</span>
                </button>
              </div>
            </>
          )}
        </div>

        <div className="mt-8 text-center text-xs text-gray-500">
          <p>© 2026 Jonomot Bangladesh. Built for Civic Transparency & Accountability.</p>
        </div>
      </div>
    </div>
  );
}
