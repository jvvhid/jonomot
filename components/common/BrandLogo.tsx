"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * Reusable BrandLogo component.
 * You can easily replace the icon below with an `<Image src="/logo.png" />` tag
 * or change the brand title and Bengali tagline at any time.
 */
export function BrandLogo({ className = "", size = "md" }: BrandLogoProps) {
  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-11 h-11",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 font-sans font-bold tracking-tight text-brand-primary group ${className}`}
    >
      <div className="flex items-center justify-center shrink-0">
        <img
          src="/images/mainlogo.png"
          alt="Jonomot Logo"
          className={`${iconSizes[size]} object-contain drop-shadow-sm`}
        />
      </div>
      <div className="flex flex-col">
        <span className={`${textSizes[size]} leading-none text-brand-primary font-extrabold`}>
          jonomot <span className="text-brand-secondary font-medium text-sm">জনমত</span>
        </span>
        <span className="text-[10px] uppercase tracking-widest text-brand-on-surface-variant font-medium">
          Bangladesh Civic Platform
        </span>
      </div>
    </Link>
  );
}
