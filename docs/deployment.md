# Production deployment

- Website: https://tahmid-nasif-tamal.pages.dev/
- GitHub: https://github.com/tnt-a11y/My-Portfolio
- Cloudflare Pages project: `tahmid-nasif-tamal`
- Production branch: `main`
- Build command: `pnpm build`
- Build output: `dist`

The project uses Cloudflare Pages Direct Upload. The Pages hostname is permanent and serves the production deployment independently of this computer. GitHub stores the source; pushes do not automatically deploy with this setup.

For an update, build the committed source, then upload the contents of `dist` to a new **Production** deployment in the existing Pages project. Alternatively, after signing in to Wrangler, run `pnpm dlx wrangler pages deploy dist --project-name tahmid-nasif-tamal --branch main`.

The domain appears in `index.html`, `src/data/content.ts`, `public/robots.txt`, and `public/sitemap.xml`. Update those together if moving to a custom domain. Cloudflare credentials stay outside this repository.
