import React from 'react';
import { RefreshCw, CheckCircle2 } from 'lucide-react';
import { NavigationTab } from '../types';

interface HeaderProps {
  currentTab: NavigationTab;
  onRefresh: () => void;
  isRefreshing: boolean;
  selectedWebsiteTitle?: string;
  onBackToList?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onRefresh,
  isRefreshing,
  selectedWebsiteTitle,
  onBackToList,
}) => {
  return (
    <header className="h-16 bg-[#0B0B12]/80 backdrop-blur-md border-b border-[#222234] sticky top-0 z-20 px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {currentTab === 'details' && onBackToList && (
          <button
            onClick={onBackToList}
            className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#141420] hover:bg-[#1C1C2E] text-gray-300 border border-[#26263A] transition-colors"
          >
            ← Back to Scans
          </button>
        )}

        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            {currentTab === 'overview' && 'Extraction Analytics & Overview'}
            {currentTab === 'websites' && 'Extracted Website Repository'}
            {currentTab === 'details' && (
              <span className="truncate max-w-md">
                {selectedWebsiteTitle || 'Website Inspection'}
              </span>
            )}
          </h2>
          <p className="text-xs text-gray-400">
            {currentTab === 'overview' && 'Real-time telemetry and aggregated web metrics'}
            {currentTab === 'websites' && 'Browse, search, and manage all captured website content'}
            {currentTab === 'details' && 'In-depth DOM text, image gallery, and AI payload inspection'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Sync Status Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141420] border border-[#232336] text-xs text-gray-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Local Storage Synced</span>
        </div>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#141420] hover:bg-[#1A1A2C] border border-[#26263A] text-xs font-medium text-gray-300 hover:text-white transition-all disabled:opacity-50"
          title="Refresh storage data"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-purple-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>
    </header>
  );
};
