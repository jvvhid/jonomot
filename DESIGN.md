---
name: Jonomot (Civic Transparency Hub)
colorVariant: FIDELITY
colors:
  surface: '#f9f9ff'
  surface-dim: '#d0daef'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff3ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dee9fd'
  surface-container-highest: '#d9e3f7'
  on-surface: '#121c2a'
  on-surface-variant: '#404944'
  inverse-surface: '#273140'
  inverse-on-surface: '#ebf1ff'
  outline: '#707974'
  outline-variant: '#bfc9c3'
  surface-tint: '#2b6954'
  primary: '#064e3b'
  on-primary: '#ffffff'
  primary-container: '#064e3b'
  on-primary-container: '#80bea6'
  inverse-primary: '#95d3ba'
  secondary: '#b80938'
  on-secondary: '#ffffff'
  secondary-container: '#db2e4e'
  on-secondary-container: '#fffbff'
  tertiary: '#2c2f30'
  on-tertiary: '#ffffff'
  tertiary-container: '#424546'
  on-tertiary-container: '#b0b2b3'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  background: '#f9f9ff'
  on-background: '#121c2a'
  surface-variant: '#d9e3f7'
typography:
  headline-xl:
    fontFamily: Hanken Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  margin-page: 2rem
  gutter-grid: 1.5rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 2rem
---

# Janamot — Civic Transparency Hub Design System

This design system is extracted directly from the Stitch Project **"Civic Transparency Hub"** (`projects/4799969538413805024`). It serves as the single source of truth for UI components, color tokens, typography, and responsive layout guidelines.

---

## 1. Brand & Style (Civic Minimalism)

The design system is built on a foundation of **Civic Minimalism**. It is designed to evoke a sense of transparency, reliability, and modern governance. By balancing a clean, professional interface with culturally resonant imagery, it creates an environment where citizens feel empowered to share opinions and demand service quality.

- **Pre-login & Onboarding:** High-impact, illustrative mural style to establish a patriotic and social connection.
- **Post-login Interface:** Transitions into a **"Corporate Modern"** toolset—efficient, structured, and focused on information hierarchy.

---

## 2. Color Palette & Customization Guide

The palette is derived from the national identity of Bangladesh, optimized for digital accessibility. All tokens are configured in Tailwind CSS so you can easily modify them in one place (`tailwind.config.ts` or `app/globals.css`).

| Role | Color Name | Hex Code | Usage |
| :--- | :--- | :--- | :--- |
| **Primary** | Deep Forest Green | `#064e3b` | Primary actions, navigation headers, search bar buttons, and brand identity. |
| **Primary Container** | Deep Forest Green Dark | `#003527` | High-impact banners and active primary states. |
| **Secondary (Accent)** | Civic Red | `#b80938` | Used sparingly for critical alerts, badges, notifications, and secondary brand highlights. |
| **Background** | Clean Off-White | `#f9f9ff` | Primary page background for a calm, modern feel. |
| **Surface** | Pure White | `#ffffff` | Card surfaces, dialogs, and navigation containers. |
| **On Surface** | Deep Slate | `#121c2a` | Primary text and headings. |
| **On Surface Variant** | Medium Slate | `#404944` | Secondary text, captions, and descriptions. |
| **Outline** | Soft Gray Border | `#e5e7eb` (`#bfc9c3`) | 1px lightweight borders for cards and form inputs. |

> **How to Change Brand Colors Later:**
> Simply update the primary hex codes in `tailwind.config.ts` under `theme.extend.colors`. Every button, card, and header in the app will update automatically.

---

## 3. Typography & Multi-Script Rendering

The system utilizes a clean, modern sans-serif stack that ensures high legibility in both English and Bangla.

- **Primary Font:** `Hanken Grotesk` (via Google Fonts).
- **Bangla Script Fallback:** `Hind Siliguri` and `Noto Sans Bengali` for native script rendering.
- **Line Height:** Spacious line height (minimum 1.5x on body text) to accommodate the vertical height of Bengali glyphs without overlapping.

---

## 4. Layout & Spacing (Fluid Grid)

This design system employs a **Fluid Grid** with fixed-width constraints for readability on large screens.

- **Desktop (`1280px` max width):** 12-column grid. Fixed or responsive sidebar navigation at `280px`.
- **Tablet (`768px` - `1024px`):** 8-column grid with `24px` (`1.5rem`) margins.
- **Mobile (`< 768px`):** 4-column grid with `16px` (`1rem`) margins.
- **Spacing Rhythm:** Based on a `4px`/`8px` baseline rhythm. Generous internal padding (`min 16px`) avoids a cramped form look.

---

## 5. Elevation & Depth (Low-Contrast Outlines)

Visual hierarchy is established through **Low-contrast outlines** and **Tonal layers** rather than heavy drop shadows.

- **Level 0 (Base):** Off-white background (`#f9f9ff`) for the primary workspace.
- **Level 1 (Cards):** White surfaces (`#ffffff`) with a subtle 1px border (`#e5e7eb`).
- **Level 2 (Hover / Active):** A soft, diffused shadow (`0px 4px 12px rgba(0, 0, 0, 0.05)`) is applied when a user interacts with a card.
- **Glassmorphism:** Reserved exclusively for the login card on pre-login screens to allow background imagery to softly bleed through.

---

## 6. Shape Language & Corner Radius

The shape language is **Rounded**, striking a balance between approachable (curved) and professional (structured).

- **Standard Elements (`8px / 0.5rem`):** Buttons, input fields, and small tags/chips.
- **Large Containers (`16px / 1rem`):** Institutional cards, primary dashboard widgets, and modals.
- **Search Bars (`full-round / 9999px`):** Pill-shaped caps to distinguish "Discovery" actions from standard form inputs.

---

## 7. Reusable Component Inventory

### A. Buttons (`<Button />`)
- **Primary:** Solid Deep Forest Green (`#064E3B`) with white text, `8px` rounded corners, subtle hover brightness.
- **Secondary:** White background, 1px border (`#064E3B`), green text.
- **Ghost:** Transparent background, green/slate text, used for tertiary actions or modals.

### B. Institutional Cards (`<InstitutionCard />`)
- White background, 1px soft border.
- Top-aligned institutional thumbnail (`80x80px` with `8px` radius).
- Institution name in bold `headline-md`, location and category rating in `label-sm`.
- Bookmark/Save button in top right corner.

### C. Search Bar (`<GlobalSearchBar />`)
- Full-pill shape (`rounded-full`).
- Deep green background with white text for hero discovery, or white with green outline for inner pages.
- Embedded division, district, and category filters.

### D. Navigation & Brand Logo (`<Navbar />`, `<Sidebar />`)
- Responsive sticky top header and collapsible side menu.
- Easily swap logo images in `public/` or `components/common/BrandLogo.tsx`.
