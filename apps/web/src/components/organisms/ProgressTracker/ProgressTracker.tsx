import React from 'react';

export type StepStatus = 'pending' | 'current' | 'completed';

export interface ProgressStep {
  label: string;
  description?: string;
  status: StepStatus;
}

export interface ProgressTrackerProps {
  steps: ProgressStep[];
  currentStep?: number;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  steps,
  currentStep,
  orientation = 'horizontal',
  className = '',
}) => {
  const getStepStatus = (index: number): StepStatus => {
    if (currentStep !== undefined) {
      if (index < currentStep) return 'completed';
      if (index === currentStep) return 'current';
      return 'pending';
    }
    return steps[index].status;
  };

  const getStepStyles = (status: StepStatus) => {
    const styles = {
      completed: {
        circle:
          'bg-success text-white border-success shadow-subtle animate-in fade-in',
        label: 'text-text-primary font-semibold',
        line: 'bg-success',
      },
      current: {
        circle:
          'bg-primary text-primary-foreground border-primary shadow-medium ring-4 ring-primary/20 animate-pulse',
        label: 'text-primary font-bold',
        line: 'bg-border',
      },
      pending: {
        circle: 'bg-white text-text-secondary border-border',
        label: 'text-text-secondary',
        line: 'bg-border',
      },
    };
    return styles[status];
  };

  const getStepIcon = (status: StepStatus, stepNumber: number) => {
    if (status === 'completed') {
      return (
        <span className="material-symbols-outlined text-xl">check_circle</span>
      );
    }
    if (status === 'current') {
      return (
        <span className="material-symbols-outlined text-xl">radio_button_checked</span>
      );
    }
    return <span className="text-body font-semibold">{stepNumber + 1}</span>;
  };

  if (orientation === 'vertical') {
    return (
      <div
        className={`flex flex-col ${className}`}
        role="progressbar"
        aria-label="Progress tracker"
        aria-valuenow={currentStep ?? steps.findIndex((s) => s.status === 'current')}
        aria-valuemin={0}
        aria-valuemax={steps.length - 1}
      >
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const styles = getStepStyles(status);
          const isLast = index === steps.length - 1;

          return (
            <div key={index} className="flex gap-md">
              {/* Step Indicator Column */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-normal ${styles.circle}`}
                  aria-label={`Step ${index + 1}: ${step.label}`}
                >
                  {getStepIcon(status, index)}
                </div>
                {!isLast && (
                  <div
                    className={`w-0.5 h-12 transition-colors duration-normal ${styles.line}`}
                  />
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1 pb-lg">
                <p className={`text-body transition-colors duration-normal ${styles.label}`}>
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-small text-text-secondary mt-xs">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal orientation
  return (
    <div
      className={`flex items-center ${className}`}
      role="progressbar"
      aria-label="Progress tracker"
      aria-valuenow={currentStep ?? steps.findIndex((s) => s.status === 'current')}
      aria-valuemin={0}
      aria-valuemax={steps.length - 1}
    >
      {steps.map((step, index) => {
        const status = getStepStatus(index);
        const styles = getStepStyles(status);
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={index}>
            {/* Step */}
            <div className="flex flex-col items-center gap-sm min-w-0">
              <div
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-normal flex-shrink-0 ${styles.circle}`}
                aria-label={`Step ${index + 1}: ${step.label}`}
              >
                {getStepIcon(status, index)}
              </div>
              <div className="text-center min-w-0 max-w-[120px]">
                <p
                  className={`text-small transition-colors duration-normal truncate ${styles.label}`}
                  title={step.label}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-xs text-text-secondary mt-xs line-clamp-2">
                    {step.description}
                  </p>
                )}
              </div>
            </div>

            {/* Connecting Line */}
            {!isLast && (
              <div className="flex-1 h-0.5 mx-sm transition-colors duration-normal min-w-[40px]">
                <div className={`h-full transition-colors duration-normal ${styles.line}`} />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

ProgressTracker.displayName = 'ProgressTracker';
