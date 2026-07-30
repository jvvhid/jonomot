"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl text-sm font-extrabold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#003527]/30 active:scale-95 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-r from-[#003527] to-[#064e3b] text-white shadow-md hover:shadow-lg hover:from-[#064e3b] hover:to-[#043d2e] border border-emerald-800/40",
        secondary:
          "bg-amber-400 text-[#003527] font-extrabold shadow-sm hover:bg-amber-300 hover:shadow-md border border-amber-500/30",
        outline:
          "border-2 border-[#003527]/25 bg-white text-[#003527] hover:bg-emerald-50/70 hover:border-[#003527]",
        ghost:
          "text-[#003527] hover:bg-emerald-50 hover:text-[#043d2e]",
        destructive:
          "bg-red-600 text-white shadow-sm hover:bg-red-700 hover:shadow-md",
      },
      size: {
        sm: "h-9 px-3.5 text-xs rounded-lg",
        md: "h-10 px-5 py-2.5",
        lg: "h-12 px-7 text-base font-extrabold rounded-2xl",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
}

export function Button({ className, variant, size, children, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size, className }))} {...props}>
      {children}
    </button>
  );
}
