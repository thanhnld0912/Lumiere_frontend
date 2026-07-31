import React, { useState } from 'react';
import { Novel } from '../types';

interface DiscoverViewProps {
  novels: Novel[];
  onSelectNovel: (novel: Novel) => void;
}

export const DiscoverView: React.FC<DiscoverViewProps> = ({ novels, onSelectNovel }) => {
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const genresList = ['All', 'Fantasy', 'Cyberpunk', 'Mystery', 'Action', 'Slice of Life', 'Romance', 'Seinen'];

  const filteredNovels = novels.filter((n) => {
    const matchesGenre = selectedGenre === 'All' || n.genres.includes(selectedGenre);
    const matchesStatus = statusFilter === 'All' || n.status === statusFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGenre && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-24 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="font-headline text-3xl md:text-5xl font-bold text-white tracking-tight">
          Discover Multiverse
        </h1>
        <p className="font-body text-[#c9c4d8] text-base mt-2">
          Explore thousands of translated light novels across dimensions.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="relative w-full max-w-2xl">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#cabeff]">
          search
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter by title, author, or keyword..."
          className="w-full bg-[#1d2026] border border-white/10 rounded-full pl-12 pr-4 py-3.5 text-[#e1e2eb] placeholder-[#c9c4d8]/50 focus:outline-none focus:border-[#cabeff] transition-all font-body text-base shadow-lg"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#c9c4d8] hover:text-white"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        )}
      </div>

      {/* Genre Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
        {genresList.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`px-5 py-2.5 rounded-full font-label text-sm transition-all cursor-pointer whitespace-nowrap ${
              selectedGenre === genre
                ? 'bg-[#cabeff] text-[#31009a] font-bold shadow-[0_0_15px_rgba(202,190,255,0.4)]'
                : 'bg-[#272a31] text-[#e1e2eb] border border-white/5 hover:border-[#cabeff]/40'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-4 text-sm font-label border-b border-white/10 pb-4">
        <span className="text-[#c9c4d8]">Status:</span>
        {['All', 'Ongoing', 'Completed'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`cursor-pointer transition-colors ${
              statusFilter === status
                ? 'text-[#cabeff] font-bold underline underline-offset-8'
                : 'text-[#c9c4d8] hover:text-white'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {filteredNovels.length === 0 ? (
          <div className="col-span-full text-center py-16 text-[#c9c4d8]">
            No novels found matching your filters.
          </div>
        ) : (
          filteredNovels.map((novel) => (
            <div
              key={novel.id}
              onClick={() => onSelectNovel(novel)}
              className="group cursor-pointer flex flex-col"
            >
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-3 shadow-lg group-hover:scale-[1.03] transition-all duration-300 border border-white/10 bg-[#272a31]">
                <img
                  src={novel.coverUrl}
                  alt={novel.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 flex gap-1">
                  <span className="bg-[#cabeff]/90 text-[#2a0088] px-2 py-0.5 rounded text-[10px] font-bold uppercase backdrop-blur-sm font-label">
                    {novel.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between px-0.5 mb-1">
                <span className="text-[#60d4fb] text-xs font-label font-bold flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-xs filled">star</span>
                  {novel.rating}
                </span>
                <span className="text-[#c9c4d8] text-[11px] font-label">
                  {novel.totalChapters} ch
                </span>
              </div>
              <h4 className="font-headline font-bold text-white text-base truncate group-hover:text-[#cabeff] transition-colors">
                {novel.title}
              </h4>
              <p className="font-body text-xs text-[#c9c4d8] truncate">
                by {novel.author}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
