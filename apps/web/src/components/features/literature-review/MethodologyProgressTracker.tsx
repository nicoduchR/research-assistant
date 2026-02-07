import React from 'react';
import {
  ProgressTracker,
  type ProgressStep,
} from '../../organisms/ProgressTracker/ProgressTracker';
import { Card, CardHeader, CardTitle, CardContent } from '../../atoms/Card/Card';

const METHODOLOGY_STAGES: ProgressStep[] = [
  { label: 'Literature Search', description: 'Gathering papers', status: 'completed' },
  { label: 'Literature Review', description: 'Synthesis and analysis', status: 'current' },
  { label: 'Research Design', description: 'Planning methodology', status: 'pending' },
  { label: 'Data Collection', description: 'Gathering data', status: 'pending' },
  { label: 'Data Analysis', description: 'Analyzing results', status: 'pending' },
  { label: 'Writing & Reporting', description: 'Final paper', status: 'pending' },
];

const NEXT_STEPS = [
  'Review and refine your synthesis',
  'Verify citations by clicking to open source PDFs',
  'Identify gaps and research questions for your study',
  'Move to Research Design when literature review is complete',
];

export const MethodologyProgressTracker: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Methodology Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-h3 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">route</span>
            Methodology Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProgressTracker steps={METHODOLOGY_STAGES} orientation="vertical" />
          <p className="flex items-center gap-1 text-xs font-medium text-primary mt-2">
            <span className="material-symbols-outlined text-sm">location_on</span>
            You are here: Literature Review
          </p>
        </CardContent>
      </Card>

      {/* Next Steps Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-h3 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">tips_and_updates</span>
            Next Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {NEXT_STEPS.map((step) => (
              <li key={step} className="flex items-start gap-2 text-body text-text-secondary">
                <span className="material-symbols-outlined text-sm text-primary mt-0.5">
                  arrow_forward
                </span>
                {step}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

MethodologyProgressTracker.displayName = 'MethodologyProgressTracker';
