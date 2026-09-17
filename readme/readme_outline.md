# SIDEA PROJECT - UX Enhancement & Implementation Outline

This checklist outlines the roadmap for enhancing the user experience, starting with the **Home Page**. Items can be checked off (`[x]`) as we implement them step-by-step.

---

## 1. Home Page UX Enhancements

### 1.1 Fullscreen Immersive Scroll & Storytelling Presentation
- [x] **1.1.0** Interactive 3D Wireframe & Architectural Blueprint Canvas: Real-time mouse-reactive 3D architectural geometric structures and blueprint node field.
- [x] **1.1.1** Full-Viewport Architectural Sections: Full-bleed project visuals with synchronized dark glass navbar styling.
- [x] **1.1.2** Clean Metadata & Typography Overlays: Polished metadata row (Location, Year, Category tag, Design Style) without clutter or serial number distractions.
- [x] **1.1.3** Side Navigation & Scroll Cue: Minimalist floating vertical progress rail and animated scroll indicator prompt.
- [x] **1.1.4** Direct Project Navigation: Seamless links to individual project detail pages respecting route configurations.

### 1.2 Dynamic Image & Asset Sourcing
- [ ] **1.2.1** Image Server Integration: Connect home carousel dynamically to the image server / project manifests rather than hardcoded static paths.
- [ ] **1.2.2** Performance & Lazy Loading: Implement progressive image loading, responsive image resolutions, and blur-up/skeleton placeholders.

### 1.3 Studio Introduction & Philosophy Section
- [x] **1.3.1** Studio Vision Statement: Create a clean, architectural typography-focused introductory section establishing the studio's ethos.
- [x] **1.3.2** Architectural Quote Section: Redesign the Mies van der Rohe quote component with modern typography and subtle accents.

### 1.4 Featured Projects Showcase Grid
- [ ] **1.4.1** Curated Projects Grid: Add a teaser section beneath the hero highlighting 3–4 signature architectural projects.
- [ ] **1.4.2** Interactive Hover & Micro-interactions: Implement smooth card hover states, project categories, and direct links to Project Detail views.
- [ ] **1.4.3** Call-to-Action (CTA): High-contrast, polished "View All Projects" entry point with category filters.

### 1.5 Video & Media Integration
- [ ] **1.5.1** Responsive Architectural Video Showcase: Modern embedded / modal video player for project walk-throughs (e.g., *White Modern Minimal Residence*, *Memorial Ghat*, *Sunrise Vistara*).
- [ ] **1.5.2** Video Grid / Carousel: Clean tabbed or slider interface to switch between project walk-through videos seamlessly.

### 1.6 Page-level Polish & Responsiveness
- [x] **1.6.1** Navbar & Hero Integration: Translucent dark glass navbar with blur effect synchronized with hero visuals.
- [x] **1.6.2** Large-Display & 4K Optimization: Fluid container scaling and multi-column architectural grid for ultra-wide monitors.
- [ ] **1.6.3** Code Cleanup: Remove obsolete commented-out code and test blocks from home component template.

---

## 2. Projects & Portfolio Experience
- [x] **2.1** Project Listing & Filter Refinements:
  - [x] Architectural portfolio header with curated subtitle.
  - [x] Horizontal category filter pills bar with instant project count badges.
  - [x] Responsive project cards with 4:3 cover images, category tags, location/year metadata, and hover elevation.
  - [x] Instant search & autocomplete dropdown.
- [x] **2.2** Project Detail Page & Gallery Viewer:
  - [x] Compact cover image card flush-aligned with architectural concept narrative.
  - [x] Snug, vertically-centered project title, category tag, and summary.
  - [x] Structured architectural concept narrative alongside project specifications card.
  - [x] Interactive photographs gallery grid with pinch-zoom fullscreen lightbox.
- [x] **2.3** About Us & Studio Profile Enhancements:
  - [x] Studio manifesto card matching home page philosophy typography.
  - [x] 3-pillar architectural principles grid (Form & Soul, Art of Precision, Living Experience).
  - [x] Principal Architect profile with clean interactive contact pills (email & phone copy feedback).
