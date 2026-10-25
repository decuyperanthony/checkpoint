# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

One person, the owner, who uses Correspondance daily in two situations equally: at a desk, organising work next to the editor (tickets in progress, pull requests to review, developer reminders), and on a phone, glancing at the list, ticking items off and jotting new ones quickly. The repository is public, so developers and recruiters reading the code are a second audience.

## Product Purpose

Correspondance (formerly Checkpoint) is a single checklist split into titled sections, each holding checkable items, behind a PIN. It exists to keep a personal running list in one place, reachable from any device, without an account system. Success is twofold and equal: the owner enjoys using it every day, and the public repository shows code and interface quality worth looking at.

## Positioning

Not a task manager: no dates, priorities, assignees or projects. One page, sections and items, checked or not. It is also a reference codebase for Effect on a Next.js server, built in small reviewed pull requests.

## Operating Context

- Desk use: open in a browser tab beside the editor; sections such as "Tickets en cours", "PR à review", "Pense-bête", "Backlog".
- Phone use: quick check-offs and additions, often one-handed; installable as a PWA (planned).
- Entry is a PIN screen; a session lasts 30 days.

## Capabilities and Constraints

- Sections: create, rename in place, remove with confirmation. Items: add, edit in place, check / uncheck (optimistic), remove with confirmation. Actions live in a per-row `⋯` menu.
- PIN login with a per-address attempt limit; logout.
- French interface only, through next-intl; every string is a translation key.
- Light and dark themes, both first-class.
- Stack: Next.js App Router, Effect 4 on the server, Neon Postgres via Drizzle, Tailwind CSS v4, shadcn/ui (Radix). Styling goes through design tokens (oklch CSS variables); a lint rule forbids raw palette colours, arbitrary values and inline styles.
- Not decided yet: reordering by drag and drop.

## Brand Commitments

- The name is Correspondance (renamed from Checkpoint on 2026-10-25, with the metro-map direction; the repository keeps its name).
- The mark is a metro line roundel holding a check, in the green of Paris metro line 12, the owner's line. Inspired by metro signage, never the RATP's own logo or name.
- The interface speaks French and uses "tu" ("Entre ton code", "Réessaie dans un instant").

## Evidence on Hand

No logo, imagery, testimonials or metrics exist. Real content is the owner's own sections and items; do not invent others beyond neutral examples.

## Product Principles

- One list, read at a glance: the state of each section is visible without opening anything.
- Adding and checking must be fast on both a keyboard and a thumb.
- Quiet until needed: secondary actions stay out of the way, destructive ones always ask.
- Nothing decorative that the code would have to justify: the interface is part of what the repository shows.

## Accessibility & Inclusion

Everything must stay usable with a keyboard alone and with a screen reader: named controls, focus returned after every edit or dialog, errors announced with their field.
