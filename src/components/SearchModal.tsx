import React, { useState } from 'react';
import { Novel } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  novels: Novel[];
  onSelectNovel: (novel: Novel) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  novels,
  onSelectNovel,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filteredNovels = query.trim()
    ? novels.filter(
        (n) =>
          n.title.toLowerCase().includes(query.toLowerCase()) ||
          n.author.toLowerCase().includes(query.toLowerCase()) ||
          n.genres.some((g) => g.toLowerCase().includes(query.toLowerCase()))
      )
    : novels.slice(0, 5);

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-start justify-center pt-20 px-4 transition-opacity">
      <div
        className="bg-[#1d2026] border border-white/10 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <span className="material-symbols-outlined text-[#cabeff]">search</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search novels, authors, genres..."
            autoFocus
            className="w-full bg-transparent text-[#e1e2eb] placeholder-[#c9c4d8]/50 focus:outline-none text-lg font-body"
          />
          <button
            onClick={onClose}
            className="material-symbols-outlined text-[#c9c4d8] hover:text-white transition-colors"
          >
            close
          </button>
        </div>

        {/* Query Suggestions / Quick Filter Tags */}
        {!query && (
          <div className="flex flex-wrap gap-2 text-xs text-[#c9c4d8]">
            <span className="font-label text-slate-400 self-center mr-1">Popular:</span>
            {['Fantasy', 'Cyberpunk', 'Action', 'Mystery', 'Seinen'].map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="px-3 py-1 rounded-full bg-[#272a31] border border-white/5 hover:border-[#cabeff]/40 hover:text-[#cabeff] transition-all cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto space-y-3 pr-1">
          {filteredNovels.length === 0 ? (
            <div className="text-center py-8 text-[#c9c4d8]">
              No novels found matching "{query}"
            </div>
          ) : (
            filteredNovels.map((novel) => (
              <div
                key={novel.id}
                onClick={() => {
                  onSelectNovel(novel);
                  onClose();
                }}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#272a31] transition-all cursor-pointer group border border-transparent hover:border-white/5"
              >
                <img
                  src={novel.coverUrl}
                  alt={novel.title}
                  className="w-12 h-16 object-cover rounded-lg flex-shrink-0 shadow-md group-hover:scale-105 transition-transform"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-headline font-bold text-white text-base truncate group-hover:text-[#cabeff] transition-colors">
                    {novel.title}
                  </h4>
                  <p className="font-body text-xs text-[#c9c4d8] truncate">
                    by {novel.author} • {novel.status}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {novel.genres.slice(0, 3).map((g) => (
                      <span
                        key={g}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-[#cabeff]/10 text-[#cabeff] font-label"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-[#60d4fb]">
                  <span className="material-symbols-outlined text-sm filled">star</span>
                  <span>{novel.rating}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
