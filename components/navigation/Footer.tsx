"use client";

import React from "react";
import Link from "next/link";
import { BrandLogo } from "../common/BrandLogo";
import { ExternalLink, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-white border-t border-brand-outline mt-auto py-12">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1 space-y-3">
            <BrandLogo size="sm" />
            <p className="text-xs text-brand-on-surface-variant leading-relaxed">
              Empowering Bangladeshi citizens to discover government institutions, share transparent service experiences, and drive civic accountability.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-brand-on-surface mb-3">
              Civic Services
            </h4>
            <ul className="space-y-2 text-xs text-brand-on-surface-variant">
              <li>
                <Link href="/#institutions" className="hover:text-brand-primary transition-colors">
                  Browse Institutions
                </Link>
              </li>
              <li>
                <Link href="/report/new" className="hover:text-brand-primary transition-colors">
                  Submit a Service Report
                </Link>
              </li>
              <li>
                <Link href="/institutions/new" className="hover:text-brand-primary transition-colors">
                  Add Government Office
                </Link>
              </li>
              <li>
                <Link href="/bookmarks" className="hover:text-brand-primary transition-colors">
                  Saved Bookmarks
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-brand-on-surface mb-3">
              Governance & Trust
            </h4>
            <ul className="space-y-2 text-xs text-brand-on-surface-variant">
              <li>
                <Link href="/help" className="hover:text-brand-primary transition-colors">
                  Transparency Guidelines
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-brand-primary transition-colors">
                  Verification Process
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-brand-primary transition-colors">
                  Moderator Portal
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-brand-on-surface mb-3">
              National Emergency
            </h4>
            <div className="p-3.5 rounded-lg bg-brand-background border border-brand-outline space-y-1">
              <p className="text-xs font-semibold text-brand-primary">
                National Helpline: 999
              </p>
              <p className="text-[11px] text-brand-on-surface-variant">
                Anti-Corruption Commission (ACC): 106
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-brand-outline flex flex-col sm:flex-row items-center justify-between text-xs text-brand-on-surface-variant gap-4">
          <p>© {new Date().getFullYear()} jonomot (জনমত). Civic Transparency Hub MVP.</p>
          <div className="flex items-center gap-1">
            <span>Built with Civic Minimalism for Bangladesh</span>
            <Heart className="w-3.5 h-3.5 text-brand-secondary inline fill-brand-secondary" />
          </div>
        </div>
      </div>
    </footer>
  );
}
