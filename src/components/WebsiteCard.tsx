import React, { useState } from 'react';
import {
  Calendar,
  FileText,
  Image as ImageIcon,
  Trash2,
  ArrowRight,
  Globe,
  Heading,
  Copy,
  Check
} from 'lucide-react';
import { WebsiteRecord } from '../types';

interface WebsiteCardProps {
  website: WebsiteRecord;
  onViewDetails: (id: string) => void;
  onDelete: (id: string) => void;
}

export const WebsiteCard: React.FC<WebsiteCardProps> = ({
  website,
  onViewDetails,
  onDelete,
}) => {
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formattedDate = new Date(website.extractedAt).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleCopyUrl = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(website.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete scan record for "${website.title}"?`)) {
      setIsDeleting(true);
      onDelete(website.id);
    }
  };

  return (
    <div
      onClick={() => onViewDetails(website.id)}
      className="bg-[#141420] border border-[#232336] hover:border-purple-500/50 rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:shadow-xl hover:shadow-purple-900/10 group flex flex-col justify-between"
    >
      <div>
        {/* Top Header: Favicon, Title, Delete */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {website.favicon ? (
              <img
                src={website.favicon}
                alt=""
                className="w-8 h-8 rounded-lg object-contain bg-[#1C1C2C] p-1 border border-[#2A2A3E] flex-shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
                <Globe className="w-4 h-4" />
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-sm text-white truncate group-hover:text-purple-300 transition-colors">
                  {website.title || 'Untitled Webpage'}
                </h3>
                {website.isAutoDetected && (
                  <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex-shrink-0">
                    Auto
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <a
                  href={website.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs text-gray-400 hover:text-purple-400 truncate max-w-xs block font-mono hover:underline"
                >
                  {website.url}
                </a>
                <button
                  onClick={handleCopyUrl}
                  title="Copy URL"
                  className="p-1 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            title="Delete this record"
            className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all flex-shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Description snippet if available */}
        {website.description && (
          <p className="mt-3 text-xs text-gray-400 line-clamp-2 leading-relaxed">
            {website.description}
          </p>
        )}

        {/* Metrics Row */}
        <div className="mt-4 grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl bg-[#0F0F1A] border border-[#1E1E30]">
          <div className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-purple-400" />
            <div>
              <p className="text-[10px] uppercase font-semibold text-gray-500">Words</p>
              <p className="text-xs font-bold text-gray-200">
                {(website.wordCount || 0).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
            <div>
              <p className="text-[10px] uppercase font-semibold text-gray-500">Images</p>
              <p className="text-xs font-bold text-gray-200">
                {(website.images || []).length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Heading className="w-3.5 h-3.5 text-emerald-400" />
            <div>
              <p className="text-[10px] uppercase font-semibold text-gray-500">Headings</p>
              <p className="text-xs font-bold text-gray-200">
                {(website.headings || []).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer: Date and View Details button */}
      <div className="mt-4 pt-3 border-t border-[#222234] flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-gray-400">
          <Calendar className="w-3.5 h-3.5 text-gray-500" />
          <span>{formattedDate}</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(website.id);
          }}
          className="flex items-center gap-1.5 text-purple-400 font-semibold group-hover:text-purple-300 transition-colors"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
