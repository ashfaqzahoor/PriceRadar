import { ChevronDown, Heart, LogOut, MapPin, Radar, ShoppingBag, User } from 'lucide-react';
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
  const { items: basketItems } = useSelector((state) => state.basket);

  const totalBasketUnits = basketItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Brand Logo */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link to="/" className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-green-700 text-white font-bold">
                <Radar className="h-4 w-4" />
              </span>
              <span className="text-lg font-bold tracking-tight text-gray-900">
                PriceRadar
              </span>
            </Link>

            {/* Location Pill: plain, honest language */}
            <button
              onClick={() => setIsModalOpen(true)}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-gray-50 hover:bg-gray-100 text-xs text-gray-700 transition-colors"
            >
              <MapPin className="h-3.5 w-3.5 text-gray-500 shrink-0" />
              <span className="font-medium text-gray-800">
                Delivering to {location?.area || location?.city || 'Connaught Place'}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400 ml-0.5" />
            </button>
          </div>

          {/* Right Navigation */}
          <nav className="flex items-center gap-3 text-sm font-medium">
            {/* Basket Link */}
            <NavLink
              to="/basket"
              className={({ isActive }) =>
                `relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors ${
                  isActive ? 'text-green-800 font-semibold' : 'text-gray-600 hover:text-gray-900'
                }`
              }
              title="View Multi-Store Basket"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Basket</span>
              {totalBasketUnits > 0 && (
                <span className="ml-0.5 rounded-full bg-green-700 px-1.5 py-0.2 text-[11px] font-bold text-white tabular-nums">
                  {totalBasketUnits}
                </span>
              )}
            </NavLink>

            {/* Saved Items */}
            <NavLink
              to="/wishlist"
              className={({ isActive }) =>
                `relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors ${
                  isActive ? 'text-green-800 font-semibold' : 'text-gray-600 hover:text-gray-900'
                }`
              }
            >
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Saved</span>
              {wishlistItems.length > 0 && (
                <span className="ml-0.5 rounded-full bg-gray-200 px-1.5 py-0.2 text-[11px] font-semibold text-gray-700 tabular-nums">
                  {wishlistItems.length}
                </span>
              )}
            </NavLink>

            {user ? (
              <div className="flex items-center gap-2 pl-1">
                <NavLink
                  to="/profile"
                  className="flex items-center gap-1.5 text-xs font-medium text-gray-700 hover:text-gray-900"
                >
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-gray-200 text-xs font-semibold text-gray-800">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                  <span className="hidden sm:inline">{user.name}</span>
                </NavLink>
                <button
                  onClick={() => dispatch(logout())}
                  className="p-1.5 text-gray-400 hover:text-red-600 rounded-md transition-colors"
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="rounded-lg bg-gray-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-gray-800 transition-colors"
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

