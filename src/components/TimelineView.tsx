import React, { useState, useEffect } from 'react';
import { TimelineItem, SyncStats, Novel } from '../types';

interface TimelineViewProps {
  timelineItems: TimelineItem[];
  syncStats: SyncStats;
  novels: Novel[];
  onSelectNovel: (novel: Novel) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  timelineItems,
  syncStats,
  novels,
  onSelectNovel,
}) => {
  const [syncProgress, setSyncProgress] = useState(syncStats.nextSyncPercentage);

  // Live progress simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setSyncProgress((prev) => (prev < 99 ? prev + 0.3 : 20));
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mt-6 px-0 max-w-[1440px] mx-auto pb-24 animate-in fade-in duration-300">
      {/* Header */}
      <header className="mb-10">
        <h1 className="font-headline text-3xl md:text-5xl font-bold text-white tracking-tight">
          Library Synchronization Log
        </h1>
        <p className="font-body text-base md:text-lg text-[#c9c4d8] mt-2 max-w-2xl leading-relaxed">
          A historical archive of your digital literary journey. Tracking every chapter, series, and translation group updates across the multiverse.
        </p>
      </header>

      {/* Summary Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Chapters Found */}
        <div className="glass-panel border border-white/10 rounded-2xl p-6 shadow-[0_12px_40px_rgba(0,0,0,0.5)] hover:scale-[1.02] transition-transform duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className="material-symbols-outlined text-[#60d4fb] bg-[#60d4fb]/10 p-2 rounded-lg">
              auto_stories
            </span>
            <span className="text-[#c9c4d8] text-xs font-label uppercase tracking-wider font-semibold">
              Total Inventory
            </span>
          </div>
          <h3 className="font-display text-2xl font-bold text-[#cabeff]">
            {syncStats.totalChapters} Chapters Found
          </h3>
          <p className="text-[#c9c4d8] text-sm font-label mt-1">
            {syncStats.chaptersThisMonth}
          </p>
        </div>

        {/* New Series */}
        <div className="glass-panel border border-white/10 rounded-2xl p-6 shadow-[0_12px_40px_rgba(0,0,0,0.5)] hover:scale-[1.02] transition-transform duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className="material-symbols-outlined text-[#cabeff] bg-[#cabeff]/10 p-2 rounded-lg">
              library_add
            </span>
            <span className="text-[#c9c4d8] text-xs font-label uppercase tracking-wider font-semibold">
              Onboarding
            </span>
          </div>
          <h3 className="font-display text-2xl font-bold text-[#cabeff]">
            {syncStats.newSeriesCount} New Series
          </h3>
          <p className="text-[#c9c4d8] text-sm font-label mt-1">
            Expanding your horizon
          </p>
        </div>

        {/* New Groups */}
        <div className="glass-panel border border-white/10 rounded-2xl p-6 shadow-[0_12px_40px_rgba(0,0,0,0.5)] hover:scale-[1.02] transition-transform duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className="material-symbols-outlined text-[#cebdff] bg-[#cebdff]/10 p-2 rounded-lg">
              group_work
            </span>
            <span className="text-[#c9c4d8] text-xs font-label uppercase tracking-wider font-semibold">
              Translators
            </span>
          </div>
          <h3 className="font-display text-2xl font-bold text-[#cabeff]">
            {syncStats.newGroupsCount} New Groups
          </h3>
          <p className="text-[#c9c4d8] text-sm font-label mt-1">
            Verified scanlation partners
          </p>
        </div>
      </div>

      {/* Timeline View */}
      <div className="relative ml-4 md:ml-0 pl-4 md:pl-0 border-l-2 border-[#cabeff]/20 space-y-12">
        {/* August Node (Expanded) */}
        <div className="relative pl-8 md:pl-12">
          {/* Node Icon Circle */}
          <div className="absolute -left-[21px] md:-left-[25px] top-0 w-8 h-8 md:w-10 md:h-10 bg-[#947dff] rounded-full flex items-center justify-center border-4 border-[#101319] z-10 shadow-md">
            <span className="material-symbols-outlined text-[#2a0088] text-lg">
              history
            </span>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-baseline justify-between">
              <h2 className="font-headline text-2xl font-bold text-white">
                August <span className="text-[#cabeff] text-base font-normal ml-2 font-body">2024</span>
              </h2>
              <span className="bg-[#cabeff]/15 text-[#cabeff] px-3 py-1 rounded-full text-xs font-label font-semibold border border-[#cabeff]/30">
                CURRENT LOG
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {timelineItems.map((item) => {
                const matchedNovel = novels.find((n) => n.id === item.novelId) || novels[0];
                return (
                  <div
                    key={item.id}
                    onClick={() => onSelectNovel(matchedNovel)}
                    className="glass-panel border border-white/10 rounded-2xl p-4 flex gap-4 hover:border-[#cabeff]/40 transition-colors group cursor-pointer"
                  >
                    <div className="w-16 h-24 rounded-lg overflow-hidden shrink-0 shadow-lg group-hover:scale-105 transition-transform bg-[#272a31]">
                      <img
                        src={item.novelCover}
                        alt={item.novelTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-between py-1 min-w-0">
                      <div>
                        <h4 className="font-headline font-bold text-white text-base truncate group-hover:text-[#cabeff] transition-colors">
                          {item.novelTitle}
                        </h4>
                        <p className="text-[#c9c4d8] text-xs font-body truncate">
                          {item.translator}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-[#cabeff] text-[#31009a] text-[10px] px-2 py-0.5 rounded font-bold font-label">
                          +{item.chaptersAddedCount} CHAPTERS
                        </span>
                        <span className="text-[#c9c4d8] text-[10px] font-label">
                          {item.timeAgo}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* July Node (Collapsed) */}
        <div className="relative pl-8 md:pl-12 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
          <div className="absolute -left-[17px] md:-left-[21px] top-1 w-8 h-8 md:w-10 md:h-10 bg-[#272a31] rounded-full flex items-center justify-center border-4 border-[#101319] z-10">
            <div className="w-2.5 h-2.5 bg-[#c9c4d8] rounded-full"></div>
          </div>
          <div className="flex items-baseline gap-4">
            <h2 className="font-headline text-2xl font-bold text-white">
              July <span className="text-[#c9c4d8] text-base font-normal ml-2 font-body">2024</span>
            </h2>
            <span className="text-[#c9c4d8] text-sm font-label">
              34 Series Updated · 162 Chapters Sync'd
            </span>
          </div>
        </div>

        {/* June Node (Collapsed) */}
        <div className="relative pl-8 md:pl-12 opacity-40 hover:opacity-100 transition-opacity cursor-pointer">
          <div className="absolute -left-[17px] md:-left-[21px] top-1 w-8 h-8 md:w-10 md:h-10 bg-[#272a31] rounded-full flex items-center justify-center border-4 border-[#101319] z-10">
            <div className="w-2.5 h-2.5 bg-[#c9c4d8] rounded-full"></div>
          </div>
          <div className="flex items-baseline gap-4">
            <h2 className="font-headline text-2xl font-bold text-white">
              June <span className="text-[#c9c4d8] text-base font-normal ml-2 font-body">2024</span>
            </h2>
            <span className="text-[#c9c4d8] text-sm font-label">
              28 Series Updated · 110 Chapters Sync'd
            </span>
          </div>
        </div>
      </div>

      {/* Sync Progress Section */}
      <section className="mt-16">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#947dff]/20 to-[#512caf]/20 border border-white/10 rounded-2xl p-8 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
          {/* Background Blur Accent */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#cabeff]/10 blur-[100px] rounded-full -mr-32 -mt-32"></div>

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#cabeff] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#cabeff]"></span>
                </span>
                <span className="text-[#cabeff] font-bold tracking-widest text-xs uppercase font-label">
                  Next Sync Countdown
                </span>
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
                Automated sync in progress
              </h2>
              <p className="text-[#c9c4d8] text-sm font-body mt-2">
                Checking 1,240 data nodes across 14 providers. Average completion: {Math.round(syncProgress)}%.
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-2">
              <div className="flex gap-1.5 items-end h-8">
                <div className="w-1.5 h-8 bg-[#cabeff] rounded-full animate-pulse-soft"></div>
                <div className="w-1.5 h-8 bg-[#cabeff]/70 rounded-full animate-pulse-soft" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1.5 h-8 bg-[#cabeff]/40 rounded-full animate-pulse-soft" style={{ animationDelay: '0.4s' }}></div>
                <div className="w-1.5 h-8 bg-white/10 rounded-full"></div>
              </div>
              <span className="font-label text-xs text-[#c9c4d8]">
                Estimated: {syncStats.nextSyncCountdown}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-8 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#cabeff] rounded-full transition-all duration-700 ease-out shadow-[0_0_20px_rgba(202,190,255,0.6)]"
              style={{ width: `${syncProgress}%` }}
            ></div>
          </div>
        </div>
      </section>
    </div>
  );
};
