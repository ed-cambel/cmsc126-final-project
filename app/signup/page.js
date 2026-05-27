// signup page - contains form for users to create an account
// redirects from login page, redirects to login page after submission
// can only be viewed by guest

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ChevronLeftIcon } from '@heroicons/react/16/solid';
import Link from 'next/link';

export default function SignupPage() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    college: '',
    degreeProgram: '',
    yearLevel: '',
    password: '',
    confirmPassword: '',
  });

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSignup(e) {
    e.preventDefault();

    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      // VALIDATION
      if (!formData.email.endsWith('@up.edu.ph')) {
        throw new Error('Only UP email addresses are allowed.');
      }

      if (formData.password.length < 8) {
        throw new Error('Password must be at least 8 characters.');
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match.');
      }

      // SIGN UP
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      const user = data.user;

      if (!user) throw new Error("No user returned");

      // INSERT PROFILE USING FORM DATA
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          username: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          college: formData.college,
          degree_program: formData.degreeProgram,
          year_level: formData.yearLevel,
        });

      if (profileError) throw profileError;

      setSuccessMsg('Account created successfully!');

      setTimeout(() => {
        router.push('/login');
        router.refresh();
      }, 1500);

    } catch (err) {
      setErrorMsg(err.message);
    }

    setLoading(false);
  }

  async function handleGoogleSignup() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setErrorMsg(error.message);
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#F5F2EA] flex flex-col items-center justify-center font-sans relative py-20 px-4">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 pointer-events-none"
        style={{ backgroundImage: "url('/images/map_bg.jpg')" }}
      />

      {/* Top Header */}
      <header className="absolute top-0 left-0 w-full flex items-center px-6 py-3 bg-[#D4CCBA] border-b-3 border-[#0F2D1C] shrink-0 z-20">
        <button
          className="flex items-center gap-1 text-sm font-medium text-[#0F2D1C] hover:text-[#C4811A] transition"
          onClick={() => router.push('/')}
        >
          <ChevronLeftIcon className="w-5 h-5" /> BACK TO MAP
        </button>

        <h1 className="text-[24px] font-bold text-[#0F2D1C] absolute left-1/2 -translate-x-1/2 uppercase tracking-wider">
          SIGN UP
        </h1>
      </header>

      {/* Main Sign Up Page */}
      <main className="w-full max-w-[450px] bg-[#0F2D1C] border border-[#1E4A2A] rounded-xl p-8 shadow-2xl flex flex-col gap-5 z-10 mt-12">

        {/* Active Tab State Layout */}
        <div className="flex w-full border border-[#1E4A2A] rounded-lg overflow-hidden shrink-0">
          <div className="flex-1 text-center py-2 text-xs font-black bg-[#1E4A2A] text-[#CFA000] tracking-widest uppercase">
            CREATE ACCOUNT
          </div>
        </div>

        {/* Top Button - Google OAuth sign up */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          className="w-full h-11 flex items-center justify-center gap-2 text-xs font-bold rounded-lg bg-[#F5F2EA] text-[#0F2D1C] hover:bg-white transition tracking-widest border border-[#D4CCBA]"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          SIGN UP VIA UP MAIL
        </button>

        {/* Registration Form */}
        <form className="flex flex-col gap-3.5" onSubmit={handleSignup}>

          {/* Divider between Google and manual sign up */}
          <div className="relative flex items-center justify-center py-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dashed border-[#1E4A2A]"></div>
            </div>
            <span className="relative px-3 text-[10px] font-black tracking-widest bg-[#0F2D1C] text-[#8FBB9E]">OR SIGN UP MANUALLY</span>
          </div>

          {/* First Name & Last Name */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#CFA000] uppercase tracking-widest">First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="Juan"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full h-10 px-3 text-sm rounded-lg border border-[#1E4A2A] outline-none focus:border-[#CFA000] bg-[#1E4A2A] text-[#F5F2EA] placeholder-[#8FBB9E] transition"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#CFA000] uppercase tracking-widest">Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Dela Cruz"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full h-10 px-3 text-sm rounded-lg border border-[#1E4A2A] outline-none focus:border-[#CFA000] bg-[#1E4A2A] text-[#F5F2EA] placeholder-[#8FBB9E] transition"
              />
            </div>
          </div>

          {/* College */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#CFA000] uppercase tracking-widest">College</label>
            <input
              type="text"
              name="college"
              placeholder="e.g. CS / COE"
              value={formData.college}
              onChange={handleChange}
              required
              className="w-full h-10 px-3 text-sm rounded-lg border border-[#1E4A2A] outline-none focus:border-[#CFA000] bg-[#1E4A2A] text-[#F5F2EA] placeholder-[#8FBB9E] transition"
            />
          </div>

          {/* Degree & Year Level */}
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2 flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#CFA000] uppercase tracking-widest">Degree Program</label>
              <input
                type="text"
                name="degreeProgram"
                placeholder="e.g. BSCS"
                value={formData.degreeProgram}
                onChange={handleChange}
                required
                className="w-full h-10 px-3 text-sm rounded-lg border border-[#1E4A2A] outline-none focus:border-[#CFA000] bg-[#1E4A2A] text-[#F5F2EA] placeholder-[#8FBB9E] transition"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#CFA000] uppercase tracking-widest">Year Level</label>
              <input
                type="text"
                name="yearLevel"
                placeholder="e.g. 1"
                value={formData.yearLevel}
                onChange={handleChange}
                required
                className="w-full h-10 px-3 text-sm rounded-lg border border-[#1E4A2A] outline-none focus:border-[#CFA000] bg-[#1E4A2A] text-[#F5F2EA] placeholder-[#8FBB9E] transition"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#CFA000] uppercase tracking-widest">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="e.g. juandelacruz@up.edu.ph"
              value={formData.email}
              onChange={handleChange}
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
              name="password"
              placeholder="••••••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full h-10 px-3 text-sm rounded-lg border border-[#1E4A2A] outline-none focus:border-[#CFA000] bg-[#1E4A2A] text-[#F5F2EA] placeholder-[#8FBB9E] transition"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#CFA000] uppercase tracking-widest">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="••••••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full h-10 px-3 text-sm rounded-lg border border-[#1E4A2A] outline-none focus:border-[#CFA000] bg-[#1E4A2A] text-[#F5F2EA] placeholder-[#8FBB9E] transition"
            />
          </div>

          {/* Notification Text Output layers */}
          {errorMsg && (
            <p className="text-xs font-semibold text-[#B33A1A] bg-[#B33A1A]/10 border border-[#B33A1A]/20 px-3 py-2 rounded-lg text-center mt-1">
              {errorMsg}
            </p>
          )}

          {successMsg && (
            <p className="text-xs font-semibold text-[#1E4A2A] bg-[#8FBB9E] border border-[#2E6B3E] text-[#0F2D1C] px-3 py-2 rounded-lg text-center mt-1">
              {successMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 text-xs font-bold rounded-lg bg-[#C4811A] text-[#F5F2EA] hover:bg-[#CFA000] hover:text-[#0F2D1C] transition uppercase tracking-widest disabled:opacity-50 mt-2"
          >
            {loading ? 'SIGNING UP...' : 'REGISTER'}
          </button>
        </form>

        {/* Divider decorative element */}
        <div className="relative flex items-center justify-center py-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-dashed border-[#1E4A2A]"></div>
          </div>
          <span className="relative px-3 text-[10px] font-black tracking-widest bg-[#0F2D1C] text-[#8FBB9E]">ALREADY REGISTERED?</span>
        </div>

        {/* Navigation link block */}
        <div className="text-center">
          <Link
            href="/login"
            className="text-xs text-[#CFA000] hover:text-[#F5F2EA] font-semibold inline-block tracking-wide transition group"
          >
            Have an account? <span className="underline underline-offset-2 group-hover:no-underline">Log in here</span> &rarr;
          </Link>
        </div>

      </main>
    </div>
  );
}