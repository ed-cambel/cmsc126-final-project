'use client';

import { useState } from 'react';
import { Cog8ToothIcon } from "@heroicons/react/24/outline"
import Link from 'next/link';
import Filterbar from '@/components/Filterbar';
import { ChevronRightIcon } from '@heroicons/react/16/solid';

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

function getFilterLabel(category, value) {
  const def = FILTER_DEFS.find(d => d.category === category && d.value === value);
  return def ? def.label : value;
}

function matchesFilters(spot, selectedFilters) {
  return Object.entries(selectedFilters).every(
    ([category, value]) => spot.tags[category] === value
  );
}

export default function StudySpot() {
  const [selectedFilters, setSelectedFilters] = useState({});
  const [activeSpotId, setActiveSpotId] = useState(null);

  const filteredSpots = ALL_SPOTS.filter(spot => matchesFilters(spot, selectedFilters));

  return (
    <div className="flex flex-col overflow-hidden" style={{ height: 'calc(100vh - 57px)' }}>
      <Filterbar
        selectedFilters={selectedFilters}
        onChange={setSelectedFilters}
        resultCount={filteredSpots.length}
      />

      {/* MAIN BODY */}
      <div className="flex flex-1 overflow-hidden">

        {/* MAP — 3/4 */}
        <div className="flex-[3] relative bg-green-100">
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            [ INTERACTIVE MAP BACKGROUND ]
          </div>

          {/* Map controls */}
          <div className="absolute bottom-4 left-4 flex flex-col gap-1">
            {['⌖', '+', '−'].map((icon, i) => (
              <button
                key={i}
                className="w-8 h-8 flex items-center justify-center bg-[#F5F2EA] border-[#D4CCBA] rounded-md shadow-sm hover:bg-gray-50 text-sm"
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* SPOT LIST — 1/4 */}
        <div className="flex-1 flex flex-col border-2 border-[#0F2D1C] bg-[#F5F2EA] hover:bg-[#EBE6D8]overflow-hidden min-w-55">
          <div className="px-4 py-3 border-b-2 border-[#0F2D1C] shrink-0">
            <span className="text-sm font-semibold text-[#0F2D1C]">Study Spots</span>
            <span className="text-xs text-[#0F2D1C] ml-2">{filteredSpots.length} found</span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2">
            {filteredSpots.length === 0 ? (
              <div className="text-center text-xs text-[#0F2D1C] mt-8">
                No spots match your filters.
              </div>
            ) : (
              filteredSpots.map(spot => (
                <div
                  key={spot.id}
                  onClick={() => setActiveSpotId(spot.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all grid grid-cols-[1fr_auto] items-center gap-2 ${activeSpotId === spot.id
                    ? 'border-[#0F2D1C]  bg-[#C4811A] border-2 text-[#F5F2EA]'
                    : 'border-[#0F2D1C] bg-[#F5F2EA] hover:bg-[#C4811A] hover:border-[#0F2D1C] hover:border-2'
                    }`}
                >
                  <div>
                    <div className="text-xs font-semibold text-[#0F2D1C] mb-0.5">{spot.name}</div>
                    <div className="text-[10px] text-[#0F2D1C] mb-2">★ {spot.rating} · {spot.dist}</div>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(spot.tags).map(([cat, val]) => (
                        <span key={cat} className="text-[9px] px-2 py-0.5 rounded-full bg-[#F5F2EA] text-[#0F2D1C] border border-[#0F2D1C]">
                          {getFilterLabel(cat, val)}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={`/spot/${spot.id}`}
                    onClick={e => e.stopPropagation()}
                    className="w-7 h-7 rounded-full bg-[#0F2D1C] hover:bg-[#1E4A2A] flex items-center justify-center transition"
                  >
                    <ChevronRightIcon className="w-4 h-4 text-[#EDF5D8]" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}