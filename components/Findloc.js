"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import L from "leaflet";

// Fix missing marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Dynamic imports (disable SSR)
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

const useMap = () => {
  if (typeof window !== "undefined") {
    return require("react-leaflet").useMap();
  }

  return null;
};

export default function FindMyLocation() {
  const map = useMap();

  const [position, setPosition] = useState(null);

  const locateUser = () => {
    if (!map) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];

        setPosition(coords);

        map.flyTo(coords, 18);
      },
      (err) => {
        console.log(err);
      }
    );
  };

  return (
    <>
      <button onClick={locateUser}
        className="
            absolute
            bottom-6
            left-6
            z-[1000]

            w-16
            h-16

            rounded-2xl

            bg-gradient-to-br
            from-[#0F2D1C]
            to-[#1E4A2A]

            text-[#EDF5D8]

            shadow-[0_8px_24px_rgba(15,45,28,0.35)]

            flex
            items-center
            justify-center

            hover:scale-110
            hover:-translate-y-1

            active:scale-95

            transition-all
            duration-300
        ">

        <div
            className="
            w-10
            h-10

            rounded-full

            bg-white/15

            flex
            items-center
            justify-center
            "
        >
            <span className="text-2xl">
            ⌖
            </span>
            
        </div>
        </button>

      {position && (
        <Marker position={position}>
            <Popup>
            You are here
            </Popup>
        </Marker>
        )}
    </>
  );
}