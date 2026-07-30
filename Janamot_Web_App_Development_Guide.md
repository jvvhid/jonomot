# Janamot Web App Development Guide (MVP - No AI)

## Vision

Build a modern, responsive civic web application for Bangladesh where
citizens can discover government institutions, share service
experiences, and help improve transparency. The MVP intentionally
excludes AI features.

\---

# Technology Stack

## Frontend

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* shadcn/ui
* Framer Motion
* React Hook Form
* Zod
* Lucide Icons
* Leaflet + OpenStreetMap (maps)

## Backend

* Next.js Route Handlers (API)
* Prisma ORM

## Database

* PostgreSQL (Supabase)

## Authentication

* Supabase Auth

## Storage

* Cloudinary (images/videos)

## Deployment

* Vercel

## Version Control

* GitHub

\---

# Design Language

## Theme

* Primary background: White
* Primary accent: Deep Green (#006A4E inspired)
* Secondary accent: Deep Red (#DA291C inspired)
* Neutral gray scale for cards and borders

Use red only for alerts, moderation, destructive actions and important
highlights. Use green for positive states, navigation accents and
success messages.

## UI Style

* Minimal
* Modern
* Spacious
* Rounded corners (12--16px)
* Soft shadows
* Plenty of whitespace
* No mascot
* No floating AI assistant
* No emoji-based interface

## Motion

Use Framer Motion throughout.

Include: - Page transitions - Sidebar animation - Button hover effects -
Card hover elevation - Fade-in sections - Loading skeletons - Smooth
dialogs - Expand/collapse animations - Search result transitions

Animations should feel fast (150--250 ms) and subtle.

\---

# Pages

## Authentication

* Login
* Register
* Forgot Password

(User will provide login design.)

\---

## Homepage

(User will provide sidebar/homepage layout.)

Suggested sections: - Search - Institution Categories - Trending
Institutions - Recently Updated - Latest Community Reports - Quick
Report button

\---

## Institution Page

Include: - Institution name - Address - Category - Office hours -
Contact information - Map - Trust score - Community rating - Experience
feed - Photos - Videos

Tabs: - Overview - Experiences - Media - Information

\---

## Report Page

Fields: - Institution - Category - Title - Description - Visit date -
Rating - Upload media

\---

## Profile

* User information
* Reports submitted
* Saved institutions
* Settings

\---

## Admin Dashboard

Features: - Moderate reports - Moderate media - Create institution -
Edit institution - Merge duplicates manually - User management -
Analytics

\---

# Database Tables

* users
* institutions
* institution\_aliases
* reports
* report\_media
* votes
* bookmarks
* categories

Keep schema extensible for future AI features but do not implement AI
tables yet.

\---

# Core Features

## Search

* Instant search
* Category filter
* District filter
* Division filter

## Institutions

* View information
* View community experiences
* Save institution

## Reporting

* Create report
* Edit own report
* Delete own report
* Upload images/videos

## Community

* Upvote helpful reports
* Report inappropriate content

## Moderation

* Spam removal
* Media approval
* Institution verification

\---

# UX Guidelines

* Responsive for desktop, tablet and mobile
* Sticky navigation
* Skeleton loading
* Infinite scrolling where appropriate
* Empty states
* Error states
* Success notifications
* Accessible forms
* Keyboard navigation
* Dark mode support (Phase 2)

\---

# Folder Structure

``` text
app/
components/
features/
hooks/
lib/
prisma/
public/
styles/
types/
utils/
```

\---

# Development Order

1. Initialize Next.js project
2. Configure Tailwind and shadcn/ui
3. Configure Supabase project
4. Configure Prisma
5. Authentication
6. Database models
7. Sidebar/Layout
8. Homepage
9. Institution pages
10. Report flow
11. Media upload
12. User profile
13. Admin dashboard
14. Search \& filters
15. Responsive polish
16. Deploy to Vercel

\---

# Quality Checklist

* Responsive
* Accessible
* Consistent spacing
* Consistent typography
* Optimized images
* Lazy loading
* Error handling
* Form validation
* Secure authentication
* Clean code structure
* Reusable components
* Production-ready deployment

\---

# Future (Not in MVP)

* Semantic search
* AI summaries
* Duplicate detection
* Trend analysis
* Government analytics dashboard

