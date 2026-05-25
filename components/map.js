'use client';

import { useState, useEffect, useRef } from "react"; 
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";


// HELPER MAP CONTROLLER

function MapController({ center, searchLocation, zoomTrigger, locateTrigger }) {
  const map = useMap();

  // Smoothly pan the map view when the user's real location is fetched
  useEffect(() => {
    if (center) {
      map.flyTo(center, 15); 
    }
  }, [center, map]);

  useEffect(() => {
    if (searchLocation) {
      map.flyTo(searchLocation, 16); 
    }
  }, [searchLocation, map]);

  // Listen to zoom button clicks (+ / -) from the layout page
  useEffect(() => {
    if (zoomTrigger === "in") {
      map.zoomIn();
    } else if (zoomTrigger === "out") {
      map.zoomOut();
    }
  }, [zoomTrigger, map]);

  // Listen to the target locate button (⌖) from the layout page
  useEffect(() => {
    if (locateTrigger > 0 && center) {
      map.flyTo(center, 15);
    }
  }, [locateTrigger, center, map]);

  return null;
}

// MAIN MAP COMPONENT

export default function Map({ zoomTrigger, locateTrigger }) { 
  const [userLocation, setUserLocation] = useState([10.6419, 122.2358]); 
  const [pinnedLocation, setPinnedLocation] = useState(null);
  const [searchLocation, setSearchLocation] = useState(null);
  
  // Search state management
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if user clicks completely outside of the search bar area
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch real browser location on load
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        (error) => console.warn("GPS failed, using fallback.", error)
      );
    }
  }, []);

  // Live Suggestion Fetcher (Triggers as the user types)
  useEffect(() => {
    if (searchQuery.trim().length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`
        );
        const data = await response.json();
        setSuggestions(data);
        setShowDropdown(data.length > 0);
      } catch (error) {
        console.error("Error fetching autocomplete suggestions:", error);
      }
    }, 400); 

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // When a suggestion item gets clicked from the dropdown panel
  const handleSelectSuggestion = (item) => {
    const latlng = [parseFloat(item.lat), parseFloat(item.lon)];
    setSearchQuery(item.display_name); 
    setSearchLocation(latlng);         
    setPinnedLocation(latlng);         
    setShowDropdown(false);            
  };

  return (
    <div className="relative w-full h-full">
      
      {/* FLOATING SEARCH BAR AND DROPDOWN LIST CONTAINER */}
      <div ref={dropdownRef} className="absolute top-4 left-4 z-[1000] w-80 flex flex-col gap-1">
        
        {/* INPUT FIELD */}
        <div className="bg-white p-2 rounded-xl shadow-lg border border-gray-200">
          <input
            type="text"
            placeholder="Type a location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => { if (suggestions.length > 0) setShowDropdown(true); }}
            className="w-full px-3 py-1.5 text-xs text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 bg-gray-50"
          />
        </div>

        {/* SUGGESTIONS PANEL */}
        {showDropdown && (
          <div className="bg-white rounded-xl shadow-xl border border-gray-100 max-h-60 overflow-y-auto py-1">
            {suggestions.map((item) => (
              <button
                key={item.place_id}
                type="button"
                onClick={() => handleSelectSuggestion(item)}
                className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 transition border-b border-gray-50 last:border-0 truncate block"
              >
                {item.display_name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* LEAFLET MAP */}
      <MapContainer
        center={userLocation}
        zoom={13}
        scrollWheelZoom={true}
        zoomControl={false}
        style={{ height: "100%", width: "100%" }} 
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* send the triggers directly into the controller component */}
        <MapController 
          center={userLocation} 
          searchLocation={searchLocation} 
          zoomTrigger={zoomTrigger}
          locateTrigger={locateTrigger}
        />

        <Marker position={userLocation}>
          <Popup><b>You are here!</b></Popup>
        </Marker>

        {pinnedLocation && (
          <Marker position={pinnedLocation}>
            <Popup>
              <div className="text-center p-0.5">
                <b className="text-indigo-600">Selected Location</b> <br />
                <span className="text-[10px] text-gray-400">
                  {pinnedLocation[0].toFixed(4)}, {pinnedLocation[1].toFixed(4)}
                </span>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}