import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  ShieldCheck,
  Send,
  CheckCheck,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { formatINR } from '../data/mockData';
import { ConditionPill, VerifiedBadge } from '../components/Brand';

const QUICK_REPLIES = [
  'Is it available?',
  'Can we meet at 5?',
  'Can we meet near 4th Block?',
  'Is the price slightly flexible?',
];

export default function ChatScreen({
  listing,
  messages,
  onSendMessage,
  onBuySafePay,
  onViewListing,
  onBack,
  forceMobile = false,
}) {
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = (text) => {
    const clean = (text ?? input).trim();
    if (!clean) return;
    onSendMessage(clean);
    if (text === undefined) setInput('');
  };

  return (
    <div className="pb-24 lg:pb-8">
      <div className="max-w-[1080px] mx-auto px-0 sm:px-4 lg:px-6 pt-0 sm:pt-4 lg:pt-6">
        <div
          className={`grid gap-6 ${
            forceMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12'
          }`}
        >
          {/* Main Chat Column */}
          <div
            className={`${
              forceMobile ? '' : 'lg:col-span-8'
            } bg-white sm:rounded-[20px] sm:border border-[#E8EAF2] shadow-card flex flex-col overflow-hidden h-[calc(100vh-140px)] sm:h-[680px]`}
          >
            {/* Chat Header */}
            <div className="px-4 py-3 border-b border-[#E8EAF2] flex items-center justify-between gap-3 bg-white shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  onClick={onBack}
                  className="w-9 h-9 rounded-full hover:bg-[#F7F7FA] flex items-center justify-center text-[#4E5369] cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full bg-[#EEF0FF] text-[#3B2FD9] font-extrabold text-[14px] flex items-center justify-center border border-[#D6DAFF]">
                    {listing.seller.initials}
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#16A34A] border-2 border-white" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[15px] font-extrabold text-[#111322] truncate">
                      {listing.seller.name} – {listing.seller.area}
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold text-[#157F3E]">
                    Online now · {listing.seller.verifiedSales} verified sales
                  </div>
                </div>
              </div>

              <VerifiedBadge text="Verified" subtle />
            </div>

            {/* Pinned Item Summary Bar at Top */}
            <div className="px-4 py-2.5 bg-[#F7F7FA] border-b border-[#E8EAF2] flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={onViewListing}
                className="flex items-center gap-3 min-w-0 text-left cursor-pointer group"
              >
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="w-11 h-11 rounded-[10px] object-cover border border-[#E8EAF2] shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-[13px] font-bold text-[#111322] truncate group-hover:text-[#3B2FD9] transition">
                    {listing.title}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[14px] font-extrabold text-[#3B2FD9] tabular-nums">
                      {formatINR(listing.price)}
                    </span>
                    <ConditionPill condition={listing.condition} />
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={onBuySafePay}
                className="shrink-0 px-3 py-2 rounded-[10px] bg-[#EEF0FF] hover:bg-[#3B2FD9] text-[#3B2FD9] hover:text-white text-[12px] font-bold transition cursor-pointer hidden sm:inline-flex items-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>SafePay</span>
              </button>
            </div>

            {/* Messages Thread */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#F7F7FA]/60">
              {messages.map((msg) => {
                if (msg.sender === 'system') {
                  return (
                    <div
                      key={msg.id}
                      className="mx-auto max-w-[380px] bg-[#E7F7EE] border border-[#C3ECD4] text-[#157F3E] rounded-[12px] px-3.5 py-2.5 text-[12px] font-medium text-center flex items-center justify-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4 shrink-0" />
                      <span>{msg.text}</span>
                    </div>
                  );
                }

                const isBuyer = msg.sender === 'buyer';
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isBuyer ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[82%] sm:max-w-[72%] rounded-[16px] px-4 py-2.5 shadow-sm ${
                        isBuyer
                          ? 'bg-[#3B2FD9] text-white rounded-br-[4px]'
                          : 'bg-white text-[#111322] border border-[#E8EAF2] rounded-bl-[4px]'
                      }`}
                    >
                      <p className="text-[14px] leading-relaxed">{msg.text}</p>
                      <div
                        className={`mt-1 flex items-center justify-end gap-1 text-[10px] font-medium ${
                          isBuyer ? 'text-white/75' : 'text-[#7C8199]'
                        }`}
                      >
                        <span>{msg.time}</span>
                        {isBuyer && <CheckCheck className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Pinned SafePay CTA + Quick Replies + Composer */}
            <div className="bg-white border-t border-[#E8EAF2] px-3.5 pt-2.5 pb-3 space-y-2.5 shrink-0">
              {/* Pinned Buy with SafePay Bar */}
              <div className="flex items-center justify-between gap-2 bg-[#EEF0FF] border border-[#D6DAFF] rounded-[14px] px-3 py-2">
                <div className="text-[12px] font-semibold text-[#111322] min-w-0">
                  <span className="text-[#3B2FD9] font-extrabold">
                    Ready to lock this item?
                  </span>{' '}
                  <span className="hidden sm:inline text-[#4E5369]">
                    Money stays protected until pickup.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onBuySafePay}
                  className="shrink-0 h-9 px-3.5 rounded-[10px] bg-[#3B2FD9] hover:bg-[#2E23B8] text-white text-[12px] font-bold inline-flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Buy with SafePay</span>
                </button>
              </div>

              {/* Quick Replies */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {QUICK_REPLIES.map((qr) => (
                  <button
                    key={qr}
                    type="button"
                    onClick={() => handleSend(qr)}
                    className="shrink-0 px-3 py-1.5 rounded-full bg-[#F7F7FA] hover:bg-[#EEF0FF] hover:text-[#3B2FD9] border border-[#E8EAF2] text-[12px] font-semibold text-[#4E5369] transition cursor-pointer"
                  >
                    {qr}
                  </button>
                ))}
              </div>

              {/* Input Row */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Write a message to Riya..."
                  className="flex-1 h-[46px] px-4 rounded-full bg-[#F7F7FA] border border-[#E8EAF2] focus:bg-white focus:border-[#3B2FD9] text-[14px] outline-none transition"
                />
                <button
                  type="submit"
                  aria-label="Send message"
                  className="w-[46px] h-[46px] rounded-full bg-[#3B2FD9] hover:bg-[#2E23B8] text-white flex items-center justify-center shrink-0 shadow-sm transition cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Desktop Context Sidebar */}
          {!forceMobile && (
            <aside className="hidden lg:block lg:col-span-4 space-y-4">
              <div className="bg-white rounded-[16px] border border-[#E8EAF2] p-5 shadow-card">
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="w-full aspect-[4/3] rounded-[12px] object-cover mb-3.5"
                />
                <div className="text-[22px] font-extrabold text-[#111322] tabular-nums">
                  {formatINR(listing.price)}
                </div>
                <div className="text-[15px] font-bold text-[#111322] mt-0.5">
                  {listing.title}
                </div>
                <div className="flex items-center gap-1.5 text-[12px] text-[#4E5369] mt-2">
                  <MapPin className="w-3.5 h-3.5 text-[#3B2FD9]" />
                  <span>{listing.area}, Bengaluru</span>
                </div>
                <button
                  type="button"
                  onClick={onBuySafePay}
                  className="w-full mt-4 h-12 rounded-[14px] bg-[#3B2FD9] hover:bg-[#2E23B8] text-white text-[14px] font-bold inline-flex items-center justify-center gap-2 shadow-indigo cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Buy with SafePay</span>
                </button>
              </div>

              <div className="bg-[#E7F7EE] border border-[#C3ECD4] rounded-[16px] p-4 space-y-2">
                <div className="text-[13px] font-extrabold text-[#157F3E] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Safety checklist for meetups</span>
                </div>
                <ul className="text-[12px] text-[#157F3E]/90 space-y-1.5 list-disc pl-4">
                  <li>Always pay via SafePay — never transfer UPI outside SnapSell.</li>
                  <li>Inspect the item thoroughly before sharing your 4-digit handover code.</li>
                  <li>Meet in well-lit public spots or society lobbies.</li>
                </ul>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
