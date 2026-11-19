import React from 'react';
import { Globe, ShieldCheck } from 'lucide-react';

export const EmptyState: React.FC = () => {
  return (
    <div className="bg-[#141420] border border-[#232336] rounded-2xl p-10 text-center max-w-2xl mx-auto my-8 shadow-xl">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-800/20 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-400 mb-6 shadow-inner">
        <Globe className="w-8 h-8" />
      </div>

      <h3 className="text-xl font-bold text-white tracking-tight">
        No Scanned Websites in Storage
      </h3>
      <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto leading-relaxed">
        The analyzer uses <code className="text-purple-300 font-mono text-xs bg-purple-950/50 px-1.5 py-0.5 rounded border border-purple-800/50">chrome.storage.local</code> to persist DOM extractions.
        Start by scanning any open webpage using the Chrome extension popup!
      </p>

      {/* 3 Step Instruction Guide */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
        <div className="p-4 rounded-xl bg-[#0F0F1A] border border-[#1F1F32]">
          <div className="w-6 h-6 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center text-xs font-bold mb-2">
            1
          </div>
          <h4 className="text-xs font-semibold text-gray-200">Open Any Webpage</h4>
          <p className="text-[11px] text-gray-400 mt-1 leading-snug">
            Navigate to any news site, article, or documentation page in Chrome.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#0F0F1A] border border-[#1F1F32]">
          <div className="w-6 h-6 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center text-xs font-bold mb-2">
            2
          </div>
          <h4 className="text-xs font-semibold text-gray-200">Click Extension Icon</h4>
          <p className="text-[11px] text-gray-400 mt-1 leading-snug">
            Click the <span className="text-purple-300">AI Website Analyzer</span> icon in the browser toolbar.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#0F0F1A] border border-[#1F1F32]">
          <div className="w-6 h-6 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center text-xs font-bold mb-2">
            3
          </div>
          <h4 className="text-xs font-semibold text-gray-200">Extract Website Data</h4>
          <p className="text-[11px] text-gray-400 mt-1 leading-snug">
            Click "Extract Website Data". Data appears instantly here!
          </p>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-[#202034] flex items-center justify-center gap-2 text-xs text-gray-500">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>100% Safe Local DOM Inspection • Privacy Preserving • Manifest V3</span>
      </div>
    </div>
  );
};
