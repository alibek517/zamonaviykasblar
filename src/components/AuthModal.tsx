import { type FormEvent, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  KeyRound,
  LogIn,
  ShieldCheck,
  Store,
  UserCheck,
  UserPlus,
  X,
  AlertCircle,
} from 'lucide-react';
import type { UserAccount, UserRole } from '../domain/products';

interface AuthModalProps {
  readonly isOpen: boolean;
  readonly users: readonly UserAccount[];
  readonly onClose: () => void;
  readonly onLoginSuccess: (user: UserAccount) => void;
  readonly onRegisterUser: (newUser: UserAccount) => void;
}

export function AuthModal({
  isOpen,
  users,
  onClose,
  onLoginSuccess,
  onRegisterUser,
}: AuthModalProps) {
  const prefersReducedMotion = useReducedMotion();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState<UserRole>('mijoz');
  const [error, setError] = useState('');

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanUser || !cleanPass) {
      setError('Login va parolni kiriting.');
      return;
    }

    const matched = users.find(
      (u) => u.username.toLowerCase() === cleanUser && u.password === cleanPass
    );

    if (!matched) {
      setError(
        'Login yoki parol noto‘g‘ri! Pastdagi tayyor profil tugmalaridan birini bosishingiz ham mumkin.'
      );
      return;
    }

    onLoginSuccess(matched);
    onClose();
  };

  const handleRegister = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const cleanName = fullName.trim();
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (cleanName.length < 2) {
      setError('Ism va familiyangizni to‘liq kiriting.');
      return;
    }
    if (cleanUser.length < 3) {
      setError('Login kamida 3 ta belgidan iborat bo‘lishi kerak.');
      return;
    }
    if (cleanPass.length < 3) {
      setError('Parol kamida 3 ta belgidan iborat bo‘lishi kerak.');
      return;
    }

    const exists = users.some((u) => u.username.toLowerCase() === cleanUser);
    if (exists) {
      setError('Ushbu login band. Boshqa login tanlang.');
      return;
    }

    const created: UserAccount = {
      id: `u-${Date.now()}`,
      username: cleanUser,
      password: cleanPass,
      fullName: cleanName,
      role,
      company:
        company.trim() ||
        (role === 'sotuvchi'
          ? 'Yangi Ulgurji Ta’minotchi'
          : role === 'admin'
            ? 'Platforma Boshqaruvi'
            : 'Ulgurji Xaridor'),
      phone: '+998 90 000 00 00',
    };

    onRegisterUser(created);
    onLoginSuccess(created);
    onClose();
  };

  const handleQuickDemoLogin = (targetRole: UserRole) => {
    const found = users.find((u) => u.role === targetRole);
    if (found) {
      setUsername(found.username);
      setPassword(found.password);
      setError('');
      onLoginSuccess(found);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-2 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-modal-title"
          data-testid="auth-modal"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 bg-ink/70 backdrop-blur-sm"
          />

          <motion.div
            initial={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 0, scale: 0.92, y: 18 }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.95, y: 10 }
            }
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            className="relative z-10 my-auto w-full max-w-md min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl dark:border-slate-700 dark:bg-paper-surface sm:rounded-3xl sm:p-6"
          >
            {/* Yopish tugmasi */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Oyna yopish"
              className="absolute right-2.5 top-2.5 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-paper text-slate-600 transition-colors hover:border-ink hover:text-ink dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 sm:right-4 sm:top-4"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>

            <div className="pr-8">
              <span className="inline-flex items-center gap-1 rounded-full bg-ink-primary/10 px-2.5 py-0.5 font-mono text-[11px] font-bold text-ink-primary dark:bg-blue-500/20 dark:text-blue-300">
                <KeyRound className="h-3 w-3" aria-hidden="true" />
                <span>3 xil rol tizimi</span>
              </span>
              <h2
                id="auth-modal-title"
                className="mt-1 break-words text-lg font-extrabold text-ink dark:text-white sm:text-2xl"
              >
                {mode === 'login'
                  ? 'Platformaga kirish'
                  : 'Yangi hisob ochish'}
              </h2>
              <p className="mt-0.5 break-words text-xs text-slate-600 dark:text-slate-400">
                Mijoz, Sotuvchi yoki Admin sifatida tizimga kiring
              </p>
            </div>

            {/* Kirish / Ro'yxatdan o'tish tablari */}
            <div className="mt-3 grid grid-cols-2 gap-1 rounded-xl bg-paper p-1 dark:bg-slate-900">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-colors ${
                  mode === 'login'
                    ? 'bg-ink-primary text-white shadow-sm dark:bg-blue-600'
                    : 'text-slate-600 hover:text-ink dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                <LogIn className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">Kirish</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError('');
                }}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-colors ${
                  mode === 'register'
                    ? 'bg-ink-primary text-white shadow-sm dark:bg-blue-600'
                    : 'text-slate-600 hover:text-ink dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                <UserPlus className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">Ro‘yxatdan o‘tish</span>
              </button>
            </div>

            {/* Tezkor 1-klik rol orqali kirish */}
            <div className="mt-3 rounded-xl border border-slate-200 bg-paper/70 p-2.5 dark:border-slate-700/80 dark:bg-slate-900/70">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                1-klik bilan tayyor hisoblarga kirish:
              </p>
              <div className="grid grid-cols-1 gap-1.5 min-[320px]:grid-cols-3">
                <button
                  type="button"
                  data-testid="quick-login-admin"
                  onClick={() => handleQuickDemoLogin('admin')}
                  className="flex flex-col items-center justify-center rounded-lg border border-purple-300 bg-purple-50/90 p-2 text-center transition-transform hover:-translate-y-0.5 hover:border-purple-500 dark:border-purple-800 dark:bg-purple-950/50"
                >
                  <ShieldCheck className="h-4 w-4 text-purple-700 dark:text-purple-300" />
                  <span className="mt-0.5 text-xs font-extrabold text-purple-950 dark:text-purple-200">
                    Admin
                  </span>
                  <span className="font-mono text-[10px] text-purple-700 dark:text-purple-400">
                    admin / 123
                  </span>
                </button>

                <button
                  type="button"
                  data-testid="quick-login-seller"
                  onClick={() => handleQuickDemoLogin('sotuvchi')}
                  className="flex flex-col items-center justify-center rounded-lg border border-amber-300 bg-amber-50/90 p-2 text-center transition-transform hover:-translate-y-0.5 hover:border-amber-500 dark:border-amber-800 dark:bg-amber-950/50"
                >
                  <Store className="h-4 w-4 text-amber-700 dark:text-amber-300" />
                  <span className="mt-0.5 text-xs font-extrabold text-amber-950 dark:text-amber-200">
                    Sotuvchi
                  </span>
                  <span className="font-mono text-[10px] text-amber-700 dark:text-amber-400">
                    sotuvchi / 123
                  </span>
                </button>

                <button
                  type="button"
                  data-testid="quick-login-customer"
                  onClick={() => handleQuickDemoLogin('mijoz')}
                  className="flex flex-col items-center justify-center rounded-lg border border-lime-300 bg-lime-50/90 p-2 text-center transition-transform hover:-translate-y-0.5 hover:border-lime-500 dark:border-lime-800 dark:bg-lime-950/50"
                >
                  <UserCheck className="h-4 w-4 text-lime-700 dark:text-lime-300" />
                  <span className="mt-0.5 text-xs font-extrabold text-lime-950 dark:text-lime-200">
                    Mijoz
                  </span>
                  <span className="font-mono text-[10px] text-lime-700 dark:text-lime-400">
                    mijoz / 123
                  </span>
                </button>
              </div>
            </div>

            {/* Login yoki Register formasi */}
            <form
              onSubmit={mode === 'login' ? handleLogin : handleRegister}
              className="mt-3 space-y-3"
            >
              {mode === 'register' && (
                <>
                  <div>
                    <label
                      htmlFor="auth-fullname"
                      className="block text-xs font-bold text-ink dark:text-slate-200"
                    >
                      Ism va familiya *
                    </label>
                    <input
                      id="auth-fullname"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Masalan: Jasur Toshmatov"
                      className="mt-1 block w-full rounded-xl border border-slate-300 bg-paper px-3 py-2 text-xs font-semibold text-ink focus:border-ink-primary focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white sm:text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-2 min-[340px]:grid-cols-2">
                    <div>
                      <label
                        htmlFor="auth-role"
                        className="block text-xs font-bold text-ink dark:text-slate-200"
                      >
                        Rolni tanlang *
                      </label>
                      <select
                        id="auth-role"
                        value={role}
                        onChange={(e) => setRole(e.target.value as UserRole)}
                        className="mt-1 block w-full rounded-xl border border-slate-300 bg-paper px-2.5 py-2 text-xs font-bold text-ink focus:border-ink-primary focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white sm:text-sm"
                      >
                        <option value="mijoz">Mijoz (Xaridor)</option>
                        <option value="sotuvchi">Sotuvchi (Ta’minotchi)</option>
                        <option value="admin">Admin (Boshqaruvchi)</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="auth-company"
                        className="block text-xs font-bold text-ink dark:text-slate-200"
                      >
                        Tashkilot / Do‘kon
                      </label>
                      <input
                        id="auth-company"
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Masalan: Baraka Savdo"
                        className="mt-1 block w-full rounded-xl border border-slate-300 bg-paper px-3 py-2 text-xs font-semibold text-ink focus:border-ink-primary focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white sm:text-sm"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label
                  htmlFor="auth-username"
                  className="block text-xs font-bold text-ink dark:text-slate-200"
                >
                  Login *
                </label>
                <input
                  id="auth-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin, sotuvchi yoki mijoz"
                  className="mt-1 block w-full rounded-xl border border-slate-300 bg-paper px-3 py-2 text-xs font-semibold text-ink focus:border-ink-primary focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="auth-password"
                  className="block text-xs font-bold text-ink dark:text-slate-200"
                >
                  Parol *
                </label>
                <input
                  id="auth-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Parol (standart: 123)"
                  className="mt-1 block w-full rounded-xl border border-slate-300 bg-paper px-3 py-2 text-xs font-semibold text-ink focus:border-ink-primary focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white sm:text-sm"
                />
              </div>

              {error && (
                <p
                  role="alert"
                  className="flex items-start gap-1.5 rounded-xl bg-red-50 p-2.5 text-xs font-semibold text-red-600 dark:bg-red-950/40 dark:text-red-300"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </p>
              )}

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink-primary px-4 py-2.5 text-xs font-extrabold text-white shadow-md transition-colors hover:bg-ink dark:bg-blue-600 dark:hover:bg-blue-500 sm:py-3 sm:text-sm"
              >
                {mode === 'login' ? (
                  <>
                    <LogIn className="h-4 w-4 shrink-0" />
                    <span>Tizimga kirish</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 shrink-0" />
                    <span>Ro‘yxatdan o‘tish va kirish</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
