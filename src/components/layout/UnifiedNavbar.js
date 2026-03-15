// NAVBAR UNIFIED COMPONENT
// Gunakan component ini di Landing Page, Dashboard, dan Community

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Menu, LogIn, LogOut, Users, BookOpen, Settings, Activity, TrendingUp, Wallet, X, ArrowLeft, ChevronDown } from 'lucide-react';
import { CoinBalance } from '../common/CoinBalance';
import { useStats } from '../../context/StatsContext';

export const UnifiedNavbar = ({ 
  user, 
  onLogin, 
  onLogout, 
  navigate, 
  setView,
  isAdmin = false,
  showMobileMenu,
  setShowMobileMenu,
  variant = 'default',
  showBackButton = false,
  onBack = null,
  onBuyCoin = null,
  coinBalance = 0,
}) => {
  const statsContext = useStats();
  const { hariIni = 0, bankSoal = 0, kredit = 0, isLoading = true } = statsContext?.stats || {};
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const displayHariIni = isLoading ? '-' : hariIni;
  const displayBankSoal = isLoading ? '-' : bankSoal;
  const displayKredit = isLoading ? '-' : kredit;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Update background style
      setIsScrolled(currentScrollY > 50);
      
      // Hide/show logic - hanya muncul saat di puncak
      if (currentScrollY === 0) {
        setIsHidden(false);
      } else if (currentScrollY > 50) {
        setIsHidden(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl transition-all duration-700 ease-out ${
        isHidden ? 'opacity-0 -translate-y-full pointer-events-none' : 'opacity-100 translate-y-0'
      }`}>
        <div className={`backdrop-blur-xl rounded-3xl border px-6 py-3 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/90 border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.08)]' 
            : 'bg-white/70 border-gray-200 shadow-lg'
        }`}>
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-3">
              {showBackButton && onBack && (
                <button onClick={onBack} className="p-2 hover:bg-gray-50 rounded-lg transition-all">
                  <ArrowLeft size={18} className="text-gray-600" />
                </button>
              )}
              <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                <Sparkles className="w-5 h-5 text-violet-600" strokeWidth={2} />
              </div>
              <div>
                <div className="text-base font-bold text-gray-900">SNBT AI</div>
                <div className="text-[10px] text-gray-500 font-medium">
                  {variant === 'dashboard' ? 'Dashboard' : variant === 'community' ? 'Community' : 'Learning Platform'}
                </div>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-2">
              {user && (
                <>
                  <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-all duration-500">
                    <Activity className="w-4 h-4 text-indigo-600" strokeWidth={2} />
                    <span className="text-sm font-semibold text-gray-900">{displayHariIni}</span>
                    <span className="text-xs text-gray-500">hari ini</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-all duration-500">
                    <TrendingUp className="w-4 h-4 text-emerald-600" strokeWidth={2} />
                    <span className="text-sm font-semibold text-gray-900">{displayBankSoal}</span>
                    <span className="text-xs text-gray-500">bank</span>
                  </div>
                  <button
                    onClick={() => { setView?.('AMBIS_COIN_PRICING'); navigate?.('/dashboard/ambis-coin'); }}
                    className="flex items-center gap-1.5 px-3 py-2 bg-violet-50 rounded-lg border border-violet-200 hover:border-violet-300 transition-all duration-500 cursor-pointer"
                  >
                    <Wallet className="w-4 h-4 text-violet-600" strokeWidth={2} />
                    <span className="text-sm font-semibold text-violet-900">{coinBalance}</span>
                    <span className="text-xs text-violet-500">coin</span>
                  </button>

                  {variant !== 'dashboard' && (
                    <button onClick={() => { setView?.('DASHBOARD'); navigate?.('/dashboard/overview'); }} className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-500">
                      <Users size={16} strokeWidth={2} />
                      <span className="text-sm font-medium">Dashboard</span>
                    </button>
                  )}
                  {variant !== 'community' && (
                    <button onClick={() => { setView?.('COMMUNITY'); navigate?.('/community'); }} className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-500">
                      <Users size={16} strokeWidth={2} />
                      <span className="text-sm font-medium">Community</span>
                    </button>
                  )}
                </>
              )}

              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-all duration-500"
                  >
                    <img src={user.photoURL} alt={user.displayName} className="w-5 h-5 rounded-full" />
                    <span className="text-sm font-medium text-gray-900">{user.displayName?.split(' ')[0]}</span>
                    <ChevronDown size={14} className={`text-gray-500 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                      <button
                        onClick={() => {
                          navigate?.('/settings');
                          setShowProfileDropdown(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Settings size={16} />
                        <span>Pengaturan</span>
                      </button>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={() => {
                          onLogout();
                          setShowProfileDropdown(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={onLogin} className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-all duration-500 shadow-sm">
                  <LogIn size={14} strokeWidth={2} />
                  <span className="text-sm font-medium">Login</span>
                </button>
              )}

              <button onClick={() => navigate?.('/rules')} className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-500">
                <BookOpen size={16} strokeWidth={2} />
              </button>

              {isAdmin && (
                <button onClick={() => navigate?.('/superuser')} className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-500">
                  <Settings size={16} strokeWidth={2} />
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setShowMobileMenu?.(!showMobileMenu)} 
              className="md:hidden p-2 text-gray-600 relative w-10 h-10 flex items-center justify-center"
            >
              <div className="relative w-5 h-5">
                <span className={`absolute left-0 top-1 w-5 h-0.5 bg-gray-600 rounded-full transition-all duration-300 ease-out ${
                  showMobileMenu ? 'rotate-45 translate-y-1.5' : 'rotate-0 translate-y-0'
                }`}></span>
                <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-5 h-0.5 bg-gray-600 rounded-full transition-all duration-300 ease-out ${
                  showMobileMenu ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                }`}></span>
                <span className={`absolute left-0 bottom-1 w-5 h-0.5 bg-gray-600 rounded-full transition-all duration-300 ease-out ${
                  showMobileMenu ? '-rotate-45 -translate-y-1.5' : 'rotate-0 translate-y-0'
                }`}></span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ease-out ${
        showMobileMenu ? 'pointer-events-auto' : 'pointer-events-none'
      }`}>
        <div 
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-out ${
            showMobileMenu ? 'opacity-100' : 'opacity-0'
          }`} 
          onClick={() => setShowMobileMenu?.(false)}
        ></div>
        <div className={`absolute top-0 right-0 h-full w-64 bg-white shadow-2xl transition-transform duration-300 ease-out ${
          showMobileMenu ? 'translate-x-0' : 'translate-x-full'
        }`}>
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b">
                <span className="font-bold text-slate-900">Menu</span>
                <button onClick={() => setShowMobileMenu?.(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>
              
              {user && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{user.displayName}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 p-3 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-lg font-bold text-indigo-600">{displayHariIni}</div>
                      <div className="text-xs text-gray-500">Hari ini</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-emerald-600">{displayBankSoal}</div>
                      <div className="text-xs text-gray-500">Bank</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-violet-600">{coinBalance}</div>
                      <div className="text-xs text-gray-500">Coin</div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => { setView?.('AMBIS_COIN_PRICING'); navigate?.('/dashboard/ambis-coin'); setShowMobileMenu?.(false); }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold text-sm hover:from-violet-700 hover:to-purple-700 transition-all shadow-sm"
                  >
                    <Wallet className="w-4 h-4" strokeWidth={2} />
                    Isi Ulang Coin
                  </button>


                  
                  {variant !== 'dashboard' && (
                    <button onClick={() => { setView?.('DASHBOARD'); navigate?.('/dashboard/overview'); setShowMobileMenu?.(false); }} className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-all">
                      <Users size={18} />
                      <span className="text-sm font-medium">Dashboard</span>
                    </button>
                  )}
                  
                  {variant !== 'community' && (
                    <button onClick={() => { setView?.('COMMUNITY'); navigate?.('/community'); setShowMobileMenu?.(false); }} className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-all">
                      <Users size={18} />
                      <span className="text-sm font-medium">Community</span>
                    </button>
                  )}
                  
                  <button onClick={() => { navigate?.('/settings'); setShowMobileMenu?.(false); }} className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-all">
                    <Settings size={18} />
                    <span className="text-sm font-medium">Pengaturan</span>
                  </button>
                  
                  <button onClick={() => { navigate?.('/rules'); setShowMobileMenu?.(false); }} className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-all">
                    <BookOpen size={18} />
                    <span className="text-sm font-medium">Panduan</span>
                  </button>
                  
                  {isAdmin && (
                    <button onClick={() => { navigate?.('/superuser'); setShowMobileMenu?.(false); }} className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-all">
                      <Settings size={18} />
                      <span className="text-sm font-medium">Admin Panel</span>
                    </button>
                  )}
                  
                  {showBackButton && onBack && (
                    <button onClick={() => { onBack(); setShowMobileMenu?.(false); }} className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-all">
                      <ArrowLeft size={18} />
                      <span className="text-sm font-medium">Kembali</span>
                    </button>
                  )}
                  
                  <button onClick={() => { onLogout(); setShowMobileMenu?.(false); }} className="w-full flex items-center gap-3 p-3 text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                    <LogOut size={18} />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              )}
              
              {!user && (
                <div className="space-y-3">
                  <button onClick={() => { onLogin(); setShowMobileMenu?.(false); }} className="w-full flex items-center justify-center gap-2 p-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-all">
                    <LogIn size={18} />
                    <span className="text-sm font-medium">Login dengan Google</span>
                  </button>
                  
                  <button onClick={() => { navigate?.('/rules'); setShowMobileMenu?.(false); }} className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-all">
                    <BookOpen size={18} />
                    <span className="text-sm font-medium">Panduan</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
    </>
  );
};

export default UnifiedNavbar;
