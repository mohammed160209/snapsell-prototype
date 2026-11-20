import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ChevronLeft,
  Camera,
  CheckCircle2,
  ArrowRight,
  Edit3,
  AlertTriangle,
  Loader2,
} from 'lucide-react';

const QUESTIONS = [
  {
    id: 'age',
    question: 'How old is it?',
    options: ['< 6 months', '6–12 months', '1–2 years', '2+ years'],
  },
  {
    id: 'defects',
    question: 'Any defects?',
    options: ['None — spotless', 'Minor scratches', 'Small dent/wear', 'Needs minor fix'],
  },
  {
    id: 'included',
    question: 'What’s included?',
    options: ['Table only', 'With drawer keys', 'Assembly tools', 'Original bill'],
  },
];

export default function AIQuestions({
  photos,
  aiDraft,
  onUpdateDraft,
  loadingMode = false,
  onToggleLoadingMode,
  onContinue,
  onBack,
  forceMobile = false,
}) {
  const [editingItem, setEditingItem] = useState(false);
  const [detectedName, setDetectedName] = useState(
    aiDraft.detectedName || 'Wooden study table'
  );
  const [labelPhotoAdded, setLabelPhotoAdded] = useState(
    Boolean(aiDraft.labelPhotoAdded)
  );
  const [scanStage, setScanStage] = useState(0);

  useEffect(() => {
    if (!loadingMode) return;
    setScanStage(0);
    const t1 = setTimeout(() => setScanStage(1), 700);
    const t2 = setTimeout(() => setScanStage(2), 1400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [loadingMode]);

  const activePhotos = photos.filter(Boolean);
  const thumbList =
    activePhotos.length > 0
      ? activePhotos
      : ['./images/study-table-1.jpg', './images/study-table-2.jpg'];

  const handleSelectChip = (qId, option) => {
    onUpdateDraft({ ...aiDraft, [qId]: option });
  };

  const handleAddLabelPhoto = () => {
    setLabelPhotoAdded(true);
    onUpdateDraft({ ...aiDraft, labelPhotoAdded: true });
  };

  return (
    <div className="pb-28 lg:pb-12">
      <div className="max-w-[760px] mx-auto px-4 lg:px-6 pt-4 lg:pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#4E5369] hover:text-[#111322] cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Photos</span>
          </button>
          <div className="text-center">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#3B2FD9]">
              Step 2 of 3
            </div>
            <h1 className="text-[17px] font-extrabold text-[#111322]">
              Quick AI check
            </h1>
          </div>

          {/* Toggle Loading State Preview */}
          <button
            type="button"
            onClick={() => onToggleLoadingMode?.(!loadingMode)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition cursor-pointer ${
              loadingMode
                ? 'bg-[#3B2FD9] text-white border-[#3B2FD9]'
                : 'bg-white text-[#4E5369] border-[#E8EAF2] hover:border-[#3B2FD9]'
            }`}
          >
            {loadingMode ? 'Show Questions' : 'Preview Loading'}
          </button>
        </div>

        {/* LOADING STATE: "Reading your photos…" */}
        {loadingMode ? (
          <div className="bg-white rounded-[20px] border border-[#E8EAF2] p-6 sm:p-8 shadow-card text-center">
            <div className="relative max-w-[260px] mx-auto aspect-square rounded-[18px] overflow-hidden border-2 border-[#3B2FD9]/30 mb-6 shadow-card">
              <img
                src={thumbList[0]}
                alt="Scanning item"
                className="w-full h-full object-cover"
              />
              {/* Animated indigo scanline */}
              <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-[#3B2FD9]/30 to-transparent border-b-2 border-[#3B2FD9] animate-scan" />
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#111322]/85 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-[12px] font-semibold inline-flex items-center gap-1.5 whitespace-nowrap">
                <Sparkles className="w-3.5 h-3.5 text-[#A5B4FC]" />
                <span>SnapSell Vision AI</span>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 text-[#3B2FD9] font-extrabold text-[20px]">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Reading your photos…</span>
            </div>
            <p className="text-[14px] text-[#4E5369] mt-1.5 max-w-[360px] mx-auto">
              Detecting item details, checking visible wear, and comparing recent sales in Koramangala.
            </p>

            <div className="mt-6 max-w-[320px] mx-auto space-y-2.5 text-left">
              {[
                'Identifying item & material',
                'Scanning condition & surface details',
                'Checking fair ₹ price nearby',
              ].map((stepText, idx) => {
                const done = scanStage > idx;
                const active = scanStage === idx;
                return (
                  <div
                    key={stepText}
                    className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-[12px] text-[13px] font-semibold border transition ${
                      done
                        ? 'bg-[#E7F7EE] border-[#C3ECD4] text-[#157F3E]'
                        : active
                        ? 'bg-[#EEF0FF] border-[#D6DAFF] text-[#3B2FD9]'
                        : 'bg-[#F7F7FA] border-[#E8EAF2] text-[#7C8199]'
                    }`}
                  >
                    {done ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                    ) : active ? (
                      <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border-2 border-[#C7CCE0] shrink-0" />
                    )}
                    <span>{stepText}</span>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => onToggleLoadingMode?.(false)}
              className="mt-6 text-[13px] font-semibold text-[#3B2FD9] hover:underline cursor-pointer"
            >
              Skip animation →
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* AI Detection Card */}
            <div className="bg-white rounded-[16px] border border-[#D6DAFF] p-4 sm:p-5 shadow-card">
              <div className="flex items-start gap-4">
                <img
                  src={thumbList[0]}
                  alt="Detected item"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-[14px] object-cover border border-[#E8EAF2] shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EEF0FF] text-[#3B2FD9] text-[11px] font-bold mb-1.5">
                    <Sparkles className="w-3 h-3" />
                    <span>AI matched from {thumbList.length} photos</span>
                  </div>

                  {editingItem ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="text"
                        value={detectedName}
                        onChange={(e) => {
                          setDetectedName(e.target.value);
                          onUpdateDraft({
                            ...aiDraft,
                            detectedName: e.target.value,
                          });
                        }}
                        className="flex-1 h-10 px-3 rounded-[10px] border-2 border-[#3B2FD9] text-[15px] font-bold text-[#111322] outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setEditingItem(false)}
                        className="px-3.5 h-10 rounded-[10px] bg-[#3B2FD9] text-white text-[13px] font-bold cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-baseline justify-between gap-2 flex-wrap">
                      <h2 className="text-[18px] sm:text-[20px] font-extrabold text-[#111322]">
                        Looks like:{' '}
                        <span className="text-[#3B2FD9]">{detectedName}</span>
                      </h2>
                      <button
                        type="button"
                        onClick={() => setEditingItem(true)}
                        className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#3B2FD9] hover:underline cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Not right?</span>
                      </button>
                    </div>
                  )}

                  <p className="text-[13px] text-[#4E5369] mt-1">
                    Category: Furniture · Solid wood finish · Drawer detected
                  </p>
                </div>
              </div>
            </div>

            {/* Highlighted Prompt: Add one more photo of the label */}
            <div
              className={`rounded-[16px] p-4 border-2 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                labelPhotoAdded
                  ? 'bg-[#E7F7EE] border-[#C3ECD4]'
                  : 'bg-[#FFF8EB] border-[#FCD34D]'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 ${
                    labelPhotoAdded
                      ? 'bg-[#157F3E] text-white'
                      : 'bg-[#F59E0B] text-white'
                  }`}
                >
                  {labelPhotoAdded ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className="text-[14px] font-extrabold text-[#111322]">
                    {labelPhotoAdded
                      ? 'Label photo added — trust score boosted!'
                      : 'Add one more photo of the label'}
                  </div>
                  <p className="text-[12px] text-[#4E5369] mt-0.5">
                    {labelPhotoAdded
                      ? 'AI verified the wood care sticker and edge finish for buyers.'
                      : 'Showing a brand tag or care sticker helps buyers pay asking price faster.'}
                  </p>
                </div>
              </div>

              {!labelPhotoAdded ? (
                <button
                  type="button"
                  onClick={handleAddLabelPhoto}
                  className="shrink-0 h-11 px-4 rounded-[12px] bg-[#111322] hover:bg-[#272B42] text-white text-[13px] font-bold inline-flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Add label photo</span>
                </button>
              ) : (
                <img
                  src="./images/study-table-3.jpg"
                  alt="Label photo"
                  className="w-12 h-12 rounded-[10px] object-cover border-2 border-[#157F3E] shrink-0"
                />
              )}
            </div>

            {/* 3 Tap-to-Answer Chip Questions */}
            <div className="bg-white rounded-[16px] border border-[#E8EAF2] p-5 shadow-card space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-extrabold text-[#111322]">
                  3 quick taps to finish your listing
                </h3>
                <span className="text-[12px] font-semibold text-[#157F3E] bg-[#E7F7EE] px-2.5 py-0.5 rounded-full">
                  ~15 seconds
                </span>
              </div>

              {QUESTIONS.map((q, qIdx) => (
                <div
                  key={q.id}
                  className={qIdx > 0 ? 'pt-4 border-t border-[#F1F2F7]' : ''}
                >
                  <div className="text-[14px] font-bold text-[#111322] mb-2.5">
                    {qIdx + 1}. {q.question}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {q.options.map((opt) => {
                      const selected = aiDraft[q.id] === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleSelectChip(q.id, opt)}
                          className={`min-h-[42px] px-4 py-2 rounded-full text-[13px] font-semibold border transition cursor-pointer ${
                            selected
                              ? 'bg-[#3B2FD9] text-white border-[#3B2FD9] shadow-sm'
                              : 'bg-[#F7F7FA] text-[#4E5369] border-[#E8EAF2] hover:border-[#3B2FD9]/50 hover:text-[#111322]'
                          }`}
                        >
                          {selected ? '✓ ' : ''}
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Continue CTA */}
            <button
              type="button"
              onClick={onContinue}
              className="w-full h-[54px] rounded-[16px] bg-[#3B2FD9] hover:bg-[#2E23B8] active:scale-[0.99] text-white text-[15px] font-bold flex items-center justify-center gap-2 shadow-indigo transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate my listing</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
