// main landing page with map and spot list
// can be viewed by guest or user

'use client';

import Link from 'next/link';
import Filterbar from '@/components/Filterbar';
import { ChevronRightIcon } from '@heroicons/react/16/solid';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useSearch } from '@/context/SearchContext';
import { useGeolocation } from '@/hooks/useGeolocation';
import { getDistance } from '@/lib/distance';

const supabase = createClient();

import dynamic from "next/dynamic";



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

const MapComponent = dynamic(() => import("../components/map"), {
  loading: () => <p>Loading map...</p>,
  ssr: false, 
});

function getFilterLabel(category, value) {
  const def = FILTER_DEFS.find(d => d.category === category && d.value === value);
  return def ? def.label : value;
}

function matchesFilters(spot, selectedFilters) {
  return Object.entries(selectedFilters).every(([category, value]) => {
    if (category === 'connectivity') return value === 'wifi' ? spot.has_wifi : !spot.has_wifi;
    if (category === 'noise') return spot.noise_level === value;
    if (category === 'environment') return spot.environment === value;
    if (category === 'location') return spot.location_type === value;
    return true;
  });
}

export default function StudySpot() {
  const { searchLocation } = useSearch();
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [activeSpotId, setActiveSpotId] = useState(null);
  const [zoomTrigger, setZoomTrigger] = useState(null);
  const [locateTrigger, setLocateTrigger] = useState(0);
  const userLocation = useGeolocation();
  

  useEffect(() => {
    const fetchSpots = async () => {
      const { data, error } = await supabase.from('spots_with_stats').select('*');
      if (error) {
        console.error('Error fetching spots:', error);
      } else {
        setSpots(data);
        setLoading(false);
      }
    };
    fetchSpots();
  }, []);

  const filteredSpots = spots.filter(spot => matchesFilters(spot, selectedFilters));

  return (
    <div className="flex flex-col overflow-hidden" style={{ height: 'calc(100vh - 57px)' }}>
      <Filterbar
        selectedFilters={selectedFilters}
        onChange={setSelectedFilters}
        resultCount={filteredSpots.length}
      />

      {/* MAIN BODY */}
      <div className="flex flex-1 overflow-hidden">

        {/* MAP */}
        <div className="flex-3 relative bg-green-100">
          
            <div className="absolute inset-0 w-full h-full z-0">
            <MapComponent key="main-map" zoomTrigger={zoomTrigger} locateTrigger={locateTrigger} searchLocation={searchLocation}/>
              </div>

              {/* Active Map Controls */}
            <div className="absolute bottom-4 left-4 flex flex-col gap-1 z-[1000]">
              {/* Current Location Target Button */}
              <button
                onClick={() => setLocateTrigger(prev => prev + 1)}
              className="w-8 h-8 flex items-center justify-center bg-[#0F2D1C] border border-[#1E4A2A] rounded-md shadow-md hover:bg-[#C4811A] text-[#D4CCBA] text-sm font-bold active:bg-[#1E4A2A] transition"
              >
                ⌖
              </button>
              {/* Zoom In Button */}
              <button
                onClick={() => { setZoomTrigger("in"); setTimeout(() => setZoomTrigger(null), 50); }}
                className="w-8 h-8 flex items-center justify-center bg-[#0F2D1C] border border-[#1E4A2A] rounded-md shadow-md hover:bg-[#C4811A] text-[#D4CCBA] text-sm font-bold active:bg-[#1E4A2A] transition"
              >
                +
              </button>
              {/* Zoom Out Button */}
              <button
                onClick={() => { setZoomTrigger("out"); setTimeout(() => setZoomTrigger(null), 50); }}
              className="w-8 h-8 flex items-center justify-center bg-[#0F2D1C] border border-[#1E4A2A] rounded-md shadow-md hover:bg-[#C4811A] text-[#D4CCBA] text-sm font-bold active:bg-[#1E4A2A] transition"
              >
                -
              </button>
            </div>
        </div>

        {/* SPOT LIST */}
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
                    <div className="text-[10px] text-[#0F2D1C] mb-2">★ {spot.computed_rating ?? '—'} · ({spot.computed_review_count ?? 0} reviews)
                    {userLocation && spot.lat && spot.lng && (
                      <span className="ml-2">· {getDistance(userLocation.lat, userLocation.lng, spot.lat, spot.lng)}</span>
                    )}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <div className="flex flex-wrap gap-1">
                        {spot.has_wifi && <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#F5F2EA] text-[#0F2D1C] border border-[#0F2D1C]">WIFI</span>}
                        {spot.noise_level && <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#F5F2EA] text-[#0F2D1C] border border-[#0F2D1C]">{getFilterLabel('noise', spot.noise_level)}</span>}
                        {spot.environment && <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#F5F2EA] text-[#0F2D1C] border border-[#0F2D1C]">{getFilterLabel('environment', spot.environment)}</span>}
                        {spot.location_type && <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#F5F2EA] text-[#0F2D1C] border border-[#0F2D1C]">{getFilterLabel('location', spot.location_type)}</span>}
                      </div>
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