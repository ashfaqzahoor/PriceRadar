import { createContext, useContext, useEffect, useState } from 'react';
import { POPULAR_LOCATIONS } from '../utils/constants.js';

const LocationContext = createContext();

// Helper to calculate distance in km between two lat/lon coordinates
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

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

  const [geoStatus, setGeoStatus] = useState('idle'); // 'idle' | 'detecting' | 'resolved' | 'denied' | 'error'
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('user_location', JSON.stringify(location));
    } catch {
      // ignore
    }
  }, [location]);

  // Request browser GPS position and map to closest dark store hub
  const detectBrowserLocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus('error');
      return;
    }

    setGeoStatus('detecting');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        // Find nearest known quick commerce hub
        let closest = POPULAR_LOCATIONS[0];
        let minDistance = Infinity;

        for (const loc of POPULAR_LOCATIONS) {
          if (loc.lat && loc.lon) {
            const dist = haversine(latitude, loc.lat, longitude, loc.lon);
            if (dist < minDistance) {
              minDistance = dist;
              closest = loc;
            }
          }
        }

        const resolvedLocation = {
          ...closest,
          coords: {
            lat: latitude.toFixed(4),
            lon: longitude.toFixed(4)
          },
          isGpsResolved: true
        };

        setLocation(resolvedLocation);
        setGeoStatus('resolved');
      },
      (err) => {
        console.warn('Geolocation failed or denied:', err.message);
        setGeoStatus(err.code === 1 ? 'denied' : 'error');
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  };

  const updateLocation = (newLoc) => {
    setLocation(newLoc);
    setIsModalOpen(false);
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        setLocation: updateLocation,
        isModalOpen,
        setIsModalOpen,
        geoStatus,
        detectBrowserLocation
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  return useContext(LocationContext);
}
