import React from 'react';
import {
  Header,
  Sidebar,
  Breadcrumb,
  DocumentQueue,
  ThemeCard,
  ProgressTracker,
  PDFViewer,
  DataTable,
} from './index';
import { Badge } from '../atoms/Badge/Badge';

/**
 * Example usage of all organism components
 * This file demonstrates how to use each organism component with realistic data
 */

export const OrganismExamples: React.FC = () => {
  return (
    <div className="space-y-lg p-lg">
      <h1 className="text-h4 font-bold">Organism Components Examples</h1>

      {/* Header Example */}
      <section>
        <h2 className="text-h5 font-bold mb-md">Header</h2>
        <Header
          userName="Dr. Jane Smith"
          userRole="Senior Researcher"
          notificationCount={3}
          messageCount={5}
          onNotificationClick={() => console.log('Notifications clicked')}
          onMessageClick={() => console.log('Messages clicked')}
          onSignOut={() => console.log('Sign out')}
          onProfileClick={() => console.log('Profile clicked')}
        />
      </section>

      {/* Sidebar Example */}
      <section>
        <h2 className="text-h5 font-bold mb-md">Sidebar</h2>
        <div className="h-[600px] border border-border rounded-lg overflow-hidden">
          <Sidebar
            currentPath="/dashboard"
            projects={[
              { id: '1', name: 'Climate Research', count: 24, icon: 'science' },
              { id: '2', name: 'AI Ethics Study', count: 12, icon: 'psychology' },
              { id: '3', name: 'Medical Innovations', count: 8, icon: 'local_hospital' },
            ]}
            onNavigate={(path) => console.log('Navigate to:', path)}
            userName="Dr. Jane Smith"
            userRole="Senior Researcher"
          />
        </div>
      </section>

      {/* Breadcrumb Example */}
      <section>
        <h2 className="text-h5 font-bold mb-md">Breadcrumb</h2>
        <Breadcrumb
          items={[
            { label: 'Projects', href: '/projects' },
            { label: 'Climate Research', href: '/projects/climate' },
            { label: 'Documents', href: '/projects/climate/documents' },
          ]}
          currentPage="Review Analysis"
          onNavigate={(href) => console.log('Navigate to:', href)}
        />
      </section>

      {/* DocumentQueue Example */}
      <section>
        <h2 className="text-h5 font-bold mb-md">DocumentQueue</h2>
        <div className="h-[500px]">
          <DocumentQueue
            documents={[
              {
                id: '1',
                fileName: 'climate-change-impacts-2024.pdf',
                fileSize: '2.4 MB',
                status: 'ready',
              },
              {
                id: '2',
                fileName: 'methodology-systematic-review.pdf',
                fileSize: '1.8 MB',
                status: 'processing',
              },
              {
                id: '3',
                fileName: 'biodiversity-loss-study.pdf',
                fileSize: '3.1 MB',
                status: 'ready',
              },
              {
                id: '4',
                fileName: 'failed-upload.pdf',
                fileSize: '1.2 MB',
                status: 'error',
              },
            ]}
            onClearAll={() => console.log('Clear all')}
            onDeleteDocument={(id) => console.log('Delete document:', id)}
            onGenerateReview={() => console.log('Generate review')}
            isProcessing={false}
            totalSize="8.5 MB"
            estimatedTime="~4 mins"
          />
        </div>
      </section>

      {/* ThemeCard Example */}
      <section>
        <h2 className="text-h5 font-bold mb-md">ThemeCard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          <ThemeCard
            theme={{
              id: 'theme-1',
              title: 'Impact of Climate Change on Biodiversity',
              relevance: 85,
              consensus: {
                label: 'Strong Agreement',
                description:
                  'Multiple studies confirm significant biodiversity loss in tropical regions due to temperature increases and habitat destruction.',
              },
              conflicts: {
                label: 'Methodology Disputes',
                description:
                  'Different approaches to measuring biodiversity lead to varying estimates of species loss rates.',
              },
              citations: 24,
              authors: ['Dr. Smith', 'Dr. Johnson', 'Dr. Lee'],
            }}
            onViewDetails={(id) => console.log('View details:', id)}
            onExport={(id) => console.log('Export:', id)}
          />
          <ThemeCard
            theme={{
              id: 'theme-2',
              title: 'Renewable Energy Adoption Patterns',
              relevance: 62,
              consensus: {
                label: 'General Agreement',
                description:
                  'Studies show increasing adoption of solar and wind energy in developed countries.',
              },
              citations: 18,
              authors: ['Dr. Brown', 'Dr. Davis'],
            }}
            onViewDetails={(id) => console.log('View details:', id)}
            onExport={(id) => console.log('Export:', id)}
          />
        </div>
      </section>

      {/* ProgressTracker Example - Horizontal */}
      <section>
        <h2 className="text-h5 font-bold mb-md">ProgressTracker - Horizontal</h2>
        <ProgressTracker
          steps={[
            {
              label: 'Upload Documents',
              description: 'Add your research papers',
              status: 'completed',
            },
            {
              label: 'Process Content',
              description: 'Extract and analyze text',
              status: 'current',
            },
            {
              label: 'Generate Review',
              description: 'Create literature review',
              status: 'pending',
            },
            {
              label: 'Export Results',
              description: 'Download your review',
              status: 'pending',
            },
          ]}
          orientation="horizontal"
        />
      </section>

      {/* ProgressTracker Example - Vertical */}
      <section>
        <h2 className="text-h5 font-bold mb-md">ProgressTracker - Vertical</h2>
        <ProgressTracker
          steps={[
            { label: 'Document Upload', status: 'completed' },
            { label: 'Content Extraction', status: 'completed' },
            { label: 'Theme Analysis', status: 'current' },
            { label: 'Citation Mapping', status: 'pending' },
            { label: 'Review Generation', status: 'pending' },
          ]}
          orientation="vertical"
        />
      </section>

      {/* PDFViewer Example */}
      <section>
        <h2 className="text-h5 font-bold mb-md">PDFViewer</h2>
        <div className="h-[600px]">
          <PDFViewer
            fileName="climate-change-impacts-2024.pdf"
            currentPage={1}
            totalPages={15}
            pdfUrl="/documents/sample.pdf"
            onPageChange={(page) => console.log('Page changed:', page)}
            onClose={() => console.log('Close PDF viewer')}
            onDownload={() => console.log('Download PDF')}
          />
        </div>
      </section>

      {/* DataTable Example */}
      <section>
        <h2 className="text-h5 font-bold mb-md">DataTable</h2>
        <DataTable
          columns={[
            { key: 'title', label: 'Title', sortable: true },
            { key: 'author', label: 'Author', sortable: true },
            { key: 'year', label: 'Year', sortable: true, align: 'center', width: '100px' },
            { key: 'citations', label: 'Citations', sortable: true, align: 'center', width: '120px' },
            {
              key: 'status',
              label: 'Status',
              align: 'center',
              width: '120px',
              render: (value) => (
                <Badge
                  variant={
                    value === 'published'
                      ? 'success'
                      : value === 'review'
                      ? 'warning'
                      : 'neutral'
                  }
                >
                  {value}
                </Badge>
              ),
            },
          ]}
          data={[
            {
              id: '1',
              title: 'Climate Change Effects on Biodiversity',
              author: 'Dr. Smith',
              year: 2024,
              citations: 42,
              status: 'published',
            },
            {
              id: '2',
              title: 'Systematic Review Methodologies',
              author: 'Dr. Johnson',
              year: 2023,
              citations: 38,
              status: 'published',
            },
            {
              id: '3',
              title: 'AI in Research Analysis',
              author: 'Dr. Lee',
              year: 2024,
              citations: 15,
              status: 'review',
            },
            {
              id: '4',
              title: 'Renewable Energy Adoption',
              author: 'Dr. Brown',
              year: 2023,
              citations: 28,
              status: 'published',
            },
            {
              id: '5',
              title: 'Medical Innovation Trends',
              author: 'Dr. Davis',
              year: 2024,
              citations: 12,
              status: 'draft',
            },
          ]}
          selectable
          onRowClick={(row) => console.log('Row clicked:', row)}
          onSelectionChange={(selected) => console.log('Selection changed:', selected)}
          rowKey="id"
        />
      </section>
    </div>
  );
};

export default OrganismExamples;
