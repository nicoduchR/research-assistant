'use client';

import { useState } from 'react';
import { CreateResearchScopeDto } from '@repo/types';
import { Button, Input, Textarea } from '@/src/components/atoms';
import { TextareaWithCounter } from '@/src/components/molecules';

interface ResearchScopeFormProps {
  onSubmit: (data: CreateResearchScopeDto) => Promise<void>;
  initialData?: CreateResearchScopeDto;
  isLoading?: boolean;
}

export function ResearchScopeForm({
  onSubmit,
  initialData,
  isLoading = false,
}: ResearchScopeFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [problematique, setProblematique] = useState(
    initialData?.problematique || ''
  );
  const [objectives, setObjectives] = useState(initialData?.objectives || '');
  const [errors, setErrors] = useState<Partial<Record<keyof CreateResearchScopeDto, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CreateResearchScopeDto, string>> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.trim().length > 200) {
      newErrors.title = 'Title must be 200 characters or less';
    }

    if (!problematique.trim()) {
      newErrors.problematique = 'Research question is required';
    } else if (problematique.trim().length < 50) {
      newErrors.problematique = 'Problématique must be at least 50 characters to ensure a meaningful research question';
    }

    if (objectives && objectives.trim().length > 1000) {
      newErrors.objectives = 'Objectives must be 1000 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const data: CreateResearchScopeDto = {
      title: title.trim(),
      problematique: problematique.trim(),
      objectives: objectives.trim() || undefined,
    };

    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Research Title
        </label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Impact of Digital Marketing on SME Growth"
          maxLength={200}
          className={errors.title ? 'border-red-500' : ''}
          disabled={isLoading}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title}</p>
        )}
      </div>

      <div>
        <label htmlFor="problematique" className="block text-sm font-medium text-gray-700 mb-1">
          Research Question / Problématique
        </label>
        <TextareaWithCounter
          id="problematique"
          value={problematique}
          onChange={(e) => setProblematique(e.target.value)}
          placeholder="Describe your research question in detail. What problem are you investigating?"
          minLength={50}
          maxLength={2000}
          rows={6}
          showCounter
          className={errors.problematique ? 'border-red-500' : ''}
          disabled={isLoading}
        />
        {errors.problematique && (
          <p className="text-red-500 text-sm mt-1">{errors.problematique}</p>
        )}
      </div>

      <div>
        <label htmlFor="objectives" className="block text-sm font-medium text-gray-700 mb-1">
          Research Objectives (Optional)
        </label>
        <TextareaWithCounter
          id="objectives"
          value={objectives}
          onChange={(e) => setObjectives(e.target.value)}
          placeholder="What are the specific objectives you want to achieve with this research?"
          maxLength={1000}
          rows={4}
          showCounter
          className={errors.objectives ? 'border-red-500' : ''}
          disabled={isLoading}
        />
        {errors.objectives && (
          <p className="text-red-500 text-sm mt-1">{errors.objectives}</p>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3"
        >
          {isLoading ? 'Saving...' : 'Save & Continue'}
        </Button>
      </div>
    </form>
  );
}
