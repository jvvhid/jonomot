"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";
import { LanguageProvider } from "@/lib/LanguageContext";
import { supabase, syncSupabaseSessionToLocal } from "@/lib/supabase";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isMinimized, setIsMinimized] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const checkAuth = () => {
      const stored = localStorage.getItem("jonomot_user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setIsLoggedIn(Boolean(parsed.isLoggedIn));
        } catch {
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    };
    checkAuth();

    // Sync from Supabase Auth in case the user clicked an email Magic Link
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        syncSupabaseSessionToLocal(session);
        setIsLoggedIn(true);
        if (pathname === "/login" || pathname === "/register") {
          router.replace("/");
        }
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        syncSupabaseSessionToLocal(session);
        setIsLoggedIn(true);
        if (pathname === "/login" || pathname === "/register") {
          router.replace("/");
        }
      } else if (event === "SIGNED_OUT") {
        setIsLoggedIn(false);
      }
    });

    window.addEventListener("storage", checkAuth);
    window.addEventListener("jonomot_auth_change", checkAuth);
    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("jonomot_auth_change", checkAuth);
      subscription.unsubscribe();
    };
  }, [pathname, router]);

  // Redirect unauthenticated users trying to access protected app routes
  useEffect(() => {
    if (!isMounted) return;
    const isPublicRoute =
      pathname === "/" || pathname === "/login" || pathname === "/register";
    if (!isLoggedIn && !isPublicRoute) {
      router.replace("/login");
    }
  }, [isLoggedIn, pathname, isMounted, router]);

  const isAuthOrLanding =
    !isLoggedIn || pathname === "/login" || pathname === "/register";

  // When unauthenticated or on landing/login/register pages:
  // Render ONLY the login/register landing experience with ZERO app sidebar, options, or navigation functionalities visible.
  if (!isMounted || isAuthOrLanding) {
    return (
      <LanguageProvider>
        <div className="flex min-h-screen w-full bg-[#0a0f0d] text-white flex-col justify-between">
          <main className="flex-1 w-full min-h-screen">{children}</main>
        </div>
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
      <div className="flex min-h-screen bg-[#fafafa]">
        {/* Fixed Sidebar Container - Only shown when logged in */}
        <div
          className={`fixed inset-y-0 left-0 z-30 hidden lg:block transition-all duration-300 ${
            isMinimized ? "w-20" : "w-64"
          }`}
        >
          <Sidebar
            isMinimized={isMinimized}
            onToggleMinimize={() => setIsMinimized(!isMinimized)}
          />
        </div>

        {/* Main Content Area that Expands to Full Screen when Sidebar is Minimized */}
        <div
          className={`flex-1 w-full transition-all duration-300 flex flex-col min-h-screen ${
            isMinimized ? "lg:pl-20" : "lg:pl-64"
          }`}
        >
          <main className="flex-1 w-full">{children}</main>
          <Footer />
        </div>
      </div>
    </LanguageProvider>
  );
}
