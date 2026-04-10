import React from 'react';

export default function PageNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
      <h1 className="text-6xl font-bold text-slate-800 dark:text-slate-100 mb-4">404</h1>
      <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">Page Not Found</p>
      <a href="/" className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">Go Home</a>
    </div>
  );
}
