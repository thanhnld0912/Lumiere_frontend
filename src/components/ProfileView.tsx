import React, { useState } from 'react';
import { Novel } from '../types';
import { USER_AVATAR } from '../data/mockData';

interface ProfileViewProps {
  novels: Novel[];
  onSelectNovel: (novel: Novel) => void;
  onReadChapter: (novel: Novel, chapterId?: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  novels,
  onSelectNovel,
  onReadChapter,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'bookmarks' | 'history'>('bookmarks');

  const bookmarkedNovels = novels.filter((n) => n.isBookmarked);
  const historyNovels = novels.filter((n) => n.lastReadChapterId);

  return (
    <div className="space-y-8 pb-24 animate-in fade-in duration-300">
      {/* User Header Profile Card */}
      <div className="glass-panel p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center gap-6 shadow-xl">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#cabeff] shadow-lg flex-shrink-0">
          <img src={USER_AVATAR} alt="User Avatar" className="w-full h-full object-cover" />
        </div>

        <div className="flex-1 text-center md:text-left space-y-2">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
            Archivist Traveler
          </h2>
          <p className="font-body text-[#c9c4d8] text-sm">
            nguyenledangthanh.a41922@gmail.com • VIP Reader Level 8
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
            <span className="px-3 py-1 rounded-full bg-[#cabeff]/15 text-[#cabeff] font-label text-xs border border-[#cabeff]/20">
              2,400 Chapters Read
            </span>
            <span className="px-3 py-1 rounded-full bg-[#cebdff]/15 text-[#cebdff] font-label text-xs border border-[#cebdff]/20">
              {bookmarkedNovels.length} Bookmarks
            </span>
            <span className="px-3 py-1 rounded-full bg-[#60d4fb]/15 text-[#60d4fb] font-label text-xs border border-[#60d4fb]/20">
              42 Days Streak
            </span>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-white/10 gap-8">
        <button
          onClick={() => setActiveSubTab('bookmarks')}
          className={`pb-4 font-label text-base transition-all cursor-pointer ${
            activeSubTab === 'bookmarks'
              ? 'text-[#cabeff] font-bold border-b-2 border-[#cabeff]'
              : 'text-[#c9c4d8] hover:text-white'
          }`}
        >
          Bookmarked Library ({bookmarkedNovels.length})
        </button>
        <button
          onClick={() => setActiveSubTab('history')}
          className={`pb-4 font-label text-base transition-all cursor-pointer ${
            activeSubTab === 'history'
              ? 'text-[#cabeff] font-bold border-b-2 border-[#cabeff]'
              : 'text-[#c9c4d8] hover:text-white'
          }`}
        >
          Reading History ({historyNovels.length})
        </button>
      </div>

      {/* Novels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(activeSubTab === 'bookmarks' ? bookmarkedNovels : historyNovels).map((novel) => {
          const lastChapter = novel.chapters.find((c) => c.id === novel.lastReadChapterId) || novel.chapters[0];
          return (
            <div
              key={novel.id}
              className="glass-panel p-4 rounded-2xl border border-white/10 flex gap-4 hover:border-[#cabeff]/40 transition-all group"
            >
              <img
                src={novel.coverUrl}
                alt={novel.title}
                className="w-20 h-28 object-cover rounded-xl shadow-md cursor-pointer group-hover:scale-105 transition-transform flex-shrink-0"
                onClick={() => onSelectNovel(novel)}
              />
              <div className="flex flex-col justify-between flex-1 min-w-0 py-1">
                <div>
                  <h4
                    onClick={() => onSelectNovel(novel)}
                    className="font-headline font-bold text-white text-base truncate group-hover:text-[#cabeff] transition-colors cursor-pointer"
                  >
                    {novel.title}
                  </h4>
                  <p className="font-body text-xs text-[#c9c4d8] truncate">
                    by {novel.author}
                  </p>
                  <p className="font-label text-xs text-[#cabeff] mt-1">
                    {lastChapter ? `Chapter ${lastChapter.number}: ${lastChapter.title}` : 'Unread'}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <button
                    onClick={() => onReadChapter(novel, lastChapter?.id)}
                    className="px-4 py-1.5 rounded-full bg-[#cabeff] text-[#31009a] font-bold font-label text-xs hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                  >
                    Continue
                  </button>

                  <button
                    onClick={() => onSelectNovel(novel)}
                    className="text-[#c9c4d8] hover:text-white font-label text-xs cursor-pointer"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
