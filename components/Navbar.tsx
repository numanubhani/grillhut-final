
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Sun, Moon, User, LayoutDashboard, LogOut, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Navbar: React.FC = () => {
  const { isDarkMode, toggleDarkMode, isAdmin, setAdminStatus, cart, setIsCartOpen } = useApp();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-[60] w-full glass-effect border-b border-zinc-200/50 dark:border-zinc-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 fancy-gradient rounded-2xl flex items-center justify-center text-white shadow-xl shadow-orange-500/30 transition-transform group-hover:scale-110 group-active:scale-95">
                <Flame className="w-7 h-7 fill-white/20" />
              </div>
              <span className="text-2xl font-serif font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-600 dark:from-white dark:via-zinc-200 dark:to-zinc-500">
                GRILL HUT
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-3 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all active:scale-90"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-orange-400" /> : <Moon className="w-5 h-5 text-zinc-600" />}
            </button>

            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-3 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all active:scale-90"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-2 right-2 w-5 h-5 bg-orange-600 text-white text-[10px] font-black flex items-center justify-center rounded-full animate-in zoom-in ring-4 ring-white dark:ring-zinc-900">
                  {cartCount}
                </span>
              )}
            </button>

            {isAdmin ? (
              <div className="flex items-center gap-2">
                <Link 
                  to="/admin"
                  className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-lg"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={() => setAdminStatus(false)}
                  className="p-3 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link 
                to="/admin/login"
                className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-lg"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Up / Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
