import { useState } from 'react';
import { Bell, Check, X, ShieldCheck } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice.js';

export function PriceAlertModal({ isOpen, onClose, product, currentLowest }) {
  const [targetPrice, setTargetPrice] = useState(
    currentLowest ? Math.round(currentLowest * 0.95) : 100
  );
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md overflow-hidden bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 space-y-5 animate-slideUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-100 text-emerald-600">
              <Check className="h-7 w-7 stroke-[3]" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Price Drop Alert Set!</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              We will notify you immediately when {product?.name} drops to or below {formatPrice(targetPrice)}.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Set Price Drop Alert</h3>
                <p className="text-xs text-slate-500">Never miss a flash sale or price drop</p>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-3.5 flex items-center gap-3">
              <img
                src={product?.imageUrl}
                alt={product?.name}
                className="h-12 w-12 rounded-xl object-contain bg-white p-1 border border-slate-200"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-800 line-clamp-1">{product?.name}</p>
                <p className="text-[11px] text-slate-500">Current Best: <strong className="text-emerald-700 font-bold">{formatPrice(currentLowest)}</strong></p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1.5">
                  Notify Me When Price Drops To (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    min={1}
                    max={currentLowest ? currentLowest * 1.5 : 10000}
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(Number(e.target.value))}
                    required
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-bold text-base focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 font-mono"
                  />
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  {[0.95, 0.90, 0.85].map((factor) => {
                    const preset = Math.round(currentLowest * factor);
                    return (
                      <button
                        key={factor}
                        type="button"
                        onClick={() => setTargetPrice(preset)}
                        className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition-colors"
                      >
                        {Math.round((1 - factor) * 100)}% Drop (₹{preset})
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1.5">
                  Your Alert Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-slate-900 text-white font-semibold text-xs uppercase tracking-wider hover:bg-slate-800 active:scale-95 transition-all shadow-sm"
                >
                  Activate Deal Alert
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
