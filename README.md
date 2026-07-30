# Janamot (জনমত) — Bangladesh Civic Transparency Hub 🇧🇩
*A civic transparency hub made for Bangladeshi citizens*

A modern, responsive civic transparency web application built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Prisma (with SQLite for local development)**. Designed using the **Stitch MCP "Civic Minimalism"** design system.

---

## 🚀 Quick Start Guide

### 1. Do I need to install SQLite?
**No!** You do **not** need to install any separate database software or SQLite server on your computer.
- SQLite is file-based and is managed automatically by Prisma.
- Your database is stored locally in `prisma/dev.db`.

### 2. What other things do I need to do to run this locally?
All dependencies and files are already set up in this directory! To launch your application locally, follow these 3 simple steps in your terminal:

```bash
# Step 1: Install Node modules (if not already installed)
npm install

# Step 2: Push the Prisma SQLite schema to create your local dev.db file
npx prisma db push

# Step 3: Seed the database with mock Bangladeshi institutions and reports
npx prisma db seed

# Step 4: Start the development server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser!

---

## 🎨 Design System & Customization

This project follows the **Stitch Civic Minimalism** design system defined in [`DESIGN.md`](./DESIGN.md). The codebase is architected with modular, reusable components so you can easily change logos, colors, or add features later:

### How to change the Logo & Brand Name:
- Edit [`components/common/BrandLogo.tsx`](./components/common/BrandLogo.tsx).
- You can change the text `"Janamot"` / `"জনমত"` or replace the icon with an `<Image src="/logo.png" />` tag at any time.

### How to change Colors & Typography:
- Colors and fonts are centralized in [`tailwind.config.ts`](./tailwind.config.ts) and [`app/globals.css`](./app/globals.css).
- Primary Brand Color: `#064e3b` (Deep Forest Green)
- Accent / Alert Color: `#b80938` (Civic Red)
- Background: `#f9f9ff` (Soft Slate White)

---

## 📂 Project Structure

```
├── app/
│   ├── layout.tsx                # Root layout with Navbar and Footer
│   ├── page.tsx                  # Home Dashboard (Hero, Filters, Institutions & Reports)
│   ├── institutions/
│   │   ├── [id]/page.tsx         # Institution Profile (Overview, Experiences, Documents, Map)
│   │   └── new/page.tsx          # Add New Government Office Form
│   ├── report/
│   │   └── new/page.tsx          # Submit Civic Service Report Form (with Document checklist)
│   ├── bookmarks/page.tsx        # Saved / Bookmarked Institutions
│   ├── help/page.tsx             # Help & Support Center (FAQ & Verification Guide)
│   ├── admin/page.tsx            # Moderator Portal (Verify / Manage Reports)
│   └── login/page.tsx            # Glassmorphic Citizen Login
├── components/
│   ├── common/
│   │   ├── BrandLogo.tsx         # Reusable logo & title component
│   │   ├── Button.tsx            # Reusable button with CVA variants
│   │   └── Badge.tsx             # Reusable status & category badges
│   ├── navigation/
│   │   ├── Navbar.tsx            # Sticky header with Citizen / Admin role switcher
│   │   └── Footer.tsx            # Comprehensive civic footer
│   ├── search/
│   │   └── GlobalSearchBar.tsx   # Full-pill search with Category & Division filters
│   ├── institutions/
│   │   └── InstitutionCard.tsx   # Level 1 card with trust score and bookmarking
│   └── reports/
│       └── ReportCard.tsx        # Citizen experience card with upvotes & star rating
├── lib/
│   ├── mockData.ts               # Bangladeshi institutions (BRTA, DMCH, Passport) & reports
│   ├── prisma.ts                 # Prisma Client singleton
│   └── utils.ts                  # Tailwind class merging utility
├── prisma/
│   ├── schema.prisma             # SQLite schema for User, Institution, Report, Bookmark
│   └── seed.ts                   # Database seed script
└── DESIGN.md                     # Complete Stitch Civic Minimalism design system
```

---

## 🌟 Key Features Included

1. **Stitch Civic Minimalism UI**: Impactful Deep Forest Green hero section, full-pill search bars, and subtle card hover elevations.
2. **Division & Category Filters**: Search government offices across Dhaka, Chattogram, Sylhet, and 6 service departments.
3. **Required Documents Checklists**: Built-in checklists for Passport Renewal, Driving Licenses, and Trade Licenses so citizens arrive prepared.
4. **Interactive Demo Role Switcher**: Click the **"Citizen / Admin"** toggle button in the top right of the navigation bar to switch between standard Citizen view and Moderator view seamlessly.
5. **Verified Visits**: Support for document/photo attachment preview when submitting service feedback.
