'use client';

import React from 'react';
import { Dialog, DialogProps } from '@/src/components/atoms/Dialog';
import { Button } from '@/src/components/atoms/Button';

export interface ModalAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
}

export interface ModalProps extends Omit<DialogProps, 'children'> {
  children: React.ReactNode;
  actions?: ModalAction[];
}

/**
 * Modal - Confirmation dialogs and modal content
 *
 * @example
 * ```tsx
 * <Modal
 *   open={isOpen}
 *   onClose={handleClose}
 *   title="Delete document?"
 *   description="This action cannot be undone."
 *   actions={[
 *     { label: 'Cancel', onClick: handleClose, variant: 'secondary' },
 *     { label: 'Delete', onClick: handleDelete, variant: 'primary' }
 *   ]}
 * >
 *   <p>Are you sure you want to delete this document?</p>
 * </Modal>
 * ```
 */
export const Modal: React.FC<ModalProps> = ({
  children,
  actions,
  ...dialogProps
}) => {
  return (
    <Dialog {...dialogProps}>
      <div className="space-y-lg">
        {children}

        {actions && actions.length > 0 && (
          <div className="flex items-center justify-end gap-sm pt-md border-t border-border">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'secondary'}
                onClick={action.onClick}
                loading={action.loading}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </Dialog>
  );
};

Modal.displayName = 'Modal';
