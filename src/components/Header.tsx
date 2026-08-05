import React from 'react';
import { USER_AVATAR } from '../data/mockData';
import type { User } from '../types';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenSearch: () => void;
  onOpenMenu?: () => void;
  /** Người dùng đang đăng nhập, null nếu là khách. */
  user?: User | null;
  /** Mở form đăng nhập khi khách bấm vào avatar. */
  onOpenAuth?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenSearch,
  onOpenMenu,
  user,
  onOpenAuth,
}) => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#101319]/60 backdrop-blur-xl border-b border-white/10 h-16 transition-all duration-300">
      <div className="flex justify-between items-center px-5 md:px-16 h-full w-full max-w-[1440px] mx-auto">
        {/* Left: Menu & Brand */}
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenMenu}
            className="material-symbols-outlined text-[#cabeff] hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            title="Menu"
          >
            menu
          </button>
          <span
            onClick={() => onSelectTab('home')}
            className="font-display text-2xl font-bold tracking-tight text-[#cabeff] cursor-pointer hover:opacity-90 transition-opacity"
          >
            Lumiere
          </span>
        </div>

        {/* Center: Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => onSelectTab('home')}
            className={`font-label text-sm transition-all cursor-pointer ${
              currentTab === 'home'
                ? 'text-[#cabeff] font-bold border-b-2 border-[#cabeff] pb-0.5'
                : 'text-[#c9c4d8] hover:text-[#cabeff]'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onSelectTab('discover')}
            className={`font-label text-sm transition-all cursor-pointer ${
              currentTab === 'discover'
                ? 'text-[#cabeff] font-bold border-b-2 border-[#cabeff] pb-0.5'
                : 'text-[#c9c4d8] hover:text-[#cabeff]'
            }`}
          >
            Discover
          </button>
          <button
            onClick={() => onSelectTab('library')}
            className={`font-label text-sm transition-all cursor-pointer ${
              currentTab === 'library'
                ? 'text-[#cabeff] font-bold border-b-2 border-[#cabeff] pb-0.5'
                : 'text-[#c9c4d8] hover:text-[#cabeff]'
            }`}
          >
            Library
          </button>
          <button
            onClick={() => onSelectTab('timeline')}
            className={`font-label text-sm transition-all cursor-pointer ${
              currentTab === 'timeline'
                ? 'text-[#cabeff] font-bold border-b-2 border-[#cabeff] pb-0.5'
                : 'text-[#c9c4d8] hover:text-[#cabeff]'
            }`}
          >
            Timeline
          </button>

          {/*
            Tab Admin CHỈ hiện với tài khoản có quyền admin.
            Đây chỉ là lớp giao diện — chốt chặn thật nằm ở backend, nơi
            /api/admin/* trả 403 bất kể frontend hiển thị gì.
          */}
          {user?.role === 'admin' && (
            <button
              onClick={() => onSelectTab('admin')}
              className={`font-label text-sm transition-all cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'admin'
                  ? 'text-[#cabeff] font-bold border-b-2 border-[#cabeff] pb-0.5'
                  : 'text-[#c9c4d8] hover:text-[#cabeff]'
              }`}
            >
              <span className="material-symbols-outlined text-base">shield_person</span>
              Admin
            </button>
          )}
        </div>

        {/* Right: Search & Profile Avatar */}
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenSearch}
            className="material-symbols-outlined text-[#c9c4d8] hover:text-[#cabeff] transition-colors cursor-pointer p-1 rounded-full hover:bg-white/5"
            title="Search"
          >
            search
          </button>
          {/* Đã đăng nhập -> vào Profile. Là khách -> mở form đăng nhập. */}
          <div
            onClick={() => (user ? onSelectTab('profile') : onOpenAuth?.())}
            className="w-9 h-9 rounded-full bg-[#272a31] border border-white/10 overflow-hidden cursor-pointer active:scale-95 transition-all hover:border-[#cabeff]/50 shadow-sm flex items-center justify-center"
            title={user ? user.displayName : 'Sign in'}
          >
            {user ? (
              <img
                className="w-full h-full object-cover"
                src={user.avatarUrl ?? USER_AVATAR}
                alt={user.displayName}
              />
            ) : (
              <span className="material-symbols-outlined text-[#c9c4d8] text-xl">login</span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
