'use client';

import { useState, useEffect } from "react"; 
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

// HELPER MAP CONTROLLER
function MapController({ center, searchLocation, zoomTrigger, locateTrigger, activeSpot }) {
  const map = useMap();

  // Smoothly pan the map view when the user's real location is fetched
  useEffect(() => {
    if (center) {
      map.flyTo(center, 17); 
    }
  }, [center, map]);

  useEffect(() => {
    if (searchLocation) {
      map.flyTo(searchLocation, 17); 
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
      map.flyTo(center, 18);
    }
  }, [locateTrigger, center, map]);

  // FEATURE: Pan to spot location when clicked on the list container
  useEffect(() => {
    if (activeSpot) {
      const lat = activeSpot.lat || activeSpot.latitude;
      const lng = activeSpot.lng || activeSpot.longitude;
      
      if (lat && lng) {
        map.flyTo([parseFloat(lat), parseFloat(lng)], 18);
      }
    }
  }, [activeSpot, map]);

  return null;
}

// MAIN MAP COMPONENT
export default function Map({ 
  zoomTrigger, 
  locateTrigger, 
  searchLocation,
  spots = [], 
  activeSpotId, 
  setActiveSpotId, 
  setPinFilteredSpotId,
  userLocation: parentUserLocation // Get the user location from the landing page hook
}) { 
  const [mounted, setMounted] = useState(false);
  const [localUserLocation, setLocalUserLocation] = useState([10.6419, 122.2358]); 
  const [pinnedLocation, setPinnedLocation] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch real browser location on load
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocalUserLocation([latitude, longitude]);
        },
        (error) => console.warn("GPS failed, using fallback.", error)
      );
    }
  }, []);

  useEffect(() => {
    if (searchLocation) {
      setPinnedLocation(searchLocation);
    }
  }, [searchLocation]);

  // Use the parent's geolocation hook if it exists, otherwise use local geolocation
  const centerLocation = parentUserLocation?.lat && parentUserLocation?.lng 
    ? [parentUserLocation.lat, parentUserLocation.lng] 
    : localUserLocation;

  // Find the currently active spot to pass to the MapController for panning
  const activeSpot = spots.find(s => s.id === activeSpotId);

  // Prevent mismatch with Leaflet
  if (!mounted) return null;

  // Change pin icon for current location's distinction
  const userIcon = L.divIcon({
    className: "custom-user-pin",
    html: `
      <div class="relative flex items-center justify-center" style="width: 32px; height: 32px;">
        <svg class="w-8 h-8 text-red-600 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.998 2c-4.188 0-7.587 3.399-7.587 7.587 0 6.289 6.811 12.015 7.101 12.257a.75.75 0 0 0 .973 0c.289-.242 7.101-5.968 7.101-12.257 0-4.188-3.399-7.587-7.587-7.587zm0 10.5a2.913 2.913 0 1 1 0-5.826 2.913 2.913 0 0 1 0 5.826z"/>
        </svg>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [16, 32], 
    popupAnchor: [0, -32]  
  });

  return (
    <div className="relative w-full h-full">
      
      {/* LEAFLET MAP */}
      <MapContainer
        center={centerLocation}
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
          center={centerLocation} 
          searchLocation={searchLocation} 
          zoomTrigger={zoomTrigger}
          locateTrigger={locateTrigger}
          activeSpot={activeSpot}
        />

        {/* Current Location Marker */}
        <Marker position={centerLocation} icon={userIcon}>
          <Popup><b>You are here!</b></Popup>
        </Marker>

        {/* Searched Area Marker */}
        {pinnedLocation && (
          <Marker position={pinnedLocation}>
            <Popup>
              <div className="text-center p-0.5">
                <b className="text-[#0F2D1C]">Selected Location</b> <br />
                <span className="text-[10px] text-[#D4CCBA]">
                  {pinnedLocation[0].toFixed(4)}, {pinnedLocation[1].toFixed(4)}
                </span>
              </div>
            </Popup>
          </Marker>
        )}

        {/* FEATURE: Dynamic Database Spot Markers */}
        {spots.map((spot) => {
          const lat = spot.lat || spot.latitude;
          const lng = spot.lng || spot.longitude;

          if (!lat || !lng) return null; // Skip if coordinates are missing

          return (
            <Marker 
              key={spot.id} 
              position={[parseFloat(lat), parseFloat(lng)]}
              eventHandlers={{
                click: () => {
                  if (setActiveSpotId) setActiveSpotId(spot.id);
                  if (setPinFilteredSpotId) setPinFilteredSpotId(spot.id);
                },
              }}
            >
              <Popup>
                <div className="p-0.5 text-xs text-gray-800">
                  <p className="font-bold border-b pb-1 mb-1 text-[#0F2D1C]">{spot.name}</p>
                  <p className="text-gray-500 text-[10px]">{spot.address || "Study spot pinned"}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}