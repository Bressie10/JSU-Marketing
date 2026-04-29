# JSU Marketing — Project Reference

## Tech Stack

- **Static site generator:** Eleventy (11ty) v3 — input `HTML/`, output `_site/`, template engine: Liquid
- **Backend:** PHP (`FormReplies.php`) handles contact form submissions, quote leads, and portal notifications
- **Email delivery:** Resend API (key: `re_fmaxR1EW_KoL3dg41x5Yn6HRaCmqL68Kk`, from: `noreply@jsumarketing.com`) — used for all transactional email
- **Database/Auth:** Supabase (JS client `@supabase/supabase-js@2` loaded via CDN on every page)
- **Icons:** Font Awesome 7 (kit CDN: `kit.fontawesome.com/7af9aca289.js`)
- **Analytics:** Google Analytics 4 (`G-7TG81TYTKP`)
- **No build pipeline** beyond Eleventy — plain CSS/JS, no bundler

## Project Structure

```
/
├── HTML/               # Source pages (Eleventy input)
├── _includes/
│   └── base.html       # Shared layout — head, nav, footer, scripts
├── CSS/                # One stylesheet per page (plus header_style.css)
├── JS/                 # Per-page scripts (not every page has one)
├── Photos/             # Images (JPG/WebP/PNG/AVIF)
├── Videos/             # MP4 reels and tutorial videos
├── icons/              # SVG icons (currently unused)
├── _site/              # Built output (auto-generated, don't edit)
├── .eleventy.js        # Eleventy config — passthrough copies all asset folders
├── sitemap.xml         # Manually maintained
├── robots.txt          # Blocks /admin/, /private/, /Login-Page/
├── FormReplies.php     # Multi-purpose form/notification handler
└── followup-cron.php   # Daily cron job for quote lead follow-up emails
```

## Pages

| File | URL | CSS | JS | Notes |
|---|---|---|---|---|
| `index.html` | `/` | `style.css` | *(none)* | Homepage — hero, services overview, about |
| `Services.html` | `/Services/` | inline `<style>` block | — | Service cards — website creation + social media |
| `Team.html` | `/Team/` | inline `<style>` block | — | Team bios (Jack, Sean, Ultan) + why choose us |
| `Past-Projects.html` | `/Past-Projects/` | `Past-Projects.css` | `Past-Projects.js` | Portfolio — client websites + social media reels |
| `Testimonials.html` | `/Testimonials/` | `style2.css` | — | 5 client reviews with JSON-LD schema |
| `Contact.html` | `/Contact/` | — | — | Contact form → `FormReplies.php` |
| `Get-a-qoute.html` | `/Get-a-qoute/` | `Get-a-quote.css` | `Get-a-quote.js` | Quote calculator — multi-step form, lead capture, saves to Supabase `leads` table — URL is misspelled |
| `Login-Page.html` | `/Login-Page/` | `Login-page.css` | `Login-Page.js` | Customer portal (noindex) |
| `Admin-Access.html` | `/Admin-Access/` | `Admin-Access.css` | `Admin_Access.js` | Video tutorials for clients (noindex) |

## Templating Pattern

Every page uses Eleventy front matter to pass data into `base.html`:

```yaml
---
title: Page Title
layout: base.html
page_css: /CSS/page.css
page_js: /JS/page.js
page_description: "..."
page_keywords: "..."
og_title: "..."
og_description: "..."
og_image: "https://jsumarketing.com/Photos/image.jpg"  # optional override
noindex: true   # omit for indexable pages
is_contact_page: true   # activates LocalBusiness schema
is_services_page: true  # activates Service schema
---
```

`base.html` conditionally injects:
- LocalBusiness JSON-LD schema on contact page
- Service JSON-LD schema on services page
- Organization JSON-LD schema on all pages (always)
- Supabase CDN script on every page (even pages that don't use it)

## Navigation

The nav is implemented in `base.html` as a CSS checkbox toggle (hidden `<input type="checkbox" id="nav-check">`). Dropdown menus open via `.has-dropdowns.active` class toggled by inline JS at the bottom of `base.html`. There is no separate nav JS file.

## Quote Calculator & Lead Capture (`Get-a-qoute.html`)

Multi-step flow:
1. User picks business name + type → clicks Submit
2. User picks business size + budget → clicks Submit
3. Price box appears showing package name + website/social features in accordions
4. User enters their **name and email**, clicks **Get My Quote**
5. JS validates, inserts a row to the `leads` Supabase table, then POSTs to `FormReplies.php?form_type=quote_lead`
6. PHP sends a team notification to `jsumarketingteam@gmail.com` and a personalised confirmation email to the lead via Resend

**`Get-a-quote.js` data objects (do not modify):**
- `socialTiers` — social media features per package tier (Starter/Growth/Pro/Scale)
- `websitePackages` — website features per business type per tier (22 business types)
- `sizeToPackage` — maps business size (Small/Medium/Large/Franchise) to tier name

## Follow-Up Sequence (`followup-cron.php`)

Designed to run as a daily cron job (Hostinger hPanel → Cron Jobs):

```
0 9 * * * /usr/bin/php /home/USERNAME/domains/jsumarketing.com/public_html/followup-cron.php
```

| Stage | Trigger | Email sent |
|---|---|---|
| 0 → 1 | `created_at` ≥ 2 days ago | "Still interested?" email with package details |
| 1 → 2 | `last_contacted_at` ≥ 5 days ago | Final "limited availability" email |

Updates `follow_up_stage` and `last_contacted_at` in Supabase via REST API using the service role key. Appends a log line to `followup-log.txt` for every send.

## FormReplies.php — Form Types

The handler dispatches on `$_POST['form_type']`:

| `form_type` | Trigger | Email method | Sent to |
|---|---|---|---|
| `quote_lead` | Lead submits quote form | Resend API | Team notification to `jsumarketingteam@gmail.com` + confirmation to lead |
| `new_request` | Client submits a portal request | Resend API | `jsumarketingteam@gmail.com` |
| `post_review` | Client approves/declines a social post | Resend API | `jsumarketingteam@gmail.com` |
| *(absent)* | Contact page form submission | PHP `mail()` | `jsumarketingteam@gmail.com` + confirmation to user |

The contact form path expects fields: `full_name`, `email`, `phone`, `message`.

## Supabase Setup

**Project URL:** `https://zluprfqjvlelcvoeqpnx.supabase.co`
**Anon/publishable key:** `sb_publishable_0ldJX2nH9zngplwZKU6AKQ_pobyL6sI` — stored in `JS/Login-Page.js` and `JS/Get-a-quote.js` (safe to expose client-side)
**Service role key:** stored in `followup-cron.php` only — never expose client-side

**Tables used:**

| Table | Key columns | Used by |
|---|---|---|
| `clients` | `id`, `website_url`, `client_type` | Login-Page.js — loads website link; `client_type` controls which dashboard cards are shown |
| `invoices` | `client_id`, `invoice_url`, `status`, `created_at` | Login-Page.js — invoice list |
| `requests` | `client_id`, `message`, `status`, `response`, `response_date`, `created_at` | Login-Page.js — submit & view requests |
| `social_posts` | `id`, `client_id`, `platform`, `caption`, `image_url`, `scheduled_for`, `status`, `client_notes`, `reviewed_at` | Login-Page.js — pending post approval workflow |
| `leads` | `id`, `name`, `email`, `business_name`, `business_type`, `business_size`, `package_name`, `website_features` (text[]), `social_features` (text[]), `created_at`, `follow_up_stage` (int, default 0), `last_contacted_at` | Get-a-quote.js insert; followup-cron.php reads + updates |

**`clients.client_type` values:** `"website"`, `"social_media"`, or `"both"` — controls which dashboard cards (`websiteCard`, `postsCard`) are visible.

**`social_posts.status` values:** `"pending_approval"` (shown to client), `"approved"`, `"declined"`.

**`leads` RLS:** anon INSERT allowed (for public quote form); service role bypasses RLS for cron reads/updates.

**Auth:** Supabase email/password auth. On page load, the existing session is checked — if valid, the dashboard loads directly without re-login. The client is instantiated once and stored on `window.supabaseClient` to avoid duplicate instances.

## CSS/JS Conventions

- Each page has its own CSS file in `/CSS/` named to match the page (lowercase, hyphenated)
- `header_style.css` is loaded on every page via `base.html` — contains header, nav, dropdown, footer, and mobile overflow fixes
- `Services.html` and `Team.html` use large inline `<style>` blocks instead of external CSS files
- `style2.css` is used by Testimonials
- Brand colors: **black** background, **gold** (`#FFD700`) accents throughout
- Fonts: `tinos-bold-italic` for headings, `momo-signature-regular` for body — loaded via `@font-face` in page CSS (not Google Fonts CDN)
- Responsive breakpoints in `header_style.css`: mobile sidebar nav triggers at `max-width: 1024px`

## Known Issues / Notes

- **Misspelled URL:** Quote page is `/Get-a-qoute/` (typo). The filename, nav link, and sitemap all use this spelling consistently — don't "fix" one without fixing all three.
- **Dead hamburger code in Get-a-quote.js:** References `hamburger` and `mobileNav` IDs that don't exist — leftover from old nav. Does not throw errors but is unreachable.
- **FormReplies.php contact form uses `mail()`:** Unlike the portal/quote notifications (Resend), the contact form falls through to PHP's `mail()`. Deliverability may vary by server config.
- **PHP version:** `followup-cron.php` and `FormReplies.php` require PHP 7.4+. Verify in Hostinger hPanel → PHP Configuration.
- **Resend sending domain:** Emails send from `noreply@jsumarketing.com`. The domain must be verified in the Resend dashboard or all emails will fail silently.
- **Local dev:** Eleventy's dev server does not execute PHP. `FormReplies.php` will be served as raw text locally — test email functionality on the live Hostinger server only.
- **Git repo:** Hosted at `github.com/Bressie10/JSU-Marketing` on branch `master`.
