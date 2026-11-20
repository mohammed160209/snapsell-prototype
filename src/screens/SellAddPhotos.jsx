import React, { useState } from 'react';
import {
  Camera,
  Sun,
  Eye,
  X,
  ImagePlus,
  Zap,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
} from 'lucide-react';

const SAMPLE_SLOTS = [
  {
    id: 'front',
    label: 'Front view',
    src: './images/study-table-1.jpg',
  },
  {
    id: 'angle',
    label: 'Angle / drawer',
    src: './images/study-table-2.jpg',
  },
  {
    id: 'detail',
    label: 'Defect / label',
    src: './images/study-table-3.jpg',
  },
];

export default function SellAddPhotos({
  photos,
  onChangePhotos,
  onContinue,
  onBack,
  forceMobile = false,
}) {
  const [flashOn, setFlashOn] = useState(false);
  const [shutterFlash, setShutterFlash] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const filledCount = photos.filter(Boolean).length;
  const nextEmptyIndex = photos.findIndex((p) => !p);
  const previewIndex = nextEmptyIndex === -1 ? 2 : nextEmptyIndex;

  const handleCapture = () => {
    setErrorMsg('');
    setShutterFlash(true);
    setTimeout(() => setShutterFlash(false), 180);

    if (nextEmptyIndex === -1) return;
    const updated = [...photos];
    updated[nextEmptyIndex] = SAMPLE_SLOTS[nextEmptyIndex].src;
    onChangePhotos(updated);
  };

  const handleSlotTap = (idx) => {
    setErrorMsg('');
    const updated = [...photos];
    updated[idx] = SAMPLE_SLOTS[idx].src;
    onChangePhotos(updated);
  };

  const handleRemove = (idx, e) => {
    e.stopPropagation();
    const updated = [...photos];
    updated[idx] = null;
    onChangePhotos(updated);
  };

  const handleContinue = () => {
    if (filledCount === 0) {
      setErrorMsg('Snap at least 1 photo so SnapSell AI can build your listing.');
      return;
    }
    onContinue?.();
  };

  return (
    <div className="pb-28 lg:pb-12">
      <div className="max-w-[960px] mx-auto px-4 lg:px-6 pt-4 lg:pt-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#4E5369] hover:text-[#111322] cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div className="text-center">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#3B2FD9]">
              Step 1 of 3
            </div>
            <h1 className="text-[17px] font-extrabold text-[#111322]">
              Snap your item
            </h1>
          </div>
          <div className="text-[13px] font-bold text-[#157F3E] bg-[#E7F7EE] px-2.5 py-1 rounded-full tabular-nums">
            {filledCount}/3
          </div>
        </div>

        <div
          className={`grid gap-5 ${
            forceMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12'
          }`}
        >
          {/* Camera Viewfinder */}
          <div className={forceMobile ? '' : 'lg:col-span-7'}>
            <div className="relative rounded-[20px] overflow-hidden bg-[#111322] aspect-[4/4.3] sm:aspect-[4/3.6] shadow-card border border-[#1E2238]">
              {/* Live viewfinder preview */}
              <img
                src={SAMPLE_SLOTS[previewIndex].src}
                alt="Camera preview"
                className="w-full h-full object-cover opacity-90"
              />

              {/* Subtle framing grid */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                {Array.from({ length: 9 }).map((_, idx) => (
                  <div key={idx} className="border border-white/15" />
                ))}
              </div>

              {/* Corner focus brackets */}
              <div className="absolute inset-6 pointer-events-none">
                <div className="absolute top-0 left-0 w-7 h-7 border-t-[3px] border-l-[3px] border-white/85 rounded-tl-xl" />
                <div className="absolute top-0 right-0 w-7 h-7 border-t-[3px] border-r-[3px] border-white/85 rounded-tr-xl" />
                <div className="absolute bottom-0 left-0 w-7 h-7 border-b-[3px] border-l-[3px] border-white/85 rounded-bl-xl" />
                <div className="absolute bottom-0 right-0 w-7 h-7 border-b-[3px] border-r-[3px] border-white/85 rounded-br-xl" />
              </div>

              {/* Shutter white flash */}
              {shutterFlash && (
                <div className="absolute inset-0 bg-white/80 pointer-events-none transition" />
              )}

              {/* Top Viewfinder Controls */}
              <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                <span className="px-3 py-1.5 rounded-full bg-black/55 backdrop-blur-md text-white text-[12px] font-semibold">
                  {nextEmptyIndex === -1
                    ? 'All 3 slots ready!'
                    : `Next: ${SAMPLE_SLOTS[previewIndex].label}`}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFlashOn((f) => !f)}
                    className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition cursor-pointer ${
                      flashOn
                        ? 'bg-[#FBBF24] text-[#111322]'
                        : 'bg-black/50 text-white'
                    }`}
                    aria-label="Toggle flash"
                  >
                    <Zap className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangePhotos([null, null, null])}
                    className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition cursor-pointer"
                    title="Clear photos"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Bottom Shutter Bar inside viewfinder */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-5 pt-8 pb-5 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() =>
                    onChangePhotos(SAMPLE_SLOTS.map((s) => s.src))
                  }
                  className="px-3.5 py-2 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md text-white text-[12px] font-semibold inline-flex items-center gap-1.5 transition cursor-pointer"
                >
                  <ImagePlus className="w-4 h-4" />
                  <span>Gallery</span>
                </button>

                <button
                  type="button"
                  onClick={handleCapture}
                  disabled={nextEmptyIndex === -1}
                  aria-label="Take photo"
                  className={`w-[68px] h-[68px] rounded-full p-1 border-[3px] border-white flex items-center justify-center transition cursor-pointer active:scale-90 ${
                    nextEmptyIndex === -1
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:scale-105'
                  }`}
                >
                  <span className="w-full h-full rounded-full bg-[#FF5A3D] flex items-center justify-center text-white shadow-coral">
                    <Camera className="w-6 h-6" />
                  </span>
                </button>

                <div className="w-[82px] text-right text-[12px] font-semibold text-white/90">
                  {filledCount < 3 ? 'Tap shutter' : '3/3 done'}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Tips + 3 Photo Slots + Continue */}
          <div
            className={`${
              forceMobile ? '' : 'lg:col-span-5'
            } flex flex-col justify-between gap-4`}
          >
            <div className="space-y-4">
              {/* Tips Card */}
              <div className="bg-[#EEF0FF] border border-[#D6DAFF] rounded-[16px] px-4 py-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-[12px] bg-[#3B2FD9] text-white flex items-center justify-center shrink-0">
                  <Sun className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-[14px] font-bold text-[#111322] flex items-center gap-1.5 flex-wrap">
                    <span>Good light</span>
                    <span className="text-[#3B2FD9]">·</span>
                    <span className="inline-flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-[#3B2FD9]" />
                      Show any defects
                    </span>
                  </div>
                  <p className="text-[12px] text-[#4E5369] mt-0.5">
                    Clear, honest photos sell 3× faster and prevent meetup disputes.
                  </p>
                </div>
              </div>

              {/* 3 Photo Slots */}
              <div className="bg-white rounded-[16px] border border-[#E8EAF2] p-4 shadow-card">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-[14px] font-bold text-[#111322]">
                    Photo slots (3 max)
                  </h2>
                  <span className="text-[12px] font-medium text-[#7C8199]">
                    Tap any slot to add
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {SAMPLE_SLOTS.map((slot, idx) => {
                    const photoSrc = photos[idx];
                    return (
                      <div
                        key={slot.id}
                        onClick={() => handleSlotTap(idx)}
                        className={`relative aspect-square rounded-[14px] overflow-hidden border-2 transition cursor-pointer flex flex-col items-center justify-center ${
                          photoSrc
                            ? 'border-[#157F3E]'
                            : 'border-dashed border-[#C7CCE0] bg-[#F7F7FA] hover:border-[#3B2FD9] hover:bg-[#EEF0FF]/40'
                        }`}
                      >
                        {photoSrc ? (
                          <>
                            <img
                              src={photoSrc}
                              alt={slot.label}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={(e) => handleRemove(idx, e)}
                              aria-label={`Remove ${slot.label}`}
                              className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-[#DC2626] transition cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                            <span className="absolute bottom-1.5 left-1.5 bg-[#E7F7EE]/95 text-[#157F3E] text-[10px] font-bold px-1.5 py-0.5 rounded-full inline-flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3" />
                              {idx + 1}
                            </span>
                          </>
                        ) : (
                          <div className="text-center p-2">
                            <div className="w-8 h-8 rounded-full bg-white border border-[#E8EAF2] text-[#3B2FD9] flex items-center justify-center mx-auto mb-1.5">
                              <Camera className="w-4 h-4" />
                            </div>
                            <span className="text-[11px] font-semibold text-[#4E5369] leading-tight block">
                              {slot.label}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {errorMsg && (
                <div className="bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] rounded-[14px] px-4 py-3 text-[13px] font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>

            {/* Continue CTA */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={handleContinue}
                className={`w-full h-[54px] rounded-[16px] font-bold text-[15px] flex items-center justify-center gap-2 transition cursor-pointer ${
                  filledCount > 0
                    ? 'bg-[#3B2FD9] hover:bg-[#2E23B8] text-white shadow-indigo active:scale-[0.99]'
                    : 'bg-[#E8EAF2] text-[#7C8199]'
                }`}
              >
                <span>Continue with {filledCount || 0} photo{filledCount === 1 ? '' : 's'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-center text-[12px] text-[#7C8199]">
                Next: SnapSell AI reads your photos and asks 3 quick tap questions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
