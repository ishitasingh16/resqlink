import React from 'react';

export default function StatCard({ title, value, subtext, icon: Icon, color = 'blue', trend = null }) {
  const colorMap = {
    red: {
      bg: 'bg-red-50 text-red-600',
      border: 'border-l-4 border-l-red-500',
      badge: 'bg-red-100 text-red-700'
    },
    orange: {
      bg: 'bg-orange-50 text-orange-600',
      border: 'border-l-4 border-l-orange-500',
      badge: 'bg-orange-100 text-orange-700'
    },
    green: {
      bg: 'bg-emerald-50 text-emerald-600',
      border: 'border-l-4 border-l-emerald-500',
      badge: 'bg-emerald-100 text-emerald-700'
    },
    blue: {
      bg: 'bg-blue-50 text-blue-600',
      border: 'border-l-4 border-l-blue-600',
      badge: 'bg-blue-100 text-blue-700'
    },
    purple: {
      bg: 'bg-purple-50 text-purple-600',
      border: 'border-l-4 border-l-purple-500',
      badge: 'bg-purple-100 text-purple-700'
    }
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div className={`resq-card p-5 ${scheme.border} transition-all duration-200 hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            {title}
          </p>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900">{value}</span>
            {trend && (
              <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${scheme.badge}`}>
                {trend}
              </span>
            )}
          </div>
          {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-lg ${scheme.bg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}
