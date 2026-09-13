import { ChevronDown, Heart, LogOut, MapPin, Radar, User, Zap } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useLocation } from '../../context/LocationContext.jsx';
import { LocationModal } from './LocationModal.jsx';

export function Navbar() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { location, setIsModalOpen } = useLocation();
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs transition-all">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link to="/" className="group flex items-center gap-2.5 font-bold text-slate-900 tracking-tight">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Radar className="h-5 w-5 animate-pulse" />
              </span>
              <div className="flex flex-col">
                <span className="text-lg leading-tight font-extrabold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
                  PriceRadar
                </span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-emerald-600">
                  Live Grocery Intel
                </span>
              </div>
            </Link>

            {/* Location Pill */}
            <button
              onClick={() => setIsModalOpen(true)}
              type="button"
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200/80 bg-slate-50/80 hover:bg-slate-100/80 text-xs text-slate-700 transition-all hover:border-emerald-500/50 group"
              title="Click to change delivery location"
            >
              <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <MapPin className="h-3.5 w-3.5" />
              </span>
              <div className="text-left leading-tight">
                <span className="font-semibold text-slate-800 block">
                  {location?.city || 'Delhi NCR'}
                  <span className="text-[11px] font-mono text-slate-500 ml-1">({location?.pincode || '110001'})</span>
                </span>
                <span className="text-[10px] text-emerald-600 flex items-center gap-0.5 font-medium">
                  <Zap className="h-2.5 w-2.5 fill-emerald-600" /> ~{location?.eta || '10 min'} delivery
                </span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 ml-1" />
            </button>
          </div>

          {/* Right Navigation */}
          <nav className="flex items-center gap-2 text-sm font-medium">
            <button
              onClick={() => setIsModalOpen(true)}
              type="button"
              className="md:hidden grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-emerald-600 hover:bg-emerald-50"
              title="Change Delivery Location"
            >
              <MapPin className="h-4 w-4" />
            </button>

            <NavLink
              to="/wishlist"
              className={({ isActive }) =>
                `relative inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-slate-600 transition-all hover:bg-slate-100/80 hover:text-slate-900 ${
                  isActive ? 'bg-slate-100 text-slate-900 font-semibold' : ''
                }`
              }
            >
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Saved</span>
              {wishlistItems.length > 0 && (
                <span className="grid h-4.5 min-w-[18px] place-items-center rounded-full bg-emerald-500 px-1 text-[11px] font-bold text-white">
                  {wishlistItems.length}
                </span>
              )}
            </NavLink>

            {user ? (
              <div className="flex items-center gap-1.5 pl-1">
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `inline-flex items-center gap-2 rounded-xl px-3 py-2 text-slate-700 transition-all hover:bg-slate-100 hover:text-slate-900 ${
                      isActive ? 'bg-slate-100 font-semibold' : ''
                    }`
                  }
                >
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-slate-900 text-xs text-white font-semibold">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                  <span className="hidden sm:inline font-medium text-xs">{user.name}</span>
                </NavLink>
                <button
                  onClick={() => dispatch(logout())}
                  className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                  title="Log out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 active:scale-95 transition-all"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </header>
      <LocationModal />
    </>
  );
}

