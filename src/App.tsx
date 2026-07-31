import { useState, useEffect } from 'react';
import { Novel, TimelineItem, SyncStats } from './types';
import { INITIAL_NOVELS, MOCK_TIMELINE_ITEMS, MOCK_SYNC_STATS } from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { SearchModal } from './components/SearchModal';
import { HomeView } from './components/HomeView';
import { NovelDetailView } from './components/NovelDetailView';
import { ReaderView } from './components/ReaderView';
import { TimelineView } from './components/TimelineView';
import { DiscoverView } from './components/DiscoverView';
import { ProfileView } from './components/ProfileView';

export default function App() {
  // Load initial novels state from localStorage if available
  const [novels, setNovels] = useState<Novel[]>(() => {
    try {
      const saved = localStorage.getItem('lumiere_novels');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_NOVELS;
  });

  const [currentTab, setCurrentTab] = useState<string>('home');
  const [previousTab, setPreviousTab] = useState<string>('home');
  const [selectedNovel, setSelectedNovel] = useState<Novel | null>(
    INITIAL_NOVELS.find((n) => n.id === 'shadow-of-the-void') || INITIAL_NOVELS[0]
  );
  const [selectedChapterId, setSelectedChapterId] = useState<string | undefined>('ch-01');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('lumiere_novels', JSON.stringify(novels));
    } catch {
      // ignore
    }
  }, [novels]);

  // Navigate handlers
  const handleSelectTab = (tab: string) => {
    setPreviousTab(currentTab);
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectNovel = (novel: Novel) => {
    setSelectedNovel(novel);
    setPreviousTab(currentTab);
    setCurrentTab('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReadChapter = (novel: Novel, chapterId?: string) => {
    setSelectedNovel(novel);
    const targetChapterId =
      chapterId || novel.lastReadChapterId || novel.chapters[0]?.id || 'ch-01';
    setSelectedChapterId(targetChapterId);

    // Mark chapter as read in state
    setNovels((prevNovels) =>
      prevNovels.map((n) => {
        if (n.id === novel.id) {
          const updatedChapters = n.chapters.map((c) =>
            c.id === targetChapterId ? { ...c, isRead: true } : c
          );
          return {
            ...n,
            lastReadChapterId: targetChapterId,
            chapters: updatedChapters,
          };
        }
        return n;
      })
    );

    setPreviousTab(currentTab);
    setCurrentTab('reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleBookmark = (novelId: string) => {
    setNovels((prev) =>
      prev.map((n) => (n.id === novelId ? { ...n, isBookmarked: !n.isBookmarked } : n))
    );
    if (selectedNovel && selectedNovel.id === novelId) {
      setSelectedNovel((prev) => (prev ? { ...prev, isBookmarked: !prev.isBookmarked } : null));
    }
  };

  const handleBack = () => {
    if (currentTab === 'reader') {
      setCurrentTab('detail');
    } else if (currentTab === 'detail') {
      setCurrentTab(previousTab === 'detail' || previousTab === 'reader' ? 'home' : previousTab);
    } else {
      setCurrentTab('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#101319] text-[#e1e2eb] font-body selection:bg-[#cabeff]/30 selection:text-[#cabeff]">
      {/* Top Header Navigation (hidden in full Reader Mode) */}
      {currentTab !== 'reader' && (
        <Header
          currentTab={currentTab}
          onSelectTab={handleSelectTab}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenMenu={() => setIsSearchOpen(true)}
        />
      )}

      {/* Main Content Area */}
      <main
        className={`w-full max-w-[1440px] mx-auto px-5 md:px-16 ${
          currentTab !== 'reader' ? 'pt-20' : 'pt-0'
        }`}
      >
        {currentTab === 'home' && (
          <HomeView
            novels={novels}
            onSelectNovel={handleSelectNovel}
            onReadChapter={handleReadChapter}
            onNavigateTab={handleSelectTab}
          />
        )}

        {currentTab === 'detail' && selectedNovel && (
          <NovelDetailView
            novel={selectedNovel}
            allNovels={novels}
            onReadChapter={handleReadChapter}
            onSelectNovel={handleSelectNovel}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {currentTab === 'reader' && selectedNovel && (
          <ReaderView
            novel={selectedNovel}
            chapterId={selectedChapterId}
            onBack={handleBack}
            onNavigateChapter={(nextChId) => handleReadChapter(selectedNovel, nextChId)}
          />
        )}

        {currentTab === 'timeline' && (
          <TimelineView
            timelineItems={MOCK_TIMELINE_ITEMS}
            syncStats={MOCK_SYNC_STATS}
            novels={novels}
            onSelectNovel={handleSelectNovel}
          />
        )}

        {currentTab === 'discover' && (
          <DiscoverView novels={novels} onSelectNovel={handleSelectNovel} />
        )}

        {currentTab === 'library' && (
          <ProfileView
            novels={novels}
            onSelectNovel={handleSelectNovel}
            onReadChapter={handleReadChapter}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileView
            novels={novels}
            onSelectNovel={handleSelectNovel}
            onReadChapter={handleReadChapter}
          />
        )}
      </main>

      {/* Mobile Bottom Bar (hidden in full Reader Mode) */}
      {currentTab !== 'reader' && (
        <BottomNav currentTab={currentTab} onSelectTab={handleSelectTab} />
      )}

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        novels={novels}
        onSelectNovel={handleSelectNovel}
      />
    </div>
  );
}
