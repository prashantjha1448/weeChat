# 🍏 Apple UI/UX Design System & Rules

This document outlines the mandatory UI/UX design rules for the entire frontend application. All components, layouts, modals, forms, and pages must strictly follow Apple's design language.

---

## 🎨 1. Color Palette & Theme

| Element | Color Code / Class | Description |
| :--- | :--- | :--- |
| **Main Page Canvas** | `#F5F5F7` (`bg-[#F5F5F7]`) | Signature Apple off-white background |
| **Cards & Floating Containers** | `#FFFFFF` (`bg-white`) | Pure crisp white surface with soft drop shadow |
| **Primary Headings & Text** | `#1D1D1F` (`text-neutral-900`) | Charcoal black for maximum legibility |
| **Subtitles & Secondary Text** | `#86868B` (`text-neutral-500`) | Soft muted gray for hierarchy |
| **Borders & Dividers** | `#E5E5E7` (`border-neutral-200`) | Ultra-fine, subtle container outlines |
| **Primary CTA Button** | `#000000` (`bg-black text-white`) | High-contrast pill button (`rounded-full`) |
| **Accent Colors** | `#0071E3` (Apple Blue), `#10B981` (Emerald Status) | Functional indicators |

---

## 📐 2. Layout, Spacing & Elevation

1. **Generous Padding & Breathing Space**:
   - Use large section spacing (`py-24`, `px-6`, `max-w-6xl mx-auto`).
   - Clean alignment without cramped borders or cluttered boxes.

2. **Apple Glassmorphism**:
   - Headers and navigation bars use subtle glass blur: `backdrop-blur-xl bg-white/80 border-b border-neutral-200/80`.

3. **Soft Ambient Shadows**:
   - Use soft, high-blur shadows for floating cards: `shadow-2xl shadow-neutral-200/80` or `shadow-sm`.

---

## 🔤 3. Typography & Hierarchy

- **Font Stack**: Clean, modern sans-serif (`font-sans antialiased`).
- **Headings**: Extra large, bold, tracking tight (`text-5xl sm:text-7xl font-bold tracking-tight text-neutral-900 leading-[1.05]`).
- **Section Labels**: Uppercase micro-text (`text-[10px]` or `text-[11px] font-semibold tracking-widest text-neutral-400 uppercase`).

---

## 🔘 4. Buttons, Dropdowns & Interactive Elements

- **Pill Shape Standard**: All primary buttons must be pill-shaped (`rounded-full`).
- **Dropdown Menus**:
  - Seamless text lists without tacky gray box backgrounds or heavy borders.
  - Left-aligned text (`text-left`).
  - Text color transitions on hover (`text-neutral-600` → `hover:text-black`).
  - No decorative SVG icons inside dropdown list items unless functional.
- **Active Feedback**: Use micro-scaling and active spring effects (`active:scale-95 transition-all duration-150`).

---

## 🖼️ 5. SVG Illustrations & Mockups

- All inline graphics, device mockups, and illustrations must reflect Apple hardware & iOS/macOS software UI standards:
  - White card containers (`#FFFFFF`), neutral light fills (`#F8FAFC`, `#F3F4F6`), subtle stroke borders (`#E2E8F0`), and clean typography.
