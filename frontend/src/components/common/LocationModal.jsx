import { useState } from 'react';
import { MapPin, X, Check, Zap, Navigation, Radio } from 'lucide-react';
import { useLocation } from '../../context/LocationContext.jsx';
import { POPULAR_LOCATIONS } from '../../utils/constants.js';

export function LocationModal() {
  const { location, setLocation, isModalOpen, setIsModalOpen, geoStatus, detectBrowserLocation } =
    useLocation();
  const [customPincode, setCustomPincode] = useState('');
  const [error, setError] = useState('');

  if (!isModalOpen) return null;

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const pin = customPincode.trim();
    if (!/^\d{6}$/.test(pin)) {
      setError('Please enter a valid 6-digit Indian PIN code');
      return;
    }
    setError('');

    // Estimate city from prefix
    let city = 'Regional Dark Store';
    let eta = '15 min';
    let hubCode = `PIN_${pin}_HUB`;
    if (pin.startsWith('11') || pin.startsWith('12') || pin.startsWith('20')) {
      city = 'Delhi NCR';
      eta = '9 min';
      hubCode = 'DEL_CENTRAL_01';
    } else if (pin.startsWith('40')) {
      city = 'Mumbai';
      eta = '10 min';
      hubCode = 'BOM_SOUTH_02';
    } else if (pin.startsWith('56')) {
      city = 'Bengaluru';
      eta = '10 min';
      hubCode = 'BLR_EAST_04';
    } else if (pin.startsWith('41')) {
      city = 'Pune';
      eta = '14 min';
      hubCode = 'PNQ_CENTRAL_01';
    } else if (pin.startsWith('50')) {
      city = 'Hyderabad';
      eta = '15 min';
      hubCode = 'HYD_CORE_03';
    }

    setLocation({
      pincode: pin,
      city,
      area: `PIN ${pin}`,
      eta,
      hubCode
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-xl border border-gray-200 bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-700" />
            <div>
              <h3 className="font-semibold text-sm text-gray-900">
                Choose your delivery location
              </h3>
              <p className="text-xs text-gray-500">
                Prices and availability depend on your local stores
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(false)}
            className="p-1 text-gray-400 hover:text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Browser Geolocation GPS Button */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-900 flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-green-700" />
                Use current location
              </span>
              {location?.isGpsResolved && (
                <span className="text-[11px] font-medium text-green-800 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                  GPS Active
                </span>
              )}
            </div>

            <p className="text-xs text-gray-500">
              Pinpoints your area to fetch live delivery times and stock from nearby Blinkit, Instamart, and BigBasket hubs.
            </p>

            <div className="pt-1 flex items-center gap-3">
              <button
                type="button"
                onClick={detectBrowserLocation}
                disabled={geoStatus === 'detecting'}
                className="px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-gray-800 text-xs font-medium hover:bg-gray-50 transition-colors shadow-xs disabled:opacity-50"
              >
                {geoStatus === 'detecting' ? 'Detecting location...' : 'Detect location'}
              </button>
              {location?.coords && (
                <span className="text-[11px] text-gray-500 tabular-nums">
                  {location.coords.lat}°, {location.coords.lon}°
                </span>
              )}
            </div>

            {geoStatus === 'denied' && (
              <p className="text-xs text-red-600">
                Permission denied by browser. Please choose an area manually below.
              </p>
            )}
          </div>

          {/* Custom Pincode Input */}
          <form onSubmit={handleCustomSubmit} className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700">
              Or enter your 6-digit PIN code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={customPincode}
                onChange={(e) => {
                  setCustomPincode(e.target.value.replace(/\D/g, ''));
                  setError('');
                }}
                placeholder="e.g. 110001 or 560001"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-gray-900 text-xs focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-green-700 text-white text-xs font-medium hover:bg-green-800 transition-colors"
              >
                Update
              </button>
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
          </form>

          {/* Quick Select Cities */}
          <div>
            <span className="block mb-2 text-xs font-medium text-gray-700">
              Popular delivery areas
            </span>
            <div className="grid gap-2 sm:grid-cols-2">
              {POPULAR_LOCATIONS.map((loc) => {
                const isSelected = location?.pincode === loc.pincode;
                return (
                  <button
                    key={loc.pincode}
                    type="button"
                    onClick={() => {
                      setLocation(loc);
                      setIsModalOpen(false);
                    }}
                    className={`flex items-start justify-between p-3 rounded-lg text-left border transition-all ${
                      isSelected
                        ? 'border-green-600 bg-green-50/50 ring-1 ring-green-600'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-gray-900 text-xs flex items-center gap-1.5">
                        {loc.city}
                        <span className="text-[11px] text-gray-400 font-normal">({loc.pincode})</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{loc.area}</p>
                      <div className="mt-1 text-[11px] text-green-700 font-medium">
                        Delivery in ~{loc.eta}
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-green-700 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-between items-center text-xs text-gray-500">
          <span>
            Current: <strong className="text-gray-800 font-medium">{location?.area || location?.city} ({location?.pincode})</strong>
          </span>
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="text-gray-700 hover:text-gray-900 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

