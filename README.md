# Jonomot (জনমত) — Bangladesh Civic Transparency Hub 🇧🇩
*A civic transparency hub made for Bangladeshi citizens*

A modern, responsive civic transparency web application built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Prisma (with SQLite for local development)** later implemented using supabase for authentication and cloudinary for video and picture storage. Designed using the **Stitch** design system.

## The Motivation

Every year, millions of Bangladeshi citizens visit government offices — BRTA for driving licenses, passport offices, land registration, hospitals, police stations, city corporations. The experience is often frustrating: unexplained delays, unclear document requirements, middlemen (দালাল) who charge fees for things that should be free, and no way to know if an office is actually functioning well before you show up.

There is no centralized, citizen-owned platform where regular people can:
- Check what documents they actually need before visiting
- Read honest experiences from other citizens who went recently
- See which offices are performing well and which are not
- Report corruption, rude behavior, or praise helpful staff
- Hold institutions publicly accountable with real data

**Jonomot fixes this.**

## What is Jonomot?

Jonomot is a civic transparency web app where citizens rate, review, and report on their experiences at Bangladesh's government institutions. Think of it as a "reddit reviews for sorkari offices" — but purpose-built for civic accountability.

No AI. No machine learning. No fancy algorithms. Just real citizens sharing real experiences, with a transparent scoring formula anyone can verify.

---

## What Can You Do With Jonomot?

With Jonomot, you can look up any government office in Bangladesh — a BRTA office, a passport office, a hospital, a police station — and instantly see how other citizens rated their experience there. You can read their stories, find out if bribery or long queues are common, and check a community-built list of exactly which documents you need to bring before you go. If you've visited an office yourself, you can submit your own report — rate the service, tag what happened (bribe, rude staff, helpful staff), attach photos or video as evidence, and share tips so the next person doesn't make the same mistakes. Every report feeds into a public scorecard and leaderboard that ranks institutions by citizen satisfaction, so good offices get recognized and bad ones can't hide. Moderators review flagged content to keep things honest, and anyone can add a new government office that isn't listed yet. The whole point is simple: give ordinary citizens a voice, make public services visible, and create pressure for things to get better.

---

## 🚀 Quick Start Guide

### 1. Do You need to install SQLite?
**No!** You do **not** need to install any separate database software or SQLite server on your computer.
- SQLite is file-based and is managed automatically by Prisma.
- Your database is stored locally in `prisma/dev.db`.

### 2. What other things do you need to do to run this locally?
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

This project follows the **Stitch** design system defined in [`DESIGN.md`](./DESIGN.md). The codebase is architected with modular, reusable components so you can easily change logos, colors, or add features later:

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

1. **Stitch Civic UI**: Impactful Deep Forest Green section, full-pill search bars, and subtle card hover elevations.
2. **Subtle Fist Animation**: to show the unity that july brought to us.
3. **Division & Category Filters**: Search government offices across Dhaka, Chattogram, Sylhet, and 6 service departments.
4. **Required Documents Checklists**: Built-in/modifieable checklists for Passport Renewal, Driving Licenses, Trade Licenses and others so citizens arrive prepared.
5. **Interactive Demo Role Switcher**: Click the **"Citizen / Admin"** toggle button in the top right of the navigation bar to switch between standard Citizen view and Moderator view seamlessly.
6. **Verified Visits**: Support for document/photo attachment preview when submitting service feedback.

## V2 Roadmap (Post-Hackathon)

These features are **not in the current build**. They're planned for future development.

### AI-Powered Features
- AI-generated institution summaries synthesized from community reports
- AI busy-hours extraction from report text
- AI moderation-assist classifier for spam/offensive content
- AI trend analysis and predictive insights (wait-time forecasting)
- AI duplicate-institution detection
- AI smart categorization suggestions
- AI-assisted video review for moderators

### Institution Response System
- Verified institution accounts that can officially reply to citizen reports
- Response Rate, Average Response Time, Resolution Rate metrics
- "Official Responses" count feeding into Most Active rankings

### Platform Expansion
- Mobile app (React Native)
- SMS-based reporting for low-connectivity areas
- Public API for researchers and journalists

