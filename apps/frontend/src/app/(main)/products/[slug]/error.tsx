'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-2xl font-bold text-slate-900">Something went wrong!</h2>
      <p className="text-slate-600">Failed to load product details.</p>
      <div className="flex gap-4">
        <button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
          className="rounded-full bg-slate-900 px-6 py-2 text-white transition-colors hover:bg-slate-800"
        >
          Try again
        </button>
        <Link 
          href="/" 
          className="rounded-full border border-slate-300 px-6 py-2 transition-colors hover:bg-slate-50"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
