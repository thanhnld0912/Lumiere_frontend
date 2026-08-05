import React, { useEffect, useState } from 'react';
import { adminApi, ApiError } from '../services/api';
import type { AdminStats, DailyPoint, LabelledCount } from '../types';

/**
 * Bảng điều khiển vận hành — chỉ tài khoản role='admin' xem được.
 *
 * ── Quyết định trực quan hoá ──────────────────────────────────────────────
 * Toàn bộ biểu đồ dùng ĐÚNG MỘT màu mark (#cabeff, tương phản 9.57:1 trên nền
 * panel — vượt sàn 3:1). Không có bảng màu categorical nào, vì không biểu đồ nào
 * ở đây cần phân biệt "danh tính" giữa nhiều series:
 *
 *   • KPI      -> con số, không phải biểu đồ
 *   • theo ngày-> MỘT series theo thời gian  -> một hue, không cần chú giải
 *   • genre    -> hạng mục nominal            -> CÙNG một hue cho mọi thanh
 *   • nguồn/top-> nhiều cột dữ liệu           -> bảng, không phải biểu đồ
 *
 * Cố ý KHÔNG tô thanh theo giá trị (gradient đậm-nhạt): độ dài thanh đã mã hoá
 * độ lớn rồi, tô thêm màu là lãng phí kênh thị giác để nói lại cùng một điều.
 *
 * Chữ luôn mang token text (#e1e2eb / #c9c4d8), không bao giờ mang màu của mark.
 */

const MARK = '#cabeff';

export const AdminView: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    adminApi
      .stats(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setStats(data);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setError(
          err instanceof ApiError
            ? err.status === 403
              ? 'Tài khoản này không có quyền admin.'
              : err.message
            : 'Không tải được số liệu.',
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <span className="material-symbols-outlined text-[#cabeff] text-4xl animate-spin">
          progress_activity
        </span>
        <p className="font-label text-sm text-[#c9c4d8]">Đang tải số liệu…</p>
      </div>
    );
  }

  if (error !== null || stats === null) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
        <span className="material-symbols-outlined text-red-400 text-4xl">lock</span>
        <p className="font-headline text-xl font-bold text-white">Không xem được</p>
        <p className="font-body text-sm text-[#c9c4d8] max-w-md">{error}</p>
      </div>
    );
  }

  const { library, users, engagement, crawler, breakdown, topNovels } = stats;

  return (
    <div className="space-y-8 pb-24 animate-in fade-in duration-300">
      <header>
        <h1 className="font-headline text-3xl md:text-5xl font-bold text-white tracking-tight">
          Bảng điều khiển
        </h1>
        <p className="font-body text-base text-[#c9c4d8] mt-2">
          Số liệu tính trực tiếp từ database. Không có giá trị mẫu.
        </p>
      </header>

      {/* KPI — con số headline thì dùng ô thống kê, không phải biểu đồ một cột */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="Truyện" value={library.novels} icon="auto_stories" />
        <StatTile label="Chương" value={library.chapters} icon="menu_book" />
        <StatTile label="Người dùng" value={users.total} icon="group" />
        <StatTile
          label="Hoạt động 7 ngày"
          value={users.activeLast7Days}
          icon="bolt"
          hint="có đọc ít nhất một chương"
        />
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="Lượt bookmark" value={engagement.bookmarks} icon="bookmark" />
        <StatTile label="Lượt đọc chương" value={engagement.chaptersRead} icon="visibility" />
        <StatTile label="Truyện đang đọc dở" value={engagement.novelsStarted} icon="history" />
        <StatTile
          label="Chương mới 30 ngày"
          value={crawler.chaptersAddedLast30Days}
          icon="cloud_download"
        />
      </section>

      <ColumnChart
        title="Chương mới mỗi ngày"
        subtitle="14 ngày gần nhất · nguồn: sync_events"
        points={breakdown.dailyChapters}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RankedBars
          title="Thể loại phổ biến"
          subtitle="số truyện mỗi thể loại"
          items={breakdown.topGenres}
        />
        <RankedBars
          title="Trạng thái truyện"
          subtitle="phân bố theo novel_status"
          items={breakdown.byStatus}
        />
      </div>

      <CrawlerPanel crawler={crawler} />

      <TopNovelsTable novels={topNovels} />

      <p className="font-label text-xs text-[#c9c4d8]/60">
        Thư viện còn có {library.genres} thể loại, {library.tags} tag,{' '}
        {library.translationGroups} nhóm dịch · {users.admins} tài khoản admin ·{' '}
        {users.newLast30Days} người dùng mới trong 30 ngày.
      </p>
    </div>
  );
};

/* ── Ô thống kê ─────────────────────────────────────────────── */

const StatTile: React.FC<{
  label: string;
  value: number;
  icon: string;
  hint?: string;
}> = ({ label, value, icon, hint }) => (
  <div className="glass-panel border border-white/10 rounded-2xl p-5 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
    <div className="flex items-start justify-between mb-3">
      <span className="material-symbols-outlined text-[#cabeff] bg-[#cabeff]/10 p-2 rounded-lg text-xl">
        {icon}
      </span>
    </div>
    {/*
      Con số hero dùng chữ số TỈ LỆ, không dùng tabular-nums: ở cỡ lớn, chữ số
      rộng bằng nhau làm '121' trông rời rạc. tabular-nums chỉ dùng ở bảng và
      trục, nơi các con số cần thẳng cột.
    */}
    <p className="font-display text-3xl font-bold text-[#e1e2eb]">
      {value.toLocaleString('vi-VN')}
    </p>
    <p className="font-label text-xs text-[#c9c4d8] mt-1 uppercase tracking-wider">{label}</p>
    {hint !== undefined && (
      <p className="font-body text-[11px] text-[#c9c4d8]/60 mt-1">{hint}</p>
    )}
  </div>
);

/* ── Biểu đồ cột theo thời gian ─────────────────────────────── */

const ColumnChart: React.FC<{
  title: string;
  subtitle: string;
  points: DailyPoint[];
}> = ({ title, subtitle, points }) => {
  const max = Math.max(1, ...points.map((point) => point.count));
  const total = points.reduce((sum, point) => sum + point.count, 0);
  const [showTable, setShowTable] = useState(false);

  return (
    <section className="glass-panel border border-white/10 rounded-2xl p-6 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
      <div className="flex items-baseline justify-between mb-1 gap-4">
        <h2 className="font-headline text-xl font-bold text-white">{title}</h2>
        <div className="flex items-baseline gap-4">
          <span className="font-label text-sm text-[#c9c4d8]">
            {total.toLocaleString('vi-VN')} chương
          </span>
          {/*
            Bảng đối chiếu — BẮT BUỘC, không phải tuỳ chọn cho đẹp.
            Nếu chỉ có tooltip thì giá trị từng ngày không đọc được bằng bàn
            phím, không đọc được bằng trình đọc màn hình, và không sao chép được.
            Tooltip là thứ bổ trợ, không được là đường duy nhất tới dữ liệu.
          */}
          <button
            onClick={() => setShowTable((previous) => !previous)}
            className="font-label text-xs text-[#c9c4d8] hover:text-[#cabeff] transition-colors cursor-pointer underline underline-offset-4 decoration-white/20"
          >
            {showTable ? 'Xem biểu đồ' : 'Xem dạng bảng'}
          </button>
        </div>
      </div>
      <p className="font-body text-xs text-[#c9c4d8]/70 mb-6">{subtitle}</p>

      {showTable && (
        <div className="max-h-56 overflow-y-auto rounded-xl border border-white/10">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-[#1d2026]">
              <tr className="font-label text-[11px] uppercase tracking-wider text-[#c9c4d8]/70">
                <th className="py-2.5 px-4 font-medium">Ngày</th>
                <th className="py-2.5 px-4 font-medium text-right">Chương mới</th>
              </tr>
            </thead>
            <tbody className="font-body text-sm">
              {points.map((point) => (
                <tr key={point.date} className="border-t border-white/5">
                  <td className="py-2 px-4 text-[#c9c4d8]">{formatDay(point.date)}</td>
                  {/* tabular-nums ĐÚNG chỗ: các con số cần thẳng cột */}
                  <td className="py-2 px-4 text-right text-[#e1e2eb] tabular-nums">
                    {point.count.toLocaleString('vi-VN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!showTable && total === 0 && (
        <EmptyPlot message="Chưa có sự kiện đồng bộ nào trong 14 ngày qua." />
      )}

      {!showTable && total > 0 && (
        // gap-[2px]: khe nền 2px giữa các cột để hai cột cạnh nhau không dính liền
        <div className="flex items-end gap-[2px] h-40">
          {points.map((point) => {
            const heightPercent = (point.count / max) * 100;
            return (
              <div key={point.date} className="flex-1 h-full flex flex-col justify-end group relative">
                {/* Tooltip hover — biểu đồ HTML thì phải tương tác được */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 pointer-events-none">
                  <div className="bg-[#272a31] border border-white/15 rounded-lg px-3 py-2 whitespace-nowrap shadow-xl">
                    <p className="font-label text-xs text-[#e1e2eb] tabular-nums">
                      {point.count.toLocaleString('vi-VN')} chương
                    </p>
                    <p className="font-body text-[11px] text-[#c9c4d8]">
                      {formatDay(point.date)}
                    </p>
                  </div>
                </div>

                {/* Vùng bắt hover phủ cả cột, rộng hơn chính thanh dữ liệu */}
                <div className="absolute inset-0" aria-hidden />

                {/*
                  Giới hạn bề rộng cột: mark mảnh, không phải khối màu bão hoà.
                  Để `flex-1` tự do thì trên màn rộng mỗi cột thành ~80px và cả
                  biểu đồ biến thành một mảng tím đặc.
                */}
                <div
                  className="w-full max-w-[26px] mx-auto rounded-t transition-[filter] group-hover:brightness-125"
                  style={{
                    height: `${Math.max(heightPercent, point.count > 0 ? 3 : 0)}%`,
                    backgroundColor: MARK,
                    // Bo 4px ở ĐẦU DỮ LIỆU, chân cột neo thẳng vào trục
                    borderTopLeftRadius: 4,
                    borderTopRightRadius: 4,
                  }}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Trục thời gian nằm NGOÀI khung h-40 của vùng vẽ, nên không bị cắt */}
      {!showTable && (
        <div className="flex justify-between mt-3 font-label text-[11px] text-[#c9c4d8]/70">
          <span>{formatDay(points[0]?.date ?? '')}</span>
          <span>{formatDay(points[points.length - 1]?.date ?? '')}</span>
        </div>
      )}
    </section>
  );
};

/* ── Thanh ngang xếp hạng ───────────────────────────────────── */

const RankedBars: React.FC<{
  title: string;
  subtitle: string;
  items: LabelledCount[];
}> = ({ title, subtitle, items }) => {
  const max = Math.max(1, ...items.map((item) => item.count));

  return (
    <section className="glass-panel border border-white/10 rounded-2xl p-6 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
      <h2 className="font-headline text-xl font-bold text-white mb-1">{title}</h2>
      <p className="font-body text-xs text-[#c9c4d8]/70 mb-5">{subtitle}</p>

      {items.length === 0 ? (
        <EmptyPlot message="Chưa có dữ liệu." />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.label}>
              <div className="flex justify-between items-baseline mb-1.5">
                <span className="font-body text-sm text-[#e1e2eb]">{item.label}</span>
                {/* Nhãn trực tiếp: đọc được giá trị mà không cần trỏ chuột */}
                <span className="font-label text-xs text-[#c9c4d8] tabular-nums">
                  {item.count.toLocaleString('vi-VN')}
                </span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.max((item.count / max) * 100, 2)}%`,
                    // CÙNG một màu cho mọi thanh: độ dài đã nói lên độ lớn rồi
                    backgroundColor: MARK,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

/* ── Tình trạng crawler ─────────────────────────────────────── */

const CrawlerPanel: React.FC<{ crawler: AdminStats['crawler'] }> = ({ crawler }) => (
  <section className="glass-panel border border-white/10 rounded-2xl p-6 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
    <h2 className="font-headline text-xl font-bold text-white mb-1">Nguồn dữ liệu</h2>
    <p className="font-body text-xs text-[#c9c4d8]/70 mb-5">
      {crawler.novelsNeverCrawled > 0
        ? `${crawler.novelsNeverCrawled} truyện đã phát hiện nhưng chưa nạp metadata — chạy refresh.`
        : 'Mọi truyện đã biết đều đã được nạp metadata.'}
    </p>

    {/* Nhiều cột dữ liệu -> bảng, không phải biểu đồ */}
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="font-label text-[11px] uppercase tracking-wider text-[#c9c4d8]/70">
            <th className="pb-3 pr-4 font-medium">Nguồn</th>
            <th className="pb-3 pr-4 font-medium">Trạng thái</th>
            <th className="pb-3 pr-4 font-medium text-right">Truyện</th>
            <th className="pb-3 font-medium">Crawl gần nhất</th>
          </tr>
        </thead>
        <tbody className="font-body text-sm">
          {crawler.sources.map((source) => (
            <tr key={source.slug} className="border-t border-white/5">
              <td className="py-3 pr-4 text-[#e1e2eb]">{source.name}</td>
              <td className="py-3 pr-4">
                {/*
                  Trạng thái mang icon + NHÃN CHỮ, không bao giờ chỉ có màu.
                  Cố ý KHÔNG dùng màu mark (#cabeff) ở đây: màu đó đang mang
                  nghĩa "dữ liệu" trong các biểu đồ, mượn nó cho trạng thái sẽ
                  làm hai thứ khác hẳn nhau trông giống nhau.
                */}
                <span
                  className={`inline-flex items-center gap-1.5 font-label text-xs ${
                    source.enabled ? 'text-[#e1e2eb]' : 'text-[#c9c4d8]/60'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {source.enabled ? 'check_circle' : 'pause_circle'}
                  </span>
                  {source.enabled ? 'Đang bật' : 'Đã tắt'}
                </span>
              </td>
              <td className="py-3 pr-4 text-right text-[#e1e2eb] tabular-nums">
                {source.novels.toLocaleString('vi-VN')}
              </td>
              <td className="py-3 text-[#c9c4d8]">{formatRelative(source.lastCrawledAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {crawler.lastRun !== null && (
      <div className="mt-5 pt-5 border-t border-white/5 flex flex-wrap items-center gap-x-6 gap-y-2 font-label text-xs">
        <span className="text-[#c9c4d8]">Lần chạy gần nhất</span>
        <span className="text-[#e1e2eb]">
          {crawler.lastRun.mode ?? '—'} · {crawler.lastRun.sourceSlug ?? '—'}
        </span>
        <span className="text-[#e1e2eb]">
          {crawler.lastRun.status} ({crawler.lastRun.progress}%)
        </span>
        <span className="text-[#c9c4d8]">{formatRelative(crawler.lastRun.startedAt)}</span>
      </div>
    )}
  </section>
);

/* ── Bảng top truyện ────────────────────────────────────────── */

const TopNovelsTable: React.FC<{ novels: AdminStats['topNovels'] }> = ({ novels }) => (
  <section className="glass-panel border border-white/10 rounded-2xl p-6 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
    <h2 className="font-headline text-xl font-bold text-white mb-1">Truyện được lưu nhiều nhất</h2>
    <p className="font-body text-xs text-[#c9c4d8]/70 mb-5">xếp theo số bookmark</p>

    {novels.length === 0 ? (
      <EmptyPlot message="Chưa có truyện nào." />
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="font-label text-[11px] uppercase tracking-wider text-[#c9c4d8]/70">
              <th className="pb-3 pr-4 font-medium">Truyện</th>
              <th className="pb-3 pr-4 font-medium text-right">Bookmark</th>
              <th className="pb-3 pr-4 font-medium text-right">Điểm</th>
              <th className="pb-3 font-medium text-right">Chương</th>
            </tr>
          </thead>
          <tbody className="font-body text-sm">
            {novels.map((novel) => (
              <tr key={novel.slug} className="border-t border-white/5">
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-11 rounded overflow-hidden bg-[#272a31] shrink-0">
                      {novel.coverUrl !== '' && (
                        <img
                          src={novel.coverUrl}
                          alt=""
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      )}
                    </div>
                    <span className="text-[#e1e2eb] line-clamp-2">{novel.title}</span>
                  </div>
                </td>
                <td className="py-3 pr-4 text-right text-[#e1e2eb] tabular-nums">
                  {novel.bookmarks.toLocaleString('vi-VN')}
                </td>
                <td className="py-3 pr-4 text-right text-[#c9c4d8] tabular-nums">
                  {novel.ratingsCount > 0
                    ? `${novel.rating.toFixed(1)} (${novel.ratingsCount})`
                    : '—'}
                </td>
                <td className="py-3 text-right text-[#c9c4d8] tabular-nums">
                  {novel.totalChapters.toLocaleString('vi-VN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </section>
);

/* ── Tiện ích ───────────────────────────────────────────────── */

const EmptyPlot: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex items-center justify-center h-32 rounded-xl border border-dashed border-white/10">
    <p className="font-body text-sm text-[#c9c4d8]/70">{message}</p>
  </div>
);

function formatDay(isoDate: string): string {
  if (isoDate === '') return '';
  const date = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    timeZone: 'UTC',
  }).format(date);
}

function formatRelative(iso: string | null): string {
  if (iso === null) return 'chưa bao giờ';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';

  const diffMs = Date.now() - date.getTime();
  const hours = Math.floor(diffMs / 3_600_000);
  if (hours < 1) return 'vừa xong';
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} ngày trước`;
  return `${Math.floor(days / 30)} tháng trước`;
}
