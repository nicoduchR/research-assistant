# Design to Story Mapping

## Overview

This document maps all design files (Design 00-07) to their corresponding user stories in the epics. All designs are now covered in the MVP scope.

## Design Files

### Design 00: Project Scope Setup
**Epic 2, Story 2.0: Project Scope & Problématique Setup**
- Simple, single-scope setup for MVP
- One research scope per user (no multi-project architecture)
- Form to capture research goals and problématique
- Displays on first dashboard access after sign-in

### Design 01: PDF Upload Dashboard
**Epic 2, Story 2.5: Drag-and-Drop Upload Interface**
- Drag-and-drop file upload zone
- File selection button
- Upload progress indicators
- File format validation (PDF only)

**Epic 2, Story 2.6: Document List View**
- List of uploaded documents with metadata
- Document status indicators (uploaded, processing, ready)
- Document count and storage info

### Design 02: Processing Progress Screen
**Epic 3, Story 3.5: Real-Time Progress Updates via WebSocket**
- WebSocket connection for live progress
- Progress events emitted by worker

**Epic 3, Story 3.6: Initiate Processing and Progress Display**
- "Generate Literature Review" button
- Progress modal with status messages
- Progress bar (0-100%)
- Real-time status updates
- Error handling UI

### Design 03: Literature Review Output
**Epic 3, Story 3.7: Literature Review Display and Editing**
- Clean, readable review display
- Inline citations as clickable markers [1], [2]
- Citation tooltips with document name and page
- Edit mode for refining generated content
- Save functionality

### Design 04: Research Library
**Epic 2, Story 2.6: Document List View**
- Document library with metadata cards
- Search and filter capabilities
- Document status badges
- Document count summary

**Epic 2, Story 2.7: Remove Document Functionality**
- Delete document action
- Confirmation dialog
- Cascade deletion handling

### Design 05: Methodology Tracker
**Epic 3, Story 3.8: Methodology Progress Tracker**
- Research methodology stages visualization
- Current stage indicator ("You are here")
- Predefined stages:
  1. Literature Search
  2. Literature Review ← Current stage
  3. Research Design
  4. Data Collection
  5. Data Analysis
  6. Writing & Reporting
- Static "Next Steps" guidance
- Progress context for user orientation

### Design 06: PDF Viewer with Citation Highlight
**Epic 4, Story 4.1: PDF File Serving with Authorization**
- Secure PDF serving endpoint
- User authorization verification
- CORS configuration

**Epic 4, Story 4.2: PDF Viewer Component**
- Side panel PDF viewer
- PDF rendering in browser

**Epic 4, Story 4.3: Click-to-Verify Citation Navigation**
- Click citation marker to open PDF
- Auto-scroll to cited page
- Highlight cited text/area

**Epic 4, Story 4.4: PDF Viewer Controls and Navigation**
- Page navigation controls
- Zoom in/out
- Close viewer
- Scroll to page functionality

### Design 07: Bibliography Export
**Epic 3, Story 3.10: Bibliography Export and Citation Formatting**
- Bibliography section below literature review
- All cited documents listed with proper formatting
- Export format selection (APA, MLA, Chicago, BibTeX)
- Download formatted bibliography files
- Copy to clipboard functionality
- Incomplete metadata handling

## New Stories Added

To ensure all designs are covered in the MVP:

1. **Story 2.0: Project Scope & Problématique Setup** (Design 00)
   - Simplified for MVP - single scope per user
   - No multi-project sidebar/dashboard

2. **Story 2.1: Reusable UI Components Library** (Designs 00-07)
   - Component library based on design patterns
   - Using shadcn/ui, Tailwind CSS, TypeScript

3. **Story 3.10: Bibliography Export and Citation Formatting** (Design 07)
   - Multiple citation format exports
   - BibTeX support for LaTeX
   - Clipboard copy functionality

## Epic Story Structure (Updated)

### Epic 1: Authentication & User Management
- Story 1.1: Monorepo Setup and Base Infrastructure ✅ done
- Story 1.2: Database Foundation and User Model ✅ done
- Story 1.3: Google OAuth Sign-In Flow ✅ done
- Story 1.4: Protected Frontend Routes and Session Management 🔄 review
- Story 1.5: Sign-Out Functionality ⏳ backlog

### Epic 2: Document Upload & Management (Renumbered)
- Story 2.0: Project Scope & Problématique Setup ⏳ backlog [NEW]
- Story 2.1: Reusable UI Components Library ⏳ backlog [NEW]
- Story 2.2: Document Data Model and Storage Setup ⏳ backlog (was 2.1)
- Story 2.3: Single PDF Upload Endpoint ⏳ backlog (was 2.2)
- Story 2.4: PDF Text Extraction Pipeline ⏳ backlog (was 2.3)
- Story 2.5: Drag-and-Drop Upload Interface ⏳ backlog (was 2.4)
- Story 2.6: Document List View ⏳ backlog (was 2.5)
- Story 2.7: Remove Document Functionality ⏳ backlog (was 2.6)

### Epic 3: AI-Powered Literature Review Generation
- Story 3.1: Processing Jobs Infrastructure ⏳ backlog
- Story 3.2: AI Integration Setup ⏳ backlog
- Story 3.3: Literature Review Generation Core ⏳ backlog
- Story 3.4: Citation Traceability System ⏳ backlog
- Story 3.5: Real-Time Progress Updates via WebSocket ⏳ backlog
- Story 3.6: Initiate Processing and Progress Display ⏳ backlog
- Story 3.7: Literature Review Display and Editing ⏳ backlog
- Story 3.8: Methodology Progress Tracker ⏳ backlog
- Story 3.9: Error Handling and Partial Results ⏳ backlog
- Story 3.10: Bibliography Export and Citation Formatting ⏳ backlog [NEW]

### Epic 4: Citation Verification & PDF Viewer
- Story 4.1: PDF File Serving with Authorization ⏳ backlog
- Story 4.2: PDF Viewer Component ⏳ backlog
- Story 4.3: Click-to-Verify Citation Navigation ⏳ backlog
- Story 4.4: PDF Viewer Controls and Navigation ⏳ backlog

## Coverage Summary

✅ **All 8 design files (00-07) are now mapped to user stories**

- Design 00 → Epic 2, Story 2.0
- Design 01 → Epic 2, Stories 2.5, 2.6
- Design 02 → Epic 3, Stories 3.5, 3.6
- Design 03 → Epic 3, Story 3.7
- Design 04 → Epic 2, Stories 2.6, 2.7
- Design 05 → Epic 3, Story 3.8
- Design 06 → Epic 4, Stories 4.1, 4.2, 4.3, 4.4
- Design 07 → Epic 3, Story 3.10

## Architecture Decision (MVP)

**Simple Mono-Project Approach:**
- One research scope per user (no multi-project management)
- Design 00 adapted: scope setup without project selection
- No project sidebar navigation
- No project breadcrumb navigation
- Focus on core literature review workflow

This decision simplifies Epic 2 while maintaining all design elements needed for the user's research workflow.
