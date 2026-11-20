import React, { useState } from 'react';
import {
  Store,
  Copy,
  Check,
  Share2,
  Camera,
  Edit3,
  CheckCircle2,
  Package,
  IndianRupee,
  Clock,
  Star,
  Minus,
  Plus,
  ArrowRight,
  Sparkles,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import { formatINR, SELLER_PAYOUTS } from '../data/mockData';
import { VerifiedBadge, ConditionPill } from '../components/Brand';

export default function SellerDashboard({
  userProfile,
  sellerListings,
  sellerOrders,
  onUpdateListing,
  onStartSelling,
  onOpenOrder,
  onSelectListing,
  emptyMode = false,
  onToggleEmptyMode,
  forceMobile = false,
}) {
  const [activeTab, setActiveTab] = useState('listings'); // listings | orders | earnings
  const [copiedLink, setCopiedLink] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState('');

  const shopUrl = `snapsell.in/${userProfile.name.toLowerCase()}-${userProfile.area
    .toLowerCase()
    .replace(/\s+/g, '-')}`;

  const onHoldAmount = sellerOrders
    .filter((o) => o.status !== 'completed')
    .reduce((sum, o) => sum + o.sellerPayout, 0);

  const releasedAmount =
    12730 +
    sellerOrders
      .filter((o) => o.status === 'completed')
      .reduce((sum, o) => sum + o.sellerPayout, 0);

  const handleCopyShop = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleStockStep = (item, delta) => {
    const nextStock = Math.max(0, (item.stock || 1) + delta);
    onUpdateListing(item.id, {
      stock: nextStock,
      status: nextStock === 0 ? 'sold' : 'active',
    });
  };

  const handleToggleSold = (item) => {
    const nextSold = item.status !== 'sold';
    onUpdateListing(item.id, {
      status: nextSold ? 'sold' : 'active',
      stock: nextSold ? 0 : Math.max(1, item.stock || 1),
    });
  };

  const handleSaveEdit = (item) => {
    const p = Number(editPrice);
    if (p >= 50) {
      onUpdateListing(item.id, { price: p });
    }
    setEditingId(null);
  };

  return (
    <div className="pb-28 lg:pb-12">
      <div className="max-w-[1100px] mx-auto px-4 lg:px-6 pt-4 lg:pt-8 space-y-5">
        {/* Top Shop Header + Empty State Toggle */}
        <div className="bg-white rounded-[20px] border border-[#E8EAF2] p-5 sm:p-6 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-[16px] bg-[#3B2FD9] text-white font-extrabold text-[20px] flex items-center justify-center shadow-indigo shrink-0">
                {userProfile.initials}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-[20px] sm:text-[22px] font-extrabold text-[#111322]">
                    {userProfile.fullName}’s Shop
                  </h1>
                  <VerifiedBadge text="Verified Seller" subtle />
                </div>
                <div className="text-[13px] text-[#4E5369] mt-0.5 flex items-center gap-2 flex-wrap">
                  <span>{userProfile.area}, Bengaluru</span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1 font-bold text-[#111322]">
                    <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
                    4.9
                  </span>
                  <span>·</span>
                  <span>12 verified sales</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-start sm:self-center">
              <div className="inline-flex items-center bg-[#F7F7FA] p-1 rounded-full border border-[#E8EAF2] text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => onToggleEmptyMode?.(false)}
                  className={`px-2.5 py-1 rounded-full cursor-pointer ${
                    !emptyMode ? 'bg-[#111322] text-white' : 'text-[#7C8199]'
                  }`}
                >
                  Active
                </button>
                <button
                  type="button"
                  onClick={() => onToggleEmptyMode?.(true)}
                  className={`px-2.5 py-1 rounded-full cursor-pointer ${
                    emptyMode ? 'bg-[#111322] text-white' : 'text-[#7C8199]'
                  }`}
                >
                  Empty
                </button>
              </div>

              <button
                type="button"
                onClick={onStartSelling}
                className="h-11 px-4 rounded-full bg-[#FF5A3D] hover:bg-[#EA472A] text-white text-[13px] font-bold inline-flex items-center gap-1.5 shadow-coral transition cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Add item</span>
              </button>
            </div>
          </div>

          {/* Shareable Shop Link Bar */}
          <div className="mt-5 pt-4 border-t border-[#F1F2F7] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 bg-[#F7F7FA] border border-[#E8EAF2] rounded-[12px] px-3.5 py-2.5 min-w-0 flex-1">
              <Store className="w-4 h-4 text-[#3B2FD9] shrink-0" />
              <span className="text-[13px] font-bold text-[#111322] truncate">
                {shopUrl}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCopyShop}
                className="flex-1 sm:flex-none h-10 px-4 rounded-[12px] bg-[#EEF0FF] hover:bg-[#3B2FD9] text-[#3B2FD9] hover:text-white text-[13px] font-bold inline-flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy shop link</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleCopyShop}
                className="flex-1 sm:flex-none h-10 px-4 rounded-[12px] bg-[#E7F7EE] hover:bg-[#157F3E] text-[#157F3E] hover:text-white border border-[#C3ECD4] text-[13px] font-bold inline-flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs: Listings | Orders | Earnings */}
        <div className="grid grid-cols-3 gap-2 bg-white p-1.5 rounded-[16px] border border-[#E8EAF2] shadow-card">
          {[
            {
              id: 'listings',
              label: 'Listings',
              count: emptyMode ? 0 : sellerListings.length,
              icon: Package,
            },
            {
              id: 'orders',
              label: 'Orders',
              count: emptyMode ? 0 : sellerOrders.length,
              icon: Clock,
            },
            {
              id: 'earnings',
              label: 'Earnings',
              count: null,
              icon: IndianRupee,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`h-12 rounded-[12px] text-[13px] sm:text-[14px] font-bold inline-flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  active
                    ? 'bg-[#3B2FD9] text-white shadow-sm'
                    : 'text-[#4E5369] hover:bg-[#F7F7FA] hover:text-[#111322]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[11px] font-extrabold tabular-nums ${
                      active
                        ? 'bg-white/20 text-white'
                        : 'bg-[#F1F2F7] text-[#4E5369]'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* EMPTY STATE VARIANT ("List your first item in 2 minutes") */}
        {emptyMode ? (
          <div className="bg-white rounded-[20px] border border-[#E8EAF2] p-8 sm:p-12 text-center shadow-card max-w-[560px] mx-auto">
            <div className="w-16 h-16 rounded-[20px] bg-[#FFF1EE] text-[#FF5A3D] flex items-center justify-center mx-auto mb-4">
              <Camera className="w-8 h-8" />
            </div>
            <h2 className="text-[22px] font-extrabold text-[#111322]">
              List your first item in 2 minutes
            </h2>
            <p className="text-[14px] text-[#4E5369] mt-2 max-w-[380px] mx-auto leading-relaxed">
              Got a study table, cycle, books, or appliance sitting around? Snap 3 photos — SnapSell AI writes the description & suggests the best ₹ price.
            </p>

            <div className="grid grid-cols-3 gap-2.5 mt-6 mb-7 text-left">
              {[
                { step: '1', text: 'Snap 3 photos' },
                { step: '2', text: 'AI writes listing' },
                { step: '3', text: 'SafePay UPI payout' },
              ].map((s) => (
                <div
                  key={s.step}
                  className="bg-[#F7F7FA] border border-[#E8EAF2] rounded-[14px] p-3"
                >
                  <span className="w-6 h-6 rounded-full bg-[#3B2FD9] text-white text-[11px] font-extrabold flex items-center justify-center mb-1.5">
                    {s.step}
                  </span>
                  <div className="text-[12px] font-bold text-[#111322]">
                    {s.text}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={onStartSelling}
              className="px-7 h-[54px] rounded-[16px] bg-[#FF5A3D] hover:bg-[#EA472A] text-white text-[15px] font-extrabold inline-flex items-center gap-2 shadow-coral transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Snap & sell your first item</span>
            </button>
          </div>
        ) : (
          <>
            {/* TAB 1: LISTINGS */}
            {activeTab === 'listings' && (
              <div
                className={`grid gap-4 ${
                  forceMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'
                }`}
              >
                {sellerListings.map((item) => {
                  const isSold = item.status === 'sold';
                  const isEditing = editingId === item.id;
                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-[16px] border border-[#E8EAF2] p-4 shadow-card flex flex-col justify-between gap-4"
                    >
                      <div className="flex items-start gap-3.5">
                        <div
                          onClick={() => onSelectListing(item)}
                          className="relative w-20 h-20 rounded-[12px] overflow-hidden shrink-0 cursor-pointer border border-[#E8EAF2]"
                        >
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className={`w-full h-full object-cover ${
                              isSold ? 'grayscale opacity-70' : ''
                            }`}
                          />
                          {isSold && (
                            <span className="absolute inset-0 bg-black/50 text-white text-[10px] font-extrabold flex items-center justify-center uppercase">
                              Sold
                            </span>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                isSold
                                  ? 'bg-[#F1F2F7] text-[#7C8199]'
                                  : 'bg-[#E7F7EE] text-[#157F3E]'
                              }`}
                            >
                              {isSold ? 'Sold' : 'Active'}
                            </span>
                            <ConditionPill condition={item.condition} />
                          </div>

                          <h3
                            onClick={() => onSelectListing(item)}
                            className="text-[15px] font-extrabold text-[#111322] mt-1 line-clamp-1 cursor-pointer hover:text-[#3B2FD9]"
                          >
                            {item.title}
                          </h3>

                          {isEditing ? (
                            <div className="flex items-center gap-2 mt-2">
                              <input
                                type="number"
                                value={editPrice}
                                onChange={(e) => setEditPrice(e.target.value)}
                                className="w-28 h-9 px-2.5 rounded-[10px] border-2 border-[#3B2FD9] text-[14px] font-bold tabular-nums outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => handleSaveEdit(item)}
                                className="h-9 px-3 rounded-[10px] bg-[#3B2FD9] text-white text-[12px] font-bold cursor-pointer"
                              >
                                Save
                              </button>
                            </div>
                          ) : (
                            <div className="text-[18px] font-extrabold text-[#111322] tabular-nums mt-1">
                              {formatINR(item.price)}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Stock Stepper + Edit + Mark Sold */}
                      <div className="pt-3 border-t border-[#F1F2F7] flex items-center justify-between gap-2 flex-wrap">
                        <div className="inline-flex items-center gap-2 bg-[#F7F7FA] border border-[#E8EAF2] rounded-full px-2 py-1">
                          <span className="text-[11px] font-bold text-[#7C8199] pl-1">
                            Stock
                          </span>
                          <button
                            type="button"
                            onClick={() => handleStockStep(item, -1)}
                            className="w-6 h-6 rounded-full bg-white border border-[#E8EAF2] flex items-center justify-center text-[#111322] cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-4 text-center text-[13px] font-extrabold tabular-nums">
                            {item.stock ?? 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleStockStep(item, 1)}
                            className="w-6 h-6 rounded-full bg-white border border-[#E8EAF2] flex items-center justify-center text-[#111322] cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(item.id);
                              setEditPrice(String(item.price));
                            }}
                            className="h-9 px-3 rounded-[10px] bg-[#F7F7FA] hover:bg-[#EEF0FF] text-[#111322] hover:text-[#3B2FD9] text-[12px] font-bold inline-flex items-center gap-1 border border-[#E8EAF2] transition cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleSold(item)}
                            className={`h-9 px-3 rounded-[10px] text-[12px] font-bold inline-flex items-center gap-1 transition cursor-pointer ${
                              isSold
                                ? 'bg-[#EEF0FF] text-[#3B2FD9]'
                                : 'bg-[#111322] hover:bg-[#272B42] text-white'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{isSold ? 'Relist' : 'Mark sold'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 2: ORDERS */}
            {activeTab === 'orders' && (
              <div className="space-y-3.5">
                {sellerOrders.map((ord) => {
                  const done = ord.status === 'completed';
                  return (
                    <div
                      key={ord.id}
                      className="bg-white rounded-[16px] border border-[#E8EAF2] p-4 sm:p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <img
                          src={ord.image}
                          alt={ord.itemTitle}
                          className="w-16 h-16 rounded-[12px] object-cover border border-[#E8EAF2] shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[12px] font-bold text-[#7C8199] tabular-nums">
                              {ord.id}
                            </span>
                            <span
                              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                                done
                                  ? 'bg-[#E7F7EE] text-[#157F3E]'
                                  : 'bg-[#FEF3C7] text-[#B45309]'
                              }`}
                            >
                              {done
                                ? `${formatINR(ord.sellerPayout)} Released`
                                : `${formatINR(ord.sellerPayout)} on hold`}
                            </span>
                          </div>
                          <div className="text-[15px] font-extrabold text-[#111322] truncate mt-0.5">
                            {ord.itemTitle}
                          </div>
                          <div className="text-[12px] text-[#4E5369]">
                            Buyer: {ord.buyerName} ({ord.buyerArea}) · {ord.meetup}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onOpenOrder(ord)}
                        className={`shrink-0 h-11 px-4 rounded-[12px] text-[13px] font-bold inline-flex items-center justify-center gap-1.5 transition cursor-pointer ${
                          done
                            ? 'bg-[#F7F7FA] text-[#111322] border border-[#E8EAF2] hover:bg-[#EEF0FF]'
                            : 'bg-[#3B2FD9] hover:bg-[#2E23B8] text-white shadow-indigo'
                        }`}
                      >
                        <span>{done ? 'View receipt' : 'Enter 4-digit code'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 3: EARNINGS (On hold vs Released) */}
            {activeTab === 'earnings' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white rounded-[16px] border-2 border-[#FCD34D] p-5 shadow-card">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-bold uppercase tracking-wider text-[#B45309]">
                        On hold in SafePay
                      </span>
                      <Lock className="w-5 h-5 text-[#B45309]" />
                    </div>
                    <div className="text-[32px] font-extrabold text-[#111322] tabular-nums mt-2">
                      {formatINR(onHoldAmount)}
                    </div>
                    <p className="text-[12px] text-[#4E5369] mt-1">
                      Releases to your UPI instantly once buyer confirms handover code.
                    </p>
                  </div>

                  <div className="bg-[#E7F7EE] rounded-[16px] border-2 border-[#C3ECD4] p-5 shadow-card">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-bold uppercase tracking-wider text-[#157F3E]">
                        Released to UPI
                      </span>
                      <ShieldCheck className="w-5 h-5 text-[#157F3E]" />
                    </div>
                    <div className="text-[32px] font-extrabold text-[#157F3E] tabular-nums mt-2">
                      {formatINR(releasedAmount)}
                    </div>
                    <p className="text-[12px] text-[#157F3E]/85 mt-1">
                      Settled to <strong>riya@okaxis</strong> across 12 verified sales.
                    </p>
                  </div>
                </div>

                {/* Payout Ledger */}
                <div className="bg-white rounded-[16px] border border-[#E8EAF2] p-5 shadow-card">
                  <h3 className="text-[15px] font-extrabold text-[#111322] mb-3.5">
                    Recent payouts
                  </h3>
                  <div className="divide-y divide-[#F1F2F7]">
                    {SELLER_PAYOUTS.map((p) => {
                      const released = p.status === 'released';
                      return (
                        <div
                          key={p.id}
                          className="py-3.5 flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <div className="text-[14px] font-bold text-[#111322] truncate">
                              {p.item}
                            </div>
                            <div className="text-[12px] text-[#7C8199]">
                              {p.date} · {p.ref}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-[15px] font-extrabold text-[#111322] tabular-nums">
                              {formatINR(p.amount)}
                            </div>
                            <span
                              className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${
                                released
                                  ? 'bg-[#E7F7EE] text-[#157F3E]'
                                  : 'bg-[#FEF3C7] text-[#B45309]'
                              }`}
                            >
                              {released ? 'Released' : 'On hold'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
