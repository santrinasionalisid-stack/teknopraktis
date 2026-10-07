# TeknoPraktis — SEO Checkpoints

## SEO-001 — Canonical & Domain
Status: PASS / LOCKED

- Canonical domain: https://teknopraktis.my.id
- www -> apex: 301
- pages.dev -> canonical: 301
- HTTPS active

## SEO-002 — Technical Baseline
Status: PASS / LOCKED

- Canonical meta
- Open Graph / Twitter metadata
- robots.txt
- sitemap.xml
- Schema.org WebSite / Organization / BlogPosting
- Lighthouse Mobile: 100/100/100/100
- Lighthouse Desktop: 100/100/100/100

## SEO-003 — Editorial Discoverability
Status: PASS

- RSS feed at /rss.xml
- Breadcrumb schema
- Related article internal linking
- Updated/review metadata support
- Source/reference metadata support
- Build-time content quality gate

## SEO-004 — Google Search Console
Status: NEXT / USER AUTH REQUIRED

1. Add Domain property: `teknopraktis.my.id`.
2. Obtain Google verification TXT value.
3. Add TXT record to Cloudflare DNS.
4. Verify ownership.
5. Submit `https://teknopraktis.my.id/sitemap.xml`.
6. Inspect homepage and request indexing after successful verification.

## SEO-005 — Automated Publishing
Status: TODO

Implement scheduler, research sources, draft creation, quality/fact gate, controlled publish, and post-deploy checks.
