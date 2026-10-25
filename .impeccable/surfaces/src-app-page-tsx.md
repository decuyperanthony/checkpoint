---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: ["src/app/Board.tsx", "src/app/AuthGate.tsx"]
---

# Board (the single screen) and PIN entry

Mode: Operate. The owner checks, adds and edits items across a handful of sections, on desktop and phone equally, in light and dark.

## Direction contract

THESIS: Sections are metro lines and items are their stations; checking an item fills its station and colours the leg that leaves it, so a section's progress is the stretch of line already travelled. It refuses the category default: a centred column of cards holding round checkboxes with one accent colour.

OWN-WORLD: Signage white ground in light, night-map blue-black in dark. Each section carries a line colour from a fixed set of six metro hues assigned by position, line 12 green first; the same green is the primary action and focus colour. Thick line tracks (4px), stations as rings that fill, round line badges with the section's number. One legible signage sans (Atkinson Hyperlegible) at every level; rank by weight and size, no serif, no caps labels.

STORY: The owner sees every line and how far each has travelled, ticks a station and watches its leg fill, adds a station at the end of a line, renames or removes from the station's menu.

FIRST VIEWPORT: Header: line-12 roundel with a check, "Correspondance", then logout and theme on the right. Below, lines laid out as a map: one column on phones, two from 1024px. Each line: badge and name on one row with its travelled count, then the vertical track with its stations, item text beside each, the ⋯ menu revealed on hover or focus, "Ajouter une station" as the track's open end. No cards. New line at the end as an open, dashed track.

FORM: Plan de métro, position 1 of my grounded list (the pick, chosen by the owner over the rolled timetable board). seed:8e1c8fbe39d634bb. Signature move: the travelled leg; checking fills the station and draws its leg in the line colour (one 200ms ease-out, none under reduced motion).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
