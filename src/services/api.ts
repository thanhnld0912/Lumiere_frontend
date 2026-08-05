/**
 * Lớp HTTP client tới Lumiere backend.
 *
 * FILE MỚI — không có file cũ nào bị thay thế. Trước đây frontend không gọi API
 * nào cả (dữ liệu lấy từ src/data/mockData.ts + localStorage).
 *
 * Backend có một presenter layer format sẵn mọi chuỗi hiển thị
 * (totalViews '2.8M Readers', chapter.date 'Oct 12, 2023'…), nên JSON trả về
 * khớp 1-1 với src/types.ts. Nhờ vậy HomeView / DiscoverView / SearchModal /
 * TimelineView / ReaderView / BottomNav không cần sửa gì.
 */
import type {
  AdminStats,
  Chapter,
  Novel,
  SyncStats,
  TimelineItem,
  User,
} from '../types';

/** Base URL của API. Đặt VITE_API_URL trong .env.local để trỏ tới backend đã deploy. */
const API_BASE_URL: string =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ??
  'http://localhost:4000';

const TOKEN_STORAGE_KEY = 'lumiere_token';

/* ── Quản lý token ─────────────────────────────────────────── */

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch {
    // Chế độ riêng tư của Safari chặn localStorage — bỏ qua, phiên chỉ tồn tại
    // trong bộ nhớ.
  }
}

export function clearToken(): void {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    // bỏ qua
  }
}

/* ── Lỗi ───────────────────────────────────────────────────── */

export interface ApiFieldError {
  field: string;
  message: string;
}

export class ApiError extends Error {
  readonly status: number;
  readonly errors: ApiFieldError[];

  constructor(status: number, message: string, errors: ApiFieldError[] = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }

  /** True khi cần đăng nhập lại (token thiếu / sai / hết hạn). */
  get isAuthError(): boolean {
    return this.status === 401;
  }
}

/* ── Lõi request ───────────────────────────────────────────── */

interface SuccessEnvelope<T> {
  success: true;
  data: T;
}

interface ErrorEnvelope {
  success: false;
  message: string;
  errors?: ApiFieldError[];
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  /** Gắn header Authorization nếu có token. Mặc định true. */
  auth?: boolean;
  signal?: AbortSignal;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = true, signal } = options;

  const headers: Record<string, string> = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (error) {
    // fetch chỉ reject khi mạng lỗi / CORS chặn / request bị huỷ.
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new ApiError(
      0,
      `Không kết nối được tới API tại ${API_BASE_URL}. Backend đã chạy chưa?`,
    );
  }

  // 204 hoặc body rỗng.
  const text = await response.text();
  if (!text) {
    if (response.ok) return undefined as T;
    throw new ApiError(response.status, response.statusText || 'Request failed');
  }

  let payload: SuccessEnvelope<T> | ErrorEnvelope;
  try {
    payload = JSON.parse(text) as SuccessEnvelope<T> | ErrorEnvelope;
  } catch {
    throw new ApiError(response.status, 'Server trả về response không phải JSON hợp lệ');
  }

  if (!response.ok || payload.success === false) {
    const errorPayload = payload as ErrorEnvelope;
    const apiError = new ApiError(
      response.status,
      errorPayload.message ?? 'Request failed',
      errorPayload.errors ?? [],
    );
    // Token hỏng thì xoá luôn, tránh mọi request sau đó đều 401.
    if (apiError.isAuthError) clearToken();
    throw apiError;
  }

  return (payload as SuccessEnvelope<T>).data;
}

/* ── Auth ──────────────────────────────────────────────────── */

export interface AuthResult {
  token: string;
  user: User;
}

export const authApi = {
  register(email: string, password: string, displayName: string): Promise<AuthResult> {
    return request<AuthResult>('/api/auth/register', {
      method: 'POST',
      body: { email, password, displayName },
      auth: false,
    });
  },

  login(email: string, password: string): Promise<AuthResult> {
    return request<AuthResult>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
      auth: false,
    });
  },

  me(): Promise<User> {
    return request<User>('/api/auth/me');
  },
};

/* ── Novels ────────────────────────────────────────────────── */

export interface NovelListResponse {
  items: Novel[];
  total: number;
}

export interface NovelFilters {
  q?: string;
  genre?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

export const novelApi = {
  /**
   * Trả toàn bộ novel, sort created_at DESC.
   *
   * Frontend đang lọc phía client (DiscoverView, SearchModal) nên mặc định
   * không truyền filter — giữ nguyên hành vi cũ, và HomeView.tsx:24
   * (`novels.slice(4, 9)`) vẫn có thứ tự ổn định như trước.
   */
  list(filters: NovelFilters = {}, signal?: AbortSignal): Promise<NovelListResponse> {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== '') params.set(key, String(value));
    }
    const queryString = params.toString();
    return request<NovelListResponse>(
      `/api/novels${queryString ? `?${queryString}` : ''}`,
      signal ? { signal } : {},
    );
  },

  /** Chi tiết novel kèm ĐẦY ĐỦ chapters (sort theo number tăng dần). */
  detail(slug: string, signal?: AbortSignal): Promise<Novel> {
    return request<Novel>(`/api/novels/${encodeURIComponent(slug)}`, signal ? { signal } : {});
  },

  /**
   * Nội dung một chương. Bắt buộc nested dưới novel vì chapter id
   * (VD 'ch-42') chỉ unique trong phạm vi một novel.
   */
  chapter(novelSlug: string, chapterSlug: string, signal?: AbortSignal): Promise<Chapter> {
    return request<Chapter>(
      `/api/novels/${encodeURIComponent(novelSlug)}/chapters/${encodeURIComponent(chapterSlug)}`,
      signal ? { signal } : {},
    );
  },

  addBookmark(slug: string): Promise<{ novelId: string; isBookmarked: boolean }> {
    return request(`/api/novels/${encodeURIComponent(slug)}/bookmark`, { method: 'POST' });
  },

  removeBookmark(slug: string): Promise<{ novelId: string; isBookmarked: boolean }> {
    return request(`/api/novels/${encodeURIComponent(slug)}/bookmark`, { method: 'DELETE' });
  },

  /** Đánh dấu đã đọc + cập nhật vị trí đọc dở. `progress` bỏ trống thì giữ nguyên giá trị cũ. */
  updateProgress(
    novelSlug: string,
    chapterSlug: string,
    progress?: number,
  ): Promise<{ lastReadChapterId: string; lastReadProgress: number }> {
    return request(
      `/api/novels/${encodeURIComponent(novelSlug)}/chapters/${encodeURIComponent(
        chapterSlug,
      )}/progress`,
      { method: 'PUT', body: progress === undefined ? {} : { progress } },
    );
  },
};

/* ── Library ───────────────────────────────────────────────── */

export const libraryApi = {
  bookmarks(): Promise<NovelListResponse> {
    return request<NovelListResponse>('/api/library/bookmarks');
  },

  history(): Promise<NovelListResponse> {
    return request<NovelListResponse>('/api/library/history');
  },
};

/* ── Admin ─────────────────────────────────────────────────── */

export const adminApi = {
  /** Chỉ tài khoản role='admin' gọi được; các role khác nhận 403. */
  stats(signal?: AbortSignal): Promise<AdminStats> {
    return request<AdminStats>('/api/admin/stats', signal ? { signal } : {});
  },
};

/* ── Timeline ──────────────────────────────────────────────── */

export const timelineApi = {
  list(signal?: AbortSignal): Promise<{ items: TimelineItem[] }> {
    return request<{ items: TimelineItem[] }>('/api/timeline', signal ? { signal } : {});
  },

  stats(signal?: AbortSignal): Promise<SyncStats> {
    return request<SyncStats>('/api/timeline/stats', signal ? { signal } : {});
  },
};

/* ── Translation groups ────────────────────────────────────── */

export const translationGroupApi = {
  follow(slug: string): Promise<{ groupSlug: string; isFollowed: boolean }> {
    return request(`/api/translation-groups/${encodeURIComponent(slug)}/follow`, {
      method: 'POST',
    });
  },

  unfollow(slug: string): Promise<{ groupSlug: string; isFollowed: boolean }> {
    return request(`/api/translation-groups/${encodeURIComponent(slug)}/follow`, {
      method: 'DELETE',
    });
  },
};

export { API_BASE_URL };