# Component Library Documentation

## Overview

This component library provides a comprehensive set of reusable UI components for the Research Assistant application. Components follow the **Atomic Design** pattern and are organized into three layers:

1. **Atoms** (`src/components/atoms/`) - Basic UI primitives
2. **Molecules/Organisms** (`src/components/molecules/`, `src/components/organisms/`) - Composed components
3. **Features** (`src/components/features/`) - Domain-specific components organized by function

## Design System

### Colors

The application uses a calm, confident color palette defined via CSS variables in `globals.css`:

**CSS Variables (use in Tailwind):**
- `--background` → `bg-background` (White: `0 0% 100%`)
- `--foreground` → `text-foreground` (Dark text: `222 47% 11%`)
- `--primary` → `bg-primary` / `text-primary` (Blue: `#137fec`)
- `--primary-foreground` → `text-primary-foreground` (White on blue)
- `--secondary` → `bg-secondary` (Light gray)
- `--destructive` / `--error` → `bg-error` / `text-error` (Red: `#E74C3C`)
- `--success` → `bg-success` / `text-success` (Green: `#27AE60`)
- `--border` → `border-border` (Subtle borders)
- `--ring` → `ring-ring` (Focus ring)
- `--muted` → `bg-muted` (Muted backgrounds)
- `--text-primary` → `text-text-primary` (Main content: `#111827`)
- `--text-secondary` → `text-text-secondary` (Supporting: `#95A5A6`)

**Usage Example:**
```tsx
<button className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-2 focus:ring-ring">
  Primary Action
</button>
```

### Typography

- **Font Family**: Inter (sans-serif)
- **Heading 1**: 32px, weight 600
- **Heading 2**: 24px, weight 600
- **Heading 3**: 18px, weight 600
- **Body**: 16px, line-height 1.6
- **Small**: 14px

### Spacing

- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **xxl**: 48px

## Component Catalog

### Atoms (Basic Primitives)

#### Button
```tsx
import { Button } from '@/src/components/atoms/Button';

<Button variant="primary" size="md" onClick={handleClick} loading={isLoading}>
  Submit
</Button>
```
**Variants**: `primary`, `secondary`, `icon`
**Sizes**: `sm`, `md`, `lg`
**States**: default, hover, active, loading, disabled

#### Badge
```tsx
import { Badge } from '@/src/components/atoms/Badge';

<Badge variant="success" size="sm">Completed</Badge>
```
**Variants**: `success`, `error`, `neutral`, `primary`

#### Card
```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/atoms/Card';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content here</CardContent>
</Card>
```

#### Input, Textarea, Select, Checkbox, Radio
Standard form inputs with consistent styling and validation states.

#### Dialog
```tsx
import { Dialog } from '@/src/components/atoms/Dialog';

<Dialog open={isOpen} onClose={handleClose} title="Confirm">
  <p>Are you sure?</p>
</Dialog>
```

#### Spinner
```tsx
import { Spinner } from '@/src/components/atoms/Spinner';

<Spinner size="md" text="Loading..." />
```

---

### Navigation Components

#### Sidebar
```tsx
import { Sidebar } from '@/src/components/features/navigation';

<Sidebar
  currentPath="/dashboard"
  projects={projectList}
  onNavigate={handleNavigate}
  userName="John Doe"
/>
```

#### Breadcrumb
```tsx
import { Breadcrumb } from '@/src/components/features/navigation';

<Breadcrumb
  items={[
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects' },
  ]}
  currentPage="Project Details"
  onNavigate={handleNavigate}
/>
```

#### ProgressSteps
```tsx
import { ProgressSteps } from '@/src/components/features/navigation';

<ProgressSteps
  steps={[
    { label: 'Upload', status: 'completed' },
    { label: 'Process', status: 'current' },
    { label: 'Review', status: 'pending' },
  ]}
  orientation="horizontal"
/>
```

---

### Form Components

#### TextareaWithCounter
```tsx
import { TextareaWithCounter } from '@/src/components/molecules/TextareaWithCounter';

<TextareaWithCounter
  value={text}
  onChange={(e) => setText(e.target.value)}
  maxLength={500}
  showCounter={true}
  label="Description"
/>
```

#### TagInput
```tsx
import { TagInput } from '@/src/components/features/forms';

<TagInput
  tags={keywords}
  onTagsChange={setKeywords}
  placeholder="Add keyword"
  maxTags={10}
  label="Keywords"
/>
```

#### DynamicList
```tsx
import { DynamicList } from '@/src/components/features/forms';

<DynamicList
  items={questions}
  onItemsChange={setQuestions}
  placeholder="Enter research question"
  label="Research Questions"
/>
```

---

### Card Components

#### ProjectCard
```tsx
import { ProjectCard } from '@/src/components/features/cards';

<ProjectCard
  title="Climate Change Study"
  description="Systematic review of adaptation strategies"
  createdAt={new Date()}
  status="active"
  documentCount={12}
  onClick={handleClick}
/>
```

#### DocumentCard
```tsx
import { DocumentCard } from '@/src/components/features/cards';

<DocumentCard
  document={pdfDocument}
  onDelete={handleDelete}
  onSelect={handleSelect}
  isProcessing={false}
/>
```

#### StatusBadge
```tsx
import { StatusBadge } from '@/src/components/features/cards';

<StatusBadge status="processing" text="Processing..." />
<StatusBadge status="completed" />
```
**Statuses**: `idle`, `processing`, `completed`, `failed`

---

### Button Variants

#### PrimaryButton
```tsx
import { PrimaryButton } from '@/src/components/features/buttons';

<PrimaryButton onClick={handleSubmit} loading={isLoading}>
  Generate Literature Review
</PrimaryButton>
```

#### SecondaryButton
```tsx
import { SecondaryButton } from '@/src/components/features/buttons';

<SecondaryButton onClick={handleCancel}>
  Cancel
</SecondaryButton>
```

#### IconButton
```tsx
import { IconButton } from '@/src/components/features/buttons';

<IconButton
  icon={<span className="material-symbols-outlined">delete</span>}
  ariaLabel="Delete document"
  onClick={handleDelete}
/>
```
**IMPORTANT**: IconButton requires `ariaLabel` for accessibility.

---

### Layout Components

#### EmptyState
```tsx
import { EmptyState } from '@/src/components/features/layout';

<EmptyState
  icon={<span className="material-symbols-outlined text-5xl">folder_open</span>}
  title="No documents yet"
  description="Drag and drop PDFs to get started."
  action={{
    label: 'Upload Documents',
    onClick: handleUpload,
    icon: <span className="material-symbols-outlined">upload</span>
  }}
/>
```

#### LoadingSpinner
```tsx
import { LoadingSpinner } from '@/src/components/features/layout';

<LoadingSpinner size="lg" text="Loading documents..." />
```

#### Modal
```tsx
import { Modal } from '@/src/components/features/layout';

<Modal
  open={isOpen}
  onClose={handleClose}
  title="Delete Document?"
  description="This action cannot be undone."
  actions={[
    { label: 'Cancel', onClick: handleClose, variant: 'secondary' },
    { label: 'Delete', onClick: handleDelete, variant: 'primary' }
  ]}
>
  <p>Are you sure you want to delete "{documentName}"?</p>
</Modal>
```

#### Toast
```tsx
import { Toast } from '@/src/components/molecules/Toast';

// Toast notifications for success/error messages
<Toast variant="success" message="Document uploaded successfully" />
<Toast variant="error" message="Upload failed. Please try again." />
```

---

## Accessibility

All components follow WCAG AA accessibility standards:

### Keyboard Navigation
- All interactive elements are focusable and operable via keyboard
- Tab/Shift+Tab to navigate
- Enter/Space to activate buttons
- ESC to close modals/dialogs

### ARIA Attributes
- Icon buttons have `aria-label`
- Modals have `aria-modal`, `aria-labelledby`, `aria-describedby`
- Navigation has `aria-label="Main navigation"`
- Status indicators use `role="status"` with `aria-live`

### Focus Indicators
All interactive elements show visible focus rings:
```tsx
className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
```

### Color Contrast
Text and backgrounds meet WCAG AA minimum contrast ratio (4.5:1).

---

## Responsive Design

Components adapt to different viewports using Tailwind breakpoints:

- **Mobile**: < 768px (default)
- **Tablet**: >= 768px (`md:` prefix)
- **Desktop**: >= 1024px (`lg:` prefix)

Example:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 1 column mobile, 2 tablet, 3 desktop */}
</div>
```

---

## Styling Utilities

### cn() Helper
Merges class names and resolves Tailwind conflicts:

```tsx
import { cn } from '@/src/lib/utils';

<div className={cn(
  'px-4 py-2',
  isActive && 'bg-primary',
  className // Allow parent overrides
)}>
```

### Material Symbols Icons
Icon system using Material Symbols:

```tsx
<span className="material-symbols-outlined">check_circle</span>
```

---

## Usage Best Practices

### 1. Server vs Client Components

- **Server Components** (default): Static rendering, no interactivity
- **Client Components**: Use `'use client'` directive for interactive components

```tsx
// Server Component (no directive needed)
export function DocumentList({ documents }) {
  return <div>{documents.map(...)}</div>;
}

// Client Component (needs interactivity)
'use client';
import { useState } from 'react';

export function UploadButton() {
  const [uploading, setUploading] = useState(false);
  return <button onClick={() => setUploading(true)}>Upload</button>;
}
```

### 2. Component Composition

Build complex UIs by composing simple components:

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    <EmptyState
      title="No items"
      action={{ label: 'Add Item', onClick: handleAdd }}
    />
  </CardContent>
</Card>
```

### 3. Type Safety

Always import types from `@repo/types`:

```tsx
import type { Document } from '@repo/types';

interface Props {
  document: Document;
  onDelete: (id: string) => void;
}
```

### 4. Error Handling

Show appropriate feedback for errors:

```tsx
// Inline error in forms
{error && <p className="text-sm text-error mt-1">{error}</p>}

// EmptyState for failed loads
{error && (
  <EmptyState
    icon={<span className="material-symbols-outlined">error</span>}
    title="Failed to load"
    description={error.message}
    action={{ label: 'Retry', onClick: retry }}
  />
)}
```

---

## Testing

### Manual Testing Checklist

For each component, verify:

1. **Visual Appearance**: Matches design system (colors, spacing, typography)
2. **Interactivity**: Buttons click, inputs accept text, dropdowns open
3. **States**: Loading, error, disabled, hover, focus work correctly
4. **Accessibility**: Keyboard navigation, focus visible, screen reader friendly
5. **Responsive**: Works on desktop (1024px+), tablet (768px), mobile (< 768px)
6. **TypeScript**: No type errors, props validated
7. **Composition**: Components compose together correctly

### Future Automated Testing

- **Vitest**: Component unit tests
- **Playwright**: E2E integration tests
- **Storybook**: Component catalog and visual testing

---

## Component Hierarchy

```
src/components/
├── atoms/              # Basic UI primitives
│   ├── Button/
│   ├── Badge/
│   ├── Card/
│   ├── Dialog/
│   ├── Input/
│   ├── Spinner/
│   └── ...
│
├── molecules/          # Simple composed components
│   ├── TextareaWithCounter/
│   ├── Toast/
│   ├── StatusLabel/
│   └── ...
│
├── organisms/          # Complex composed components
│   ├── Sidebar/
│   ├── Breadcrumb/
│   ├── ProgressTracker/
│   └── ...
│
└── features/           # Domain-specific components
    ├── navigation/     # Sidebar, Breadcrumb, ProgressSteps
    ├── forms/          # TagInput, DynamicList
    ├── cards/          # ProjectCard, DocumentCard, StatusBadge
    ├── buttons/        # PrimaryButton, SecondaryButton, IconButton
    └── layout/         # EmptyState, LoadingSpinner, Modal
```

---

## References

- **Tailwind CSS**: https://tailwindcss.com/docs
- **Next.js 15**: https://nextjs.org/docs
- **Material Symbols**: https://fonts.google.com/icons
- **Radix UI** (for accessible primitives): https://www.radix-ui.com/
