# Contributing to Chess Training Platform

Thank you for your interest in contributing! This project is built on the philosophy of **speed, clarity, and respect for the player's intelligence**.

All contributions should align with these core values.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Code Standards](#code-standards)
5. [What to Contribute](#what-to-contribute)
6. [What NOT to Contribute](#what-not-to-contribute)
7. [Submitting Changes](#submitting-changes)
8. [Architecture Guidelines](#architecture-guidelines)
9. [Testing Requirements](#testing-requirements)

---

## Code of Conduct

### Our Philosophy

This project has strong opinions about how chess should be taught:

- **No gamification** — No points, badges, streaks, or vanity metrics
- **No social features** — No chat, no profiles, no leaderboards
- **No friction** — No accounts, no paywalls, no tracking
- **Performance first** — Fast feedback beats clever features

If a proposed feature violates these principles, it won't be merged—regardless of code quality.

### Be Respectful

- Assume good intent
- Give constructive feedback
- Debate ideas, not people
- Respect maintainer decisions on philosophy

---

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Git**
- Basic understanding of TypeScript, React, and Next.js
- Familiarity with chess terminology (not required to be a strong player)

### Setup

```bash
# Fork the repository
git clone https://github.com/YOUR_USERNAME/chessy.git
cd chessy

# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Run linter
npm run lint
```

---

## Development Workflow

### 1. Find or Create an Issue

- Check existing issues first
- For bugs: describe the problem, steps to reproduce, expected vs actual behavior
- For features: explain why it aligns with project philosophy
- Wait for maintainer approval before starting work on major features

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

Branch naming:
- `feature/` for new features
- `fix/` for bug fixes
- `refactor/` for code improvements
- `docs/` for documentation
- `test/` for test additions

### 3. Make Changes

- Keep commits atomic and focused
- Write clear commit messages
- Follow code standards (see below)
- Test your changes thoroughly

### 4. Test Locally

```bash
# Run all tests
npm test

# Check TypeScript
npm run type-check

# Lint code
npm run lint

# Test in all 4 training levels
npm run dev
```

**Critical**: Test your changes at all four difficulty levels (Beginner, Intermediate, Advanced, Professional) to ensure level-specific behavior works correctly.

### 5. Submit a Pull Request

- Reference the issue number
- Describe what changed and why
- Include screenshots/recordings for UI changes
- Ensure all checks pass

---

## Code Standards

### TypeScript

- **Strict mode enabled** — No `any` types without justification
- Prefer interfaces over types for objects
- Use descriptive variable names
- Add JSDoc comments for complex functions

```typescript
// ✅ Good
interface MoveAnalysis {
  playerMove: string;
  engineBestMove: string;
  evalDelta: number;
}

// ❌ Bad
type MA = {
  pm: string;
  ebm: string;
  ed: number;
};
```

### React Components

- Functional components with hooks
- Use `memo` for expensive re-renders
- Keep components focused and composable
- Props should be clearly typed

```tsx
// ✅ Good
interface FeedbackProps {
  grade: MoveGrade;
  explanation: string;
  showArrow: boolean;
}

export const FeedbackOverlay: React.FC<FeedbackProps> = memo(({ 
  grade, 
  explanation, 
  showArrow 
}) => {
  // ...
});
```

### Performance

- **Move feedback must appear instantly** (<100ms)
- Avoid blocking the main thread
- Use Web Workers for heavy computation
- Lazy load non-critical components
- Profile before optimizing, but always prioritize speed

### Styling

- **Tailwind CSS** with semantic class names
- Use design tokens from `globals.css`
- Dark mode first (light mode optional)
- No heavy animations — subtle transitions only
- System fonts preferred

```tsx
// ✅ Good - semantic, uses tokens
<div className="bg-bg-secondary text-text-primary rounded-lg p-4 
                transition-opacity duration-150">

// ❌ Bad - arbitrary values, hard-coded colors
<div className="bg-[#242424] text-[#e8e8e8] rounded-[8px] p-[16px]">
```

### File Organization

- One component per file
- Co-locate tests with source files
- Group related utilities in `/lib`
- Keep `/logic` pure (no React dependencies)

```
/components
  ChessBoard.tsx
  ChessBoard.test.tsx
  ChessBoard.module.css  # if needed
```

---

## What to Contribute

### 🎯 High Priority

- Performance improvements
- Bug fixes (especially engine or move classification bugs)
- Better explanations for the principle library
- Accessibility improvements
- Mobile responsiveness
- Cross-browser compatibility
- Test coverage

### ✅ Welcome

- New tactical patterns for detection
- Additional chess principles with clear explanations
- UI polish that maintains minimalism
- Documentation improvements
- Puzzle extraction improvements
- Endgame tablebase integration (future)

### 💡 Discuss First

- New training levels
- Major UI changes
- New dependencies
- Architecture changes
- AI/ML features

---

## What NOT to Contribute

### ❌ Will Not Be Merged

- **User accounts or authentication**
- **Social features** (chat, friends, profiles)
- **Gamification** (points, badges, streaks, XP)
- **Ads or tracking** (analytics must be privacy-focused and opt-in)
- **Paywalls or subscriptions**
- **Heavy animations or flashy effects**
- **Tutorial modals or onboarding flows**
- Features that slow down first interaction
- Dependencies that significantly increase bundle size

**Why?** These violate the core philosophy: fast, focused, friction-free learning.

---

## Submitting Changes

### Pull Request Checklist

Before submitting, ensure:

- [ ] Code follows TypeScript and React standards
- [ ] All tests pass (`npm test`)
- [ ] No linting errors (`npm run lint`)
- [ ] Tested in all 4 training levels
- [ ] Mobile responsive (if UI change)
- [ ] Performance verified (no regressions)
- [ ] Documentation updated (if needed)
- [ ] Commit messages are clear
- [ ] PR description explains the change

### PR Template

```markdown
## Description
Brief description of changes

## Related Issue
Fixes #123

## Changes Made
- Change 1
- Change 2

## Testing Done
- Tested in Beginner/Intermediate/Advanced/Professional modes
- Performance verified: [specific metrics]
- Cross-browser tested: Chrome, Firefox, Safari

## Screenshots (if UI change)
[Add screenshots or recordings]

## Checklist
- [ ] Tests pass
- [ ] No linting errors
- [ ] All levels tested
- [ ] Performance verified
```

---

## Architecture Guidelines

### State Management

- Use **Zustand** for global state
- Keep state minimal and normalized
- Actions should be synchronous when possible
- Engine evaluations run async in Web Worker

### Engine Integration

- All engine calls must be non-blocking
- Use configurable depth based on training level
- Cache positions when appropriate
- Handle engine failures gracefully

### Explanation System

The current system is **rule-based**:
- Maps `(move, eval, tactics, position)` → explanation
- Uses pre-written templates
- Fast and deterministic
- Easily testable

Future AI integration should:
- Be async and optional
- Fall back to rule-based on failure
- Never block gameplay
- Be cacheable

### Level System

Each level has a configuration object defining:
- Engine depth
- Feedback timing
- UI element visibility
- Undo availability
- Explanation behavior

**Never hardcode level-specific logic** — use the config system.

```typescript
// ✅ Good
const config = LEVEL_CONFIGS[currentLevel];
if (config.showBestMove) {
  // ...
}

// ❌ Bad
if (currentLevel === 'beginner') {
  // ...
}
```

---

## Testing Requirements

### Unit Tests

- All pure functions in `/logic` must have tests
- Move classification edge cases
- Principle detection accuracy
- Tactical pattern matching

### Integration Tests

- Engine evaluation pipeline
- State updates after moves
- Level configuration behavior

### Performance Tests

- Engine evaluation time (<100ms)
- Feedback render time (same frame)
- Page load time (<1s)

### Manual Testing

Before submitting UI changes:
1. Play through a full game at each level
2. Verify feedback appears as expected
3. Check mobile responsiveness
4. Test on slower devices/networks

---

## Getting Help

- **Questions?** Open a discussion on GitHub
- **Bug?** Open an issue with reproduction steps
- **Feature idea?** Discuss it in an issue first
- **Unclear documentation?** Submit a PR to improve it

---

## Recognition

Contributors will be acknowledged in:
- GitHub contributors list
- Release notes for significant contributions
- README acknowledgments section (for major features)

---

## Final Notes

This project prioritizes **correctness over cleverness** and **speed over features**.

Every line of code should serve the goal of helping players improve their chess thinking through honest, immediate, principle-based feedback.

Thank you for helping build something that respects both the game and the player.

---

**Questions?** Open an issue or discussion. We're here to help.
