"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "../common/BrandLogo";
import { Button } from "../common/Button";
import {
  Search,
  PlusCircle,
  Menu,
  X,
  UserCheck,
  Shield,
  Bookmark,
  HelpCircle,
  Home,
  Building2,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<"CITIZEN" | "MODERATOR">("CITIZEN");

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Institutions", href: "/#institutions", icon: Building2 },
    { name: "Bookmarks", href: "/bookmarks", icon: Bookmark },
    { name: "Help & Support", href: "/help", icon: HelpCircle },
    ...(userRole === "MODERATOR"
      ? [{ name: "Admin Dashboard", href: "/admin", icon: Shield }]
      : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-brand-outline transition-all">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <BrandLogo size="md" />

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand-primary/10 text-brand-primary font-semibold"
                    : "text-brand-on-surface hover:bg-brand-background hover:text-brand-primary"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Actions & Role Toggle */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Quick Report CTA */}
          <Link href="/report/new">
            <Button variant="primary" size="sm" className="gap-1.5 shadow-sm">
              <PlusCircle className="w-4 h-4" />
              <span>Submit Report</span>
            </Button>
          </Link>

          {/* Clickable Profile Photo Avatar navigating to profile settings */}
          <Link
            href="/profile"
            className="flex items-center gap-2 cursor-pointer group"
            title="Go to Profile Settings"
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"
                alt="Citizen Profile"
                className="w-9 h-9 rounded-full object-cover border-2 border-brand-primary group-hover:scale-105 transition-all shadow-sm"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white" />
            </div>
          </Link>

          {/* User Role Switcher for Local Demo */}
          <button
            onClick={() => setUserRole(userRole === "CITIZEN" ? "MODERATOR" : "CITIZEN")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-brand-background border border-brand-outline text-brand-on-surface hover:border-brand-primary transition-colors"
            title="Click to toggle between Citizen and Admin Moderator demo view"
          >
            {userRole === "CITIZEN" ? (
              <>
                <UserCheck className="w-3.5 h-3.5 text-brand-primary" />
                <span>Citizen</span>
              </>
            ) : (
              <>
                <Shield className="w-3.5 h-3.5 text-brand-secondary" />
                <span className="text-brand-secondary">Admin</span>
              </>
            )}
          </button>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-brand-on-surface hover:bg-brand-background transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-brand-outline bg-white px-4 pt-2 pb-4 space-y-3 shadow-lg">
          <div className="flex flex-col gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-brand-on-surface hover:bg-brand-background hover:text-brand-primary"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-brand-outline flex flex-col gap-2">
            <Link href="/report/new" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" className="w-full gap-2">
                <PlusCircle className="w-4 h-4" />
                <span>Submit Civic Report</span>
              </Button>
            </Link>

            <button
              onClick={() => {
                setUserRole(userRole === "CITIZEN" ? "MODERATOR" : "CITIZEN");
                setMobileMenuOpen(false);
              }}
              className="w-full inline-flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold bg-brand-background border border-brand-outline text-brand-on-surface"
            >
              <span>Demo View: {userRole === "CITIZEN" ? "Citizen Mode" : "Admin Mode"}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
