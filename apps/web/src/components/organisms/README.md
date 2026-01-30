# Organism Components

Complex components that combine molecules and atoms to create complete interface sections. These are the building blocks of pages and templates.

## Components

### Header

Top navigation bar with branding, notifications, and user profile.

**Features:**
- Responsive logo/brand display
- Notification and message icons with badge counts
- User profile dropdown menu
- Mobile-responsive (hides some elements on small screens)
- Click-outside detection for dropdown

**Props:**
```typescript
interface HeaderProps {
  userName?: string;              // Display name
  userRole?: string;              // User role/title
  notificationCount?: number;     // Unread notifications
  messageCount?: number;          // Unread messages
  onNotificationClick?: () => void;
  onMessageClick?: () => void;
  onSignOut?: () => void;
  onProfileClick?: () => void;
  className?: string;
}
```

**Usage:**
```tsx
import { Header } from '@/components/organisms';

<Header
  userName="Dr. Jane Smith"
  userRole="Senior Researcher"
  notificationCount={3}
  messageCount={5}
  onNotificationClick={() => console.log('Notifications')}
  onMessageClick={() => console.log('Messages')}
  onSignOut={() => console.log('Sign out')}
  onProfileClick={() => console.log('Profile')}
/>
```

---

### Sidebar

Side navigation panel with menu items, smart folders, and projects.

**Features:**
- Active state highlighting for current route
- Expandable sections (Main Menu, Smart Folders, Projects)
- Badge counts for items
- User profile section at bottom
- Scrollable content area

**Props:**
```typescript
interface SidebarProject {
  id: string;
  name: string;
  count?: number;
  icon?: string;
}

interface SidebarProps {
  currentPath?: string;           // Current active path
  projects?: SidebarProject[];    // User projects
  onNavigate?: (path: string) => void;
  userName?: string;
  userRole?: string;
  className?: string;
}
```

**Usage:**
```tsx
import { Sidebar } from '@/components/organisms';

<Sidebar
  currentPath="/dashboard"
  projects={[
    { id: '1', name: 'Climate Research', count: 24, icon: 'science' },
    { id: '2', name: 'AI Ethics Study', count: 12, icon: 'psychology' }
  ]}
  onNavigate={(path) => router.push(path)}
  userName="Dr. Jane Smith"
  userRole="Senior Researcher"
/>
```

---

### Breadcrumb

Navigation breadcrumb trail showing current location in hierarchy.

**Features:**
- Clickable path items with hover states
- Last item is non-clickable and bold
- Chevron separators between items
- Custom navigation handler

**Props:**
```typescript
interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];        // Path items
  currentPage?: string;           // Current page label
  onNavigate?: (href: string) => void;
  className?: string;
}
```

**Usage:**
```tsx
import { Breadcrumb } from '@/components/organisms';

<Breadcrumb
  items={[
    { label: 'Projects', href: '/projects' },
    { label: 'Climate Research', href: '/projects/climate' }
  ]}
  currentPage="Documents"
  onNavigate={(href) => router.push(href)}
/>
```

---

### DocumentQueue

File list panel with action button for processing documents.

**Features:**
- Header with document count badge
- Scrollable file list
- Footer with stats (total size, estimated time)
- Status indicators (processing, errors)
- Generate review button with loading state
- Empty state

**Props:**
```typescript
interface DocumentQueueDocument {
  id: string;
  fileName: string;
  fileSize: string;
  status: 'ready' | 'processing' | 'error';
}

interface DocumentQueueProps {
  documents: DocumentQueueDocument[];
  onClearAll?: () => void;
  onDeleteDocument?: (id: string) => void;
  onGenerateReview?: () => void;
  isProcessing?: boolean;
  totalSize?: string;
  estimatedTime?: string;
  className?: string;
}
```

**Usage:**
```tsx
import { DocumentQueue } from '@/components/organisms';

<DocumentQueue
  documents={[
    {
      id: '1',
      fileName: 'research-paper-2024.pdf',
      fileSize: '2.4 MB',
      status: 'ready'
    },
    {
      id: '2',
      fileName: 'methodology-study.pdf',
      fileSize: '1.8 MB',
      status: 'processing'
    }
  ]}
  onClearAll={() => console.log('Clear all')}
  onDeleteDocument={(id) => console.log('Delete', id)}
  onGenerateReview={() => console.log('Generate')}
  isProcessing={false}
  totalSize="4.2 MB"
  estimatedTime="~3 mins"
/>
```

---

### ThemeCard

Research theme analysis card with consensus/conflicts.

**Features:**
- Relevance score badge (High/Medium/Low)
- Consensus and conflict sections with StatusLabel
- Author information with count
- Citation count badge
- Action buttons (View Details, Export)

**Props:**
```typescript
interface ThemeCardData {
  title: string;
  relevance: number;              // 0-100
  consensus?: {
    label: string;
    description: string;
  };
  conflicts?: {
    label: string;
    description: string;
  };
  citations: number;
  authors?: string[];
  id?: string;
}

interface ThemeCardProps {
  theme: ThemeCardData;
  onViewDetails?: (id?: string) => void;
  onExport?: (id?: string) => void;
  className?: string;
}
```

**Usage:**
```tsx
import { ThemeCard } from '@/components/organisms';

<ThemeCard
  theme={{
    title: 'Impact of Climate Change on Biodiversity',
    relevance: 85,
    consensus: {
      label: 'Strong Agreement',
      description: 'Multiple studies confirm significant biodiversity loss...'
    },
    conflicts: {
      label: 'Methodology Disputes',
      description: 'Different approaches to measuring biodiversity...'
    },
    citations: 24,
    authors: ['Dr. Smith', 'Dr. Johnson', 'Dr. Lee'],
    id: 'theme-1'
  }}
  onViewDetails={(id) => console.log('View', id)}
  onExport={(id) => console.log('Export', id)}
/>
```

---

### ProgressTracker

Multi-step progress visualization with horizontal/vertical layouts.

**Features:**
- Three states: pending, current, completed
- Visual feedback (checkmark, pulse animation)
- Connecting lines between steps
- Optional step descriptions
- Horizontal or vertical orientation

**Props:**
```typescript
type StepStatus = 'pending' | 'current' | 'completed';

interface ProgressStep {
  label: string;
  description?: string;
  status: StepStatus;
}

interface ProgressTrackerProps {
  steps: ProgressStep[];
  currentStep?: number;           // Alternative to individual status
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}
```

**Usage:**
```tsx
import { ProgressTracker } from '@/components/organisms';

// Option 1: Using step status
<ProgressTracker
  steps={[
    { label: 'Upload Documents', status: 'completed' },
    { label: 'Process Content', status: 'current' },
    { label: 'Generate Review', status: 'pending' },
    { label: 'Export Results', status: 'pending' }
  ]}
  orientation="horizontal"
/>

// Option 2: Using currentStep
<ProgressTracker
  steps={[
    { label: 'Upload Documents', description: 'Add your research papers' },
    { label: 'Process Content', description: 'Extract and analyze text' },
    { label: 'Generate Review', description: 'Create literature review' },
    { label: 'Export Results', description: 'Download your review' }
  ]}
  currentStep={1}
  orientation="vertical"
/>
```

---

### PDFViewer

PDF viewing sidebar with navigation and zoom controls.

**Features:**
- Header with filename and pagination info
- Page navigation controls (prev/next, jump to page)
- Zoom controls (in/out/reset)
- Download button
- Placeholder for PDF rendering (ready for react-pdf integration)

**Props:**
```typescript
interface PDFViewerProps {
  fileName: string;
  currentPage?: number;
  totalPages?: number;
  pdfUrl?: string;
  onPageChange?: (page: number) => void;
  onClose?: () => void;
  onDownload?: () => void;
  className?: string;
}
```

**Usage:**
```tsx
import { PDFViewer } from '@/components/organisms';

<PDFViewer
  fileName="research-paper-2024.pdf"
  currentPage={1}
  totalPages={15}
  pdfUrl="/documents/research-paper.pdf"
  onPageChange={(page) => console.log('Page', page)}
  onClose={() => console.log('Close')}
  onDownload={() => console.log('Download')}
/>
```

**Note:** This component is a skeleton/placeholder. For actual PDF rendering, integrate the `react-pdf` library:
```bash
npm install react-pdf
```

---

### DataTable

Sortable data table with row selection.

**Features:**
- Sortable columns (asc/desc/none)
- Row selection with checkboxes
- Select all functionality
- Row click handler
- Custom cell rendering
- Hover states
- Empty state
- Responsive horizontal scrolling

**Props:**
```typescript
type SortDirection = 'asc' | 'desc' | null;

interface DataTableColumn<T> {
  key: string;                    // Data property key
  label: string;                  // Column header
  sortable?: boolean;
  width?: string;                 // CSS width
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T, index: number) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  onRowClick?: (row: T, index: number) => void;
  onSelectionChange?: (selectedRows: T[]) => void;
  selectable?: boolean;
  rowKey?: string | ((row: T) => string);
  className?: string;
}
```

**Usage:**
```tsx
import { DataTable, Badge } from '@/components/organisms';

const columns = [
  { key: 'title', label: 'Title', sortable: true },
  { key: 'author', label: 'Author', sortable: true },
  { key: 'year', label: 'Year', sortable: true, align: 'center' as const },
  {
    key: 'status',
    label: 'Status',
    render: (value) => (
      <Badge variant={value === 'published' ? 'success' : 'warning'}>
        {value}
      </Badge>
    )
  }
];

const data = [
  {
    id: '1',
    title: 'Climate Change Effects',
    author: 'Dr. Smith',
    year: 2024,
    status: 'published'
  },
  {
    id: '2',
    title: 'Biodiversity Study',
    author: 'Dr. Johnson',
    year: 2023,
    status: 'draft'
  }
];

<DataTable
  columns={columns}
  data={data}
  selectable
  onRowClick={(row) => console.log('Clicked', row)}
  onSelectionChange={(selected) => console.log('Selected', selected)}
  rowKey="id"
/>
```

---

## Design Tokens

All organisms use the design system tokens defined in `tailwind.config.js`:

**Colors:**
- `primary` - Brand color
- `success` - Success states
- `warning` - Warning states
- `error` - Error states
- `processing` - Processing states
- `muted` - Muted backgrounds

**Spacing:**
- `xs`, `sm`, `md`, `lg`, `xl` - Consistent spacing scale

**Shadows:**
- `shadow-subtle` - Light elevation
- `shadow-medium` - Medium elevation

**Transitions:**
- `duration-fast` - Quick transitions (150ms)
- `duration-normal` - Normal transitions (200ms)

---

## Icons

All components use Material Symbols icons via the `material-symbols-outlined` class:

```html
<span class="material-symbols-outlined">icon_name</span>
```

Common icons used:
- `science` - Brand/research
- `notifications`, `mail` - Communication
- `person`, `account_circle` - User
- `dashboard`, `folder`, `description` - Navigation
- `check_circle`, `error`, `sync` - Status
- `chevron_left`, `chevron_right` - Navigation
- `picture_as_pdf` - Documents
- `download`, `upload` - File actions

---

## Accessibility

All organism components include:
- Proper ARIA labels and roles
- Keyboard navigation support
- Focus states
- Screen reader friendly text
- Semantic HTML structure

---

## Responsive Design

Components adapt to different screen sizes:
- Header hides notification/message buttons on mobile
- Sidebar uses fixed width (can be toggled on mobile)
- DataTable scrolls horizontally on small screens
- ProgressTracker supports vertical orientation for mobile

---

## Examples

See individual component sections above for detailed usage examples. All components can be imported from the organisms barrel export:

```tsx
import {
  Header,
  Sidebar,
  Breadcrumb,
  DocumentQueue,
  ThemeCard,
  ProgressTracker,
  PDFViewer,
  DataTable
} from '@/components/organisms';
```
