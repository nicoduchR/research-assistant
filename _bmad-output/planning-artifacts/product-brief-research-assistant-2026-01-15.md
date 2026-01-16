---
stepsCompleted: [1, 2, 3, 4, 5, 6]
workflowComplete: true
inputDocuments:
  - '_bmad-output/analysis/brainstorming-session-2026-01-15.md'
  - 'docs/methodology.md'
date: 2026-01-15
author: Nicolas
---

# Product Brief: research-assistant

## Executive Summary

**research-assistant** is an AI-powered web application that guides MBA students through academic research methodology—from problématique to defense-ready paper. Built by a working professional for working professionals, it transforms the overwhelming 12-month research journey into a guided, step-by-step process.

The core value proposition: **turn 40 hours of literature review into 2 hours**, while ensuring every citation is traceable and defensible.

Target users are industry professionals pursuing MBAs while working full-time—people who need a good grade and a completed paper, not a PhD in research methodology.

---

## Core Vision

### Problem Statement

MBA students from non-academic backgrounds face an impossible challenge: complete rigorous academic research while working full-time jobs, with only fragmented tools (EBSCO, ChatGPT, scattered PDFs) and methodology guides written for academics, not practitioners.

The current experience is one of confusion, fragmentation, and constant uncertainty: "Am I doing this right? What comes next? Is this paper even relevant?"

### Problem Impact

- **Financial risk**: Students risk losing 15,000+ euros in tuition if they fail
- **Time burden**: Literature review alone can consume 40+ hours that working professionals don't have
- **Emotional toll**: Constant feeling of being lost, imposter syndrome, drowning in academic jargon
- **Career delay**: Failed or delayed graduation impacts career advancement plans

### Why Existing Solutions Fall Short

| Solution | Why It Fails |
|----------|--------------|
| **EBSCO** | Database only—no guidance, no synthesis, no "what's next" |
| **ChatGPT** | Hallucinations, no methodology understanding, loses context, can't cite specific passages |
| **Zotero/Mendeley** | Reference management, not research guidance |
| **Methodology guides** | Written for academics, not time-starved professionals |

**The gap**: No tool combines document discovery + methodology guidance + citation traceability in one guided experience for non-academics.

### Proposed Solution

A web application that serves as a **research companion** for MBA students:

1. **Always know where you are**: Visual progress through methodology stages
2. **Always know what's next**: Plain-language guidance on the next action ("Find 10 papers using these keywords")
3. **Literature review automation**: AI-powered paper discovery, relevance scoring, and passage extraction—with full citation traceability
4. **One place for everything**: No more switching between EBSCO, ChatGPT, PDFs, and notes

Philosophy: **Opinionated simplicity over flexible complexity**. Don't make users learn methodology—just tell them what to do next.

### Key Differentiators

| Differentiator | Why It Matters |
|----------------|----------------|
| **Built by someone living the problem** | Real pain, not theoretical user research |
| **MBA-methodology-native** | Understands problématique → RDL → methodology → results flow |
| **Citation traceability** | Every AI-generated insight links to source + page number |
| **"Side quest" philosophy** | Respects that MBA is important but not users' main job |
| **Non-academic language** | Explains methodology in plain words, not academic jargon |
| **Guided workflow** | Proactive "do this next" vs. blank canvas |

---

## Target Users

### Primary Users

**Persona: "Marie" — The Time-Starved Professional**

| Attribute | Details |
|-----------|---------|
| **Role** | Product Manager at Valeo / Consultant at Hermès / Management role |
| **Industry** | Varies — automotive, luxury, consulting, finance, tech |
| **Age** | 28-45 |
| **MBA Context** | Part-time/Executive MBA while working full-time |
| **Available Time** | 4-5 hours/week for MBA work (max) |
| **Tech Savviness** | Low to moderate — not developers, comfortable with basic apps |
| **Family** | Many have partners, children — further time constraints |

**Goals:**
- Complete MBA research paper on time
- Get a good grade without becoming a methodology expert
- Understand where they are in the process at any moment
- Feel confident before tutor meetings

**Frustrations:**
- "I don't know if I'm doing this right"
- "I spent 4 hours and only found 2 relevant papers"
- "The methodology guide doesn't make sense to me"
- "I can't remember what I did 3 weeks ago"

**Biggest Fear:**
Not completing the research paper on time → failed year → 15,000€ lost → career setback

**Success Looks Like:**
"I dragged my PDFs in, went to make coffee, and came back to a draft literature review. This just saved me 20 hours."

---

**User Variant: "Nicolas" — The Tech-Savvy Builder**

A subset of users (like the product creator) are technically proficient. They may:
- Want keyboard shortcuts and power-user features
- Provide feedback on technical implementation
- Help evangelize to less technical classmates

However, the product must be designed for Marie first—Nicolas can adapt, Marie cannot.

### Secondary Users

N/A for v1 — Focus entirely on the primary MBA student user.

### User Journey

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Discovery  │───▶│  Onboarding │───▶│ Core Usage  │───▶│ Aha! Moment │───▶│  Routine    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

| Stage | Experience |
|-------|------------|
| **Discovery** | Word of mouth from classmates, WhatsApp group share |
| **Onboarding** | Open app → Select current stage → Input problématique (if known) |
| **Core Usage** | Saturday 2-hour session: App shows papers to review + suggests EBSCO search terms → User drags PDFs into app → AI processes and analyzes |
| **Aha! Moment** | Drag & drop 5 PDFs → 5 minutes later → Complete literature review draft with citations |
| **Routine** | Lunch break check-ins, weekend sessions, pre-tutor-call reviews for progress overview |

**Design Principle:** The product must deliver value within a 4-5 hour/week time budget. Every feature is evaluated against: "Does this respect Marie's time?"

---

## Success Metrics

### North Star Metric

**Users who complete their research paper on time**

This is the ultimate measure of success. If users graduate with their MBA because of this tool, everything else follows.

### User Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| **Time saved on literature review** | 40 hours → 2 hours (95% reduction) | Self-reported + session duration tracking |
| **Methodology progress velocity** | Steady advancement through stages | Days between methodology steps |
| **Research engagement** | Consistent weekly progress | Papers reviewed per week |
| **Completion rate** | 100% of active users finish on time | Users who submit final paper vs. users who started |

### Business Objectives

| Timeframe | Objective | Success Indicator |
|-----------|-----------|-------------------|
| **3 months** | Validated product-market fit | Nicolas actively using daily + 2-3 classmates testing |
| **12 months** | Sustainable business | 100 paying users |
| **Stretch goal** | Self-funded MBA | Revenue covers 15,000€ tuition |

### Key Performance Indicators

**Leading Indicators (predict success):**
- Weekly active users
- Papers uploaded per user per week
- Session frequency and duration
- Methodology step completion rate

**Lagging Indicators (confirm success):**
- Research papers completed on time
- Paying conversions from free tier
- Word-of-mouth referrals (new users from existing users)

### Business Model

| Element | Approach |
|---------|----------|
| **Pricing model** | Free tier + Paid (one-time payment) |
| **Free tier** | Core functionality to prove value |
| **Paid tier** | Full features / unlimited usage |
| **Target price** | TBD (validate willingness-to-pay with early users) |

### Success Validation Milestones

1. **Milestone 1:** Nicolas completes his own MBA research paper using the tool
2. **Milestone 2:** 3 classmates successfully use it and provide feedback
3. **Milestone 3:** First paying customer (not a friend)
4. **Milestone 4:** 10 paying users with positive retention
5. **Milestone 5:** 100 paying users, break-even on MBA tuition

---

## MVP Scope

### Core Features

**MVP Definition:** The smallest product that delivers the "40 hours → 2 hours" value proposition.

| Feature | Description | Why Essential |
|---------|-------------|---------------|
| **PDF Upload (Drag & Drop)** | Simple drag-and-drop interface for uploading research papers | Core input method—users manually find papers on EBSCO |
| **AI Literature Review Generation** | Process uploaded PDFs and generate structured literature review draft | THE killer feature—this is what saves 38 hours |
| **Citation Traceability** | Every generated statement links to source document + page number | Academic credibility—must be defensible to tutors |
| **Methodology Progress Tracker** | Visual dashboard showing current stage in research journey | "Where am I?"—reduces anxiety and confusion |
| **Next Step Guidance** | Plain-language explanation of what to do next | "What should I do now?"—guided workflow |

**MVP User Flow:**
```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Search EBSCO │───▶│ Download PDFs│───▶│ Drag & Drop  │───▶│ Get Lit Review│
│  (manually)  │    │  (manually)  │    │  into App    │    │   + Citations │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
```

### Out of Scope for MVP

| Feature | Reason for Deferral |
|---------|---------------------|
| **EBSCO Integration** | Complex API integration, paywall issues—users can search manually |
| **Auto-Paper Discovery** | AI paper recommendations require significant infrastructure |
| **Interview Guide Builder** | Methodology assistant for later research stages—not urgent for literature review |
| **Data Analysis Tools** | Comes after data collection—later in research journey |
| **Quantitative Analysis** | Specialized feature for quant research methods |
| **Multi-user Collaboration** | Solo tool first, collaboration later |
| **Mobile App** | Web-first, mobile can wait |

**Philosophy:** Say "no" to everything that doesn't directly enable the "drag PDFs → get literature review" magic.

### MVP Success Criteria

| Milestone | Success Indicator | Validation |
|-----------|-------------------|------------|
| **Technical Proof** | First literature review successfully generated | Core AI pipeline works |
| **Personal Validation** | Nicolas completes his own MBA paper using the tool | Dogfooding success |
| **Social Proof** | 3 classmates actively using it | Others find it valuable |
| **Quality Validation** | Generated reviews are defensible to tutors | Academic credibility confirmed |

**Go/No-Go Decision Point:** If 3+ classmates complete their literature review section using the tool and find it valuable, proceed to paid version development.

### Future Vision

**Phase 1 (MVP):** MBA research assistant for ESLSCA cohort
- Core literature review automation
- Methodology guidance
- Progress tracking

**Phase 2 (Post-MVP):** Enhanced research companion
- EBSCO/database integration
- Auto-paper discovery and recommendations
- Interview guide builder
- Data analysis tools

**Phase 3 (Scale):** All academic research
- Support for all research methodologies (qual, quant, mixed)
- Multiple languages
- Institution partnerships
- Global researcher community

**Long-term Vision (2-3 years):**
> "Every researcher in the world uses this tool to go from question to published paper."

From MBA side-project tool → Global academic research platform.
