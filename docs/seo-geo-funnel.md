# SEO, GEO, and client funnel

Notes from portfolio strategy discussion (Aug 2026). Use this when prioritizing discovery and conversion work.

**Related:** [Five future blog posts](./blog-ideas-funnel-seo-geo.md) · [CTA events SQL](./supabase-cta-events.sql)

## What they mean

**SEO (Search Engine Optimization)**  
Making Google/Bing find and rank you for what buyers search — e.g. “Next.js developer for small business,” “build booking website Cebu,” “AI web app freelancer.”

**GEO (Generative Engine Optimization)**  
Making AI answers (ChatGPT, Perplexity, Gemini, Google AI Overviews) recommend you. Those systems pull from clear pages, case studies, reviews, and sites that answer specific questions — not just keyword stuffing.

**Funnel**  
The path from stranger → trust → contact → paid client. For you that looks like:

`Discover (search / AI / social / referral) → Land on homepage or case study → See proof (work + tools) → Contact / book → Close`

---

## How to apply them on your portfolio

You already have good pieces: case studies, free tools, blog, contact, metadata. Gaps that matter for clients:

### 1. SEO — get found for buyer intent

- **Add `/work` + every case study to the sitemap.** (Done: `app/sitemap.ts` now lists home, blog, free tools, `/work`, case studies, and `/services`.)
- **Write titles/descriptions like a buyer, not a designer.** (Done: `seoTitle` / `seoDescription` on case studies and free tools.)
- **One page per service niche you want.** (Done: booking, web apps/SaaS, construction/trades + `/services/` index.)
- **Blog posts that answer hiring questions**, not only tools. (Planned: [blog-ideas-funnel-seo-geo.md](./blog-ideas-funnel-seo-geo.md) — not published yet.)
- **Local/niche keywords** if that’s your market: Kent trades sites, PH construction tools, surrogacy agency sites — match the work you already shipped. (Partially covered in case-study SEO titles.)

### 2. GEO — get cited by AI

AI likes **clear, quotable, structured proof**:

- Put a plain **“Who I help / what I ship / outcomes”** block near the top of the homepage. (Done: `AudienceSegments`.)
- Case studies with **problem → what you built → result** (in place; end CTAs point to Book a call).
- **FAQ** on About/Contact: pricing model, timeline, what “AI-assisted” means, who isn’t a fit. (Done: `HomeFaq` + FAQ JSON-LD.)
- Same name/role everywhere: Clyde Abenojar · AI-assisted web builder · clydeabenojar.site (hero eyebrow updated.)
- Free tools help GEO if each tool page states *who it’s for* and links back to hire you. (Done: `ToolHireCta`.)
- Get mentioned off-site: LinkedIn posts, guest blurbs, client testimonials with real names — still open (process). Named quotes: fill `lib/testimonials.ts` when you have permission.

### 3. Funnel — turn visits into clients

Map your site to stages:

| Stage | Goal | On your site |
|--------|------|----------------|
| Attract | Get traffic | SEO pages, blog, free tools, LinkedIn → case studies |
| Engage | Prove you can ship | Homepage work + `/work` + deep case studies + audience segments |
| Convert | Get a lead | One primary CTA: **Book a call** → `/#contact` |
| Close | Reduce friction | Discovery call + leave a message; project/service query prefill |

Practical funnel upgrades:

1. **One main CTA** sitewide — **done** (`PRIMARY_CTA_*` + `PrimaryCta`; nav/hero/footer/work/services/case studies).
2. **Case study → Contact** path — **done** (Book a call with `?project=` prefill; mailto secondary).
3. **Free tools as top-of-funnel** — **done** (audience + hire CTA on each tool).
4. **Segment by client type** on homepage — **done** (`AudienceSegments`).
5. **Track the funnel** — **done in code** (`cta_events` API + admin). Run [supabase-cta-events.sql](./supabase-cta-events.sql) in Supabase before production data appears.

---

## Simple priority order for more clients

1. Sitemap + index `/work` and case studies — **done**
2. Stronger CTAs and contact path on every work page — **done**
3. 3–5 SEO/GEO pages or posts aimed at niches — **service pages done**; **blog drafts listed** in blog-ideas doc
4. Testimonials / results on homepage and case studies — **results strip done**; named testimonials still open
5. Share one case study weekly where your buyers hang out — **open** (process)

**SEO** = get discovered. **GEO** = get recommended by AI. **Funnel** = don’t waste that traffic — proof → clear ask → easy contact.
