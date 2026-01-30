# Atomic Components

This directory contains the foundational atomic components for the Research Assistant application. All components are built with React, TypeScript, and Tailwind CSS, following the design system tokens defined in `tailwind.config.ts`.

## Components

### Button
**Location:** `/src/components/atoms/Button/`

A versatile button component supporting multiple variants, sizes, icons, and states.

**Props:**
- `variant?: 'primary' | 'secondary' | 'icon'` - Button style variant (default: 'primary')
- `size?: 'sm' | 'md' | 'lg'` - Button size (default: 'md')
- `icon?: React.ReactNode` - Optional icon element
- `loading?: boolean` - Show loading spinner (default: false)
- `disabled?: boolean` - Disable button (default: false)
- `children?: React.ReactNode` - Button content

**Usage:**
```tsx
import { Button } from '@/components/atoms';

// Primary button
<Button onClick={handleClick}>Submit</Button>

// Secondary with icon
<Button variant="secondary" icon={<SearchIcon />}>
  Search
</Button>

// Icon only button
<Button variant="icon" icon={<CloseIcon />} />

// Loading state
<Button loading>Processing...</Button>
```

---

### Input
**Location:** `/src/components/atoms/Input/`

A flexible input component supporting text inputs, search fields, and textareas with icon support.

**Props:**
- `type?: 'text' | 'search' | 'email' | 'password' | 'number' | 'url' | 'tel'` - Input type (default: 'text')
- `variant?: 'input' | 'textarea'` - Input or textarea variant (default: 'input')
- `placeholder?: string` - Placeholder text
- `icon?: React.ReactNode` - Optional icon
- `iconPosition?: 'left' | 'right'` - Icon position (default: 'left')
- `error?: string` - Error message to display
- `disabled?: boolean` - Disable input (default: false)
- `rows?: number` - Number of rows for textarea (default: 3)

**Usage:**
```tsx
import { Input } from '@/components/atoms';

// Text input with left icon
<Input
  type="text"
  placeholder="Enter your name"
  icon={<UserIcon />}
  value={name}
  onChange={(e) => setName(e.target.value)}
/>

// Search input
<Input
  type="search"
  placeholder="Search..."
  icon={<SearchIcon />}
/>

// Textarea
<Input
  variant="textarea"
  placeholder="Enter description"
  rows={5}
/>

// With error
<Input
  type="email"
  error="Please enter a valid email"
/>
```

---

### Select
**Location:** `/src/components/atoms/Select/`

A dropdown select component with custom styling and Material icon arrow.

**Props:**
- `options: SelectOption[]` - Array of options
- `value?: string` - Current selected value
- `onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void` - Change handler
- `placeholder?: string` - Placeholder text
- `disabled?: boolean` - Disable select (default: false)
- `error?: string` - Error message to display

**SelectOption Type:**
```typescript
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}
```

**Usage:**
```tsx
import { Select } from '@/components/atoms';

const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3', disabled: true },
];

<Select
  options={options}
  value={selectedValue}
  onChange={(e) => setSelectedValue(e.target.value)}
  placeholder="Select an option"
/>
```

---

### Badge
**Location:** `/src/components/atoms/Badge/`

A badge component for displaying status, categories, or labels.

**Props:**
- `variant?: 'primary' | 'success' | 'warning' | 'error' | 'neutral' | 'processing'` - Badge style (default: 'neutral')
- `size?: 'sm' | 'md'` - Badge size (default: 'md')
- `children: React.ReactNode` - Badge content (required)

**Usage:**
```tsx
import { Badge } from '@/components/atoms';

<Badge variant="success">Completed</Badge>
<Badge variant="warning" size="sm">Pending</Badge>
<Badge variant="error">Failed</Badge>
<Badge variant="processing">In Progress</Badge>
<Badge variant="primary">New</Badge>
```

---

### Checkbox
**Location:** `/src/components/atoms/Checkbox/`

A styled checkbox component with optional label and error support.

**Props:**
- `checked?: boolean` - Checked state
- `onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void` - Change handler
- `label?: string` - Optional label text
- `disabled?: boolean` - Disable checkbox (default: false)
- `error?: string` - Error message to display

**Usage:**
```tsx
import { Checkbox } from '@/components/atoms';

<Checkbox
  checked={isChecked}
  onChange={(e) => setIsChecked(e.target.checked)}
  label="I agree to the terms"
/>

<Checkbox
  checked={false}
  disabled
  label="Disabled option"
/>
```

---

### Radio
**Location:** `/src/components/atoms/Radio/`

A styled radio button component with optional label and error support.

**Props:**
- `value: string` - Radio button value (required)
- `name: string` - Radio group name (required)
- `checked?: boolean` - Checked state
- `onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void` - Change handler
- `label?: string` - Optional label text
- `disabled?: boolean` - Disable radio (default: false)
- `error?: string` - Error message to display

**Usage:**
```tsx
import { Radio } from '@/components/atoms';

<Radio
  name="option"
  value="option1"
  checked={selectedOption === 'option1'}
  onChange={(e) => setSelectedOption(e.target.value)}
  label="Option 1"
/>

<Radio
  name="option"
  value="option2"
  checked={selectedOption === 'option2'}
  onChange={(e) => setSelectedOption(e.target.value)}
  label="Option 2"
/>
```

---

## Design Tokens

All components use the design tokens defined in `tailwind.config.ts`:

**Colors:**
- `primary` - #4A90E2 (Calm Blue)
- `success` - #27AE60 (Success Green)
- `warning` - #F39C12 (Warning Amber)
- `error` - #E74C3C (Error Red)
- `processing` - #9B59B6 (Processing Purple)
- `text-primary` - #2C3E50 (Deep Navy)
- `text-secondary` - #95A5A6 (Warm Gray)
- `background` - #FAFBFC (Soft White)

**Spacing:**
- `xs` - 4px
- `sm` - 8px
- `md` - 16px
- `lg` - 24px
- `xl` - 32px
- `xxl` - 48px

**Shadows:**
- `shadow-subtle` - 0 2px 8px rgba(0,0,0,0.08)
- `shadow-medium` - 0 4px 12px rgba(0,0,0,0.15)
- `shadow-strong` - 0 8px 24px rgba(0,0,0,0.25)

**Border Radius:**
- `rounded-sm` - 4px
- `rounded-md` - 6px
- `rounded-lg` - 8px

**Transitions:**
- `duration-fast` - 150ms
- `duration-standard` - 300ms
- `duration-slow` - 500ms

---

## Accessibility

All components include proper accessibility features:
- Semantic HTML elements
- ARIA attributes (aria-label, aria-invalid, aria-describedby)
- Focus states with visible ring indicators
- Keyboard navigation support
- Screen reader friendly error messages
- Disabled state handling

---

## TypeScript Support

All components are fully typed with TypeScript interfaces exported alongside the components:

```tsx
import type { ButtonProps, InputProps, SelectProps } from '@/components/atoms';
```

---

## React.forwardRef Support

Form control components (Button, Input, Select, Checkbox, Radio) support ref forwarding for integration with form libraries like React Hook Form:

```tsx
const inputRef = useRef<HTMLInputElement>(null);

<Input ref={inputRef} type="text" />
```
