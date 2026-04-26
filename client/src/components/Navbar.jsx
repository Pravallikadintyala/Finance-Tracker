import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { Menu, X, LayoutDashboard, History as HistoryIcon, LogOut, Wallet, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Navbar = () => {
  const { user, logout } = useAuth();
  const { currency, setCurrency, currencies } = useCurrency();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);
  const location = useLocation();

  if (!user) return null;

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'History', path: '/history', icon: HistoryIcon },
  ];

  return (
    <>
      {/* Top Header Bar */}
      <header className="bg-surface border-b border-slate-100 sticky top-0 z-40 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* Left side: Hamburger + Logo */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <Menu size={24} />
              </button>
              
              <Link to="/dashboard" className="hidden sm:flex items-center gap-2 group">
                <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white p-2 rounded-xl shadow-sm group-hover:shadow-md transition-all duration-300">
                  <Wallet size={20} />
                </div>
                <span className="font-bold text-xl text-slate-800 tracking-tight">FinanceTracker</span>
              </Link>
            </div>

            {/* Right side: Currency Selector & User info */}
            <div className="flex items-center gap-6">
              
              {/* Currency Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsCurrencyMenuOpen(!isCurrencyMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20 border border-transparent hover:border-slate-100"
                >
                  <span className="bg-primary-50 text-primary-600 w-6 h-6 flex items-center justify-center rounded-full text-sm">
                    {currency.symbol}
                  </span>
                  <span className="hidden sm:block text-sm">{currency.code}</span>
                  <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isCurrencyMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isCurrencyMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-30" 
                      onClick={() => setIsCurrencyMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 py-2 z-50 animate-fade-in">
                      {currencies.map((c) => (
                        <button
                          key={c.code}
                          onClick={() => {
                            setCurrency(c);
                            setIsCurrencyMenuOpen(false);
                          }}
                          className={cn(
                            "w-full text-left px-4 py-2 text-sm flex items-center gap-3 hover:bg-slate-50 transition-colors",
                            currency.code === c.code ? "text-primary-600 font-medium bg-primary-50/50" : "text-slate-600"
                          )}
                        >
                          <span className="w-6 text-center">{c.symbol}</span>
                          <span>{c.name}</span>
                          <span className="ml-auto text-xs text-slate-400">{c.code}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* User Avatar */}
              <div className="hidden sm:flex items-center gap-3 pl-6 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center text-white font-medium text-sm shadow-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>

            </div>
          </div>
        </div>
      </header>

      {/* Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 animate-fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sliding Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 flex items-center justify-between border-b border-slate-100">
          <Link 
            to="/dashboard" 
            onClick={() => setIsSidebarOpen(false)}
            className="flex items-center gap-2 group"
          >
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white p-2 rounded-xl shadow-sm">
              <Wallet size={20} />
            </div>
            <span className="font-bold text-xl text-slate-800 tracking-tight">FinanceTracker</span>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          <div className="mb-6 px-4 pb-6 border-b border-slate-100">
             <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Account</p>
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center text-white font-medium shadow-sm">
                  {user.name.charAt(0).toUpperCase()}
               </div>
               <div>
                 <p className="text-sm font-medium text-slate-800">{user.name}</p>
                 <p className="text-xs text-slate-500">{user.email}</p>
               </div>
             </div>
          </div>

          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 mb-2">Menu</p>
          
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 group',
                  isActive
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <Icon size={20} className={isActive ? "text-primary-600" : "text-slate-400 group-hover:text-slate-600"} />
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={() => {
              logout();
              setIsSidebarOpen(false);
            }}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
