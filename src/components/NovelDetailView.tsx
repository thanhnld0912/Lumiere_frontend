import React, { useState } from 'react';
import { Novel, Chapter } from '../types';

interface NovelDetailViewProps {
  novel: Novel;
  allNovels: Novel[];
  onReadChapter: (novel: Novel, chapterId?: string) => void;
  onSelectNovel: (novel: Novel) => void;
  onToggleBookmark: (novelId: string) => void;
}

export const NovelDetailView: React.FC<NovelDetailViewProps> = ({
  novel,
  allNovels,
  onReadChapter,
  onSelectNovel,
  onToggleBookmark,
}) => {
  const [synopsisExpanded, setSynopsisExpanded] = useState(false);
  const [showAllChapters, setShowAllChapters] = useState(false);
  const [isNewestFirst, setIsNewestFirst] = useState(false);
  const [isGroupFollowed, setIsGroupFollowed] = useState(
    novel.translationGroup?.isFollowed || false
  );
  const [copiedShare, setCopiedShare] = useState(false);

  // Suggested novels
  const suggestions = allNovels.filter((n) => n.id !== novel.id).slice(0, 2);

  // Filter & sort chapters
  const sortedChapters = [...novel.chapters].sort((a, b) =>
    isNewestFirst ? b.number - a.number : a.number - b.number
  );
  const visibleChapters = showAllChapters ? sortedChapters : sortedChapters.slice(0, 4);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <div className="pb-24 pt-16 animate-in fade-in duration-300">
      {/* Immersive Header */}
      <section className="relative w-full h-[480px] md:h-[580px] overflow-hidden -mx-5 px-5 md:-mx-16 md:px-16 -mt-16">
        {/* Blurred Backdrop */}
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full scale-110 bg-cover bg-center blur-2xl opacity-40 transition-transform duration-1000"
            style={{
              backgroundImage: `url('${novel.backdropUrl || novel.coverUrl}')`,
            }}
          ></div>
          <div className="absolute inset-0 hero-gradient"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full h-full max-w-[1440px] mx-auto flex flex-col md:flex-row items-end pb-12 gap-6 md:gap-12">
          {/* Overlapping Book Cover */}
          <div className="flex-shrink-0 w-44 md:w-64 aspect-[2/3] rounded-2xl overflow-hidden book-shadow border border-white/20 translate-y-16 md:translate-y-24 bg-[#101319]">
            <img
              className="w-full h-full object-cover"
              src={novel.coverUrl}
              alt={novel.title}
            />
          </div>

          {/* Hero Metadata */}
          <div className="flex-grow flex flex-col items-start gap-3 pb-2">
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-[#cabeff]/20 text-[#cabeff] border border-[#cabeff]/20 font-label text-xs">
                {novel.status}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#32353c]/50 text-[#c9c4d8] border border-white/10 font-label text-xs">
                {novel.totalChapters} Chapters
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              {novel.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="font-body text-[#c9c4d8] italic">by {novel.author}</span>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#60d4fb] text-base filled">star</span>
                <span className="font-label text-white font-bold">{novel.rating}</span>
                <span className="text-[#c9c4d8] text-xs">({novel.ratingsCount})</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="max-w-[1440px] mx-auto mt-28 md:mt-36 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Primary Info & Chapters */}
        <div className="lg:col-span-8 flex flex-col gap-10">
          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => onReadChapter(novel, novel.lastReadChapterId || novel.chapters[0]?.id)}
              className="bg-gradient-to-r from-[#cabeff] to-[#cebdff] text-[#31009a] font-bold px-10 py-4 rounded-full text-lg shadow-[0_0_20px_rgba(202,190,255,0.35)] hover:scale-105 active:scale-95 transition-transform cursor-pointer flex items-center gap-3 font-label"
            >
              <span className="material-symbols-outlined text-xl filled">play_arrow</span>
              Read Now
            </button>

            <button
              onClick={() => onToggleBookmark(novel.id)}
              className={`w-14 h-14 rounded-full glass-panel flex items-center justify-center transition-all cursor-pointer active:scale-90 ${
                novel.isBookmarked
                  ? 'text-[#cabeff] border-[#cabeff]/50 bg-[#cabeff]/15'
                  : 'text-[#c9c4d8] hover:text-[#cabeff]'
              }`}
              title={novel.isBookmarked ? 'Bookmarked' : 'Bookmark Novel'}
            >
              <span className={`material-symbols-outlined ${novel.isBookmarked ? 'filled' : ''}`}>
                bookmark
              </span>
            </button>

            <button
              onClick={handleShare}
              className="w-14 h-14 rounded-full glass-panel flex items-center justify-center text-[#c9c4d8] hover:text-[#cebdff] transition-all cursor-pointer active:scale-90 relative"
              title="Share"
            >
              <span className="material-symbols-outlined">share</span>
              {copiedShare && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#32353c] text-white text-[10px] px-2 py-1 rounded font-label whitespace-nowrap border border-white/10 shadow-lg">
                  Copied link!
                </span>
              )}
            </button>
          </div>

          {/* Genre Tags Scroll */}
          <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
            {novel.genres.map((genre) => (
              <span
                key={genre}
                className="flex-shrink-0 px-6 py-2.5 rounded-full bg-[#272a31] border border-white/5 text-[#e1e2eb] hover:border-[#cabeff]/30 transition-colors cursor-pointer font-label text-sm"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Synopsis */}
          <div className="flex flex-col gap-3">
            <h2 className="font-headline text-2xl font-bold text-white">Synopsis</h2>
            <div className="relative">
              <p
                className={`font-body text-[#c9c4d8] text-lg leading-relaxed transition-all ${
                  !synopsisExpanded ? 'line-clamp-4' : ''
                }`}
              >
                {novel.synopsis}
              </p>
              <button
                onClick={() => setSynopsisExpanded(!synopsisExpanded)}
                className="mt-3 text-[#cabeff] font-bold flex items-center gap-1 hover:underline cursor-pointer group font-label"
              >
                {synopsisExpanded ? 'Read Less' : 'Read More'}
                <span
                  className={`material-symbols-outlined text-sm transition-transform ${
                    synopsisExpanded ? 'rotate-180' : ''
                  }`}
                >
                  keyboard_arrow_down
                </span>
              </button>
            </div>
          </div>

          {/* Chapter List */}
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h2 className="font-headline text-2xl font-bold text-white">Chapters</h2>
              <button
                onClick={() => setIsNewestFirst(!isNewestFirst)}
                className="text-[#c9c4d8] hover:text-[#cabeff] font-label text-sm flex items-center gap-2 cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-lg">sort</span>
                {isNewestFirst ? 'Newest First' : 'Oldest First'}
              </button>
            </div>

            {/* Volume Group */}
            <div className="flex flex-col gap-3">
              <div className="px-4 py-2 bg-[#1d2026]/50 border-l-2 border-[#cabeff]">
                <span className="font-label text-xs text-[#cabeff] uppercase tracking-widest font-bold">
                  Volume 1: The Beginning
                </span>
              </div>

              <div className="flex flex-col bg-[#191c22] rounded-2xl overflow-hidden border border-white/5">
                {visibleChapters.map((ch) => (
                  <div
                    key={ch.id}
                    onClick={() => onReadChapter(novel, ch.id)}
                    className="flex items-center justify-between p-4 hover:bg-[#272a31] transition-colors cursor-pointer group border-b border-white/5 last:border-none"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-[#c9c4d8] font-label text-sm w-8">
                        {ch.number < 10 ? `0${ch.number}` : ch.number}
                      </span>
                      <span className="text-[#e1e2eb] group-hover:text-[#cabeff] transition-colors font-body">
                        {ch.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[#c9c4d8] text-xs hidden md:block font-label">
                        {ch.date}
                      </span>
                      {ch.isRead ? (
                        <span
                          className="material-symbols-outlined text-[#cabeff] filled"
                          title="Completed"
                        >
                          check_circle
                        </span>
                      ) : (
                        <span
                          className="material-symbols-outlined text-[#c9c4d8]/30"
                          title="Unread"
                        >
                          circle
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {novel.chapters.length > 4 && (
                <button
                  onClick={() => setShowAllChapters(!showAllChapters)}
                  className="w-full py-4 text-[#c9c4d8] hover:text-white transition-colors bg-[#0b0e14]/50 rounded-b-xl border-x border-b border-white/5 font-label cursor-pointer"
                >
                  {showAllChapters
                    ? 'Show Fewer Chapters'
                    : `Show All ${novel.totalChapters} Chapters`}
                </button>
              )}
            </div>
          </div>

          {/* Translation Group Section */}
          {novel.translationGroup && (
            <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-[#cabeff]/20">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-[#cabeff]/10 flex items-center justify-center border border-[#cabeff]/30 overflow-hidden flex-shrink-0">
                  {novel.translationGroup.avatarUrl ? (
                    <img
                      src={novel.translationGroup.avatarUrl}
                      alt={novel.translationGroup.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-[#cabeff] text-3xl">
                      auto_stories
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <h3 className="font-headline text-xl font-bold text-white">
                    {novel.translationGroup.name}
                  </h3>
                  <p className="font-body text-sm text-[#c9c4d8]">
                    {novel.translationGroup.quality}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={novel.translationGroup.siteUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-2.5 rounded-full glass-panel hover:bg-[#cabeff]/10 hover:text-[#cabeff] transition-all text-[#c9c4d8] font-label text-sm"
                >
                  Visit Site
                </a>
                <button
                  onClick={() => setIsGroupFollowed(!isGroupFollowed)}
                  className={`px-6 py-2.5 rounded-full font-bold flex items-center gap-2 transition-all cursor-pointer font-label text-sm ${
                    isGroupFollowed
                      ? 'bg-[#32353c] text-white border border-white/10'
                      : 'bg-[#cabeff] text-[#31009a] hover:scale-105 active:scale-95'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {isGroupFollowed ? 'check' : 'add'}
                  </span>
                  {isGroupFollowed ? 'Following' : 'Follow'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          {/* Info Card */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <span className="font-label text-xs text-[#c9c4d8] uppercase tracking-wider">
                Release Frequency
              </span>
              <span className="font-body text-lg text-white font-medium">
                {novel.releaseFrequency}
              </span>
            </div>
            <div className="h-px bg-white/5"></div>
            <div className="flex flex-col gap-1">
              <span className="font-label text-xs text-[#c9c4d8] uppercase tracking-wider">
                Total Views
              </span>
              <span className="font-body text-lg text-white font-medium">
                {novel.totalViews}
              </span>
            </div>
            <div className="h-px bg-white/5"></div>
            <div className="flex flex-col gap-2">
              <span className="font-label text-xs text-[#c9c4d8] uppercase tracking-wider">
                Recommendations
              </span>
              <div className="flex items-center -space-x-2 mt-1">
                {novel.recommendationsAvatars.map((url, idx) => (
                  <div
                    key={idx}
                    className="w-8 h-8 rounded-full border-2 border-[#101319] bg-[#32353c] overflow-hidden"
                  >
                    <img src={url} alt="User Avatar" className="w-full h-full object-cover" />
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-[#101319] bg-[#32353c] flex items-center justify-center text-[10px] font-bold text-white font-label">
                  {novel.recommendationsCount}
                </div>
              </div>
            </div>
          </div>

          {/* Suggested Novels */}
          <div className="flex flex-col gap-4">
            <h3 className="font-headline text-xl font-bold text-white px-1">You might like</h3>
            <div className="flex flex-col gap-4">
              {suggestions.map((s) => (
                <div
                  key={s.id}
                  onClick={() => onSelectNovel(s)}
                  className="flex gap-4 p-3 rounded-xl hover:bg-[#272a31] transition-all cursor-pointer group border border-transparent hover:border-white/5"
                >
                  <div className="w-16 aspect-[2/3] rounded-lg overflow-hidden flex-shrink-0 bg-[#32353c]">
                    <img
                      src={s.coverUrl}
                      alt={s.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex flex-col justify-center min-w-0">
                    <span className="font-body font-bold text-white group-hover:text-[#cabeff] transition-colors truncate">
                      {s.title}
                    </span>
                    <span className="font-label text-xs text-[#c9c4d8]">
                      {s.genres.join(', ')}
                    </span>
                    <div className="flex items-center gap-1 mt-1 text-[#60d4fb]">
                      <span className="material-symbols-outlined text-[14px] filled">star</span>
                      <span className="text-xs text-white font-label">{s.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
