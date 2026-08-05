export interface Chapter {
  id: string;
  number: number;
  title: string;
  date: string;
  isRead: boolean;
  content?: string[];
  illustrationUrl?: string;
  wordCount?: number;
}

export interface TranslationGroup {
  /**
   * Định danh ổn định do backend trả về, dùng để gọi
   * POST/DELETE /api/translation-groups/:slug/follow.
   * Optional để dữ liệu mock cũ (không có field này) vẫn hợp lệ.
   */
  slug?: string;
  name: string;
  quality: string;
  avatarUrl: string;
  siteUrl: string;
  isFollowed?: boolean;
}

export interface Novel {
  id: string;
  title: string;
  author: string;
  artist?: string;
  coverUrl: string;
  backdropUrl?: string;
  rating: number;
  ratingsCount: string;
  // Khớp enum novel_status ở database (migration 001_status_enum.sql).
  // 'Dropped' và 'Unknown' được thêm cho crawler: NovelUpdates có những trạng
  // thái này, và 'Unknown' là fallback trung thực khi không map được — tốt hơn
  // là mặc định gán bừa 'Ongoing'.
  status: 'Ongoing' | 'Completed' | 'Hiatus' | 'Dropped' | 'Unknown';

  /**
   * Tổng số chương theo NGUỒN báo (VD 991).
   *
   * KHÔNG BAO GIỜ dùng `chapters.length` thay cho số này — mảng `chapters` chỉ
   * chứa phần mục lục đã đồng bộ, và ở màn danh sách còn bị rút gọn xuống 1-2
   * phần tử.
   */
  totalChapters: number;

  /**
   * Số chương thực sự đọc/xem được (COUNT từ bảng chapters).
   *
   * Optional vì `mockData.ts` cũ không có field này; API luôn trả về. Nơi dùng
   * nên fallback về `chapters.length` — với dữ liệu mock thì mảng CHÍNH LÀ tất cả.
   */
  availableChapters?: number;

  /** `totalChapters - availableChapters` — số chương chưa đồng bộ. */
  missingChapters?: number;
  genres: string[];
  synopsis: string;
  chapters: Chapter[];
  translationGroup: TranslationGroup;
  releaseFrequency: string;
  totalViews: string;
  recommendationsCount: string;
  recommendationsAvatars: string[];
  lastReadChapterId?: string;
  lastReadProgress?: number; // 0 to 100
  isBookmarked?: boolean;
}

export interface TimelineItem {
  id: string;
  novelId: string;
  novelTitle: string;
  novelCover: string;
  translator: string;
  chaptersAddedCount: number;
  timeAgo: string;
  month: string; // e.g. "August"
  year: string;  // e.g. "2024"
}

export interface SyncStats {
  totalChapters: string;
  chaptersThisMonth: string;
  newSeriesCount: number;
  newGroupsCount: number;
  nextSyncCountdown: string;
  nextSyncPercentage: number;
}

/**
 * Người dùng đã đăng nhập, trả về từ GET /api/auth/me.
 *
 * Trước đây ProfileView hardcode các giá trị này trong JSX
 * (ProfileView.tsx:31-46); đây là hình dạng dữ liệu thật tương ứng.
 */
export interface UserStats {
  chaptersRead: number;
  bookmarksCount: number;
  streakDays: number;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  role: 'user' | 'admin';
  stats?: UserStats;
}

/**
 * Số liệu vận hành cho bảng điều khiển admin — GET /api/admin/stats.
 * Mọi con số đều tính từ database, không có giá trị mẫu nào.
 */
export interface LabelledCount {
  label: string;
  count: number;
}

export interface DailyPoint {
  date: string;
  count: number;
}

export interface AdminStats {
  library: {
    novels: number;
    chapters: number;
    genres: number;
    tags: number;
    translationGroups: number;
  };
  users: {
    total: number;
    admins: number;
    newLast30Days: number;
    activeLast7Days: number;
  };
  engagement: {
    bookmarks: number;
    chaptersRead: number;
    novelsStarted: number;
  };
  crawler: {
    sources: {
      slug: string;
      name: string;
      enabled: boolean;
      novels: number;
      lastCrawledAt: string | null;
    }[];
    lastRun: {
      sourceSlug: string | null;
      mode: string | null;
      status: string;
      progress: number;
      startedAt: string;
      finishedAt: string | null;
    } | null;
    chaptersAddedLast30Days: number;
    novelsNeverCrawled: number;
  };
  breakdown: {
    byStatus: LabelledCount[];
    topGenres: LabelledCount[];
    dailyChapters: DailyPoint[];
  };
  topNovels: {
    slug: string;
    title: string;
    coverUrl: string;
    bookmarks: number;
    rating: number;
    ratingsCount: number;
    totalChapters: number;
  }[];
}

export type ThemeMode = 'dark' | 'sepia' | 'amoled';
export type FontFamily = 'serif' | 'sans';

export interface ReaderSettings {
  fontFamily: FontFamily;
  fontSize: number; // in px, e.g. 14 to 32
  lineHeight: number; // e.g. 1.2 to 2.4
  theme: ThemeMode;
}
