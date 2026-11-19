import React from 'react';
import {
  LayoutDashboard,
  Globe,
  HardDrive,
  Cpu,
  Layers
} from 'lucide-react';
import { NavigationTab } from '../types';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  websitesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  websitesCount
}) => {
  return (
    <aside className="w-64 bg-[#10101A] border-r border-[#222234] flex flex-col h-screen fixed left-0 top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#222234]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white shadow-lg shadow-purple-500/25">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
              AI Analyzer
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">
                v1.0
              </span>
            </h1>
            <p className="text-xs text-gray-400 font-medium">Extension & Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
          Core Modules
        </div>

        <button
          onClick={() => onSelectTab('overview')}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            currentTab === 'overview'
              ? 'bg-purple-600/15 text-purple-300 border border-purple-500/30 shadow-sm'
              : 'text-gray-400 hover:text-gray-200 hover:bg-[#151524]'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 text-purple-400" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => onSelectTab('websites')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            currentTab === 'websites' || currentTab === 'details'
              ? 'bg-purple-600/15 text-purple-300 border border-purple-500/30 shadow-sm'
              : 'text-gray-400 hover:text-gray-200 hover:bg-[#151524]'
          }`}
        >
          <div className="flex items-center gap-3">
            <Globe className="w-4 h-4 text-purple-400" />
            <span>Scanned Websites</span>
          </div>
          {websitesCount > 0 && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {websitesCount}
            </span>
          )}
        </button>
      </div>

      {/* System Status Indicators */}
      <div className="p-4 mx-3 mb-4 rounded-xl bg-[#141422] border border-[#232336] space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-gray-300">
          <span>System Environment</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between text-gray-400">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              Auto-Detection
            </span>
            <span className="text-emerald-400 font-medium">Active</span>
          </div>

          <div className="flex items-center justify-between text-gray-400">
            <span className="flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
              Chrome Storage
            </span>
            <span className="text-emerald-400 font-medium">Active</span>
          </div>

          <div className="flex items-center justify-between text-gray-400">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              Manifest V3
            </span>
            <span className="text-emerald-400 font-medium">Ready</span>
          </div>

          <div className="flex items-center justify-between text-gray-400">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              FastAPI Backend
            </span>
            <span className="text-amber-400 font-medium">Coming Soon</span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-[#222234] text-center">
        <p className="text-[11px] text-gray-500">Final Year College Project</p>
        <p className="text-[10px] text-gray-600">Local Browser Architecture</p>
      </div>
    </aside>
  );
};
