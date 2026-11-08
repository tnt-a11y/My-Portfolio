# Production deployment

- Website: <https://tnt-a11y.github.io/My-Portfolio/>
- Source: <https://github.com/tnt-a11y/My-Portfolio>
- Production branch: `main`
- Workflow: `.github/workflows/pages.yml`
- Build command: `pnpm build`
- Build output: `dist`

GitHub Actions builds the site with `VITE_BASE_PATH=/My-Portfolio/`, uploads the Vite `dist` artifact, and publishes it through GitHub Pages whenever a commit reaches `main`. The workflow can also be started manually from the repository’s Actions tab.

For updates, push changes to `main`. To review a deployment, open the repository’s Actions tab and check the latest **Publish portfolio** run. The production URL is under **Settings → Pages** after the first successful deploy.

The canonical, Open Graph, robots, and sitemap URLs use the GitHub Pages production URL. If the repository name or site domain changes, update those URLs and the `VITE_BASE_PATH` value in the workflow together.
