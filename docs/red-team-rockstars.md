# Red Team Rockstars showcase and WebGL publication

Published on 7 November 2026: **https://trinitrointeractive.itch.io/red-team-rockstars**.

The portfolio presents the **0.9.0 playtest** with actual game screenshots and verified features: isometric company management, 107 cybersecurity tools, contract/worker/workstation assignments, recruitable specialists, progression, containment and local saves. Content is editable in `src/data/content.ts`. Screenshot files are under `public/media/red-team-rockstars/`; the original supplied portrait remains at `public/media/tahmid-nasif-tamal.jpg`.

The game runs on itch.io rather than inside the portfolio. The website fetches no Unity loader, WebAssembly, or game data during normal browsing. The PLAY PROJECT action opens itch.io in a new tab with safe external-link attributes. Desktop keyboard and mouse are the supported game controls. A gameplay video was not invented; the project modal displays a real screenshot until a video is configured.

## Published artifact

- Source release: `v0.9.0-playtest` from `tnt-a11y/RedTeamRockstars`, commit `5a0fdca72714ff780993befdaa07ae523155b8f4`.
- The existing local workspace contained the older 0.8.0 build. Its source checkout was preserved; the current GitHub release was downloaded separately and checked against its recorded SHA-256.
- Original 0.9.0 release ZIP SHA-256: `7597060e8a6e1dc5ace957d74aef208aac3a442e5ca9fa29906b3a608c092792`.
- The itch.io package contains seven WebGL files, with `index.html` at the root and the existing Build/TemplateData paths preserved. Its compressed runtime assets remain unchanged.
- itch.io ZIP: `.qa/publish/Red-Team-Rockstars-WebGL-0.9.0-itch.zip` (78,208,790 bytes).
- itch.io ZIP SHA-256: `53a84a54cc52852539925966bdacf4230273ac88fd8ee3285362321bf3ce80e0`.
- Game ID: `5313769`. The 0.9.0 file is selected for browser play; the earlier draft upload is hidden.
- The account owner supplied the AI disclosure. The source repository remains private and is not linked from the public portfolio.

The uploaded game was launched through itch.io, reached its 0.9.0 main menu, and opened the playable warehouse with New Game. No browser errors were recorded in that hosted smoke test. This used the existing released artifact; it did not rebuild Unity or rerun the historical native Unity suites.

## Future uploads

Package a new existing WebGL export without changing the game source:

```sh
python scripts/package-itch.py --build "PATH/TO/WEBGL" --output ".qa/publish/Red-Team-Rockstars-WebGL-itch.zip"
```

The helper verifies a root entry page, itch.io HTML5 size/file limits, ZIP integrity, and writes a checksum receipt. Upload it to the existing itch.io game, select the new file for browser play, retain click-to-launch fullscreen behavior, and validate the actual hosted game. Keep game archives out of `public/` and `dist/`.
