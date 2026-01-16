---
stepsCompleted: [1, 2, 3, 4, 5]
inputDocuments:
  - '_bmad-output/planning-artifacts/product-brief-research-assistant-2026-01-15.md'
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/prd-validation-report.md'
  - 'docs/methodology.md'
  - '_bmad-output/analysis/brainstorming-session-2026-01-15.md'
date: 2026-01-15
author: Nicolas
---

# UX Design Specification research-assistant

**Author:** Nicolas
**Date:** 2026-01-15

---

## Executive Summary

### Project Vision

research-assistant is an AI-powered web application that transforms MBA literature review from a 40-hour manual process into a 2-hour guided experience. The product targets working professionals pursuing MBAs who face an impossible challenge: complete rigorous academic research while managing full-time jobs and families.

The core magic: drag PDFs in, get a structured literature review out—with every AI-generated claim traceable to a specific source and exact page number. The design philosophy is "opinionated simplicity over flexible complexity"—tell users what to do next, don't give them a blank canvas.

### Target Users

**Primary User: "Marie" — The Time-Starved Professional**

Marie is a Product Manager, Consultant, or Management professional pursuing a part-time/Executive MBA while working full-time. She has 4-5 hours per week MAX for MBA work, is low-to-moderate tech savvy, and often has family commitments (partner, children).

**Goals:**
- Complete MBA research paper on time
- Get a good grade without becoming a methodology expert
- Feel confident before tutor meetings

**Frustrations:**
- Time spent reading irrelevant papers
- Inability to cite sources confidently
- Synthesis/writing of the literature review itself

**Biggest Fear:** Not completing the research paper → failed year → 15,000€ lost → career setback

**Emotional State:** When Marie opens the app on Saturday morning at 7 AM (coffee in hand, kids still sleeping), she is simultaneously anxious about deadlines, overwhelmed by complexity, and hopeful but skeptical about AI promises.

**Usage Context:** Home office/bedroom with coffee, Saturday morning 2-hour focused sessions, desktop/laptop primary device.

**Variant User: "Nicolas" — Tech-Savvy Power User**
A subset of users want keyboard shortcuts and power-user features, but the product must be designed for Marie first—Nicolas can adapt, Marie cannot.

### Key Design Challenges

**Challenge 1: Triple Pain Point in One Flow**
Users experience three simultaneous frustrations that must be solved together, not separately:
- Wading through irrelevant papers (time waste)
- Inability to cite sources confidently (credibility anxiety)
- Synthesis/writing of the literature review (blank page paralysis)

UX Implication: Filter → Cite → Synthesize must feel like one effortless motion, not separate features.

**Challenge 2: Anxious + Overwhelmed + Skeptical Users**
Users open the app in a complex emotional state: anxious, overwhelmed, hopeful but skeptical.

UX Implication: Every screen must radiate calm confidence. Clear progress indicators. No overwhelming options. Trust-building evidence (citations) must be immediate and prominent, not buried.

**Challenge 3: Trust Must Be Earned Through Verification**
Users won't trust AI output until they verify it themselves. Trust comes from seeing exact page citations and being able to verify every claim.

UX Implication: Click-to-verify isn't a nice-to-have—it's the core trust mechanism. Make verification effortless and prominent.

### Design Opportunities

**Opportunity 1: Make Time Savings Visceral**
The "aha moment" is when users realize they just saved 38 hours. Surface this explicitly through the UI (e.g., "Literature review generated in 4 minutes. Estimated manual time: 40 hours.").

**Opportunity 2: The Coffee Session UX**
Design for unhurried concentration in a home office setting, not frantic multitasking:
- Calm, spacious layouts
- Long-form reading-friendly typography
- No aggressive notifications or time pressure
- Split-view for contemplative side-by-side comparison

**Opportunity 3: Citation Verification as Confidence Builder**
Every time a user clicks a citation and sees the exact page, trust increases. Make citation verification delightful:
- One-click opens PDF at exact page
- Visual indicators for verification status
- Let users feel like fact-checkers, not passive consumers

## Core User Experience

### Defining Experience

The core user experience of research-assistant centers on a single, effortless interaction: **drag PDFs in, get literature review out**. This is the action users will perform most frequently and the one that must be completely frictionless.

The primary user flow is:
1. User drags PDF files into the application
2. AI processes documents (4-5 minutes)
3. User receives structured literature review with traceable citations
4. User verifies citations by clicking to open PDFs at exact pages

The critical interaction is **click-to-verify**: when users click a citation and the PDF opens to the exact page, trust converts from skepticism to confidence. This moment determines whether users become believers or abandon the product.

### Platform Strategy

**Platform:** Web application (desktop-first)

**Primary Interaction Model:**
- Mouse/keyboard for desktop users
- Native HTML5 drag-and-drop for PDF upload
- Browser-based PDF rendering (pdf.js)
- No offline functionality required (AI processing requires server)

**Technical Constraints:**
- Local PDF files only (no cloud integration in MVP)
- Desktop-first design (1024px+)
- Browser support: Chrome, Firefox, Safari, Edge (latest 2 versions)
- Tablet: Basic support (not optimized)
- Mobile: Minimal (not a priority)

**Device Capabilities Leveraged:**
- Native drag-and-drop API
- PDF rendering in browser
- Copy/paste for citations
- Split-view layouts for side-by-side comparison

### Effortless Interactions

The following interactions must feel completely natural and require zero thought:

**1. PDF Upload**
Drag = done. No browse buttons, no upload queues, no file type verification dialogs. Users should be able to grab files from their desktop and drop them without any intermediate steps.

**2. Citation Verification**
One click opens the PDF at the exact page. No scrolling, no searching, no "find on page." The verification must be instant and precise.

**3. Progress Awareness**
Users should always know "where am I" without asking. Current stage in methodology, processing status, completion indicators—all visible without hunting.

**4. Automatic Processing**
No decisions required during AI processing:
- PDF text extraction (automatic)
- Relevance scoring (automatic)
- Theme identification (automatic)
- Citation linking with page numbers (automatic)
- Literature review structure generation (automatic)

Users go make coffee, come back 4 minutes later, and results are ready.

**5. Error Recovery**
When PDFs fail to process (scanned documents, image-based), the system handles gracefully:
- Clear error message indicating why it failed
- Continue processing other documents
- Partial results still usable

### Critical Success Moments

**Make-or-Break Moments:**

**Moment 1: The "Aha" Moment (Dual)**
- **Time savings realization:** Literature review appears in 4 minutes vs. expected 40 hours
- **Trust establishment:** First citation click opens PDF to exact page, proving accuracy

Both moments are equally critical. Time savings creates initial excitement, citation verification converts excitement to trust.

**Moment 2: User Feels Successful**
Success is defined as:
- Literature review draft is complete and usable for tutor meeting
- Multiple citations verified, trust established
- User feels confident defending their sources

**Moment 3: First-Time User Success**
Not the first upload (that's just testing). True success happens when users successfully use the output in a tutor meeting or realize they can defend every citation. That's when skepticism converts to advocacy.

**Unrecoverable Failures:**
- **Silent failures:** User doesn't know processing failed, loses trust in system
- **Wrong page citations:** Academic credibility destroyed, tutor catches error
- **Source misrepresentation:** User looks foolish defending AI hallucination
- **Processing without feedback:** User assumes system is broken, abandons

**Flawless Flows Required:**
1. Upload → Processing → Results (the core magic)
2. Citation click → PDF opens at exact page (the trust builder)
3. "What's next" guidance (prevents abandonment and confusion)

### Experience Principles

**Principle 1: Zero-Friction Input**
The entry point must be effortless. Drag PDFs = done. No browse buttons, no upload queues, no configuration. The barrier to start must be zero because anxious, time-starved users won't tolerate complexity.

**Principle 2: Trust Through Transparency**
Every AI-generated claim must be instantly verifiable. Click citation → PDF opens at exact page. Trust isn't assumed, it's earned through effortless verification. Make users feel like fact-checkers, not passive consumers.

**Principle 3: Calm Confidence**
No aggressive timers, no overwhelming options, no uncertainty. Users are already anxious—the interface should radiate calm. Clear progress indicators, no surprises, predictable outcomes. Design for Saturday morning coffee sessions, not frantic dashboards.

**Principle 4: Guided Simplicity**
Tell users what to do next, don't make them figure it out. Opinionated workflow over flexible complexity. Users want outcomes (good grade, completed paper), not configuration options.

**Principle 5: Automatic Intelligence**
Processing should feel magical. User drags PDFs, goes to make coffee, comes back to completed literature review. No babysitting, no intermediate decisions, just results. Failures must be explicit and graceful, never silent.

## Desired Emotional Response

### Primary Emotional Goals

**During Use:**
Users should feel calm, guided, and in control—the opposite of their starting state (anxious, overwhelmed, lost). The product should reduce anxiety immediately through minimal, calm design that radiates "This is simpler than you think."

**After Completing Literature Review:**
Users should feel accomplished, confident, and relieved. The literature review is complete, every citation is defensible, and they're prepared for their tutor meeting.

**Differentiation:**
Unlike competitors that leave users feeling unsure (ChatGPT), organized but overwhelmed (Zotero), or lost (EBSCO), research-assistant makes users feel **supported**—like having a research companion who knows the path, not just a tool to figure out.

### Emotional Journey Mapping

**Stage 1: First Discovery (0-30 seconds)**
- **Current emotional state:** Anxious, overwhelmed, skeptical
- **Desired shift:** Immediate reassurance through minimal, calm design
- **UX implication:** Radiate "This is simpler than you think" - reduce anxiety instantly

**Stage 2: During Processing (4 minutes)**
- **Desired emotional state:** Relaxed detachment + trust
- **Experience:** Progress bar shows it's working, user goes to make coffee, returns to results
- **UX implication:** No babysitting required, anticipation building

**Stage 3: Seeing Results**
- **Emotional sequence:** Disbelief → Relief → Excitement
- **Moment:** "Did that really just happen?" transforms into "I'm not drowning anymore" and then "This actually worked!"
- **UX implication:** Surface time saved explicitly to amplify the emotional impact

**Stage 4: Error Recovery**
- **Desired emotional state:** Understanding + control (not panic)
- **Experience:** "The app explained why it failed, and I can still use the other results"
- **UX implication:** Clear error messages with explanations, graceful degradation, partial results still usable

**Stage 5: Returning User**
- **Desired emotional state:** Familiarity + confidence + efficiency
- **Experience:** "I know how this works, this saved me last time, let me get this done quickly"
- **UX implication:** Consistent patterns, no relearning required

### Micro-Emotions

Critical emotional tensions the product must manage:

| Emotional Tension | Starting State | Desired State | Design Strategy |
|-------------------|----------------|---------------|-----------------|
| **Confidence vs. Confusion** | Confused about methodology | Guided confidence | Opinionated workflow, clear "what's next" |
| **Trust vs. Skepticism** | Skeptical of AI promises | Trust through verification | Click-to-verify citations, transparent about limitations |
| **Excitement vs. Anxiety** | Anxious about deadlines | Excitement at time saved | Show "4 min vs 40 hours" explicitly |
| **Accomplishment vs. Frustration** | Frustrated by complexity | Accomplishment from completion | Progress indicators, professional output |
| **Delight vs. Satisfaction** | Just wants task done | Delighted by effortlessness | "Go make coffee" moment - magical processing |

### Design Implications

**To Create CALM:**
- Spacious layouts, no aggressive timers or countdown clocks
- Clear progress indicators eliminate uncertainty
- Soft color palette, long-form reading-friendly typography
- No overwhelming options or decision paralysis

**To Build CONFIDENCE:**
- Click-to-verify makes every claim defensible
- Visual indicators show verification status
- "You are here" methodology progress tracker
- Clear "what's next" guidance removes guesswork

**To Generate ACCOMPLISHMENT:**
- Show time saved explicitly: "Generated in 4 minutes. Estimated manual time: 40 hours"
- Completion indicators and progress bars
- High-quality, professional output ready for tutor review

**To Provide SUPPORT (users not alone):**
- Guided workflow with opinionated simplicity
- Proactive "do this next" messaging
- Error messages that explain AND suggest solutions
- No blank canvas anxiety—always know what to do

**To Establish TRUST:**
- Full citation traceability (PDF + exact page number)
- Transparent about AI capabilities and limitations
- Flag uncertain citations rather than hiding them
- Graceful degradation when processing fails

### Emotional Design Principles

**Principle 1: Calm Before Confidence**
Users arrive anxious. First priority is reducing anxiety through calm, minimal design. Only after anxiety is reduced can confidence be built.

**Principle 2: Trust Is Earned, Not Assumed**
Every design decision must support verification and transparency. Users become believers through proof, not promises.

**Principle 3: Delight Through Effortlessness**
The "wow" moment comes from how little effort was required, not flashy animations or celebrations. The magic is in the absence of friction.

**Principle 4: Support Over Features**
Users don't want more options, they want guidance. Every feature must answer "what should I do next?" not "what can I configure?"

**Principle 5: Emotional Recovery Over Prevention**
Errors will happen (scanned PDFs, processing failures). Design for graceful emotional recovery: explain what happened, show what succeeded, guide what to do next.

## UX Pattern Analysis & Inspiration

### Inspiring Products Analysis

Based on target user familiarity and use cases, three products provide the most relevant UX patterns for research-assistant:

**1. Google Drive - File Upload Excellence**

**Core Problem Solved:**
Bridging desktop files to cloud storage with zero friction. Users don't think about "uploading"—they just drag files where they want them.

**Key UX Success Factors:**
- **Large drop zone:** Entire page becomes target when dragging
- **Visual feedback:** Page changes appearance during drag (subtle overlay)
- **Clear affordance:** "Drop files here" messaging appears
- **Instant feedback:** File appears in list immediately, uploads in background
- **Progress indication:** Small progress bar on file thumbnail
- **Error handling:** Shows which files succeeded/failed with clear icons
- **Breadcrumb navigation:** Always know where you are
- **Preview without opening:** Spacebar quick look
- **Calm visual design:** Spacious white background, clear file type icons

**Why Relevant:**
Closest match to PDF drag-and-drop use case. Users already understand this interaction pattern.

**2. Spotify - Progress & Personalization**

**Core Problem Solved:**
Making infinite music library navigable and personal.

**Key UX Success Factors:**
- **Progress bar on every song:** Always know where you are
- **"Made for You" playlists:** Personalization without configuration
- **Recently played:** Easy to return to what worked
- **Dark mode by default:** Reduces eye strain for long sessions
- **High contrast for important actions:** Play button is prominent
- **Instant search:** Forgiving of typos, partial matches

**Why Relevant:**
Progress indicators and personalization without complexity align with "guided simplicity" principle.

**3. YouTube - "Watch Later" Queue Pattern**

**Core Problem Solved:**
Managing content consumption across interrupted sessions.

**Key UX Success Factors:**
- **One-click "Save to Watch Later":** Reduces decision paralysis
- **Queue persists across devices:** No data loss
- **Red progress bar on thumbnails:** Shows what you've watched
- **Resume from where you left off:** No friction on return
- **Chapter markers:** Skip to relevant parts (user control)
- **Autoplay can be disabled:** User choice, not forced engagement

**Why Relevant:**
Saving citations for later review and progress tracking across sessions match user workflow.

### Transferable UX Patterns

**Navigation Patterns:**

**Pattern 1: Breadcrumb "You Are Here" (Google Drive)**
- **Application:** Methodology progress tracker showing "Literature Review → Processing → Results"
- **Why it works:** Users always know position without hunting, reduces anxiety
- **Adaptation:** Visual stages with current step highlighted

**Pattern 2: Universal Search (Spotify/YouTube)**
- **Application:** Search across uploaded PDFs, generated literature review, citations
- **Why it works:** Reduces cognitive load, users don't need to remember organization
- **Adaptation:** Single search box that queries all content types

**Interaction Patterns:**

**Pattern 1: Large Drop Zone with Visual Feedback (Google Drive)**
- **Application:** PDF upload as primary entry point
- **Why it works:** Reduces anxiety about "where to drop," provides immediate confidence
- **Adaptation:** Entire screen becomes drop zone, subtle overlay appears, "Drop PDFs here" message

**Pattern 2: Background Processing with Minimal Status (Google Drive)**
- **Application:** AI literature review generation (4-minute processing)
- **Why it works:** Users can "go make coffee," trust it's working without babysitting
- **Adaptation:** Progress bar + "Processing 5 of 15 PDFs" + estimated time remaining

**Pattern 3: One-Click Save for Later (YouTube)**
- **Application:** Bookmark interesting citations or quotes while reviewing
- **Why it works:** Enables quick triage without decision paralysis
- **Adaptation:** Star/bookmark citations to review later or include in final paper

**Visual Patterns:**

**Pattern 1: Calm, Spacious White Background (Google Drive)**
- **Emotional goal:** Reduce anxiety, support Saturday morning coffee sessions
- **Why it works:** Doesn't compete for attention, lets content breathe
- **Adaptation:** Light color palette, generous padding, no aggressive colors

**Pattern 2: Progress Indicators Everywhere (Spotify/YouTube)**
- **Emotional goal:** Always know where you are, reduce uncertainty
- **Why it works:** Eliminates "am I done yet?" anxiety
- **Adaptation:** Progress on PDF processing, methodology stages, completion percentages

**Pattern 3: High Contrast for Primary Actions (Spotify)**
- **Platform:** Desktop-first web app
- **Why it works:** Primary action is obvious, secondary actions fade into background
- **Adaptation:** "Generate Literature Review" button is prominent, everything else is subtle

### Anti-Patterns to Avoid

**Anti-Pattern 1: Overwhelming Configuration Options**
- **Bad example:** Notion's infinite customization capabilities
- **Why to avoid:** Target users want outcomes, not options. Marie has 4-5 hours/week MAX.
- **Conflicts with:** Opinionated simplicity over flexible complexity principle

**Anti-Pattern 2: Hidden Progress or Silent Failures**
- **Bad example:** ChatGPT losing context without warning
- **Why to avoid:** Creates distrust and anxiety in already skeptical users
- **Conflicts with:** Trust through transparency principle, automatic intelligence principle

**Anti-Pattern 3: Aggressive Notifications or Time Pressure**
- **Bad example:** Duolingo's guilt-trip notifications and streak pressure
- **Why to avoid:** Users are already anxious about MBA deadlines
- **Conflicts with:** Calm confidence principle

**Anti-Pattern 4: Modal Dialogs That Block Work**
- **Bad example:** "Are you sure?" confirmations for every action
- **Why to avoid:** Interrupts flow, creates decision fatigue
- **Alternative:** Make actions reversible instead of blocking them

**Anti-Pattern 5: Complex Multi-Step Wizards**
- **Bad example:** "Step 1 of 7: Configure settings" onboarding flows
- **Why to avoid:** Marie wants to drag PDFs and get results, not configure settings
- **Conflicts with:** Zero-friction input principle

### Design Inspiration Strategy

**What to Adopt:**

**From Google Drive:**
- Large drop zone with visual feedback during drag (exactly matches PDF upload use case)
- Background processing with clear progress indicators
- Error messages that specify failure reason with retry options
- Breadcrumb "you are here" navigation for methodology stages
- Spacebar preview for quick PDF review without opening

**From Spotify:**
- Progress bars everywhere to reduce uncertainty
- Dark text on light background for long-form reading comfort
- High contrast for primary actions (CTA buttons)
- "Made for You" style personalization without configuration

**From YouTube:**
- "Save for later" pattern for bookmarking citations to review
- Resume from where you left off for returning users
- Progress indicators on thumbnails (which PDFs processed successfully)

**What to Adapt:**

**From Notion's slash commands:**
- **Original pattern:** `/table` to insert table, `/heading` for headings
- **Adaptation:** `/cite` to insert citation, `/quote` to insert quote from sources
- **Reason:** Power user feature for Nicolas (tech-savvy variant), invisible to Marie unless discovered
- **Implementation:** Optional enhancement, not required for core experience

**From Spotify's "Made for You" playlists:**
- **Original pattern:** AI-generated music playlists based on listening history
- **Adaptation:** AI-suggested next steps in methodology based on current progress
- **Reason:** Proactive guidance without overwhelming with options
- **Implementation:** Simple "What to do next" suggestions, not complex recommendations

**What to Avoid:**

**From Notion:**
- Infinite customization and template galleries (conflicts with opinionated simplicity)
- Blank canvas on first use (creates blank page paralysis)
- Complex database views and filters (Marie doesn't need this power)

**From Duolingo:**
- Streak pressure and guilt notifications (conflicts with calm confidence)
- Gamification badges and points (distracts from real goal: completing paper)
- Daily reminder notifications (users are already stressed about deadlines)

**From Complex Academic Tools:**
- Multi-step configuration wizards before use (conflicts with zero-friction input)
- Jargon-heavy academic language in UI (conflicts with non-academic user base)
- Required metadata fields before processing (friction at entry point)

**Strategy Summary:**

This inspiration strategy keeps research-assistant focused on core principles: calm confidence through spacious design, zero-friction input via large drop zones, trust through transparent progress and error handling, and guided simplicity by providing clear next steps without overwhelming configuration options.
