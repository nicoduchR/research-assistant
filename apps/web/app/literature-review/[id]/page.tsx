'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Header from '@/src/components/Header';

export default function LiteratureReviewPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-primary mb-4 block">
            description
          </span>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Literature Review
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Literature review {id} — Full display coming in Story 3.7
          </p>
        </div>
      </main>
    </div>
  );
}
