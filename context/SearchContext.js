'use client';

import { createContext, useContext, useState } from 'react';

const searchContext = createContext(null);

export function SearchProvider({ children }) {
    const [searchLocation, setSearchLocation] = useState(null);

    return (
        <searchContext.Provider value={{ searchLocation, setSearchLocation }}>
            {children}
        </searchContext.Provider>
    );
}

export function useSearch() {
    const context = useContext(searchContext);
    return context;
}
    