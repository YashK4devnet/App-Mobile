# Updated Design Theme & UI Guidelines (Core App Alignment)

This document outlines the design language used in the rest of the application. The goal is to migrate the `audit` component from its current light theme to match the core application's immersive, dark, glassmorphic aesthetic.

## 1. Color Palette

The core application uses a dark theme with vibrant, glowing accents.

*   **Primary Background:** Deep Navy/Black (`#0F0F23`)
    *   *Usage:* Main application background (`body`). Frequently layered with subtle radial gradients for depth (e.g., `#ff6b6b22`, `#4ecdc422`).
*   **Surfaces/Cards (Glassmorphism):** Semi-transparent White (`rgba(255, 255, 255, 0.03)`)
    *   *Usage:* Used for cards, modals, and dropdowns. Must be paired with a heavy backdrop blur (`backdrop-filter: blur(20px)`) and a delicate white border (`border: 1px solid rgba(255, 255, 255, 0.1)`).
*   **Primary Text:** Pure White (`#FFFFFF`)
    *   *Usage:* Headings, active states, main titles, and input values.
*   **Secondary Text:** Semi-transparent White (`rgba(255, 255, 255, 0.7)` or `rgba(255, 255, 255, 0.5)`)
    *   *Usage:* Navigation links, descriptions, and input placeholders.
*   **Brand Accents & Gradients:**
    *   Teal/Turquoise (`#4ECDC4`) - Used for active states, focus borders, and success indicators.
    *   Coral/Red (`#FF6B6B`) - Used for hover accents and destructive/cancel actions.
    *   *Gradient:* Many interactive elements use a vibrant gradient combining these: `linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1)`.

## 2. Typography

*   **Font Family:** System sans-serif fonts (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, etc.`).
*   **Headings:** Thin/Light font weights (`font-weight: 300`) with wide tracking/letter-spacing (`letter-spacing: 2px` to `4px`). Often styled as `uppercase`.
*   **Body & Buttons:** Light font weights (`font-weight: 300`) with noticeable letter-spacing (`1px` to `3px`).

## 3. UI Components & Layout

### Cards & Containers (Glassmorphism)
*   **Style:** Instead of solid white cards with shadows, use the glassmorphic approach.
*   **Implementation:**
    ```css
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 32px; /* Or 24px/16px for smaller containers */
    ```

### Buttons
*   **Primary CTA (Call to Action):** Pill-shaped (`border-radius: 50px`), transparent backgrounds with a semi-transparent white border (`border: 2px solid rgba(255, 255, 255, 0.3)`).
*   **Hover/Active States:** Buttons should transition to a glowing state on hover, either using a solid accent border (`border-color: #4ecdc4`) with a glowing box-shadow (`box-shadow: 0 0 30px rgba(78, 205, 196, 0.4)`), or by revealing a vibrant background gradient.
*   **Typography:** Uppercase, widely spaced text (`letter-spacing: 2px` or `3px`).

### Forms & Inputs
*   **Inputs:** Minimalist outline style. Fully transparent background (`background: transparent`), no border except for a bottom line (`border-bottom: 2px solid rgba(255, 255, 255, 0.2)`).
*   **Focus State:** The bottom border changes to Teal (`border-bottom-color: #4ecdc4`) and gains a subtle glowing shadow (`box-shadow: 0 4px 20px rgba(78, 205, 196, 0.3)`).
*   **Placeholders:** Subdued, uppercase, and widely spaced (`letter-spacing: 1px`).

### Navigation
*   **Header:** Sticky top header using the dark glassmorphic style. Contains gradients and icons with glowing hover effects.
*   **Bottom Nav:** Fixed at the bottom with a frosted glass background (`rgba(15, 15, 35, 0.95)` + `blur(20px)`), with active items highlighting in Teal (`#4ECDC4`).

## 4. Spacing & Structure

*   **Borders & Radius:** The app heavily favors rounded, pill-like shapes for buttons (`50px`) and large rounded corners for cards (`24px` to `32px`).
*   **Animations:** Smooth transitions (`transition: all 0.4s ease`) and slight Y-axis translations on hover (`transform: translateY(-2px)`) are standard to make the UI feel interactive.

## 5. Migration Strategy for Audit Component

To bring the audit component in line with this theme, you should:
1.  Change the component root background from `slate-50` (`#F8F9FA`) to `#0F0F23`.
2.  Replace solid white `bg-white` cards with glassmorphic styles (`bg-white/5 backdrop-blur-xl border border-white/10`).
3.  Update text colors from `text-slate-800` to `text-white`, and secondary text from `text-slate-400` to `text-white/70`.
4.  Redesign forms to use transparent backgrounds with bottom borders only.
5.  Change buttons from solid orange to rounded outlines that glow on hover.
