---
name: Jonomot
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
  primary: '#003527'
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
  primary-fixed: '#b0f0d6'
  primary-fixed-dim: '#95d3ba'
  on-primary-fixed: '#002117'
  on-primary-fixed-variant: '#0b513d'
  secondary-fixed: '#ffdadb'
  secondary-fixed-dim: '#ffb2b7'
  on-secondary-fixed: '#40000d'
  on-secondary-fixed-variant: '#920029'
  tertiary-fixed: '#e1e3e4'
  tertiary-fixed-dim: '#c5c7c8'
  on-tertiary-fixed: '#191c1d'
  on-tertiary-fixed-variant: '#454748'
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

## Brand & Style

The design system is built on a foundation of **Civic Minimalism**. It is designed to evoke a sense of transparency, reliability, and modern governance. By balancing a clean, professional interface with culturally resonant imagery, it creates an environment where citizens feel empowered to share opinions and demand service quality.

The aesthetic prioritizes clarity and utility, using generous whitespace to reduce cognitive load in data-dense environments. For pre-login and onboarding screens, the system utilizes a high-impact, illustrative mural style to establish a patriotic and social connection. Post-login, the interface transitions into a "Corporate Modern" toolset—efficient, structured, and focused on information hierarchy.

## Colors

The palette is derived from the national identity of Bangladesh, optimized for digital accessibility.

- **Primary (Deep Forest Green):** Used for primary actions, navigation headers, and core brand elements. It signifies stability and growth.
- **Accent (Red):** Used sparingly for critical alerts, notifications, and secondary brand highlights to ensure high visibility without overwhelming the user.
- **Backgrounds:** A tiered system of `White (#FFFFFF)` for primary surfaces and `Very Light Gray (#F9FAFB)` for container backgrounds and sidebars to create subtle depth.
- **Typography & Borders:** `Neutral Gray (#374151)` for primary text and `#E5E7EB` for soft borders to maintain a lightweight feel.

## Typography

The system utilizes a clean, modern sans-serif stack that ensures high legibility in both English and Bangla. For implementation, ensure a fallback to **Hind Siliguri** or **Noto Sans Bengali** for native script rendering.

Typography is used to define hierarchy through weight rather than just size. Headlines are bold and impactful, while body text remains spacious with a line-height of at least 1.5x to accommodate the vertical height of Bengali glyphs.

## Layout & Spacing

This design system employs a **Fluid Grid** with fixed-width constraints for readability on large screens. 

- **Desktop:** 12-column grid with a max-width of 1280px. Sidebar navigation remains fixed at 280px.
- **Tablet:** 8-column grid with 24px margins.
- **Mobile:** 4-column grid with 16px margins.

Spacing follows a 4px/8px baseline rhythm. Components should use generous internal padding (min 16px) to avoid a cramped "government-form" aesthetic, leaning instead toward a modern SaaS feel.

## Elevation & Depth

Visual hierarchy is established through **Low-contrast outlines** and **Tonal layers** rather than heavy shadows.

- **Level 0 (Base):** Light gray background for the workspace.
- **Level 1 (Cards):** White surfaces with a subtle 1px border (#E5E7EB).
- **Level 2 (Hover/Active):** A soft, diffused shadow (0px 4px 12px rgba(0, 0, 0, 0.05)) is applied when a user interacts with a card.
- **Glassmorphism:** Reserved exclusively for the login card on pre-login screens to allow the mural background to bleed through softly, creating a contemporary "frosted" effect.

## Shapes

The shape language is "Rounded," striking a balance between approachable (curved) and professional (structured). 

- **Standard Elements:** 8px (0.5rem) corner radius for buttons, input fields, and small cards.
- **Large Containers:** 16px (1rem) for institutional cards and primary dashboard widgets.
- **Search Bars:** Should utilize pill-shaped (full-round) caps to distinguish "Discovery" actions from "Actionable" inputs.

## Components

### Buttons
- **Primary:** Solid Deep Forest Green (#064E3B) with white text. High-contrast, 8px rounded corners.
- **Secondary:** White background, 1px border (#064E3B), green text.
- **Ghost:** No background or border, green text, used for tertiary actions or "Cancel."

### Institutional Cards
- White background, 1px border.
- Top-aligned image/thumbnail (80x80px with 8px radius).
- Institution name in `headline-md`, followed by location and rating in `label-sm`.
- Subtle "Save" or "Share" icon button in the top right corner.

### Form Inputs
- **Style:** Minimalist borders (1px #E5E7EB) that darken to Primary Green on focus.
- **Icons:** Left-aligned iconography (e.g., search, user, lock) in medium gray (#9CA3AF) to assist visual scanning.
- **Validation:** Error states use the Accent Red (#BE123C) for text and border.

### Search Bar (Global)
- Full-pill shape. 
- Deep green background with white text for high-impact visibility, or white background with green border for content-heavy pages.