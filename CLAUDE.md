# Morocco Ready — CLAUDE.md

## What This Is
A mobile-first Darija (Moroccan Arabic) learning app for Scott & Kellie Griffiths ahead of a trip to Morocco. Built for rapid practical learning, not academic study. Deployed at morocco.tandemleap.com.

## Stack
- **Next.js 16 (App Router)** + TypeScript + Tailwind
- **Vercel** — auto-deploys from GitHub on push to main
- **Anthropic API** (Claude Haiku) — AI conversation practice
- **Azure Cognitive Services** — TTS using `ar-MA-JamalNeural` (Moroccan Arabic)
- **Web Speech API** — speech recognition (mic input), browser-native
- **localStorage** — all user progress stored client-side, no database

## Repo
github.com/tandemleap/arabic

## Environment Variables
```
ANTHROPIC_API_KEY=...
AZURE_SPEECH_KEY=...
AZURE_SPEECH_REGION=eastus
```

## Architecture

### No database
Progress is stored in localStorage keyed by user token. No Supabase, no accounts.

### Token system
- Landing page (`/`) — enter your name, generates a token like `scott-abc123`
- Stored in localStorage under `morocco_users`
- Personal URL: `/u/[token]`
- Scott's token and Kellie's token are independent learning paths

### Routes
```
/                           Landing — name entry, token generation/resume
/u/[token]                  Dashboard — category grid, progress, up-next nudge
/u/[token]/category/[slug]  Flashcard mode for a category
/u/[token]/practice         AI conversation practice with Youssef
/api/practice               Streaming Claude Haiku API route
/api/tts                    Azure TTS API route (returns MP3 audio)
```

## Phrase Data
All phrases are hardcoded in `data/phrases.ts`. No CMS, no database.

### Categories (in tier order)
| Slug | Tier | Description |
|---|---|---|
| greetings | essential | Social glue, greetings, farewells |
| numbers | essential | Numbers, money, haggling |
| food | core | Restaurant, ordering, compliments |
| getting-around | core | Taxi, directions, medina navigation |
| shopping | core | Souk phrases, negotiating |
| riad | good-to-have | Hotel/riad check-in phrases |
| surprise | surprise | Slang, music, off-the-map phrases |

Each phrase has: `id`, `arabic` (script), `romanized`, `english`, optional `mnemonic`, optional `bonus` flag.

## Teaching Philosophy
Tim Ferriss-inspired rapid learning:
- **Tiered prioritization** — Essential first, not alphabetical or random
- **Pattern frames** — "Ana bghit [X]" taught once, fill in anything
- **Mnemonic hooks** — every hard phrase has a memory trick
- **Surprise Them category** — local slang, music (Gnawa/Chaabi), off-tourist-path phrases
- No rigid day-by-day schedule — user browses freely but dashboard nudges toward highest priority

## Audio
- **TTS**: Azure `ar-MA-JamalNeural` via `/api/tts`. Falls back to browser Web Speech API if Azure not configured.
- **STT**: Browser Web Speech API. Works best in Safari (iOS) or Chrome desktop.
- Flashcards auto-speak on flip; "Hear it" / "Say it" buttons shown after flip
- Practice chat: Youssef auto-speaks when streaming completes; tap any Darija line to replay; Slow/Normal/Fast speed control

## AI Practice (Youssef)
- Character: warm, funny Moroccan local in his 30s, loves Gnawa music and showing real Morocco
- Responds in Darija (romanized) with Arabic script in parentheses + English translation
- 6 scenarios: café, souk, live music night, taxi, riad check-in, off the map
- Streaming response via Claude Haiku
- Anthropic requires at least 1 message — empty messages array is seeded with `"Start the scenario."`

## Key Files
```
data/phrases.ts              All Darija phrase content
lib/progress.ts              localStorage read/write utilities
lib/speech.ts                speakArabic() + startListening()
app/api/tts/route.ts         Azure TTS endpoint
app/api/practice/route.ts    Claude Haiku streaming chat endpoint
app/page.tsx                 Landing page
app/u/[token]/page.tsx       Dashboard
app/u/[token]/category/[slug]/page.tsx   Flashcard UI
app/u/[token]/practice/page.tsx          AI practice chat
```

## Adding Phrases
Edit `data/phrases.ts`. Add to an existing category's `phrases` array or create a new category. Redeploy.

## Users
- **Scott** — Program Director, SPARK youth programs, Ashland WI
- **Kellie** — Scott's wife, traveling together to Morocco
- Both use independent tokens on the same app
