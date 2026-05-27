'use client';

import { useState, useEffect, useRef } from "react"; 
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";

// internal controller for panning the map
function AddMapController({ center, searchLocation, setPinnedLocation, onLocationSelect }) {
  const map = useMap();

  // Pan when user location is found
  useEffect(() => {
    if (center) {
      map.flyTo(center, 15); 
    }
  }, [center, map]);

  // Pan when an address is searched
  useEffect(() => {
    if (searchLocation) {
      map.flyTo(searchLocation, 16); 
    }
  }, [searchLocation, map]);

  // Manual pinning on map
  useMapEvents({
    click(e) {
      const latlng = [e.latlng.lat, e.latlng.lng];
      setPinnedLocation(latlng);
      if (onLocationSelect) {
        onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    },
  });

  return null;
}

export default function AddMap({ onLocationSelect }) { 
  const [userLocation, setUserLocation] = useState([10.6419, 122.2358]); // Default UPV fallback
  const [pinnedLocation, setPinnedLocation] = useState(null);
  const [searchLocation, setSearchLocation] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get current GPS location
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

  // Address Autocomplete Fetcher
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
        console.error("Autocomplete error:", error);
      }
    }, 400); 

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSelectSuggestion = (item) => {
    const latlng = [parseFloat(item.lat), parseFloat(item.lon)];
    setSearchQuery(item.display_name); 
    setSearchLocation(latlng);         
    setPinnedLocation(latlng);         
    setShowDropdown(false);            

    if (onLocationSelect) {
      onLocationSelect({
        lat: latlng[0],
        lng: latlng[1],
        address: item.display_name
      });
    }
  };

  return (
    <div className="relative w-full h-full min-h-[280px] rounded-lg overflow-hidden border border-gray-300">
      
      {/* Search Bar */}
      <div ref={dropdownRef} className="absolute top-2 left-12 z-[1000] w-[calc(100%-16px)] sm:w-72 flex flex-col gap-1">
        <div className="bg-white p-1.5 rounded-lg shadow-md border border-gray-200">
          <input
            type="text"
            placeholder="Search map for an address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => { if (suggestions.length > 0) setShowDropdown(true); }}
            className="w-full px-2 py-1 text-xs text-gray-800 border border-gray-300 rounded focus:outline-none focus:border-[#0F2D1C] bg-gray-50"
          />
        </div>

        {showDropdown && (
          <div className="bg-white rounded-lg shadow-lg border border-gray-100 max-h-40 overflow-y-auto py-1">
            {suggestions.map((item) => (
              <button
                key={item.place_id}
                type="button"
                onClick={() => handleSelectSuggestion(item)}
                className="w-full text-left px-3 py-1.5 text-[11px] text-gray-700 hover:bg-gray-100 transition border-b border-gray-50 last:border-0 truncate block"
              >
                {item.display_name}
              </button>
            ))}
          </div>
        )}
      </div>

      <MapContainer
        center={userLocation}
        zoom={14}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }} 
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <AddMapController 
          center={userLocation} 
          searchLocation={searchLocation} 
          setPinnedLocation={setPinnedLocation}
          onLocationSelect={onLocationSelect}
        />

        <Marker position={userLocation}>
          <Popup><b>Your Location</b></Popup>
        </Marker>

        {pinnedLocation && (
          <Marker position={pinnedLocation}>
            <Popup><b>Study Spot Location Pin</b></Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}