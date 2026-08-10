# SEO, GEO, and client funnel

Notes from portfolio strategy discussion (Aug 2026). Use this when prioritizing discovery and conversion work.

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
- **Write titles/descriptions like a buyer, not a designer.**  
  Weak: “C.H Services | Clyde Abenojar”  
  Stronger: “Property maintenance website mockup — marketing site & lead form | Clyde Abenojar”
- **One page per service niche you want.** e.g. `/services/booking-websites`, `/services/web-apps-saas`, `/services/construction-trades-software` — short, outcome-focused, with 2–3 relevant case studies and a CTA. (Done: those three niches plus `/services/` index.)
- **Blog posts that answer hiring questions**, not only tools: “How much does a small business website cost,” “Wix to Next.js rebuild,” “What you get when you hire an AI-assisted developer.”
- **Local/niche keywords** if that’s your market: Kent trades sites, PH construction tools, surrogacy agency sites — match the work you already shipped.

### 2. GEO — get cited by AI

AI likes **clear, quotable, structured proof**:

- Put a plain **“Who I help / what I ship / outcomes”** block near the top of the homepage (not only vibes).
- Case studies with **problem → what you built → result** (even soft results: “46 pages, 3 languages, HubSpot leads”).
- **FAQ** on About/Contact: pricing model, timeline, what “AI-assisted” means, who isn’t a fit.
- Same name/role everywhere: Clyde Abenojar · AI-assisted web builder · clydeabenojar.site
- Free tools help GEO if each tool page states *who it’s for* and links back to hire you.
- Get mentioned off-site: LinkedIn posts, guest blurbs, client testimonials with real names — AI and Google both use that.

### 3. Funnel — turn visits into clients

Map your site to stages:

| Stage | Goal | On your site |
|--------|------|----------------|
| Attract | Get traffic | SEO pages, blog, free tools, LinkedIn → case studies |
| Engage | Prove you can ship | Homepage work + `/work` + deep case studies (Promise, Konstru, CH Services) |
| Convert | Get a lead | One primary CTA (“Book a call” / “Get a quote”) in nav, homepage, and end of every case study |
| Close | Reduce friction | Short intake: project type, budget range, timeline, link to brief |

Practical funnel upgrades:

1. **One main CTA** sitewide (not five competing ones).
2. **Case study → Contact** path: every project ends with “Want something like this?” + form or Calendly. (Done: project-specific inquiry CTAs on case studies; homepage leave-a-message + discovery call forms.)
3. **Free tools as top-of-funnel:** tool → soft CTA (“Need this built into your product?”).
4. **Segment by client type** on homepage: “For local businesses” / “For SaaS founders” with different proof.
5. **Track the funnel** (you already have visit/section tracking in admin): which case studies get contact clicks; double down on those niches.

---

## Simple priority order for more clients

1. Sitemap + index `/work` and case studies — **done**
2. Stronger CTAs and contact path on every work page — **done** (email CTAs; lead forms on homepage)
3. 3–5 SEO/GEO pages or posts aimed at the niches you want next (trades sites, SaaS MVPs, booking, etc.) — **service pages done**; more hiring-intent blog posts still open
4. Testimonials / results on homepage and case studies — **open**
5. Share one case study weekly where your buyers hang out (LinkedIn, Facebook groups, founder Discords) — **open**

**SEO** = get discovered. **GEO** = get recommended by AI. **Funnel** = don’t waste that traffic — proof → clear ask → easy contact.
