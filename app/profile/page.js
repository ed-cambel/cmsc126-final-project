'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { UserCircleIcon } from '@heroicons/react/24/outline';

// ── Renders star rating string ──
function StarRating({ rating }) {
    const numRating = Number(rating) || 0;
    return (
        <span className="text-xs text-gray-500">
            {'★'.repeat(Math.floor(numRating))}{'☆'.repeat(5 - Math.floor(numRating))} {numRating.toFixed(1)}
        </span>
    );
}

// ── Tag pill badge ──
function TagPill({ label }) {
    return (
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
            {label}
        </span>
    );
}

// ── Spot row used in Saved Spots and My Contributions tabs ──
function SpotRow({ spot, actionLabel, onAction }) {
    if (!spot) return null;
    const tags = spot.tags || [];
    const coverPhoto = spot.photos && spot.photos.length > 0 ? spot.photos[0].storage_url : null;

    return (
        <div className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
            {/* Image Container */}
            <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 text-xs flex-shrink-0 border border-gray-200 overflow-hidden relative">
                {coverPhoto ? (
                    <img 
                        src={coverPhoto} 
                        alt={spot.name} 
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-[10px] text-gray-400">No Image</span>
                )}
            </div>
            
            {/* Details */}
            <div className="flex-1 flex flex-col gap-1">
                <Link href={`/spot/${spot.id}`} className="text-sm font-bold text-gray-800 hover:text-gray-600 transition w-fit">
                    {spot.name}
                </Link>
                <div className="flex items-center gap-1">
                    <StarRating rating={spot.rating} />
                    <span className="text-[10px] text-gray-400">({spot.review_count || 0} Reviews)</span>
                </div>
                <div className="flex gap-1 flex-wrap mt-0.5">
                    {tags.map((tag, i) => <TagPill key={i} label={tag} />)}
                </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                    href={`/spot/${spot.id}`}
                    className="text-xs font-semibold px-3 py-1.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition"
                >
                    VIEW
                </Link>
                <button
                    onClick={() => onAction(spot.id)}
                    className={`text-xs font-semibold px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition ${actionLabel === 'REMOVE' ? 'hover:text-red-600 hover:border-red-200' : ''}`}
                >
                    {actionLabel}
                </button>
            </div>
        </div>
    );
}

// ── Review row used in My Reviews tab ──
function ReviewRow({ review }) {
    const dateStr = review.created_at 
        ? new Date(review.created_at).toLocaleDateString() 
        : 'Recently';

    const spotName = review.spots?.name || 'Unknown Spot';

    return (
        <div className="flex flex-col gap-2 py-3 border-b border-gray-100 last:border-0">
            {/* Top row: Spot Name, Rating, Date, and View Button */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {/* 1. Make the spot name a clickable link */}
                    <Link 
                        href={`/spot/${review.spot_id}`} 
                        className="text-sm font-semibold text-gray-800 hover:text-gray-600 transition"
                    >
                        {spotName}
                    </Link>
                    <StarRating rating={review.stars} /> 
                    <span className="text-[10px] text-gray-400">· {dateStr}</span>
                </div>

                {/* 2. Add a clear VIEW button to match the other tabs */}
                <Link
                    href={`/spot/${review.spot_id}`}
                    className="text-[10px] font-bold px-2 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-100 transition"
                >
                    VIEW
                </Link>
            </div>
            
            {/* Review body */}
            <p className="text-xs text-gray-500 leading-relaxed">{review.body}</p>
        </div>
    );
}

export default function ProfilePage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('saved');
    
    // ── Modal States ──
    const [showModal, setShowModal] = useState(false);
    const [selectedSpotId, setSelectedSpotId] = useState(null);

    // ── Data States ──
    const [userAuth, setUserAuth] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const [savedSpots, setSavedSpots] = useState([]);
    const [contributions, setContributions] = useState([]);
    const [reviews, setReviews] = useState([]);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            
            if (authError || !user) {
                router.push('/login');
                return;
            }

            setUserAuth(user);

            // Fetch custom profile data from public.profiles
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            setUserProfile(profileData);

            // Fetch Contributions (where added_by = user.id)
            const { data: mySpots } = await supabase
                .from('spots')
                .select('*, photos(storage_url)')
                .eq('added_by', user.id);
            setContributions(mySpots || []);

            // Fetch Reviews (Join with spots to get name)
            const { data: myReviews } = await supabase
                .from('reviews')
                .select('*, spots(name)') 
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });
            setReviews(myReviews || []);

            // Fetch Saved Spots (Join with spots table)
            const { data: savedData } = await supabase
                .from('saved_spots')
                .select('*, spots(*, photos(storage_url))')
                .eq('user_id', user.id);
            
            // Extract nested spots from join
            const formattedSavedSpots = savedData ? savedData.map(item => item.spots).filter(Boolean) : [];
            setSavedSpots(formattedSavedSpots);

            setLoading(false);
        };

        fetchData();
    }, [supabase, router]);

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            router.push('/login');
        } else {
            console.error('Error logging out:', error.message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-sm text-gray-400 animate-pulse">Loading Profile...</p>
            </div>
        );
    }

    // Use data from public.profiles table
    const email = userAuth?.email || 'No email';
    const displayUsername = userProfile?.username || email.split('@')[0];
    const fullName = userProfile?.first_name && userProfile?.last_name 
        ? `${userProfile.first_name} ${userProfile.last_name}` 
        : null;

    const TABS = [
        { id: 'saved', label: 'Saved spots', count: savedSpots.length },
        { id: 'contributions', label: 'My contributions', count: contributions.length },
        { id: 'reviews', label: 'My reviews', count: reviews.length },
    ];

    // ── Handlers for Custom Modal ──
    const handleRemoveClick = (spotId) => {
        setSelectedSpotId(spotId);
        setShowModal(true); // Open the modal
    };

    const confirmRemoveSavedSpot = async () => {
        if (!userAuth || !selectedSpotId) return;

        const { error } = await supabase
            .from('saved_spots')
            .delete()
            .eq('user_id', userAuth.id)
            .eq('spot_id', selectedSpotId);

        if (error) {
            console.error('Error removing saved spot:', error.message);
        } else {
            // Success: optimistically update UI
            setSavedSpots((prevSpots) => prevSpots.filter(spot => spot.id !== selectedSpotId));
        }

        // Close modal and reset state
        setShowModal(false);
        setSelectedSpotId(null);
    };

    const TAB_CONTENT = {
        saved: {
            title: 'Saved Spots',
            description: "Spots you've bookmarked",
            content: (
                <div>
                    {savedSpots.length === 0 ? (
                        <p className="text-xs text-gray-400 italic">No saved spots yet.</p>
                    ) : (
                        savedSpots.map(spot => (
                            <SpotRow 
                                key={spot.id} 
                                spot={spot} 
                                actionLabel="REMOVE" 
                                onAction={handleRemoveClick} // Use new handler here
                            />
                        ))
                    )}
                </div>
            ),
        },
        contributions: {
            title: 'My Contributions',
            description: "Spots you've added",
            content: (
                <div>
                    {contributions.length === 0 ? (
                        <p className="text-xs text-gray-400 italic">You haven't contributed any spots yet.</p>
                    ) : (
                        contributions.map(spot => (
                            <SpotRow key={spot.id} spot={spot} actionLabel="EDIT" onAction={(id) => console.log('Edit spot:', id)} />
                        ))
                    )}
                </div>
            ),
        },
        reviews: {
            title: 'My Reviews',
            description: "Reviews you've given",
            content: (
                <div>
                    {reviews.length === 0 ? (
                        <p className="text-xs text-gray-400 italic">You haven't written any reviews yet.</p>
                    ) : (
                        reviews.map(review => (
                            <ReviewRow key={review.id} review={review} />
                        ))
                    )}
                </div>
            ),
        },
    };

    const active = TAB_CONTENT[activeTab];

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                {/* Page header */}
                <div className="relative w-full flex items-center px-4 py-2.5 bg-white border-b border-gray-200">
                    <Link href="/" className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700">
                        ← Back to Map
                    </Link>
                    <h1 className="text-base font-bold absolute left-1/2 -translate-x-1/2 tracking-widest uppercase">
                        My Profile
                    </h1>
                </div>

                <div className="flex h-[calc(100vh-45px)]">
                    {/* ── LEFT SIDEBAR ── */}
                    <div className="w-[300px] flex-shrink-0 bg-white border-r border-gray-200 flex flex-col p-5 gap-5">
                        
                        {/* Avatar and user info */}
                        <div className="flex flex-col items-center gap-2 pt-4">
                            {userProfile?.avatar_url ? (
                                <img src={userProfile.avatar_url} alt={displayUsername} className="w-20 h-20 rounded-full object-cover border border-gray-200" />
                            ) : (
                                <UserCircleIcon className="w-20 h-20 text-gray-400" />
                            )}
                            <div className="text-md font-bold text-gray-800 tracking-wide uppercase text-center w-full truncate">
                                {displayUsername}
                            </div>
                            {fullName && (
                                <div className="text-xs text-gray-500 w-full text-center truncate font-medium">
                                    {fullName}
                                </div>
                            )}
                            <div className="text-xs text-gray-400 w-full text-center truncate">
                                {email}
                            </div>
                        </div>

                        <div className="h-px bg-gray-200 w-full" />

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { label: 'Spots added', value: contributions.length },
                                { label: 'Reviews', value: reviews.length },
                                { label: 'Saved', value: savedSpots.length },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex flex-col items-center justify-center border border-gray-200 rounded-lg py-3 gap-1">
                                    <span className="text-lg font-bold text-gray-700">{value}</span>
                                    <span className="text-[10px] text-gray-400 text-center">{label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Account tab navigation */}
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1">Account</span>
                            {TABS.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition ${activeTab === tab.id
                                        ? 'bg-gray-700 text-white'
                                        : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    {tab.label}
                                    <span className={`text-xs ${activeTab === tab.id ? 'text-gray-300' : 'text-gray-400'}`}>
                                        {tab.count}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div className="flex-1" />

                        {/* Edit and Logout buttons */}
                        <div className="grid grid-cols-2 gap-2">
                            <button className="py-2 text-xs font-semibold border border-gray-300 rounded-lg hover:bg-gray-100 transition">
                                EDIT
                            </button>
                            <button 
                                onClick={handleLogout}
                                className="py-2 text-xs font-semibold border border-gray-300 rounded-lg hover:bg-gray-100 transition text-red-600 hover:text-red-700 hover:border-red-300"
                            >
                                LOG OUT
                            </button>
                        </div>
                    </div>

                    {/* ── RIGHT CONTENT PANEL ── */}
                    <div className="flex-1 overflow-y-auto px-8 py-6">
                        <div className="mb-4">
                            <h2 className="text-sm font-black text-gray-800 tracking-widest uppercase">{active.title}</h2>
                            <p className="text-xs text-gray-400 italic mt-0.5">{active.description}</p>
                            <div className="border-t border-dashed border-gray-300 mt-2" />
                        </div>

                        {active.content}
                    </div>
                </div>
            </div>

            {/* ── CUSTOM CONFIRMATION MODAL ── */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 transition-opacity">
                    <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl flex flex-col gap-4 border border-gray-100">
                        <div>
                            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Remove Saved Spot?</h3>
                            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                                Are you sure you want to remove this spot from your bookmarked list?
                            </p>
                        </div>
                        
                        <div className="flex gap-2 justify-end mt-2">
                            <button 
                                onClick={() => {
                                    setShowModal(false);
                                    setSelectedSpotId(null);
                                }}
                                className="px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-100 rounded-lg transition"
                            >
                                CANCEL
                            </button>
                            <button 
                                onClick={confirmRemoveSavedSpot}
                                className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition shadow-sm"
                            >
                                YES, REMOVE
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}