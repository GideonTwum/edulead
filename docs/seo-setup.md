# EduLead Network — SEO Setup Guide

This guide covers search engine setup for **https://eduleadnetwork.com** after the technical SEO implementation in the codebase.

## What Is Implemented in Code

- Global metadata (`metadataBase`, title template, default description, Open Graph, Twitter cards)
- Page-specific titles and descriptions for all public routes
- Canonical URLs on indexable pages
- Organization JSON-LD on the homepage
- Article JSON-LD on published Insights detail pages
- Event JSON-LD on published event detail pages
- BreadcrumbList JSON-LD on detail pages
- Dynamic sitemap at `/sitemap.xml`
- Robots rules at `/robots.txt` (allows public site, disallows `/admin/` and `/api/`)
- Admin and login pages set to `noindex`
- Google Analytics via admin settings or `NEXT_PUBLIC_GA_MEASUREMENT_ID` (production only)

## Environment

Set in production:

```env
NEXT_PUBLIC_SITE_URL=https://eduleadnetwork.com
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

If `NEXT_PUBLIC_GA_MEASUREMENT_ID` is absent, the site builds and runs normally without analytics.

Admin **Site Settings** can override:

- `defaultSeoTitle`
- `defaultSeoDescription`
- `faviconUrl`
- `logoUrl`
- Social profile URLs (used in Organization schema `sameAs`)
- `googleAnalyticsId` (takes precedence over env in production)

## Google Search Console Setup

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add a **Domain** property: `eduleadnetwork.com`
3. Verify ownership via **DNS TXT record** at your domain registrar
4. After verification, open **Sitemaps**
5. Submit: `https://eduleadnetwork.com/sitemap.xml`
6. Use **URL Inspection** for key pages:
   - `https://eduleadnetwork.com/`
   - `https://eduleadnetwork.com/about`
   - `https://eduleadnetwork.com/programmes`
   - `https://eduleadnetwork.com/insights`
   - `https://eduleadnetwork.com/join`
7. Monitor over time:
   - Indexing coverage
   - Impressions and clicks
   - Average CTR
   - Search queries (brand and topical)
   - Core Web Vitals

Do **not** submit admin URLs (`/admin/*`) or API routes.

## Bing Webmaster Tools (Optional)

1. Add site at [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Verify via DNS or Search Console import
3. Submit the same sitemap URL

## Google Analytics

1. Create a GA4 property for `eduleadnetwork.com`
2. Copy the Measurement ID (`G-XXXXXXXXXX`)
3. Either:
   - Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` in production env, **or**
   - Enter the ID in Admin → Settings → SEO

Analytics does not load in local development.

## Admin SEO Checklist

When publishing content:

- Fill **SEO Title** and **SEO Description** on programmes, events, opportunities and articles
- Use a **featured image** for social previews where possible
- Keep slugs lowercase and hyphen-separated
- Only publish verified organisation facts

## Editorial Content Recommendations

These are **future Insights topics** — not existing published content:

1. Leadership opportunities for university students in Ghana
2. How to find mentorship as a young professional
3. Careers in public policy and governance
4. Scholarships and fellowships for young people
5. Building leadership experience before graduation
6. How to prepare for fellowship applications
7. Youth participation in governance

Publish original, useful articles consistently. SEO supports discovery; quality content earns rankings.

## Remaining Manual Steps

- [ ] Verify `eduleadnetwork.com` in Google Search Console
- [ ] Submit `https://eduleadnetwork.com/sitemap.xml`
- [ ] Request indexing for homepage and key landing pages
- [ ] Configure GA4 if analytics are desired
- [ ] Add verified social profile URLs in Admin → Settings
- [ ] Ensure favicon assets are deployed: `/favicon.ico`, `/icon.png`, `/apple-icon.png`
- [ ] After deploy, verify `https://www.eduleadnetwork.com/favicon.ico` returns HTTP 200
- [ ] In Search Console, use URL Inspection on the homepage to refresh favicon and title crawl
- [ ] Build credible backlinks from partner organisations, universities and leadership networks
- [ ] Publish useful original Insights content on a regular cadence

## Important Notes

- No implementation guarantees Google ranking
- Do not keyword-stuff titles or descriptions
- Do not add fake reviews, ratings, addresses or impact statistics to structured data
- Keep brand naming consistent: **EduLead Network**
- Official tagline: **Education for Leadership and Change**
