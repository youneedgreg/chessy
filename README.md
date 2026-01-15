# Chessy

> **Fast, minimalist chess training that teaches correct thinking through immediate correction and principled feedback.**

No accounts. No social noise. No dopamine tricks.
Just you, the board, and the truth.

---

## Philosophy

This platform respects your intelligence. It teaches chess the way it should be taught:

* **Immediate feedback** on every move
* **Principle-based explanations** (not just "that's wrong")
* **Context-aware difficulty** that grows with you
* **Zero friction** — no signup walls, no tutorials, just play

If Magnus Carlsen used a training app, it would feel closer to this than anything flashy.

---

## Features

### Four Training Levels

#### 🟢 Beginner — *Guided Classical Training*

* ✅ Immediate move grading (brilliant → blunder)
* ✅ Best move shown with arrows
* ✅ Auto-expanded explanations with calm motivational tone
* ✅ Tactical danger warnings
* ✅ Evaluation bar always visible
* ✅ Undo allowed
* Opening detection with names displayed

**Tone**: Calm, instructional, firm.

---

#### 🔵 Intermediate — *Think First*

* ✅ Grading shown in collapsible panel (collapsed by default)
* ✅ Click to expand for full explanations
* ✅ No best move arrows
* ✅ Toggle-able evaluation bar (Settings in sidebar)
* ✅ Limited undo
* Opening detection enabled

**Tone**: Neutral, restrained.

---

#### 🟠 Advanced — *Accountability Mode*

* ✅ No evaluation bar
* ✅ No arrows or hints
* ✅ **Delayed feedback** — see your move grade only after opponent replies
* ✅ Grade-only display (no explanations)
* ✅ Stronger engine play
* No undo allowed

**Tone**: Cold, serious.

---

#### 🔴 Silent — *Tournament Room*

* ✅ Zero feedback during play
* ✅ No undo
* ✅ Strongest engine settings
* ✅ Full structured review only after game
* Pure simulation of tournament conditions

**Tone**: Silent. Respectful.

---

### Game Export

* ✅ **PGN Export** with standard annotations (NAGs like `?`, `!!`)
* ✅ **JSON Export** for full game state and debugging
* ✅ Evaluation comments (`[%eval 0.5]`) in PGN
* ✅ Compatible with Lichess, Chess.com, and other chess software

### Post-Game Review

* ✅ Interactive move-by-move replay
* ✅ Full analysis data and explanations
* ✅ Move grading and tactical flags
* ✅ Export game data (PGN/JSON)

---

## Tech Stack

### Frontend

* **Next.js 16** (App Router with Turbopack)
* **TypeScript** (strict mode)
* **React 18**
* **Zustand** for state management
* **Tailwind CSS** (dark-mode-first with glassmorphism)

### Chess Engine

* **Stockfish WASM** running in Web Worker
* **chess.js** for move validation and game logic
* **react-chessboard** for board UI with custom arrow overlays

### Explanation System

* **Rule-based principle engine**
* Maps engine evaluations + tactical patterns → clear feedback
* Context-aware based on game phase (opening/middlegame/endgame)

### Deployment

* **Docker** containerization
* Production builds optimized with Next.js static export

---

## Performance Targets

| Action              | Target Time | Status     |
| ------------------- | ----------- | ---------- |
| Page load           | < 1 second  | ✅ Achieved |
| Move legality check | Instant     | ✅ Achieved |
| Engine evaluation   | < 100ms     | ✅ Achieved |
| Feedback render     | Same frame  | ✅ Achieved |

**If feedback lags, users stop trusting it.**

---

## Quick Start

### Using Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/youneedgreg/chessy.git
cd chessy

# Build and run with Docker Compose
docker compose up --build

# Open in browser
http://localhost:3000

# Stop container
Ctrl+C
```

> Hot reload is enabled in development; any changes you make locally will update automatically in the container.

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

---

## Project Structure

```
/app
  /play          # Main game interface
  page.tsx       # Landing + level selection
/components
  ChessBoard.tsx
  FeedbackPanel.tsx
  PostGameReview.tsx
  EvaluationBar.tsx
/engine
  stockfish.worker.ts
  types.ts
/logic
  classifyMove.ts
  principles.ts
  explanations.ts
  arrows.ts
  export.ts      # PGN/JSON generation
/store
  gameStore.ts
  types.ts
/styles
  globals.css
```

---

## Development Status

**Current Phase**: Beta — Core Features Complete
**Status**: Playable with all difficulty levels implemented

### Completed Features

* ✅ Stockfish engine integration
* ✅ Move classification system
* ✅ Level-based feedback (Beginner, Intermediate, Advanced, Silent)
* ✅ Delayed feedback for Advanced level
* ✅ Collapsible feedback panels
* ✅ Post-game review with interactive replay
* ✅ Game export (PGN/JSON)
* ✅ Opening detection
* ✅ Evaluation bar with toggle
* ✅ Best move arrows (Beginner only)
* ✅ Docker deployment

---

## Contributing

We welcome contributions that align with the project's philosophy of **speed, clarity, and respect for the player's intelligence**.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## Design Principles

1. **Respect the player's intelligence** — No hand-holding, no gamification
2. **Teach by consequence** — Show why moves fail, not just that they fail
3. **Hide complexity** — Fast, clean UI with zero cognitive overhead
4. **Fast feedback beats clever features** — Performance is a feature
5. **Old principles, modern delivery** — Classical chess wisdom, contemporary UX

---

## Roadmap

### Completed ✅

* [x] Project planning
* [x] Core engine integration
* [x] Move classification system
* [x] Level-based feedback (4 difficulty levels)
* [x] Post-game review with export
* [x] UI polish (glassmorphism, dark mode)
* [x] Docker deployment

### In Progress 🚧

* [ ] Performance optimization
* [ ] Extended opening book
* [ ] Mistake pattern recognition

### Future 🔮

* [ ] AI-enhanced explanations
* [ ] Personalized training plans
* [ ] Spaced repetition for mistakes
* [ ] Mobile app (React Native)

---

## License

MIT License - See [LICENSE](./LICENSE) for details.

---

## Acknowledgments

* **Stockfish** for the incredible open-source chess engine
* **lichess** for inspiration on clean, fast chess UX
* Classical chess coaches who taught principles over memorization

---

**Built for those who want to improve, not just play.**
