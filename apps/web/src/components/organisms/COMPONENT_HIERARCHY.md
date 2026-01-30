# Organism Components - Hierarchy and Dependencies

## Component Dependency Graph

```
ORGANISMS (Complex Components)
│
├── Header
│   ├── Uses Atoms:
│   │   ├── Button (icon variant)
│   │   └── Badge (for notification counts)
│   └── Features:
│       ├── Brand/Logo display
│       ├── Notification icon with count
│       ├── Message icon with count
│       └── User profile dropdown menu
│
├── Sidebar
│   ├── Uses Atoms:
│   │   ├── Button (icon variant)
│   │   └── Badge (for item counts)
│   └── Features:
│       ├── Brand section
│       ├── Main navigation menu
│       ├── Smart folders section
│       ├── Projects list
│       └── User profile section
│
├── Breadcrumb
│   ├── Uses: None (standalone)
│   └── Features:
│       ├── Clickable path items
│       ├── Chevron separators
│       └── Active state for current page
│
├── DocumentQueue
│   ├── Uses Atoms:
│   │   ├── Button (primary, secondary variants)
│   │   └── Badge (for count display)
│   ├── Uses Molecules:
│   │   └── FileItem (for document list)
│   └── Features:
│       ├── Header with count badge
│       ├── Scrollable file list
│       ├── Status indicators
│       ├── Stats footer (size, time)
│       └── Generate review button
│
├── ThemeCard
│   ├── Uses Atoms:
│   │   ├── Badge (for relevance, citations)
│   │   └── Button (primary, icon variants)
│   ├── Uses Molecules:
│   │   └── StatusLabel (for consensus/conflicts)
│   └── Features:
│       ├── Header with relevance badge
│       ├── Consensus section
│       ├── Conflicts section
│       ├── Authors and citations
│       └── Action buttons
│
├── ProgressTracker
│   ├── Uses: None (standalone)
│   └── Features:
│       ├── Multi-step visualization
│       ├── Three states (pending, current, completed)
│       ├── Connecting lines
│       ├── Icons and animations
│       └── Horizontal/vertical layouts
│
├── PDFViewer
│   ├── Uses Atoms:
│   │   └── Button (icon, secondary variants)
│   └── Features:
│       ├── Header with filename
│       ├── Page navigation controls
│       ├── Zoom controls
│       ├── Download button
│       └── PDF preview area (placeholder)
│
└── DataTable
    ├── Uses Atoms:
    │   ├── Checkbox (with indeterminate state)
    │   └── Badge (for custom cell rendering)
    └── Features:
        ├── Sortable columns
        ├── Row selection
        ├── Select all functionality
        ├── Custom cell rendering
        ├── Hover states
        └── Empty state

```

## Complete Atomic Design Hierarchy

```
PAGES (Feature-complete views)
    ↓
ORGANISMS (Complex sections) ← YOU ARE HERE
    ↓ uses
MOLECULES (Composite components)
    ├── FileItem
    ├── StatusLabel
    ├── SearchBar
    ├── ProgressIndicator
    ├── FilterChip
    ├── CitationBadge
    ├── DropZone
    └── Toast
    ↓ uses
ATOMS (Base components)
    ├── Button
    ├── Input
    ├── Select
    ├── Badge
    ├── Checkbox
    └── Radio
    ↓ uses
DESIGN TOKENS
    ├── Colors (primary, success, warning, error, etc.)
    ├── Spacing (xs, sm, md, lg, xl)
    ├── Typography (h1-h6, body, small)
    ├── Shadows (subtle, medium)
    └── Transitions (fast, normal)
```

## Component Composition Examples

### Example 1: Application Layout
```tsx
<div className="app">
  <Header />
  <div className="layout">
    <Sidebar />
    <main>
      <Breadcrumb />
      <DocumentQueue />
    </main>
  </div>
</div>
```

### Example 2: Analysis Dashboard
```tsx
<div className="dashboard">
  <Header />
  <div className="content">
    <ProgressTracker />
    <div className="grid">
      <ThemeCard />
      <ThemeCard />
      <ThemeCard />
    </div>
    <DataTable />
  </div>
</div>
```

### Example 3: Document Review Page
```tsx
<div className="review-page">
  <Header />
  <div className="split-view">
    <DocumentQueue />
    <PDFViewer />
  </div>
  <ProgressTracker orientation="horizontal" />
</div>
```

## Component Reusability Matrix

| Component       | Standalone | Layout | Dashboard | Review | Settings |
|----------------|-----------|--------|-----------|--------|----------|
| Header         | ✓         | ✓      | ✓         | ✓      | ✓        |
| Sidebar        | ✓         | ✓      | ✓         | ✓      | ✓        |
| Breadcrumb     | ✓         | ✓      | ✓         | ✓      | ✓        |
| DocumentQueue  | ✓         | -      | -         | ✓      | -        |
| ThemeCard      | ✓         | -      | ✓         | ✓      | -        |
| ProgressTracker| ✓         | -      | ✓         | ✓      | -        |
| PDFViewer      | ✓         | -      | -         | ✓      | -        |
| DataTable      | ✓         | -      | ✓         | ✓      | ✓        |

Legend:
- ✓ = Commonly used in this context
- - = Not typically used in this context

## State Management Patterns

### Controlled Components
These components can be controlled by parent state:
- **ProgressTracker**: `currentStep` prop overrides individual step status
- **PDFViewer**: `currentPage` prop controls pagination
- **DataTable**: Row selection state can be controlled externally

### Uncontrolled Components
These components manage their own state:
- **Header**: Dropdown open/close state
- **PDFViewer**: Zoom level state (internal)
- **DataTable**: Sorting state (internal)

### Event-Driven Components
These components rely on callbacks:
- **Sidebar**: `onNavigate` for route changes
- **DocumentQueue**: `onGenerateReview`, `onDeleteDocument`
- **ThemeCard**: `onViewDetails`, `onExport`
- **Breadcrumb**: `onNavigate` for navigation

## Accessibility Features

All organisms include:
- ✓ **ARIA labels** for interactive elements
- ✓ **Semantic HTML** (nav, aside, article, etc.)
- ✓ **Keyboard navigation** support
- ✓ **Focus states** with visible outlines
- ✓ **Screen reader** friendly text
- ✓ **Role attributes** (navigation, progressbar, etc.)
- ✓ **aria-current** for active states
- ✓ **aria-expanded** for dropdowns

## Responsive Breakpoints

Components adapt at these breakpoints:
- **Mobile**: `< 640px (sm)`
  - Header: Hides notification/message icons
  - Sidebar: Can be toggled/hidden
  - DataTable: Horizontal scroll
  - ProgressTracker: Better with vertical orientation
  
- **Tablet**: `640px - 1024px (md)`
  - All components work well
  - Header shows user name
  
- **Desktop**: `> 1024px (lg)`
  - Optimal layout for all components
  - Full feature visibility

## Performance Considerations

### Optimizations Implemented
1. **Memoization**: Components use React.FC for potential memo wrapping
2. **Event Delegation**: Click handlers properly scoped
3. **Conditional Rendering**: Empty states, loading states
4. **Lazy Loading**: Ready for code-splitting at page level

### Recommendations for Large Data Sets
- **DataTable**: Implement virtualization for 1000+ rows
- **DocumentQueue**: Limit visible items, add pagination
- **ThemeCard**: Use grid with lazy loading for many cards
- **Sidebar**: Collapse sections, virtualize project list if 100+

## Testing Recommendations

### Unit Tests
Test each organism's:
- ✓ Rendering with required props
- ✓ User interactions (clicks, selections)
- ✓ State changes (controlled/uncontrolled)
- ✓ Callback invocations
- ✓ Edge cases (empty data, errors)

### Integration Tests
Test organism combinations:
- ✓ Header + Sidebar navigation
- ✓ DocumentQueue + ProgressTracker workflow
- ✓ PDFViewer + DataTable interaction
- ✓ Breadcrumb navigation flow

### Accessibility Tests
- ✓ Screen reader compatibility
- ✓ Keyboard navigation
- ✓ Focus management
- ✓ ARIA attribute correctness

## File Sizes and Complexity

| Component       | Lines | Complexity | Dependencies |
|----------------|-------|------------|--------------|
| Header         | 204   | Medium     | 2 atoms      |
| Sidebar        | 196   | Medium     | 2 atoms      |
| Breadcrumb     | 80    | Low        | 0            |
| DocumentQueue  | 166   | Medium     | 2 atoms, 1 mol|
| ThemeCard      | 159   | Medium     | 2 atoms, 1 mol|
| ProgressTracker| 173   | Medium     | 0            |
| PDFViewer      | 209   | Medium     | 1 atom       |
| DataTable      | 228   | High       | 2 atoms      |
| **Total**      |**1,415**|           |              |

Note: Line counts exclude examples.tsx (298 lines)

## Integration Checklist

When using these organisms in your application:

- [ ] Import design tokens in your tailwind config
- [ ] Include Material Symbols font in your HTML
- [ ] Set up routing for navigation handlers
- [ ] Implement state management for controlled components
- [ ] Add error boundaries around complex organisms
- [ ] Test responsive behavior on all screen sizes
- [ ] Verify accessibility with screen readers
- [ ] Add loading states where appropriate
- [ ] Handle empty states gracefully
- [ ] Implement proper error handling

## Next Steps

1. **Create Page Components**
   - Dashboard page using DataTable, ThemeCard
   - Upload page using DocumentQueue, ProgressTracker
   - Review page using PDFViewer, DataTable
   
2. **Build Templates**
   - Main layout (Header + Sidebar + content area)
   - Two-column layout (DocumentQueue + PDFViewer)
   - Dashboard grid layout

3. **Add Features**
   - Authentication flow with Header
   - Project management with Sidebar
   - Document processing workflow
   - Theme analysis dashboard

4. **Enhance Components**
   - Add PDF rendering to PDFViewer
   - Add pagination to DataTable
   - Add notifications panel to Header
   - Add mobile sidebar toggle
