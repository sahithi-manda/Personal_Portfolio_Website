# Sahithi Reddy · AI / ML Engineer

An interactive 3D portfolio: a single WebGL "research facility" the camera flies through as you scroll. Six stations, one per section:

| # | Station | 3D | Content |
|---|---|---|---|
| 01 | Core | Black-chrome android head, glass goggles, scan band, orbital data streams, editorial wordmark | Name, role, tagline, stats |
| 02 | Identity | Layered neural network; layers light up as you read | Bio, education, focus areas |
| 03 | Galaxy | Clickable constellation of skills grouped into systems | Each skill with the project/role/course that backs it |
| 04 | Laboratory | Pedestal under a volumetric spotlight, one specimen per project | Six featured projects + full dossiers, GitHub-synced archive |
| 05 | Timeline | Corridor of light gates the camera flies through | Internships, education, certifications |
| 06 | Signal | Machined titanium ring emitting pulses | Contact links |

## Stack

React 19 · Vite · TypeScript · Three.js · React Three Fiber · Drei · @react-three/postprocessing · GSAP + ScrollTrigger · Lenis · Framer Motion · Tailwind CSS v4

## Structure

```text
src/
  content/          profile, experience, skills, labs (single source of truth for all copy)
  lib/
    store.ts        tiny shared store between DOM and WebGL (no re-renders for per-frame values)
    scroll.ts       Lenis smooth scroll, scroll → station mapping, ScrollTrigger
    quality.ts      WebGL detection, quality tier, reduced-motion, 3D on/off preference
  scene/            lazy-loaded WebGL world
    Scene.tsx       canvas, fog, performance monitor, post-processing
    CameraRig.tsx   camera flight between station keys, hold dolly, pointer parallax
    Facility.tsx    Lightformer studio environment, architecture, reflective floor, GPU dust
    rig.ts          station anchors and camera keys (desktop + compact)
    stations/       one component per station + project specimens
  ui/               header + station rail, loader, sections, dossier dialog
  hooks/, services/ GitHub auto-sync (unchanged behaviour)
```

## Editing content

All text lives in `src/content/`. Projects shown in the Laboratory are in `labs.ts`; list results only when they are in the repository's own output. Everything else on GitHub appears automatically in the archive (see *GitHub sync* below).

## Performance and accessibility

- The 3D world is a separate chunk; text renders first.
- Two quality tiers (`high` / `low`) chosen from device signals; the performance monitor lowers resolution if frame rate drops. Force one with `?tier=low` or `?tier=high`.
- Without WebGL, or with *prefers-reduced-motion*, the site uses a static poster background; visitors can switch 3D on or off from the header (remembered locally).
- All content is semantic HTML above the canvas: headings, lists, a native `<dialog>` for dossiers, keyboard-operable skill selection, skip link and focus styles.

## Run

```bash
npm install
npm run dev
npm run build
```

## GitHub sync

Public repositories under `VITE_GITHUB_USERNAME` (default `sahithi-manda`) appear in the archive automatically. Add a `portfolio.json` in a repository to customise it, or the topic `portfolio-hidden` to hide it. `VITE_GITHUB_TOKEN` is optional and raises the API rate limit.

## Credits

The android head is based on the Lee Perry-Smith head scan by [Infinite Realities](https://www.infinite-realities.net), licensed [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/), restyled (neck cut, materials, goggles and collar added in code).
