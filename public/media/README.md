Put project files here: for example `project-001.webp`, `project-001-poster.webp`, and `project-001.mp4`.
Reference them in `src/data/content.ts` as `media/project-001.mp4` (without `public/`).
Relative media paths automatically respect the configured deployment base path.
Use 16:9 AVIF/WebP images and H.264 MP4 or WebM video with a poster. Leave fields null until real assets exist.

`tahmid-nasif-tamal.jpg` is the supplied personal portrait, copied from DP.jpg without changing its pixels.
Its grayscale appearance is applied in CSS. All five personal photos slowly reveal their own color on hover or keyboard focus and return to monochrome on exit. Reduced Motion makes the change immediate.
Edit `site.portrait`, `site.portraitAlt`, `site.personalPhotos`, and `site.supportingPhotos` in `src/data/content.ts` to replace them.

`tahmid-at-the-shore.webp` and `tahmid-by-the-sea.webp` are 640px-wide WebP exports of the supplied PP.jpg and CP.jpg. Their full 3:4 compositions are retained and originals are untouched.

`tahmid-evening.webp` and `tahmid-night-portrait.webp` are 480px-wide WebP exports of SP.jpg and EP.jpg. They appear in smaller square frames beneath the first portrait. The standing photo is cropped only by CSS; source files are preserved. The new row and the adjacent sea photos share their bottom border on desktop.

`red-team-rockstars/` contains genuine v0.9.0 game captures. `the-vote/` contains optimized copies of the existing WebGL title and Governor campaign captures from `G:/The Vote/Docs/Development/Screenshots/`. Game artwork stays in color in both project cards and dialogs. No Unity runtime or game archive belongs in this media directory.
