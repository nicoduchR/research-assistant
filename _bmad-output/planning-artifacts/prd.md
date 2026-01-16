---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish', 'step-12-complete']
workflowComplete: true
inputDocuments:
  - '_bmad-output/planning-artifacts/product-brief-research-assistant-2026-01-15.md'
  - 'docs/methodology.md'
documentCounts:
  briefs: 1
  research: 0
  brainstorming: 0
  projectDocs: 1
classification:
  projectType: web_app
  domain: edtech
  complexity: low
  projectContext: greenfield
workflowType: 'prd'
date: 2026-01-15
author: Nicolas
---

# Product Requirements Document - research-assistant

**Author:** Nicolas
**Date:** 2026-01-15

## Executive Summary

**research-assistant** is an AI-powered web application that transforms MBA literature review from a 40-hour manual process into a 2-hour guided experience. Target users are working professionals pursuing MBAs who need to complete rigorous academic research while managing full-time jobs and families.

**Key Differentiator:** Unlike ChatGPT (which loses sources) or Zotero (which doesn't synthesize), research-assistant combines AI-powered literature synthesis with full citation traceability—every generated claim links to a specific PDF and exact page number, verifiable with one click.

**MVP Focus:** Drag-and-drop PDF upload → AI-generated literature review → click-to-verify citations. Everything else can wait.

## Success Criteria

### User Success

| Criteria | Target | Measurement |
|----------|--------|-------------|
| **Perceived time savings** | "40 hours → 2 hours" feeling | Qualitative feedback, testimonials |
| **Literature review completion** | Users generate usable drafts | Completion of drag-drop → output flow |
| **Citation confidence** | Users trust AI-generated citations | Click-to-verify usage, tutor acceptance |
| **Methodology clarity** | Users know "where am I" and "what's next" | Reduced tutor meeting anxiety (qualitative) |

### Business Success

| Timeframe | Target | Validation |
|-----------|--------|------------|
| **3 months** | Nicolas completes own MBA paper + 2-3 classmates testing | Dogfooding + early adopter feedback |
| **12 months** | 100 paying users | Revenue tracking |
| **Stretch** | 15,000€ revenue (MBA tuition covered) | Break-even milestone |

### Technical Success

| Criteria | Target | Rationale |
|----------|--------|-----------|
| **PDF processing time** | Minutes (not seconds) | Acceptable for AI processing |
| **Citation source accuracy** | 100% correct PDF linking | Academic credibility requirement |
| **Page number accuracy** | Exact page | Click-to-verify must work |
| **PDF viewer** | Side panel with page navigation | Inline verification UX |

### Measurable Outcomes

- **North Star:** Users complete their research paper on time
- **Leading indicators:** PDFs uploaded per week, sessions per user, literature review sections generated
- **Lagging indicators:** Papers completed, paying conversions, word-of-mouth referrals

## Product Scope

*See [Project Scoping & Phased Development](#project-scoping--phased-development) for detailed scope decisions, risk mitigation, and emergency cut options.*

### MVP - Minimum Viable Product

| Feature | Description |
|---------|-------------|
| **PDF Upload (Drag & Drop)** | Simple drag-and-drop interface for research papers |
| **AI Literature Review Generation** | Process PDFs → generate structured literature review draft |
| **Citation Traceability** | Every statement links to source PDF + exact page number |
| **Click-to-Verify** | Click citation → PDF opens in side panel at correct page |
| **Methodology Progress Tracker** | Simple "you are here" indicator showing current stage |
| **Next Step Guidance** | Static predefined steps for current stage |

### Growth Features (Post-MVP)

- EBSCO/database integration (automated search)
- Auto-paper discovery and recommendations
- Interview guide builder
- Data analysis tools

### Vision (Future)

- Support all research methodologies (qual, quant, mixed)
- Multiple languages
- Institution partnerships
- Global researcher community

## User Journeys

### Journey 1: Marie's Saturday Morning (Primary - Success Path)

**Opening Scene:**
It's Saturday, 7 AM. Marie, a Product Manager at Valeo, has been awake since 6:30 - the only quiet time before her kids wake up. Her MBA research paper is due in 8 weeks. She has 15 PDFs downloaded from EBSCO sitting in a folder, unread. She's already behind. Her tutor meeting is Monday, and she has nothing to show.

She opens the app, coffee in hand.

**Rising Action:**
She drags all 15 PDFs into the upload zone. A progress indicator shows the AI is processing. She goes to refill her coffee - 4 minutes pass.

She returns to find a structured literature review draft with themes extracted, key arguments summarized, and every statement linked to a source. She clicks a citation - the PDF opens in the side panel, scrolled to the exact page. "That's actually what the author said," she thinks.

**Climax:**
She realizes she just did in 5 minutes what would have taken her 3 weekends. She can actually *read* the synthesis, understand the debates, and prepare intelligent questions for her tutor.

**Resolution:**
Monday's tutor meeting goes well. She speaks confidently about the literature. The tutor asks where a claim comes from - she pulls up the app, clicks the citation, shows the exact page. "Well-researched," the tutor says.

Marie texts her classmate: "You HAVE to try this app."

---

### Journey 2: Marie's Panic Mode (Primary - Edge Case / Error Recovery)

**Opening Scene:**
It's Thursday night, 11 PM. Marie's tutor meeting is tomorrow at 9 AM. She just realized she never processed the 5 new papers her tutor recommended. She drags them into the app, exhausted and anxious.

**Rising Action:**
The processing starts, but one PDF fails - it's a scanned document with poor OCR quality. The app flags it: "Unable to extract text reliably from 'Smith_2019_scan.pdf' - document may be image-based."

Marie panics. She needs that paper - it's the one her tutor specifically mentioned.

**Climax:**
She notices the other 4 PDFs processed successfully. The literature review draft shows a gap: "Note: Smith (2019) referenced but not processed - manual review recommended."

She decides to manually skim Smith's paper for 20 minutes and adds two key quotes herself. Not ideal, but she's not blocked.

**Resolution:**
At the tutor meeting, she presents the synthesized literature confidently. When Smith (2019) comes up, she has her manual notes ready. The tutor doesn't notice the difference.

Marie thinks: "The app saved me 4 hours even when it couldn't handle everything."

---

### Journey 3: Nicolas's Power User Session (Variant - Tech-Savvy User)

**Opening Scene:**
Nicolas is building his literature review at 10 PM after work. He has 25 papers organized by theme in three folders. He wants to process them separately to compare how the AI groups arguments.

**Rising Action:**
He drags the first folder (8 papers on "knowledge management"). Processing completes. He scans the output, notices a citation seems slightly off - the page number is 47, but he remembers the quote being on page 45.

He clicks the citation - PDF opens to page 47. He scrolls up - the actual quote is on page 45. The AI grabbed a related passage, not the exact one.

**Climax:**
He edits the citation manually, fixing the page number. He thinks: "I should flag this for the next version." He processes the next two folders, comparing the outputs side-by-side.

**Resolution:**
Nicolas finishes with a comprehensive literature review that took 2 hours instead of 20. He has notes on 3 edge cases where citations needed manual correction. He adds these to a feedback list for improving the app.

He messages his classmate Marie: "Try it this weekend. It's not perfect but it's 10x faster."

---

### Journey Requirements Summary

| Journey | Capabilities Revealed |
|---------|----------------------|
| **Marie Success** | PDF upload, AI processing, literature review generation, citation linking, PDF side-panel viewer, page navigation |
| **Marie Edge Case** | Error handling for bad PDFs, graceful degradation, clear error messaging, ability to continue with partial results |
| **Nicolas Power User** | Multi-batch processing, citation editing/correction, manual override capability, feedback mechanism (future) |

## Innovation & Novel Patterns

### Detected Innovation Areas

**Primary Innovation: Integrated AI-Powered Research Workflow**

The product innovates through *combination*, not individual technology breakthroughs:

| Innovation Aspect | Description |
|-------------------|-------------|
| **AI + Traceability** | AI-generated synthesis where every claim links to source PDF + exact page - unlike ChatGPT which loses sources |
| **Click-to-Verify UX** | Instant verification: click citation → PDF opens in side panel at correct page - unique to academic tools |
| **Methodology-Native Design** | Built around MBA research stages (problématique → RDL → methodology → results), not generic document management |
| **Non-Academic Language** | Designed for working professionals, not PhD researchers - plain language guidance |

**Competitive Gap Being Filled:**
- ChatGPT: Synthesizes but hallucinates and loses sources
- Zotero/Mendeley: Organizes but doesn't synthesize
- EBSCO: Searches but doesn't guide or process
- Methodology guides: Inform but don't integrate into workflow

### Validation Approach

| Risk | Validation Method |
|------|-------------------|
| **Citation accuracy** | Test with real MBA papers; measure page-number precision against manual verification |
| **AI synthesis quality** | Dogfooding with Nicolas's own paper; tutor acceptance as quality gate |
| **Time savings claim** | Track actual usage time vs. user estimates of manual effort |

### Risk Mitigation

| Risk | Mitigation |
|------|------------|
| **Page number extraction fails** | Flag uncertain citations rather than guess; allow manual correction |
| **AI synthesis misrepresents source** | Click-to-verify lets users catch errors; design encourages verification |
| **Scanned/image PDFs** | Clear error messaging; graceful degradation (process what's possible) |

## Web App Specific Requirements

### Project-Type Overview

**Architecture:** Next.js hybrid SPA with App Router
- Server-side rendering for landing/marketing pages
- Client-side interactivity for core research interface
- Monorepo structure for code organization
- Deployment via existing infrastructure

**Target Environment:** Desktop-first modern browsers

### Technical Architecture Considerations

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| **Framework** | Next.js (App Router) | Familiar stack, hybrid SSR/SPA, easy API routes |
| **Rendering** | CSR for app, SSR for landing | Interactive app doesn't need SSR; landing page benefits from it |
| **State Management** | TBD (React context or Zustand) | Depends on complexity; start simple |
| **Real-time** | WebSocket or SSE | Live progress bar during PDF processing |

### Browser Support Matrix

| Browser | Version | Support Level |
|---------|---------|---------------|
| Chrome | Latest 2 versions | Full |
| Firefox | Latest 2 versions | Full |
| Safari | Latest 2 versions | Full |
| Edge | Latest 2 versions | Full |
| IE / Legacy | - | Not supported |

### Responsive Design

| Viewport | Support Level | Notes |
|----------|---------------|-------|
| Desktop (1024px+) | Full | Primary experience |
| Tablet (768-1023px) | Basic | Functional but not optimized |
| Mobile (<768px) | Minimal | Not a priority for MVP |

### Performance Targets

| Metric | Target | Rationale |
|--------|--------|-----------|
| **Initial load (LCP)** | < 2.5s | Standard web vitals |
| **Time to interactive** | < 3s | Users should be able to drag PDFs quickly |
| **PDF processing feedback** | Real-time | Progress bar updates via WebSocket/SSE |

### SEO Strategy

| Element | Approach |
|---------|----------|
| **Landing page** | Basic SEO - meta tags, Open Graph, structured data |
| **App pages** | No SEO needed (authenticated experience) |
| **Effort level** | Low - leverage Next.js defaults |

### Accessibility Level

| Aspect | MVP Approach |
|--------|--------------|
| **Keyboard navigation** | Basic - tab through main UI elements |
| **Screen readers** | Semantic HTML, basic ARIA where obvious |
| **Color contrast** | Reasonable defaults, no audit |
| **WCAG compliance** | Best effort, not certified |

### Implementation Considerations

- **PDF viewer integration:** Client-side library (pdf.js or react-pdf) for side-panel rendering
- **File upload:** HTML5 drag-and-drop API with dropzone library
- **Progress updates:** Server-Sent Events (simpler than WebSocket for one-way updates)
- **API routes:** Next.js API routes for PDF processing orchestration

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Problem-Solving MVP
- Focus on solving one painful problem exceptionally well: "40 hours → 2 hours" literature review
- Ship the smallest thing that delivers the core "aha moment": drag PDFs → get cited literature review
- Validate with real usage (Nicolas's own MBA paper) before expanding

**Core Principle:** If citation traceability works, everything else can be added. If it doesn't, nothing else matters.

### MVP Feature Set (Phase 1)

**Core User Journey Supported:** Marie's Saturday Morning (primary success path)

**Must-Have Capabilities:**

| Feature | MVP Implementation | Why Essential |
|---------|-------------------|---------------|
| **PDF Upload** | Drag-and-drop, multiple files | Entry point to the app |
| **AI Literature Review** | Process PDFs → structured synthesis | THE killer feature |
| **Citation Traceability** | Every claim links to PDF + exact page | Academic credibility |
| **Click-to-Verify** | PDF side panel, navigate to page | Defensibility to tutors |
| **Progress Indicator** | Simple "you are here" text | Minimal orientation |
| **Next Step Guidance** | Static predefined steps | Basic direction |

**Explicitly NOT in MVP:**
- Full visual methodology dashboard
- Dynamic AI-powered next step suggestions
- EBSCO integration
- Multi-user collaboration
- Mobile optimization

### Post-MVP Features

**Phase 2 (Growth):**
- Full methodology progress tracker (visual dashboard)
- Dynamic next step guidance (AI-powered suggestions)
- Enhanced PDF handling (better OCR, scanned document support)
- User accounts and saved projects

**Phase 3 (Expansion):**
- EBSCO/database integration
- Auto-paper discovery and recommendations
- Interview guide builder
- Data analysis tools
- Multiple languages
- Institution partnerships

### Risk Mitigation Strategy

| Risk Type | Risk | Mitigation |
|-----------|------|------------|
| **Technical** | Citation page-number accuracy | Flag uncertain citations; allow manual correction; design encourages verification |
| **Technical** | Scanned/image PDFs fail | Clear error messaging; graceful degradation; process what's possible |
| **Market** | Users don't trust AI output | Click-to-verify makes every claim auditable; builds trust through transparency |
| **Resource** | Less time than planned | Cut methodology tracker entirely; ship literature review + citations only |

### Minimum Viable Scope (Emergency Cut)

If severely resource-constrained, the absolute minimum is:
1. PDF upload (drag-and-drop)
2. AI literature review generation
3. Citation linking (PDF + page number)
4. Click-to-verify (PDF viewer)

No progress tracking, no guidance - just the core magic.

## Functional Requirements

### Document Management

- **FR1:** User can upload PDF documents via drag-and-drop
- **FR2:** User can upload multiple PDF documents simultaneously
- **FR3:** User can view list of uploaded documents
- **FR4:** User can remove documents from their collection
- **FR5:** System can extract text content from PDF documents

### AI Literature Review

- **FR6:** User can initiate AI processing on uploaded documents
- **FR7:** System can generate structured literature review synthesis from multiple PDFs
- **FR8:** System can identify themes and group related arguments across documents
- **FR9:** User can view generated literature review output
- **FR10:** User can edit generated literature review content

### Citation Traceability

- **FR11:** System can link each generated claim to its source PDF
- **FR12:** System can identify exact page number for each citation
- **FR13:** User can see citation reference for any generated statement
- **FR14:** User can manually correct citation information
- **FR15:** System can flag citations with uncertain page accuracy

### PDF Viewer & Verification

- **FR16:** User can view PDF documents in side panel
- **FR17:** User can navigate to specific page in PDF viewer
- **FR18:** User can click citation to open source PDF at referenced page
- **FR19:** User can scroll and navigate within PDF viewer
- **FR20:** User can close PDF viewer panel

### Progress & Status

- **FR21:** User can see current processing status during AI generation
- **FR22:** User can see real-time progress updates during PDF processing
- **FR23:** User can see current position in research methodology stages
- **FR24:** User can view predefined next steps for current stage

### Error Handling

- **FR25:** System can detect unprocessable PDFs (scanned/image-based)
- **FR26:** User can see clear error message when PDF processing fails
- **FR27:** System can continue processing remaining documents when one fails
- **FR28:** User can see which documents succeeded and which failed

### User Authentication

- **FR29:** User can sign in using Google account (OAuth)
- **FR30:** User can sign out of their account
- **FR31:** User's uploaded documents are associated with their account
- **FR32:** User can access their documents from any device after signing in

## Non-Functional Requirements

### Performance

| Requirement | Target | Rationale |
|-------------|--------|-----------|
| **Initial page load** | < 3 seconds (LCP) | Standard web vitals |
| **UI responsiveness** | < 200ms for user actions | Drag-drop, clicks feel instant |
| **PDF processing** | No strict limit | Users expect AI processing to take time; progress bar manages expectations |

### Security

| Requirement | Target | Rationale |
|-------------|--------|-----------|
| **Transport encryption** | HTTPS only | Standard for any web app with auth |
| **Authentication** | Google OAuth 2.0 | Secure, no password storage needed |
| **PDF storage** | Server-side, user-scoped access | Users can only access their own documents |
| **Session management** | Secure cookies, reasonable expiry | Standard auth best practices |

### Reliability

| Requirement | Target | Rationale |
|-------------|--------|-----------|
| **Processing recovery** | User can leave and return to see results | Async jobs persist on backend; state survives browser close |
| **Data persistence** | User documents survive server restart | PDFs and generated content stored durably |
| **Graceful degradation** | Partial failures don't block entire workflow | One bad PDF doesn't crash everything |

### Not Prioritized for MVP

- **Scalability**: 100-user scale doesn't require special architecture
- **Accessibility**: Best effort (covered in web app requirements)
- **High availability**: Single-server deployment acceptable for MVP
