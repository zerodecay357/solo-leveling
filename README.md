# SoloRise ⚔️

A Solo Leveling-inspired life RPG. Turn gym, swimming, looksmaxing and study into
**quests**, earn **XP**, climb **ranks (E→S)**, keep **streaks** alive, and chat with
**The System** (Claude API) to reshape your quests by voice/text.

## Quick start (local)

```bash
# Terminal 1 — backend
cd server
npm install
cp .env.example .env        # paste your real ANTHROPIC_API_KEY
npm start                   # http://localhost:8787

# Terminal 2 — frontend
npm install
npm run dev                 # http://localhost:5173
```

Open http://localhost:5173. The chat tab talks to the backend, which holds the key.

## Build for production

```bash
npm run build               # outputs dist/
npm run preview             # test the production build
```

## Install on iPhone (PWA — no App Store needed)

1. Deploy frontend (Vercel) + backend (Render). See planning.md §8.
2. On your iPhone open the deployed URL in **Safari**.
3. Tap **Share → Add to Home Screen**. SoloRise installs like a native app,
   runs fullscreen, and works offline (quest data is stored on-device).

## Native iOS (App Store, optional)

```bash
npm i @capacitor/core @capacitor/cli @capacitor/ios
npx cap init SoloRise com.you.solorise --web-dir=dist
npm run build && npx cap add ios && npx cap sync
npx cap open ios            # opens Xcode → run on device / archive → App Store
```
Requires a Mac with Xcode + Apple Developer account ($99/yr).

## Where things live
- `src/store/useGameStore.ts` — all game state, XP/streak logic (persisted).
- `src/lib/ranks.ts` — rank thresholds + XP curve.
- `src/components/SystemChat.tsx` — Claude chat + applies tool calls.
- `server/index.js` — Express proxy → Claude API with quest-editing tools.

Configuration via chat: try *"add a 10-minute meditation quest every morning"* or
*"make my gym quest a Boss difficulty"*.
