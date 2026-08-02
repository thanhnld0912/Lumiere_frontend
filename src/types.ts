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
  status: 'Ongoing' | 'Completed' | 'Hiatus';
  totalChapters: number;
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

export type ThemeMode = 'dark' | 'sepia' | 'amoled';
export type FontFamily = 'serif' | 'sans';

export interface ReaderSettings {
  fontFamily: FontFamily;
  fontSize: number; // in px, e.g. 14 to 32
  lineHeight: number; // e.g. 1.2 to 2.4
  theme: ThemeMode;
}
