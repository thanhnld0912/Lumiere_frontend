/**
 * FILE MỚI — form đăng nhập / đăng ký tối thiểu.
 *
 * Cần thiết cho MVP: thiếu nó thì bookmark, Continue Reading, Reading History và
 * Profile đều trả 401 và ứng dụng chỉ còn là trình đọc read-only.
 *
 * Style bám theo ngôn ngữ thiết kế sẵn có (glass-panel, #cabeff, font-label…)
 * để không lệch khỏi phần còn lại của giao diện.
 */
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Mode = 'login' | 'register';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const resetFeedback = () => {
    setError(null);
    setFieldErrors({});
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    resetFeedback();
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password, displayName);
      }
      setEmail('');
      setPassword('');
      setDisplayName('');
      onClose();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        // Zod trả lỗi theo từng field — hiển thị ngay dưới ô tương ứng.
        if (err.errors.length > 0) {
          setFieldErrors(
            Object.fromEntries(err.errors.map((fieldError) => [fieldError.field, fieldError.message])),
          );
        }
      } else {
        setError('Đã có lỗi ngoài dự kiến. Vui lòng thử lại.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = () => {
    setMode((current) => (current === 'login' ? 'register' : 'login'));
    resetFeedback();
  };

  const inputClass =
    'w-full bg-[#101319] border border-white/10 rounded-xl px-4 py-3 text-[#e1e2eb] ' +
    'placeholder-[#c9c4d8]/40 focus:outline-none focus:border-[#cabeff] transition-colors font-body';

  return (
    <div
      className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-md flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="bg-[#1d2026] border border-white/10 rounded-3xl w-full max-w-md p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="material-symbols-outlined absolute top-5 right-5 text-[#c9c4d8] hover:text-white transition-colors cursor-pointer"
          title="Close"
          type="button"
        >
          close
        </button>

        <h2 className="font-display text-2xl font-bold text-[#cabeff] mb-1">
          {mode === 'login' ? 'Welcome back' : 'Join Lumiere'}
        </h2>
        <p className="font-body text-sm text-[#c9c4d8] mb-6">
          {mode === 'login'
            ? 'Sign in to sync your library, bookmarks and reading progress.'
            : 'Create an account to keep your library in sync across devices.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="space-y-1.5">
              <label htmlFor="auth-display-name" className="font-label text-xs text-[#c9c4d8]">
                Display name
              </label>
              <input
                id="auth-display-name"
                type="text"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Archivist Traveler"
                autoComplete="nickname"
                required
                className={inputClass}
              />
              {fieldErrors['displayName'] && (
                <p className="text-red-400 text-xs font-label">{fieldErrors['displayName']}</p>
              )}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="auth-email" className="font-label text-xs text-[#c9c4d8]">
              Email
            </label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="reader@lumiere.app"
              autoComplete="email"
              required
              className={inputClass}
            />
            {fieldErrors['email'] && (
              <p className="text-red-400 text-xs font-label">{fieldErrors['email']}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="auth-password" className="font-label text-xs text-[#c9c4d8]">
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={mode === 'register' ? 'At least 8 characters' : '••••••••'}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
              className={inputClass}
            />
            {fieldErrors['password'] && (
              <p className="text-red-400 text-xs font-label">{fieldErrors['password']}</p>
            )}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
              <p className="text-red-400 text-sm font-body">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#cabeff] to-[#cebdff] text-[#31009a] font-bold font-label shadow-[0_0_20px_rgba(202,190,255,0.3)] hover:scale-[1.02] active:scale-95 transition-transform cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isSubmitting
              ? 'Please wait…'
              : mode === 'login'
                ? 'Sign In'
                : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-[#c9c4d8] font-body mt-6">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={switchMode}
            type="button"
            className="text-[#cabeff] font-bold hover:underline cursor-pointer"
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
};