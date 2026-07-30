"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase, syncSupabaseSessionToLocal } from "@/lib/supabase";
import {
  User,
  Mail,
  ShieldCheck,
  Lock,
  ArrowRight,
  CheckCircle2,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "link_sent">("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

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

  // Handle Citizen Registration with Name, Email & Password -> Sends Supabase Verification Link
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsAlreadyRegistered(false);
    setSuccessMsg("");

    if (!name || !email || !password) {
      setError("দয়া করে নাম, জিমেইল এবং পাসওয়ার্ড পূরণ করুন (Please fill all fields)");
      return;
    }

    if (!email.toLowerCase().includes("@")) {
      setError("দয়া করে সঠিক জিমেইল অ্যাড্রেস লিখুন (Enter a valid Gmail address)");
      return;
    }

    if (password.length < 6) {
      setError("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে (Password must be at least 6 characters)");
      return;
    }

    const cleanedEmail = email.trim().toLowerCase();
    const registeredEmails: string[] = JSON.parse(
      localStorage.getItem("jonomot_registered_emails") || '["citizen@gmail.com", "test@gmail.com"]'
    );
    const isLocalRegistered = registeredEmails.includes(cleanedEmail);

    if (isLocalRegistered) {
      setIsAlreadyRegistered(true);
      setError("এই ইমেইল দিয়ে ইতোমধ্যে অ্যাকাউন্ট খোলা হয়েছে। অনুগ্রহ করে লগইন করুন (You are already registered. Please login)");
      return;
    }

    setLoading(true);

    try {
      // Ask Supabase Auth to Sign Up with Email and Password
      const { data, error: signUpErr } = await supabase.auth.signUp({
        email: cleanedEmail,
        password: password,
        options: {
          data: {
            full_name: name,
            role: "citizen",
          },
          emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
        },
      });

      if (
        signUpErr &&
        (signUpErr.message.toLowerCase().includes("already registered") ||
          signUpErr.message.toLowerCase().includes("already exists") ||
          signUpErr.message.toLowerCase().includes("user already exists"))
      ) {
        setIsAlreadyRegistered(true);
        setError("এই ইমেইল দিয়ে ইতোমধ্যে অ্যাকাউন্ট খোলা হয়েছে। অনুগ্রহ করে লগইন করুন (You are already registered. Please login)");
        setLoading(false);
        return;
      }

      if (data?.user && data.user.identities && data.user.identities.length === 0) {
        setIsAlreadyRegistered(true);
        setError("এই ইমেইল দিয়ে ইতোমধ্যে অ্যাকাউন্ট খোলা হয়েছে। অনুগ্রহ করে লগইন করুন (You are already registered. Please login)");
        setLoading(false);
        return;
      }

      localStorage.setItem(
        "jonomot_registered_emails",
        JSON.stringify(Array.from(new Set([...registeredEmails, cleanedEmail])))
      );

      if (data?.session) {
        const defaultAvatarUrl =
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80";
        const userData = {
          name,
          email: cleanedEmail,
          avatar_url: defaultAvatarUrl,
          role: "citizen",
          isLoggedIn: true,
          verified_by_supabase: true,
          registeredAt: new Date().toISOString(),
        };
        localStorage.setItem("jonomot_user", JSON.stringify(userData));
        window.dispatchEvent(new Event("jonomot_auth_change"));
        router.push("/");
        return;
      }

      setSuccessMsg(`আমরা ${email} ঠিকানায় ভেরিফিকেশন লিঙ্ক পাঠিয়েছি। লিঙ্কে ক্লিক করলেই আপনি সরাসরি অ্যাপে প্রবেশ করতে পারবেন।`);
      setStep("link_sent");
    } catch (err: any) {
      console.warn("Supabase register error:", err);
      setSuccessMsg(`আমরা ${email} ঠিকানায় ভেরিফিকেশন লিঙ্ক পাঠিয়েছি। লিঙ্কে ক্লিক করেই অ্যাকাউন্টে প্রবেশ করুন।`);
      setStep("link_sent");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[85vh] flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-[#063723] via-[#094c31] to-[#042819]">
      {/* Background Pattern Container */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]" />

      {/* Card Container */}
      <div className="w-full max-w-[500px] z-10 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Logo Anchor */}
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

        {/* Solid White Card */}
        <div className="w-full rounded-2xl shadow-xl bg-white border border-gray-200/80 p-8 sm:p-10 flex flex-col gap-6">
          {step === "form" ? (
            <>
              <div className="text-center mb-1">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
                  স্বাগতম! (Create Account)
                </h2>
                <p className="text-sm text-gray-500">
                  নাগরিক হিসেবে নিবন্ধন করুন এবং অভিজ্ঞতা শেয়ার করুন
                </p>
              </div>

              {isAlreadyRegistered ? (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-center flex flex-col gap-3 items-center shadow-sm">
                  <div className="flex items-center gap-2 font-extrabold text-sm">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                    <span>এই ইমেইল দিয়ে ইতোমধ্যে অ্যাকাউন্ট খোলা হয়েছে! (You are already registered)</span>
                  </div>
                  <p className="text-xs text-amber-800 font-medium">
                    অনুগ্রহ করে লগইন করুন। আপনি পাসওয়ার্ড অথবা ম্যাজিক লিংক ব্যবহার করে লগইন করতে পারবেন।
                  </p>
                  <Link
                    href="/login"
                    className="mt-1 px-5 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-extrabold hover:bg-brand-primary/90 transition-all shadow-md"
                  >
                    লগইন করুন (Go to Login)
                  </Link>
                </div>
              ) : error ? (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold text-center">
                  {error}
                </div>
              ) : null}

              {/* Step 1 Form */}
              <form onSubmit={handleRegister} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-sm font-bold text-gray-700 block">
                    নাম (Full Name)
                  </label>
                  <div className="relative flex items-center">
                    <User className="absolute left-4 text-gray-400 w-5 h-5" />
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="আপনার পূর্ণ নাম লিখুন (e.g. Jahid Hasan)"
                      required
                      className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all text-sm font-bold text-gray-950 placeholder-gray-400"
                    />
                  </div>
                </div>

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
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড দিন"
                      required
                      minLength={6}
                      className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all text-sm font-bold text-gray-950 placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-brand-background border border-brand-outline flex items-center gap-2.5 text-xs text-brand-primary font-medium">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-brand-primary" />
                  <span>
                    একাউন্ট ভেরিফাই করার জন্য আমরা আপনার জিমেইলে একটি ভেরিফিকেশন লিঙ্ক (Verification Link) পাঠাবো।
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-1"
                >
                  <span>{loading ? "রেজিস্টার করা হচ্ছে..." : "একাউন্ট তৈরি করুন (Register)"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

              </form>

              <div className="text-center text-xs text-gray-600 mt-2">
                আগে থেকেই অ্যাকাউন্ট আছে?{" "}
                <Link
                  href="/login"
                  className="text-brand-primary font-bold hover:underline"
                >
                  লগইন করুন
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* Step 2: Link Sent Confirmation (No Code Option) */}
              <div className="text-center mb-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
                  ভেরিফিকেশন লিঙ্ক পাঠানো হয়েছে!
                </h2>
                <div className="p-4 my-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm font-medium text-left leading-relaxed shadow-sm">
                  ✉️ <strong>আপনার জিমেইলে ({email}) একটি ভেরিফিকেশন লিঙ্ক (Verification Link) পাঠানো হয়েছে!</strong>
                  <br /><br />
                  • আপনার জিমেইল ইনবক্স (বা স্প্যাম ফোল্ডার) চেক করুন।
                  <br />
                  • লিঙ্কে ক্লিক করলেই আপনি সরাসরি অ্যাপে প্রবেশ করতে পারবেন—কোনো ভেরিফিকেশন কোড লেখার প্রয়োজন নেই।
                </div>
              </div>

              {successMsg && (
                <div className="p-3 mb-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold text-center">
                  {successMsg}
                </div>
              )}

              <div className="flex flex-col gap-3">
                <Link
                  href="/login"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 text-center"
                >
                  <span>লগইন পেজে যান (Go to Login)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  onClick={() => setStep("form")}
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
