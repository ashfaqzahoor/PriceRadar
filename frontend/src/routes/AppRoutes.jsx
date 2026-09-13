import { Navigate, Route, Routes } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout.jsx';
import { Home } from '../pages/Home.jsx';
import { Login } from '../pages/Login.jsx';
import { NotFound } from '../pages/NotFound.jsx';
import { ProductDetails } from '../pages/ProductDetails.jsx';
import { Profile } from '../pages/Profile.jsx';
import { Register } from '../pages/Register.jsx';
import { SearchResults } from '../pages/SearchResults.jsx';
import { Wishlist } from '../pages/Wishlist.jsx';
import { BasketPage } from '../pages/BasketPage.jsx';
import { useAuth } from '../hooks/useAuth.js';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/products/:productKey" element={<ProductDetails />} />
        <Route path="/basket" element={<BasketPage />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
