import React, { useState } from 'react';
import { Novel, User } from '../types';
import { USER_AVATAR } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

interface ProfileViewProps {
  novels: Novel[];
  onSelectNovel: (novel: Novel) => void;
  onReadChapter: (novel: Novel, chapterId?: string) => void;
  /** Người dùng đang đăng nhập, null nếu là khách. */
  user?: User | null;
  onOpenAuth?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  novels,
  onSelectNovel,
  onReadChapter,
  user,
  onOpenAuth,
}) => {
  const { logout } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<'bookmarks' | 'history'>('bookmarks');

  const bookmarkedNovels = novels.filter((n) => n.isBookmarked);
  const historyNovels = novels.filter((n) => n.lastReadChapterId);

  // Khách: thư viện là dữ liệu riêng của từng người nên không có gì để hiển thị.
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-5 text-center animate-in fade-in duration-300">
        <span className="material-symbols-outlined text-[#cabeff] text-5xl">account_circle</span>
        <h2 className="font-headline text-2xl font-bold text-white">Your library awaits</h2>
        <p className="font-body text-[#c9c4d8] max-w-md">
          Sign in to sync your bookmarks, reading history and chapter progress across devices.
        </p>
        <button
          onClick={onOpenAuth}
          className="mt-2 px-8 py-3 rounded-full bg-gradient-to-r from-[#cabeff] to-[#cebdff] text-[#31009a] font-bold font-label shadow-[0_0_20px_rgba(202,190,255,0.35)] hover:scale-105 active:scale-95 transition-transform cursor-pointer"
        >
          Sign In
        </button>
      </div>
    );
  }

  const stats = user.stats;

  return (
    <div className="space-y-8 pb-24 animate-in fade-in duration-300">
      {/* User Header Profile Card */}
      <div className="glass-panel p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center gap-6 shadow-xl">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#cabeff] shadow-lg flex-shrink-0">
          <img
            src={user.avatarUrl ?? USER_AVATAR}
            alt={user.displayName}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 text-center md:text-left space-y-2">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
            {user.displayName}
          </h2>
          <p className="font-body text-[#c9c4d8] text-sm">{user.email}</p>

          <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
            <span className="px-3 py-1 rounded-full bg-[#cabeff]/15 text-[#cabeff] font-label text-xs border border-[#cabeff]/20">
              {(stats?.chaptersRead ?? 0).toLocaleString('en-US')} Chapters Read
            </span>
            <span className="px-3 py-1 rounded-full bg-[#cebdff]/15 text-[#cebdff] font-label text-xs border border-[#cebdff]/20">
              {stats?.bookmarksCount ?? bookmarkedNovels.length} Bookmarks
            </span>
            <span className="px-3 py-1 rounded-full bg-[#60d4fb]/15 text-[#60d4fb] font-label text-xs border border-[#60d4fb]/20">
              {stats?.streakDays ?? 0} Days Streak
            </span>
          </div>
        </div>

        <button
          onClick={logout}
          className="px-5 py-2.5 rounded-full glass-panel border border-white/10 text-[#c9c4d8] hover:text-[#cabeff] hover:border-[#cabeff]/40 transition-all font-label text-sm cursor-pointer flex items-center gap-2 self-center"
          title="Sign out"
        >
          <span className="material-symbols-outlined text-base">logout</span>
          Sign Out
        </button>
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
