# Design Theme & UI Guidelines

This document serves as the central reference for all UI/UX and styling decisions when creating new pages or features for this application. It is based on the core design language established in the application mockups.

## 1. Color Palette

*   **Primary Brand:** Vibrant Orange (`#FF8A00` or Tailwind `#F98A15`)
    *   *Usage:* Primary buttons, floating action buttons (FAB), active tab icons, progress bar fills, active step indicators, and notification badges.
*   **Primary Background:** Light Gray / Off-White (`#F8F9FA` or Tailwind `slate-50`)
    *   *Usage:* Main application background to provide contrast for white surface cards.
*   **Surface:** Pure White (`#FFFFFF`)
    *   *Usage:* Cards, headers, bottom navigation, and form input backgrounds.
*   **Primary Text:** Dark Gray / Slate (`#1E293B` or Tailwind `slate-800`)
    *   *Usage:* Headings, main titles, primary body text, and input values.
*   **Secondary Text:** Medium Gray (`#94A3B8` or Tailwind `slate-400` / `slate-500`)
    *   *Usage:* Subtitles, descriptions, placeholders, and inactive icons.
*   **Soft Accents:** Pale Orange (`#FFEFE2` or `#FFF4E8`)
    *   *Usage:* Backgrounds for icons within cards to create a soft, branded highlight without overwhelming the user.
*   **Success/Status:** Green (`#10B981` or similar)
    *   *Usage:* Completed step checkmarks or positive status indicators.

## 2. Typography

*   **Font Family:** Modern, clean sans-serif (e.g., Inter, Roboto, or system-ui).
*   **Headings:** Bold weights with slightly tight tracking (e.g., `font-bold tracking-tight`). Used for screen titles and card headers.
*   **Body & Subtitles:** Regular or medium weights. Smaller text (e.g., `text-xs` or `text-sm`) is frequently used for secondary information to keep the interface uncluttered.
*   **Labels:** Form labels are small, bold, and placed above the inputs.

## 3. UI Components & Layout

### Cards & Containers
*   **Style:** White background, rounded corners (typically `rounded-xl` or `rounded-2xl`), and subtle, soft shadows (`shadow-sm`).
*   **Borders:** Very light borders (e.g., `border border-slate-50/50` or `border-slate-100`) may be used to subtly define edges.
*   **List Items:** List views are typically constructed using distinct cards with spacing between them, rather than a single continuous list with dividing lines. These cards often feature a soft-background icon on the left and a chevron on the right.

### Buttons
*   **Primary CTA (Call to Action):** Full-width or large buttons with a solid orange background, white text, bold font, and rounded corners (`rounded-lg`). They should include interactive states (e.g., `active:scale-95 transition-all`).
*   **FAB (Floating Action Button):** Circular, solid orange with a white icon, usually positioned at the bottom right with a noticeable shadow (e.g., `shadow-lg shadow-orange-500/30`).

### Forms & Inputs
*   **Inputs:** Outline styling with rounded corners (`rounded-lg`), light borders, and white backgrounds.
*   **Layout:** Vertically stacked with small, bold labels positioned above the input fields.

### Navigation
*   **Header:** White background, sticky at the top, bottom border. Contains navigation/menu icons, a centered title, and context actions (like notifications).
*   **Bottom Nav:** Fixed at the bottom, white background, top border. Features icons with text labels below them; the active state uses the primary brand color, while inactive states use secondary text colors.

## 4. Spacing & Structure

*   **Padding:** Spacious and consistent, typically using standard Tailwind spacing like `p-4` or `p-5` (16px - 20px) for screen edges and container padding.
*   **Scroll Behavior:** The main layout frame should lock to the viewport height (preventing global scrolling), while individual page contents scroll independently within their designated areas.

## 5. Implementation Notes

*   Whenever adding new UI elements, default to Tailwind utility classes that match the definitions above (e.g., `text-slate-800`, `bg-[#F8F9FA]`, `text-[#F98A15]`).
*   Ensure interactive elements have appropriate hover or active states (e.g., `active:scale-95` for buttons) to make the app feel responsive and alive.
*   Maintain the clean, card-based aesthetic by avoiding overly dense information layouts; utilize whitespace and secondary text colors to establish clear visual hierarchy.
