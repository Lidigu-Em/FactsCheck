#   News CheckFacts — Next.js Frontend

Bilingual (English 🇬🇧 & Kiswahili 🇹🇿) fact-checking portal inspired by [Congo Check MpoxFacts](https://congocheck.net/category/actus/fact-check/mpoxfacts/).

## Tech Stack

| Layer      | Tech                                   |
|------------|----------------------------------------|
| Framework  | Next.js 14 (App Router, RSC)           |
| Styling    | Tailwind CSS 3                         |
| Markdown   | react-markdown + remark-gfm            |
| Icons      | lucide-react                           |
| CMS        | Strapi 4 (optional, falls back to seed)|
| Languages  | English (`en`), Kiswahili (`sw`)       |

## Routes

| URL                              | Description                    |
|----------------------------------|--------------------------------|
| `/en/mpoxfacts`                  | MpoxFacts hub (English)        |
| `/sw/mpoxfacts`                  | MpoxFacts hub (Kiswahili)      |
| `/en/fact-check/[slug]`          | Article detail with ClaimReview|
| `/sw/fact-check/[slug]`          | Article detail (Kiswahili)     |
| `/en/report`                     | Report a rumor form            |
| `/sw/report`                     | Ripoti Uvumi form              |
| `/en/about`                      | About & methodology            |
| `/sw/about`                      | Kuhusu sisi na mbinu           |

## Getting Started

```bash
npm install
npm run dev
# → Open http://localhost:3000  (auto-redirects to /en/mpoxfacts)
```

## Connecting to Strapi CMS

Set environment variables in `.env.local`:

```env
NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_API_TOKEN=your_api_token_here
```

When `NEXT_PUBLIC_STRAPI_API_URL` is set, the frontend fetches live data from Strapi with `locale=en` or `locale=sw`. Without it, all content is served from the built-in seed data in `src/data/seed.json`.
