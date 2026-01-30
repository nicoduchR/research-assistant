# Molecule Components

Molecule components are composite components that combine atomic components to create functional UI elements. They represent the next level in our atomic design system.

## Components

### FileItem

A file list item component displaying PDF files with their metadata and status.

**Props:**
- `fileName` (string): Name of the file
- `fileSize` (string): File size (e.g., "2.5 MB")
- `status` ('ready' | 'processing' | 'error'): Current file status
- `onDelete` (function, optional): Callback when delete button is clicked
- `className` (string, optional): Additional CSS classes

**Usage:**
```tsx
import { FileItem } from '@/components/molecules';

<FileItem
  fileName="research-paper.pdf"
  fileSize="2.5 MB"
  status="ready"
  onDelete={() => console.log('Delete file')}
/>
```

**Features:**
- PDF icon with colored background
- Filename truncation for long names
- Status badge with icon
- Delete button appears on hover
- Different status states: ready (green), processing (purple with spinner), error (red)

---

### SearchBar

A search input with icon and optional search button.

**Props:**
- `placeholder` (string, optional): Placeholder text (default: "Search...")
- `value` (string, optional): Controlled input value
- `onChange` (function, optional): Change event handler
- `onSearch` (function, optional): Search callback (triggered on Enter or button click)
- `showSearchButton` (boolean, optional): Show search button (default: false)
- `disabled` (boolean, optional): Disable input (default: false)
- `className` (string, optional): Additional CSS classes

**Usage:**
```tsx
import { SearchBar } from '@/components/molecules';

const [searchQuery, setSearchQuery] = useState('');

<SearchBar
  placeholder="Search documents..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  onSearch={() => console.log('Search:', searchQuery)}
  showSearchButton
/>
```

**Features:**
- Search icon on the left
- Optional search button on the right
- Enter key triggers search
- Accessible with proper ARIA attributes

---

### ProgressIndicator

A progress bar with label and percentage display.

**Props:**
- `label` (string): Progress label
- `percentage` (number): Progress percentage (0-100)
- `status` ('default' | 'success' | 'error' | 'processing', optional): Progress status (default: 'default')
- `showPercentage` (boolean, optional): Show percentage text (default: true)
- `className` (string, optional): Additional CSS classes

**Usage:**
```tsx
import { ProgressIndicator } from '@/components/molecules';

<ProgressIndicator
  label="Processing documents"
  percentage={75}
  status="processing"
/>
```

**Features:**
- Animated progress bar with smooth transitions
- Colored fill based on status
- Auto-clamped percentage (0-100)
- Accessible with proper ARIA attributes

---

### StatusLabel

A colored information box with icon and title.

**Props:**
- `type` ('consensus' | 'conflict' | 'info' | 'warning'): Status type
- `title` (string): Title text
- `children` (ReactNode, optional): Additional content
- `className` (string, optional): Additional CSS classes

**Usage:**
```tsx
import { StatusLabel } from '@/components/molecules';

<StatusLabel type="consensus" title="High Consensus">
  This finding is supported by 8 out of 10 sources.
</StatusLabel>

<StatusLabel type="conflict" title="Conflicting Information">
  Some sources disagree on this point.
</StatusLabel>
```

**Features:**
- Colored left border matching status type
- Icon representing the status
- Bold title
- Optional content area
- Four types: consensus (green), conflict (amber), info (blue), warning (red)

---

### FilterChip

A filter tag component with optional remove button.

**Props:**
- `label` (string): Chip label text
- `active` (boolean, optional): Active state (default: false)
- `onRemove` (function, optional): Callback when remove button is clicked
- `onClick` (function, optional): Callback when chip is clicked
- `className` (string, optional): Additional CSS classes

**Usage:**
```tsx
import { FilterChip } from '@/components/molecules';

<FilterChip
  label="Machine Learning"
  active
  onRemove={() => console.log('Remove filter')}
/>

<FilterChip
  label="2023"
  onClick={() => console.log('Toggle filter')}
/>
```

**Features:**
- Rounded pill design
- Active/inactive states with different styling
- Optional remove button (X icon)
- Optional click handler for toggle behavior
- Keyboard accessible

---

### CitationBadge

A clickable citation reference badge.

**Props:**
- `author` (string): Author name
- `year` (string | number): Publication year
- `page` (string | number, optional): Page number
- `onClick` (function, optional): Click callback
- `className` (string, optional): Additional CSS classes

**Usage:**
```tsx
import { CitationBadge } from '@/components/molecules';

<CitationBadge
  author="Smith"
  year={2023}
  page={45}
  onClick={() => console.log('Navigate to citation')}
/>
```

**Features:**
- Formatted citation text (e.g., "Smith, 2023, p.45")
- Link icon when clickable
- Hover effects
- Keyboard accessible
- Non-clickable variant for static display

---

### DropZone

A drag-and-drop file upload area.

**Props:**
- `onDrop` (function): Callback with FileList when files are dropped
- `disabled` (boolean, optional): Disable drop zone (default: false)
- `accept` (string, optional): Accepted file types (default: '.pdf')
- `multiple` (boolean, optional): Allow multiple files (default: true)
- `maxSize` (number, optional): Max file size in MB (default: 10)
- `className` (string, optional): Additional CSS classes

**Usage:**
```tsx
import { DropZone } from '@/components/molecules';

<DropZone
  onDrop={(files) => {
    console.log('Files dropped:', files);
    // Handle file upload
  }}
  accept=".pdf,.doc,.docx"
  maxSize={20}
/>
```

**Features:**
- Drag and drop functionality
- Click to browse files
- Visual feedback on drag over
- File type and size restrictions display
- Keyboard accessible
- Disabled state support

---

### Toast

A notification message component with auto-dismiss.

**Props:**
- `message` (string): Main notification message
- `description` (string, optional): Additional description text
- `type` ('success' | 'error' | 'info' | 'warning', optional): Notification type (default: 'info')
- `onClose` (function, optional): Callback when toast is closed
- `autoDismiss` (boolean, optional): Auto-dismiss after duration (default: true)
- `duration` (number, optional): Auto-dismiss duration in ms (default: 5000)
- `className` (string, optional): Additional CSS classes

**Usage:**
```tsx
import { Toast } from '@/components/molecules';

<Toast
  message="File uploaded successfully"
  description="Your document has been processed"
  type="success"
  onClose={() => console.log('Toast closed')}
/>

<Toast
  message="An error occurred"
  description="Please try again later"
  type="error"
  autoDismiss={false}
  onClose={() => console.log('Toast closed')}
/>
```

**Features:**
- Four types: success, error, info, warning
- Auto-dismiss with configurable duration
- Manual close button
- Slide-in animation from bottom
- Fade-in/out transitions
- Accessible with proper ARIA attributes

---

## Design System Integration

All molecule components:
- Use atomic components (Button, Badge, Input) as building blocks
- Follow the design system tokens from `tailwind.config.ts`
- Include proper TypeScript types
- Are accessible with ARIA attributes
- Use Material Symbols icons
- Support custom className for extension
- Include displayName for debugging

## Animation & Transitions

Components use the design system's transition durations:
- `duration-fast`: 150ms (hover states, small transitions)
- `duration-standard`: 300ms (progress bars, toast animations)
- `duration-slow`: 500ms (complex animations)

Custom easing functions:
- `ease-out-custom`: For smooth progress animations
- `ease-in-out-custom`: For balanced transitions

## Accessibility

All components include:
- Proper ARIA roles and labels
- Keyboard navigation support
- Focus indicators
- Screen reader friendly content
- Semantic HTML structure

## Icons

Components use Material Symbols icons. Common icons used:
- `picture_as_pdf`: PDF files
- `search`: Search functionality
- `check_circle`: Success status
- `sync`: Processing/loading
- `error`: Error status
- `warning`: Warning status
- `verified`: Consensus/verified
- `info`: Information
- `link`: Citations/links
- `cloud_upload`: File upload
- `close`: Close/remove actions
- `delete`: Delete actions
