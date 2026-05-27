'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export default function EditProfilePage() {
    const router = useRouter();
    
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Form inputs state
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [college, setCollege] = useState('');
    const [degreeProgram, setDegreeProgram] = useState('');
    const [yearLevel, setYearLevel] = useState('');

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    useEffect(() => {
        const fetchCurrentUserData = async () => {
            // Check auth status
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError || !user) {
                router.push('/login');
                return;
            }

            setEmail(user.email || '');

            // Fetch custom profile details
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profileData) {
                setUsername(profileData.username || '');
                setFirstName(profileData.first_name || '');
                setLastName(profileData.last_name || '');
                setCollege(profileData.college || '');
                setDegreeProgram(profileData.degree_program || '');
                setYearLevel(profileData.year_level || '');
            }

            setLoading(false);
        };

        fetchCurrentUserData();
    }, [supabase, router]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage({ type: '', text: '' });

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No authenticated user found.');

            // Update Auth Email/Password if modified
            if (email !== user.email) {
                const { error: emailError } = await supabase.auth.updateUser({ email });
                if (emailError) throw emailError;
            }

            if (password.trim().length > 0) {
                if (password.length < 6) {
                    throw new Error('Password must be at least 6 characters long.');
                }
                const { error: passwordError } = await supabase.auth.updateUser({ password });
                if (passwordError) throw passwordError;
            }

            // Update data fields
            const { error: tableError } = await supabase
                .from('profiles')
                .update({
                    username: username,
                    first_name: firstName,
                    last_name: lastName,
                    college: college,
                    degree_program: degreeProgram,
                    year_level: yearLevel
                })
                .eq('id', user.id);

            if (tableError) throw tableError;

            setMessage({ type: 'success', text: 'Profile updated successfully. Redirecting...' });
            
            setTimeout(() => {
                router.push('/profile');
            }, 1500);

        } catch (error) {
            setMessage({ type: 'error', text: error.message });
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-sm text-gray-400 animate-pulse">Loading settings canvas...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header section */}
            <div className="relative w-full flex items-center px-4 py-2.5 bg-white border-b border-gray-200">
                <Link href="/profile" className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700">
                    Cancel
                </Link>
                <h1 className="text-base font-bold absolute left-1/2 -translate-x-1/2 tracking-widest uppercase">
                    Edit Profile
                </h1>
            </div>

            {/* Form layout wrapper */}
            <div className="max-w-md mx-auto mt-8 px-4 pb-24">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    
                    {message.text && (
                        <div className={`mb-4 p-3 rounded-lg text-xs font-medium border ${
                            message.type === 'success' 
                                ? 'bg-green-50 border-green-200 text-green-700' 
                                : 'bg-red-50 border-red-200 text-red-700'
                        }`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                        
                        {/* Profile Details section */}
                        <div>
                            <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase block mb-3">
                                Profile Details
                            </span>
                            
                            <div className="flex flex-col gap-3">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider block mb-1">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full px-3 py-2 text-sm text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-700 bg-gray-50"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider block mb-1">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className="w-full px-3 py-2 text-sm text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-700 bg-gray-50"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider block mb-1">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            className="w-full px-3 py-2 text-sm text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-700 bg-gray-50"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-gray-100 my-2" />

                        {/* Academic Information section */}
                        <div>
                            <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase block mb-3">
                                Academic Information
                            </span>

                            <div className="flex flex-col gap-3">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider block mb-1">
                                        College / Campus
                                    </label>
                                    <input
                                        type="text"
                                        value={college}
                                        onChange={(e) => setCollege(e.target.value)}
                                        className="w-full px-3 py-2 text-sm text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-700 bg-gray-50"
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div className="col-span-2">
                                        <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider block mb-1">
                                            Degree Program
                                        </label>
                                        <input
                                            type="text"
                                            value={degreeProgram}
                                            onChange={(e) => setDegreeProgram(e.target.value)}
                                            className="w-full px-3 py-2 text-sm text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-700 bg-gray-50"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider block mb-1">
                                            Year Level
                                        </label>
                                        <input
                                            type="text"
                                            value={yearLevel}
                                            onChange={(e) => setYearLevel(e.target.value)}
                                            className="w-full px-3 py-2 text-sm text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-700 bg-gray-50"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-gray-100 my-2" />

                        {/* Account credentials section */}
                        <div>
                            <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase block mb-3">
                                Security Credentials
                            </span>

                            <div className="flex flex-col gap-3">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider block mb-1">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-3 py-2 text-sm text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-700 bg-gray-50"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider block mb-1">
                                        Change Password
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="Leave blank to keep old password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-3 py-2 text-sm text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-700 bg-gray-50 placeholder-gray-300"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Actions */}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="mt-4 w-full py-2.5 text-xs font-bold rounded-xl bg-gray-800 text-white hover:bg-gray-700 transition uppercase tracking-widest disabled:opacity-50"
                        >
                            {submitting ? 'Saving changes...' : 'Save Profile Settings'}
                        </button>
                    </form>

                </div>
            </div>
        </div>
    );
}