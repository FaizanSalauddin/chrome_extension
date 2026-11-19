import React, { useState } from 'react';
import { X, Copy, Check, Code, Terminal } from 'lucide-react';
import { WebsiteRecord } from '../types';
import { prepareWebsiteAnalysisPayload, API_CONFIG } from '../services/api';

interface PayloadModalProps {
  website: WebsiteRecord | null;
  onClose: () => void;
}

export const PayloadModal: React.FC<PayloadModalProps> = ({ website, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!website) return null;

  const payload = prepareWebsiteAnalysisPayload(website);
  const jsonString = JSON.stringify(payload, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
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
        className="bg-[#141420] border border-[#232336] rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="p-4 border-b border-[#232336] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">FastAPI Analysis Payload</h3>
              <p className="text-[11px] text-gray-400 font-mono">
                POST {API_CONFIG.BASE_URL}{API_CONFIG.ENDPOINTS.ANALYZE_WEBSITE}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#1F1F32] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice */}
        <div className="px-5 py-3 bg-[#11111E] border-b border-[#232336] flex items-center justify-between text-xs text-gray-400">
          <span>Standardized payload prepared via <code className="text-purple-300 font-mono text-[11px]">prepareWebsiteAnalysisPayload()</code></span>
          <span className="text-[11px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Content-Type: application/json
          </span>
        </div>

        {/* Code View */}
        <div className="flex-1 p-4 bg-[#0A0A10] overflow-auto font-mono text-xs text-gray-300">
          <pre className="whitespace-pre-wrap leading-relaxed select-text">
            {jsonString}
          </pre>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#12121E] border-t border-[#232336] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
            <Terminal className="w-3.5 h-3.5" />
            <span>FastAPI microservice integration ready</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-xs font-semibold text-white transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied JSON</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Payload JSON</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
