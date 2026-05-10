import React, { useEffect, useState } from 'react';
import { ShoppingCart, Menu, X, Search, LogOut } from 'lucide-react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const { getTotalItems } = useCart();
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('search') || '';
    setSearchValue(query);
  }, [location.search]);

  const handleSearchChange = (value) => {
    setSearchValue(value);
    const query = value.trim();
    if (query) {
      navigate(`/shop?search=${encodeURIComponent(query)}`);
    } else {
      navigate('/shop');
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
      setIsMenuOpen(false);
    }
  };

  const handleShopTap = (event) => {
    event.preventDefault();
    setIsMenuOpen(false);
    navigate('/shop', { state: { refreshShopAt: Date.now() } });
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-[auto,1fr,auto] items-center h-16 gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <NavLink to="/">
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-charcoal">arwas_world</h1>
              <p className="text-xs text-gray-custom tracking-widest hidden sm:block">Simply Elegant</p>
            </NavLink>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex justify-center space-x-8">
            <NavLink to="/shop" onClick={handleShopTap} className={({ isActive }) => isActive ? "text-charcoal font-semibold border-b-2 border-charcoal" : "text-charcoal hover:text-gray-custom transition"}>
              Shop
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => isActive ? "text-charcoal font-semibold border-b-2 border-charcoal" : "text-charcoal hover:text-gray-custom transition"}>
              About
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => isActive ? "text-charcoal font-semibold border-b-2 border-charcoal" : "text-charcoal hover:text-gray-custom transition"}>
              Contact
            </NavLink>
          </div>

          {/* Right Icons */}
          <div className="flex items-center justify-end gap-4 sm:gap-6">
            {/* Desktop Search */}
            <div className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchValue}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-40 lg:w-64 pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-charcoal/20"
                />
              </div>
            </div>

            {/* Mobile Search Toggle */}
            <button
              className="md:hidden"
              onClick={() => setIsSearchOpen((prev) => !prev)}
              aria-label="Toggle search"
            >
              <Search className="w-5 h-5 text-charcoal" />
            </button>
            
            {/* Account / Auth Links */}
            {isLoggedIn() ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-charcoal hidden sm:inline">
                  Hi, {user?.firstName}
                </span>
                {user && user.role === 'admin' && (
                  <NavLink to="/admin" className="text-charcoal hover:text-gray-custom transition text-sm font-semibold bg-yellow-100 px-3 py-1 rounded">
                    Admin
                  </NavLink>
                )}
                <NavLink to="/orders" className="text-charcoal hover:text-gray-custom transition text-sm font-semibold">
                  Orders
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="text-charcoal hover:text-gray-custom transition flex items-center gap-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-4">
                <NavLink to="/login" className="text-charcoal hover:text-gray-custom transition text-sm">
                  Login
                </NavLink>
                <NavLink to="/register" className="text-charcoal hover:text-gray-custom transition text-sm font-semibold">
                  Register
                </NavLink>
              </div>
            )}

            {!isLoggedIn() && (
              <NavLink to="/login" className="text-charcoal hover:text-gray-custom transition sm:hidden">
                Account
              </NavLink>
            )}

            <NavLink to="/cart" className="relative">
              <ShoppingCart className="w-5 h-5 text-charcoal cursor-pointer" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-charcoal text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {getTotalItems()}
                </span>
              )}
            </NavLink>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-charcoal" />
              ) : (
                <Menu className="w-6 h-6 text-charcoal" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="md:hidden pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchValue}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-charcoal/20"
              />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <NavLink
              to="/shop"
              onClick={handleShopTap}
              className={({ isActive }) => isActive ? "block text-charcoal font-semibold" : "block text-charcoal hover:text-gray-custom"}
            >
              Shop
            </NavLink>
            <NavLink
              to="/about"
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) => isActive ? "block text-charcoal font-semibold" : "block text-charcoal hover:text-gray-custom"}
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) => isActive ? "block text-charcoal font-semibold" : "block text-charcoal hover:text-gray-custom"}
            >
              Contact
            </NavLink>
            <NavLink
              to="/cart"
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) => isActive ? "block text-charcoal font-semibold" : "block text-charcoal hover:text-gray-custom"}
            >
              Cart ({getTotalItems()})
            </NavLink>
            {isLoggedIn() ? (
              <>
                {user && user.role === 'admin' && (
                  <NavLink
                    to="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-charcoal hover:text-gray-custom font-semibold bg-yellow-100 px-3 py-2 rounded"
                  >
                    Admin Panel
                  </NavLink>
                )}
                <NavLink
                  to="/orders"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-charcoal hover:text-gray-custom"
                >
                  My Orders
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-charcoal hover:text-gray-custom"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-charcoal hover:text-gray-custom"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-charcoal hover:text-gray-custom"
                >
                  Register
                </NavLink>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
