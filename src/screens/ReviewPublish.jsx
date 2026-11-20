import React, { useState } from 'react';
import {
  Sparkles,
  ChevronLeft,
  CheckCircle2,
  Minus,
  Plus,
  Share2,
  Copy,
  Check,
  ShieldCheck,
  ExternalLink,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import { formatINR } from '../data/mockData';

const CONDITIONS = ['Like New', 'Good', 'Fair'];

export default function ReviewPublish({
  photos,
  aiDraft,
  onPublish,
  onBack,
  onViewListing,
  onGoToDashboard,
  userProfile,
  forceMobile = false,
}) {
  const [title, setTitle] = useState(
    `${aiDraft.detectedName || 'Solid Wooden Study Table'} with Storage Drawer`
  );
  const [description, setDescription] = useState(
    `Sturdy honey-finish solid wood study table with a smooth pull-out drawer. Age: ${
      aiDraft.age || '1–2 years'
    }. Condition notes: ${
      aiDraft.defects || 'Minor scratches'
    }. Includes: ${
      aiDraft.included || 'With drawer keys'
    }. Fits a 27-inch monitor + laptop comfortably. Pickup from ${
      userProfile.area
    }.`
  );
  const [condition, setCondition] = useState('Good');
  const [price, setPrice] = useState(2900);
  const [stock, setStock] = useState(1);
  const [specs, setSpecs] = useState([
    { label: 'Dimensions', value: '120 × 60 × 75 cm' },
    { label: 'Material', value: 'Sheesham solid wood' },
    { label: 'Age', value: aiDraft.age || '1–2 years' },
    { label: 'Defects', value: aiDraft.defects || 'Minor edge scuff' },
    { label: 'Included', value: aiDraft.included || 'With drawer keys' },
  ]);
  const [priceError, setPriceError] = useState('');
  const [showSuccessSheet, setShowSuccessSheet] = useState(false);
  const [copied, setCopied] = useState(false);

  const numericPrice = Math.max(0, Number(price) || 0);
  const platformFee = Math.round(numericPrice * 0.05);
  const sellerReceives = Math.max(0, numericPrice - platformFee);

  const activePhotos = photos.filter(Boolean);
  const previewImg = activePhotos[0] || './images/study-table-1.jpg';

  const handleSpecChange = (idx, value) => {
    setSpecs((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, value } : s))
    );
  };

  const handlePublish = () => {
    if (numericPrice < 50) {
      setPriceError('Please enter a price of at least ₹50.');
      return;
    }
    setPriceError('');
    onPublish?.({
      title,
      description,
      condition,
      price: numericPrice,
      stock,
      specs,
      images:
        activePhotos.length > 0
          ? activePhotos
          : [
              './images/study-table-1.jpg',
              './images/study-table-2.jpg',
              './images/study-table-3.jpg',
            ],
    });
    setShowSuccessSheet(true);
  };

  const handleCopyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pb-28 lg:pb-12">
      <div className="max-w-[920px] mx-auto px-4 lg:px-6 pt-4 lg:pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#4E5369] hover:text-[#111322] cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Questions</span>
          </button>
          <div className="text-center">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#3B2FD9]">
              Step 3 of 3
            </div>
            <h1 className="text-[17px] font-extrabold text-[#111322]">
              Review & publish
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setShowSuccessSheet(true)}
            className="px-3 py-1.5 rounded-full bg-white border border-[#E8EAF2] text-[11px] font-bold text-[#3B2FD9] hover:border-[#3B2FD9] cursor-pointer"
          >
            Preview Published
          </button>
        </div>

        {/* Badge: Written with AI, checked by you */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 bg-[#EEF0FF] border border-[#D6DAFF] rounded-[16px] px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[10px] bg-[#3B2FD9] text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[13px] font-extrabold text-[#3B2FD9]">
                Written with AI, checked by you
              </span>
              <p className="text-[12px] text-[#4E5369]">
                Everything below is editable — tap any field to tweak before publishing.
              </p>
            </div>
          </div>
          <div className="flex -space-x-2">
            {(activePhotos.length > 0
              ? activePhotos
              : ['./images/study-table-1.jpg', './images/study-table-2.jpg', './images/study-table-3.jpg']
            ).map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Upload ${i + 1}`}
                className="w-9 h-9 rounded-[10px] object-cover border-2 border-white shadow-sm"
              />
            ))}
          </div>
        </div>

        <div
          className={`grid gap-5 ${
            forceMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12'
          }`}
        >
          {/* Left Editable Details */}
          <div
            className={`${
              forceMobile ? '' : 'lg:col-span-7'
            } space-y-4`}
          >
            {/* Title & Description Card */}
            <div className="bg-white rounded-[16px] border border-[#E8EAF2] p-5 shadow-card space-y-4">
              <div>
                <label className="block text-[12px] font-bold uppercase tracking-wider text-[#7C8199] mb-1.5">
                  Listing Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-[48px] px-3.5 rounded-[12px] border border-[#E8EAF2] bg-[#F7F7FA] focus:bg-white focus:border-[#3B2FD9] text-[15px] font-bold text-[#111322] outline-none transition"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold uppercase tracking-wider text-[#7C8199] mb-1.5">
                  AI Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3.5 rounded-[12px] border border-[#E8EAF2] bg-[#F7F7FA] focus:bg-white focus:border-[#3B2FD9] text-[14px] text-[#111322] leading-relaxed outline-none transition resize-none"
                />
              </div>

              {/* Condition Grade */}
              <div>
                <label className="block text-[12px] font-bold uppercase tracking-wider text-[#7C8199] mb-2">
                  Condition grade
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {CONDITIONS.map((grade) => {
                    const active = condition === grade;
                    return (
                      <button
                        key={grade}
                        type="button"
                        onClick={() => setCondition(grade)}
                        className={`h-[46px] rounded-[12px] text-[13px] font-bold border-2 transition cursor-pointer ${
                          active
                            ? 'bg-[#EEF0FF] border-[#3B2FD9] text-[#3B2FD9]'
                            : 'bg-white border-[#E8EAF2] text-[#4E5369] hover:border-[#3B2FD9]/40'
                        }`}
                      >
                        {active ? '✓ ' : ''}
                        {grade}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Editable Specs */}
            <div className="bg-white rounded-[16px] border border-[#E8EAF2] p-5 shadow-card">
              <h2 className="text-[14px] font-extrabold text-[#111322] mb-3.5">
                Specs & verified facts
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {specs.map((sp, idx) => (
                  <div
                    key={sp.label}
                    className="bg-[#F7F7FA] rounded-[12px] p-3 border border-[#E8EAF2] focus-within:border-[#3B2FD9] focus-within:bg-white transition"
                  >
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7C8199]">
                      {sp.label}
                    </label>
                    <input
                      type="text"
                      value={sp.value}
                      onChange={(e) => handleSpecChange(idx, e.target.value)}
                      className="w-full bg-transparent text-[13px] font-semibold text-[#111322] mt-0.5 outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Pricing, Stock & Payout Card */}
          <div
            className={`${
              forceMobile ? '' : 'lg:col-span-5'
            } space-y-4`}
          >
            <div className="bg-white rounded-[16px] border border-[#E8EAF2] p-5 shadow-card space-y-5">
              {/* Price Input */}
              <div>
                <label className="block text-[12px] font-bold uppercase tracking-wider text-[#7C8199] mb-2">
                  Your selling price
                </label>
                <div
                  className={`flex items-center h-[58px] px-4 rounded-[14px] border-2 bg-[#F7F7FA] focus-within:bg-white transition ${
                    priceError
                      ? 'border-[#DC2626]'
                      : 'border-[#E8EAF2] focus-within:border-[#3B2FD9]'
                  }`}
                >
                  <span className="text-[24px] font-extrabold text-[#3B2FD9] mr-2">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => {
                      setPrice(e.target.value);
                      setPriceError('');
                    }}
                    className="w-full bg-transparent text-[24px] font-extrabold text-[#111322] tabular-nums outline-none"
                  />
                </div>

                {priceError && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-[12px] font-semibold text-[#DC2626]">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{priceError}</span>
                  </div>
                )}

                {/* AI Price Hint */}
                <div className="mt-3 bg-[#EEF0FF] border border-[#D6DAFF] rounded-[12px] p-3">
                  <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#3B2FD9]">
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    <span>Similar tables sell for ₹2,500–3,500</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {[2600, 2900, 3300].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setPrice(val)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition cursor-pointer ${
                          Number(price) === val
                            ? 'bg-[#3B2FD9] text-white border-[#3B2FD9]'
                            : 'bg-white text-[#4E5369] border-[#D6DAFF] hover:border-[#3B2FD9]'
                        }`}
                      >
                        {formatINR(val)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stock Count Stepper */}
              <div className="flex items-center justify-between pt-4 border-t border-[#F1F2F7]">
                <div>
                  <div className="text-[14px] font-bold text-[#111322]">
                    Stock count
                  </div>
                  <div className="text-[12px] text-[#7C8199]">
                    How many units do you have?
                  </div>
                </div>
                <div className="inline-flex items-center gap-3 bg-[#F7F7FA] border border-[#E8EAF2] rounded-full p-1">
                  <button
                    type="button"
                    onClick={() => setStock((s) => Math.max(1, s - 1))}
                    className="w-9 h-9 rounded-full bg-white border border-[#E8EAF2] flex items-center justify-center text-[#111322] hover:border-[#3B2FD9] cursor-pointer"
                    aria-label="Decrease stock"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-6 text-center text-[15px] font-extrabold tabular-nums">
                    {stock}
                  </span>
                  <button
                    type="button"
                    onClick={() => setStock((s) => Math.min(20, s + 1))}
                    className="w-9 h-9 rounded-full bg-white border border-[#E8EAF2] flex items-center justify-center text-[#111322] hover:border-[#3B2FD9] cursor-pointer"
                    aria-label="Increase stock"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Transparent Payout Breakdown */}
              <div className="bg-[#E7F7EE] border border-[#C3ECD4] rounded-[14px] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-[#157F3E]">
                    You’ll receive
                  </span>
                  <span className="text-[22px] font-extrabold text-[#157F3E] tabular-nums">
                    {formatINR(sellerReceives)}
                  </span>
                </div>
                <div className="mt-1.5 text-[12px] text-[#157F3E]/85 flex items-center justify-between">
                  <span>SafePay & platform fee (5%)</span>
                  <span className="font-semibold tabular-nums">
                    −{formatINR(platformFee)}
                  </span>
                </div>
                <div className="mt-2 pt-2 border-t border-[#C3ECD4] flex items-center gap-1.5 text-[11px] font-semibold text-[#157F3E]">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>Instant UPI payout when buyer shares handover code</span>
                </div>
              </div>

              {/* Publish Button */}
              <button
                type="button"
                onClick={handlePublish}
                className="w-full h-[54px] rounded-[16px] bg-[#FF5A3D] hover:bg-[#EA472A] active:scale-[0.99] text-white text-[16px] font-extrabold shadow-coral transition cursor-pointer"
              >
                Publish listing
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SUCCESS SHEET + SHARE TO WHATSAPP CARD */}
      {showSuccessSheet && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#111322]/55 backdrop-blur-[3px] p-0 sm:p-4">
          <div
            className={`w-full ${
              forceMobile ? 'max-w-[390px]' : 'max-w-[460px]'
            } bg-white rounded-t-[24px] sm:rounded-[24px] p-6 shadow-2xl space-y-5`}
          >
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-[#E7F7EE] text-[#157F3E] flex items-center justify-center mx-auto mb-3 border-4 border-[#F4FCF7]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-[22px] font-extrabold text-[#111322]">
                Your listing is live!
              </h2>
              <p className="text-[13px] text-[#4E5369] mt-1">
                Buyers in {userProfile.area} & nearby Bengaluru can now find it.
              </p>
            </div>

            {/* Listing Mini Preview */}
            <div className="flex items-center gap-3.5 p-3 rounded-[16px] bg-[#F7F7FA] border border-[#E8EAF2]">
              <img
                src={previewImg}
                alt={title}
                className="w-16 h-16 rounded-[12px] object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-bold text-[#111322] truncate">
                  {title}
                </div>
                <div className="text-[16px] font-extrabold text-[#3B2FD9] tabular-nums mt-0.5">
                  {formatINR(numericPrice)}
                </div>
                <div className="text-[11px] font-semibold text-[#157F3E]">
                  SafePay enabled · You’ll receive {formatINR(sellerReceives)}
                </div>
              </div>
            </div>

            {/* Share to WhatsApp Card */}
            <div className="rounded-[16px] bg-[#ECFDF5] border border-[#A7F3D0] p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[14px] font-extrabold text-[#065F46] flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-[#16A34A]" />
                    <span>Share to WhatsApp groups</span>
                  </div>
                  <p className="text-[12px] text-[#047857] mt-0.5">
                    Items shared in apartment & society groups sell 2.4× faster.
                  </p>
                </div>
              </div>

              <div className="bg-white/90 rounded-[12px] p-2.5 text-[12px] text-[#111322] border border-[#D1FAE5]">
                “Selling my <strong>{title}</strong> ({condition}) for{' '}
                <strong>{formatINR(numericPrice)}</strong> in {userProfile.area}. Protected with SnapSell SafePay 👉 snapsell.in/l/study-table”
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="h-11 rounded-[12px] bg-[#16A34A] hover:bg-[#15803D] text-white text-[13px] font-bold inline-flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share to WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="h-11 rounded-[12px] bg-white hover:bg-[#F7F7FA] text-[#111322] border border-[#A7F3D0] text-[13px] font-bold inline-flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-[#157F3E]" />
                      <span className="text-[#157F3E]">Link copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowSuccessSheet(false);
                  onViewListing?.();
                }}
                className="h-12 rounded-[14px] bg-[#3B2FD9] hover:bg-[#2E23B8] text-white text-[14px] font-bold inline-flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <span>View listing</span>
                <ExternalLink className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSuccessSheet(false);
                  onGoToDashboard?.();
                }}
                className="h-12 rounded-[14px] bg-[#F7F7FA] hover:bg-[#EEF0FF] text-[#111322] border border-[#E8EAF2] text-[14px] font-bold transition cursor-pointer"
              >
                My Shop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
