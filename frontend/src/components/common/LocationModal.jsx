import { useState } from 'react';
import { MapPin, X, Check, Zap, Building2 } from 'lucide-react';
import { useLocation } from '../../context/LocationContext.jsx';
import { POPULAR_LOCATIONS } from '../../utils/constants.js';

export function LocationModal() {
  const { location, setLocation, isModalOpen, setIsModalOpen } = useLocation();
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
    let city = 'Your City';
    let eta = '15 min';
    if (pin.startsWith('11') || pin.startsWith('12') || pin.startsWith('20')) {
      city = 'Delhi NCR';
      eta = '9 min';
    } else if (pin.startsWith('40')) {
      city = 'Mumbai';
      eta = '10 min';
    } else if (pin.startsWith('56')) {
      city = 'Bengaluru';
      eta = '10 min';
    } else if (pin.startsWith('41')) {
      city = 'Pune';
      eta = '14 min';
    } else if (pin.startsWith('50')) {
      city = 'Hyderabad';
      eta = '15 min';
    }

    setLocation({
      pincode: pin,
      city,
      area: `PIN ${pin}`,
      eta
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg overflow-hidden bg-white rounded-2xl shadow-2xl border border-slate-100 animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="grid w-9 h-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Select Delivery Location</h3>
              <p className="text-xs text-slate-500">Live prices and delivery times vary by dark-store proximity</p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Custom Pincode Input */}
          <form onSubmit={handleCustomSubmit} className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Enter 6-Digit PIN Code
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
                placeholder="e.g. 110001, 560001"
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all font-mono"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 active:scale-95 transition-all shadow-sm"
              >
                Apply
              </button>
            </div>
            {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
          </form>

          {/* Quick Select Cities */}
          <div>
            <span className="block mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Popular Quick-Commerce Hubs
            </span>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {POPULAR_LOCATIONS.map((loc) => {
                const isSelected = location?.pincode === loc.pincode;
                return (
                  <button
                    key={loc.pincode}
                    type="button"
                    onClick={() => setLocation(loc)}
                    className={`flex items-start justify-between p-3 text-left rounded-xl border transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/50 shadow-sm ring-1 ring-emerald-500'
                        : 'border-slate-100 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-100/60'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`mt-0.5 p-1 rounded-md ${isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
                        <Building2 className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 text-sm flex items-center gap-1.5">
                          {loc.city}
                          <span className="text-[11px] font-normal text-slate-500 font-mono">({loc.pincode})</span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1">{loc.area}</p>
                        <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                          <Zap className="w-3 h-3 fill-emerald-500 text-emerald-500" />
                          Delivery in {loc.eta}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="grid w-5 h-5 place-items-center rounded-full bg-emerald-500 text-white">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-xs text-slate-500">
          <span>Active: <strong className="text-slate-700 font-semibold">{location?.city} ({location?.pincode})</strong></span>
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="text-slate-600 hover:text-slate-900 font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
