# Premium Design System & Style Guide

This guide defines the premium styling for the entire codebase (Frontend + Admin), replacing all greys with a bold palette of Red, Black, and Blue, and standardizing gradient patterns across components.

## Color System

### Brand Primaries
- Red (brand.red.500): Hex `#EF4444` • RGB `239, 68, 68`
- Blue (brand.blue.500): Hex `#3B82F6` • RGB `59, 130, 246`
- Black (brand.black.900): Hex `#0A0A0A` • RGB `10, 10, 10`
- Background (brand.black.950): Hex `#050505` • RGB `5, 5, 5`
- Accent (accent): Hex `#0EA5E9` • RGB `14, 165, 233`

### Brand Shades (Tailwind color keys)
- brand.red:  
  50 `#FFE5E5` • 100 `#FFCACA` • 200 `#FF9C9C` • 300 `#FF6F6F` • 400 `#F64F4F` • 500 `#EF4444` • 600 `#DC2626` • 700 `#B91C1C` • 800 `#991B1B` • 900 `#7F1D1D`
- brand.blue:  
  50 `#E7F1FF` • 100 `#D4E6FF` • 200 `#ABC9FF` • 300 `#84B0FF` • 400 `#5696FF` • 500 `#3B82F6` • 600 `#2563EB` • 700 `#1D4ED8` • 800 `#1E3A8A` • 900 `#172554`
- brand.black:  
  900 `#0A0A0A` • 950 `#050505`

### System Neutral Replacement
All Tailwind `gray-*` classes are remapped to the brand palette:
- `gray-50 … 600` → Blue-tinted neutrals (`brand.blue.*`)
- `gray-700 … 900` → Premium blacks (`brand.black.900/950`)

This ensures existing `text-gray-*`, `bg-gray-*`, and `border-gray-*` usages adopt the new premium scheme with no manual class changes required.

## Gradient Patterns

Standardized gradients are available via Tailwind utilities configured in `backgroundImage`:
- `bg-gradient-brand` → `linear-gradient(90deg, #EF4444 0%, #3B82F6 100%)`
- `bg-gradient-brand-soft` → `linear-gradient(90deg, rgba(239,68,68,0.9), rgba(59,130,246,0.9))`
- `bg-gradient-brand-diagonal` → `linear-gradient(135deg, #EF4444, #3B82F6)`
- `bg-gradient-brand-radial` → `radial-gradient(circle at 30% 20%, rgba(239,68,68,0.35), rgba(59,130,246,0.35) 60%, rgba(10,10,10,0.8) 100%)`

### Component Patterns
- Buttons:  
  `bg-gradient-to-r from-primary to-secondary text-white hover:brightness-110`
- Headers/Navbars:  
  `bg-black bg-gradient-to-b from-primary/20 to-secondary/20`
- Section Backgrounds:  
  `bg-gradient-brand-radial`
- Cards:  
  `bg-black border border-red-600 shadow-[0_0_24px_rgba(59,130,246,0.15)]`

## Accessibility

- Text on black uses `#FFFFFF` default body text; headings use `brand.red.500` or `brand.blue.500` where appropriate.
- Links and low-contrast copy use `brand.blue.300/400` to maintain visual hierarchy.
- Button text on gradients is `text-white`; ensure minimum contrast (WCAG AA) by keeping gradient opacity ≥ 0.9 for soft variants and avoiding pale stops behind text.
- Focus states: use `ring-2 ring-brand.blue-600` or `outline-brand.blue-600` for visible focus.

## Responsiveness & Interactions

- Gradients scale well across breakpoints; prefer `bg-gradient-to-*` with percentage stops for consistency.
- Hover states: increase brightness or add subtle scale (`hover:brightness-110 hover:scale-[1.01] transition`).
- Active states: use deeper blue (`active:bg-brand.blue-700`) or darker overlay.

## Usage Cheatsheet

- Primary button:  
  `class="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-full hover:brightness-110"`
- Outline button:  
  `class="border border-red-600 text-red-600 px-6 py-2 rounded-full hover:bg-red-600 hover:text-black"`
- Muted text:  
  `class="text-brand-blue-300"`
- Divider line:  
  `class="h-[2px] bg-gradient-to-r from-primary to-secondary"`

All values are defined in Tailwind config to ensure consistent usage across the app.
