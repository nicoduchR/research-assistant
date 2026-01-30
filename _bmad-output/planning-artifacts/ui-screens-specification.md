# research-assistant - UI Screens Specification

**Project:** research-assistant - AI-Powered MBA Literature Review Assistant
**Author:** Nicolas
**Date:** 2026-01-30
**Design System:** Desktop-first web application optimized for calm, guided research workflow

---

## Design System Foundation

### Color Palette

**Primary Colors:**
- **Calm Blue** (#4A90E2) - Primary actions, trust-building elements, progress indicators
- **Deep Navy** (#2C3E50) - Text, headers, serious academic credibility
- **Soft White** (#FAFBFC) - Main background, spacious calm design
- **Warm Gray** (#95A5A6) - Secondary text, subtle borders, non-critical elements

**Semantic Colors:**
- **Success Green** (#27AE60) - Citation verified, processing complete, positive feedback
- **Warning Amber** (#F39C12) - Uncertain citations flagged, partial results, attention needed
- **Error Red** (#E74C3C) - Processing failed, invalid PDFs, unrecoverable errors
- **Processing Purple** (#9B59B6) - AI processing active, background operations

**Emotional Rationale:**
- Calm Blue: Builds trust and reduces anxiety (primary emotional goal)
- Soft White: Spacious, breathable design for Saturday morning coffee sessions
- Warm Gray: Non-aggressive secondary elements that don't compete for attention
- Deep Navy: Academic credibility and professionalism

### Typography

**Font Family:**
- **Primary:** Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
- **Code/Citations:** "JetBrains Mono", Consolas, Monaco, monospace

**Type Scale:**
- **H1 (Page Titles):** 32px / 2rem, Bold (600), Deep Navy, 1.3 line-height
- **H2 (Section Headers):** 24px / 1.5rem, Semibold (600), Deep Navy, 1.4 line-height
- **H3 (Subsection Headers):** 18px / 1.125rem, Semibold (600), Deep Navy, 1.5 line-height
- **Body Text:** 16px / 1rem, Regular (400), Deep Navy, 1.6 line-height (reading-optimized)
- **Small Text:** 14px / 0.875rem, Regular (400), Warm Gray, 1.5 line-height
- **Citations:** 14px / 0.875rem, Regular (400), Calm Blue (clickable), monospace

**Reading Optimization:**
- Line-height 1.6 for body text (long-form reading comfort)
- Maximum content width: 720px (optimal reading line length)
- Generous padding: 24px minimum around text blocks

### Spacing & Layout

**Base Unit:** 8px

**Spacing Scale:**
- **XS:** 4px (tight element spacing)
- **SM:** 8px (standard element spacing)
- **MD:** 16px (section spacing)
- **LG:** 24px (major section spacing)
- **XL:** 32px (page-level spacing)
- **XXL:** 48px (hero sections)

**Layout Grid:**
- **Desktop (1024px+):** 12-column grid, 24px gutters
- **Tablet (768-1023px):** 8-column grid, 16px gutters
- **Mobile (<768px):** 4-column grid, 12px gutters (minimal support)

**Component Spacing:**
- Cards: 24px padding, 8px border-radius, subtle shadow (0 2px 8px rgba(0,0,0,0.08))
- Buttons: 12px vertical, 24px horizontal padding, 6px border-radius
- Form inputs: 12px vertical, 16px horizontal padding, 6px border-radius

### Iconography

**Icon Library:** Lucide Icons (consistent, modern, open-source)

**Icon Sizes:**
- **Small:** 16px (inline with text)
- **Medium:** 24px (standard UI elements)
- **Large:** 32px (feature icons, empty states)
- **Hero:** 48px (landing page features)

**Common Icons:**
- Upload: `upload-cloud`
- Processing: `loader` (animated spin)
- Success: `check-circle`
- Error: `alert-circle`
- Citation: `quote`
- PDF: `file-text`
- Verify: `external-link`
- Progress: `trending-up`
- Guidance: `compass`

### Interactive States

**Button States:**
- **Default:** Calm Blue background, white text, subtle shadow
- **Hover:** Darker blue (#3A7BC8), slightly larger shadow
- **Active:** Pressed appearance, reduced shadow
- **Disabled:** Warm Gray background, reduced opacity (0.5)
- **Loading:** Processing Purple background, spinning loader icon

**Link States:**
- **Default:** Calm Blue, underline on hover
- **Visited:** Deep Navy (maintain consistency)
- **Active:** Darker blue

**Focus States:**
- **Keyboard Navigation:** 2px solid Calm Blue outline, 4px offset
- **Accessibility:** High contrast mode compatible

### Animations & Transitions

**Timing:**
- **Fast:** 150ms (hover states, button clicks)
- **Standard:** 300ms (panel slides, modal appearances)
- **Slow:** 500ms (page transitions, complex animations)

**Easing:**
- **Ease-out:** User-initiated actions (buttons, clicks)
- **Ease-in-out:** System-initiated changes (loading states, processing)

**Key Animations:**
- **PDF Drop Zone:** Subtle scale + opacity change on drag-over (150ms ease-out)
- **Processing Spinner:** Continuous rotation (1s linear infinite)
- **Citation Click:** PDF panel slides in from right (300ms ease-out)
- **Progress Bar:** Smooth width transition (500ms ease-in-out)
- **Success State:** Check icon fade-in + scale (300ms ease-out)

---

## Flow 0: Landing Page (Marketing Entry)

### Écran 0.1: Landing Page

**Objectif:** Convert anxious MBA students from "skeptical visitor" to "willing to try" in under 30 seconds.

**Target User:** Marie at 7 AM Saturday, coffee in hand, overwhelmed by 15 unread PDFs, tutor meeting Monday, skeptical of AI promises.

**Emotional Goal:** Immediate reassurance through clarity: "This is exactly what I need and it's simpler than I thought."

**Layout Structure:**
- **Hero Section:** Full-screen, minimal, single clear CTA
- **Problem/Solution:** Two-column comparison (before/after)
- **How It Works:** 3-step visual process
- **Trust Signals:** Citation verification demo, testimonial (later), CTA
- **Footer:** Minimal (Privacy, Terms, Contact)

**Key Elements:**

1. **Hero Section:**
   - H1: "Complete Your MBA Literature Review in 2 Hours, Not 40"
   - Subheading: "AI-powered synthesis with verifiable citations. Every claim traceable to exact page numbers."
   - Primary CTA: "Try It Free" (Calm Blue, prominent, 18px text)
   - Visual: Simple illustration of PDFs → AI → Literature Review (not screenshot, abstract)

2. **Problem/Solution:**
   - Left: "Before" (red tint overlay)
     - 40 hours reading irrelevant papers
     - Synthesis paralysis (blank page anxiety)
     - Citation confidence issues
   - Right: "After" (green tint overlay)
     - Drag PDFs, get structured review in 4 minutes
     - AI synthesis with themes extracted
     - Click citation → exact page opens

3. **How It Works:**
   - Step 1: Drag PDFs (icon: upload-cloud)
   - Step 2: AI processes in 4 minutes (icon: loader)
   - Step 3: Verify every citation (icon: check-circle)

4. **Trust Builder:**
   - "Every AI-generated claim links to source PDF + exact page number"
   - Interactive demo: Click citation → see PDF panel slide in
   - Badge: "Built for MBA Students by an MBA Student"

5. **Final CTA:**
   - "Start Your Literature Review Now"
   - Subtext: "No credit card. No setup. Just drag and drop."

**États:**
- Default (described above)
- Mobile responsive (single column, reduced hero)

---

### PROMPT POUR GOOGLE STITCH - ÉCRAN 0.1 (LANDING PAGE)

```
Create a modern, calming landing page for "research-assistant" - an AI-powered MBA literature review tool. Desktop-first design (1440px canvas).

DESIGN SYSTEM:
- Primary color: Calm Blue (#4A90E2) for trust-building CTAs and links
- Background: Soft White (#FAFBFC) spacious, breathing design
- Text: Deep Navy (#2C3E50) for headers, Warm Gray (#95A5A6) for secondary
- Typography: Inter font family, H1 32px bold, body 16px regular, 1.6 line-height for reading comfort
- Icons: Lucide icon style, 32px for features, simple line-based
- Spacing: Generous 48px between major sections, 24px padding around content blocks
- Buttons: Calm Blue background, white text, 12px vertical/24px horizontal padding, 6px border-radius, subtle shadow

LAYOUT:
Full-width hero section (100vh), then scrollable sections with max-width 1200px centered.

HERO SECTION (top of page):
- H1 centered: "Complete Your MBA Literature Review in 2 Hours, Not 40"
- Subheading: "AI-powered synthesis with verifiable citations. Every claim traceable to exact page numbers."
- Primary CTA button: "Try It Free" (prominent, Calm Blue, 18px text)
- Simple abstract illustration below: 3 icons in horizontal row with arrows between them:
  - Left: Stack of PDF documents (upload-cloud icon, 48px)
  - Middle: AI processing symbol (loader icon with subtle glow, 48px)
  - Right: Structured document with checkmarks (file-text + check-circle, 48px)
- Emotional tone: Calm, spacious, reassuring (reduce anxiety immediately)

PROBLEM/SOLUTION SECTION:
Two-column layout with subtle divider line.

Left column ("Before" - light red tint background #FFF5F5):
- Header: "The Old Way" (18px semibold)
- Pain points list with X icons (Error Red):
  - "40 hours reading irrelevant papers"
  - "Synthesis paralysis and blank page anxiety"
  - "Citation confidence issues"

Right column ("After" - light green tint background #F0FFF4):
- Header: "With research-assistant" (18px semibold)
- Benefits list with check icons (Success Green):
  - "Drag PDFs, get structured review in 4 minutes"
  - "AI synthesis with themes extracted automatically"
  - "Click any citation → exact page opens instantly"

HOW IT WORKS SECTION:
Header: "How It Works" (24px semibold, centered)
Three-step horizontal layout with numbered circles:

Step 1:
- Large upload-cloud icon (32px, Calm Blue)
- Number badge: "1" (circle, Calm Blue background)
- Title: "Upload PDFs"
- Description: "Drag and drop your research papers"

Step 2:
- Large loader icon (32px, Processing Purple)
- Number badge: "2"
- Title: "AI Processes"
- Description: "4-minute intelligent synthesis"

Step 3:
- Large check-circle icon (32px, Success Green)
- Number badge: "3"
- Title: "Verify Citations"
- Description: "Click to see exact source pages"

TRUST BUILDER SECTION:
Centered content block with light background card (subtle shadow).
- Header: "Every Claim Is Verifiable"
- Description: "Unlike ChatGPT which loses sources, every AI-generated statement links to source PDF + exact page number"
- Visual mockup (simplified): Small example of clickable citation showing page reference
- Badge/label: "Built for MBA Students by an MBA Student"

FINAL CTA SECTION:
Centered, spacious:
- Large CTA button: "Start Your Literature Review Now" (Calm Blue, 18px)
- Subtext below: "No credit card. No setup. Just drag and drop." (14px, Warm Gray)

FOOTER:
Minimal, centered text links (14px, Warm Gray):
- Privacy Policy | Terms of Service | Contact

OVERALL VISUAL STYLE:
- Clean, minimal, modern
- Generous white space (reduce anxiety, create calm)
- Soft shadows (0 2px 8px rgba(0,0,0,0.08)) on cards
- No aggressive colors or timers
- Saturday morning coffee session vibe - unhurried, contemplative
- Desktop-first (1440px width), clean responsive behavior for tablet/mobile

EMOTIONAL DESIGN GOALS:
- Immediate reassurance: "This is simpler than you think"
- Trust through transparency (citation verification emphasized)
- Calm confidence (no aggressive timers or pressure)
- Professional credibility (academic context, clean design)
```

---

## Component Library

### PROMPT POUR GOOGLE STITCH - COMPONENT LIBRARY

```
Create a comprehensive component library for "research-assistant" - desktop-first web app for MBA literature review. All components should embody "calm confidence" and "guided simplicity" principles.

DESIGN SYSTEM (use consistently across ALL components):

Colors:
- Primary: Calm Blue (#4A90E2)
- Background: Soft White (#FAFBFC)
- Text Primary: Deep Navy (#2C3E50)
- Text Secondary: Warm Gray (#95A5A6)
- Success: Success Green (#27AE60)
- Warning: Warning Amber (#F39C12)
- Error: Error Red (#E74C3C)
- Processing: Processing Purple (#9B59B6)

Typography:
- Font: Inter, system fallbacks
- H1: 32px bold, Deep Navy
- H2: 24px semibold, Deep Navy
- H3: 18px semibold, Deep Navy
- Body: 16px regular, Deep Navy, 1.6 line-height
- Small: 14px regular, Warm Gray
- Citation: 14px monospace, Calm Blue

Spacing: Base unit 8px (XS:4px, SM:8px, MD:16px, LG:24px, XL:32px, XXL:48px)

Icons: Lucide style, sizes 16px/24px/32px/48px

---

COMPONENTS TO CREATE (show all states for each):

1. PRIMARY BUTTON
   - Default state: Calm Blue background, white text, 12px vertical/24px horizontal padding, 6px border-radius, subtle shadow (0 2px 8px rgba(0,0,0,0.08))
   - Hover state: Darker blue (#3A7BC8), slightly larger shadow
   - Active state: Pressed appearance, reduced shadow
   - Disabled state: Warm Gray background, 50% opacity
   - Loading state: Processing Purple background, spinning loader icon (16px, white)
   - Example text: "Generate Literature Review"

2. SECONDARY BUTTON
   - Default state: White background, Calm Blue text, Calm Blue 2px border, same padding/radius as primary
   - Hover state: Light blue background (#EBF5FB), Calm Blue border
   - Active state: Slightly darker blue background
   - Disabled state: Warm Gray text, gray border, 50% opacity
   - Example text: "Cancel"

3. TEXT LINK
   - Default: Calm Blue text, no underline
   - Hover: Calm Blue text, underline appears
   - Active: Darker blue (#3A7BC8)
   - Visited: Deep Navy (maintain consistency)
   - Example: "Learn more about citations"

4. PDF UPLOAD DROP ZONE
   - Default state: Large dashed border (2px, Warm Gray), 48px padding, center-aligned content
     - Icon: upload-cloud (48px, Warm Gray)
     - Text: "Drag PDFs here or click to browse" (16px, Warm Gray)
     - Subtext: "Supports multiple files" (14px, lighter gray)
   - Drag-over state: Dashed border becomes solid Calm Blue (3px), background tint (#EBF5FB), icon/text change to Calm Blue
     - Text: "Drop PDFs to upload"
   - Processing state: Solid border (Success Green), icon changes to loader (spinning), progress bar appears
   - Error state: Solid border (Error Red), alert-circle icon, error message

5. PROGRESS BAR
   - Container: Full width, 8px height, Warm Gray background (#E8E8E8), 4px border-radius
   - Fill: Calm Blue, smooth animation (500ms ease-in-out), same border-radius
   - With percentage: Show "Processing: 65%" above bar (14px, Warm Gray)
   - States: Processing (Calm Blue), Success (Success Green), Error (Error Red)

6. FILE LIST ITEM (Uploaded PDF)
   - Container: White background, 16px padding, 6px border-radius, 1px border (Warm Gray #E0E0E0)
   - Left: PDF icon (file-text, 24px, Calm Blue)
   - Center: Filename (16px, Deep Navy), file size below (14px, Warm Gray)
   - Right: Status indicator
     - Success: check-circle icon (24px, Success Green)
     - Processing: loader icon spinning (24px, Processing Purple)
     - Error: alert-circle icon (24px, Error Red)
   - Hover: Subtle shadow appears
   - Action: Small X button (top-right, 16px) to remove file

7. CITATION LINK (Clickable)
   - Default: Inline text with superscript number in brackets, Calm Blue, monospace font
     - Example: "[Smith, 2019, p.47]"
   - Hover: Underline appears, external-link icon (12px) appears next to it
   - Active: Opens PDF panel (show arrow pointing right to indicate action)
   - Tooltip on hover: "Click to verify source"

8. PDF VIEWER PANEL (Side Panel)
   - Container: Slides in from right, 400px width, white background, full height, subtle shadow on left edge
   - Header: Deep Navy background, 16px padding
     - Title: PDF filename (16px, white text)
     - Close button: X icon (24px, white, top-right)
   - Body: PDF render area with scroll
   - Footer: Page navigation
     - "Page 47 of 152" centered (14px, Warm Gray)
     - Left/right arrow buttons (24px icons)

9. METHODOLOGY PROGRESS TRACKER
   - Horizontal breadcrumb-style layout with 5 stages
   - Each stage: Circle (32px) with icon + label below
     - Completed stage: Success Green circle, white check icon, green text
     - Current stage: Calm Blue circle, white icon, bold blue text, pulsing subtle animation
     - Future stage: Warm Gray circle, gray icon, gray text
   - Connecting lines between circles (2px, color matches left stage)
   - Stages: "Upload" → "Process" → "Review" → "Verify" → "Export"

10. NEXT STEP GUIDANCE CARD
    - Container: Light blue background (#EBF5FB), 24px padding, 8px border-radius, compass icon (24px, Calm Blue) top-left
    - Header: "What's Next" (18px semibold, Deep Navy)
    - Step list (numbered):
      - "1. Review the generated literature review below"
      - "2. Click citations to verify sources"
      - "3. Edit or refine as needed"
    - Each step: 16px text, 8px spacing between
    - Bottom CTA: "Start Reviewing" button (primary style)

11. ERROR MESSAGE CARD
    - Container: Light red background (#FFF5F5), Error Red left border (4px), 24px padding, 8px border-radius
    - Icon: alert-circle (24px, Error Red), top-left
    - Header: "Processing Failed" (18px semibold, Error Red)
    - Message: "Unable to extract text from 'Smith_2019_scan.pdf' - document may be image-based." (16px, Deep Navy)
    - Actions: "Try Another File" button (secondary style) or "Continue Anyway" link

12. SUCCESS MESSAGE CARD
    - Container: Light green background (#F0FFF4), Success Green left border (4px), 24px padding, 8px border-radius
    - Icon: check-circle (24px, Success Green), top-left
    - Header: "Literature Review Complete" (18px semibold, Success Green)
    - Message: "Generated in 4 minutes. Estimated manual time: 40 hours." (16px, Deep Navy)
    - Subtext: "15 PDFs processed, 47 citations extracted" (14px, Warm Gray)

13. PROCESSING SPINNER (Loading State)
    - Center-aligned container
    - Spinning loader icon (48px, Processing Purple), continuous rotation (1s linear infinite)
    - Text below: "Processing PDFs..." (16px, Warm Gray)
    - Subtext: "This may take 4-5 minutes" (14px, lighter gray)

14. EMPTY STATE (No PDFs Uploaded)
    - Center-aligned container, generous spacing
    - Icon: upload-cloud (64px, Warm Gray)
    - Header: "No PDFs Uploaded Yet" (24px semibold, Deep Navy)
    - Description: "Drag and drop your research papers to get started" (16px, Warm Gray)
    - CTA: "Browse Files" button (primary style)

15. TOOLTIP
    - Container: Dark background (Deep Navy 90% opacity), white text, 8px padding, 4px border-radius
    - Small arrow pointing to element
    - Text: 14px, white
    - Example: "Click to verify this citation in source PDF"
    - Appears on hover with 150ms delay

LAYOUT EXAMPLES:
Show each component in isolation with all states visible side-by-side for easy reference.

VISUAL CONSISTENCY:
- All shadows: 0 2px 8px rgba(0,0,0,0.08)
- All border-radius: 4-8px range
- All animations: smooth, ease-in-out timing
- All interactive elements: clear hover/active states
- All text: high contrast for readability

EMOTIONAL DESIGN GOALS:
- Calm confidence: soft colors, generous spacing
- Trust through transparency: clear status indicators
- Guided simplicity: obvious primary actions
- Professional credibility: clean, academic-appropriate design
```

---

## Flow 1: Core User Journey - PDF Upload to Literature Review

### Écran 1.1: Dashboard / Upload Entry (Empty State)

**Objectif:** Immediate entry to core workflow - zero friction, zero anxiety.

**Layout:**
- Full-page centered layout
- Large PDF drop zone (primary focus)
- Methodology progress tracker (top, subtle)
- Next step guidance card (right sidebar, optional)

**Key Elements:**
- H1: "Upload Your Research Papers"
- Large drop zone (dashed border, upload-cloud icon 64px, "Drag PDFs here or click to browse")
- Subtext: "Support for multiple PDFs. Processing takes 4-5 minutes."
- Empty state message if first time: "No PDFs uploaded yet"

**États:**
- Default (empty state)
- Drag-over (drop zone highlighted)
- First file added (show file list)
- Error (unsupported file type)

---

### PROMPT POUR GOOGLE STITCH - ÉCRAN 1.1 (DEFAULT - EMPTY STATE)

```
Create the main dashboard entry screen for "research-assistant" desktop app (1440px canvas width). This is the FIRST screen users see after landing page - designed for Marie at 7 AM Saturday, anxious but ready to try.

DESIGN SYSTEM:
- Primary color: Calm Blue (#4A90E2)
- Background: Soft White (#FAFBFC)
- Text: Deep Navy (#2C3E50), secondary Warm Gray (#95A5A6)
- Typography: Inter font, H1 32px bold, body 16px, 1.6 line-height
- Spacing: Generous (48px between sections, 24px padding)
- Icons: Lucide style
- Shadows: Subtle (0 2px 8px rgba(0,0,0,0.08))

LAYOUT:
Top navigation bar (fixed):
- Left: "research-assistant" logo/text (18px semibold, Deep Navy)
- Right: User avatar + "Sign Out" link (subtle, 14px)
- Border-bottom: 1px solid #E0E0E0

Methodology progress tracker (below nav, centered, 32px margin-top):
- Horizontal breadcrumb with 5 stages: "Upload" → "Process" → "Review" → "Verify" → "Export"
- Current stage: "Upload" (Calm Blue circle with upload-cloud icon, bold text)
- Future stages: Warm Gray circles, gray text
- Connecting lines: 2px gray between circles

Main content area (centered, max-width 800px):
- H1: "Upload Your Research Papers" (32px, Deep Navy, centered, 48px margin-top)
- Subheading: "Drag and drop your PDFs to begin your literature review" (16px, Warm Gray, centered)

LARGE PDF DROP ZONE (primary focus, centered):
- Container: 600px width × 400px height
- Dashed border: 2px, Warm Gray (#95A5A6), 8px border-radius
- Background: Very light gray (#FAFBFC)
- Center-aligned content:
  - upload-cloud icon (64px, Warm Gray)
  - Text: "Drag PDFs here or click to browse" (18px, Warm Gray, 16px margin-top)
  - Subtext: "Supports multiple files • PDF format only" (14px, lighter gray, 8px margin-top)
- Hover affordance: Subtle cursor pointer

Below drop zone (16px margin-top):
- Small helper text: "Processing takes 4-5 minutes. You can leave and come back." (14px, Warm Gray, centered)

EMPTY STATE MESSAGE (below helper text, 32px margin-top):
- Container: Light background card (#F7F9FA), 24px padding, 8px border-radius, centered
- Icon: file-text (32px, Warm Gray)
- Text: "No PDFs uploaded yet" (16px, Deep Navy)
- Description: "Your uploaded files will appear here" (14px, Warm Gray)

Right sidebar (optional, 300px width, floating):
- NEXT STEP GUIDANCE CARD:
  - Light blue background (#EBF5FB), 24px padding, 8px border-radius
  - compass icon (24px, Calm Blue) top-left
  - Header: "Getting Started" (18px semibold, Deep Navy)
  - Step list:
    - "1. Upload 5-15 research papers (PDFs)"
    - "2. Wait 4-5 minutes for AI processing"
    - "3. Review generated literature synthesis"
  - Each step: 14px text, 8px spacing

OVERALL VISUAL STYLE:
- Spacious, calm, minimal
- No aggressive elements or timers
- Clear primary action (drop zone)
- Saturday morning coffee session vibe
- Desktop-first (1440px), clean proportions

EMOTIONAL DESIGN GOALS:
- Immediate reassurance: "This is simple"
- Zero friction: One clear action (drag PDFs)
- Calm confidence: Generous spacing, soft colors
- Guided simplicity: Clear next steps visible
```

---

### PROMPT POUR GOOGLE STITCH - ÉCRAN 1.1 (DRAG-OVER STATE)

```
Create the same dashboard screen as default state, but with DRAG-OVER interaction showing user is actively dragging files over drop zone.

DESIGN SYSTEM: (same as default state)
- Colors: Calm Blue (#4A90E2), Soft White (#FAFBFC), Deep Navy (#2C3E50), Warm Gray (#95A5A6)
- Typography: Inter font, H1 32px, body 16px
- Spacing: Generous (48px/24px)

LAYOUT: (same as default, but drop zone transformed)

PDF DROP ZONE (DRAG-OVER STATE - KEY CHANGE):
- Container: 600px × 400px (same size)
- Border: SOLID 3px Calm Blue (not dashed) - indicates active state
- Background: Light blue tint (#EBF5FB) - visual feedback
- Center-aligned content:
  - upload-cloud icon (64px, Calm Blue) - changed from gray to blue
  - Text: "Drop PDFs to upload" (18px, Calm Blue, bold) - active language
  - Subtext removed (cleaner in active state)
- Subtle scale animation: 1.02 scale (barely noticeable growth)

All other elements same as default state:
- Top nav unchanged
- Progress tracker unchanged (still on "Upload" stage)
- Right sidebar guidance card unchanged
- Empty state message unchanged

INTERACTION NOTES:
- This state appears only when user drags files over the drop zone
- Visual feedback must be immediate (150ms transition)
- Blue color indicates "ready to accept"
- Simplified messaging during active drag

EMOTIONAL DESIGN GOAL:
- Confidence through feedback: "Yes, drop here, I'm ready"
- Calm interaction: Subtle changes, not aggressive
```

---

### Écran 1.2: File List with Processing Status

**Objectif:** Show files uploaded, processing progress, build trust through transparency.

**Layout:**
- Same structure as 1.1
- Drop zone reduced to compact version (top, can add more files)
- File list takes primary focus (center)
- Processing progress visible per file
- Overall progress bar (global)

**Key Elements:**
- Compact drop zone: "Add more PDFs" (smaller, top)
- File list: Each file shows icon, name, size, status (processing/success/error)
- Global progress: "Processing 3 of 5 PDFs" + progress bar
- Estimated time: "~2 minutes remaining"

**États:**
- Processing in progress
- All files successful
- Partial success (some failed)
- All files failed (error state)

---

### PROMPT POUR GOOGLE STITCH - ÉCRAN 1.2 (PROCESSING STATE)

```
Create the file list screen showing PDFs being processed. User has uploaded 5 PDFs and AI is actively processing them (Marie goes to make coffee, comes back to this).

DESIGN SYSTEM:
- Colors: Calm Blue (#4A90E2), Success Green (#27AE60), Processing Purple (#9B59B6), Error Red (#E74C3C)
- Background: Soft White (#FAFBFC)
- Text: Deep Navy (#2C3E50), Warm Gray (#95A5A6)
- Typography: Inter, H1 32px, body 16px
- Spacing: 24px between elements

LAYOUT:
Top nav: Same as 1.1 (logo left, user right)

Progress tracker (below nav):
- "Upload" stage: Success Green (completed, check icon)
- "Process" stage: Calm Blue (CURRENT, loader icon, pulsing)
- Remaining stages: Warm Gray (future)

Main content (max-width 800px, centered):
- H1: "Processing Your Research Papers" (32px, Deep Navy)
- Subheading: "This may take 4-5 minutes. Feel free to step away." (16px, Warm Gray)

GLOBAL PROGRESS BAR (32px below subheading):
- Text above: "Processing 3 of 5 PDFs" (16px, Deep Navy)
- Progress bar container: Full width (800px), 12px height, light gray background (#E8E8E8), 6px border-radius
- Fill: Processing Purple, 60% width (3/5), smooth animation
- Estimated time below: "~2 minutes remaining" (14px, Warm Gray)

COMPACT DROP ZONE (32px below progress):
- Small version: 800px width × 80px height, dashed border (1px, Warm Gray)
- Left-aligned content: upload-cloud icon (24px) + "Add more PDFs" text (14px)
- Subtle, non-primary action (users can add more while processing)

FILE LIST (32px below drop zone):
Show 5 uploaded files vertically stacked, 16px spacing between each.

File 1 (COMPLETED):
- Container: White background, 1px border (#E0E0E0), 16px padding, 6px border-radius
- Left: file-text icon (24px, Calm Blue)
- Center: "Smith_2019_Knowledge_Management.pdf" (16px, Deep Navy)
  - Below: "2.4 MB" (14px, Warm Gray)
- Right: check-circle icon (24px, Success Green)
- Status text: "Processed" (14px, Success Green)

File 2 (COMPLETED):
- Same as File 1 but filename: "Johnson_2020_Organizational_Learning.pdf", "1.8 MB"

File 3 (PROCESSING - CURRENT):
- Container: White background, 1px border Calm Blue (active), 16px padding
- Left: file-text icon (24px, Calm Blue)
- Center: "Lee_2021_Innovation_Strategy.pdf" (16px, Deep Navy)
  - Below: "3.1 MB" (14px, Warm Gray)
- Right: loader icon SPINNING (24px, Processing Purple)
- Status text: "Processing..." (14px, Processing Purple)
- Mini progress bar below filename: 45% complete (Processing Purple)

File 4 (WAITING):
- Container: White background, 1px border (#E0E0E0), 16px padding
- Left: file-text icon (24px, Warm Gray)
- Center: "Martinez_2018_Digital_Transformation.pdf" (16px, Deep Navy)
  - Below: "2.7 MB" (14px, Warm Gray)
- Right: clock icon (24px, Warm Gray)
- Status text: "Waiting..." (14px, Warm Gray)

File 5 (WAITING):
- Same as File 4 but filename: "Chen_2022_AI_Research.pdf", "1.9 MB"

Right sidebar (optional):
- NEXT STEP GUIDANCE CARD:
  - Header: "What Happens Next"
  - Steps:
    - "AI extracts text from each PDF"
    - "Identifies themes and key arguments"
    - "Links citations to exact pages"
    - "Generates structured literature review"
  - Bottom text: "You'll be notified when complete" (14px, Warm Gray)

OVERALL STYLE:
- Calm, transparent processing
- Clear progress indicators (no uncertainty)
- User can leave and return (messaging reinforces this)
- Saturday morning patience, not frantic dashboard

EMOTIONAL GOALS:
- Trust through transparency: See exactly what's happening
- Calm confidence: No aggressive timers, just steady progress
- Detachment encouraged: "Go make coffee, we've got this"
```

---

### PROMPT POUR GOOGLE STITCH - ÉCRAN 1.2 (SUCCESS STATE - ALL PROCESSED)

```
Create the same file list screen, but ALL 5 PDFs have been successfully processed. This is the "aha moment" for Marie - 4 minutes passed, literature review is ready.

DESIGN SYSTEM: (same as processing state)

LAYOUT:
Top nav: Same

Progress tracker:
- "Upload" stage: Success Green (completed)
- "Process" stage: Success Green (COMPLETED, check icon)
- "Review" stage: Calm Blue (CURRENT, pulsing)
- Remaining stages: Warm Gray

Main content:
- H1: "Processing Complete!" (32px, Success Green - celebratory but calm)
- Subheading: "Your literature review is ready to review" (16px, Deep Navy)

SUCCESS MESSAGE CARD (32px below H1):
- Container: Light green background (#F0FFF4), Success Green left border (4px), 24px padding, 8px border-radius
- Icon: check-circle (32px, Success Green), left side
- Header: "Literature Review Generated" (18px semibold, Success Green)
- Message: "Completed in 4 minutes. Estimated manual time: 40 hours." (16px, Deep Navy)
- Subtext: "5 PDFs processed • 47 citations extracted • 3 themes identified" (14px, Warm Gray)

COMPACT DROP ZONE (below success card):
- Same as processing state: Small, subtle, can add more files

FILE LIST (all 5 files COMPLETED):
Each file same structure:
- Container: White, 1px border (#E0E0E0), 16px padding
- Left: file-text icon (24px, Calm Blue)
- Center: Filename (16px, Deep Navy) + file size (14px, Warm Gray)
- Right: check-circle icon (24px, Success Green)
- Status text: "Processed" (14px, Success Green)

File names:
1. "Smith_2019_Knowledge_Management.pdf" - 2.4 MB
2. "Johnson_2020_Organizational_Learning.pdf" - 1.8 MB
3. "Lee_2021_Innovation_Strategy.pdf" - 3.1 MB
4. "Martinez_2018_Digital_Transformation.pdf" - 2.7 MB
5. "Chen_2022_AI_Research.pdf" - 1.9 MB

PRIMARY CTA (below file list, centered):
- Large button: "View Literature Review" (Calm Blue, prominent, 18px text)
- Secondary link below: "Download as PDF" (14px, Calm Blue link)

Right sidebar:
- NEXT STEP GUIDANCE CARD:
  - Header: "What's Next"
  - Steps:
    - "1. Review the generated literature review"
    - "2. Click citations to verify sources"
    - "3. Edit or refine as needed"
    - "4. Export for your paper"
  - Bottom CTA: "Start Reviewing →" (link, Calm Blue)

OVERALL STYLE:
- Celebratory but calm (Success Green accents, not aggressive)
- Clear next action (View Literature Review button)
- Time savings made explicit (4 min vs 40 hours)

EMOTIONAL GOALS:
- Accomplishment: "I just saved 38 hours!"
- Trust building: See all files processed successfully
- Guided next step: Obvious primary action
- Delight through effortlessness: "That was easier than I thought"
```

---

### PROMPT POUR GOOGLE STITCH - ÉCRAN 1.2 (ERROR STATE - PARTIAL FAILURE)

```
Create the same file list screen, but 1 of 5 PDFs failed to process (scanned document). This is Marie's "panic mode" journey - she needs that paper but system handles gracefully.

DESIGN SYSTEM: (same)

LAYOUT:
Top nav: Same

Progress tracker:
- "Upload" & "Process": Success Green (completed)
- "Review": Calm Blue (current)

Main content:
- H1: "Processing Complete (with Issues)" (32px, Deep Navy)
- Subheading: "4 of 5 PDFs processed successfully" (16px, Warm Gray)

WARNING MESSAGE CARD (32px below H1):
- Container: Light amber background (#FFF9E6), Warning Amber left border (4px), 24px padding, 8px border-radius
- Icon: alert-circle (32px, Warning Amber), left side
- Header: "1 PDF Could Not Be Processed" (18px semibold, Warning Amber)
- Message: "Some files could not be processed, but you can continue with the 4 successful results." (16px, Deep Navy)
- Action link: "See Details Below" (14px, Calm Blue link with down-arrow icon)

COMPACT DROP ZONE: Same as success state

FILE LIST (4 success + 1 error):

Files 1-4 (COMPLETED) - same as success state:
1. "Smith_2019_Knowledge_Management.pdf" - check-circle, Success Green
2. "Johnson_2020_Organizational_Learning.pdf" - check-circle, Success Green
3. "Lee_2021_Innovation_Strategy.pdf" - check-circle, Success Green
4. "Martinez_2018_Digital_Transformation.pdf" - check-circle, Success Green

File 5 (ERROR):
- Container: Light red background (#FFF5F5), Error Red border (2px), 16px padding, 6px border-radius
- Left: file-text icon (24px, Error Red)
- Center: "Chen_2022_AI_Research_SCAN.pdf" (16px, Deep Navy)
  - Below: "1.9 MB" (14px, Warm Gray)
- Right: alert-circle icon (24px, Error Red)
- Status text: "Processing Failed" (14px, Error Red)
- Error message below: "Unable to extract text reliably - document may be image-based or scanned." (14px, Deep Navy)
- Actions:
  - "Try Another File" button (secondary style, small)
  - "Remove" link (14px, Error Red)

PARTIAL SUCCESS MESSAGE (below file list):
- Light blue background card (#EBF5FB), 16px padding, 6px border-radius
- Icon: info icon (20px, Calm Blue)
- Text: "Your literature review was generated using the 4 successful PDFs. The failed document is noted as missing in the review." (14px, Deep Navy)

PRIMARY CTA (below message):
- "View Literature Review" button (Calm Blue, prominent)
- Subtext: "Manual review recommended for missing source" (14px, Warm Gray)

Right sidebar:
- NEXT STEP GUIDANCE CARD:
  - Header: "What's Next"
  - Steps:
    - "1. Review the partial literature review"
    - "2. Manually skim the failed PDF"
    - "3. Add notes for missing citations"
    - "4. Continue with verification"
  - Helper text: "The app saved you 4 hours even with one failure" (14px, Warm Gray, italic)

OVERALL STYLE:
- Error is visible but not catastrophic
- Partial results still usable (graceful degradation)
- Clear explanation of what failed and why
- Actions to recover (try another file, remove, continue anyway)

EMOTIONAL GOALS:
- Understanding: "I know what failed and why"
- Control: "I have options to fix or continue"
- Not blocked: "I can still use the other 4 results"
- Reassurance: "This isn't a total failure"
```

---

## Flow 2: Literature Review Display & Citation Verification

### Écran 2.1: Literature Review Display (Reading Mode)

**Objectif:** Present AI-generated literature review in calm, readable format optimized for Saturday morning reading sessions. Enable effortless citation verification.

**Layout:**
- Two-panel layout: Literature review (left 60%), PDF viewer panel (right 40%, initially hidden)
- Reading-optimized typography (max-width 720px, 1.6 line-height)
- Citations clickable and visually distinct
- Methodology progress tracker (top)

**Key Elements:**
- H1: "Your Literature Review"
- Structured content: Themes as H2, key arguments as bullets, AI synthesis as paragraphs
- Citations: Inline with superscript, clickable, monospace font
- Action buttons: "Edit", "Download PDF", "Export to Word"

**États:**
- Default (PDF panel hidden)
- Citation clicked (PDF panel slides in from right)
- Edit mode (future)
- Success state (all citations verified)

---

### PROMPT POUR GOOGLE STITCH - ÉCRAN 2.1 (DEFAULT STATE - PDF PANEL HIDDEN)

```
Create the literature review display screen - the "payoff moment" where Marie sees her completed literature review. Desktop-first (1440px canvas), optimized for calm reading.

DESIGN SYSTEM:
- Colors: Calm Blue (#4A90E2), Deep Navy (#2C3E50), Warm Gray (#95A5A6), Success Green (#27AE60)
- Typography: Inter, H1 32px, H2 24px, body 16px with 1.6 line-height (reading-optimized)
- Citation font: JetBrains Mono (monospace), 14px, Calm Blue
- Spacing: Generous (24px between paragraphs)
- Max content width: 720px (optimal reading line length)

LAYOUT:
Top nav: Same as previous screens (logo left, user right)

Progress tracker (below nav):
- "Upload", "Process": Success Green (completed)
- "Review": Calm Blue (CURRENT, pulsing)
- "Verify", "Export": Warm Gray (future)

Main content area (full width available, PDF panel hidden initially):

HEADER SECTION (centered, max-width 720px):
- H1: "Your Literature Review" (32px, Deep Navy)
- Subheading: "AI-generated synthesis from 5 research papers" (16px, Warm Gray)
- Meta info: "Generated on Jan 30, 2026 • 47 citations • 3 themes" (14px, Warm Gray)
- Action buttons (right-aligned):
  - "Edit" (secondary button)
  - "Download PDF" (secondary button)
  - "Export to Word" (secondary button)

LITERATURE REVIEW CONTENT (max-width 720px, centered, reading-optimized):

Theme 1 Section:
- H2: "1. Knowledge Management in Digital Organizations" (24px semibold, Deep Navy, 32px margin-top)
- Paragraph 1 (16px, Deep Navy, 1.6 line-height):
  "Digital transformation has fundamentally altered how organizations manage knowledge assets. Smith (2019) argues that traditional knowledge repositories are insufficient in modern contexts [Smith, 2019, p.47]. This perspective is supported by Johnson (2020), who demonstrates that organizational learning requires adaptive systems rather than static databases [Johnson, 2020, p.112]."

  - Citations shown as: [Author, Year, p.XX] in Calm Blue, monospace font, slightly smaller (14px)
  - Each citation is a clickable link (cursor pointer on hover, subtle underline appears)
  - Tooltip on hover: "Click to verify source"

- Paragraph 2 (same formatting):
  "However, Lee (2021) challenges this view, suggesting that the issue is not repository design but rather organizational culture [Lee, 2021, p.89]. This debate highlights the complexity of digital knowledge management strategies."

Theme 2 Section:
- H2: "2. Innovation Strategy and Competitive Advantage" (24px semibold, 32px margin-top)
- Paragraph (same formatting as Theme 1):
  "Martinez (2018) identifies three core innovation strategies in digital contexts: platform-based innovation, ecosystem orchestration, and rapid experimentation [Martinez, 2018, p.203]. These strategies align with Chen's (2022) framework for AI-driven research methodologies [Chen, 2022, p.67]."

Theme 3 Section:
- H2: "3. Organizational Adaptation to AI Technologies" (24px semibold, 32px margin-top)
- Paragraph:
  "The integration of AI into organizational processes requires significant cultural and structural shifts. Multiple studies emphasize the importance of leadership commitment and employee training in successful AI adoption [Smith, 2019, p.156; Johnson, 2020, p.89; Lee, 2021, p.234]."

FOOTER SECTION (below content):
- NEXT STEP GUIDANCE CARD (max-width 720px, centered):
  - Light blue background (#EBF5FB), 24px padding, 8px border-radius
  - compass icon (24px, Calm Blue) left side
  - Header: "What's Next" (18px semibold, Deep Navy)
  - Steps:
    - "1. Click citations to verify sources in original PDFs"
    - "2. Edit or refine the synthesis as needed"
    - "3. Export to Word or PDF for your paper"
  - Primary CTA: "Start Verifying Citations →" (Calm Blue link)

OVERALL VISUAL STYLE:
- Reading-optimized: Generous line-height, max-width 720px, comfortable font size
- Calm, scholarly appearance: No aggressive colors, academic credibility
- Citations visually distinct: Monospace font, Calm Blue, clickable affordance
- Spacious: 24px between paragraphs, 32px between sections
- Saturday morning coffee reading vibe: Unhurried, contemplative

INTERACTION NOTES:
- Citations are clickable (this is the core trust-building mechanic)
- Hover shows underline + tooltip ("Click to verify source")
- Click will trigger PDF panel slide-in (next state)

EMOTIONAL GOALS:
- Accomplishment: "I have a complete literature review!"
- Professional quality: Looks academic, not AI-generated junk
- Trust building: Citations are prominent and verifiable
- Calm confidence: Easy to read, not overwhelming
```

---

### PROMPT POUR GOOGLE STITCH - ÉCRAN 2.1 (PDF PANEL OPEN - CITATION VERIFICATION)

```
Create the same literature review screen, but with PDF VIEWER PANEL OPEN on the right side. User clicked a citation "[Smith, 2019, p.47]" and PDF opened at exact page - this is the KEY TRUST-BUILDING MOMENT.

DESIGN SYSTEM: (same as default state)

LAYOUT:
Top nav: Same

Progress tracker:
- "Review" & "Verify": Calm Blue (BOTH active now - verification in progress)

SPLIT-PANEL LAYOUT:
- Left panel: Literature review content (NOW 60% width, 864px)
- Right panel: PDF viewer (40% width, 576px, slides in from right with 300ms ease-out animation)

LEFT PANEL - LITERATURE REVIEW (60% width):
Same content as default state, but narrower.

Active citation highlighted:
- In paragraph: "[Smith, 2019, p.47]" shown with light blue background (#EBF5FB), bold, external-link icon (12px) next to it
- This indicates "currently viewing this citation"

Content adjusts gracefully to narrower width (still max 720px, but container is 60% of viewport).

RIGHT PANEL - PDF VIEWER (40% width, 576px):
Slides in from right edge, full height, white background, subtle shadow on left edge (0 4px 12px rgba(0,0,0,0.15)).

HEADER (Dark Navy background, 16px padding):
- Left: PDF filename "Smith_2019_Knowledge_Management.pdf" (16px, white text, truncated if too long)
- Right: X close button (24px, white icon)

PDF RENDER AREA (body):
- Full-width PDF page display, scrollable
- Current page: Page 47 (the cited page)
- Highlight/indicator on the page showing the cited text (yellow highlight overlay, semi-transparent)
- Realistic PDF page rendering (academic paper with text, margins, headers)

FOOTER (light gray background, 16px padding):
- Center: "Page 47 of 152" (14px, Deep Navy)
- Left: Left arrow button (navigate to previous page, 24px icon)
- Right: Right arrow button (navigate to next page, 24px icon)

INTERACTION NOTES:
- Panel slides in smoothly (300ms ease-out)
- PDF scrolls to exact page automatically
- Cited text highlighted in yellow (if detectable)
- User can scroll PDF, navigate pages
- Close X button or click outside panel to hide

TOAST NOTIFICATION (optional, top-right corner):
- Small green toast: "Citation verified ✓ Smith, 2019, p.47" (fades in, auto-dismisses after 3s)
- Indicates trust-building success

OVERALL STYLE:
- Split-view for side-by-side comparison
- PDF panel doesn't obscure content, just narrows it
- Smooth animation (not jarring)
- Clear visual connection: highlighted citation (left) → PDF page (right)

EMOTIONAL GOALS:
- TRUST MOMENT: "The citation is accurate - I can see the exact page!"
- Confidence: "I can verify every claim"
- Effortless verification: One click, exact page, no scrolling
- Delight: "This actually works exactly as promised"
```

---

## Flow 3: Export & Completion

### Écran 3.1: Export Options

**Objectif:** Allow users to export literature review in usable formats for their MBA papers.

**Layout:**
- Centered modal or dedicated page
- Export format options (PDF, Word, Plain Text)
- Citation style selection (APA, Harvard, Chicago)
- Preview before export

**Key Elements:**
- H1: "Export Your Literature Review"
- Format selector: Radio buttons for PDF/Word/Text
- Citation style dropdown: APA (default), Harvard, Chicago
- Preview area: Show how citations will appear
- Primary CTA: "Download" button

**États:**
- Default (format selection)
- Preview mode
- Downloading (progress spinner)
- Success (download complete)

---

### PROMPT POUR GOOGLE STITCH - ÉCRAN 3.1 (EXPORT OPTIONS - DEFAULT STATE)

```
Create the export options screen - final step before Marie can use her literature review in her MBA paper. Desktop-first (1440px), modal overlay or dedicated page.

DESIGN SYSTEM: (same as previous)

LAYOUT OPTIONS (choose modal overlay approach):

MODAL OVERLAY (centered, 600px width):
- Dark overlay background (rgba(0,0,0,0.5)) covering entire screen
- White modal card (600px × auto height, 32px padding, 8px border-radius, subtle shadow)

MODAL CONTENT:

HEADER:
- H1: "Export Your Literature Review" (24px, Deep Navy)
- Close X button (top-right corner, 24px icon)

EXPORT FORMAT SECTION (24px margin-top):
- Label: "Format" (16px semibold, Deep Navy)
- Radio button group (vertical stack, 12px spacing):

  Option 1 (selected by default):
  - Radio button (Calm Blue when selected)
  - Icon: file-text (20px)
  - Label: "PDF Document" (16px, Deep Navy)
  - Description: "Preserves formatting, best for printing" (14px, Warm Gray)

  Option 2:
  - Radio button
  - Icon: file-word (20px) (Microsoft Word icon style)
  - Label: "Microsoft Word (.docx)" (16px, Deep Navy)
  - Description: "Editable format for further refinement" (14px, Warm Gray)

  Option 3:
  - Radio button
  - Icon: file-code (20px)
  - Label: "Plain Text (.txt)" (16px, Deep Navy)
  - Description: "Simple text without formatting" (14px, Warm Gray)

CITATION STYLE SECTION (24px margin-top):
- Label: "Citation Style" (16px semibold, Deep Navy)
- Dropdown select (full-width):
  - Default: "APA 7th Edition" (selected)
  - Options: "Harvard", "Chicago", "MLA"
  - Dropdown icon (chevron-down, 16px, right side)

PREVIEW SECTION (24px margin-top):
- Label: "Preview" (16px semibold, Deep Navy)
- Preview box (light gray background #F7F9FA, 16px padding, 6px border-radius):
  - Sample citation in selected style:
    "Smith, J. (2019). Knowledge management in digital contexts. Journal of Business Research, 45(2), 47-58."
  - Helper text below: "Your citations will appear in this format" (14px, Warm Gray)

INCLUDE OPTIONS (24px margin-top):
- Checkbox list:
  - ☑ "Include full reference list" (checked by default)
  - ☑ "Include source PDFs metadata"
  - ☐ "Include verification notes" (unchecked)

ACTION BUTTONS (24px margin-top, right-aligned):
- "Cancel" (secondary button)
- "Download" (primary button, Calm Blue)

OVERALL STYLE:
- Clean, focused modal
- Clear options without overwhelming
- Preview reduces uncertainty ("I know what I'm getting")
- Academic citation styles (APA default for MBA context)

EMOTIONAL GOALS:
- Control: "I choose the format that works for my workflow"
- Confidence: Preview shows exactly what to expect
- Professionalism: Citation styles are academic-appropriate
- Completion: Final step before success
```

---

### PROMPT POUR GOOGLE STITCH - ÉCRAN 3.1 (DOWNLOADING STATE)

```
Create the same export modal, but in DOWNLOADING STATE - file is being generated and downloaded.

DESIGN SYSTEM: (same)

MODAL OVERLAY: Same structure, 600px width

MODAL CONTENT (simplified during download):

HEADER:
- H1: "Generating Your Export..." (24px, Deep Navy)
- Close X button disabled (grayed out, can't close during download)

CENTER CONTENT (all previous form hidden, replaced with):

PROCESSING SPINNER (center-aligned):
- Large loader icon spinning (48px, Processing Purple), continuous rotation
- Text below: "Generating PDF with APA citations..." (16px, Warm Gray)
- Subtext: "This will download automatically" (14px, lighter gray)

PROGRESS BAR (optional, 24px margin-top):
- Container: Full width, 12px height, light gray background
- Fill: Processing Purple, 75% width (smooth animation)

HELPER TEXT (below spinner):
- Small text: "File size: ~450 KB" (14px, Warm Gray)

OVERALL STYLE:
- Simplified during processing (no overwhelming options)
- Clear feedback ("it's working")
- User waits but knows what's happening

EMOTIONAL GOALS:
- Trust: System is working, not frozen
- Anticipation: Download is coming
- No anxiety: Clear messaging
```

---

### PROMPT POUR GOOGLE STITCH - ÉCRAN 3.1 (SUCCESS STATE - DOWNLOAD COMPLETE)

```
Create the same export modal, but in SUCCESS STATE - file has been downloaded successfully. This is the FINAL success moment for Marie's journey.

DESIGN SYSTEM: (same)

MODAL OVERLAY: Same structure

MODAL CONTENT:

HEADER:
- H1: "Export Complete!" (24px, Success Green - celebratory)
- Close X button (active, can close now)

SUCCESS MESSAGE CARD (center-aligned):
- Container: Light green background (#F0FFF4), Success Green left border (4px), 24px padding, 8px border-radius
- Icon: check-circle (48px, Success Green), center-aligned
- Header: "Download Successful" (20px semibold, Success Green)
- Message: "Your literature review has been downloaded as PDF with APA citations." (16px, Deep Navy)
- File info: "research-assistant_literature-review_2026-01-30.pdf • 450 KB" (14px, Warm Gray)

NEXT STEPS SECTION (24px margin-top):
- Label: "What's Next" (16px semibold, Deep Navy)
- Step list:
  - "1. Open the PDF in your preferred editor"
  - "2. Refine and integrate into your MBA paper"
  - "3. Submit with confidence - all sources verified"

ACTION BUTTONS (24px margin-top, centered):
- "Download Again" (secondary button)
- "Done" (primary button, closes modal)

OPTIONAL FEEDBACK (subtle, bottom):
- Small text link: "How did we do? Share feedback" (14px, Calm Blue link)

OVERALL STYLE:
- Celebratory but calm (Success Green accents)
- Clear confirmation (file name, size, format)
- Guided next steps (maintain support principle)
- Closure: Marie's journey is complete

EMOTIONAL GOALS:
- Accomplishment: "I did it - literature review complete!"
- Confidence: "I can submit this to my tutor"
- Relief: "40 hours → 2 hours was real"
- Advocacy trigger: "I should tell my classmates about this"
```

---

## Additional Screens & States

### Error States

**Global Error Page:**
- H1: "Something Went Wrong"
- Friendly error message (not technical jargon)
- Suggested actions: "Refresh page", "Try again", "Contact support"
- Calm Error Red accents, not aggressive

**Network Error Toast:**
- Small toast notification (top-right)
- Icon: alert-circle (20px, Warning Amber)
- Text: "Connection lost. Retrying..." (14px)
- Auto-dismisses when reconnected

**Session Expired Modal:**
- Modal overlay, 400px width
- H2: "Session Expired"
- Message: "Please sign in again to continue"
- Primary CTA: "Sign In" (redirects to Google OAuth)

### Loading States

**Skeleton Screens (While Content Loads):**
- Use gray placeholder blocks (animated shimmer effect) for:
  - File list items (rectangular blocks)
  - Literature review paragraphs (text-shaped blocks)
  - PDF viewer (rectangular placeholder)
- Calm gray (#E8E8E8), subtle pulse animation

### Empty States

**No Citations Found:**
- Icon: alert-circle (48px, Warning Amber)
- H2: "No Citations Extracted"
- Message: "The uploaded PDFs may not contain citable content. Try uploading academic papers."
- Action: "Upload Different PDFs" (primary button)

**No Themes Identified:**
- Icon: compass (48px, Warm Gray)
- H2: "Unable to Identify Clear Themes"
- Message: "The papers may not have overlapping topics. Literature review generated without theme grouping."
- Action: "View Anyway" (primary button)

---

## Design Tokens Reference

### Color Tokens
```
--color-primary: #4A90E2 (Calm Blue)
--color-background: #FAFBFC (Soft White)
--color-text-primary: #2C3E50 (Deep Navy)
--color-text-secondary: #95A5A6 (Warm Gray)
--color-success: #27AE60 (Success Green)
--color-warning: #F39C12 (Warning Amber)
--color-error: #E74C3C (Error Red)
--color-processing: #9B59B6 (Processing Purple)
```

### Typography Tokens
```
--font-family-primary: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
--font-family-code: "JetBrains Mono", Consolas, Monaco, monospace

--font-size-h1: 32px / 2rem
--font-size-h2: 24px / 1.5rem
--font-size-h3: 18px / 1.125rem
--font-size-body: 16px / 1rem
--font-size-small: 14px / 0.875rem

--line-height-heading: 1.3
--line-height-body: 1.6
--line-height-tight: 1.4
```

### Spacing Tokens
```
--space-xs: 4px
--space-sm: 8px
--space-md: 16px
--space-lg: 24px
--space-xl: 32px
--space-xxl: 48px
```

### Shadow Tokens
```
--shadow-subtle: 0 2px 8px rgba(0,0,0,0.08)
--shadow-medium: 0 4px 12px rgba(0,0,0,0.15)
--shadow-strong: 0 8px 24px rgba(0,0,0,0.25)
```

### Radius Tokens
```
--radius-sm: 4px
--radius-md: 6px
--radius-lg: 8px
```

### Animation Tokens
```
--duration-fast: 150ms
--duration-standard: 300ms
--duration-slow: 500ms

--easing-ease-out: cubic-bezier(0.25, 0.46, 0.45, 0.94)
--easing-ease-in-out: cubic-bezier(0.645, 0.045, 0.355, 1.0)
```

---

## Implementation Notes

### Google Stitch Workflow

1. **Generate Landing Page First** (Flow 0) - establishes visual identity
2. **Generate Component Library** - create all reusable components in one prompt
3. **Generate Screen Bodies** - use component library prompts for each flow screen
4. **Iterate & Refine** - adjust individual screens as needed

### Design System Consistency

All prompts repeat the design system foundation to ensure visual consistency across screens. This is intentional for Google Stitch's autonomous generation.

### Responsive Adaptation

While prompts are desktop-first (1440px), components should gracefully adapt to:
- Tablet (768-1023px): Single-column where needed
- Mobile (<768px): Minimal support, vertical stacking

### Accessibility Considerations

- Keyboard navigation: Tab through interactive elements
- Focus indicators: 2px Calm Blue outline
- ARIA labels: Add to icons without text
- Color contrast: Deep Navy on Soft White meets WCAG AA
- Screen readers: Semantic HTML structure

---

**End of UI Screens Specification**

This document provides comprehensive prompts for Google Stitch to generate all screens for research-assistant, maintaining visual consistency and emotional design goals throughout the user journey.
