import React from 'react';
import {
  Home,
  Search,
  Camera,
  MessageCircle,
  User,
  Shield,
  LayoutDashboard,
  Plus,
  MapPin,
} from 'lucide-react';
import { SnapSellLogo } from './Brand';

export function DesktopHeader({
  activeScreen,
  onNavigate,
  searchQuery,
  onSearchChange,
  userProfile,
  unreadChats = 1,
}) {
  const navItems = [
    { id: 2, label: 'Explore' },
    { id: 7, label: 'Chats', badge: unreadChats },
    { id: 9, label: 'Orders' },
    { id: 10, label: 'My Shop' },
    { id: 11, label: 'Admin' },
  ];

  return (
    <header className="hidden lg:block sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E8EAF2]">
      <div className="max-w-[1440px] mx-auto px-6 h-[72px] flex items-center justify-between gap-6">
        <div className="flex items-center gap-6 shrink-0">
          <button
            onClick={() => onNavigate(2)}
            className="text-left focus:outline-none cursor-pointer"
          >
            <SnapSellLogo size="sm" />
          </button>
          <div className="hidden xl:flex items-center gap-1.5 text-[13px] font-medium text-[#4E5369] bg-[#F7F7FA] px-3 py-1.5 rounded-full border border-[#E8EAF2]">
            <MapPin className="w-3.5 h-3.5 text-[#3B2FD9]" />
            <span>{userProfile.area}, Bengaluru</span>
          </div>
        </div>

        {/* Global search bar */}
        <div className="flex-1 max-w-[460px]">
          <div className="relative">
            <Search className="w-4 h-4 text-[#7C8199] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (activeScreen !== 2) onNavigate(2);
              }}
              placeholder="Search study table, Hero cycle, Prestige cooler..."
              className="w-full h-11 pl-10 pr-4 rounded-full bg-[#F7F7FA] border border-[#E8EAF2] text-[14px] text-[#111322] placeholder:text-[#7C8199] focus:bg-white focus:border-[#3B2FD9] focus:ring-3 focus:ring-[#3B2FD9]/10 outline-none transition"
            />
          </div>
        </div>

        {/* Desktop nav + Sell CTA */}
        <div className="flex items-center gap-2 shrink-0">
          {navItems.map((item) => {
            const isActive =
              activeScreen === item.id ||
              (item.id === 2 && activeScreen === 6);
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative px-3.5 py-2 rounded-xl text-[14px] font-semibold transition cursor-pointer ${
                  isActive
                    ? 'bg-[#EEF0FF] text-[#3B2FD9]'
                    : 'text-[#4E5369] hover:bg-[#F7F7FA] hover:text-[#111322]'
                }`}
              >
                {item.label}
                {item.badge > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#FF5A3D] text-white text-[11px] font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <button
            onClick={() => onNavigate(3)}
            className="ml-2 h-11 px-5 rounded-full bg-[#FF5A3D] hover:bg-[#EA472A] active:scale-[0.98] text-white text-[14px] font-semibold inline-flex items-center gap-2 shadow-coral transition cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>Sell now</span>
          </button>

          <button
            onClick={() => onNavigate(1)}
            title="Account / Sign-in screen"
            className="ml-1 w-10 h-10 rounded-full bg-[#EEF0FF] border border-[#D6DAFF] text-[#3B2FD9] font-bold text-[13px] flex items-center justify-center hover:bg-[#3B2FD9] hover:text-white transition cursor-pointer"
          >
            {userProfile.initials}
          </button>
        </div>
      </div>
    </header>
  );
}

export function BottomNav({ activeScreen, onNavigate, onSearchFocus, forceMobile = false }) {
  const isHome = activeScreen === 2 || activeScreen === 6;
  const isSell = activeScreen === 3 || activeScreen === 4 || activeScreen === 5;
  const isChats = activeScreen === 7;
  const isProfile = activeScreen === 10 || activeScreen === 9 || activeScreen === 1;

  return (
    <nav
      aria-label="Primary navigation"
      className={`${
        forceMobile
          ? 'flex shrink-0 relative'
          : 'flex lg:hidden fixed bottom-0 left-0 right-0'
      } z-40 justify-center pointer-events-none`}
    >
      <div
        className={`pointer-events-auto w-full bg-white/95 backdrop-blur-lg border-t border-[#E8EAF2] shadow-nav px-2 pt-2 pb-[max(0.65rem,env(safe-area-inset-bottom))] grid grid-cols-5 items-end`}
      >
        <button
          onClick={() => onNavigate(2)}
          className={`flex flex-col items-center justify-center gap-1 py-1 min-h-[48px] transition cursor-pointer ${
            isHome ? 'text-[#3B2FD9]' : 'text-[#7C8199]'
          }`}
        >
          <Home className="w-[22px] h-[22px]" strokeWidth={isHome ? 2.4 : 2} />
          <span className="text-[11px] font-semibold">Home</span>
        </button>

        <button
          onClick={() => {
            onNavigate(2);
            onSearchFocus?.();
          }}
          className="flex flex-col items-center justify-center gap-1 py-1 min-h-[48px] text-[#7C8199] hover:text-[#3B2FD9] transition cursor-pointer"
        >
          <Search className="w-[22px] h-[22px]" strokeWidth={2} />
          <span className="text-[11px] font-semibold">Search</span>
        </button>

        {/* Center raised coral Sell button */}
        <div className="flex flex-col items-center justify-end relative">
          <button
            onClick={() => onNavigate(3)}
            aria-label="Sell an item"
            className={`-mt-7 w-[58px] h-[58px] rounded-full bg-[#FF5A3D] hover:bg-[#EA472A] active:scale-95 text-white flex items-center justify-center shadow-coral border-[4px] border-white transition cursor-pointer ${
              isSell ? 'ring-3 ring-[#FF5A3D]/30' : ''
            }`}
          >
            <Camera className="w-6 h-6" strokeWidth={2.3} />
          </button>
          <span
            className={`text-[11px] font-bold mt-1 ${
              isSell ? 'text-[#FF5A3D]' : 'text-[#111322]'
            }`}
          >
            Sell
          </span>
        </div>

        <button
          onClick={() => onNavigate(7)}
          className={`relative flex flex-col items-center justify-center gap-1 py-1 min-h-[48px] transition cursor-pointer ${
            isChats ? 'text-[#3B2FD9]' : 'text-[#7C8199]'
          }`}
        >
          <div className="relative">
            <MessageCircle
              className="w-[22px] h-[22px]"
              strokeWidth={isChats ? 2.4 : 2}
            />
            <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-[#FF5A3D] text-white text-[10px] font-bold flex items-center justify-center border border-white">
              1
            </span>
          </div>
          <span className="text-[11px] font-semibold">Chats</span>
        </button>

        <button
          onClick={() => onNavigate(10)}
          className={`flex flex-col items-center justify-center gap-1 py-1 min-h-[48px] transition cursor-pointer ${
            isProfile ? 'text-[#3B2FD9]' : 'text-[#7C8199]'
          }`}
        >
          <User
            className="w-[22px] h-[22px]"
            strokeWidth={isProfile ? 2.4 : 2}
          />
          <span className="text-[11px] font-semibold">Profile</span>
        </button>
      </div>
    </nav>
  );
}
