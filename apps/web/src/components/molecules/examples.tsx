/**
 * Molecule Components Examples
 *
 * This file demonstrates the usage of all molecule components
 * in the Research Assistant design system.
 */

import React, { useState } from 'react';
import {
  FileItem,
  SearchBar,
  ProgressIndicator,
  StatusLabel,
  FilterChip,
  CitationBadge,
  DropZone,
  Toast,
} from './index';

export const MoleculeExamples: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>(['Machine Learning']);

  return (
    <div className="p-xl space-y-xl max-w-4xl mx-auto">
      <h1 className="text-h1 text-text-primary mb-lg">Molecule Components Examples</h1>

      {/* FileItem Examples */}
      <section className="space-y-md">
        <h2 className="text-h2 text-text-primary">FileItem</h2>
        <div className="space-y-sm">
          <FileItem
            fileName="machine-learning-overview.pdf"
            fileSize="2.5 MB"
            status="ready"
            onDelete={() => console.log('Delete file 1')}
          />
          <FileItem
            fileName="deep-learning-neural-networks-comprehensive-analysis.pdf"
            fileSize="5.8 MB"
            status="processing"
            onDelete={() => console.log('Delete file 2')}
          />
          <FileItem
            fileName="ai-research-2023.pdf"
            fileSize="1.2 MB"
            status="error"
            onDelete={() => console.log('Delete file 3')}
          />
        </div>
      </section>

      {/* SearchBar Examples */}
      <section className="space-y-md">
        <h2 className="text-h2 text-text-primary">SearchBar</h2>
        <div className="space-y-sm">
          <SearchBar
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onSearch={() => console.log('Search:', searchQuery)}
          />
          <SearchBar
            placeholder="Search with button..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onSearch={() => console.log('Search:', searchQuery)}
            showSearchButton
          />
          <SearchBar
            placeholder="Disabled search..."
            disabled
          />
        </div>
      </section>

      {/* ProgressIndicator Examples */}
      <section className="space-y-md">
        <h2 className="text-h2 text-text-primary">ProgressIndicator</h2>
        <div className="space-y-md">
          <ProgressIndicator
            label="Processing documents"
            percentage={35}
            status="processing"
          />
          <ProgressIndicator
            label="Analysis complete"
            percentage={100}
            status="success"
          />
          <ProgressIndicator
            label="Upload failed"
            percentage={67}
            status="error"
          />
          <ProgressIndicator
            label="Loading resources"
            percentage={50}
            status="default"
          />
        </div>
      </section>

      {/* StatusLabel Examples */}
      <section className="space-y-md">
        <h2 className="text-h2 text-text-primary">StatusLabel</h2>
        <div className="space-y-sm">
          <StatusLabel type="consensus" title="High Consensus">
            This finding is supported by 8 out of 10 sources.
          </StatusLabel>
          <StatusLabel type="conflict" title="Conflicting Information">
            Some sources disagree on this methodology.
          </StatusLabel>
          <StatusLabel type="info" title="Additional Information">
            Related research suggests further investigation is needed.
          </StatusLabel>
          <StatusLabel type="warning" title="Attention Required">
            This claim has limited source verification.
          </StatusLabel>
        </div>
      </section>

      {/* FilterChip Examples */}
      <section className="space-y-md">
        <h2 className="text-h2 text-text-primary">FilterChip</h2>
        <div className="flex flex-wrap gap-sm">
          <FilterChip
            label="Machine Learning"
            active={activeFilters.includes('Machine Learning')}
            onRemove={() => setActiveFilters(prev => prev.filter(f => f !== 'Machine Learning'))}
          />
          <FilterChip
            label="2023"
            onClick={() => console.log('Toggle 2023 filter')}
          />
          <FilterChip
            label="Neural Networks"
            active
          />
          <FilterChip
            label="Deep Learning"
          />
        </div>
      </section>

      {/* CitationBadge Examples */}
      <section className="space-y-md">
        <h2 className="text-h2 text-text-primary">CitationBadge</h2>
        <div className="flex flex-wrap gap-sm">
          <CitationBadge
            author="Smith"
            year={2023}
            page={45}
            onClick={() => console.log('Navigate to citation')}
          />
          <CitationBadge
            author="Johnson et al."
            year={2022}
            onClick={() => console.log('Navigate to citation')}
          />
          <CitationBadge
            author="Brown"
            year={2024}
            page="12-15"
          />
        </div>
      </section>

      {/* DropZone Example */}
      <section className="space-y-md">
        <h2 className="text-h2 text-text-primary">DropZone</h2>
        <DropZone
          onDrop={(files) => {
            console.log('Files dropped:', files);
            setShowToast(true);
          }}
          accept=".pdf,.doc,.docx"
          maxSize={20}
        />
        <DropZone
          onDrop={(files) => console.log('Files dropped:', files)}
          disabled
        />
      </section>

      {/* Toast Examples */}
      <section className="space-y-md">
        <h2 className="text-h2 text-text-primary">Toast</h2>
        <div className="flex gap-sm flex-wrap">
          <button
            onClick={() => setShowToast(true)}
            className="px-md py-sm bg-primary text-white rounded-md"
          >
            Show Success Toast
          </button>
        </div>

        <div className="space-y-sm">
          <Toast
            message="File uploaded successfully"
            description="Your document has been processed"
            type="success"
            onClose={() => console.log('Toast closed')}
            autoDismiss={false}
          />
          <Toast
            message="An error occurred"
            description="Please try again later"
            type="error"
            onClose={() => console.log('Toast closed')}
            autoDismiss={false}
          />
          <Toast
            message="Processing your request"
            description="This may take a few moments"
            type="info"
            onClose={() => console.log('Toast closed')}
            autoDismiss={false}
          />
          <Toast
            message="Warning: Large file detected"
            description="This may take longer to process"
            type="warning"
            onClose={() => console.log('Toast closed')}
            autoDismiss={false}
          />
        </div>
      </section>

      {/* Combination Example */}
      <section className="space-y-md">
        <h2 className="text-h2 text-text-primary">Combined Example</h2>
        <div className="bg-white p-lg rounded-lg border border-border shadow-subtle space-y-md">
          <SearchBar
            placeholder="Search research papers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onSearch={() => console.log('Search:', searchQuery)}
            showSearchButton
          />

          <div className="flex flex-wrap gap-sm">
            <FilterChip label="AI" active onRemove={() => {}} />
            <FilterChip label="2023" active onRemove={() => {}} />
            <FilterChip label="Machine Learning" />
          </div>

          <ProgressIndicator
            label="Analyzing documents"
            percentage={75}
            status="processing"
          />

          <div className="space-y-sm">
            <FileItem
              fileName="artificial-intelligence-trends.pdf"
              fileSize="3.2 MB"
              status="ready"
              onDelete={() => {}}
            />
            <FileItem
              fileName="ml-algorithms-comparison.pdf"
              fileSize="4.7 MB"
              status="processing"
            />
          </div>

          <StatusLabel type="info" title="Research Summary">
            Found 15 relevant papers matching your criteria.
            <div className="mt-sm flex flex-wrap gap-sm">
              <CitationBadge author="Smith" year={2023} page={12} onClick={() => {}} />
              <CitationBadge author="Johnson" year={2022} page={45} onClick={() => {}} />
              <CitationBadge author="Brown et al." year={2024} onClick={() => {}} />
            </div>
          </StatusLabel>
        </div>
      </section>
    </div>
  );
};

export default MoleculeExamples;
