import { useCallback, useEffect, useState } from 'react';
import { Novel, SyncStats, TimelineItem } from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { SearchModal } from './components/SearchModal';
import { AuthModal } from './components/AuthModal';
import { HomeView } from './components/HomeView';
import { NovelDetailView } from './components/NovelDetailView';
import { ReaderView } from './components/ReaderView';
import { TimelineView } from './components/TimelineView';
import { DiscoverView } from './components/DiscoverView';
import { ProfileView } from './components/ProfileView';
import { useAuth } from './context/AuthContext';
import { ApiError, novelApi, timelineApi, translationGroupApi } from './services/api';

/** SyncStats rỗng dùng trong lúc chờ API — TimelineView đọc các field này ngay khi mount. */
const EMPTY_SYNC_STATS: SyncStats = {
  totalChapters: '—',
  chaptersThisMonth: '',
  newSeriesCount: 0,
  newGroupsCount: 0,
  nextSyncCountdown: '—',
  nextSyncPercentage: 0,
};

export default function App() {
  const { user, isAuthenticated, refresh: refreshUser } = useAuth();

  const [novels, setNovels] = useState<Novel[]>([]);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [syncStats, setSyncStats] = useState<SyncStats>(EMPTY_SYNC_STATS);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [currentTab, setCurrentTab] = useState<string>('home');
  const [previousTab, setPreviousTab] = useState<string>('home');
  const [selectedNovel, setSelectedNovel] = useState<Novel | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<string | undefined>(undefined);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  /**
   * Tải dữ liệu công khai.
   *
   * Chạy lại khi trạng thái đăng nhập đổi: GET /api/novels dùng optionalAuth,
   * nên có token thì response mới kèm isBookmarked / lastReadChapterId /
   * chapter.isRead — chính là các field mà HomeView và ProfileView lọc theo.
   */
  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setIsLoading(true);
      setLoadError(null);
      try {
        const [novelResponse, timelineResponse, statsResponse] = await Promise.all([
          novelApi.list({}, controller.signal),
          timelineApi.list(controller.signal),
          timelineApi.stats(controller.signal),
        ]);

        if (controller.signal.aborted) return;

        setNovels(novelResponse.items);
        setTimelineItems(timelineResponse.items);
        setSyncStats(statsResponse);
      } catch (error) {
        if (controller.signal.aborted) return;
        setLoadError(
          error instanceof ApiError ? error.message : 'Không tải được dữ liệu từ máy chủ.',
        );
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    void load();
    return () => controller.abort();
  }, [isAuthenticated]);

  /** Thay thế một novel trong danh sách, đồng thời đồng bộ novel đang chọn. */
  const patchNovel = useCallback((novelId: string, patch: Partial<Novel>) => {
    setNovels((previous) =>
      previous.map((novel) => (novel.id === novelId ? { ...novel, ...patch } : novel)),
    );
    setSelectedNovel((previous) =>
      previous && previous.id === novelId ? { ...previous, ...patch } : previous,
    );
  }, []);

  const handleSelectTab = (tab: string) => {
    setPreviousTab(currentTab);
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Mở trang chi tiết. Gọi GET /api/novels/:slug để lấy ĐẦY ĐỦ chapters —
   * endpoint list chỉ trả chương đầu và chương đang đọc dở, trong khi
   * NovelDetailView cần toàn bộ danh sách.
   */
  const handleSelectNovel = useCallback(
    async (novel: Novel) => {
      setSelectedNovel(novel); // hiển thị ngay bằng dữ liệu đã có
      setPreviousTab(currentTab);
      setCurrentTab('detail');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      try {
        const detail = await novelApi.detail(novel.id);
        setSelectedNovel(detail);
      } catch {
        // Giữ nguyên dữ liệu rút gọn — vẫn xem được, chỉ thiếu chương.
      }
    },
    [currentTab],
  );

  /**
   * Mở trình đọc.
   *
   * Ba việc, đúng như bản gốc dùng state local, nhưng giờ có backend:
   *   1. nạp nội dung chương (GET .../chapters/:chapterSlug) và ghép vào
   *      novel.chapters — nhờ vậy ReaderView KHÔNG cần sửa gì.
   *   2. đánh dấu chương đã đọc + cập nhật vị trí đọc dở (PUT .../progress)
   *   3. cập nhật state local ngay lập tức (optimistic) để UI không giật.
   */
  const handleReadChapter = useCallback(
    async (novel: Novel, chapterId?: string) => {
      const targetChapterId =
        chapterId ?? novel.lastReadChapterId ?? novel.chapters[0]?.id;

      if (!targetChapterId) return;

      setSelectedNovel(novel);
      setSelectedChapterId(targetChapterId);
      setPreviousTab(currentTab);
      setCurrentTab('reader');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // 3. Optimistic: đánh dấu đã đọc ngay trên UI.
      patchNovel(novel.id, {
        lastReadChapterId: targetChapterId,
        chapters: novel.chapters.map((chapter) =>
          chapter.id === targetChapterId ? { ...chapter, isRead: true } : chapter,
        ),
      });

      // 1. Nạp nội dung chương rồi ghép vào mảng chapters của novel đang chọn.
      try {
        const chapter = await novelApi.chapter(novel.id, targetChapterId);
        setSelectedNovel((previous) => {
          if (!previous || previous.id !== novel.id) return previous;
          return {
            ...previous,
            chapters: previous.chapters.map((existing) =>
              existing.id === chapter.id ? { ...existing, ...chapter } : existing,
            ),
          };
        });
      } catch {
        // ReaderView có nội dung dự phòng sẵn nên không cần chặn người dùng.
      }

      // 2. Ghi tiến độ — chỉ khi đã đăng nhập, vì endpoint yêu cầu auth.
      if (isAuthenticated) {
        try {
          await novelApi.updateProgress(novel.id, targetChapterId);
          void refreshUser(); // stats.chaptersRead vừa thay đổi
        } catch {
          // Không rollback: đã đọc rồi thì đánh dấu đã đọc trên UI vẫn đúng.
        }
      }
    },
    [currentTab, isAuthenticated, patchNovel, refreshUser],
  );

  /**
   * Bookmark. Chưa đăng nhập thì mở form đăng nhập thay vì thất bại im lặng.
   * Dùng POST/DELETE riêng (idempotent) thay vì một endpoint toggle.
   */
  const handleToggleBookmark = useCallback(
    async (novelId: string) => {
      if (!isAuthenticated) {
        setIsAuthOpen(true);
        return;
      }

      const target = novels.find((novel) => novel.id === novelId) ?? selectedNovel;
      const nextValue = !target?.isBookmarked;

      patchNovel(novelId, { isBookmarked: nextValue });

      try {
        if (nextValue) {
          await novelApi.addBookmark(novelId);
        } else {
          await novelApi.removeBookmark(novelId);
        }
        void refreshUser(); // stats.bookmarksCount vừa thay đổi
      } catch {
        patchNovel(novelId, { isBookmarked: !nextValue }); // rollback
      }
    },
    [isAuthenticated, novels, selectedNovel, patchNovel, refreshUser],
  );

  /** Follow/unfollow nhóm dịch — NovelDetailView.tsx nút Follow. */
  const handleToggleFollowGroup = useCallback(
    async (groupSlug: string, shouldFollow: boolean) => {
      if (!isAuthenticated) {
        setIsAuthOpen(true);
        return false;
      }
      try {
        if (shouldFollow) {
          await translationGroupApi.follow(groupSlug);
        } else {
          await translationGroupApi.unfollow(groupSlug);
        }
        return true;
      } catch {
        return false;
      }
    },
    [isAuthenticated],
  );

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
          user={user}
          onOpenAuth={() => setIsAuthOpen(true)}
        />
      )}

      {/* Main Content Area */}
      <main
        className={`w-full max-w-[1440px] mx-auto px-5 md:px-16 ${
          currentTab !== 'reader' ? 'pt-20' : 'pt-0'
        }`}
      >
        {/* Trạng thái tải / lỗi — trước đây không cần vì dữ liệu là hằng số. */}
        {isLoading && novels.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <span className="material-symbols-outlined text-[#cabeff] text-4xl animate-spin">
              progress_activity
            </span>
            <p className="font-label text-sm text-[#c9c4d8]">Loading your library…</p>
          </div>
        )}

        {!isLoading && loadError && (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
            <span className="material-symbols-outlined text-red-400 text-4xl">cloud_off</span>
            <p className="font-headline text-xl font-bold text-white">Không tải được thư viện</p>
            <p className="font-body text-sm text-[#c9c4d8] max-w-md">{loadError}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-6 py-2.5 rounded-full bg-[#cabeff] text-[#31009a] font-bold font-label cursor-pointer hover:scale-105 active:scale-95 transition-transform"
            >
              Thử lại
            </button>
          </div>
        )}

        {!loadError && novels.length > 0 && (
          <>
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
                onToggleFollowGroup={handleToggleFollowGroup}
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
                timelineItems={timelineItems}
                syncStats={syncStats}
                novels={novels}
                onSelectNovel={handleSelectNovel}
              />
            )}

            {currentTab === 'discover' && (
              <DiscoverView novels={novels} onSelectNovel={handleSelectNovel} />
            )}

            {(currentTab === 'library' || currentTab === 'profile') && (
              <ProfileView
                novels={novels}
                onSelectNovel={handleSelectNovel}
                onReadChapter={handleReadChapter}
                user={user}
                onOpenAuth={() => setIsAuthOpen(true)}
              />
            )}
          </>
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

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}