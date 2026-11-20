import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  X,
  ShieldCheck,
  Sparkles,
  Camera,
  RefreshCw,
  WifiOff,
  SearchX,
} from 'lucide-react';
import {
  CATEGORIES,
  AREAS,
  CONDITIONS,
  PRICE_RANGES,
  formatINR,
} from '../data/mockData';
import { ConditionPill, SnapSellLogo } from '../components/Brand';

function ListingSkeletonCard() {
  return (
    <div className="bg-white rounded-[16px] border border-[#E8EAF2] overflow-hidden shadow-card">
      <div className="aspect-[4/3] w-full skeleton-shimmer" />
      <div className="p-3.5 space-y-2.5">
        <div className="h-4 w-3/4 rounded-md skeleton-shimmer" />
        <div className="h-5 w-1/2 rounded-md skeleton-shimmer" />
        <div className="flex items-center justify-between pt-1">
          <div className="h-3.5 w-20 rounded-md skeleton-shimmer" />
          <div className="h-5 w-14 rounded-full skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
}

export default function HomeStorefront({
  listings,
  searchQuery,
  onSearchChange,
  onSelectListing,
  onStartSelling,
  viewState = 'default', // default | loading | empty | error
  onChangeViewState,
  focusSearchTrigger = 0,
  userProfile,
  forceMobile = false,
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedArea, setSelectedArea] = useState('All Areas');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [selectedPriceId, setSelectedPriceId] = useState('all');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (focusSearchTrigger > 0) {
      searchInputRef.current?.focus();
    }
  }, [focusSearchTrigger]);

  const activePrice =
    PRICE_RANGES.find((p) => p.id === selectedPriceId) || PRICE_RANGES[0];

  const activeFilterCount =
    (selectedArea !== 'All Areas' ? 1 : 0) +
    (selectedCondition !== 'All' ? 1 : 0) +
    (selectedPriceId !== 'all' ? 1 : 0);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedArea('All Areas');
    setSelectedCondition('All');
    setSelectedPriceId('all');
    onSearchChange('');
    onChangeViewState?.('default');
  };

  const filteredListings = listings.filter((item) => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory)
      return false;
    if (selectedArea !== 'All Areas' && item.area !== selectedArea) return false;
    if (selectedCondition !== 'All' && item.condition !== selectedCondition)
      return false;
    if (item.price < activePrice.min || item.price > activePrice.max)
      return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const hay =
        `${item.title} ${item.category} ${item.area} ${item.seller.name}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const effectiveState =
    viewState !== 'default'
      ? viewState
      : filteredListings.length === 0
      ? 'empty'
      : 'default';

  const FilterControls = ({ compact = false }) => (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <h4 className="text-[13px] font-bold text-[#111322] uppercase tracking-wider mb-3">
          Price range
        </h4>
        <div className="space-y-2">
          {PRICE_RANGES.map((range) => (
            <label
              key={range.id}
              className={`flex items-center justify-between px-3 py-2.5 rounded-[12px] border cursor-pointer transition ${
                selectedPriceId === range.id
                  ? 'bg-[#EEF0FF] border-[#3B2FD9] text-[#3B2FD9] font-semibold'
                  : 'bg-white border-[#E8EAF2] text-[#4E5369] hover:border-[#3B2FD9]/40'
              }`}
            >
              <span className="text-[13px]">{range.label}</span>
              <input
                type="radio"
                name={compact ? 'price-mobile' : 'price-desktop'}
                checked={selectedPriceId === range.id}
                onChange={() => setSelectedPriceId(range.id)}
                className="accent-[#3B2FD9] w-4 h-4"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Area */}
      <div>
        <h4 className="text-[13px] font-bold text-[#111322] uppercase tracking-wider mb-3">
          Bengaluru area
        </h4>
        <div className="flex flex-wrap gap-2">
          {AREAS.map((area) => (
            <button
              key={area}
              type="button"
              onClick={() => setSelectedArea(area)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-semibold border transition cursor-pointer ${
                selectedArea === area
                  ? 'bg-[#3B2FD9] text-white border-[#3B2FD9]'
                  : 'bg-[#F7F7FA] text-[#4E5369] border-[#E8EAF2] hover:border-[#3B2FD9]/40'
              }`}
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      {/* Condition */}
      <div>
        <h4 className="text-[13px] font-bold text-[#111322] uppercase tracking-wider mb-3">
          Condition
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {CONDITIONS.map((cond) => (
            <button
              key={cond}
              type="button"
              onClick={() => setSelectedCondition(cond)}
              className={`py-2.5 px-3 rounded-[12px] text-[13px] font-semibold border transition cursor-pointer ${
                selectedCondition === cond
                  ? 'bg-[#3B2FD9] text-white border-[#3B2FD9]'
                  : 'bg-white text-[#4E5369] border-[#E8EAF2] hover:border-[#3B2FD9]/40'
              }`}
            >
              {cond}
            </button>
          ))}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <button
          type="button"
          onClick={resetFilters}
          className="w-full py-2.5 rounded-[12px] border border-[#E8EAF2] text-[13px] font-semibold text-[#4E5369] hover:text-[#111322] hover:bg-[#F7F7FA] transition cursor-pointer"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="pb-28 lg:pb-12">
      {/* Mobile Header + Search */}
      <div
        className={`${
          forceMobile ? 'block' : 'block lg:hidden'
        } sticky top-0 z-20 bg-[#F7F7FA]/95 backdrop-blur-md px-4 pt-3 pb-3 border-b border-[#E8EAF2]/80`}
      >
        <div className="flex items-center justify-between mb-3">
          <SnapSellLogo size="sm" />
          <div className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#111322] bg-white px-2.5 py-1.5 rounded-full border border-[#E8EAF2] shadow-card">
            <MapPin className="w-3.5 h-3.5 text-[#3B2FD9]" />
            <span>{userProfile.area}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#7C8199] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search study table, cycle, books..."
              className="w-full h-[46px] pl-10 pr-9 rounded-[14px] bg-white border border-[#E8EAF2] text-[14px] text-[#111322] placeholder:text-[#7C8199] focus:border-[#3B2FD9] outline-none shadow-card transition"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7C8199] hover:text-[#111322]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setMobileFiltersOpen(true)}
            aria-label="Open filters"
            className={`relative h-[46px] px-3.5 rounded-[14px] border flex items-center gap-1.5 font-semibold text-[13px] shadow-card transition cursor-pointer ${
              activeFilterCount > 0
                ? 'bg-[#3B2FD9] text-white border-[#3B2FD9]'
                : 'bg-white text-[#111322] border-[#E8EAF2]'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden xs:inline">Filter</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#FF5A3D] text-white text-[11px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Responsive Layout */}
      <div className="max-w-[1440px] mx-auto px-4 lg:px-6 pt-4 lg:pt-6">
        {/* SafePay Local Banner */}
        <div className="mb-4 lg:mb-6 bg-gradient-to-r from-[#3B2FD9] to-[#5246EC] rounded-[16px] p-4 sm:p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-indigo">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-white/15 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#A7F3D0]" />
            </div>
            <div>
              <div className="text-[14px] sm:text-[15px] font-bold leading-snug">
                SafePay protected local deals near {userProfile.area}
              </div>
              <div className="text-[12px] sm:text-[13px] text-white/80">
                Money stays held safely until you inspect the item & share your 4-digit handover code.
              </div>
            </div>
          </div>
          <button
            onClick={onStartSelling}
            className="self-start sm:self-center shrink-0 px-4 py-2.5 rounded-full bg-[#FF5A3D] hover:bg-[#EA472A] text-white text-[13px] font-bold inline-flex items-center gap-1.5 shadow-coral transition cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>Snap & Sell in 2 min</span>
          </button>
        </div>

        {/* Category Chips + State Variant Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`shrink-0 px-4 py-2 rounded-full text-[13px] font-semibold border transition cursor-pointer ${
                    active
                      ? 'bg-[#3B2FD9] text-white border-[#3B2FD9] shadow-sm'
                      : 'bg-white text-[#4E5369] border-[#E8EAF2] hover:border-[#3B2FD9]/40 hover:text-[#111322]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Inline state switcher for easy review of variants */}
          <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-auto bg-white p-1 rounded-full border border-[#E8EAF2] text-[11px] font-semibold">
            {[
              { id: 'default', label: 'Live' },
              { id: 'loading', label: 'Skeleton' },
              { id: 'empty', label: 'Empty' },
              { id: 'error', label: 'Error' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => onChangeViewState?.(st.id)}
                className={`px-2.5 py-1 rounded-full transition cursor-pointer ${
                  viewState === st.id
                    ? 'bg-[#111322] text-white'
                    : 'text-[#7C8199] hover:text-[#111322]'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Left Sidebar + 4-Col Grid | Mobile 2-Col Grid */}
        <div className={`flex gap-7 items-start`}>
          {/* Desktop Left Filter Sidebar */}
          {!forceMobile && (
            <aside className="hidden lg:block w-[268px] shrink-0 sticky top-[96px] bg-white rounded-[16px] border border-[#E8EAF2] p-5 shadow-card">
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#E8EAF2]">
                <div className="flex items-center gap-2 font-bold text-[15px] text-[#111322]">
                  <SlidersHorizontal className="w-4 h-4 text-[#3B2FD9]" />
                  <span>Filters</span>
                </div>
                {activeFilterCount > 0 && (
                  <span className="text-[11px] font-bold bg-[#EEF0FF] text-[#3B2FD9] px-2 py-0.5 rounded-full">
                    {activeFilterCount} active
                  </span>
                )}
              </div>
              <FilterControls />
            </aside>
          )}

          {/* Main Grid Area */}
          <div className="flex-1 min-w-0">
            {/* Count Row */}
            {effectiveState === 'default' && (
              <div className="flex items-center justify-between mb-3.5">
                <p className="text-[13px] font-semibold text-[#4E5369]">
                  Showing{' '}
                  <span className="text-[#111322] font-bold">
                    {filteredListings.length} verified items
                  </span>{' '}
                  nearby
                </p>
                {activeFilterCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="text-[12px] font-semibold text-[#3B2FD9] hover:underline cursor-pointer"
                  >
                    Reset filters
                  </button>
                )}
              </div>
            )}

            {/* LOADING SKELETON VARIANT */}
            {effectiveState === 'loading' && (
              <div
                className={`grid gap-3.5 sm:gap-4 ${
                  forceMobile
                    ? 'grid-cols-2'
                    : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                }`}
              >
                {Array.from({ length: 8 }).map((_, idx) => (
                  <ListingSkeletonCard key={idx} />
                ))}
              </div>
            )}

            {/* EMPTY STATE VARIANT */}
            {effectiveState === 'empty' && (
              <div className="bg-white rounded-[16px] border border-[#E8EAF2] p-8 sm:p-12 text-center shadow-card max-w-[520px] mx-auto my-6">
                <div className="w-16 h-16 rounded-[18px] bg-[#EEF0FF] text-[#3B2FD9] flex items-center justify-center mx-auto mb-4">
                  <SearchX className="w-8 h-8" />
                </div>
                <h3 className="text-[19px] font-extrabold text-[#111322]">
                  No items match your filters
                </h3>
                <p className="text-[14px] text-[#4E5369] mt-1.5 max-w-[340px] mx-auto">
                  Try widening your price range or checking neighbouring areas like Indiranagar and HSR Layout.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={resetFilters}
                    className="w-full sm:w-auto px-6 h-12 rounded-[14px] bg-[#3B2FD9] hover:bg-[#2E23B8] text-white text-[14px] font-bold transition cursor-pointer"
                  >
                    Clear all filters
                  </button>
                  <button
                    onClick={onStartSelling}
                    className="w-full sm:w-auto px-6 h-12 rounded-[14px] bg-[#FFF1EE] text-[#FF5A3D] hover:bg-[#FFE3DC] text-[14px] font-bold transition cursor-pointer"
                  >
                    Sell an item instead
                  </button>
                </div>
              </div>
            )}

            {/* ERROR STATE VARIANT */}
            {effectiveState === 'error' && (
              <div className="bg-white rounded-[16px] border border-[#FECACA] p-8 sm:p-12 text-center shadow-card max-w-[520px] mx-auto my-6">
                <div className="w-16 h-16 rounded-[18px] bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center mx-auto mb-4">
                  <WifiOff className="w-8 h-8" />
                </div>
                <h3 className="text-[19px] font-extrabold text-[#111322]">
                  Couldn’t load nearby listings
                </h3>
                <p className="text-[14px] text-[#4E5369] mt-1.5 max-w-[340px] mx-auto">
                  Looks like your connection dropped for a moment. Tap retry to refresh listings around {userProfile.area}.
                </p>
                <button
                  onClick={() => onChangeViewState?.('default')}
                  className="mt-6 px-6 h-12 rounded-[14px] bg-[#3B2FD9] hover:bg-[#2E23B8] text-white text-[14px] font-bold inline-flex items-center gap-2 transition cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Try again</span>
                </button>
              </div>
            )}

            {/* DEFAULT POPULATED GRID */}
            {effectiveState === 'default' && (
              <div
                className={`grid gap-3.5 sm:gap-4 ${
                  forceMobile
                    ? 'grid-cols-2'
                    : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                }`}
              >
                {filteredListings.map((item) => (
                  <article
                    key={item.id}
                    onClick={() => onSelectListing(item)}
                    className="group bg-white rounded-[16px] border border-[#E8EAF2] overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition duration-200 cursor-pointer flex flex-col"
                  >
                    <div className="relative aspect-[4/3] bg-[#F1F2F7] overflow-hidden">
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-300"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <ConditionPill condition={item.condition} />
                      </div>
                      {item.status === 'sold' && (
                        <div className="absolute inset-0 bg-[#111322]/55 flex items-center justify-center">
                          <span className="px-3.5 py-1 rounded-full bg-white text-[#111322] font-extrabold text-[12px] tracking-wide uppercase">
                            Sold
                          </span>
                        </div>
                      )}
                      {item.aiVerified && item.status !== 'sold' && (
                        <div
                          title="AI-checked listing"
                          className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm text-[#157F3E] px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 shadow-sm"
                        >
                          <ShieldCheck className="w-3 h-3" />
                          <span>SafePay</span>
                        </div>
                      )}
                    </div>

                    <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-[17px] sm:text-[18px] font-extrabold text-[#111322] tabular-nums leading-tight">
                          {formatINR(item.price)}
                        </div>
                        <h3 className="text-[13px] sm:text-[14px] font-semibold text-[#111322] mt-1 line-clamp-2 leading-snug group-hover:text-[#3B2FD9] transition">
                          {item.title}
                        </h3>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-[#F1F2F7] flex items-center justify-between gap-1 text-[11px] sm:text-[12px] text-[#7C8199]">
                        <span className="inline-flex items-center gap-1 truncate font-medium text-[#4E5369]">
                          <MapPin className="w-3 h-3 text-[#3B2FD9] shrink-0" />
                          <span className="truncate">{item.area}</span>
                        </span>
                        <span className="shrink-0">{item.seller.name}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Bottom Sheet */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#111322]/45 backdrop-blur-[2px]">
          <div
            className={`w-full ${
              forceMobile ? 'max-w-[390px]' : 'max-w-[520px]'
            } bg-white rounded-t-[24px] max-h-[85vh] flex flex-col shadow-2xl`}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8EAF2]">
              <div className="flex items-center gap-2 font-extrabold text-[17px] text-[#111322]">
                <SlidersHorizontal className="w-4 h-4 text-[#3B2FD9]" />
                <span>Filter listings</span>
              </div>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-9 h-9 rounded-full bg-[#F7F7FA] flex items-center justify-center text-[#4E5369]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 overflow-y-auto">
              <FilterControls compact />
            </div>
            <div className="p-4 border-t border-[#E8EAF2] bg-white">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full h-[52px] rounded-[16px] bg-[#3B2FD9] text-white font-bold text-[15px] shadow-indigo cursor-pointer"
              >
                Show {filteredListings.length} results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
