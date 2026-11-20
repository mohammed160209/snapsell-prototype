import React, { useState } from 'react';
import {
  ShieldCheck,
  ChevronLeft,
  Lock,
  CheckCircle2,
  MapPin,
  Clock,
  AlertTriangle,
  Copy,
  Check,
  MessageCircle,
  ArrowRight,
  CreditCard,
  Smartphone,
  Building2,
  Loader2,
  X,
} from 'lucide-react';
import { formatINR } from '../data/mockData';

export default function SafePayCheckout({
  listing,
  paidMode = false,
  onSetPaidMode,
  onBack,
  onGoToOrderStatus,
  onOpenChat,
  forceMobile = false,
}) {
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [codeCopied, setCodeCopied] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [reportReason, setReportReason] = useState('Item condition doesn’t match photos');

  const handoverCode = ['4', '8', '2', '9'];
  const buyerProtectionFee = 0; // Launch free for buyers
  const totalPayable = listing.price + buyerProtectionFee;

  const handlePay = () => {
    setPaymentError('');
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onSetPaidMode?.(true);
    }, 650);
  };

  const handleCopyCode = () => {
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 1800);
  };

  return (
    <div className="pb-28 lg:pb-12">
      <div className="max-w-[820px] mx-auto px-4 lg:px-6 pt-4 lg:pt-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#4E5369] hover:text-[#111322] cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="inline-flex items-center gap-1.5 text-[14px] font-extrabold text-[#111322]">
            <ShieldCheck className="w-5 h-5 text-[#157F3E]" />
            <span>SafePay Checkout</span>
          </div>

          <div className="inline-flex items-center bg-white p-1 rounded-full border border-[#E8EAF2] text-[11px] font-bold">
            <button
              type="button"
              onClick={() => onSetPaidMode?.(false)}
              className={`px-2.5 py-1 rounded-full cursor-pointer ${
                !paidMode ? 'bg-[#3B2FD9] text-white' : 'text-[#7C8199]'
              }`}
            >
              Pay
            </button>
            <button
              type="button"
              onClick={() => onSetPaidMode?.(true)}
              className={`px-2.5 py-1 rounded-full cursor-pointer ${
                paidMode ? 'bg-[#157F3E] text-white' : 'text-[#7C8199]'
              }`}
            >
              Paid Code
            </button>
          </div>
        </div>

        {/* STEP 1: CHECKOUT */}
        {!paidMode ? (
          <div
            className={`grid gap-5 ${
              forceMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12'
            }`}
          >
            <div className={`${forceMobile ? '' : 'lg:col-span-7'} space-y-4`}>
              {/* Shield Trust Message Card */}
              <div className="bg-[#EEF0FF] border border-[#D6DAFF] rounded-[16px] p-5">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-[14px] bg-[#3B2FD9] text-white flex items-center justify-center shrink-0 shadow-indigo">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-[16px] font-extrabold text-[#111322]">
                      Your money is held until you get the item
                    </h2>
                    <p className="text-[13px] text-[#4E5369] mt-1 leading-relaxed">
                      SnapSell holds your payment securely until handover. {listing.seller.name} only receives the money after you inspect the item and share your 4-digit handover code.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 pt-3.5 border-t border-[#D6DAFF] text-center">
                  {[
                    { n: '1', label: 'Pay via UPI' },
                    { n: '2', label: 'Meet & inspect' },
                    { n: '3', label: 'Share 4-digit code' },
                  ].map((s) => (
                    <div
                      key={s.n}
                      className="bg-white/85 rounded-[12px] py-2 px-2"
                    >
                      <div className="w-5 h-5 rounded-full bg-[#3B2FD9] text-white text-[11px] font-bold flex items-center justify-center mx-auto mb-1">
                        {s.n}
                      </div>
                      <div className="text-[11px] font-bold text-[#111322]">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="bg-white rounded-[16px] border border-[#E8EAF2] p-5 shadow-card space-y-3">
                <h3 className="text-[15px] font-extrabold text-[#111322]">
                  Choose payment method
                </h3>

                {[
                  {
                    id: 'upi',
                    title: 'UPI (GPay, PhonePe, Paytm)',
                    sub: 'Instant & zero extra charges',
                    icon: Smartphone,
                    badge: 'Recommended',
                  },
                  {
                    id: 'card',
                    title: 'Credit / Debit Card',
                    sub: 'Visa, Mastercard, RuPay',
                    icon: CreditCard,
                  },
                  {
                    id: 'netbanking',
                    title: 'NetBanking',
                    sub: 'HDFC, ICICI, SBI, Axis & more',
                    icon: Building2,
                  },
                ].map((m) => {
                  const Icon = m.icon;
                  const selected = paymentMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      className={`w-full p-3.5 rounded-[14px] border-2 flex items-center justify-between gap-3 text-left transition cursor-pointer ${
                        selected
                          ? 'bg-[#EEF0FF]/55 border-[#3B2FD9]'
                          : 'bg-white border-[#E8EAF2] hover:border-[#3B2FD9]/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-[12px] flex items-center justify-center ${
                            selected
                              ? 'bg-[#3B2FD9] text-white'
                              : 'bg-[#F7F7FA] text-[#4E5369]'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-[14px] font-bold text-[#111322] flex items-center gap-2">
                            <span>{m.title}</span>
                            {m.badge && (
                              <span className="text-[10px] font-bold bg-[#E7F7EE] text-[#157F3E] px-2 py-0.5 rounded-full">
                                {m.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-[12px] text-[#7C8199]">
                            {m.sub}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          selected
                            ? 'border-[#3B2FD9] bg-[#3B2FD9]'
                            : 'border-[#C7CCE0]'
                        }`}
                      >
                        {selected && (
                          <span className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Price Breakdown & Pay Button */}
            <div className={`${forceMobile ? '' : 'lg:col-span-5'} space-y-4`}>
              <div className="bg-white rounded-[16px] border border-[#E8EAF2] p-5 shadow-card space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b border-[#F1F2F7]">
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-16 h-16 rounded-[12px] object-cover border border-[#E8EAF2] shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-[14px] font-bold text-[#111322] line-clamp-2">
                      {listing.title}
                    </div>
                    <div className="text-[12px] text-[#4E5369] mt-0.5">
                      Seller: {listing.seller.name} – {listing.seller.area}
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2.5 text-[14px]">
                  <div className="flex items-center justify-between text-[#4E5369]">
                    <span>Item price</span>
                    <span className="font-semibold text-[#111322] tabular-nums">
                      {formatINR(listing.price)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[#4E5369]">
                    <span>SafePay buyer protection</span>
                    <span className="font-bold text-[#157F3E]">FREE</span>
                  </div>
                  <div className="flex items-center justify-between text-[#4E5369]">
                    <span>Pickup in {listing.area}</span>
                    <span className="font-semibold text-[#111322]">₹0</span>
                  </div>
                  <div className="pt-3 border-t border-[#E8EAF2] flex items-center justify-between">
                    <span className="text-[15px] font-extrabold text-[#111322]">
                      Total payable
                    </span>
                    <span className="text-[22px] font-extrabold text-[#3B2FD9] tabular-nums">
                      {formatINR(totalPayable)}
                    </span>
                  </div>
                </div>

                {paymentError && (
                  <div className="bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] rounded-[12px] p-3 text-[12px] font-semibold">
                    {paymentError}
                  </div>
                )}

                <button
                  type="button"
                  disabled={processing}
                  onClick={handlePay}
                  className="w-full h-[54px] rounded-[16px] bg-[#3B2FD9] hover:bg-[#2E23B8] active:scale-[0.99] text-white text-[16px] font-extrabold flex items-center justify-center gap-2 shadow-indigo transition cursor-pointer"
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Securing in SafePay…</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Pay {formatINR(totalPayable)}</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-[11px] text-[#7C8199]">
                  <span>100% refundable if deal cancels</span>
                  <button
                    type="button"
                    onClick={() =>
                      setPaymentError(
                        'UPI bank server timed out. Please retry or switch payment method.'
                      )
                    }
                    className="text-[#3B2FD9] font-semibold hover:underline cursor-pointer"
                  >
                    Test error
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* STEP 2: POST-PAYMENT 4-DIGIT HANDOVER CODE */
          <div className="max-w-[540px] mx-auto space-y-4">
            {/* Green Success Header */}
            <div className="bg-[#E7F7EE] border border-[#C3ECD4] rounded-[20px] p-5 text-center">
              <div className="w-12 h-12 rounded-full bg-[#157F3E] text-white flex items-center justify-center mx-auto mb-2.5">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="text-[12px] font-bold uppercase tracking-wider text-[#157F3E]">
                Payment held safely in SafePay
              </div>
              <h2 className="text-[22px] font-extrabold text-[#111322] mt-0.5">
                {formatINR(totalPayable)} secured!
              </h2>
              <p className="text-[13px] text-[#157F3E]/90 mt-1">
                Order #ORD-8492 · Reserved exclusively for you
              </p>
            </div>

            {/* Big 4-Digit Handover Code Card */}
            <div className="bg-white rounded-[20px] border-2 border-[#3B2FD9]/25 p-6 shadow-card text-center">
              <div className="text-[12px] font-bold uppercase tracking-wider text-[#3B2FD9] mb-1">
                Your 4-digit handover code
              </div>
              <p className="text-[13px] text-[#4E5369] mb-5">
                Share this code with <strong>{listing.seller.name}</strong> ONLY after you inspect and accept the item.
              </p>

              <div className="grid grid-cols-4 gap-3 max-w-[300px] mx-auto mb-5">
                {handoverCode.map((d, idx) => (
                  <div
                    key={idx}
                    className="h-[74px] rounded-[16px] bg-[#EEF0FF] border-2 border-[#3B2FD9]/30 flex items-center justify-center text-[34px] font-extrabold text-[#3B2FD9] tabular-nums shadow-sm"
                  >
                    {d}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F7F7FA] hover:bg-[#EEF0FF] text-[13px] font-bold text-[#111322] border border-[#E8EAF2] transition cursor-pointer"
              >
                {codeCopied ? (
                  <>
                    <Check className="w-4 h-4 text-[#157F3E]" />
                    <span className="text-[#157F3E]">Code 4829 copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#3B2FD9]" />
                    <span>Copy code</span>
                  </>
                )}
              </button>
            </div>

            {/* Meetup Details Card */}
            <div className="bg-white rounded-[16px] border border-[#E8EAF2] p-5 shadow-card space-y-3.5">
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-extrabold text-[#111322]">
                  Meetup details
                </h3>
                <button
                  type="button"
                  onClick={onOpenChat}
                  className="text-[13px] font-bold text-[#3B2FD9] inline-flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat with {listing.seller.name}</span>
                </button>
              </div>

              <div className="space-y-2.5 text-[13px]">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#3B2FD9] mt-0.5 shrink-0" />
                  <div>
                    <div className="font-bold text-[#111322]">
                      Koramangala 4th Block, Near Third Wave Coffee
                    </div>
                    <div className="text-[#7C8199]">
                      1.4 km away · Ground-floor pickup spot
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-[#3B2FD9] mt-0.5 shrink-0" />
                  <div>
                    <div className="font-bold text-[#111322]">
                      Today, 5:00 PM – 5:30 PM
                    </div>
                    <div className="text-[#7C8199]">
                      Code expires automatically in 48 hours with full refund
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions: Order Status & Report a problem */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onGoToOrderStatus}
                className="h-[52px] rounded-[16px] bg-[#3B2FD9] hover:bg-[#2E23B8] text-white text-[14px] font-bold inline-flex items-center justify-center gap-2 shadow-indigo cursor-pointer"
              >
                <span>Track order & handover</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setReportSubmitted(false);
                  setReportOpen(true);
                }}
                className="h-[52px] rounded-[16px] bg-white hover:bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] text-[14px] font-bold inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Report a problem</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Report a Problem Sheet */}
      {reportOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#111322]/50 backdrop-blur-[2px] p-0 sm:p-4">
          <div className="w-full max-w-[440px] bg-white rounded-t-[24px] sm:rounded-[24px] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[18px] font-extrabold text-[#111322]">
                Report a problem
              </h3>
              <button
                onClick={() => setReportOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F7F7FA] flex items-center justify-center text-[#4E5369]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {reportSubmitted ? (
              <div className="py-4 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#E7F7EE] text-[#157F3E] flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="text-[16px] font-extrabold text-[#111322]">
                  Payout frozen & support notified
                </div>
                <p className="text-[13px] text-[#4E5369]">
                  Your {formatINR(totalPayable)} remains locked in SafePay. Our Bengaluru ops team will resolve Dispute #DSP-415 within 2 hours.
                </p>
                <button
                  onClick={() => setReportOpen(false)}
                  className="w-full h-11 rounded-[12px] bg-[#3B2FD9] text-white font-bold text-[14px] cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <p className="text-[13px] text-[#4E5369]">
                  Your money stays frozen in SafePay while we help resolve this.
                </p>
                <div className="space-y-2">
                  {[
                    'Item condition doesn’t match photos',
                    'Seller didn’t show up for meetup',
                    'Missing accessories / parts',
                    'Want to cancel and get instant refund',
                  ].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setReportReason(r)}
                      className={`w-full text-left px-4 py-3 rounded-[12px] border text-[13px] font-semibold transition cursor-pointer ${
                        reportReason === r
                          ? 'bg-[#FEF2F2] border-[#DC2626] text-[#DC2626]'
                          : 'bg-[#F7F7FA] border-[#E8EAF2] text-[#4E5369]'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setReportSubmitted(true)}
                  className="w-full h-12 rounded-[14px] bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-[14px] cursor-pointer"
                >
                  Freeze SafePay & submit report
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
