import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  MessageCircle,
  Star,
  Store,
  Heart,
  Share2,
  Clock,
} from 'lucide-react';
import { formatINR } from '../data/mockData';
import { ConditionPill, VerifiedBadge } from '../components/Brand';

export default function ListingDetail({
  listing,
  soldMode = false,
  onToggleSoldMode,
  onBack,
  onChat,
  onBuySafePay,
  onViewShop,
  forceMobile = false,
}) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [saved, setSaved] = useState(false);

  const images =
    listing.images && listing.images.length > 0
      ? listing.images
      : ['./images/study-table-1.jpg'];

  const isSold = soldMode || listing.status === 'sold';

  const nextSlide = () => setActiveSlide((i) => (i + 1) % images.length);
  const prevSlide = () =>
    setActiveSlide((i) => (i - 1 + images.length) % images.length);

  return (
    <div className="pb-36 lg:pb-14">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-6 pt-4 lg:pt-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#4E5369] hover:text-[#111322] cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to listings</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Toggle Active / Sold state variant */}
            <div className="inline-flex items-center bg-white p-1 rounded-full border border-[#E8EAF2] text-[11px] font-bold">
              <button
                type="button"
                onClick={() => onToggleSoldMode?.(false)}
                className={`px-2.5 py-1 rounded-full transition cursor-pointer ${
                  !isSold ? 'bg-[#3B2FD9] text-white' : 'text-[#7C8199]'
                }`}
              >
                Available
              </button>
              <button
                type="button"
                onClick={() => onToggleSoldMode?.(true)}
                className={`px-2.5 py-1 rounded-full transition cursor-pointer ${
                  isSold ? 'bg-[#111322] text-white' : 'text-[#7C8199]'
                }`}
              >
                Sold state
              </button>
            </div>

            <button
              type="button"
              onClick={() => setSaved((s) => !s)}
              aria-label="Save item"
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition cursor-pointer ${
                saved
                  ? 'bg-[#FFF1EE] border-[#FF5A3D] text-[#FF5A3D]'
                  : 'bg-white border-[#E8EAF2] text-[#4E5369] hover:text-[#111322]'
              }`}
            >
              <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
            </button>
            <button
              type="button"
              aria-label="Share listing"
              className="w-10 h-10 rounded-full bg-white border border-[#E8EAF2] text-[#4E5369] hover:text-[#111322] flex items-center justify-center transition cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sold Banner if Sold Variant */}
        {isSold && (
          <div className="mb-4 bg-[#111322] text-white rounded-[16px] px-4 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#4ADE80] shrink-0" />
              <div>
                <div className="text-[14px] font-bold">
                  This item has been sold via SafePay
                </div>
                <div className="text-[12px] text-white/75">
                  Handed over safely in {listing.area}. Explore similar verified items nearby.
                </div>
              </div>
            </div>
            <button
              onClick={onBack}
              className="self-start sm:self-center px-4 py-2 rounded-full bg-white text-[#111322] text-[12px] font-bold hover:bg-[#EEF0FF] cursor-pointer"
            >
              Browse similar
            </button>
          </div>
        )}

        {/* Responsive Main Layout: Mobile Stacked | Desktop Side-by-Side */}
        <div
          className={`grid gap-6 ${
            forceMobile
              ? 'grid-cols-1'
              : 'grid-cols-1 lg:grid-cols-12 lg:items-start'
          }`}
        >
          {/* Left Column: Photo Carousel + Thumbnails */}
          <div className={forceMobile ? '' : 'lg:col-span-7 lg:sticky lg:top-[96px]'}>
            <div className="relative bg-white rounded-[20px] border border-[#E8EAF2] overflow-hidden shadow-card">
              <div className="relative aspect-[4/3] bg-[#F1F2F7]">
                <img
                  src={images[activeSlide]}
                  alt={`${listing.title} photo ${activeSlide + 1}`}
                  className={`w-full h-full object-cover transition ${
                    isSold ? 'grayscale-[45%] opacity-85' : ''
                  }`}
                />

                {isSold && (
                  <div className="absolute inset-0 bg-[#111322]/35 flex items-center justify-center">
                    <span className="px-6 py-2 rounded-full bg-white/95 text-[#111322] text-[18px] font-extrabold tracking-widest uppercase shadow-lg">
                      SOLD
                    </span>
                  </div>
                )}

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prevSlide}
                      aria-label="Previous photo"
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#111322] flex items-center justify-center shadow-md cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={nextSlide}
                      aria-label="Next photo"
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#111322] flex items-center justify-center shadow-md cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/65 backdrop-blur-md text-white text-[12px] font-bold tabular-nums">
                  {activeSlide + 1} / {images.length}
                </div>

                {/* Dots */}
                {images.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActiveSlide(i)}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          activeSlide === i
                            ? 'w-6 bg-white'
                            : 'w-2 bg-white/55'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Thumbnail Strip */}
              {images.length > 1 && (
                <div className="p-3 flex items-center gap-2.5 bg-white border-t border-[#E8EAF2]">
                  {images.map((src, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveSlide(i)}
                      className={`w-16 h-16 rounded-[12px] overflow-hidden border-2 transition cursor-pointer ${
                        activeSlide === i
                          ? 'border-[#3B2FD9] ring-2 ring-[#3B2FD9]/20'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={src}
                        alt={`Thumbnail ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* SafePay Assurance Banner under photo on desktop */}
            <div className="mt-4 bg-[#E7F7EE] border border-[#C3ECD4] rounded-[16px] p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-[12px] bg-[#157F3E] text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[14px] font-extrabold text-[#157F3E]">
                  Protected by SnapSell SafePay
                </div>
                <p className="text-[12px] text-[#157F3E]/85">
                  Your payment is held safely until you inspect the item in person and share your 4-digit handover code.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Price, Details, Confirmed Facts, Seller Card, Desktop Actions */}
          <div
            className={`${
              forceMobile ? '' : 'lg:col-span-5'
            } space-y-4`}
          >
            {/* Core Price & Title Card */}
            <div className="bg-white rounded-[16px] border border-[#E8EAF2] p-5 shadow-card">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <ConditionPill condition={listing.condition} />
                  <span className="text-[12px] font-semibold text-[#7C8199] inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {listing.postedAt}
                  </span>
                </div>
                <VerifiedBadge text="AI Checked" subtle />
              </div>

              <div className="text-[30px] font-extrabold text-[#111322] tabular-nums tracking-[-0.02em]">
                {formatINR(listing.price)}
              </div>
              <h1 className="text-[19px] sm:text-[21px] font-extrabold text-[#111322] leading-snug mt-1">
                {listing.title}
              </h1>

              <div className="mt-3 flex items-center gap-1.5 text-[13px] font-semibold text-[#4E5369]">
                <MapPin className="w-4 h-4 text-[#3B2FD9]" />
                <span>
                  {listing.area}, Bengaluru · {listing.distance} away
                </span>
              </div>

              {/* Desktop Action Buttons */}
              {!forceMobile && (
                <div className="hidden lg:grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-[#F1F2F7]">
                  <button
                    type="button"
                    disabled={isSold}
                    onClick={onChat}
                    className={`h-[52px] rounded-[14px] font-bold text-[15px] inline-flex items-center justify-center gap-2 border-2 transition ${
                      isSold
                        ? 'bg-[#F7F7FA] border-[#E8EAF2] text-[#9CA3AF] cursor-not-allowed'
                        : 'bg-white border-[#3B2FD9] text-[#3B2FD9] hover:bg-[#EEF0FF] cursor-pointer'
                    }`}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat</span>
                  </button>
                  <button
                    type="button"
                    disabled={isSold}
                    onClick={onBuySafePay}
                    className={`h-[52px] rounded-[14px] font-bold text-[15px] inline-flex items-center justify-center gap-2 transition ${
                      isSold
                        ? 'bg-[#E8EAF2] text-[#7C8199] cursor-not-allowed'
                        : 'bg-[#3B2FD9] hover:bg-[#2E23B8] text-white shadow-indigo cursor-pointer'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isSold ? 'Sold out' : 'Buy with SafePay'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* AI Description Card */}
            <div className="bg-white rounded-[16px] border border-[#E8EAF2] p-5 shadow-card">
              <div className="flex items-center justify-between mb-2.5">
                <h2 className="text-[15px] font-extrabold text-[#111322]">
                  Description
                </h2>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#3B2FD9] bg-[#EEF0FF] px-2.5 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3" />
                  Written with AI
                </span>
              </div>
              <p className="text-[14px] text-[#4E5369] leading-relaxed">
                {listing.description}
              </p>

              {listing.specs && (
                <div className="grid grid-cols-2 gap-2.5 mt-4 pt-4 border-t border-[#F1F2F7]">
                  {listing.specs.map((sp) => (
                    <div
                      key={sp.label}
                      className="bg-[#F7F7FA] rounded-[12px] px-3 py-2"
                    >
                      <div className="text-[11px] font-semibold text-[#7C8199]">
                        {sp.label}
                      </div>
                      <div className="text-[13px] font-bold text-[#111322]">
                        {sp.value}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirmed by Seller Facts */}
            <div className="bg-white rounded-[16px] border border-[#E8EAF2] p-5 shadow-card">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-[#157F3E]" />
                <h2 className="text-[15px] font-extrabold text-[#111322]">
                  Confirmed by seller
                </h2>
              </div>
              <div className="space-y-2.5">
                {listing.confirmedFacts.map((fact) => (
                  <div
                    key={fact.label}
                    className="flex items-start gap-2.5 text-[13px]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#157F3E] mt-2 shrink-0" />
                    <div>
                      <span className="font-bold text-[#111322]">
                        {fact.label}:{' '}
                      </span>
                      <span className="text-[#4E5369]">{fact.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Seller Card */}
            <div className="bg-white rounded-[16px] border border-[#E8EAF2] p-5 shadow-card">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-[#EEF0FF] border-2 border-[#D6DAFF] text-[#3B2FD9] font-extrabold text-[16px] flex items-center justify-center shrink-0">
                    {listing.seller.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[15px] font-extrabold text-[#111322]">
                        {listing.seller.fullName}
                      </span>
                      <VerifiedBadge
                        text={`${listing.seller.verifiedSales} verified sales`}
                        subtle
                      />
                    </div>
                    <div className="text-[12px] text-[#4E5369] mt-0.5 flex items-center gap-2">
                      <span>{listing.seller.area}</span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-0.5 font-semibold text-[#111322]">
                        <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
                        {listing.seller.rating}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onViewShop}
                  className="shrink-0 px-3.5 h-10 rounded-[12px] bg-[#F7F7FA] hover:bg-[#EEF0FF] hover:text-[#3B2FD9] border border-[#E8EAF2] text-[13px] font-bold text-[#111322] inline-flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>View shop</span>
                </button>
              </div>
              <div className="mt-3 pt-3 border-t border-[#F1F2F7] text-[12px] text-[#7C8199] flex items-center justify-between">
                <span>{listing.seller.responseTime}</span>
                <span>{listing.seller.joined}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Action Bar */}
      <div
        className={`${
          forceMobile
            ? 'flex sticky bottom-0 inset-x-0 -mb-36'
            : 'flex lg:hidden fixed bottom-0 inset-x-0'
        } z-40 justify-center pointer-events-none`}
      >
        <div
          className={`pointer-events-auto w-full bg-white/95 backdrop-blur-lg border-t border-[#E8EAF2] px-4 py-3 pb-[max(0.85rem,env(safe-area-inset-bottom))] shadow-nav`}
        >
          {isSold ? (
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[14px] font-extrabold text-[#111322]">
                  Item Sold
                </div>
                <div className="text-[12px] text-[#7C8199]">
                  No longer available
                </div>
              </div>
              <button
                type="button"
                onClick={onBack}
                className="px-5 h-12 rounded-[14px] bg-[#3B2FD9] text-white text-[14px] font-bold cursor-pointer"
              >
                Browse similar
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-2.5">
              <button
                type="button"
                onClick={onChat}
                className="col-span-4 h-[52px] rounded-[14px] bg-white border-2 border-[#3B2FD9] text-[#3B2FD9] font-bold text-[14px] inline-flex items-center justify-center gap-1.5 active:scale-[0.98] transition cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat</span>
              </button>
              <button
                type="button"
                onClick={onBuySafePay}
                className="col-span-8 h-[52px] rounded-[14px] bg-[#3B2FD9] hover:bg-[#2E23B8] text-white font-bold text-[14px] inline-flex items-center justify-center gap-1.5 shadow-indigo active:scale-[0.98] transition cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Buy with SafePay · {formatINR(listing.price)}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
