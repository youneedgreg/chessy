# Chess Training Platform

> **Fast, minimalist chess training that teaches correct thinking through immediate correction and principled feedback.**

No accounts. No social noise. No dopamine tricks.  
Just you, the board, and the truth.

---

## Philosophy

This platform respects your intelligence. It teaches chess the way it should be taught:

- **Immediate feedback** on every move
- **Principle-based explanations** (not just "that's wrong")
- **Context-aware difficulty** that grows with you
- **Zero friction** — no signup walls, no tutorials, just play

If Magnus Carlsen used a training app, it would feel closer to this than anything flashy.

---

## Features

### Four Training Levels

#### 🟢 Beginner — *Guided Classical Training*
- Immediate move grading (brilliant → blunder)
- Best move shown with arrows
- Auto-displayed explanations
- Tactical danger warnings
- Evaluation bar visible
- Undo allowed
- Contextual micro-puzzles

**Tone**: Calm, instructional, firm.

---

#### 🔵 Intermediate — *Think First*
- Grading shown, explanations hidden by default
- Best move indicated (no arrows)
- Optional evaluation bar
- Limited undo
- Puzzles only for repeated mistakes

**Tone**: Neutral, restrained.

---

#### 🟠 Advanced — *Accountability Mode*
- No evaluation bar
- No arrows or hints
- Feedback delayed by 1 move
- Stronger engine play
- Manual review access only

**Tone**: Cold, serious.

---

#### 🔴 Professional — *Tournament Room*
- Zero feedback during play
- No undo
- Engine punishes instantly
- Full structured review only after game
- Pure simulation of tournament conditions

**Tone**: Silent. Respectful.

---

## Tech Stack

### Frontend
- **Next.js 14+** (App Router)
- **TypeScript** (strict mode)
- **React 18**
- **Zustand** for state management
- **Tailwind CSS** (dark-mode-first)

### Chess Engine
- **Stockfish WASM** running in Web Worker
- **chess.js** for move validation
- **react-chessboard** or **chessground** for board UI

### Explanation System
- **Rule-based principle engine** (v1)
- Maps engine evaluations + tactical patterns → clear feedback
- AI enhancement planned for future

---

## Performance Targets

| Action | Target Time |
|--------|-------------|
| Page load | < 1 second |
| Move legality check | Instant |
| Engine evaluation | < 100ms |
| Feedback render | Same frame |
| AI explanation (future) | Async |

**If feedback lags, users stop trusting it.**

---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/chessy.git
cd chessy

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
  /review        # Post-game analysis
  page.tsx       # Landing + level selection
/components
  ChessBoard.tsx
  FeedbackOverlay.tsx
  ExplanationDrawer.tsx
/engine
  stockfish.worker.ts
  evaluateMove.ts
/logic
  classifyMove.ts
  principles.ts
  tactics.ts
  explanations.ts
/state
  gameStore.ts
  levelConfig.ts
/styles
  globals.css
```

---

## Development Status

**Current Phase**: Foundation & Planning  
**First Playable**: Target 5-7 days  
**Full MVP**: Target 9-14 days

See [task.md](./task.md) for detailed checklist.  
See [implementation_plan.md](./implementation_plan.md) for technical roadmap.

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

- [x] Project planning
- [ ] Core engine integration
- [ ] Move classification system
- [ ] Level-based feedback
- [ ] Post-game review
- [ ] Puzzle extraction
- [ ] UI polish
- [ ] Performance optimization
- [ ] AI-enhanced explanations (future)

---

## License

MIT License - See [LICENSE](./LICENSE) for details.

---

## Acknowledgments

- **Stockfish** for the incredible open-source chess engine
- **lichess** for inspiration on clean, fast chess UX
- Classical chess coaches who taught principles over memorization

---

**Built for those who want to improve, not just play.**