# NayePankh Foundation — Website

A multi-page website built for NayePankh Foundation, a youth-led NGO in Uttar Pradesh, India providing food distribution, education access, menstrual health awareness, and clothing drives to underprivileged communities.

Built as a practical project submission covering the **Web Development**, **Vibe Coder**, and **AI Web Development** internship tracks.

## Live Site

`https://your-deployment-url.vercel.app` *(replace with your actual Vercel URL)*

## Tech Stack

- **Frontend:** Plain HTML5, CSS3, vanilla JavaScript (no framework, no build step)
- **Backend:** Vercel Serverless Functions (Node.js)
- **Database:** Neon (serverless Postgres)
- **AI:** Google Gemini 2.5 Flash API
- **Hosting:** Vercel

## Pages

| Page | File | Description |
|---|---|---|
| Home | `index.html` | Hero, mission statement, programs overview, stats, CTA |
| About | `about.html` | Origin story, timeline, mission/vision, values |
| Programs | `programs.html` | Detailed breakdown of all 4 programs, FAQ |
| Volunteer | `volunteer.html` | Volunteer registration form (writes to database) |
| Gallery | `gallery.html` | Visual showcase of program moments |
| Contact | `contact.html` | Contact form (writes to database) + donation info |

## Features

**Core**
- True multi-page site with shared navigation and footer across all pages
- Fully responsive design (mobile, tablet, desktop)
- Custom design system: warm sunrise palette, Fraunces/Inter typography, hand-drawn wing motif tying into the org's name ("new wings")

**Bonus / Advanced**
- Dark mode toggle with persistence (localStorage)
- Scroll-triggered reveal animations, animated stat counters, animated SVG wing illustration
- Mobile hamburger navigation
- FAQ accordion
- **Database integration:** Volunteer and Contact forms write directly to a Neon Postgres database via serverless API routes
- **AI chatbot ("Pankh"):** Floating chat widget on every page, powered by Gemini 2.5 Flash, with context about NayePankh's programs baked into the system prompt. Handles FAQ-style questions (volunteering, donating, programs) and general questions gracefully.

## Project Structure

```
nayepankh-site/
├── index.html
├── about.html
├── programs.html
├── volunteer.html
├── gallery.html
├── contact.html
├── package.json          # declares the `pg` dependency for Vercel
├── .gitignore
├── .env.example
├── css/
│   └── style.css         # shared design system + all page styles
├── js/
│   └── main.js           # nav, dark mode, animations, forms, chat widget logic
├── api/
│   ├── _db.js            # shared Neon/Postgres connection pool
│   ├── volunteer.js       # POST endpoint — inserts volunteer registrations
│   ├── contact.js         # POST endpoint — inserts contact messages
│   └── chat.js            # POST endpoint — proxies chat to Gemini API
└── images/                # placeholder for gallery photos
```

## Database Schema

```sql
CREATE TABLE volunteers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  program TEXT,
  availability TEXT,
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE contact_messages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Environment Variables

Set these in Vercel → Project Settings → Environment Variables (never commit real values):

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon Postgres connection string |
| `GEMINI_API_KEY` | Google Gemini API key |

See `.env.example` for the expected format.

## Local Development

This project uses Vercel serverless functions, so a plain static server won't run the `/api` routes. Use the Vercel CLI instead:

```bash
npm install -g vercel
vercel dev
```

This serves the site and runs the API routes locally, reading env vars from a local `.env` file.

## Deployment

1. Push to GitHub
2. Import the repo into Vercel
3. Add `DATABASE_URL` and `GEMINI_API_KEY` as environment variables
4. Deploy — Vercel auto-detects `package.json` and installs dependencies, and auto-detects the `api/` folder as serverless functions

## Credits

Built by Kanishak Jain as a practical project submission for the NayePankh Foundation internship program.
