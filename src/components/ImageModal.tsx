import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Copy, Check, ImageOff, Maximize2 } from 'lucide-react';
import { ExtractedImage } from '../types';

interface ImageModalProps {
  image: ExtractedImage | null;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ image, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    setLoadError(false);
    setCopied(false);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [image, onClose]);

  if (!image) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(image.src);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#141420] border border-[#232336] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl shadow-purple-950/20"
      >
        {/* Header */}
        <div className="p-4 border-b border-[#232336] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Maximize2 className="w-4 h-4 text-purple-400" />
            <h3 className="font-semibold text-sm text-white">Image Preview & Inspector</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#1F1F32] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image Preview Canvas */}
        <div className="flex-1 bg-[#0A0A10] p-6 flex items-center justify-center overflow-auto min-h-[300px]">
          {loadError ? (
            <div className="text-center p-8 text-gray-500 flex flex-col items-center gap-2">
              <ImageOff className="w-12 h-12 text-gray-600" />
              <p className="text-sm font-medium">Unable to load direct preview</p>
              <p className="text-xs text-gray-600 max-w-sm">
                The target host may prevent hotlinking (CORS/hotlink protection). Click "Open in Tab" to view directly.
              </p>
            </div>
          ) : (
            <img
              src={image.src}
              alt={image.alt || 'Webpage Image'}
              className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-md"
              onError={() => setLoadError(true)}
            />
          )}
        </div>

        {/* Metadata Details & Actions */}
        <div className="p-5 bg-[#12121E] border-t border-[#232336] space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Alt Text</p>
              <p className="text-sm text-gray-200">
                {image.alt || <span className="italic text-gray-500">None specified</span>}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-md bg-[#1C1C2E] border border-[#28283E] text-gray-300 font-mono">
                {image.width > 0 && image.height > 0
                  ? `${image.width} × ${image.height} px`
                  : 'Dynamic Size'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              readOnly
              value={image.src}
              className="flex-1 bg-[#0B0B14] border border-[#232336] rounded-xl px-3 py-2 text-xs font-mono text-gray-300 focus:outline-none"
            />

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#181828] hover:bg-[#202036] border border-[#2A2A40] text-xs font-medium text-gray-200 hover:text-white transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-gray-400" />
                  <span>Copy URL</span>
                </>
              )}
            </button>

            <a
              href={image.src}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-xs font-semibold text-white transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in Tab</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
