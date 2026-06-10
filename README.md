# InSync 🌿
### eat in sync with your cycle

A hormone-health food app for Indian women with PCOS, PCOD, PMS and mood swings. Search 500+ Indian foods with personalised scores, get AI-powered food advice in Hindi or English, and eat in sync with your cycle phase.

**Live app:** [insync-app.vercel.app](https://insync-app.vercel.app)

---

## What it does

- **Food search** — 500+ Indian foods each rated for PCOS, PCOD, PMS and mood swings out of 10, with glycemic index, inflammation score, cycle phase guide and 3 actionable hacks
- **AI chat** — ask anything in Hindi or English ("kya mai biryani kha sakti hu?") and get personalised answers based on your condition and cycle phase
- **Saved foods** — bookmark your hormone-friendly favourites
- **Meal log** — track what you eat daily
- **Editable profile** — set your condition (PCOS/PCOD/PMS) and current cycle phase so all advice is personalised to you

---

## Tech stack

### Frontend
| Tool | What it does |
|------|-------------|
| **Next.js 16** | React framework — handles routing, API routes, and server/client components |
| **React** | UI component library — all the interactive bits (search, filters, chat) |
| **Tailwind CSS** | Utility-first CSS — all styling is done with Tailwind classes, no separate CSS files |
| **TypeScript** | Typed JavaScript — catches bugs before they happen |
| **Lucide React** | Icon library — all the icons in the app |

### Backend / Database
| Tool | What it does |
|------|-------------|
| **Supabase** | PostgreSQL database in the cloud — stores all 534 Indian foods with their scores, hosts the API that the frontend queries |
| **Next.js API Routes** | Serverless functions — the `/api/chat` endpoint that sits between the frontend and Groq API |

### AI
| Tool | What it does |
|------|-------------|
| **Groq API** | Runs the LLM — powers the AI chat feature, extremely fast inference |
| **Llama 3.3 70B** | The actual AI model running on Groq — gives the food and hormone advice |
| **Groq (data pipeline)** | Used in the Python scripts to generate the food database |

### Data pipeline (Python scripts in `/harmonie` folder)
| Tool | What it does |
|------|-------------|
| **Python** | The data generation scripts |
| **Groq API + Llama 3.3 70B** | Generated PCOS/PCOD/PMS/mood scores for 534 Indian foods |
| **Supabase Python client** | Pushed the generated food data into the database |
| **python-dotenv** | Loads API keys from `.env` file |

### Deployment
| Tool | What it does |
|------|-------------|
| **Vercel** | Hosts the Next.js app — auto-deploys on every push to GitHub |
| **GitHub** | Version control — source code lives at `github.com/pragatikharat17/insync-app` |

---

## How the data was built

The food database wasn't manually researched — it was AI-generated:

1. **Script 1** (`1_generate_food_list.py`) — asked Groq to generate 25 Indian foods across 20 categories (breakfast, street food, mithai, regional dishes etc.) → got ~500 unique food names
2. **Script 2** (`2_generate_food_db.py`) — for each food, sent a structured prompt to Groq asking for glycemic index, insulin impact, inflammation score, PCOS/PCOD/PMS/mood scores, cycle phase guide, 3 hacks, best swap, and regional notes → saved as JSON
3. **Script 3** (`3_import_to_supabase.py`) — flattened the nested JSON and pushed all 534 foods into Supabase

---

## How the AI chat works

```
User types question
       ↓
Frontend sends POST to /api/chat
       ↓
API route builds a system prompt with user's condition + cycle phase
       ↓
Sends to Groq API (llama-3.3-70b-versatile) with streaming enabled
       ↓
Streams response back to frontend character by character
       ↓
User sees the answer appear in real time
```

The system prompt makes the AI behave like a knowledgeable desi older sister — warm, direct, Hindi/Hinglish-friendly, and always giving advice specific to the user's condition and current cycle phase.

---

## Project structure

```
insync-app/                  ← Next.js frontend
├── app/
│   ├── page.tsx             ← entry point
│   └── api/chat/route.ts    ← AI chat API route
├── components/
│   ├── harmonie-app.tsx     ← main app shell
│   ├── food-card.tsx        ← individual food card
│   ├── ask-view.tsx         ← AI chat UI
│   ├── tab-views.tsx        ← Saved, Log Meal, Profile screens
│   └── bottom-nav.tsx       ← bottom navigation
├── lib/
│   └── foods.ts             ← Supabase connection + data transform
└── .env.local               ← API keys (never committed)

harmonie/                    ← Python data pipeline (separate folder)
├── 1_generate_food_list.py
├── 2_generate_food_db.py
└── 3_import_to_supabase.py
```

---

## Environment variables

```
NEXT_PUBLIC_SUPABASE_URL=        # your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # Supabase anon/public key
GROQ_API_KEY=                    # Groq API key for AI chat
```

---

## Running locally

```bash
git clone https://github.com/pragatikharat17/insync-app.git
cd insync-app
npm install
# add your .env.local with the keys above
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Built by

Pragati — built in 2 days as a personal project to fill a genuine gap: no desi-specific, PCOS-aware food resource exists for Indian women. This app is for every girl who's been told "just eat healthy" without anyone explaining what that means for her hormones, her cycle, and her dal chawal.

🌿 *eat in sync with your cycle*
