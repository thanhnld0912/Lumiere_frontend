import React, { useRef } from 'react';
import { Novel } from '../types';

/**
 * Bộ lọc + vị trí trang của tab Discover.
 *
 * Nằm ở App chứ không nằm trong component: App tháo hẳn DiscoverView khỏi cây
 * khi chuyển tab, nên state cục bộ sẽ mất. Người dùng đang ở trang 7, bấm vào
 * một truyện rồi lùi lại mà rơi về trang 1 thì đúng bằng việc không có nút lùi.
 */
export interface DiscoverState {
  genre: string;
  status: string;
  query: string;
  page: number;
}

export const INITIAL_DISCOVER_STATE: DiscoverState = {
  genre: 'All',
  status: 'All',
  query: '',
  page: 1,
};

interface DiscoverViewProps {
  novels: Novel[];
  onSelectNovel: (novel: Novel) => void;
  state: DiscoverState;
  onStateChange: (patch: Partial<DiscoverState>) => void;
}

/** Số truyện mỗi trang. 20 = lấp đầy đúng 4 hàng ở breakpoint lg (5 cột). */
const PAGE_SIZE = 20;

/** Số nút trang tối đa trước khi phải rút gọn bằng dấu '…'. */
const MAX_VISIBLE_PAGES = 7;

/**
 * Dãy nút trang cần vẽ.
 *
 * Với ~800 truyện thì có gần 40 trang, liệt kê hết là không dùng được. Luôn giữ
 * trang đầu, trang cuối và vùng lân cận trang hiện tại; phần bị bỏ qua thay bằng
 * 'gap'.
 */
function buildPageList(current: number, total: number): Array<number | 'gap'> {
  if (total <= MAX_VISIBLE_PAGES) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const wanted = new Set<number>([1, total, current - 1, current, current + 1]);

  // Ở gần hai đầu, mở rộng thêm về phía đó để số nút hiển thị luôn ổn định.
  if (current <= 3) [2, 3, 4].forEach((page) => wanted.add(page));
  if (current >= total - 2) [total - 1, total - 2, total - 3].forEach((page) => wanted.add(page));

  const pages = [...wanted].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);

  const result: Array<number | 'gap'> = [];
  let previous = 0;
  for (const page of pages) {
    if (previous !== 0 && page - previous > 1) result.push('gap');
    result.push(page);
    previous = page;
  }
  return result;
}

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  novels,
  onSelectNovel,
  state,
  onStateChange,
}) => {
  const { genre: selectedGenre, status: statusFilter, query: searchQuery, page } = state;

  const gridRef = useRef<HTMLDivElement>(null);

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

  const totalPages = Math.max(1, Math.ceil(filteredNovels.length / PAGE_SIZE));

  /*
   * Kẹp ngay lúc render thay vì sửa state trong useEffect: lọc xong còn 2 trang
   * mà đang đứng ở trang 30 thì phải hiện trang 2 NGAY, không được nháy một
   * khung lưới rỗng rồi mới nhảy về.
   */
  const safePage = Math.min(page, totalPages);
  const firstIndex = (safePage - 1) * PAGE_SIZE;
  const pageNovels = filteredNovels.slice(firstIndex, firstIndex + PAGE_SIZE);

  /**
   * Đổi trang rồi cuộn về đầu lưới, trừ đi chiều cao header cố định.
   *
   * Vẫn ghi state cả khi trang không đổi để `page` hết lệch với `safePage` sau
   * khi danh sách co lại.
   */
  const goToPage = (next: number) => {
    const clamped = Math.min(Math.max(1, next), totalPages);
    onStateChange({ page: clamped });
    if (clamped === safePage) return;

    const grid = gridRef.current;
    if (!grid) return;
    const top = grid.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  };

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
          onChange={(e) => onStateChange({ query: e.target.value, page: 1 })}
          placeholder="Filter by title, author, or keyword..."
          className="w-full bg-[#1d2026] border border-white/10 rounded-full pl-12 pr-4 py-3.5 text-[#e1e2eb] placeholder-[#c9c4d8]/50 focus:outline-none focus:border-[#cabeff] transition-all font-body text-base shadow-lg"
        />
        {searchQuery && (
          <button
            onClick={() => onStateChange({ query: '', page: 1 })}
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
            onClick={() => onStateChange({ genre, page: 1 })}
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
            onClick={() => onStateChange({ status, page: 1 })}
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

      {/*
        Dòng đếm và lưới nằm CHUNG một khối, và đó cũng là mốc cuộn khi đổi
        trang. Nếu lấy riêng lưới làm mốc thì sau mỗi lần bấm số trang, dòng
        "Showing…" bị đẩy lên trên khung nhìn và nằm khuất sau header cố định.
      */}
      <div ref={gridRef} className="scroll-mt-24">
        {filteredNovels.length > 0 && (
          <div className="flex items-baseline justify-between font-label text-sm text-[#c9c4d8] mb-5">
            <span>
              Showing{' '}
              <span className="text-[#e1e2eb] font-bold">
                {firstIndex + 1}–{firstIndex + pageNovels.length}
              </span>{' '}
              of <span className="text-[#e1e2eb] font-bold">{filteredNovels.length}</span> novels
            </span>
            {totalPages > 1 && (
              <span className="hidden sm:inline">
                Page {safePage} / {totalPages}
              </span>
            )}
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {pageNovels.length === 0 ? (
            <div className="col-span-full text-center py-16 text-[#c9c4d8]">
              No novels found matching your filters.
            </div>
          ) : (
            pageNovels.map((novel) => (
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

      {/* Chuyển trang */}
      {totalPages > 1 && (
        <nav
          className="flex items-center justify-center gap-1.5 flex-wrap pt-2"
          aria-label="Pagination"
        >
          <button
            onClick={() => goToPage(safePage - 1)}
            disabled={safePage === 1}
            aria-label="Previous page"
            className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 bg-[#272a31] text-[#e1e2eb] transition-all enabled:cursor-pointer enabled:hover:border-[#cabeff]/40 enabled:active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-lg">chevron_left</span>
          </button>

          {buildPageList(safePage, totalPages).map((item, index) =>
            item === 'gap' ? (
              // Khoảng lược bỏ không phải nút bấm — key theo vị trí vì '…' lặp lại.
              <span
                key={`gap-${index}`}
                className="w-8 h-10 flex items-end justify-center text-[#c9c4d8] font-label pb-2"
              >
                …
              </span>
            ) : (
              <button
                key={item}
                onClick={() => goToPage(item)}
                aria-current={item === safePage ? 'page' : undefined}
                className={`min-w-10 h-10 px-3 rounded-full font-label text-sm transition-all cursor-pointer ${
                  item === safePage
                    ? 'bg-[#cabeff] text-[#31009a] font-bold shadow-[0_0_15px_rgba(202,190,255,0.4)]'
                    : 'bg-[#272a31] text-[#e1e2eb] border border-white/5 hover:border-[#cabeff]/40'
                }`}
              >
                {item}
              </button>
            ),
          )}

          <button
            onClick={() => goToPage(safePage + 1)}
            disabled={safePage === totalPages}
            aria-label="Next page"
            className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 bg-[#272a31] text-[#e1e2eb] transition-all enabled:cursor-pointer enabled:hover:border-[#cabeff]/40 enabled:active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-lg">chevron_right</span>
          </button>
        </nav>
      )}
    </div>
  );
};
