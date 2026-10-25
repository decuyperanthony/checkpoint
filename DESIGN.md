---
name: Correspondance
description: A personal checklist drawn as a metro map; sections are lines, items are stations.
colors:
  signage-white: "oklch(0.99 0.002 250)"
  enamel-card: "oklch(1 0 0)"
  signage-ink: "oklch(0.22 0.012 255)"
  quiet-ink: "oklch(0.5 0.012 255)"
  platform-grey: "oklch(0.96 0.004 250)"
  hairline: "oklch(0.91 0.006 255)"
  field-edge: "oklch(0.86 0.008 255)"
  line-12-green: "oklch(0.5 0.11 162)"
  line-12-green-ink: "oklch(0.99 0.01 162)"
  green-wash: "oklch(0.95 0.025 162)"
  green-wash-ink: "oklch(0.34 0.08 162)"
  alarm-red: "oklch(0.55 0.2 27)"
  info-blue: "oklch(0.45 0.16 262)"
  warning-amber: "oklch(0.62 0.16 55)"
  line-blue: "oklch(0.43 0.17 262)"
  line-blue-ink: "oklch(0.99 0.01 262)"
  line-magenta: "oklch(0.48 0.18 352)"
  line-magenta-ink: "oklch(0.99 0.01 352)"
  line-orange: "oklch(0.62 0.17 48)"
  line-orange-ink: "oklch(0.2 0.03 48)"
  line-yellow: "oklch(0.64 0.13 80)"
  line-yellow-ink: "oklch(0.2 0.03 80)"
  line-sky: "oklch(0.62 0.11 232)"
  line-sky-ink: "oklch(0.2 0.03 232)"
  night-map: "oklch(0.17 0.014 258)"
  night-card: "oklch(0.2 0.014 258)"
  night-popover: "oklch(0.22 0.016 258)"
  night-ink: "oklch(0.94 0.006 250)"
  night-quiet-ink: "oklch(0.72 0.012 255)"
  night-platform: "oklch(0.24 0.014 258)"
  night-hairline: "oklch(1 0 0 / 10%)"
  night-field-edge: "oklch(1 0 0 / 16%)"
  night-alarm-red: "oklch(0.68 0.17 25)"
  night-line-green: "oklch(0.7 0.12 162)"
  night-line-blue: "oklch(0.68 0.14 262)"
  night-line-magenta: "oklch(0.68 0.16 352)"
  night-line-orange: "oklch(0.76 0.15 52)"
  night-line-yellow: "oklch(0.86 0.15 92)"
  night-line-sky: "oklch(0.79 0.09 228)"
  night-line-ink: "oklch(0.17 0.03 162)"
typography:
  display:
    fontFamily: "Atkinson Hyperlegible Next, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Atkinson Hyperlegible Next, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.33
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Atkinson Hyperlegible Next, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Atkinson Hyperlegible Next, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.375
  label:
    fontFamily: "Atkinson Hyperlegible Next, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.43
    fontFeature: "tnum"
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "14px"
  full: "9999px"
spacing:
  sm: "4px"
  md: "8px"
  lg: "16px"
  xl: "24px"
  screen: "40px"
  line-gap: "48px"
  map-gutter: "64px"
components:
  button-primary:
    backgroundColor: "{colors.line-12-green}"
    textColor: "{colors.line-12-green-ink}"
    rounded: "{rounded.lg}"
    padding: "0 10px"
    height: "32px"
  button-secondary:
    backgroundColor: "{colors.platform-grey}"
    textColor: "{colors.signage-ink}"
    rounded: "{rounded.lg}"
    padding: "0 10px"
    height: "32px"
  button-ghost-hover:
    backgroundColor: "{colors.platform-grey}"
    textColor: "{colors.signage-ink}"
    rounded: "{rounded.lg}"
    size: "32px"
  input-outline:
    backgroundColor: "{colors.enamel-card}"
    textColor: "{colors.signage-ink}"
    rounded: "{rounded.lg}"
    padding: "4px 10px"
    height: "36px"
  input-pin:
    backgroundColor: "{colors.enamel-card}"
    textColor: "{colors.signage-ink}"
    rounded: "{rounded.lg}"
    height: "48px"
  line-badge:
    backgroundColor: "{colors.line-12-green}"
    textColor: "{colors.line-12-green-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    size: "28px"
  station:
    backgroundColor: "{colors.signage-white}"
    rounded: "{rounded.full}"
    size: "20px"
  station-checked:
    backgroundColor: "{colors.line-12-green}"
    textColor: "{colors.line-12-green-ink}"
    rounded: "{rounded.full}"
    size: "20px"
  station-row:
    rounded: "{rounded.lg}"
    padding: "0 8px"
    height: "44px"
  roundel-mark:
    backgroundColor: "{colors.line-12-green}"
    textColor: "{colors.line-12-green-ink}"
    rounded: "{rounded.full}"
    size: "36px"
  actions-menu:
    backgroundColor: "{colors.enamel-card}"
    textColor: "{colors.signage-ink}"
    rounded: "{rounded.lg}"
    padding: "4px"
---

# Design System: Correspondance

## Overview

**Creative North Star: "The Night Map and the Enamel Plate"**

Correspondance draws a personal checklist as a metro map. Every section is a line, numbered in a round badge and painted in one of six line colours handed out by position; every item is a station on that line's vertical track. Checking a station fills its ring and draws the leg that leaves it in the line colour, so a section's progress is the stretch of track already travelled. The count beside the line's name ("2/4") is the only other progress signal; there is no bar.

The ground is signage: white enamel by day, the blue-black of a night map by night. Both themes are first-class and every token is defined for both. Colour comes almost entirely from the lines; the surrounding interface is neutral ink on a neutral ground, with line 12's green doubling as the primary action, focus and brand colour. There are no cards: lines sit directly on the ground, laid out as a map in one column on phones and two from 1024px.

One face, Atkinson Hyperlegible Next, carries every level. Hierarchy comes from weight and size alone. Secondary actions stay hidden until hover or keyboard focus (always visible on coarse pointers), and things not yet made (a next station, a new line) are drawn as dashed outlines of the real thing.

**Key Characteristics:**

- Sections are lines, items are stations, progress is travelled track.
- Six line colours assigned by position; line 12 green leads and is also primary.
- Flat signage on a white or night-map ground; no cards, no shadows at rest.
- One legible sans at every level; rank by weight and size.
- Not-yet-made things are dashed outlines with a plus.

## Colors

A neutral signage ground and ink, coloured only by six metro line hues; green is both the first line and the interface's single action colour.

### Primary

- **Line 12 Green** (`line-12-green`): the first line's colour, the primary button, the focus ring, the caret, native `accent-color`, text selection (28% mix) and the roundel mark. The shipped icon and manifest use its hex equivalent `#00764f`. On the night map it lifts to `night-line-green` with dark ink.
- **Green Wash** (`green-wash`, ink `green-wash-ink`): the soft accent surface for highlighted menu items.

### Secondary

- **The line set** (`line-blue`, `line-magenta`, `line-orange`, `line-yellow`, `line-sky`): the remaining five line colours, handed out in this fixed order after green by `lineColorAt(index)` in `src/shared/ui/tokens.ts`, repeating past the sixth. Each has its own ink for text on a badge or check: near-white on green, blue and magenta; dark on orange, yellow and sky. In dark theme every line lifts to a lighter, slightly warmer step (`night-line-*`) and all inks turn dark.

### Tertiary

- **Alarm Red** (`alarm-red`, `night-alarm-red`): destructive actions and field errors only.
- **Info Blue / Warning Amber** (`info-blue`, `warning-amber`): status tones for `Text`; success reuses Line 12 Green.

### Neutral

- **Signage White** (`signage-white`): the page ground in light theme; also the station ring's fill, which hides the track behind it.
- **Enamel Card** (`enamel-card`): outlined inputs, menus and dialogs.
- **Signage Ink** (`signage-ink`): all body and heading text.
- **Quiet Ink** (`quiet-ink`): counts, hints, checked (struck-through) items, placeholder text.
- **Platform Grey** (`platform-grey`): row hover (60%), secondary button, muted surfaces.
- **Hairline** (`hairline`) and **Field Edge** (`field-edge`): borders and input strokes; Field Edge also draws every dashed "not yet" outline and the scrollbar thumb.
- **Night Map** (`night-map`, `night-card`, `night-popover`, `night-platform`, `night-ink`, `night-quiet-ink`, `night-hairline`, `night-field-edge`): the dark theme's ground, surfaces, inks and translucent strokes.

### Named Rules

**The Line Colour Rule.** Line colours belong to lines. A colour is assigned by a section's position, never chosen per section, and it appears only on that line's badge, track and stations. Chrome around the map stays neutral, except Line 12 Green in its primary role.

**The Faint Track Rule.** A track ahead is its line colour at 25% (30% for yellow and sky, which are lighter); travelled track is the full colour. Never a grey track.

**The Browser Wears the Palette Rule.** Caret, native accent, selection and scrollbar take the tokens (`caret-color` and `accent-color` green, selection a 28% green mix, scrollbar thumb Field Edge).

## Typography

**Display Font:** Atkinson Hyperlegible Next (loaded via `next/font`, variable `--font-sans`, with sans-serif fallback)
**Body Font:** Atkinson Hyperlegible Next
**Label/Mono Font:** same face; counts and badge numbers use tabular numerals.

**Character:** A signage face drawn for legibility, used alone. Headings are the same face in bold with slight negative tracking; there is no serif and no second family.

### Hierarchy

- **Display** (700, 1.875rem, tight tracking): the single-task panel title ("Entre ton code").
- **Headline** (700, 1.5rem, tight tracking): the app name beside the roundel in the screen header.
- **Title** (700, 1rem to 1.5rem via `Title` sizes sm/md/lg/xl; line names use md, 1.125rem): line names and section headings.
- **Body** (400, 1rem, leading-snug 1.375): station labels and running text. Inputs drop to 0.875rem from the `md` breakpoint and stay 1rem on phones so iOS does not zoom.
- **Label** (500, 0.875rem): buttons and menu items. Counts use the same size at 400 in Quiet Ink with tabular numerals; line badge numbers are 700.

### Named Rules

**The One Face Rule.** Atkinson Hyperlegible Next at every level. Rank by weight (400 / 500 / 700) and size from the shared `sm | md | lg | xl` scale.

**The No Caps Label Rule.** No uppercase labels, eyebrows or small-caps section tags. A line's identity is its badge and its name. Wide tracking is reserved for the centred PIN field.

## Layout

A single screen, centred, max width 64rem (`max-w-5xl`), with 20px side padding on phones and 32px from 640px; the header sits 32px from the top (48px from 640px) and the page ends with 96px of room. Header to content gap is 40px.

The map is a CSS multi-column layout: one column below 1024px, two from 1024px, with a 64px gutter. Each line is kept whole in its column (`break-inside: avoid`) and lines are separated by 48px. Inside a line, every row (header or station) is at least 44px tall, the touch target and the station pitch along the track. Features never write spacing classes: they compose `Stack` with gaps of 4 / 8 / 16 / 24px (`sm` to `xl`). Single-task screens (PIN) use a centred `Panel`, max width 24rem, with 32px between title block and form.

Loading keeps the layout: the skeleton is two lines of badges and stations in the same grid, not a spinner or a word.

## Elevation & Depth

Flat. The map, its lines and the header sit on the ground with no shadow and no card. Depth appears only for things that float over the map: the actions menu (medium shadow plus a 1px ring of ink at 10%) and the confirmation dialog (ring only, on the popover surface). Layering in dark theme comes from tonal steps (`night-map`, `night-card`, `night-popover`) and translucent white strokes.

### Shadow Vocabulary

- **Floating menu** (Tailwind `shadow-md` with `ring-1` at foreground/10): the `⋯` dropdown only.

### Named Rules

**The Map Is Flat Rule.** Nothing on the map is lifted. A shadow means the element floats above the map and will close.

## Shapes

Two shape families. Signage parts are perfect circles: the roundel mark (36px), line badges (28px), stations (20px rings with a 4px stroke), the next-station marker (20px dashed). Interface parts take the gentle base radius of 10px (`--radius: 0.625rem`, with sm 6px, md 8px, xl 14px derived from it): buttons, inputs, rows' hover field, menus; dialogs use xl.

Tracks are straight vertical bars 4px wide, centred on the station column, with square ends. "Not yet" shapes (a line to open, the next station) use a 2px dashed stroke in Field Edge around a plus icon; the open line trails a 4px dashed track stub.

## Components

### Buttons

Quiet, compact, inherited from the shadcn atom but routed through `Button` and `IconButton` with the shared size scale.

- **Shape:** gentle radius (10px).
- **Primary:** Line 12 Green with its ink, 32px tall (36px `lg`, 40px `xl` on the PIN screen), 0.875rem medium label.
- **Hover / Focus:** primary fades to 80%; focus shows a 3px ring of green at 50% with a green border; active presses down 1px.
- **Secondary:** Platform Grey with ink. **Ghost:** transparent, Platform Grey on hover; used for every icon button (logout, theme, `⋯`). **Destructive:** Alarm Red text on a 10% red wash.

### Inputs / Fields

- **Outline:** Enamel Card fill, 1px Field Edge stroke, 10px radius; in dark, a 30% translucent fill.
- **Ghost:** borderless and transparent until hovered (Platform Grey 60%) or focused (card fill): the inline "Ajouter un élément" and "Nouvelle section" fields, which sit in the track.
- **PIN:** outline, 48px tall, text centred with the widest tracking.
- **Focus:** green border plus 3px green ring at 50%. **Error:** red border and 3px red ring at 20%, message announced with the field.

### Navigation

The header is the only chrome: roundel mark and app name on the left, ghost icon buttons (logout, theme toggle) on the right. No nav bar, no tabs.

### Line (signature)

A section drawn as a metro line. Header row: line badge (28px circle, line colour, bold number in the line's ink), the line name as a bold Title, the travelled count in Quiet Ink, then the `⋯` menu. Below, the stations along the track, ending with the next-station marker and the ghost field that adds one. The new-line control at the end of the map is an open line: dashed badge with a plus and a dashed track stub.

### Station row (signature)

A 44px row with the track running behind the station. The station is a 20px ring in the line colour (4px stroke) filled with the ground so the track stops at it; checked, it fills with the line colour and shows a check in the line's ink, and its label turns Quiet Ink with a 60% strikethrough. The whole label toggles. Each half of the track (arriving, leaving) is a faint base with the travelled colour laid over it and drawn with a vertical scale from the top: checking draws the leaving half (100ms ease-out), then the next station's arriving half after a 100ms delay; unchecking runs the same draw in reverse. No motion under `prefers-reduced-motion`. Rows take a Platform Grey (60%) field on hover.

### Actions menu

The `⋯` ghost icon button, hidden until its row or line is hovered or focused (or the menu is open), always shown on coarse pointers. It opens a popover menu with icon-led items, destructive items last after a separator, and returns focus to the trigger after an action. Removing always confirms in a dialog.

### Roundel mark

A Line 12 Green circle holding a white check (3px stroke in the header; 7/64 in the favicon). The maskable PWA icon is full-bleed green with the check inside the 80% safe zone. Inspired by metro signage, never the RATP's own logo.

## Do's and Don'ts

### Do:

- **Do** assign line colours with `lineColorAt(index)` in the fixed order green, blue, magenta, orange, yellow, sky.
- **Do** show progress as travelled track plus a tabular count ("2/4"); the track is the progress indicator.
- **Do** draw anything not yet created as a dashed outline of the real thing with a plus (next station, open line).
- **Do** define every new colour for both the signage-white and night-map themes, with an ink for any line-coloured fill.
- **Do** keep secondary actions hidden until hover or focus, and always visible on touch.
- **Do** keep rows at least 44px tall and keep the station column aligned with the track.
- **Do** follow `docs/best-practices.md` for how tokens reach components (token classes only, cva variants typed against `tokens.ts`).

### Don't:

- **Don't** put lines in cards or panels; lines sit on the ground.
- **Don't** use a progress bar, percentage ring or a generic square checkbox on a line; stations are rings.
- **Don't** use a line colour for chrome, or pick a line's colour by hand.
- **Don't** add a second typeface, a serif, or uppercase labels and eyebrows.
- **Don't** add shadows to anything on the map; shadows are for floating, dismissable layers.
- **Don't** animate a leg for longer than its two 100ms halves, or at all under reduced motion.
- **Don't** reproduce the RATP logo, name or official line numbering artwork.
