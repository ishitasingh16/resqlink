import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = 'Loading emergency records...', subtext = 'Synchronizing with database' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="relative mb-4">
        <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
        <Loader2 className="w-6 h-6 text-blue-600 absolute inset-0 m-auto animate-pulse" />
      </div>
      <h3 className="text-sm font-semibold text-slate-800">{message}</h3>
      {subtext && <p className="text-xs text-slate-500 mt-1 max-w-sm">{subtext}</p>}
    </div>
  );
}
