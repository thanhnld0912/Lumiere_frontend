import React, { useState, useEffect } from 'react';
import { Novel, Chapter, ReaderSettings } from '../types';

interface ReaderViewProps {
  novel: Novel;
  chapterId?: string;
  onBack: () => void;
  onNavigateChapter: (nextChapterId: string) => void;
}

export const ReaderView: React.FC<ReaderViewProps> = ({
  novel,
  chapterId,
  onBack,
  onNavigateChapter,
}) => {
  const currentChapter: Chapter =
    novel.chapters.find((c) => c.id === chapterId) ||
    novel.chapters[0] || {
      id: 'ch-default',
      number: 1,
      title: 'Chapter 1',
      date: 'Today',
      isRead: false,
    };

  // Find prev/next chapter
  const currentIndex = novel.chapters.findIndex((c) => c.id === currentChapter.id);
  const prevChapter = currentIndex > 0 ? novel.chapters[currentIndex - 1] : null;
  const nextChapter =
    currentIndex < novel.chapters.length - 1 ? novel.chapters[currentIndex + 1] : null;

  // Settings State
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<ReaderSettings>({
    fontFamily: 'serif',
    fontSize: 20,
    lineHeight: 1.8,
    theme: 'dark',
  });

  // Apply Theme class to body tag when theme changes
  useEffect(() => {
    document.body.classList.remove('sepia-mode', 'amoled-mode');
    if (settings.theme === 'sepia') {
      document.body.classList.add('sepia-mode');
    } else if (settings.theme === 'amoled') {
      document.body.classList.add('amoled-mode');
    }
    return () => {
      document.body.classList.remove('sepia-mode', 'amoled-mode');
    };
  }, [settings.theme]);

  // Nội dung chương, lấy từ GET /api/novels/:slug/chapters/:chapterSlug.
  //
  // Trước đây chỗ này có một mảng đoạn văn hardcode làm nội dung dự phòng, nên
  // MỌI chương chưa có text đều hiển thị cùng một trích đoạn — tức là nội dung
  // sai gắn dưới tên chương khác. Giờ thay bằng trạng thái rỗng trung thực.
  const paragraphs = currentChapter.content ?? [];
  const hasContent = paragraphs.length > 0;

  // Tách riêng để dùng lại được ở cả hai nhánh có/không có nội dung —
  // một chương có thể có tranh minh hoạ mà chưa có phần text.
  const illustration = currentChapter.illustrationUrl ? (
    <div className="py-8 flex justify-center">
      <div className="w-full h-[380px] md:h-[440px] rounded-xl overflow-hidden shadow-2xl relative group border border-white/10">
        <img
          src={currentChapter.illustrationUrl}
          alt="Chapter Illustration"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      </div>
    </div>
  ) : null;

  return (
    <div className="min-h-screen relative pb-32 animate-in fade-in duration-300">
      {/* Top Bar Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#101319]/80 backdrop-blur-xl border-b border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
        <div className="flex justify-between items-center px-5 md:px-16 h-16 w-full max-w-[1440px] mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="material-symbols-outlined text-[#cabeff] hover:scale-105 transition-transform active:scale-95 cursor-pointer"
              title="Back"
            >
              arrow_back
            </button>
            <h1 className="font-display text-2xl font-bold tracking-tight text-[#cabeff]">
              Lumiere
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <span className="hidden md:block font-label text-sm text-[#c9c4d8] font-medium truncate max-w-xs">
              Chapter {currentChapter.number}: {currentChapter.title}
            </span>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="material-symbols-outlined text-[#cabeff] hover:scale-105 transition-transform active:scale-95 cursor-pointer p-1 rounded-full hover:bg-white/5"
              title="Reading Settings"
            >
              settings
            </button>
          </div>
        </div>
      </header>

      {/* Main Reading Canvas */}
      <main className="pt-28 pb-40 px-5 md:px-0">
        <article
          className={`max-w-[680px] mx-auto space-y-8 ${
            settings.fontFamily === 'serif' ? 'font-reading-serif' : 'font-reading-sans'
          } text-[#e1e2eb]/90 transition-all duration-200`}
          style={{
            fontSize: `${settings.fontSize}px`,
            lineHeight: settings.lineHeight,
          }}
        >
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-[#e1e2eb] mb-10 text-center md:text-left">
            Chapter {currentChapter.number}: {currentChapter.title}
          </h2>

          {hasContent ? (
            <>
              {/* Đoạn mở đầu, rồi tranh minh hoạ, rồi phần còn lại */}
              <p>{paragraphs[0]}</p>

              {illustration}

              {paragraphs.slice(1).map((p, index) => (
                <p key={index}>{p}</p>
              ))}
            </>
          ) : (
            <>
              {illustration}

              {/*
                Trạng thái rỗng. Cỡ chữ ở đây đặt bằng class Tailwind nên không
                bị ảnh hưởng bởi fontSize/lineHeight inline của reader settings.
              */}
              <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
                <span className="material-symbols-outlined text-[#cabeff]/40 text-5xl leading-none">
                  auto_stories
                </span>
                <h3 className="font-headline text-xl font-bold text-[#e1e2eb] leading-snug">
                  Chapter content not available yet
                </h3>
                <p className="font-body text-sm text-[#c9c4d8] max-w-sm leading-relaxed">
                  This chapter has been catalogued, but its text hasn't been synchronised
                  from the translation group yet. It will appear here after the next
                  library sync.
                </p>
              </div>
            </>
          )}
        </article>
      </main>

      {/* Floating Prev / Next Navigation Controls */}
      <nav className="fixed bottom-16 left-0 w-full px-5 md:px-16 pointer-events-none flex justify-between items-center z-40 max-w-[1440px] left-1/2 -translate-x-1/2">
        <button
          disabled={!prevChapter}
          onClick={() => prevChapter && onNavigateChapter(prevChapter.id)}
          className={`pointer-events-auto glass-panel border border-white/10 p-4 rounded-full text-[#cabeff] transition-all active:scale-90 shadow-lg flex items-center gap-2 group cursor-pointer ${
            !prevChapter ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#cabeff]/20'
          }`}
        >
          <span className="material-symbols-outlined">chevron_left</span>
          <span className="hidden md:block font-label text-sm pr-2">Previous Chapter</span>
        </button>

        <button
          disabled={!nextChapter}
          onClick={() => nextChapter && onNavigateChapter(nextChapter.id)}
          className={`pointer-events-auto glass-panel border border-white/10 p-4 rounded-full text-[#cabeff] transition-all active:scale-90 shadow-lg flex items-center gap-2 group cursor-pointer ${
            !nextChapter ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#cabeff]/20'
          }`}
        >
          <span className="hidden md:block font-label text-sm pl-2">Next Chapter</span>
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </nav>

      {/* Bottom Reading Progress Bar */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-[#101319]/80 backdrop-blur-xl border-t border-white/10 px-5 h-12 flex items-center justify-between">
        <div className="flex-1 max-w-md bg-white/10 h-1 rounded-full overflow-hidden mr-6">
          <div className="bg-[#cabeff] h-full w-[45%] shadow-[0_0_8px_rgba(202,190,255,0.8)]"></div>
        </div>
        <div className="flex items-center gap-3 font-label text-xs text-[#c9c4d8]">
          <span>45% Complete</span>
          <span className="w-1 h-1 bg-[#c9c4d8] rounded-full"></span>
          <span>12 mins left in chapter</span>
        </div>
      </div>

      {/* Reading Customization Bottom Sheet / Overlay */}
      {showSettings && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 flex items-end justify-center"
          onClick={() => setShowSettings(false)}
        >
          <div
            className="w-full max-w-xl bg-[#272a31]/95 backdrop-blur-2xl rounded-t-[32px] border-t border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.6)] p-6 md:p-8 pb-12 transition-transform animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Handle */}
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6"></div>

            <h3 className="font-headline text-2xl font-bold text-[#cabeff] mb-6">
              Reading Settings
            </h3>

            <div className="space-y-6">
              {/* Font Selection */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setSettings({ ...settings, fontFamily: 'serif' })}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    settings.fontFamily === 'serif'
                      ? 'border-[#cabeff] bg-[#cabeff]/15 text-[#cabeff]'
                      : 'border-transparent bg-white/5 text-[#c9c4d8] hover:bg-white/10'
                  }`}
                >
                  <span className="font-reading-serif text-2xl">Aa</span>
                  <span className="font-label text-xs mt-2">Serif</span>
                </button>

                <button
                  onClick={() => setSettings({ ...settings, fontFamily: 'sans' })}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    settings.fontFamily === 'sans'
                      ? 'border-[#cabeff] bg-[#cabeff]/15 text-[#cabeff]'
                      : 'border-transparent bg-white/5 text-[#c9c4d8] hover:bg-white/10'
                  }`}
                >
                  <span className="font-reading-sans text-2xl">Aa</span>
                  <span className="font-label text-xs mt-2">Sans</span>
                </button>
              </div>

              {/* Sliders */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between font-label text-xs text-[#c9c4d8]">
                    <span>Text Size</span>
                    <span>{settings.fontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="14"
                    max="32"
                    value={settings.fontSize}
                    onChange={(e) =>
                      setSettings({ ...settings, fontSize: Number(e.target.value) })
                    }
                    className="w-full accent-[#cabeff] cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between font-label text-xs text-[#c9c4d8]">
                    <span>Line Height</span>
                    <span>{settings.lineHeight}</span>
                  </div>
                  <input
                    type="range"
                    min="1.2"
                    max="2.4"
                    step="0.1"
                    value={settings.lineHeight}
                    onChange={(e) =>
                      setSettings({ ...settings, lineHeight: Number(e.target.value) })
                    }
                    className="w-full accent-[#cabeff] cursor-pointer"
                  />
                </div>
              </div>

              {/* Background Themes */}
              <div className="space-y-2">
                <span className="font-label text-xs text-[#c9c4d8]">Background Theme</span>
                <div className="flex justify-between gap-3">
                  <button
                    onClick={() => setSettings({ ...settings, theme: 'dark' })}
                    className={`flex-1 h-12 rounded-lg bg-[#101319] border border-white/20 flex items-center justify-center cursor-pointer ${
                      settings.theme === 'dark' ? 'ring-2 ring-[#cabeff]' : ''
                    }`}
                  >
                    <div className="w-4 h-4 bg-white/20 rounded-full"></div>
                  </button>

                  <button
                    onClick={() => setSettings({ ...settings, theme: 'sepia' })}
                    className={`flex-1 h-12 rounded-lg bg-[#f4ecd8] border border-black/10 flex items-center justify-center cursor-pointer ${
                      settings.theme === 'sepia' ? 'ring-2 ring-[#cabeff]' : ''
                    }`}
                  >
                    <div className="w-4 h-4 bg-black/10 rounded-full"></div>
                  </button>

                  <button
                    onClick={() => setSettings({ ...settings, theme: 'amoled' })}
                    className={`flex-1 h-12 rounded-lg bg-black border border-white/10 flex items-center justify-center cursor-pointer ${
                      settings.theme === 'amoled' ? 'ring-2 ring-[#cabeff]' : ''
                    }`}
                  >
                    <div className="w-4 h-4 bg-[#cabeff]/40 rounded-full"></div>
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="w-full mt-8 py-4 rounded-full bg-[#cabeff] text-[#31009a] font-bold font-label hover:scale-[1.02] active:scale-95 transition-transform shadow-[0_0_20px_rgba(202,190,255,0.3)] cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
