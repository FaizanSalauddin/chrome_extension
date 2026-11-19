import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { Websites } from './pages/Websites';
import { WebsiteDetails } from './pages/WebsiteDetails';
import { useWebsites } from './hooks/useWebsites';
import { NavigationTab } from './types';
import { Loader2 } from 'lucide-react';

export const App: React.FC = () => {
  const {
    websites,
    loading,
    refresh,
    removeWebsite,
    clearAllWebsites,
  } = useWebsites();

  const [currentTab, setCurrentTab] = useState<NavigationTab>('overview');
  const [selectedWebsiteId, setSelectedWebsiteId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check URL params on load (e.g. ?id=scan_123 or ?tab=websites)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const tab = params.get('tab') as NavigationTab | null;

    if (id) {
      setSelectedWebsiteId(id);
      setCurrentTab('details');
    } else if (tab && (tab === 'overview' || tab === 'websites')) {
      setCurrentTab(tab);
    }
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleViewDetails = (id: string) => {
    setSelectedWebsiteId(id);
    setCurrentTab('details');
  };

  const handleBackToList = () => {
    setCurrentTab('websites');
  };

  const selectedWebsite = websites.find((w) => w.id === selectedWebsiteId) || null;

  return (
    <div className="min-h-screen bg-[#0B0B12] text-[#F4F4F5] flex selection:bg-purple-600 selection:text-white">
      {/* Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
        }}
        websitesCount={websites.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <Header
          currentTab={currentTab}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          selectedWebsiteTitle={selectedWebsite?.title}
          onBackToList={handleBackToList}
        />

        {/* Page Content */}
        <main className="flex-1 p-8 max-w-7xl w-full mx-auto">
          {loading && websites.length === 0 ? (
            <div className="h-96 flex flex-col items-center justify-center gap-3 text-gray-400">
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
              <p className="text-sm font-medium">Syncing with local browser storage...</p>
            </div>
          ) : (
            <>
              {currentTab === 'overview' && (
                <Dashboard
                  websites={websites}
                  onViewDetails={handleViewDetails}
                  onNavigateToWebsites={() => setCurrentTab('websites')}
                />
              )}

              {currentTab === 'websites' && (
                <Websites
                  websites={websites}
                  onViewDetails={handleViewDetails}
                  onDeleteWebsite={removeWebsite}
                  onClearAllWebsites={clearAllWebsites}
                />
              )}

              {currentTab === 'details' && selectedWebsite && (
                <WebsiteDetails
                  website={selectedWebsite}
                  onBack={handleBackToList}
                  onDelete={removeWebsite}
                />
              )}

              {currentTab === 'details' && !selectedWebsite && (
                <div className="bg-[#141420] border border-[#232336] rounded-2xl p-8 text-center">
                  <p className="text-sm text-gray-400">Website scan record not found or was deleted.</p>
                  <button
                    onClick={handleBackToList}
                    className="mt-3 px-4 py-2 rounded-xl bg-purple-600 text-xs font-semibold text-white"
                  >
                    Back to Scanned Websites
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
