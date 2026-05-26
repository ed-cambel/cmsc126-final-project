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

export default function Map({ zoomTrigger, locateTrigger, searchLocation }) { 
  const [userLocation, setUserLocation] = useState([10.6419, 122.2358]); 
  const [pinnedLocation, setPinnedLocation] = useState(null);

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

  return (
    <div className="relative w-full h-full">
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