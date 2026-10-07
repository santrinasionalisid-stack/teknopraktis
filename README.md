# TeknoPraktis

Website editorial teknologi praktis berbahasa Indonesia.

## Production
- Canonical domain: https://teknopraktis.my.id
- Hosting: Cloudflare Pages
- Production branch: `main`
- Framework: Astro
- Build command: `npm run build`
- Output directory: `dist`

## Content workflow
Artikel disimpan di `src/content/articles/` dalam format Markdown dan wajib lolos schema `src/content.config.ts`. Push ke `main` memicu deployment otomatis Cloudflare Pages.

## SEO baseline
Canonical URL, Open Graph, Schema.org, robots.txt, sitemap.xml, redirect www ke apex, dan redirect pages.dev ke canonical domain.
