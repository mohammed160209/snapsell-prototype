import React, { useState } from 'react';
import {
  ChevronLeft,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Lock,
  AlertCircle,
  MapPin,
  Sparkles,
  ArrowUpRight,
  RotateCcw,
} from 'lucide-react';
import { formatINR } from '../data/mockData';

export default function OrderStatus({
  order,
  onOrderComplete,
  onResetOrder,
  onBack,
  onOpenChat,
  forceMobile = false,
}) {
  const [codeDigits, setCodeDigits] = useState(['', '', '', '']);
  const [codeError, setCodeError] = useState('');

  const isCompleted = order.status === 'completed';
  const isHandedOver = order.status === 'handed_over' || isCompleted;

  const steps = [
    {
      id: 'paid',
      label: 'Paid',
      sub: '₹1,000 in SafePay',
      done: true,
    },
    {
      id: 'handed_over',
      label: 'Handed over',
      sub: isHandedOver ? 'Code verified' : 'Meet & verify code',
      done: isHandedOver,
      active: order.status === 'paid',
    },
    {
      id: 'completed',
      label: 'Completed',
      sub: isCompleted ? 'Payout released' : 'Instant UPI payout',
      done: isCompleted,
    },
  ];

  const handleDigitChange = (idx, val) => {
    const clean = val.replace(/\D/g, '').slice(-1);
    const next = [...codeDigits];
    next[idx] = clean;
    setCodeDigits(next);
    setCodeError('');
    if (clean && idx < 3) {
      document.getElementById(`handover-digit-${idx + 1}`)?.focus();
    }
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();
    const entered = codeDigits.join('');
    if (entered.length < 4) {
      setCodeError('Enter all 4 digits from the buyer’s SafePay screen.');
      return;
    }
    if (entered !== order.handoverCode) {
      setCodeError(
        `Incorrect code (${entered}). Ask ${order.buyerName} to check their SafePay screen — demo code is ${order.handoverCode}.`
      );
      return;
    }
    setCodeError('');
    onOrderComplete?.();
  };

  const handleQuickFill = () => {
    setCodeDigits(order.handoverCode.split(''));
    setCodeError('');
  };

  return (
    <div className="pb-28 lg:pb-12">
      <div className="max-w-[780px] mx-auto px-4 lg:px-6 pt-4 lg:pt-8 space-y-5">
        {/* Top Bar */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#4E5369] hover:text-[#111322] cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div className="text-center">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#7C8199]">
              Order {order.id}
            </div>
            <h1 className="text-[17px] font-extrabold text-[#111322]">
              Order & handover status
            </h1>
          </div>

          {/* State Toggle for reviewer */}
          <div className="inline-flex items-center bg-white p-1 rounded-full border border-[#E8EAF2] text-[11px] font-bold">
            <button
              type="button"
              onClick={() => {
                setCodeDigits(['', '', '', '']);
                setCodeError('');
                onResetOrder?.();
              }}
              className={`px-2.5 py-1 rounded-full cursor-pointer ${
                !isCompleted ? 'bg-[#F59E0B] text-white' : 'text-[#7C8199]'
              }`}
            >
              On hold
            </button>
            <button
              type="button"
              onClick={() => onOrderComplete?.()}
              className={`px-2.5 py-1 rounded-full cursor-pointer ${
                isCompleted ? 'bg-[#157F3E] text-white' : 'text-[#7C8199]'
              }`}
            >
              Released
            </button>
          </div>
        </div>

        {/* Money Status Hero Card ("₹950 on hold" / "Released") */}
        <div
          className={`rounded-[20px] p-5 sm:p-6 border-2 transition shadow-card ${
            isCompleted
              ? 'bg-[#E7F7EE] border-[#C3ECD4]'
              : 'bg-white border-[#FCD34D]'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div
                className={`w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0 ${
                  isCompleted
                    ? 'bg-[#157F3E] text-white'
                    : 'bg-[#FEF3C7] text-[#B45309]'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <Lock className="w-6 h-6" />
                )}
              </div>
              <div>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide ${
                    isCompleted
                      ? 'bg-[#157F3E] text-white'
                      : 'bg-[#FEF3C7] text-[#B45309]'
                  }`}
                >
                  {isCompleted ? 'Money Released' : 'SafePay'}
                </span>
                <div className="text-[26px] sm:text-[30px] font-extrabold text-[#111322] tabular-nums mt-1 leading-tight">
                  {formatINR(order.sellerPayout)}{' '}
                  <span
                    className={`text-[18px] font-bold ${
                      isCompleted ? 'text-[#157F3E]' : 'text-[#B45309]'
                    }`}
                  >
                    {isCompleted ? 'Released' : 'on hold'}
                  </span>
                </div>
                <p className="text-[13px] text-[#4E5369] mt-0.5">
                  {isCompleted
                    ? 'Instant UPI payout sent to riya@okaxis · UTR 632481920441'
                    : `Buyer paid ${formatINR(
                        order.itemPrice
                      )} (−${formatINR(order.fee)} fee). Enter buyer’s 4-digit code at meetup to release instantly.`}
                </p>
              </div>
            </div>

            {isCompleted && (
              <button
                type="button"
                onClick={() => {
                  setCodeDigits(['', '', '', '']);
                  onResetOrder?.();
                }}
                className="self-start sm:self-center shrink-0 px-3.5 py-2 rounded-full bg-white text-[#157F3E] border border-[#C3ECD4] text-[12px] font-bold inline-flex items-center gap-1.5 hover:bg-[#F4FCF7] cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset demo</span>
              </button>
            )}
          </div>
        </div>

        {/* Progress Tracker: Paid -> Handed over -> Completed */}
        <div className="bg-white rounded-[16px] border border-[#E8EAF2] p-5 shadow-card">
          <div className="text-[13px] font-bold uppercase tracking-wider text-[#7C8199] mb-4">
            Order progress
          </div>
          <div className="grid grid-cols-3 gap-2 relative">
            {/* Connector Line */}
            <div className="absolute top-[18px] left-[16%] right-[16%] h-[3px] bg-[#E8EAF2] z-0">
              <div
                className="h-full bg-[#157F3E] transition-all duration-500"
                style={{ width: isCompleted ? '100%' : '50%' }}
              />
            </div>

            {steps.map((st, idx) => (
              <div
                key={st.id}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-[13px] border-2 transition ${
                    st.done
                      ? 'bg-[#157F3E] border-[#157F3E] text-white'
                      : st.active
                      ? 'bg-[#EEF0FF] border-[#3B2FD9] text-[#3B2FD9]'
                      : 'bg-white border-[#D6DAFF] text-[#7C8199]'
                  }`}
                >
                  {st.done ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                </div>
                <div className="text-[13px] font-extrabold text-[#111322] mt-2">
                  {st.label}
                </div>
                <div className="text-[11px] text-[#7C8199] mt-0.5 leading-tight">
                  {st.sub}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Seller's 4-Digit Handover Code Entry Card */}
        {!isCompleted ? (
          <form
            onSubmit={handleVerifyCode}
            className="bg-white rounded-[16px] border-2 border-[#3B2FD9]/25 p-5 sm:p-6 shadow-card space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#3B2FD9] bg-[#EEF0FF] px-2.5 py-0.5 rounded-full mb-1.5">
                  <Sparkles className="w-3 h-3" />
                  Seller action at meetup
                </span>
                <h2 className="text-[18px] font-extrabold text-[#111322]">
                  Enter buyer’s 4-digit handover code
                </h2>
                <p className="text-[13px] text-[#4E5369] mt-0.5">
                  Once {order.buyerName} inspects the item, ask for the 4-digit code shown on their app.
                </p>
              </div>
              <button
                type="button"
                onClick={handleQuickFill}
                className="shrink-0 px-3 py-1.5 rounded-full bg-[#EEF0FF] hover:bg-[#3B2FD9] text-[#3B2FD9] hover:text-white text-[12px] font-bold transition cursor-pointer"
              >
                Fill {order.handoverCode}
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3 max-w-[300px] mx-auto pt-1">
              {codeDigits.map((digit, i) => (
                <input
                  key={i}
                  id={`handover-digit-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(i, e.target.value)}
                  placeholder="•"
                  className={`h-[66px] text-center text-[28px] font-extrabold tabular-nums rounded-[14px] border-2 bg-[#F7F7FA] focus:bg-white outline-none transition ${
                    codeError
                      ? 'border-[#DC2626] text-[#DC2626]'
                      : digit
                      ? 'border-[#3B2FD9] bg-[#EEF0FF]/40 text-[#3B2FD9]'
                      : 'border-[#E8EAF2] focus:border-[#3B2FD9]'
                  }`}
                />
              ))}
            </div>

            {codeError && (
              <div className="bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] rounded-[12px] px-3.5 py-2.5 text-[12px] font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{codeError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full h-[54px] rounded-[16px] bg-[#3B2FD9] hover:bg-[#2E23B8] active:scale-[0.99] text-white text-[15px] font-extrabold flex items-center justify-center gap-2 shadow-indigo transition cursor-pointer"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Verify code & release {formatINR(order.sellerPayout)}</span>
            </button>
          </form>
        ) : (
          <div className="bg-white rounded-[16px] border border-[#C3ECD4] p-5 shadow-card flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-[12px] bg-[#E7F7EE] text-[#157F3E] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[15px] font-extrabold text-[#111322]">
                  Handover verified with code {order.handoverCode}
                </div>
                <div className="text-[12px] text-[#4E5369]">
                  {order.buyerName} confirmed pickup · Receipt emailed & saved in Earnings
                </div>
              </div>
            </div>
            <span className="shrink-0 px-3 py-1 rounded-full bg-[#E7F7EE] text-[#157F3E] text-[12px] font-bold">
              Settled
            </span>
          </div>
        )}

        {/* Order Item & Meetup Summary */}
        <div className="bg-white rounded-[16px] border border-[#E8EAF2] p-5 shadow-card space-y-4">
          <div className="flex items-center gap-3.5">
            <img
              src={order.image}
              alt={order.itemTitle}
              className="w-16 h-16 rounded-[12px] object-cover border border-[#E8EAF2] shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="text-[15px] font-extrabold text-[#111322] truncate">
                {order.itemTitle}
              </div>
              <div className="text-[13px] text-[#4E5369] mt-0.5">
                Buyer: <strong>{order.buyerName}</strong> – {order.buyerArea}
              </div>
              <div className="text-[12px] text-[#7C8199] mt-1 inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#3B2FD9]" />
                <span>{order.meetup}</span>
              </div>
            </div>
          </div>

          <div className="pt-3.5 border-t border-[#F1F2F7] grid grid-cols-3 gap-2 text-center bg-[#F7F7FA] rounded-[12px] p-3">
            <div>
              <div className="text-[11px] text-[#7C8199] font-semibold">
                Buyer paid
              </div>
              <div className="text-[15px] font-extrabold text-[#111322] tabular-nums">
                {formatINR(order.itemPrice)}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-[#7C8199] font-semibold">
                SafePay fee
              </div>
              <div className="text-[15px] font-extrabold text-[#4E5369] tabular-nums">
                −{formatINR(order.fee)}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-[#7C8199] font-semibold">
                Your payout
              </div>
              <div className="text-[15px] font-extrabold text-[#157F3E] tabular-nums">
                {formatINR(order.sellerPayout)}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[13px]">
            <button
              type="button"
              onClick={onOpenChat}
              className="font-bold text-[#3B2FD9] inline-flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>Message {order.buyerName}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <span className="text-[#7C8199] inline-flex items-center gap-1 text-[12px]">
              <Clock className="w-3.5 h-3.5" />
              Updated {order.updatedAt}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
