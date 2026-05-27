'use client';
import { useState, useEffect } from 'react';

export function useGeolocation() {
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                (err) => console.warn('Geolocation failed:', err)
            );
        }
    }, []);

    return userLocation;
}