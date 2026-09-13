import { createContext, useContext, useEffect, useState } from 'react';
import { POPULAR_LOCATIONS } from '../utils/constants.js';

const LocationContext = createContext();

export function LocationProvider({ children }) {
  const [location, setLocation] = useState(() => {
    try {
      const saved = localStorage.getItem('user_location');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return POPULAR_LOCATIONS[0];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('user_location', JSON.stringify(location));
    } catch {
      // ignore
    }
  }, [location]);

  const updateLocation = (newLoc) => {
    setLocation(newLoc);
    setIsModalOpen(false);
  };

  return (
    <LocationContext.Provider value={{ location, setLocation: updateLocation, isModalOpen, setIsModalOpen }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  return useContext(LocationContext);
}
