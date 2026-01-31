// Re-export navigation components from organisms
export { Sidebar } from '../../organisms/Sidebar';
export type { SidebarProps, SidebarProject } from '../../organisms/Sidebar';

export { Breadcrumb } from '../../organisms/Breadcrumb';
export type { BreadcrumbProps, BreadcrumbItem } from '../../organisms/Breadcrumb';

// ProgressSteps is an alias for ProgressTracker
export { ProgressTracker as ProgressSteps } from '../../organisms/ProgressTracker';
export type { ProgressTrackerProps as ProgressStepsProps, ProgressStep } from '../../organisms/ProgressTracker';
