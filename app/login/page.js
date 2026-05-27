// login page - can log in or continue as guest
// redirects from main page, can redirect to main page or sign up page
// can be viewed by guest or user

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ChevronLeftIcon } from '@heroicons/react/16/solid';
import Link from 'next/link';

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  async function handleLogin(e) {
    e.preventDefault();

    setLoading(true);
    setErrorMsg('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    // redirect after successful login
    router.push('/');
  }

  async function handleGoogleLogin() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) setErrorMsg(error.message);
  }

  function continueAsGuest() {
    router.push('/');
  }

  return (
    <div className="min-h-screen w-full bg-[#F5F2EA] flex flex-col font-sans">

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 pointer-events-none"
        style={{ backgroundImage: "url('/images/map_bg.jpg')" }}
      />

      {/* Header */}
      <header className="relative w-full flex items-center px-6 py-3 bg-[#D4CCBA] border-b-3 border-[#0F2D1C] shrink-0 z-10">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-1 text-sm font-medium text-[#0F2D1C] hover:text-[#C4811A] transition"
        >
          <ChevronLeftIcon className="w-5 h-5" /> BACK TO MAP
        </button>

        <h1 className="text-[24px] font-bold text-[#0F2D1C] absolute left-1/2 -translate-x-1/2 uppercase tracking-wider">
          LOGIN
        </h1>
      </header>

      {/* Main Login Card Wrapper */}
      <div className="flex-1 flex items-center justify-center p-4 z-10">
        <main className="w-full max-w-[450px] bg-[#0F2D1C] border border-[#1E4A2A] rounded-xl p-8 shadow-2xl flex flex-col gap-5">

          {/* Active Tab State */}
          <div className="flex w-full border border-[#1E4A2A] rounded-lg overflow-hidden shrink-0">
            <div className="flex-1 text-center py-2 text-xs font-black bg-[#1E4A2A] text-[#CFA000] tracking-widest uppercase">
              LOG IN
            </div>
          </div>

          {/* Form Fields */}
          <form className="flex flex-col gap-3.5" onSubmit={handleLogin}>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#CFA000] uppercase tracking-widest">
                Email Address
              </label>
              <input
                type="email"
                placeholder="e.g. juandelacruz@up.edu.ph"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-10 px-3 text-sm rounded-lg border border-[#1E4A2A] outline-none focus:border-[#CFA000] bg-[#1E4A2A] text-[#F5F2EA] placeholder-[#8FBB9E] transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#CFA000] uppercase tracking-widest">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-10 px-3 text-sm rounded-lg border border-[#1E4A2A] outline-none focus:border-[#CFA000] bg-[#1E4A2A] text-[#F5F2EA] placeholder-[#8FBB9E] transition"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-[#D4CCBA] mt-0.5">
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="accent-[#C4811A] w-3.5 h-3.5 rounded border-[#1E4A2A]"
                />
                Remember Me
              </label>

              <Link href="/forgot-password" className="hover:text-[#CFA000] transition underline underline-offset-2">
                Forgot password?
              </Link>
            </div>

            {errorMsg && (
              <p className="text-xs font-semibold text-[#B33A1A] bg-[#B33A1A]/10 border border-[#B33A1A]/20 px-3 py-2 rounded-lg text-center">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 text-xs font-bold rounded-lg bg-[#C4811A] text-[#F5F2EA] hover:bg-[#CFA000] hover:text-[#0F2D1C] transition uppercase tracking-widest disabled:opacity-50 mt-2"
            >
              {loading ? 'LOGGING IN...' : 'LOG IN'}
            </button>
          </form>

          {/* Divider line */}
          <div className="relative flex items-center justify-center py-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dashed border-[#1E4A2A]"></div>
            </div>
            <span className="relative px-3 text-[10px] font-black tracking-widest bg-[#0F2D1C] text-[#8FBB9E]">OR</span>
          </div>

          {/* Secondary Action Block */}
          <div className="flex flex-col gap-3 text-center">
            {/* Google sign-in */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full h-11 flex items-center justify-center gap-2 text-xs font-bold rounded-lg bg-[#F5F2EA] text-[#0F2D1C] hover:bg-white transition tracking-widest border border-[#D4CCBA]"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              LOG IN WITH UP MAIL
            </button>

            <button
              onClick={continueAsGuest}
              className="w-full h-11 text-xs font-bold rounded-lg border-2 border-[#1E4A2A] text-[#D4CCBA] hover:bg-[#1E4A2A] hover:text-[#F5F2EA] transition uppercase tracking-widest"
            >
              CONTINUE AS GUEST
            </button>

            <p className="text-[10px] text-[#8FBB9E] leading-normal italic px-2">
              Guests can view & search but cannot rate, review, or add spots.
            </p>

            <Link
              href="/signup"
              className="text-xs text-[#CFA000] hover:text-[#F5F2EA] font-semibold mt-2 inline-block tracking-wide transition group"
            >
              No account? <span className="underline underline-offset-2 group-hover:no-underline">Sign up</span> &rarr;
            </Link>
          </div>

        </main>
      </div>
    </div>
  );
}
