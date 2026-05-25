// profile page - contains user info: contributions, reviews, bookmarks, etc.
// redirects from main page, can redirect to edit profile page
// can only be viewed by user 

'use client';
import { useState } from 'react';
import Link from 'next/link';
import { UserCircleIcon } from '@heroicons/react/24/outline';

// ── Dummy user data, replace with Supabase auth user later ──
const USER = {
    username: 'Username',
    email: 'emailaddress@email.com',
    spotsAdded: 12,
    reviews: 8,
    saved: 5,
};

// ── Dummy spot data for each tab, replace with Supabase fetch later ──
const SAVED_SPOTS = [
    { id: 1, name: 'Study Spot Name', rating: 4.5, reviews: 12, tags: ['WiFi', 'Air Conditioned'] },
    { id: 2, name: 'Study Spot Name', rating: 4.5, reviews: 8, tags: ['Quiet', 'Indoor'] },
    { id: 3, name: 'Study Spot Name', rating: 4.5, reviews: 20, tags: ['WiFi', 'Outdoor'] },
    { id: 4, name: 'Study Spot Name', rating: 4.5, reviews: 5, tags: ['Silent', 'Air Conditioned'] },
];

const MY_CONTRIBUTIONS = [
    { id: 1, name: 'Study Spot Name', rating: 4.5, reviews: 12, tags: ['WiFi', 'Air Conditioned'] },
    { id: 2, name: 'Study Spot Name', rating: 4.5, reviews: 8, tags: ['Quiet', 'Indoor'] },
    { id: 3, name: 'Study Spot Name', rating: 4.5, reviews: 20, tags: ['WiFi', 'Outdoor'] },
    { id: 4, name: 'Study Spot Name', rating: 4.5, reviews: 5, tags: ['Silent', 'Air Conditioned'] },
];

// ── Dummy reviews data, replace with Supabase fetch later ──
const MY_REVIEWS = [
    { id: 1, spotName: 'Study Spot Name', rating: 4.5, daysAgo: '2 days ago', body: 'Great place to study, very quiet and clean. The aircon works well and there are plenty of outlets.' },
    { id: 2, spotName: 'Study Spot Name', rating: 4.5, daysAgo: '5 days ago', body: 'Decent spot but can get crowded during peak hours. WiFi is reliable though.' },
    { id: 3, spotName: 'Study Spot Name', rating: 3.5, daysAgo: '1 week ago', body: 'Outdoor seating is nice but no WiFi. Good for reading but not for online work.' },
    { id: 4, spotName: 'Study Spot Name', rating: 4.0, daysAgo: '2 weeks ago', body: 'Hidden gem inside the campus. Not many people know about it.' },
];

// ── Renders star rating string ──
function StarRating({ rating }) {
    return (
        <span className="text-xs text-gray-500">
            {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))} {rating}
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
// actionLabel: button text (REMOVE or EDIT), onAction: callback
function SpotRow({ spot, actionLabel, onAction }) {
    return (
        <div className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
            {/* Spot image placeholder */}
            <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 text-xs flex-shrink-0 border border-gray-200">
                IMAGE
            </div>

            {/* Spot details */}
            <div className="flex-1 flex flex-col gap-1">
                <div className="text-sm font-bold text-gray-800">{spot.name}</div>
                <div className="flex items-center gap-1">
                    <StarRating rating={spot.rating} />
                    <span className="text-[10px] text-gray-400">({spot.reviews} Reviews)</span>
                </div>
                <div className="flex gap-1 flex-wrap">
                    {spot.tags.map((tag, i) => <TagPill key={i} label={tag} />)}
                </div>
            </div>

            {/* Action button */}
            <button
                onClick={() => onAction(spot.id)}
                className="text-xs px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition flex-shrink-0"
            >
                {actionLabel}
            </button>
        </div>
    );
}

// ── Review row used in My Reviews tab ──
function ReviewRow({ review }) {
    return (
        <div className="flex flex-col gap-1 py-3 border-b border-gray-100 last:border-0">
            {/* Spot name, rating, date */}
            <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-800">{review.spotName}</span>
                <StarRating rating={review.rating} />
                <span className="text-[10px] text-gray-400">· {review.daysAgo}</span>
            </div>

            {/* Review body */}
            <p className="text-xs text-gray-500 leading-relaxed">{review.body}</p>
        </div>
    );
}

export default function ProfilePage() {
    // ── Active sidebar tab state ──
    const [activeTab, setActiveTab] = useState('saved');

    // ── Tab config: id, label, count ──
    const TABS = [
        { id: 'saved', label: 'Saved spots', count: USER.saved },
        { id: 'contributions', label: 'My contributions', count: USER.spotsAdded },
        { id: 'reviews', label: 'My reviews', count: USER.reviews },
    ];

    // ── Tab content config ──
    const TAB_CONTENT = {
        saved: {
            title: 'Saved Spots',
            description: "Spots you've bookmarked",
            content: (
                <div>
                    {SAVED_SPOTS.map(spot => (
                        <SpotRow key={spot.id} spot={spot} actionLabel="REMOVE" onAction={(id) => console.log('remove', id)} />
                    ))}
                </div>
            ),
        },
        contributions: {
            title: 'My Contributions',
            description: "Spots you've added",
            content: (
                <div>
                    {MY_CONTRIBUTIONS.map(spot => (
                        <SpotRow key={spot.id} spot={spot} actionLabel="EDIT" onAction={(id) => console.log('edit', id)} />
                    ))}
                </div>
            ),
        },
        reviews: {
            title: 'My Reviews',
            description: "Reviews you've given",
            content: (
                <div>
                    {MY_REVIEWS.map(review => (
                        <ReviewRow key={review.id} review={review} />
                    ))}
                </div>
            ),
        },
    };

    const active = TAB_CONTENT[activeTab];

    return (
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
                        <UserCircleIcon className="w-20 h-20 text-gray-400" />
                        <div className="text-lg font-bold text-gray-800 tracking-wide uppercase">{USER.username}</div>
                        <div className="text-sm text-gray-400">{USER.email}</div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gray-200 w-full" />

                    {/* Stats: spots added, reviews, saved */}
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { label: 'Spots added', value: USER.spotsAdded },
                            { label: 'Reviews', value: USER.reviews },
                            { label: 'Saved', value: USER.saved },
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

                    {/* Spacer pushes buttons to bottom */}
                    <div className="flex-1" />

                    {/* Edit and logout buttons */}
                    <div className="grid grid-cols-2 gap-2">
                        <button className="py-2 text-xs font-semibold border border-gray-300 rounded-lg hover:bg-gray-100 transition">
                            EDIT
                        </button>
                        <button className="py-2 text-xs font-semibold border border-gray-300 rounded-lg hover:bg-gray-100 transition">
                            LOG OUT
                        </button>
                    </div>
                </div>

                {/* ── RIGHT CONTENT PANEL ── */}
                <div className="flex-1 overflow-y-auto px-8 py-6">

                    {/* Section title and description */}
                    <div className="mb-4">
                        <h2 className="text-sm font-black text-gray-800 tracking-widest uppercase">{active.title}</h2>
                        <p className="text-xs text-gray-400 italic mt-0.5">{active.description}</p>
                        <div className="border-t border-dashed border-gray-300 mt-2" />
                    </div>

                    {/* Tab content */}
                    {active.content}
                </div>
            </div>
        </div>
    );
}