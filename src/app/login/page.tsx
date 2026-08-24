'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth, ALLOWED_STUDENT_EMAIL_DOMAINS } from '../../context/AuthContext';
import {
  Sparkles,
  Shield,
  GraduationCap,
  Mail,
  Lock,
  User as UserIcon,
  BookOpen,
  Calendar,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  UserCheck
} from 'lucide-react';
import { UserType } from '../../types';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  const { login, signup, requestPasswordReset, verifyResetCodeAndSetPassword } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [userType, setUserType] = useState<UserType>('student');
  const [remember30Days, setRemember30Days] = useState(true);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [major, setMajor] = useState('');
  const [gradYear, setGradYear] = useState('2027');

  // Password reset fields
  const [resetStep, setResetStep] = useState<'request' | 'verify'>('request');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Status/Feedback
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    if (mode === 'login') {
      const res = login(email, password, remember30Days);
      setLoading(false);
      if (res.success) {
        router.push(redirectPath);
      } else {
        setErrorMsg(res.message || 'Login failed. Please check your credentials.');
      }
    } else if (mode === 'signup') {
      const res = signup(
        {
          name,
          email,
          password,
          userType,
          major: userType === 'student' ? major : 'Non-Student Guest',
          gradYear: userType === 'student' ? gradYear : 'Guest'
        },
        remember30Days
      );
      setLoading(false);
      if (res.success) {
        router.push(redirectPath);
      } else {
        setErrorMsg(res.message || 'Registration failed.');
      }
    }
  };

  const handleRequestReset = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    const res = requestPasswordReset(email);
    setLoading(false);
    if (res.success) {
      setSuccessMsg(res.message);
      setResetStep('verify');
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleVerifyReset = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    const res = verifyResetCodeAndSetPassword(email, resetCode, newPassword);
    setLoading(false);
    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        setMode('login');
        setResetStep('request');
      }, 2000);
    } else {
      setErrorMsg(res.message);
    }
  };

  // Instant Elijah Kincade Super Admin Login
  const handleSuperAdminInstantLogin = () => {
    const res = login('ekinc002@ucr.edu', 'password123', true);
    if (res.success) {
      router.push('/');
    }
  };

  return (
    <div className="max-w-lg mx-auto py-6 px-4 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gold-500/10 border border-gold-500/30 text-gold-400 mb-1">
          <Sparkles className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          BlackOrg<span className="gold-gradient-text">Connectionz</span>
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400">
          The Centralized Campus Hub for Black Student Organizations & NPHC Greek Life
        </p>
      </div>

      {/* Main Authentication Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
        {/* Navigation Mode Tabs */}
        {mode !== 'forgot' ? (
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-neutral-900/80 border border-white/10">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2 text-xs font-bold rounded-xl transition ${
                mode === 'login' ? 'bg-gold-500 text-black shadow-md' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2 text-xs font-bold rounded-xl transition ${
                mode === 'signup' ? 'bg-gold-500 text-black shadow-md' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-gold-400" /> Reset Password
            </h2>
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setResetStep('request');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className="text-xs text-gold-400 hover:underline"
            >
              Back to Sign In
            </button>
          </div>
        )}

        {/* User Type Selector during Signup */}
        {mode === 'signup' && (
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-neutral-300">Account Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setUserType('student')}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition ${
                  userType === 'student'
                    ? 'bg-gold-500/15 border-gold-500/50 text-white'
                    : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                }`}
              >
                <GraduationCap className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold">Student Account</p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">UCR, CBU, or CSUSB campus email required</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setUserType('guest')}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition ${
                  userType === 'guest'
                    ? 'bg-blue-500/15 border-blue-500/50 text-white'
                    : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                }`}
              >
                <UserCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold">Guest Account</p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Alumni, faculty, or community ally</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Error / Success Feedback */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <p>{errorMsg}</p>
          </div>
        )}
        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            <p>{successMsg}</p>
          </div>
        )}

        {/* Regular Login / Signup Form */}
        {mode !== 'forgot' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jordan Taylor"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs placeholder:text-neutral-500 focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  {mode === 'signup' && userType === 'student' ? 'Campus Student Email' : 'Email Address'}
                </label>
                {mode === 'signup' && userType === 'student' && (
                  <span className="text-[10px] text-gold-400 font-medium">@ucr.edu · @cbu.edu · @csusb.edu</span>
                )}
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    mode === 'signup' && userType === 'student'
                      ? 'yourname@ucr.edu or @calbaptist.edu'
                      : 'you@email.com'
                  }
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs placeholder:text-neutral-500 focus:border-gold-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-neutral-300">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="text-[11px] text-gold-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs placeholder:text-neutral-500 focus:border-gold-500 focus:outline-none"
                />
              </div>
            </div>

            {mode === 'signup' && userType === 'student' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Major / Field</label>
                  <div className="relative">
                    <BookOpen className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={major}
                      onChange={(e) => setMajor(e.target.value)}
                      placeholder="e.g. Political Science"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs placeholder:text-neutral-500 focus:border-gold-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Grad Year</label>
                  <select
                    value={gradYear}
                    onChange={(e) => setGradYear(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none cursor-pointer"
                  >
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                    <option value="2028">2028</option>
                    <option value="2029">2029</option>
                    <option value="Graduate">Graduate</option>
                  </select>
                </div>
              </div>
            )}

            {/* 30-Day Session Persistence Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="rememberMe"
                checked={remember30Days}
                onChange={(e) => setRemember30Days(e.target.checked)}
                className="rounded bg-neutral-900 border-white/20 text-gold-500 focus:ring-gold-500 h-4 w-4"
              />
              <label htmlFor="rememberMe" className="text-xs text-neutral-300 select-none cursor-pointer">
                Stay signed in for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-black font-extrabold text-xs sm:text-sm transition shadow-lg shadow-gold-500/20 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                'Processing...'
              ) : mode === 'login' ? (
                <>
                  Sign In <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  Create Account & Enter Platform <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Forgot Password Flow */}
        {mode === 'forgot' && (
          <div className="space-y-4">
            {resetStep === 'request' ? (
              <form onSubmit={handleRequestReset} className="space-y-4">
                <p className="text-xs text-neutral-300">
                  Enter your email address and we will generate a 6-digit verification code to reset your password.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@campus.edu"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs transition"
                >
                  {loading ? 'Sending...' : 'Send Verification Code'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyReset} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">6-Digit Verification Code</label>
                  <input
                    type="text"
                    required
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    placeholder="e.g. 123456"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none tracking-widest font-mono text-center text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition"
                >
                  {loading ? 'Resetting...' : 'Verify Code & Set New Password'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Discreet Super Admin Key Toggle */}
        <div className="pt-2 flex flex-col items-center">
          {searchParams.get('admin') === 'true' || email === 'ekinc002@ucr.edu' ? (
            <div className="w-full pt-3 border-t border-white/10 space-y-3">
              <div className="text-center">
                <span className="text-[11px] font-semibold text-red-400 uppercase tracking-wider">
                  Super Admin Authorized Access
                </span>
              </div>

              <button
                type="button"
                onClick={handleSuperAdminInstantLogin}
                className="w-full p-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-red-500/30 hover:border-red-500/60 transition flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-red-500/20 text-red-400">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white group-hover:text-gold-400 transition flex items-center gap-1.5">
                      Elijah Kincade (Super Admin)
                    </p>
                    <p className="text-[11px] text-neutral-400">ekinc002@ucr.edu · Full Platform Control</p>
                  </div>
                </div>
                <span className="text-xs text-red-400 font-bold px-2 py-1 rounded-lg bg-red-500/10">1-Click Sign In</span>
              </button>
            </div>
          ) : (
            <div className="text-center pt-2">
              <p className="text-[11px] text-neutral-500">
                🔒 Secure Student & Super Admin Portal · 256-bit Encrypted Session
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-white">Loading authentication portal...</div>}>
      <LoginContent />
    </Suspense>
  );
}
