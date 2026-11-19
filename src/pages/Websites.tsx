import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  Trash2,
  Globe,
  AlertTriangle
} from 'lucide-react';
import { WebsiteRecord, SortOption } from '../types';
import { WebsiteCard } from '../components/WebsiteCard';
import { EmptyState } from '../components/EmptyState';

interface WebsitesProps {
  websites: WebsiteRecord[];
  onViewDetails: (id: string) => void;
  onDeleteWebsite: (id: string) => void;
  onClearAllWebsites: () => void;
}

export const Websites: React.FC<WebsitesProps> = ({
  websites,
  onViewDetails,
  onDeleteWebsite,
  onClearAllWebsites,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  // Filtered and sorted websites
  const filteredWebsites = useMemo(() => {
    let result = websites.filter((site) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      const titleMatch = (site.title || '').toLowerCase().includes(q);
      const urlMatch = (site.url || '').toLowerCase().includes(q);
      const descMatch = (site.description || '').toLowerCase().includes(q);
      return titleMatch || urlMatch || descMatch;
    });

    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.extractedAt).getTime() - new Date(a.extractedAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.extractedAt).getTime() - new Date(b.extractedAt).getTime();
      }
      if (sortBy === 'words') {
        return (b.wordCount || 0) - (a.wordCount || 0);
      }
      if (sortBy === 'images') {
        return (b.images?.length || 0) - (a.images?.length || 0);
      }
      return 0;
    });

    return result;
  }, [websites, searchQuery, sortBy]);

  const handleConfirmClear = () => {
    onClearAllWebsites();
    setConfirmClearOpen(false);
  };

  if (websites.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Controls Bar: Search, Sort, Clear */}
      <div className="bg-[#141420] border border-[#232336] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, URL or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0E0E18] border border-[#232336] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-300"
            >
              Clear
            </button>
          )}
        </div>

        {/* Sort & Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400" />
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-[#0E0E18] border border-[#232336] rounded-xl px-2.5 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="newest">Newest Scans First</option>
              <option value="oldest">Oldest Scans First</option>
              <option value="words">Highest Word Count</option>
              <option value="images">Most Images</option>
            </select>
          </div>

          <button
            onClick={() => setConfirmClearOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-xs font-semibold text-red-400 hover:text-red-300 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-gray-400 px-1">
        <span>
          Showing <span className="text-white font-semibold">{filteredWebsites.length}</span> of {websites.length} total saved scans
        </span>
        {searchQuery && (
          <span className="italic text-gray-500">
            Filtered by keyword: "{searchQuery}"
          </span>
        )}
      </div>

      {/* Website Cards Grid */}
      {filteredWebsites.length === 0 ? (
        <div className="bg-[#141420] border border-[#232336] rounded-2xl p-12 text-center text-gray-400">
          <Globe className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-300">No matching website records found</p>
          <p className="text-xs text-gray-500 mt-1">
            Try adjusting your search query or reset the filter.
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-4 px-4 py-1.5 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 text-xs font-semibold hover:bg-purple-600/30 transition-colors"
          >
            Reset Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredWebsites.map((site) => (
            <WebsiteCard
              key={site.id}
              website={site}
              onViewDetails={onViewDetails}
              onDelete={onDeleteWebsite}
            />
          ))}
        </div>
      )}

      {/* Confirmation Modal for Clear All */}
      {confirmClearOpen && (
        <div
          onClick={() => setConfirmClearOpen(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#141420] border border-[#232336] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Clear All Scans?</h3>
                <p className="text-xs text-gray-400">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Are you sure you want to delete all <span className="text-red-400 font-semibold">{websites.length}</span> scanned website records from Chrome local storage?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmClearOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#1C1C2C] hover:bg-[#252538] text-xs font-semibold text-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClear}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-semibold text-white transition-colors"
              >
                Yes, Delete All Records
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
