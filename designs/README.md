# research-assistant UI Designs

Generated using Google Stitch MCP on 2026-01-30

## Design System

- **Primary Color:** Calm Blue (#4A90E2) - Trust and reassurance
- **Background:** Soft White (#FAFBFC) - Calm, spacious design
- **Text:** Deep Navy (#2C3E50) - Professional credibility
- **Typography:** Inter font family, reading-optimized line-heights
- **Device:** Desktop-first (2560px canvas width)

## Generated Screens

### Flow 0: Marketing
- **00-landing-page** - Marketing entry point with hero, problem/solution, and trust builders

### Component Library
- **01-component-library-basic** - Buttons, links, inputs, progress bars, file items
- **02-component-library-complex** - Drop zones, panels, trackers, guidance cards, error states

### Flow 1: Upload & Processing
- **03-dashboard-drag-over** - Upload interface with active drag-over state
- **04-file-list-processing** - Processing dashboard showing PDFs being analyzed
- **05-file-list-error** - Graceful error handling for partial failures

### Flow 2: Review & Verification
- **06-literature-review-display** - Generated literature review in reading-optimized layout
- **07-literature-review-pdf-panel** - Citation verification with side-by-side PDF viewer

### Flow 3: Export
- **08-export-options** - Export modal with format and citation style selection
- **09-export-downloading** - Download in progress state

## File Structure

```
designs/
├── images/           # PNG screenshots for visual reference
│   ├── 00-landing-page.png
│   ├── 01-component-library-basic.png
│   ├── 02-component-library-complex.png
│   ├── 03-dashboard-drag-over.png
│   ├── 04-file-list-processing.png
│   ├── 05-file-list-error.png
│   ├── 06-literature-review-display.png
│   ├── 07-literature-review-pdf-panel.png
│   ├── 08-export-options.png
│   └── 09-export-downloading.png
└── code/             # HTML/CSS/JS for implementation
    ├── 00-landing-page.html
    ├── 01-component-library-basic.html
    ├── 02-component-library-complex.html
    ├── 03-dashboard-drag-over.html
    ├── 04-file-list-processing.html
    ├── 05-file-list-error.html
    ├── 06-literature-review-display.html
    ├── 07-literature-review-pdf-panel.html
    ├── 08-export-options.html
    └── 09-export-downloading.html
```

## Usage

### For Design Reference
- Open PNG files to see visual designs
- Use for mockups, presentations, or design reviews

### For Implementation
- Open HTML files in browser to see interactive versions
- Extract CSS styles and component structure
- Adapt code for your React/Vue/Angular implementation

## Notes

- All screens maintain design system consistency
- Emotional design goals: Calm confidence, trust through transparency, guided simplicity
- Optimized for Saturday morning coffee session vibe (unhurried, contemplative)
- High-resolution: 2560x2048px for crisp detail

## Google Stitch Project

- **Project ID:** 18316414822134968624
- **Access:** https://stitch.new
- **Last Updated:** 2026-01-30 08:25:37 UTC
