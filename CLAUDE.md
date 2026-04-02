# JSU Marketing — Project Reference

## Tech Stack

- **Static site generator:** Eleventy (11ty) v3 — input `HTML/`, output `_site/`, template engine: Liquid
- **Backend:** PHP (`FormReplies.php`) handles contact form submissions
- **Database/Auth:** Supabase (JS client loaded via CDN on every page)
- **Icons:** Font Awesome 7 (via kit CDN)
- **Analytics:** Google Analytics 4 (`G-7TG81TYTKP`)
- **No build pipeline** beyond Eleventy — plain CSS/JS, no bundler

## Project Structure

```
/
├── HTML/               # Source pages (Eleventy input)
├── _includes/
│   └── base.html       # Shared layout — head, nav, footer
├── CSS/                # One stylesheet per page
├── JS/                 # One script per page
├── Photos/             # Images (JPG/WebP/PNG/AVIF)
├── Videos/             # MP4 reels and tutorial videos
├── _site/              # Built output (auto-generated, don't edit)
├── .eleventy.js        # Eleventy config
├── sitemap.xml         # Manually maintained
├── robots.txt          # Blocks /admin/, /private/, /Login-Page/
└── FormReplies.php     # Contact form handler
```

## Pages

| File | URL | Notes |
|---|---|---|
| `index.html` | `/` | Homepage — hero, services overview, about |
| `Services.html` | `/Services/` | Service cards — website creation + social media |
| `Team.html` | `/Team/` | Team bios (Jack, Sean, Ultan) + why choose us |
| `Past-Projects.html` | `/Past-Projects/` | Portfolio — client websites + social media reels |
| `Testimonials.html` | `/Testimonials/` | 5 client reviews with JSON-LD schema |
| `Contact.html` | `/Contact/` | Contact form → `FormReplies.php` |
| `Get-a-qoute.html` | `/Get-a-qoute/` | Quote calculator (multi-step form, mailto CTA) — note: URL is misspelled |
| `Login-Page.html` | `/Login-Page/` | Customer portal (noindex) |
| `Admin-Access.html` | `/Admin-Access/` | Video tutorials for clients (noindex) |

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
- Organization JSON-LD schema on all pages

## Supabase Setup

**Project URL:** `https://zluprfqjvlelcvoeqpnx.supabase.co`
**Key:** stored in plaintext in `JS/Login-Page.js` (publishable/anon key)

**Tables used:**

| Table | Columns (observed) | Used by |
|---|---|---|
| `clients` | `id`, `website_url` | Login-Page.js — loads client's website link |
| `invoices` | `client_id`, `invoice_url`, `status`, `created_at` | Login-Page.js — invoice list |
| `requests` | `client_id`, `message`, `status`, `response`, `response_date`, `created_at` | Login-Page.js — submit & view requests |

**Auth:** Supabase email/password auth. Session is checked on page load; if valid, dashboard is shown directly without re-login. The client is instantiated once and stored on `window.supabaseClient` to avoid duplicate instances.

## CSS/JS Conventions

- Each page has its own CSS file in `/CSS/` and JS file in `/JS/`, named to match the page
- `header_style.css` is loaded on every page via `base.html`
- `Services.html` and `Team.html` use large inline `<style>` blocks instead of external CSS files
- Fonts used: Tinos (serif, Google Fonts) and Momo Signature (cursive) — loaded via `@font-face` in page CSS

## Known Issues / Notes

- **Misspelled URL:** Quote page is `/Get-a-qoute/` (typo). The filename, nav link, and sitemap all use this spelling consistently — don't "fix" one without fixing all three.
- **Get-a-quote.js:** Switch statement still checks for `"Resturant/Cafe"` (old typo) — if the HTML option text is ever corrected, this JS must be updated to match.
- **No git repo** — project is stored locally only, no version control.
- **FormReplies.php** — contact form posts here; expects `form_type=contact_form` in the body and returns the string `success` on success.
