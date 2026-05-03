---
name: SNBT AI
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#4a4455'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#7b7487'
  outline-variant: '#ccc3d8'
  surface-tint: '#732ee4'
  primary: '#630ed4'
  on-primary: '#ffffff'
  primary-container: '#7c3aed'
  on-primary-container: '#ede0ff'
  inverse-primary: '#d2bbff'
  secondary: '#5c5f61'
  on-secondary: '#ffffff'
  secondary-container: '#e0e3e5'
  on-secondary-container: '#626567'
  tertiary: '#4d4f4f'
  on-tertiary: '#ffffff'
  tertiary-container: '#656767'
  on-tertiary-container: '#e5e6e6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#eaddff'
  primary-fixed-dim: '#d2bbff'
  on-primary-fixed: '#25005a'
  on-primary-fixed-variant: '#5a00c6'
  secondary-fixed: '#e0e3e5'
  secondary-fixed-dim: '#c4c7c9'
  on-secondary-fixed: '#191c1e'
  on-secondary-fixed-variant: '#444749'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  h1:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  xs: 0.25rem
  sm: 0.5rem
  md: 1rem
  lg: 1.5rem
  xl: 2rem
  2xl: 3rem
  container-max: 1200px
  gutter: 1.5rem
---

## Brand & Style

This design system is built on a **Minimalist** foundation with a focus on high-clarity educational interactions. The brand personality is "The Empathetic Expert"—intelligent and authoritative, yet accessible and supportive. 

The aesthetic is characterized by an "Airy" feel, achieved through generous negative space, a light-flooded color palette, and soft geometry. It avoids visual clutter to minimize cognitive load for students and educators, ensuring that the AI-generated content remains the focal point. The interface should feel like a premium digital workspace: calm, organized, and focused.

## Colors

The palette is anchored by **Deep Purple (#7C3AED)**, used strategically for primary actions and brand presence to denote intelligence and creativity. The primary background uses **Slate 50**, providing a cool, soft alternative to pure white that reduces eye strain during long study sessions.

Pure white is reserved for high-elevation surfaces (cards and chat bubbles) to create a clear "layering" effect. Text uses a high-contrast Slate 900 for readability, while secondary information is relegated to Slate 500 to maintain the airy hierarchy.

## Typography

This design system utilizes **Inter** for its exceptional legibility and neutral, systematic character. The typographic scale is generous, prioritizing readability in dense AI responses.

Line heights are set wider (1.5–1.6) to enhance the "airy" feel and prevent text-heavy educational content from feeling overwhelming. Headlines use a slightly tighter letter spacing and heavier weight to provide a confident, structural anchor to the interface.

## Layout & Spacing

The design system employs a **Fixed Grid** for desktop and a **Fluid Grid** for mobile devices. The layout centers on a focused "Chat Stream" that occupies a maximum width of 800px to ensure optimal line lengths for reading.

A rigorous 8px (0.5rem) spacing rhythm is used. Margin and padding values are intentionally large (24px to 48px) to reinforce the minimalist and supportive brand intent. Content should never feel cramped; when in doubt, increase whitespace to allow the user "room to think."

## Elevation & Depth

Visual hierarchy is established using **Ambient Shadows** and **Tonal Layers**. This design system avoids harsh borders in favor of soft, diffused shadows that simulate natural light.

- **Level 0 (Background):** Slate 50. Flat.
- **Level 1 (Cards/Chat Bubbles):** White surface with a very soft, 12% opacity shadow (Blur: 20px, Y-Offset: 4px) tinted with the primary purple to maintain color harmony.
- **Level 2 (Modals/Popovers):** White surface with a more pronounced 18% opacity shadow and a 1px subtle Slate 100 border.

The use of backdrop blurs (Glassmorphism) is reserved exclusively for the top navigation bar to maintain context while scrolling.

## Shapes

The shape language is defined by **Rounded (0.5rem base)** logic, specifically leaning into `rounded-2xl` for major components. 

- **Primary Containers:** 1rem (16px) or 1.5rem (24px) corner radius to create a friendly, approachable silhouette.
- **Buttons & Inputs:** 0.75rem (12px) to provide a modern, tactile feel without being fully pill-shaped.
- **Chat Bubbles:** Varied rounding (e.g., bottom-left or bottom-right reduced) to indicate directionality of the conversation while maintaining the 1rem theme.

## Components

### Buttons
Primary buttons use the Deep Purple background with white text. Hover states should transition to a slightly darker shade with an increased shadow spread. Use "Ghost" buttons for secondary actions to maintain the airy aesthetic.

### Chat Bubbles
- **User:** Slate 100 background, Slate 900 text, aligned right.
- **AI (SNBT):** White background with a soft shadow, Slate 900 text, aligned left. Include a subtle Deep Purple "AI" icon badge.

### Input Fields
The main chat input should be a large, white floating bar with a 1.5rem corner radius and an ambient shadow. It should feel "detached" from the bottom of the screen, floating over the content.

### Cards
Educational resources (links, videos, quiz modules) should be housed in white cards with `rounded-2xl` corners and a 1px Slate 100 stroke. 

### Progress Indicators
For educational tracking, use thin, rounded progress bars with a Deep Purple fill and a Slate 100 track.