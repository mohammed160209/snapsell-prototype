import React from 'react';
import { Camera, ShieldCheck, Sparkles } from 'lucide-react';

export function SnapSellLogo({ size = 'md', showTagline = false, dark = false }) {
  const sizes = {
    sm: { box: 'w-8 h-8 rounded-[10px]', icon: 'w-4 h-4', text: 'text-[17px]' },
    md: { box: 'w-10 h-10 rounded-[12px]', icon: 'w-5 h-5', text: 'text-[20px]' },
    lg: { box: 'w-14 h-14 rounded-[16px]', icon: 'w-7 h-7', text: 'text-[28px]' },
  }[size];

  return (
    <div className="inline-flex items-center gap-2.5 select-none">
      <div
        className={`${sizes.box} bg-[#3B2FD9] text-white flex items-center justify-center relative shadow-indigo shrink-0`}
      >
        <Camera className={sizes.icon} strokeWidth={2.3} />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#FF5A3D] border-2 border-white flex items-center justify-center">
          <Sparkles className="w-2 h-2 text-white" />
        </span>
      </div>
      <div className="leading-tight">
        <div
          className={`${sizes.text} font-extrabold tracking-[-0.03em] ${
            dark ? 'text-white' : 'text-[#111322]'
          }`}
        >
          Snap<span className="text-[#3B2FD9]">Sell</span>
        </div>
        {showTagline && (
          <div className="text-[13px] font-medium text-[#4E5369] mt-0.5">
            Snap it. List it. Sell it safely.
          </div>
        )}
      </div>
    </div>
  );
}

export function VerifiedBadge({ text = 'Verified', subtle = false }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold ${
        subtle
          ? 'bg-[#E7F7EE] text-[#157F3E] text-[11px] px-2 py-0.5'
          : 'bg-[#E7F7EE] text-[#157F3E] border border-[#C3ECD4] text-[12px] px-2.5 py-1'
      }`}
    >
      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
      <span>{text}</span>
    </span>
  );
}

export function ConditionPill({ condition }) {
  const styles = {
    'Like New': 'bg-[#E7F7EE] text-[#157F3E] border-[#C3ECD4]',
    Good: 'bg-[#EEF0FF] text-[#3B2FD9] border-[#D6DAFF]',
    Fair: 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]',
  }[condition] || 'bg-[#F3F4F6] text-[#4E5369] border-[#E5E7EB]';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${styles}`}
    >
      {condition}
    </span>
  );
}
