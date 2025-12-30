# Chess Training Platform - Implementation Roadmap

A fast, minimalist chess training platform focused on immediate correction and principled feedback. No accounts, no friction—pure learning.

---

## User Review Required

> [!IMPORTANT]
> **Explanation System Alternative**: Since AI integration is deferred, I'm proposing a **rule-based explanation system** that maps engine evaluations + tactical patterns to pre-written principle-based feedback. This will maintain quality while staying fast and deterministic.

> [!IMPORTANT]
> **Board Component Choice**: Recommend **react-chessboard** (simpler integration) or **chessground** (more control, what lichess uses). Please confirm preference or I'll default to react-chessboard for speed.

> [!NOTE]
> **Development Approach**: Building in phases allows testing each layer independently. Estimated 11 phases, with Phases 1-7 creating a functional MVP. Phases 8-11 add polish and advanced features.

---

## Proposed Changes

### Phase 1: Project Foundation

**Goal**: Set up Next.js project with proper structure and base configuration

#### [NEW] [package.json](file:///c:/Users/polyo/Desktop/chessy/package.json)
- Next.js 14+ with App Router
- TypeScript configuration
- Dependencies: `chess.js`, `zustand`, `stockfish.js`, `react-chessboard` or `chessground`
- Tailwind CSS for styling

#### [NEW] [tailwind.config.ts](file:///c:/Users/polyo/Desktop/chessy/tailwind.config.ts)
- Dark-mode-first configuration
- Custom design tokens (subtle colors, system fonts)
- Performance optimizations

#### [NEW] [tsconfig.json](file:///c:/Users/polyo/Desktop/chessy/tsconfig.json)
- Strict TypeScript configuration
- Path aliases for clean imports

**Directory Structure**:
```
/app
  /play/page.tsx           # Main game interface
  /review/page.tsx         # Post-game analysis
  layout.tsx               # Root layout
  page.tsx                 # Landing + level selection
/components
  ChessBoard.tsx           # Board wrapper
  FeedbackOverlay.tsx      # Move feedback UI
  ExplanationDrawer.tsx    # Principle explanations
  EvaluationBar.tsx        # Position eval bar
  MoveHistory.tsx          # Game moves list
/engine
  stockfish.worker.ts      # Web Worker wrapper
  evaluateMove.ts          # Engine analysis
  types.ts                 # Engine types
/logic
  classifyMove.ts          # Grade moves (brilliant → blunder)
  principles.ts            # Chess principle library
  tactics.ts               # Tactical pattern detection
  explanations.ts          # Rule-based explanation generator
/state
  gameStore.ts             # Zustand game state
  levelConfig.ts           # Level-specific settings
/lib
  constants.ts             # Game constants
  utils.ts                 # Helpers
/styles
  globals.css              # Base styles
```

---

### Phase 2: Chess Engine Integration

**Goal**: Integrate Stockfish WASM running in Web Worker for <100ms evaluations

#### [NEW] [engine/stockfish.worker.ts](file:///c:/Users/polyo/Desktop/chessy/engine/stockfish.worker.ts)
- Initialize Stockfish WASM instance
- Handle UCI protocol communication
- Support position evaluation with configurable depth
- Multi-PV mode for showing alternative lines
- Expose clean async API for main thread

#### [NEW] [engine/evaluateMove.ts](file:///c:/Users/polyo/Desktop/chessy/engine/evaluateMove.ts)
- Analyze position before/after move
- Calculate evaluation delta (centipawn loss)
- Determine best move(s)
- Return tactical flags (fork, pin, skewer, discovered attack, etc.)
- Performance target: <100ms per evaluation

#### [NEW] [engine/types.ts](file:///c:/Users/polyo/Desktop/chessy/engine/types.ts)
```typescript
interface EngineEvaluation {
  bestMove: string;
  evaluation: number;  // centipawns
  depth: number;
  multiPV?: string[];  // alternative moves
  mate?: number;       // moves to mate
}

interface MoveAnalysis {
  playerMove: string;
  engineBestMove: string;
  evalBefore: number;
  evalAfter: number;
  evalDelta: number;
  tacticalFlags: TacticalFlag[];
}
```

---

### Phase 3: Core Chess Logic

**Goal**: Build move classification and principle detection system

#### [NEW] [logic/classifyMove.ts](file:///c:/Users/polyo/Desktop/chessy/logic/classifyMove.ts)
- Grade moves based on eval delta:
  - **Brilliant**: Eval improvement + tactical gain
  - **Good**: Within 10 centipawns of best
  - **Inaccuracy**: 10-50 centipawns lost
  - **Mistake**: 50-100 centipawns lost
  - **Blunder**: 100+ centipawns lost or piece hung
- Context-aware (opening, middlegame, endgame)

#### [NEW] [logic/principles.ts](file:///c:/Users/polyo/Desktop/chessy/logic/principles.ts)
- Library of chess principles:
  - **Opening**: Control center, develop pieces, king safety
  - **Middlegame**: Piece coordination, pawn structure, weak squares
  - **Endgame**: King activity, passed pawns, opposition
  - **Tactics**: Pins, forks, skewers, discovered attacks
- Each principle has example explanations

#### [NEW] [logic/tactics.ts](file:///c:/Users/polyo/Desktop/chessy/logic/tactics.ts)
- Pattern matching for common tactics:
  - Detect pins, forks, skewers
  - Identify hanging pieces
  - Check for back rank weaknesses
  - Spot discovered attacks
- Returns tactical flags for explanation system

#### [NEW] [logic/explanations.ts](file:///c:/Users/polyo/Desktop/chessy/logic/explanations.ts)
**Rule-based explanation generator** (AI alternative):
```typescript
function generateExplanation(
  moveAnalysis: MoveAnalysis,
  position: Chess,
  level: Level
): Explanation {
  // Map eval delta + tactical flags + position context
  // to principle-based feedback
  
  // Example: Hanging piece detected
  // → "You left your knight undefended. Always check 
  //    if your pieces are protected after moving."
  
  // Example: Ignored center control
  // → "This move ignores the center. In the opening,
  //    control central squares with pawns and pieces."
}
```

**Explanation Quality**:
- Pre-written templates for ~50 common patterns
- Context-aware (game phase, piece moved, square importance)
- Principle-focused (not just "bad move")
- Clear, direct language
- Expandable over time

---

### Phase 4: Board & Interaction

**Goal**: Responsive chessboard with smooth interactions

#### [NEW] [components/ChessBoard.tsx](file:///c:/Users/polyo/Desktop/chessy/components/ChessBoard.tsx)
- Integrate `react-chessboard` or `chessground`
- Handle player moves with drag-and-drop
- Show legal move highlights
- Render best move arrows (level-dependent)
- Display evaluation bar (optional by level)
- Smooth piece animations
- Keyboard support (arrow keys for move navigation)

**Board Configuration by Level**:
- **Beginner**: Show arrows, eval bar, legal moves
- **Intermediate**: Legal moves only, optional eval bar
- **Advanced**: Minimal hints, no arrows
- **Professional**: Pure board, no assistance

---

### Phase 5: State Management

**Goal**: Clean, predictable state with Zustand

#### [NEW] [state/gameStore.ts](file:///c:/Users/polyo/Desktop/chessy/state/gameStore.ts)
```typescript
interface GameState {
  // Core state
  game: Chess;              // chess.js instance
  level: Level;             // Current difficulty
  moveHistory: MoveRecord[];
  
  // UI state
  selectedSquare: string | null;
  showEvalBar: boolean;
  feedbackVisible: boolean;
  
  // Analysis
  currentEvaluation: EngineEvaluation;
  lastMoveAnalysis: MoveAnalysis | null;
  mistakes: Mistake[];
  
  // Actions
  makeMove: (from: string, to: string) => Promise<void>;
  undoMove: () => void;
  resetGame: () => void;
  setLevel: (level: Level) => void;
}
```

#### [NEW] [state/levelConfig.ts](file:///c:/Users/polyo/Desktop/chessy/state/levelConfig.ts)
```typescript
const LEVEL_CONFIGS = {
  beginner: {
    showEvalBar: true,
    showBestMove: true,
    autoExplain: true,
    allowUndo: true,
    engineDepth: 15,
    feedbackDelay: 0,
  },
  intermediate: {
    showEvalBar: false, // optional toggle
    showBestMove: true,
    autoExplain: false,
    allowUndo: true, // limited
    engineDepth: 18,
    feedbackDelay: 0,
  },
  // ... advanced, professional configs
};
```

---

### Phase 6: Feedback System by Level

**Goal**: Level-appropriate feedback that respects player intelligence

#### [NEW] [components/FeedbackOverlay.tsx](file:///c:/Users/polyo/Desktop/chessy/components/FeedbackOverlay.tsx)
- Non-blocking overlay system
- Move grade badge (brilliant/good/inaccuracy/mistake/blunder)
- Conditional content based on level
- Smooth fade in/out animations
- Never hijacks the board

**Feedback Variants**:

**Beginner**:
```tsx
<Feedback>
  <Grade>Mistake</Grade>
  <Arrow showBestMove />
  <Explanation auto-visible>
    You left your knight undefected...
  </Explanation>
  <Principle>Always protect your pieces</Principle>
</Feedback>
```

**Intermediate**:
```tsx
<Feedback>
  <Grade>Inaccuracy</Grade>
  <BestMove>Nf3 was better</BestMove>
  <Explanation collapsed, click-to-expand />
</Feedback>
```

**Advanced**:
```tsx
<FeedbackDelayed by={1} />
  {/* Shows after next move */}
```

**Professional**:
```tsx
{/* No feedback during game */}
```

#### [NEW] [components/ExplanationDrawer.tsx](file:///c:/Users/polyo/Desktop/chessy/components/ExplanationDrawer.tsx)
- Slide-in drawer for detailed explanations
- Show principle violated
- Display better alternative
- Tactical tags if applicable
- "Why this matters" section

---

### Phase 7: Review Engine

**Goal**: Structured post-game analysis

#### [NEW] [app/review/page.tsx](file:///c:/Users/poloy/Desktop/chessy/app/review/page.tsx)
- Post-game analysis dashboard
- Mistake grouping by category
- Critical moments timeline
- Interactive position viewer

**Review Sections**:
1. **Game Summary**: Result, move count, avg centipawn loss
2. **Critical Mistakes**: Top 3-5 positions where game went wrong
3. **Tactical Errors**: Missed tactics or hanging pieces
4. **Opening Analysis**: First 10 moves, principle adherence
5. **Endgame Review**: Technique in simplified positions

**Review Card Structure**:
```tsx
<MistakeCard>
  <Position fen={mistake.fen} />
  <YourMove>Qxe5??</YourMove>
  <BestMove>Bd3</BestMove>
  <Consequence>Allowed fork on f7</Consequence>
  <Principle>Don't grab pawns before development</Principle>
</MistakeCard>
```

---

### Phase 8: Puzzle System

**Goal**: Extract training positions from user mistakes

#### [NEW] [logic/puzzleExtractor.ts](file:///c:/Users/polyo/Desktop/chessy/logic/puzzleExtractor.ts)
- Identify positions where user made significant mistake
- Check if position has clear best move
- Store puzzle with solution
- Track repetition patterns (e.g., user hangs pieces 3 times → hanging piece puzzle)

#### [NEW] [components/PuzzleModal.tsx](file:///c:/Users/polyo/Desktop/chessy/components/PuzzleModal.tsx)
- Interrupt flow for Beginner level only
- Present extracted position
- "Find the best move" challenge
- Success → continue game
- Failure → show answer + explanation

**Puzzle Triggers**:
- **Beginner**: After 2 similar mistakes
- **Intermediate**: After 3 similar mistakes
- **Advanced+**: No interruptions (store for review)

---

### Phase 9: Landing Page & Level Selection

**Goal**: Clean, intentional entry experience

#### [NEW] [app/page.tsx](file:///c:/Users/polyo/Desktop/chessy/app/page.tsx)
```tsx
<LandingPage>
  <Header>
    <Title>Chess Training</Title>
    <Subtitle>Learn correct thinking through principled feedback</Subtitle>
  </Header>
  
  <LevelSelection>
    <LevelCard level="beginner">
      <Name>Beginner</Name>
      <Description>Guided classical training</Description>
      <Features>
        - Immediate explanations
        - Best move shown
        - Tactical warnings
      </Features>
    </LevelCard>
    {/* ... other levels */}
  </LevelSelection>
  
  <StartButton>Begin Training</StartButton>
</LandingPage>
```

**Design Philosophy**:
- No signup wall
- No tutorial modals
- No tracking consent banners
- Instant start

---

### Phase 10: UI Polish & Styling

**Goal**: Timeless, calm aesthetic that respects the game

#### [MODIFY] [styles/globals.css](file:///c:/Users/polyo/Desktop/chessy/styles/globals.css)
```css
/* Design Tokens */
:root {
  --bg-primary: #1a1a1a;
  --bg-secondary: #242424;
  --text-primary: #e8e8e8;
  --text-secondary: #a0a0a0;
  --accent: #4a9eff;
  --success: #44a06b;
  --warning: #e8a83e;
  --error: #d44d5c;
  
  --font-main: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-mono: "SF Mono", "Consolas", monospace;
  
  --transition-fast: 150ms ease;
  --transition-smooth: 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* No heavy animations - subtle only */
.piece-move {
  transition: transform var(--transition-smooth);
}

.feedback-enter {
  animation: fadeIn var(--transition-fast);
}
```

**Typography**:
- System fonts (fast load, native feel)
- Clear hierarchy
- Generous spacing

**Colors**:
- Dark mode default
- Muted, professional palette
- Accent color for feedback grades

**Animations**:
- Piece movements only
- Subtle fades
- No spinners or loaders unless >500ms

**Responsive Design Philosophy**:
- **Adaptive & Fluid**: The UI must not just "fit" smaller screens; it must feel *made* for them.
- **Mobile-First**: Touch targets, navigation, and layout prioritized for mobile usage.
- **Tablet Optimization**: utilize extra space meaningfully, not just scaling up mobile view.
- **Desktop Experience**: robust controls and keyboard shortcuts, utilizing wide screens for analysis.
- **No "Generic Shrinking"**: Layouts should re-flow and adapt completely (e.g., move list below board on mobile, side-by-side on desktop).

---

### Phase 11: Performance Optimization

**Goal**: Meet <1s page load, <100ms feedback targets

**Optimizations**:
1. **Code Splitting**: Lazy load Review page and Puzzle system
2. **Stockfish Caching**: Keep engine instance in memory across games
3. **Preload Critical Assets**: Board images, engine WASM
4. **Memoization**: React.memo for board components
5. **Web Worker**: Engine runs off main thread (already planned)
6. **CSS Optimization**: Purge unused Tailwind classes

**Performance Checklist**:
- [ ] Lighthouse score 90+ on Performance
- [ ] First Contentful Paint <1s
- [ ] Move feedback appears same frame
- [ ] Engine eval completes <100ms at depth 15-18
- [ ] No layout shifts during game

---

## Verification Plan

### Automated Tests

1. **Engine Performance Test**:
```bash
npm run test:engine
# Verify <100ms eval time across 100 positions
```

2. **Move Classification Test**:
```bash
npm run test:logic
# Verify correct grading for known positions
```

3. **Level Configuration Test**:
```bash
npm run test:levels
# Ensure each level behaves correctly
```

### Manual Verification

1. **Play Through Each Level**:
   - Beginner: Confirm auto-explanations, arrows, warnings
   - Intermediate: Verify on-demand explanations only
   - Advanced: Test delayed feedback
   - Professional: Ensure zero mid-game feedback

2. **Performance Testing**:
   - Test on slower devices (throttled CPU)
   - Verify <1s load on 3G connection
   - Check memory usage over 20-move game

3. **UX Testing**:
   - Test with someone learning chess
   - Confirm explanations are clear
   - Verify feedback feels helpful, not annoying

4. **Cross-Browser Testing**:
   - Chrome, Firefox, Safari, Edge
   - Mobile browsers (iOS Safari, Chrome Android)

### Success Criteria

- ✅ Move feedback appears instantly (<100ms)
- ✅ Page loads in <1s
- ✅ All four levels behave correctly
- ✅ Explanations are clear and principle-based
- ✅ UI feels calm and intentional
- ✅ No jank or layout shifts
- ✅ Works offline after first load (PWA optional)

---

## Post-MVP Enhancements

Once core platform is solid:

1. **AI-Powered Explanations**: Replace rule-based system with GPT-4 or Claude for natural language coaching
2. **Opening Repertoire**: Let users build personalized opening tree
3. **Spaced Repetition**: Puzzle system with proven learning algorithm
4. **PGN Export**: Download games for external analysis
5. **Session Analytics**: Track improvement over time without gamification

---

## Timeline Estimate

- **Phase 1-2** (Setup + Engine): 1-2 days
- **Phase 3-4** (Logic + Board): 2-3 days
- **Phase 5-6** (State + Feedback): 2-3 days
- **Phase 7-8** (Review + Puzzles): 2-3 days
- **Phase 9-11** (UI + Polish): 2-3 days

**Total MVP**: 9-14 days of focused development

**First Playable**: After Phase 6 (~5-7 days)

---

## Final Notes

This roadmap prioritizes **correctness over cleverness** and **speed over features**.

The rule-based explanation system will work immediately and can be enhanced with AI later without architectural changes.

Every decision is made to respect the player's time and intelligence—just like Magnus would want it.
