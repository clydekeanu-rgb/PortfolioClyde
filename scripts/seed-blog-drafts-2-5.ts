/**
 * Idempotent seed: inserts blog ideas 2–5 as unpublished drafts.
 *
 * Usage:
 *   npx tsx scripts/seed-blog-drafts-2-5.ts          # needs Supabase env
 *   npx tsx scripts/seed-blog-drafts-2-5.ts --sql    # writes docs/seed-blog-drafts-2-5.sql
 */
import { createClient } from "@supabase/supabase-js";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

export type Draft = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
};

export const drafts: Draft[] = [
  {
    title: 'What "AI-assisted development" means when you hire me',
    slug: "what-ai-assisted-development-means-when-you-hire-me",
    excerpt:
      "AI-assisted doesn't mean an agent built your product unsupervised. Here's what you actually get when you hire me: scope, judgment, verification — and faster shipping where it counts.",
    content: `
<p>When someone says they build with AI, clients hear two different stories. One is “an agent wrote the whole app and I pressed publish.” The other is “I ship faster because I use AI on well-scoped pieces — and I still own the product decisions.”</p>
<p>I mean the second one. If you hire me for AI-assisted development, you're hiring judgment and accountability, not unchecked prompts.</p>

<h2>What clients think it means vs what it is</h2>
<p>The myth: describe the idea once, get a finished SaaS. The reality: AI is strong at implementing clear specs and weak at deciding what “correct” looks like for your market, your formulas, or your ops.</p>
<p>So the work still starts with scoping. AI speeds the middle — scaffolding, UI wiring, boilerplate — after the definition of done is clear.</p>

<h2>Spec first, agent second</h2>
<p>On <a href="/work/konstru/">Konstru</a>, the construction BOQ calculator, the first real work wasn't code. It was mapping modules, inputs, and expected outputs on paper. Prompting “build a construction calculator” with no Philippine BOQ spec would have produced something generic and wrong.</p>
<p>I wrote about that process in detail here: <a href="/blog/how-i-built-konstru-s-boq-calculator-using-ai-assisted-development/">How I built Konstru's BOQ calculator using AI-assisted development</a>.</p>
<p>That's the pattern I use on client work: tighten the spec, implement in small verifiable pieces, then move on.</p>

<h2>Where coding agents actually fail</h2>
<p>Working this way exposes the same failure modes over and over:</p>
<ul>
<li><strong>Partial implementations</strong> — 80% of a module, edge cases quietly skipped</li>
<li><strong>Merge conflict markers</strong> left in files after a “fix”</li>
<li><strong>Incomplete find-and-replace</strong> — a formula updated in one place but not everywhere</li>
</ul>
<p>None of these are dealbreakers. They're reasons you don't ship an agent's “it's done” without checking it yourself.</p>

<h2>What you still pay for</h2>
<p>You pay for architecture, product decisions, QA, and the ability to say no to a bad implementation. AI doesn't replace that. It compresses the time between a clear decision and working software.</p>
<p>If you want a longer FAQ on pricing, timeline, and who isn't a fit, see the homepage <a href="/#faq">FAQ</a>.</p>

<h2>Who this model fits — and who it doesn't</h2>
<p><strong>Fit:</strong> founders and operators who can decide what correct looks like, want a fixed scope, and care that the numbers or workflows are right.</p>
<p><strong>Not a fit:</strong> “build everything with no brief,” design-only retainers with no shipping, or projects that need a permanent large team instead of a scoped build.</p>

<h2>Book a call</h2>
<p>If you want scoped shipping — not vibe coding — <a href="/#contact">book a call</a>. Bring the product you want to ship and what “correct” means for you. I'll tell you whether AI-assisted delivery is a good fit and what a fixed next step looks like.</p>
`.trim(),
  },
  {
    title: "Wix or Squarespace to a custom Next.js site — when it's worth it",
    slug: "wix-squarespace-to-nextjs-when-its-worth-it",
    excerpt:
      "Outgrown your website builder? Here's when migrating to Next.js is worth it, what migrations actually cost, and when staying on Wix or Squarespace is the smarter call.",
    content: `
<p>A lot of businesses start on Wix or Squarespace for good reasons: speed, templates, and no developer required. Then growth shows up — more pages, more languages, harder forms, slower performance — and the builder starts fighting you.</p>
<p>Migrating to a custom Next.js site can fix that. It can also be an expensive distraction. Here's how I decide which side you're on.</p>

<h2>Symptoms you've outgrown a builder</h2>
<ul>
<li>Pages feel slow or fragile once content gets large</li>
<li>SEO and URL structure are hard to control</li>
<li>Forms need spam protection, CRM routing, or rate limits the builder doesn't give you cleanly</li>
<li>You need real localization (not pasted translations)</li>
<li>Marketing wants to edit content without breaking layout — and the builder's CMS is in the way</li>
<li>Ownership matters: you want the codebase, deploys, and data under your control</li>
</ul>
<p>If two or three of those are true and they're costing leads or time, migration is worth a serious look.</p>

<h2>Migration costs nobody mentions</h2>
<p>The redesign is the visible part. The expensive part is usually:</p>
<ul>
<li><strong>Content model</strong> — turning messy pages into a structure editors can maintain</li>
<li><strong>Redirects</strong> — so Google and bookmarks don't die</li>
<li><strong>CMS training</strong> — someone still has to update copy after launch</li>
<li><strong>Form pipelines</strong> — spam protection, Sheets/HubSpot, confirmation emails</li>
</ul>
<p>A honest quote includes those, not just “new homepage.”</p>

<h2>What a real migration can look like</h2>
<p>On <a href="/work/promise-surrogacy/">Promise Surrogacy</a>, the job was a full marketing rebuild from a legacy Wix export into Next.js: 46 routed pages, TinaCMS for editing, English/Spanish/Chinese, and hardened lead forms into Google Sheets and HubSpot.</p>
<p>That's the class of project where custom wins — not because Next.js is trendy, but because the product requirements outgrew a template site.</p>

<h2>When staying on Wix or Squarespace is the right call</h2>
<p>Stay if:</p>
<ul>
<li>You need a simple brochure site and the builder still feels fine day to day</li>
<li>Nobody on the team will maintain a CMS or deploy pipeline</li>
<li>Budget is better spent on ads, photography, or sales than on a rebuild</li>
</ul>
<p>Custom isn't a status symbol. It's a tool for when the constraints of a builder are the bottleneck.</p>

<h2>Migration checklist</h2>
<ol>
<li>Inventory pages, URLs, and what must redirect</li>
<li>Decide who edits content after launch (and with what CMS)</li>
<li>List form destinations (email, Sheets, HubSpot, etc.)</li>
<li>Define languages and what “localized” means for you</li>
<li>Pick analytics and keep measurement continuous across cutover</li>
<li>Ship in phases if needed — don't boil the ocean on day one</li>
</ol>
<p>For productized web apps beyond a marketing site, see <a href="/services/web-apps-saas/">web apps &amp; SaaS</a>.</p>

<h2>Book a call</h2>
<p>If you're on Wix or Squarespace and hitting walls, <a href="/#contact">book a call</a>. Bring your current platform and the biggest pain (speed, forms, languages, ownership). I'll tell you whether a Next.js rebuild is worth it — or whether you should stay put for now.</p>
`.trim(),
  },
  {
    title: "Building a booking website for a local venue",
    slug: "building-a-booking-website-for-a-local-venue",
    excerpt:
      "Messenger-only booking breaks when demand grows. Here's the minimum stack for a venue booking site — landing, availability, admin — with lessons from real venue builds.",
    content: `
<p>Most local venues start the same way: a Facebook page, a Messenger thread, and someone manually confirming slots. It works until it doesn't — double-bookings, slow replies, and customers who bounce because they can't see availability.</p>
<p>A booking website doesn't have to be a giant marketplace. For most venues it's a clear public site plus a path to reserve or inquire, and a way for staff to manage the day.</p>

<h2>Why Messenger-only booking breaks</h2>
<ul>
<li>No shared source of truth for open slots</li>
<li>Response time depends on who's online</li>
<li>You can't run ads into a dead-end chat inbox forever</li>
<li>Owners spend evenings re-typing the same answers</li>
</ul>
<p>When demand rises, the ops cost rises faster than revenue unless the booking path is structured.</p>

<h2>Minimum viable booking site</h2>
<p>For a local venue, the useful MVP is usually:</p>
<ul>
<li><strong>Landing</strong> — who you are, why book, proof</li>
<li><strong>Inquiry or live booking</strong> — form, calendar, or real-time slots</li>
<li><strong>Admin</strong> — see reservations, block maintenance, manage the day</li>
</ul>
<p>Everything else — memberships, POS, loyalty — can wait until the core path works.</p>

<h2>Live courts and a dashboard</h2>
<p><a href="/work/pickleball-pavilion/">The Pickleball Pavilion</a> is the live-booking end of the spectrum: scrollytelling marketing plus real-time court availability, online booking, and an admin dashboard so owners aren't managing the day in chat screenshots.</p>

<h2>Inquiry, AI Messenger, and tools you already use</h2>
<p><a href="/work/la-purisima-resort/">La Purisima Resort</a> is the inquiry-plus-automation pattern: a professional site with booking inquiries, a Messenger bot for common questions, and sync into Google Sheets and Calendar so the team stays in tools they already know.</p>
<p>Not every venue needs live slot locking on day one. Some need a trustworthy inquiry flow that doesn't lose leads. Both are valid — the scope should match how you actually sell.</p>

<h2>Build vs template vs marketplace widgets</h2>
<ul>
<li><strong>Templates</strong> — fine for brochure sites; weak when booking rules get specific</li>
<li><strong>Marketplace widgets</strong> — fast to embed; you trade fees, branding, and data ownership</li>
<li><strong>Custom</strong> — best when your rules, admin needs, or brand experience don't fit a widget</li>
</ul>
<p>More on this offer: <a href="/services/booking-websites/">booking websites</a>.</p>

<h2>Book a call</h2>
<p>If you run a venue, court, resort, or local service that should be bookable online, <a href="/#contact">book a call</a>. Tell me how you take bookings today and what breaks first. I'll help scope a landing + booking/inquiry + admin path that matches your ops — not a generic template.</p>
`.trim(),
  },
  {
    title:
      "Construction software that matches how PH contractors actually estimate",
    slug: "construction-software-ph-contractors-estimate",
    excerpt:
      "Generic AI calculators fail Philippine BOQ work. Here's what estimating software needs on real jobs — modules, PHP pricing, verification — from Konstru and related builds.",
    content: `
<p>On Philippine job sites, estimating often still means spreadsheets, chat threads, and a senior person who “just knows” the numbers. That works until a formula drifts, a crew changes, or a client asks for a clean Bill of Quantities they can trust.</p>
<p>Construction software only helps if it matches how contractors actually estimate — not a generic Western template with wrong units and wrong assumptions.</p>

<h2>How spreadsheet estimating fails on real jobs</h2>
<ul>
<li>Formulas get overwritten mid-project</li>
<li>Versions multiply across phones and laptops</li>
<li>Material breakdowns are incomplete or inconsistent</li>
<li>Nobody wants to hand a messy sheet to a client as a BOQ</li>
</ul>
<p>The risk isn't only time. It's looking precise when you're not.</p>

<h2>Why generic “AI calculator” prompts fail</h2>
<p>Asking an AI to “build a construction calculator” without a Philippine BOQ spec produces something that looks finished and calculates the wrong thing. Module order, inputs, and material rules have to come from the domain — not from a prompt.</p>
<p>That's why I start with the spec: which modules, what inputs, what output a contractor would actually hand over.</p>

<h2>Konstru: modules, PHP BOQ, product around the engine</h2>
<p><a href="/work/konstru/">Konstru</a> is a construction cost calculator SaaS built around that idea: 16+ modules (footing, columns, beams, walls, slabs, roofing, tiling, and more), bill-of-materials and BOQ output priced in PHP, plus auth, PayMongo subscriptions, and a dashboard so it's a product — not a one-off spreadsheet replacement.</p>
<p>The hard part wasn't the landing page. It was verifying each module against numbers you already trust before moving on.</p>

<h2>Adjacent ops: payroll on-site</h2>
<p>Estimating isn't the only spreadsheet pain. <a href="/work/pasahodph/">PasahodPH</a> is an offline-first Android payroll app for site crews — attendance, advances, overtime, live pay — because crew ops fail in the field the same way estimates fail in the office: disconnected tools and fragile manual process.</p>
<p>If you're digitizing a contractor business, pick the workflow that loses the most money or time first.</p>

<h2>What to scope first</h2>
<ol>
<li>The workflow that creates the most rework (estimate, BOQ, payroll, procurement)</li>
<li>The definition of correct for that workflow in your market</li>
<li>A thin product around it (auth, save/load, output a client can use)</li>
<li>Verification against real jobs before adding modules</li>
</ol>
<p>More on this niche: <a href="/services/construction-trades-software/">construction &amp; trades software</a>.</p>

<h2>Book a call</h2>
<p>If you're a contractor, estimator, or founder building trades software for the PH market, <a href="/#contact">book a call</a>. Bring the workflow you want digitized. I'll help scope a first module set and a definition of done you can verify — before anyone writes a generic calculator.</p>
`.trim(),
  },
];

function writeSql() {
  const now = new Date().toISOString();
  const lines = [
    "-- Blog ideas 2–5 as unpublished drafts.",
    "-- Run in Supabase SQL editor. Skips rows whose slug already exists.",
    "",
  ];

  for (const draft of drafts) {
    const tag = `d_${draft.slug.replace(/[^a-z0-9]+/g, "_").slice(0, 40)}`;
    lines.push(
      `insert into public.posts (title, slug, excerpt, content, published, updated_at)`,
    );
    lines.push(`select`);
    lines.push(`  $${tag}_t$${draft.title}$${tag}_t$,`);
    lines.push(`  $${tag}_s$${draft.slug}$${tag}_s$,`);
    lines.push(`  $${tag}_e$${draft.excerpt}$${tag}_e$,`);
    lines.push(`  $${tag}_c$${draft.content}$${tag}_c$,`);
    lines.push(`  false,`);
    lines.push(`  '${now}'::timestamptz`);
    lines.push(`where not exists (`);
    lines.push(
      `  select 1 from public.posts where slug = $${tag}_s$${draft.slug}$${tag}_s$`,
    );
    lines.push(`);`);
    lines.push("");
  }

  const out = join(process.cwd(), "docs", "seed-blog-drafts-2-5.sql");
  writeFileSync(out, lines.join("\n"), "utf8");
  console.log(`Wrote ${out}`);
}

async function seedSupabase() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!url || !key || url.includes("example.supabase")) {
    console.error(
      "Missing real Supabase credentials. Run with --sql and paste docs/seed-blog-drafts-2-5.sql in the Supabase SQL editor, or set NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.",
    );
    process.exit(1);
  }

  const supabase = createClient(url, key);

  for (const draft of drafts) {
    const { data: existing, error: lookupError } = await supabase
      .from("posts")
      .select("id, slug, published")
      .eq("slug", draft.slug)
      .maybeSingle();

    if (lookupError) {
      console.error(`Lookup failed for ${draft.slug}:`, lookupError.message);
      process.exitCode = 1;
      continue;
    }

    if (existing) {
      console.log(`Skip (exists): ${draft.slug} [${existing.id}]`);
      continue;
    }

    const { data, error } = await supabase
      .from("posts")
      .insert({
        title: draft.title,
        slug: draft.slug,
        excerpt: draft.excerpt,
        content: draft.content,
        published: false,
        updated_at: new Date().toISOString(),
      })
      .select("id, slug, published")
      .single();

    if (error) {
      console.error(`Insert failed for ${draft.slug}:`, error.message);
      process.exitCode = 1;
      continue;
    }

    console.log(
      `Inserted draft: ${data.slug} [${data.id}] published=${data.published}`,
    );
  }
}

const mode = process.argv.includes("--sql") ? "sql" : "seed";
if (mode === "sql") {
  writeSql();
} else {
  seedSupabase().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
