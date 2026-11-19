import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  badge?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
}) => {
  return (
    <div className="bg-[#141420] border border-[#232336] rounded-2xl p-5 hover:border-[#2F2F4A] transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          {title}
        </span>
        <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:bg-purple-500/20 group-hover:scale-105 transition-all">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <div className="text-2xl font-bold text-white tracking-tight">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        {badge && (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
            {badge}
          </span>
        )}
      </div>

      <p className="mt-1 text-xs text-gray-400 font-medium">
        {subtitle}
      </p>
    </div>
  );
};
