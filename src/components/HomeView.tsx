import React from 'react';
import { Novel } from '../types';

interface HomeViewProps {
  novels: Novel[];
  onSelectNovel: (novel: Novel) => void;
  onReadChapter: (novel: Novel, chapterId?: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  novels,
  onSelectNovel,
  onReadChapter,
  onNavigateTab,
}) => {
  // Eternal Archive for hero
  const heroNovel = novels.find((n) => n.id === 'eternal-archive') || novels[1] || novels[0];

  // Continue reading novels
  const continueReadingList = novels.filter((n) => n.lastReadChapterId);

  // Trending today
  const trendingNovels = novels.slice(4, 9);

  return (
    <div className="space-y-12 pb-12 animate-in fade-in duration-300">
      {/* Hero Section */}
      <section className="mt-4">
        <div className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.5)] group border border-white/10">
          {/* Background Image & Gradient */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage: `url('${heroNovel.coverUrl}')`,
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#101319] via-[#101319]/50 to-transparent"></div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full md:max-w-2xl space-y-4">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white text-glow leading-tight">
              Discover Your Next Favorite
            </h2>
            <p className="text-[#c9c4d8] font-body text-base md:text-lg">
              The Eternal Archive: Chronicles of the Void-Born, Chapter 42 is now available for your journey.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => onReadChapter(heroNovel, 'ch-42')}
                className="bg-gradient-to-r from-[#cabeff] to-[#cebdff] px-8 py-3 rounded-full text-[#31009a] font-label font-bold hover:scale-105 transition-transform duration-200 active:scale-95 shadow-[0_0_20px_rgba(202,190,255,0.4)] cursor-pointer flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-xl filled">play_arrow</span>
                Continue Reading
              </button>
              <button
                onClick={() => onSelectNovel(heroNovel)}
                className="bg-[#101319]/40 backdrop-blur-md border border-white/20 px-8 py-3 rounded-full text-white font-label hover:bg-white/10 transition-colors cursor-pointer"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Continue Reading Shelf */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h3 className="font-headline text-2xl font-bold text-white">Continue Reading</h3>
            <div className="h-1 w-12 bg-[#cabeff] rounded-full"></div>
          </div>
          <button
            onClick={() => onNavigateTab('library')}
            className="text-[#cabeff] font-label text-sm flex items-center gap-1 hover:underline cursor-pointer"
          >
            View Library <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-6 -mx-5 px-5 md:mx-0 md:px-0">
          {continueReadingList.map((novel) => {
            const lastChapter = novel.chapters.find((c) => c.id === novel.lastReadChapterId) || novel.chapters[0];
            const progress = novel.lastReadProgress || 50;

            return (
              <div
                key={novel.id}
                onClick={() => onReadChapter(novel, lastChapter?.id)}
                className="flex-shrink-0 w-64 group cursor-pointer"
              >
                <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-3 shadow-lg group-hover:scale-[1.02] transition-transform duration-300 border border-white/10">
                  <img
                    src={novel.coverUrl}
                    alt={novel.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                    <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                      <div
                        className="bg-[#cabeff] h-full shadow-[0_0_8px_rgba(202,190,255,1)]"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <p className="text-[10px] text-[#cabeff] mt-2 font-label uppercase tracking-widest font-semibold">
                      {progress === 100 ? 'Completed' : `${progress}% Complete`}
                    </p>
                  </div>
                </div>
                <h4 className="font-headline font-bold text-white text-lg group-hover:text-[#cabeff] transition-colors truncate">
                  {novel.title}
                </h4>
                <p className="text-[#c9c4d8] font-label text-sm truncate">
                  Chapter {lastChapter ? lastChapter.number : 1}: {lastChapter ? lastChapter.title : 'Beginning'}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Monthly Crawl & Bento Layout */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Monthly Crawl Card */}
        <div className="md:col-span-5 glass-panel rounded-3xl p-6 flex flex-col justify-between min-h-[260px] group overflow-hidden relative border border-white/10">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-[#cabeff]/10 rounded-full blur-3xl group-hover:bg-[#cabeff]/20 transition-colors"></div>
          <div className="space-y-2 relative z-10">
            <span className="bg-[#cabeff]/10 text-[#cabeff] px-3 py-1 rounded-full text-xs font-label border border-[#cabeff]/20 inline-block">
              Monthly Crawl Highlights
            </span>
            <h3 className="font-headline text-2xl font-bold text-white pt-1">32 New Novels Added</h3>
            <p className="text-[#c9c4d8] text-sm font-body leading-relaxed">
              Our specialized engines successfully synchronized with the global repositories.
            </p>
          </div>
          <div className="flex items-center gap-4 pt-4 relative z-10">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle
                  className="text-white/10"
                  cx="28"
                  cy="28"
                  r="24"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <circle
                  className="text-[#cabeff]"
                  cx="28"
                  cy="28"
                  r="24"
                  fill="transparent"
                  stroke="currentColor"
                  strokeDasharray="150"
                  strokeDashoffset="38"
                  strokeWidth="4"
                ></circle>
              </svg>
              <span className="absolute text-[10px] font-bold text-white uppercase font-label">75%</span>
            </div>
            <div>
              <p className="text-white font-label text-sm font-semibold">Next sync in 12 days</p>
              <p className="text-[#c9c4d8] text-xs font-label">System: Optimal Performance</p>
            </div>
          </div>
        </div>

        {/* Stats Bento Card */}
        <div className="md:col-span-7 bg-[#1d2026] rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden border border-white/10">
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-[#cabeff] font-display text-3xl font-bold">1,248</p>
              <p className="text-[#c9c4d8] font-label text-xs uppercase tracking-widest font-semibold">
                Total Volumes
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[#cebdff] font-display text-3xl font-bold">452</p>
              <p className="text-[#c9c4d8] font-label text-xs uppercase tracking-widest font-semibold">
                Active Readers
              </p>
            </div>
            <div className="hidden md:block space-y-1">
              <p className="text-[#60d4fb] font-display text-3xl font-bold">99.9%</p>
              <p className="text-[#c9c4d8] font-label text-xs uppercase tracking-widest font-semibold">
                Uptime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Today Grid */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h3 className="font-headline text-2xl font-bold text-white">Trending Today</h3>
            <div className="h-1 w-12 bg-[#cabeff] rounded-full"></div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {trendingNovels.map((novel) => (
            <div
              key={novel.id}
              onClick={() => onSelectNovel(novel)}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[2/3] rounded-[20px] overflow-hidden mb-3 shadow-lg group-hover:scale-[1.03] transition-all duration-300 border border-white/10">
                <img
                  src={novel.coverUrl}
                  alt={novel.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2">
                  <span className="bg-[#cabeff]/90 text-[#2a0088] px-2 py-0.5 rounded text-[10px] font-bold uppercase backdrop-blur-sm font-label">
                    {novel.genres[0] || 'Fantasy'}
                  </span>
                </div>
                <div className="absolute inset-0 bg-[#cabeff]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="flex items-center justify-between px-1">
                <div className="flex gap-0.5 text-[#cebdff]">
                  <span className="material-symbols-outlined text-xs filled">star</span>
                  <span className="material-symbols-outlined text-xs filled">star</span>
                  <span className="material-symbols-outlined text-xs filled">star</span>
                  <span className="material-symbols-outlined text-xs filled">star</span>
                  <span className="material-symbols-outlined text-xs filled">star</span>
                </div>
                <span className="text-[#c9c4d8] text-[10px] font-label">{novel.totalViews}</span>
              </div>
              <h5 className="font-headline font-bold text-white text-sm mt-1 truncate group-hover:text-[#cabeff] transition-colors">
                {novel.title}
              </h5>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
