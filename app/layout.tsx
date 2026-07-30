import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/navigation/AppShell";

export const metadata: Metadata = {
  title: "Jonomot (জনমত) — Civic Transparency Hub",
  description:
    "A citizen-driven platform where Bangladeshi citizens look up government offices, read real visitor experiences, rate service quality, and share experiences.",
  keywords: [
    "Bangladesh",
    "Civic Transparency",
    "Jonomot",
    "BRTA",
    "Passport",
    "Government Services",
    "জনমত",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body className="min-h-screen bg-[#fafafa] text-gray-800 antialiased font-sans">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

