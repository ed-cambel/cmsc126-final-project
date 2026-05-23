// components/Filterbar.js
// allows user to slecect specific tags

'use client'

import { useState } from 'react'
import { XMarkIcon, Cog8ToothIcon } from '@heroicons/react/24/outline'

// constants for filter options
const FILTER_DEFS = [
    { category: "connectivity", value: "wifi", label: "WIFI" },
    { category: "connectivity", value: "no_wifi", label: "NO WIFI" },
    { category: "connectivity", value: "outlet", label: "OUTLET" },
    { category: "connectivity", value: "no_outlet", label: "NO OUTLET" },
    { category: "noise", value: "silent", label: "SILENT" },
    { category: "noise", value: "quiet", label: "QUIET" },
    { category: "noise", value: "moderate", label: "MODERATE" },
    { category: "noise", value: "noisy", label: "NOISY" },
    { category: "environment", value: "air_conditioned", label: "AIR CONDITIONED" },
    { category: "environment", value: "non_air_conditioned", label: "NON-AIR CONDITIONED" },
    { category: "environment", value: "indoor", label: "INDOOR" },
    { category: "environment", value: "outdoor", label: "OUTDOOR" },
    { category: "location", value: "inside_upv", label: "INSIDE UPV" },
    { category: "location", value: "outside_upv", label: "OUTSIDE UPV" },
];

const FILTER_GROUPS = [
    { label: 'Connectivity', category: 'connectivity', values: ['wifi', 'no_wifi', 'outlet', 'no_outlet'] },
    { label: 'Noise Level', category: 'noise', values: ['silent', 'quiet', 'moderate', 'noisy'] },
    { label: 'Environment', category: 'environment', values: ['air_conditioned', 'non_air_conditioned', 'indoor', 'outdoor'] },
    { label: 'Location', category: 'location', values: ['inside_upv', 'outside_upv'] },
];

function getFilterLabel(category, value) {
    const def = FILTER_DEFS.find(d => d.category === category && d.value === value);
    return def ? def.label : value;
}

export default function Filterbar({ selectedFilters, onChange, resultCount }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleTagClick = (category, value) => {
        const updated = { ...selectedFilters };
        if (updated[category] === value) {
            delete updated[category];
        } else {
            updated[category] = value;
        }
        onChange(updated);
    };

    const removeFilter = (category) => {
        const updated = { ...selectedFilters };
        delete updated[category];
        onChange(updated);
    };

    return (
        <>
            {/* Filter Bar */}
            <div className="flex items-center gap-2 px-4 py-2 border-2 border-[#D4CCBA] bg-[#F5F2EA] overflow-x-auto shrink-0">
                <span className="text-xs font-semibold text-[#6B6355] tracking-widest whitespace-nowrap">FILTER</span>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full border border-[#D4CCBA] bg-[#F5F2EA] text-[#2A241E] hover:bg-[#EBE6D8] hover:border-[#0F2D1C] hover:text-[#0F2D1C] whitespace-nowrap transition"
                >
                    <Cog8ToothIcon className="w-4 h-4" /> ALL FILTERS
                </button>

                {Object.entries(selectedFilters).map(([category, value]) => (
                    <span
                        key={category}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border border-[#0F2D1C] bg-[#0F2D1C] text-[#EDF5D8] whitespace-nowrap"
                    >
                        {getFilterLabel(category, value)}
                        <button onClick={() => removeFilter(category)} className="hover:opacity-70 transition">
                            <XMarkIcon className="w-3 h-3" />
                        </button>
                    </span>
                ))}
            </div>

            {/* FILTER MODAL */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
                    onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
                >
                    <div className="bg-[#F5F2EA] rounded-2xl w-[400px] max-h-[80vh] overflow-y-auto">

                        <div className="flex justify-between items-center px-5 py-4 border-b border-[#D4CCBA]">
                            <span className="text-base font-semibold text-[#2A241E]">Filters</span>
                            <button onClick={() => setIsModalOpen(false)} className="text-[#6B6355] hover:text-[#2A241E] transition text-sm">
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="px-5 py-4 flex flex-col gap-6">
                            {FILTER_GROUPS.map(({ label, category, values }) => (
                                <div key={category}>
                                    <div className="text-xs font-semibold text-[#6B6355] tracking-widest uppercase mb-3">
                                        {label}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {values.map(val => (
                                            <button
                                                key={val}
                                                onClick={() => handleTagClick(category, val)}
                                                className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition ${selectedFilters[category] === val
                                                    ? 'bg-[#0F2D1C] text-[#EDF5D8] border-[#0F2D1C]'
                                                    : 'bg-[#F5F2EA] text-[#6B6355] border-[#D4CCBA] hover:bg-[#EBE6D8] hover:text-[#2E6B3E] hover:border-[#2E6B3E]'
                                                    }`}
                                            >
                                                {getFilterLabel(category, val)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="px-5 py-4 border-t border-[#D4CCBA]">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-full py-2.5 bg-[#0F2D1C] text-[#EDF5D8] text-sm font-semibold rounded-xl hover:bg-[#1E4A2A] transition"
                            >
                                Show Results ({resultCount})
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}