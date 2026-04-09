# Implementation Plan: Ambis Battle Desktop Redesign

**Version**: 1.0  
**Date**: April 9, 2026  
**Status**: Ready for Development  
**Priority**: High

---

## 1. Executive Summary

Transform Ambis Battle from mobile-first centered layout to full-width responsive desktop experience while maintaining 100% mobile compatibility. Focus on proportional, minimalist, and elegant design for large screens.

**Key Objectives:**
- ✅ Desktop: Full-width layout utilizing screen real estate
- ✅ Mobile: Zero changes, maintain current experience
- ✅ Design: Proportional, breathable, elegant
- ✅ Performance: No performance regression

---

## 2. Technical Approach

### 2.1 Responsive Strategy

**Breakpoints:**
- `md:` (768px+) - Tablet adjustments
- `lg:` (1024px+) - Desktop layout trigger
- `xl:` (1280px+) - Large desktop enhancements

**CSS Framework:** Tailwind CSS (already in use)

**Design Pattern:** Progressive Enhancement
- Mobile-first base styles (current)
- Desktop enhancements via `lg:` breakpoints
- No mobile-specific overrides

### 2.2 File Structure

**Current Files to Modify:**
```
src/features/ambisBattle/
├── Lobby.js              # Main menu page
├── WaitingRoom.js        # Room waiting area
├── LiveBattle.js         # Gameplay (PRIORITY)
├── BattleResult.js       # Results page
└── GenerateQuestion.js  # Question creation (already optimized)
```

**New Components (if needed):**
```
src/features/ambisBattle/components/
├── DesktopLayout.js      # Desktop layout wrapper
├── SplitPanel.js         # Split screen component
└── VersusLayout.js       # VS layout for player lists
```

---

## 3. Implementation Phases

### Phase 1: Foundation (Week 1)
**Duration:** 2-3 days

**Tasks:**
1. **Setup Desktop Design System**
   - Create responsive container utility classes
   - Define desktop spacing scale (lg:gap-6, lg:p-8)
   - Set desktop typography scale (lg:text-lg, lg:text-xl)
   - Test breakpoint triggers

2. **Create Desktop Layout Components**
   - `DesktopContainer` - Wide container with max-width
   - `SplitScreen` - Left-right panel layout
   - `VersusGrid` - Player vs opponent layout

**Deliverables:**
- Reusable desktop components
- Design system documentation
- Breakpoint validation

---

### Phase 2: Lobby & Waiting Room (Week 1-2)
**Duration:** 3-4 days

**Tasks:**

#### 2.1 Lobby Page (Lobby.js)
**Current:** Single column, centered  
**Target:** Side-by-side cards, right sidebar

**Implementation:**
```jsx
// Desktop Layout
<div className="lg:flex lg:gap-8 lg:items-start">
  {/* Left: Main Menu Cards */}
  <div className="lg:flex-1 lg:grid lg:grid-cols-2 lg:gap-6">
    <CreateRoomCard />
    <JoinRoomCard />
  </div>
  
  {/* Right: How to Play Panel */}
  <div className="lg:w-96 lg:sticky lg:top-8">
    <HowToPlayPanel />
  </div>
</div>
```

**Key Changes:**
- Container: `max-w-md` → `max-w-6xl`
- Menu cards: Stacked → Grid (2 columns)
- How to play: Bottom list → Right sidebar sticky
- Background: Add subtle gradient accents

#### 2.2 Waiting Room (WaitingRoom.js)
**Current:** Narrow centered card  
**Target:** Wide card with split header, versus layout

**Implementation:**
```jsx
// Desktop Header
<div className="lg:flex lg:justify-between lg:items-center lg:mb-8">
  <div>
    <h1 className="text-4xl lg:text-5xl font-black">{roomCode}</h1>
    <p className="text-slate-500">Room Code</p>
  </div>
  <div className="flex gap-4">
    <CopyButton />
    <StatusBadge />
  </div>
</div>

// Desktop Player List
<div className="lg:flex lg:gap-8 lg:items-center">
  <PlayerCard player={host} side="left" />
  <VSIndicator />
  <PlayerSlot side="right" />
</div>
```

**Key Changes:**
- Container: `max-w-md` → `max-w-4xl`
- Room code: Small box → Large split header
- Player list: Vertical → Horizontal versus
- Footer: Sticky bottom for desktop

**Deliverables:**
- Lobby desktop layout
- Waiting room desktop layout
- Mobile regression testing

---

### Phase 3: Gameplay - PRIORITY (Week 2-3)
**Duration:** 4-5 days

**Current:** Vertical layout (stimulus top, answers bottom)  
**Target:** Split screen (left stimulus, right answers)

**Tasks:**

#### 3.1 Split Screen Layout
```jsx
<div className="lg:flex lg:h-screen lg:overflow-hidden">
  {/* Left Panel: Stimulus (60%) */}
  <div className="lg:w-3/5 lg:h-full lg:overflow-y-auto lg:p-8 lg:border-r lg:border-slate-200">
    <StimulusPanel />
  </div>
  
  {/* Right Panel: Answers (40%) */}
  <div className="lg:w-2/5 lg:h-full lg:overflow-y-auto lg:p-8 lg:bg-slate-50">
    <AnswersPanel />
  </div>
</div>
```

**Key Changes:**
- Layout: Vertical → Horizontal split
- Left panel: Fixed/sticky, scrollable stimulus
- Right panel: Sticky answers, larger buttons
- Header: Full width above both panels
- Font sizes: Increased for readability (lg:text-lg, lg:text-xl)

#### 3.2 Header Enhancement
```jsx
// Desktop Header
<div className="lg:flex lg:justify-between lg:items-center lg:px-8 lg:py-4 lg:bg-white lg:border-b lg:border-slate-200 lg:sticky lg:top-0 lg:z-50">
  <TimerDisplay />
  <ScoreBoard />
</div>
```

#### 3.3 Answer Buttons
```jsx
// Desktop Answer Buttons
<button className="lg:h-16 lg:text-lg lg:px-6 lg:mb-4">
  Option A
</button>
```

**Deliverables:**
- Split screen gameplay
- Enhanced header
- Desktop-optimized answer buttons
- Scroll behavior testing

---

### Phase 4: Result Page (Week 3)
**Duration:** 2-3 days

**Current:** Vertical list, small stats  
**Target:** Grid layout, enlarged stats

**Tasks:**

#### 4.1 Winner Card
```jsx
// Desktop Winner Card
<div className="lg:max-w-4xl lg:mx-auto lg:p-12">
  <WinnerBanner size="xl" />
</div>
```

#### 4.2 Statistics Grid
```jsx
// Desktop Stats
<div className="lg:grid lg:grid-cols-3 lg:gap-8 lg:mb-8">
  <StatCard icon={<Target />} value="40%" label="Akurasi" />
  <StatCard icon={<CheckCircle />} value="2/5" label="Benar" />
  <StatCard icon={<Clock />} value="3s" label="Rata Waktu" />
</div>
```

#### 4.3 Evaluation Grid
```jsx
// Desktop Question Evaluation
<div className="lg:grid lg:grid-cols-2 lg:gap-6">
  {questions.map(q => <QuestionCard key={q.id} question={q} />)}
</div>
```

**Key Changes:**
- Container: `max-w-md` → `max-w-4xl`
- Winner banner: Larger, more prominent
- Stats: 3-column grid with enlarged numbers
- Evaluation: 2-column grid layout
- Reduced scroll depth

**Deliverables:**
- Result page desktop layout
- Grid-based evaluation
- Mobile regression testing

---

### Phase 5: Testing & Optimization (Week 4)
**Duration:** 3-4 days

**Tasks:**

#### 5.1 Testing Matrix
| Screen Size | Lobby | Waiting Room | Gameplay | Result |
|-------------|-------|--------------|----------|--------|
| Mobile (375px) | ✅ Unchanged | ✅ Unchanged | ✅ Unchanged | ✅ Unchanged |
| Tablet (768px) | ✅ Responsive | ✅ Responsive | ✅ Responsive | ✅ Responsive |
| Desktop (1024px) | ✅ Full width | ✅ Full width | ✅ Split screen | ✅ Grid |
| Large (1280px+) | ✅ Enhanced | ✅ Enhanced | ✅ Enhanced | ✅ Enhanced |

#### 5.2 Performance Testing
- Lighthouse score comparison
- Bundle size analysis
- Render time measurement
- Scroll performance testing

#### 5.3 Accessibility Testing
- Keyboard navigation
- Screen reader compatibility
- Focus management
- Color contrast validation

#### 5.4 Cross-Browser Testing
- Chrome, Firefox, Safari, Edge
- Desktop browsers only (mobile unchanged)

**Deliverables:**
- Test report
- Performance metrics
- Bug fixes
- Final polish

---

## 4. Specific Implementation Details

### 4.1 Tailwind Class Patterns

**Container Pattern:**
```jsx
// Mobile: max-w-md (current)
// Desktop: max-w-6xl
<div className="max-w-md mx-auto px-4 lg:max-w-6xl lg:px-8">
```

**Typography Pattern:**
```jsx
// Mobile: text-sm, text-base
// Desktop: text-lg, text-xl
<h2 className="text-lg lg:text-2xl font-bold">Title</h2>
```

**Spacing Pattern:**
```jsx
// Mobile: p-4, gap-3, mb-4
// Desktop: p-8, gap-6, mb-8
<div className="p-4 lg:p-8 gap-3 lg:gap-6 mb-4 lg:mb-8">
```

**Button Pattern:**
```jsx
// Mobile: py-3 px-4 text-sm
// Desktop: py-4 px-6 text-base
<button className="py-3 px-4 text-sm lg:py-4 lg:px-6 lg:text-base">
  Button
</button>
```

### 4.2 Component Migration Strategy

**For each page:**
1. Read current implementation
2. Identify mobile-specific classes
3. Add `lg:` prefixed desktop classes
4. Test mobile (no changes)
5. Test desktop (new layout)
6. Commit with descriptive message

**Example Commit Message:**
```
feat(lobby): add desktop side-by-side layout

- Convert menu cards to grid layout on desktop
- Move how-to-play to right sidebar sticky
- Add subtle background gradient
- Mobile layout unchanged
```

### 4.3 Scroll Behavior

**Gameplay Split Screen:**
```jsx
// Independent scrolling
<div className="lg:flex lg:h-screen">
  <div className="lg:w-3/5 lg:overflow-y-auto lg:h-full">
    {/* Stimulus scrolls independently */}
  </div>
  <div className="lg:w-2/5 lg:overflow-y-auto lg:h-full">
    {/* Answers scroll independently */}
  </div>
</div>
```

---

## 5. Risk Assessment & Mitigation

### 5.1 Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Mobile layout breaks | High | Medium | Strict `lg:` only, no mobile overrides |
| Performance degradation | Medium | Low | Test bundle size, lazy load if needed |
| Scroll issues in split screen | High | Medium | Test scroll behavior thoroughly |
| Browser compatibility | Low | Low | Test on major desktop browsers |
| User confusion with new layout | Medium | Medium | Keep familiar elements, just repositioned |

### 5.2 Rollback Plan

- Git version control for easy rollback
- Feature branch: `uiux/ambisbattle`
- Can merge back to main if issues arise
- Mobile users unaffected by desktop changes

---

## 6. Success Criteria

### 6.1 Functional Requirements
- ✅ Mobile layout 100% unchanged (visual regression test)
- ✅ Desktop layout utilizes full screen width
- ✅ All pages responsive at 1024px breakpoint
- ✅ No JavaScript errors in console
- ✅ All features work on desktop

### 6.2 Design Requirements
- ✅ Proportional sizing (fonts, buttons, spacing)
- ✅ Minimalist (adequate whitespace)
- ✅ Elegant (consistent design system)
- ✅ Accessible (WCAG AA compliant)

### 6.3 Performance Requirements
- ✅ Lighthouse score ≥ 90
- ✅ Bundle size increase < 50KB
- ✅ First Contentful Paint < 2s
- ✅ Time to Interactive < 3s

---

## 7. Timeline Summary

| Phase | Duration | Start | End | Status |
|-------|----------|-------|-----|--------|
| Phase 1: Foundation | 2-3 days | Week 1 | Week 1 | ⏳ Pending |
| Phase 2: Lobby & Waiting Room | 3-4 days | Week 1 | Week 2 | ⏳ Pending |
| Phase 3: Gameplay (Priority) | 4-5 days | Week 2 | Week 3 | ⏳ Pending |
| Phase 4: Result Page | 2-3 days | Week 3 | Week 3 | ⏳ Pending |
| Phase 5: Testing & Optimization | 3-4 days | Week 4 | Week 4 | ⏳ Pending |
| **Total** | **14-19 days** | **Week 1** | **Week 4** | **⏳ Pending** |

---

## 8. Next Steps

1. **Review & Approve** - Stakeholder approval of this plan
2. **Branch Setup** - Create feature branch `uiux/ambisbattle`
3. **Phase 1 Start** - Begin foundation work
4. **Daily Standups** - Progress tracking
5. **Weekly Demos** - Show desktop progress

---

## 9. Resources

**Design References:**
- PRD: `UXUIXPRD.md`
- Current implementation: `src/features/ambisBattle/`
- Tailwind docs: https://tailwindcss.com/docs/responsive-design

**Development Tools:**
- Chrome DevTools (Device Mode)
- React DevTools
- Lighthouse
- Git (version control)

**Testing Tools:**
- BrowserStack (cross-browser testing)
- axe DevTools (accessibility)
- WebPageTest (performance)

---

**Document Owner:** Senior Web Developer  
**Last Updated:** April 9, 2026  
**Next Review:** After Phase 1 completion
