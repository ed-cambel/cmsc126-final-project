'use client';

import { createContext, useContext, useState } from 'react';

const SearchContext = createContext(null);

export function SearchProvider ({ children }) {
    const [searchLocation, setSearchLocation] = useState(null);

    return (
        <SearchContext.Provider value={{ searchLocation, setSearchLocation }}>
            {children}
        </SearchContext.Provider>
    );
}

export function useSearch() {
    return useContext(SearchContext);
}