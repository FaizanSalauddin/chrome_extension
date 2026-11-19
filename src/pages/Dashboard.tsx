import React, { useMemo } from 'react';
import {
  Globe,
  FileText,
  Image as ImageIcon,
  Clock,
  ArrowRight,
  TrendingUp,
  Cpu,
  ShieldCheck,
  HardDrive,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { WebsiteRecord } from '../types';
import { StatCard } from '../components/StatCard';
import { EmptyState } from '../components/EmptyState';

interface DashboardProps {
  websites: WebsiteRecord[];
  onViewDetails: (id: string) => void;
  onNavigateToWebsites: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  websites,
  onViewDetails,
  onNavigateToWebsites,
}) => {
  // Compute true dynamic metrics
  const totalWebsites = websites.length;
  const totalWords = useMemo(
    () => websites.reduce((acc, curr) => acc + (curr.wordCount || 0), 0),
    [websites]
  );
  const totalImages = useMemo(
    () => websites.reduce((acc, curr) => acc + (curr.images?.length || 0), 0),
    [websites]
  );
  const recentScans24h = useMemo(() => {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    return websites.filter((w) => new Date(w.extractedAt).getTime() > oneDayAgo).length;
  }, [websites]);

  // Chart data: latest 7 scans
  const chartData = useMemo(() => {
    return [...websites]
      .slice(0, 7)
      .reverse()
      .map((item) => ({
        name: (item.title || 'Page').substring(0, 16) + '...',
        words: item.wordCount || 0,
        images: (item.images || []).length,
      }));
  }, [websites]);

  // Latest 5 scans for the quick table
  const recentScans = useMemo(() => websites.slice(0, 5), [websites]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Websites Scanned"
          value={totalWebsites}
          subtitle="Indexed in local browser storage"
          icon={Globe}
          badge={totalWebsites > 0 ? 'Active' : undefined}
        />
        <StatCard
          title="Total Words Extracted"
          value={totalWords}
          subtitle="Sanitized readable DOM body text"
          icon={FileText}
        />
        <StatCard
          title="Total Images Collected"
          value={totalImages}
          subtitle="Visual assets and image metadata"
          icon={ImageIcon}
        />
        <StatCard
          title="Recent Scans (24h)"
          value={recentScans24h}
          subtitle="Captures in the last 24 hours"
          icon={Clock}
          badge={recentScans24h > 0 ? '+ Recent' : undefined}
        />
      </div>

      {totalWebsites === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Activity Chart Section */}
          <div className="bg-[#141420] border border-[#232336] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                  Extraction Activity & Metrics
                </h3>
                <p className="text-xs text-gray-400">
                  Comparison of extracted word volume and image counts across recent scans
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#1B1B2C] border border-[#26263C] text-gray-300">
                Last {chartData.length} Scans
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222236" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#71717A"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#222236' }}
                  />
                  <YAxis
                    stroke="#71717A"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#222236' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#141422',
                      borderColor: '#2D2D42',
                      borderRadius: '12px',
                      color: '#F4F4F5',
                      fontSize: '12px',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                    }}
                    cursor={{ fill: 'rgba(139, 92, 246, 0.08)' }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                  />
                  <Bar dataKey="words" name="Extracted Words" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="images" name="Images Collected" fill="#38BDF8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Grid: Recent Scans Table & System Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Scans Table (2 cols) */}
            <div className="lg:col-span-2 bg-[#141420] border border-[#232336] rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Globe className="w-4 h-4 text-purple-400" />
                    Recently Scanned Websites
                  </h3>
                  <button
                    onClick={onNavigateToWebsites}
                    className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
                  >
                    <span>View All ({totalWebsites})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#222236] text-gray-500 font-semibold uppercase tracking-wider text-[10px]">
                        <th className="pb-3">Website</th>
                        <th className="pb-3 text-center">Words</th>
                        <th className="pb-3 text-center">Images</th>
                        <th className="pb-3 text-right">Scanned</th>
                        <th className="pb-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1D1D2E]">
                      {recentScans.map((site) => (
                        <tr
                          key={site.id}
                          className="hover:bg-[#181828] transition-colors group cursor-pointer"
                          onClick={() => onViewDetails(site.id)}
                        >
                          <td className="py-3 pr-3">
                            <div className="flex items-center gap-2.5">
                              {site.favicon ? (
                                <img
                                  src={site.favicon}
                                  alt=""
                                  className="w-5 h-5 rounded object-contain bg-[#1C1C2C] p-0.5"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              ) : (
                                <Globe className="w-4 h-4 text-gray-500" />
                              )}
                              <div className="min-w-0 max-w-xs">
                                <p className="font-semibold text-gray-200 truncate group-hover:text-purple-300 transition-colors">
                                  {site.title || 'Untitled Webpage'}
                                </p>
                                <p className="text-[11px] text-gray-500 truncate font-mono">
                                  {site.url}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 text-center font-mono font-medium text-purple-300">
                            {(site.wordCount || 0).toLocaleString()}
                          </td>
                          <td className="py-3 text-center font-mono font-medium text-blue-300">
                            {(site.images || []).length}
                          </td>
                          <td className="py-3 text-right text-gray-400 whitespace-nowrap">
                            {new Date(site.extractedAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onViewDetails(site.id);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-purple-600/10 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 text-[11px] font-semibold transition-all"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* System Architecture & Status Card (1 col) */}
            <div className="bg-[#141420] border border-[#232336] rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  System Architecture Status
                </h3>
                <p className="text-xs text-gray-400 mb-5">
                  Component telemetry and integration state
                </p>

                <div className="space-y-4 text-xs">
                  {/* Chrome Extension */}
                  <div className="p-3.5 rounded-xl bg-[#0F0F1A] border border-[#1E1E30] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Layers className="w-4 h-4 text-purple-400" />
                      <div>
                        <p className="font-semibold text-gray-200">Chrome Extension</p>
                        <p className="text-[11px] text-gray-500">Manifest V3 Scripting & DOM</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 font-semibold text-[11px]">
                      Active
                    </span>
                  </div>

                  {/* Local Storage */}
                  <div className="p-3.5 rounded-xl bg-[#0F0F1A] border border-[#1E1E30] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <HardDrive className="w-4 h-4 text-emerald-400" />
                      <div>
                        <p className="font-semibold text-gray-200">Local Storage</p>
                        <p className="text-[11px] text-gray-500">chrome.storage.local persistence</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 font-semibold text-[11px]">
                      Active
                    </span>
                  </div>

                  {/* Dashboard */}
                  <div className="p-3.5 rounded-xl bg-[#0F0F1A] border border-[#1E1E30] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Globe className="w-4 h-4 text-blue-400" />
                      <div>
                        <p className="font-semibold text-gray-200">Dashboard</p>
                        <p className="text-[11px] text-gray-500">Packaged extension page</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 font-semibold text-[11px]">
                      Active
                    </span>
                  </div>

                  {/* Backend Integration */}
                  <div className="p-3.5 rounded-xl bg-[#0F0F1A] border border-[#1E1E30] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Cpu className="w-4 h-4 text-amber-400" />
                      <div>
                        <p className="font-semibold text-gray-200">Backend Integration</p>
                        <p className="text-[11px] text-gray-500">FastAPI microservice endpoints</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 font-semibold text-[11px]">
                      Coming Soon
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#1F1F30] text-[11px] text-gray-500">
                Offline browser-first architecture. Ready for AI detection pipeline connection.
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
