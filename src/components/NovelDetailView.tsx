import React, { useEffect, useState } from 'react';
import { Novel } from '../types';

interface NovelDetailViewProps {
  novel: Novel;
  allNovels: Novel[];
  onReadChapter: (novel: Novel, chapterId?: string) => void;
  onSelectNovel: (novel: Novel) => void;
  onToggleBookmark: (novelId: string) => void;
  /**
   * Gọi POST/DELETE /api/translation-groups/:slug/follow.
   * Trả true nếu thành công; false thì UI rollback.
   */
  onToggleFollowGroup?: (groupSlug: string, shouldFollow: boolean) => Promise<boolean>;
}

export const NovelDetailView: React.FC<NovelDetailViewProps> = ({
  novel,
  allNovels,
  onReadChapter,
  onSelectNovel,
  onToggleBookmark,
  onToggleFollowGroup,
}) => {
  const [synopsisExpanded, setSynopsisExpanded] = useState(false);
  const [showAllChapters, setShowAllChapters] = useState(false);
  const [isNewestFirst, setIsNewestFirst] = useState(false);
  const [isGroupFollowed, setIsGroupFollowed] = useState(
    novel.translationGroup?.isFollowed || false
  );
  const [copiedShare, setCopiedShare] = useState(false);

  /*
   * Cả hai kiểu "theo dõi" đều CHƯA dùng được:
   *
   *   - nhóm dịch : chưa novel nào có `translationGroup.slug`, nên nút Follow
   *                 không có nhóm nào để gửi lên API
   *   - tác giả   : dạng URL /profile/{id}/{username}/ mới chỉ là suy luận từ
   *                 khuôn mẫu WordPress, chưa xác minh được vì ScribbleHub trả
   *                 403 cho mọi trang HTML
   *
   * Dẫn người dùng tới một trang có thể hỏng thì tệ hơn là nói thẳng.
   *
   * Kiểu `boolean` là cố ý — để `true` nguyên văn thì TypeScript thu hẹp kiểu
   * và nhánh follow thật trở thành code chết. Đổi cờ này về false là tính năng
   * sống lại, không phải viết lại.
   */
  const FOLLOW_COMING_SOON: boolean = true;

  const [showComingSoon, setShowComingSoon] = useState(false);

  // Đồng bộ lại khi đổi sang novel khác hoặc khi detail được nạp xong từ API.
  useEffect(() => {
    setIsGroupFollowed(novel.translationGroup?.isFollowed || false);
  }, [novel.id, novel.translationGroup?.isFollowed]);

  /** Cập nhật UI ngay, rollback nếu request thất bại. */
  const handleToggleFollow = async () => {
    const groupSlug = novel.translationGroup?.slug;
    const nextValue = !isGroupFollowed;

    setIsGroupFollowed(nextValue);

    if (!groupSlug || !onToggleFollowGroup) return;

    const ok = await onToggleFollowGroup(groupSlug, nextValue);
    if (!ok) setIsGroupFollowed(!nextValue);
  };

  // Suggested novels
  const suggestions = allNovels.filter((n) => n.id !== novel.id).slice(0, 2);

  // Filter & sort chapters
  const sortedChapters = [...novel.chapters].sort((a, b) =>
    isNewestFirst ? b.number - a.number : a.number - b.number
  );
  const visibleChapters = showAllChapters ? sortedChapters : sortedChapters.slice(0, 4);

  /*
   * Ba con số KHÁC NHAU, rất dễ nhầm lẫn:
   *   novel.totalChapters   — nguồn báo có bao nhiêu chương  (VD 991)
   *   availableChapters     — đã đồng bộ được bao nhiêu       (VD 1)
   *   visibleChapters.length— đang render bao nhiêu dòng      (VD 1, tối đa 4)
   *
   * Fallback về chapters.length cho dữ liệu mock cũ: ở đó mảng CHÍNH LÀ tất cả
   * những gì tồn tại, nên hai con số trùng nhau.
   */
  const availableChapters = novel.availableChapters ?? novel.chapters.length;
  const missingChapters =
    novel.missingChapters ?? Math.max(0, novel.totalChapters - availableChapters);

  /*
   * Thẻ dưới phần chương phục vụ HAI loại nguồn khác hẳn nhau:
   *
   *   NovelUpdates : có NHÓM DỊCH thật -> Follow là tính năng của Lumiere
   *                  (POST /api/translation-groups/:slug/follow)
   *   ScribbleHub  : KHÔNG có nhóm dịch, tác giả đăng trực tiếp -> Follow chỉ có
   *                  thể là liên kết ra trang cá nhân của họ ở nguồn
   *
   * Phân biệt bằng `slug`, không phải bằng `name`: backend luôn trả object
   * translationGroup (các field là chuỗi rỗng khi không có nhóm), nên bản thân
   * object luôn truthy. Đó chính là lý do "Visit Site" từng trỏ vào '#'.
   */
  const hasTranslationGroup = Boolean(novel.translationGroup?.slug);

  // Nhóm dịch có trang riêng thì ưu tiên; không thì trỏ thẳng vào trang truyện.
  const visitUrl = hasTranslationGroup
    ? novel.translationGroup?.siteUrl || novel.sourceUrl
    : novel.sourceUrl;

  /*
   * Thẻ nguồn hiện kể cả khi chưa có URL nào: nút Follow giờ chỉ mở thông báo
   * nên không còn phụ thuộc vào việc có link hay không.
   */
  const showSourceCard = true;

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
            <div className="flex justify-between items-center gap-4">
              <div className="flex items-baseline gap-3 flex-wrap">
                <h2 className="font-headline text-2xl font-bold text-white">Chapters</h2>
                {/*
                  Badge "đã có / tổng" — chống hiểu nhầm.
                  Danh sách chỉ render chương ĐÃ đồng bộ, nên nếu không nói rõ
                  tổng thì người dùng thấy 1 dòng và tưởng truyện có 1 chương.
                */}
                <span className="font-label text-xs text-[#cabeff] bg-[#cabeff]/10 border border-[#cabeff]/25 px-2.5 py-1 rounded-full tabular-nums">
                  Showing {availableChapters.toLocaleString('en-US')} /{' '}
                  {novel.totalChapters.toLocaleString('en-US')} chapters
                </span>
              </div>
              <button
                onClick={() => setIsNewestFirst(!isNewestFirst)}
                className="text-[#c9c4d8] hover:text-[#cabeff] font-label text-sm flex items-center gap-2 cursor-pointer transition-colors shrink-0"
              >
                <span className="material-symbols-outlined text-lg">sort</span>
                {isNewestFirst ? 'Newest First' : 'Oldest First'}
              </button>
            </div>

            {/*
              Giải thích khoảng chênh. KHÔNG coi đây là lỗi — crawler cố ý chỉ nạp
              một phần mục lục, và nói thẳng ra thì người dùng hiểu ngay thay vì
              tưởng dữ liệu hỏng.
            */}
            {missingChapters > 0 && (
              <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-[#1d2026]/60 border border-white/10">
                <span className="material-symbols-outlined text-[#c9c4d8] text-lg shrink-0">
                  cloud_sync
                </span>
                <p className="font-body text-sm text-[#c9c4d8] leading-relaxed">
                  {missingChapters.toLocaleString('en-US')} more chapter
                  {missingChapters === 1 ? '' : 's'} exist at the source but{' '}
                  {missingChapters === 1 ? 'has' : 'have'} not been synchronised yet.
                  They will appear here automatically after the next library sync.
                </p>
              </div>
            )}

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
                  {/*
                    Nút này mở rộng danh sách ĐANG CÓ, nên phải ghi
                    availableChapters. Ghi totalChapters (991) là nói dối: bấm
                    vào vẫn chỉ hiện đúng số chương đã đồng bộ.
                  */}
                  {showAllChapters
                    ? 'Show Fewer Chapters'
                    : `Show All ${availableChapters.toLocaleString('en-US')} Available Chapters`}
                </button>
              )}
            </div>
          </div>

          {/* Nhóm dịch (NovelUpdates) HOẶC tác giả gốc (ScribbleHub) */}
          {showSourceCard && (
            <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-[#cabeff]/20">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-[#cabeff]/10 flex items-center justify-center border border-[#cabeff]/30 overflow-hidden flex-shrink-0">
                  {hasTranslationGroup && novel.translationGroup?.avatarUrl ? (
                    <img
                      src={novel.translationGroup.avatarUrl}
                      alt={novel.translationGroup.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-[#cabeff] text-3xl">
                      {hasTranslationGroup ? 'auto_stories' : 'edit_note'}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <h3 className="font-headline text-xl font-bold text-white">
                    {hasTranslationGroup ? novel.translationGroup?.name : novel.author}
                  </h3>
                  <p className="font-body text-sm text-[#c9c4d8]">
                    {hasTranslationGroup
                      ? novel.translationGroup?.quality
                      : /*
                         * KHÔNG gọi họ là "Translation Group": ScribbleHub là nền
                         * tảng đăng gốc, người này viết truyện chứ không dịch.
                         */
                        'Original Author'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Không có URL thì ẩn hẳn, thay vì hiện nút trỏ vào '#'. */}
                {visitUrl && (
                  <a
                    href={visitUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="px-6 py-2.5 rounded-full glass-panel hover:bg-[#cabeff]/10 hover:text-[#cabeff] transition-all text-[#c9c4d8] font-label text-sm"
                  >
                    Visit Site
                  </a>
                )}

                {/*
                  Một nút duy nhất cho cả hai kiểu nguồn, và nó mở thông báo
                  chứ không gọi API / mở tab mới. Nhãn vẫn phân biệt theo nguồn
                  để khi tính năng chạy được thì chỉ cần đổi lại onClick.
                */}
                <button
                  onClick={
                    FOLLOW_COMING_SOON ? () => setShowComingSoon(true) : handleToggleFollow
                  }
                  className={`px-6 py-2.5 rounded-full font-bold flex items-center gap-2 transition-all cursor-pointer font-label text-sm ${
                    !FOLLOW_COMING_SOON && isGroupFollowed
                      ? 'bg-[#32353c] text-white border border-white/10'
                      : 'bg-[#cabeff] text-[#31009a] hover:scale-105 active:scale-95'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {!FOLLOW_COMING_SOON && isGroupFollowed ? 'check' : 'add'}
                  </span>
                  {!FOLLOW_COMING_SOON && isGroupFollowed
                    ? 'Following'
                    : hasTranslationGroup
                      ? 'Follow'
                      : 'Follow Author'}
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

      {/*
        Thông báo tính năng đang phát triển.
        Nền tối bấm được để đóng; hộp bên trong chặn sự kiện nổi lên, nếu không
        thì bấm vào chính hộp cũng đóng luôn.
      */}
      {showComingSoon && (
        <div
          onClick={() => setShowComingSoon(false)}
          className="fixed inset-0 z-[60] flex items-center justify-center px-5 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass-panel border border-[#cabeff]/25 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#cabeff]/10 border border-[#cabeff]/30 flex items-center justify-center mb-5">
              <span className="material-symbols-outlined text-[#cabeff] text-3xl">
                construction
              </span>
            </div>
            <h3 className="font-headline text-xl font-bold text-white mb-2">
              Tính năng đang được phát triển
            </h3>
            <p className="font-body text-sm text-[#c9c4d8] mb-6">
              Theo dõi {hasTranslationGroup ? 'nhóm dịch' : 'tác giả'} sẽ sớm có mặt. Cảm ơn bạn
              đã kiên nhẫn.
            </p>
            <button
              onClick={() => setShowComingSoon(false)}
              className="w-full py-3 rounded-full bg-[#cabeff] text-[#31009a] font-bold font-label cursor-pointer hover:scale-105 active:scale-95 transition-transform"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
