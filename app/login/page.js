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
