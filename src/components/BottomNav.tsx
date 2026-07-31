import React from 'react';

interface BottomNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 bg-[#101319]/80 backdrop-blur-xl border-t border-white/10 rounded-t-xl h-20 shadow-[0_-12px_40px_rgba(0,0,0,0.6)]">
      <div className="flex justify-around items-center h-full pb-safe w-full px-2">
        {/* Home */}
        <button
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center justify-center transition-all active:scale-90 px-3 py-1 rounded-full ${
            currentTab === 'home'
              ? 'text-[#cabeff] bg-[#cabeff]/15 font-bold'
              : 'text-[#c9c4d8] hover:text-[#cabeff]'
          }`}
        >
          <span className="material-symbols-outlined text-2xl">home</span>
          <span className="font-label text-[11px] mt-0.5">Home</span>
        </button>

        {/* Discover */}
        <button
          onClick={() => onSelectTab('discover')}
          className={`flex flex-col items-center justify-center transition-all active:scale-90 px-3 py-1 rounded-full ${
            currentTab === 'discover'
              ? 'text-[#cabeff] bg-[#cabeff]/15 font-bold'
              : 'text-[#c9c4d8] hover:text-[#cabeff]'
          }`}
        >
          <span className="material-symbols-outlined text-2xl">explore</span>
          <span className="font-label text-[11px] mt-0.5">Discover</span>
        </button>

        {/* Library */}
        <button
          onClick={() => onSelectTab('library')}
          className={`flex flex-col items-center justify-center transition-all active:scale-90 px-3 py-1 rounded-full ${
            currentTab === 'library'
              ? 'text-[#cabeff] bg-[#cabeff]/15 font-bold'
              : 'text-[#c9c4d8] hover:text-[#cabeff]'
          }`}
        >
          <span className="material-symbols-outlined text-2xl">auto_stories</span>
          <span className="font-label text-[11px] mt-0.5">Library</span>
        </button>

        {/* Timeline */}
        <button
          onClick={() => onSelectTab('timeline')}
          className={`flex flex-col items-center justify-center transition-all active:scale-90 px-3 py-1 rounded-full ${
            currentTab === 'timeline'
              ? 'text-[#cabeff] bg-[#cabeff]/15 font-bold'
              : 'text-[#c9c4d8] hover:text-[#cabeff]'
          }`}
        >
          <span className="material-symbols-outlined text-2xl">timeline</span>
          <span className="font-label text-[11px] mt-0.5">Timeline</span>
        </button>

        {/* Profile */}
        <button
          onClick={() => onSelectTab('profile')}
          className={`flex flex-col items-center justify-center transition-all active:scale-90 px-3 py-1 rounded-full ${
            currentTab === 'profile'
              ? 'text-[#cabeff] bg-[#cabeff]/15 font-bold'
              : 'text-[#c9c4d8] hover:text-[#cabeff]'
          }`}
        >
          <span className="material-symbols-outlined text-2xl">person</span>
          <span className="font-label text-[11px] mt-0.5">Profile</span>
        </button>
      </div>
    </nav>
  );
};
