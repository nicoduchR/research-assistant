'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ExportBibliography() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
      <p className="text-slate-600 dark:text-slate-400">
        Redirecting to dashboard... Bibliography export is now available on the literature review page.
      </p>
    </div>
  );
}
