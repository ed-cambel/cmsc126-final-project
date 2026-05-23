'use client';

import { useState } from 'react';
import { Cog8ToothIcon } from "@heroicons/react/24/outline"
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/16/solid';

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

const ALL_SPOTS = [
  { id: 1, name: "ICS Lobby", tags: { connectivity: "wifi", noise: "moderate", environment: "air_conditioned", location: "inside_upv" }, rating: 4.5, dist: "0.1 km" },
  { id: 2, name: "Main Library", tags: { connectivity: "wifi", noise: "silent", environment: "air_conditioned", location: "inside_upv" }, rating: 4.8, dist: "0.3 km" },
  { id: 3, name: "AS Garden", tags: { connectivity: "no_wifi", noise: "quiet", environment: "outdoor", location: "inside_upv" }, rating: 4.2, dist: "0.4 km" },
  { id: 4, name: "Café Morado", tags: { connectivity: "wifi", noise: "moderate", environment: "air_conditioned", location: "outside_upv" }, rating: 4.6, dist: "0.6 km" },
  { id: 5, name: "SOLAIR Benches", tags: { connectivity: "no_wifi", noise: "quiet", environment: "outdoor", location: "inside_upv" }, rating: 3.9, dist: "0.2 km" },
  { id: 6, name: "Engineering Reading Room", tags: { connectivity: "wifi", noise: "silent", environment: "air_conditioned", location: "inside_upv" }, rating: 4.7, dist: "0.5 km" },
  { id: 7, name: "Jollibee Miagao", tags: { connectivity: "wifi", noise: "noisy", environment: "air_conditioned", location: "outside_upv" }, rating: 3.5, dist: "1.2 km" },
  { id: 8, name: "Open Pavilion", tags: { connectivity: "no_wifi", noise: "moderate", environment: "outdoor", location: "inside_upv" }, rating: 4.0, dist: "0.3 km" },
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

function matchesFilters(spot, selectedFilters) {
  return Object.entries(selectedFilters).every(
    ([category, value]) => spot.tags[category] === value
  );
}

export default function StudySpotLayout() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [activeSpotId, setActiveSpotId] = useState(null);

  const handleTagClick = (category, value) => {
    setSelectedFilters(prev => {
      const updated = { ...prev };
      if (updated[category] === value) {
        delete updated[category];
      } else {
        updated[category] = value;
      }
      return updated;
    });
  };

  const removeFilter = (category) => {
    setSelectedFilters(prev => {
      const updated = { ...prev };
      delete updated[category];
      return updated;
    });
  };

  const filteredSpots = ALL_SPOTS.filter(spot => matchesFilters(spot, selectedFilters));

  return (
    <div className="flex flex-col overflow-hidden" style={{ height: 'calc(100vh - 57px)' }}>

      {/* FILTER BAR */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-200 bg-white overflow-x-auto flex-shrink-0">
        <span className="text-xs font-semibold text-gray-500 tracking-widest whitespace-nowrap">FILTER</span>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full border border-gray-400 bg-gray-100 hover:bg-gray-200 whitespace-nowrap transition"
        >
          <Cog8ToothIcon className='w-4 h-4' /> ALL FILTERS
        </button>

        {Object.entries(selectedFilters).map(([category, value]) => (
          <span
            key={category}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border border-black bg-black text-white whitespace-nowrap"
          >
            {getFilterLabel(category, value)}
            <button
              onClick={() => removeFilter(category)}
              className="hover:opacity-70 transition"
            >
              ✖
            </button>
          </span>
        ))}
      </div>

      {/* MAIN BODY */}
      <div className="flex flex-1 overflow-hidden">

        {/* MAP — 3/4 */}
        <div className="flex-[3] relative bg-green-100">
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            [ INTERACTIVE MAP BACKGROUND ]
          </div>

          {/* Map controls */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-1">
            {['⌖', '+', '−'].map((icon, i) => (
              <button
                key={i}
                className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 text-sm"
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* SPOT LIST — 1/4 */}
        <div className="flex-1 flex flex-col border-l border-gray-200 bg-white overflow-hidden min-w-[220px]">
          <div className="px-4 py-3 border-b border-gray-200 flex-shrink-0">
            <span className="text-sm font-semibold text-gray-800">Study Spots</span>
            <span className="text-xs text-gray-400 ml-2">{filteredSpots.length} found</span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2">
            {filteredSpots.length === 0 ? (
              <div className="text-center text-xs text-gray-400 mt-8">
                No spots match your filters.
              </div>
            ) : (
              filteredSpots.map(spot => (
                <div
                  key={spot.id}
                  onClick={() => setActiveSpotId(spot.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all grid grid-cols-[1fr_auto] items-center gap-2 ${activeSpotId === spot.id
                    ? 'border-indigo-400 bg-indigo-50'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                >
                  <div>
                    <div className="text-xs font-semibold text-gray-800 mb-0.5">{spot.name}</div>
                    <div className="text-[10px] text-gray-400 mb-2">★ {spot.rating} · {spot.dist}</div>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(spot.tags).map(([cat, val]) => (
                        <span key={cat} className="text-[9px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                          {getFilterLabel(cat, val)}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={`/spot/${spot.id}`}
                    onClick={e => e.stopPropagation()}
                    className="w-7 h-7 rounded-full bg-indigo-500 hover:bg-indigo-600 flex items-center justify-center transition"
                  >
                    <ChevronRightIcon className="w-4 h-4 text-white" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* FILTER MODAL */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
          onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
        >
          <div className="bg-white rounded-2xl w-[400px] max-h-[80vh] overflow-y-auto shadow-lg">

            {/* Modal header */}
            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200">
              <span className="text-base font-semibold text-gray-800">Filters</span>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 transition text-sm"
              >
                ✖
              </button>
            </div>

            <div className="px-5 py-4 flex flex-col gap-6">
              {FILTER_GROUPS.map(({ label, category, values }) => (
                <div key={category}>
                  <div className="text-xs font-semibold text-gray-500 tracking-widest uppercase mb-3">
                    {label}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {values.map(val => (
                      <button
                        key={val}
                        onClick={() => handleTagClick(category, val)}
                        className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition ${selectedFilters[category] === val
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                          }`}
                      >
                        {getFilterLabel(category, val)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Apply button */}
            <div className="px-5 py-4 border-t border-gray-200">
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full py-2.5 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition"
              >
                Show Results ({filteredSpots.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}