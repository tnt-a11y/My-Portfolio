# Tahmid Nasif Tamal — personal portfolio

A dark portfolio for Tahmid Nasif Tamal, Senior Game Developer, built with Vite, React, TypeScript, vanilla CSS, GSAP/ScrollTrigger, and Lucide. An opening hero leads into four sections in order: Projects, About, Services, Contact. Includes an interactive cellular automaton, five personal photos, a subtle pixel cursor trail, colorful Gulp It Bro!, Maze Funker, Red Team Rockstars, and The Vote showcases, self-hosted Latin variable fonts, and a lazy-loaded accessible project dialog. Navigation matches the section order; the Back to Top link returns to the opening hero. The header eyes track the cursor and blink with a local Ouch recording on activation; tracking stops at rest and respects reduced motion.

## Run locally

Use **Node.js 22.12+** (Node 24 LTS recommended) and pnpm 11+ or npm.

```sh
pnpm install
pnpm dev
```

Open the Local URL printed by Vite (normally `http://127.0.0.1:5173`). npm also works: `npm install` then `npm run dev`; the committed reproducible lockfile is for pnpm.

```sh
pnpm typecheck
pnpm lint
pnpm build
pnpm preview
```

`build` runs the TypeScript check and emits the static site in `dist/`. No server, account, API keys, or external services are required. The project contains no analytics or remote font requests.

## Customize your content

**Edit `src/data/content.ts`.** The `site` object contains the name, role, introduction, email, GitHub, Facebook, LinkedIn, and optional canonical URL. Contact shows only the four supplied account icons, with accessible names and no visible labels or promotional text. The Gmail icon opens a `mailto:` link; the three profile icons open safely in a new tab. Invalid or unconfigured destinations remain hidden. Brand shapes are inline SVG paths from Simple Icons 11.15.0 (CC0), with its license in `public/licenses/Simple-Icons-CC0.txt`; no icon requests, new dependencies, or animation loops are needed.

Your original supplied photo is at `public/media/tahmid-nasif-tamal.jpg`. Change `site.portrait` and `site.portraitAlt` to replace it. It appears at up to 420px beside the About introduction and fills the content width on phones. PP.jpg and CP.jpg are optimized WebP assets in the adjacent two-photo gallery, configured with `site.personalPhotos`. SP.jpg and EP.jpg are smaller square frames immediately beneath the first portrait, configured with `site.supportingPhotos`. The two desktop columns share a bottom edge, keeping the new portraits within the lower border of the sea photos. On phones, the portrait column precedes the introduction and sea photos. All five photos start monochrome and individually transition to color over 1.1 seconds on hover or keyboard focus, then return to monochrome on exit. Reduced Motion removes the transition. The effect uses CSS, with no JavaScript frame loop; all photos load lazily and the supplied originals remain untouched.

The public copy uses one Senior Game Developer title, the supplied personal biography, concise project summaries, and an icon-only Contact section with a screen-reader heading. The opening biography sits beside the photos; `site.aboutParagraphs` supplies the full story below them, with two reading columns on desktop and one on phones. `site.aboutClosing` is the emphasized closing statement. Paired `**` markers in the opening and body paragraphs render as native bold emphasis without a Markdown dependency. Decorative periods, photo labels, repeated slogans, duplicate project labels, unconfigured social placeholders, and repeated author credits have been removed. The page title, social preview, and description use the current professional title too.

The pixel cursor trail uses a fixed pool of 18 tiny squares, coalesces pointer updates to animation frames, and animates only transform/opacity. It does no continuing frame-loop work at rest. It yields to project dialogs and is disabled for touch/coarse pointers and reduced motion. Edit `src/components/PixelCursorTrail.tsx` to adjust spacing, size, opacity or lifetime; remove its render in `App.tsx` to disable it entirely.

## Hero experiment

The square hero grid runs Conway’s Game of Life (B3/S23) on a 40 × 40 wrapping grid. Bright cells are alive; fading charcoal cells show their recent history. Click, tap, or drag to create cells. Pause/Play, Next Generation, and Reseed controls are keyboard accessible. Focus the grid and use arrow keys to select a cell, then Space or Enter to toggle it; Tab exits normally.

Simulation work runs about seven times per second without a React render on every generation. It stops while offscreen or the document is hidden, starts paused for reduced-motion preferences, and caps canvas resolution at 2× device pixel ratio. Touch scrolling remains available over the grid. Change the board rules and seeded patterns in `src/lib/life.ts`, rendering/controls in `src/components/CellularAutomaton.tsx`, and the visual treatment in `src/styles.css`.

## Project records

`projects` is a typed array. Add another object with a unique `id` and `slug` to add a card; the layout adapts automatically. Available fields:

| Field | Purpose |
| --- | --- |
| `id`, `slug`, `title` | Stable identity and visible title |
| `category`, `summary`, `description` | Card category/summary and modal overview |
| `features`, `technologies` | Lists shown in the project details |
| `platform`, `status` | Editable project facts shown in the dialog |
| `role` | Optional retained authorship metadata |
| `thumbnail`, `poster` | Card image and video poster |
| `videoSource` | Gameplay MP4/WebM; keep `null` until ready |
| `playableUrl`, `sourceUrl` | Real external URLs; keep `null` until ready |

The projects are **Red Team Rockstars, v0.9.0**, and **The Vote, v0.1.0**, using verified project facts and actual in-game screenshots. Their **PLAY PROJECT** links open the existing public itch.io games: [Red Team Rockstars](https://trinitrointeractive.itch.io/red-team-rockstars) and [The Vote](https://trinitrointeractive.itch.io/the-vote). Both source repositories remain private, so their optional source links stay hidden. The games’ WebGL files are hosted by itch.io and are not shipped or downloaded with the portfolio. Project screenshots stay in full color and use optimized WebP images; each modal shows its configured screenshot when no video exists. Future empty or failed media uses the graceful fallback, and a project without a playable URL keeps its build CTA disabled. The Vote currently supports career stages 1–11; future national stages are not advertised as playable.

## Add screenshots and gameplay

Place assets in **`public/media/`**, for example:

```text
public/media/project-001.webp
public/media/project-001-poster.webp
public/media/project-001.mp4
```

Then set these values in the project record:

```ts
thumbnail: 'media/project-001.webp',
poster: 'media/project-001-poster.webp',
videoSource: 'media/project-001.mp4',
```

Use paths without `public/` and without a domain; the media resolver respects Vite's configured base path. HTTPS-hosted media is also supported. Prefer optimized 16:9 AVIF/WebP screenshots (around 1600 × 900) and browser-compatible H.264 MP4 or WebM video. Compress videos, include a poster, and ensure your CDN supports media range requests. Gameplay is not rendered or fetched until its modal opens. Configured video attempts muted inline looping autoplay; native controls provide play, pause, audio, seek, and fullscreen. Blocked autoplay exposes a manual Play action. Closing pauses and releases the video.

## File structure

```text
src/
  App.tsx                     Section state, scroll progress, GSAP orchestration
  main.tsx                    React entry and self-hosted fonts
  fonts.css                   Two local Latin WOFF2 variable font faces
  styles.css                  Tokens, layout, effects, responsive/reduced-motion rules
  data/content.ts             All editable profile and project data, URL helpers
  hooks/usePointerSurface.ts  Frame-coalesced desktop tilt, spotlight and magnetic hover
  components/
    Navbar.tsx                Fixed navigation with active section
    Hero.tsx                  Opening name, professional title and cellular automaton
    AboutSection.tsx          Aligned photos and full biography, after Projects
    CellularAutomaton.tsx     Interactive canvas, playback controls, visibility handling
    PixelCursorTrail.tsx      Bounded pointer-only pixel animation
    Artwork.tsx               Original project concept visual
    ProjectSection.tsx        Adaptive data-driven project cards
    ProjectModal.tsx          Lazy-loaded native dialog and gameplay player
    modal.css                 Lazy-loaded dialog styles
    ContactSection.tsx        Icon-only account links and footer
    ContactIcon.tsx           Four inline brand icons with accessible parent links
  lib/life.ts                 Seeded boards and pure Conway B3/S23 evolution
public/
  favicon.svg                 Small personal monogram
  og-image.svg                Monochrome social image source
  media/                      Your future screenshots, posters and videos
    red-team-rockstars/       Optimized, genuine v0.9.0 game screenshots
    the-vote/                 Optimized, genuine title and campaign screenshots
  licenses/                   Redistributed font licenses
tests/portfolio.spec.ts       Browser interaction, responsive and accessibility checks
tests/cellular-automaton.spec.ts  Life rules, playback, drawing, visibility and portrait
tests/showcase-polish.spec.ts  Photo color transitions, game links/media and cursor lifecycle
scripts/package-itch.py       Validate/package an existing WebGL export for itch.io
```

## Browser tests

```sh
pnpm exec playwright install chromium
pnpm test
```

The suite starts Vite automatically unless a server is already listening. It checks Life rules, wrapped edges, play/pause/step/reseed, pointer and keyboard drawing, hidden/offscreen suspension, portrait loading, section counts/navigation, modal open and dismissal, keyboard focus containment/restoration, body scroll locking, empty and failed video sources, real video playback/release/reopen, blocked autoplay, the four supplied contact destinations, icon-only rendering, keyboard navigation and safe external links, expanding to multiple projects, disabled playable actions, repeated opens with motion enabled, reduced motion, orientation changes, 320–1920px layouts, console exceptions, and WCAG A/AA rules with axe. The tiny generated `tests/fixtures/preview.webm` is used only for playback tests and is not included in the published site. `pnpm test:ui` opens the interactive runner. Reports are written to `playwright-report/` and failures include screenshots/traces. Automated accessibility checks complement manual keyboard, screen-reader, and real-device review.

## Deploy

Production website: **https://tnt-a11y.github.io/My-Portfolio/**

Source repository: **https://github.com/tnt-a11y/My-Portfolio**

GitHub Pages publishes the Vite production build automatically whenever changes reach `main`. The workflow builds with the repository subpath so photos, fonts, game links, and other assets resolve correctly. See [deployment instructions](docs/deployment.md) for details.

No routing rewrites are needed: navigation uses native section anchors and project details are dialogs. Canonical, Open Graph, robots, and sitemap metadata use the production domain. `public/og-image.png` is the 1200 × 630 social image, with an editable source at `public/og-image.svg`.

Performance is supported by local Latin font subsets, reserved media ratios, a separately loaded modal/CSS chunk, no initial gameplay requests, and bounded pointer effects. Core Web Vitals and Lighthouse targets are not guarantees: measure your deployed domain with its final media on realistic devices/network conditions. The footer year updates automatically.

## Recorded verification

Verified locally on **7 November 2026**:

- Production build, TypeScript checks, ESLint, and dependency peer checks passed.
- After adding the full supplied biography, production build, TypeScript and ESLint passed again, along with **14 targeted browser checks** covering navigation, 320–1920px layouts, modal accessibility, identity and photo alignment. Desktop and phone biography layouts were inspected visually.
- **34 Playwright tests passed** in Chromium, including Life rules and interactions, animation suspension, portrait sizing/loading, aligned photo borders at 600–1920px, independent color transitions for all five photos, the concise identity/title, navigation with normal and reduced motion, colorful project media and both playable links, cursor lifecycle, and automated WCAG A/AA checks for the page and modal. Desktop/mobile compositions were also inspected visually. Firefox, Safari, physical devices, and screen readers were not tested.
- The initial release passed production smoke checks at the root path and under `/portfolio-test/`, including the lazy project dialog. The updated hero uses the same base-aware media resolver for the supplied photo. Modal code and gameplay media remain deferred until the project opens.
- After organizing all five photos and simplifying the page, **Lighthouse 13.6.0** scored **100 Performance / 100 Accessibility / 100 Best Practices / 100 SEO** on both mobile and desktop production previews. With default simulated mobile networking and 4× CPU throttling: LCP **0.8 seconds**, CLS **0**, total blocking time **20 ms**. Desktop: LCP **0.2 seconds**, CLS **0**, total blocking time **0 ms**. Local lab results are not field measurements or a guarantee for deployments.
- A separate desktop cursor comparison sampled 120 mouse moves over three seconds against the same page with the trail disabled. Both runs had **16.7 ms median and 95th-percentile frame intervals**, with **zero long tasks**. Browser task time rose from 80 ms to 144 ms across the sample. This bounded local check is recorded in `.qa/cursor-performance.json`; touch and reduced-motion users receive no trail.

The latest local HTML audits are `.qa/lighthouse-organized-mobile.report.html` and `.qa/lighthouse-organized-desktop.report.html`; the browser report is `playwright-report/index.html`. These generated reports are ignored by source control. Retest after changing media or deploying to your domain.
