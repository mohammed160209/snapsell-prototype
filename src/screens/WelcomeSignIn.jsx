import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  Camera,
  Lock,
} from 'lucide-react';
import { SnapSellLogo } from '../components/Brand';

const QUICK_AREAS = [
  'Koramangala',
  'Indiranagar',
  'HSR Layout',
  'BTM Layout',
  'Whitefield',
  'Jayanagar',
];

export default function WelcomeSignIn({
  stepOverride,
  onStepChange,
  onComplete,
  userProfile,
  onUpdateProfile,
  forceMobile = false,
}) {
  const [step, setStep] = useState(stepOverride || 'phone'); // phone | otp | profile
  const [phone, setPhone] = useState('98450 24190');
  const [phoneError, setPhoneError] = useState('');
  const [otp, setOtp] = useState(['1', '2', '3', '4', '5', '6']);
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(28);
  const [name, setName] = useState(userProfile?.fullName || 'Riya Sharma');
  const [area, setArea] = useState(userProfile?.area || 'Koramangala');
  const [profileError, setProfileError] = useState('');

  useEffect(() => {
    if (stepOverride) setStep(stepOverride);
  }, [stepOverride]);

  useEffect(() => {
    if (step !== 'otp' || resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [step, resendTimer]);

  const changeStep = (next) => {
    setStep(next);
    onStepChange?.(next);
  };

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, '');
    if (digits.length !== 10) {
      setPhoneError('Enter a valid 10-digit Indian mobile number.');
      return;
    }
    setPhoneError('');
    setResendTimer(28);
    changeStep('otp');
  };

  const handleOtpDigit = (index, val) => {
    const clean = val.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[index] = clean;
    setOtp(next);
    setOtpError('');
    if (clean && index < 5) {
      const el = document.getElementById(`otp-input-${index + 1}`);
      el?.focus();
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      setOtpError('Please enter all 6 digits sent via SMS.');
      return;
    }
    if (code === '000000') {
      setOtpError('Incorrect OTP. Please double-check the SMS or try 123456.');
      return;
    }
    setOtpError('');
    changeStep('profile');
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !area.trim()) {
      setProfileError('Please enter your name and neighbourhood.');
      return;
    }
    setProfileError('');
    const initials = name
      .trim()
      .split(/\s+/)
      .map((p) => p[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    onUpdateProfile?.({
      fullName: name.trim(),
      name: name.trim().split(' ')[0],
      area: area.trim(),
      initials: initials || 'RS',
    });
    onComplete?.();
  };

  const stepIndex = step === 'phone' ? 1 : step === 'otp' ? 2 : 3;

  return (
    <div className="min-h-[calc(100vh-110px)] flex items-center justify-center px-4 py-6 lg:py-10">
      <div
        className={`w-full ${
          forceMobile
            ? 'max-w-[390px]'
            : 'max-w-[440px] lg:max-w-[980px] lg:grid lg:grid-cols-12 lg:gap-8 lg:items-center'
        }`}
      >
        {/* Desktop Value Prop Left Column */}
        {!forceMobile && (
          <div className="hidden lg:flex lg:col-span-6 flex-col justify-between bg-[#3B2FD9] text-white rounded-[24px] p-10 min-h-[580px] relative overflow-hidden shadow-indigo">
            <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-[#FF5A3D]/25 blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-[13px] font-semibold mb-8">
                <Sparkles className="w-4 h-4 text-[#FFD6CE]" />
                <span>Bengaluru’s trusted neighbourhood marketplace</span>
              </div>

              <h1 className="text-[38px] font-extrabold leading-[1.12] tracking-[-0.03em] mb-4">
                Snap it. List it.
                <br />
                Sell it safely.
              </h1>
              <p className="text-[16px] text-white/80 leading-relaxed max-w-[400px]">
                Snap 3 photos and let AI write your listing & price guide in seconds. Get paid via SafePay when you hand over in person.
              </p>
            </div>

            <div className="relative z-10 space-y-3.5 mt-10">
              {[
                {
                  icon: Camera,
                  title: '2-minute AI listings',
                  desc: 'Auto-writes title, specs & fair ₹ price from your photos',
                },
                {
                  icon: ShieldCheck,
                  title: 'SafePay 4-digit handover',
                  desc: 'Buyer pays upfront; money releases instantly at pickup',
                },
                {
                  icon: MapPin,
                  title: 'Verified neighbours nearby',
                  desc: 'Koramangala, Indiranagar, HSR, Whitefield & more',
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="flex items-start gap-3.5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-[16px] p-3.5"
                  >
                    <div className="w-10 h-10 rounded-[12px] bg-white/15 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-[14px] font-bold">{item.title}</div>
                      <div className="text-[13px] text-white/75">{item.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Sign-in Interactive Card */}
        <div className={`${forceMobile ? '' : 'lg:col-span-6'} w-full`}>
          <div className="bg-white rounded-[20px] border border-[#E8EAF2] shadow-card p-6 sm:p-8">
            {/* Brand Header */}
            <div className="flex items-start justify-between gap-3 mb-6">
              <SnapSellLogo size="md" showTagline />
              <span className="text-[12px] font-semibold text-[#3B2FD9] bg-[#EEF0FF] px-2.5 py-1 rounded-full shrink-0">
                Step {stepIndex} / 3
              </span>
            </div>

            {/* Interactive Step Progress Pills */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {[
                { id: 'phone', label: '1. Mobile' },
                { id: 'otp', label: '2. OTP' },
                { id: 'profile', label: '3. Area' },
              ].map((s, idx) => {
                const active = step === s.id;
                const done = stepIndex > idx + 1;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => changeStep(s.id)}
                    className={`py-2 px-2 rounded-xl text-[12px] font-semibold border transition cursor-pointer ${
                      active
                        ? 'bg-[#EEF0FF] border-[#3B2FD9] text-[#3B2FD9]'
                        : done
                        ? 'bg-[#E7F7EE] border-[#C3ECD4] text-[#157F3E]'
                        : 'bg-[#F7F7FA] border-[#E8EAF2] text-[#7C8199] hover:text-[#111322]'
                    }`}
                  >
                    {done ? '✓ ' : ''}
                    {s.label}
                  </button>
                );
              })}
            </div>

            {/* STEP 1: Phone Number */}
            {step === 'phone' && (
              <form onSubmit={handlePhoneSubmit} className="space-y-5">
                <div>
                  <h2 className="text-[22px] font-extrabold tracking-[-0.02em] text-[#111322]">
                    Welcome to SnapSell
                  </h2>
                  <p className="text-[14px] text-[#4E5369] mt-1">
                    Enter your Indian mobile number to buy & sell with verified people nearby.
                  </p>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-[#111322] mb-2">
                    Mobile number
                  </label>
                  <div
                    className={`flex items-center h-[54px] rounded-[16px] border-2 bg-[#F7F7FA] focus-within:bg-white transition overflow-hidden ${
                      phoneError
                        ? 'border-[#DC2626] bg-[#FEF2F2]/40'
                        : 'border-[#E8EAF2] focus-within:border-[#3B2FD9]'
                    }`}
                  >
                    <div className="flex items-center gap-2 px-4 h-full border-r border-[#E8EAF2] bg-white/70 shrink-0">
                      <span className="text-[16px]" aria-hidden="true">
                        🇮🇳
                      </span>
                      <span className="text-[15px] font-bold text-[#111322] tabular-nums">
                        +91
                      </span>
                    </div>
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setPhoneError('');
                      }}
                      placeholder="98450 24190"
                      className="flex-1 h-full px-4 bg-transparent text-[16px] font-semibold text-[#111322] tabular-nums outline-none placeholder:text-[#9CA3AF]"
                    />
                  </div>
                  {phoneError ? (
                    <div className="mt-2 flex items-center gap-1.5 text-[13px] font-medium text-[#DC2626]">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{phoneError}</span>
                    </div>
                  ) : (
                    <div className="mt-2 flex items-center justify-between text-[12px] text-[#7C8199]">
                      <span>We’ll send a 6-digit SMS OTP. No spam calls.</span>
                      <button
                        type="button"
                        onClick={() => {
                          setPhone('9845');
                          setPhoneError('Enter a valid 10-digit Indian mobile number.');
                        }}
                        className="text-[#3B2FD9] font-semibold hover:underline cursor-pointer shrink-0 ml-2"
                      >
                        Test error
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full h-[54px] rounded-[16px] bg-[#3B2FD9] hover:bg-[#2E23B8] active:scale-[0.99] text-white text-[15px] font-bold flex items-center justify-center gap-2 shadow-indigo transition cursor-pointer"
                >
                  <span>Get OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="pt-3 border-t border-[#E8EAF2] flex items-center justify-between gap-2 text-[12px] text-[#4E5369]">
                  <span className="inline-flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#157F3E]" />
                    <span>Phone hidden from public listings</span>
                  </span>
                  <button
                    type="button"
                    onClick={onComplete}
                    className="text-[#3B2FD9] font-semibold hover:underline cursor-pointer"
                  >
                    Browse first →
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: OTP Verification */}
            {step === 'otp' && (
              <form onSubmit={handleOtpSubmit} className="space-y-5">
                <div>
                  <button
                    type="button"
                    onClick={() => changeStep('phone')}
                    className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#4E5369] hover:text-[#111322] mb-2 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Edit +91 {phone}</span>
                  </button>
                  <h2 className="text-[22px] font-extrabold tracking-[-0.02em] text-[#111322]">
                    Verify your number
                  </h2>
                  <p className="text-[14px] text-[#4E5369] mt-1">
                    Enter the 6-digit OTP sent to{' '}
                    <span className="font-semibold text-[#111322] tabular-nums">
                      +91 {phone}
                    </span>
                  </p>
                </div>

                <div>
                  <div className="grid grid-cols-6 gap-2 sm:gap-2.5">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        id={`otp-input-${i}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpDigit(i, e.target.value)}
                        className={`h-[54px] text-center text-[20px] font-extrabold tabular-nums rounded-[14px] border-2 bg-[#F7F7FA] focus:bg-white outline-none transition ${
                          otpError
                            ? 'border-[#DC2626] text-[#DC2626]'
                            : digit
                            ? 'border-[#3B2FD9] bg-[#EEF0FF]/40 text-[#111322]'
                            : 'border-[#E8EAF2] focus:border-[#3B2FD9]'
                        }`}
                      />
                    ))}
                  </div>

                  {otpError ? (
                    <div className="mt-2.5 flex items-center gap-1.5 text-[13px] font-medium text-[#DC2626]">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{otpError}</span>
                    </div>
                  ) : (
                    <div className="mt-3 flex items-center justify-between text-[13px]">
                      <span className="text-[#7C8199]">
                        {resendTimer > 0
                          ? `Resend OTP in 0:${String(resendTimer).padStart(2, '0')}`
                          : 'Didn’t get it?'}
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setOtp(['0', '0', '0', '0', '0', '0']);
                            setOtpError('Incorrect OTP. Please double-check the SMS or try 123456.');
                          }}
                          className="text-[12px] font-semibold text-[#7C8199] hover:text-[#DC2626] cursor-pointer"
                        >
                          Test wrong OTP
                        </button>
                        {resendTimer === 0 && (
                          <button
                            type="button"
                            onClick={() => setResendTimer(30)}
                            className="font-semibold text-[#3B2FD9] hover:underline cursor-pointer"
                          >
                            Resend SMS
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full h-[54px] rounded-[16px] bg-[#3B2FD9] hover:bg-[#2E23B8] active:scale-[0.99] text-white text-[15px] font-bold flex items-center justify-center gap-2 shadow-indigo transition cursor-pointer"
                >
                  <span>Verify & continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* STEP 3: Name & Area (First Time Only) */}
            {step === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="space-y-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-[#E7F7EE] text-[#157F3E] text-[12px] font-semibold px-2.5 py-1 rounded-full mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Phone verified · First-time setup</span>
                  </div>
                  <h2 className="text-[22px] font-extrabold tracking-[-0.02em] text-[#111322]">
                    Tell neighbours who you are
                  </h2>
                  <p className="text-[14px] text-[#4E5369] mt-1">
                    Helps show listings closest to you and builds buyer trust.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-[#111322] mb-1.5">
                      Your full name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setProfileError('');
                      }}
                      placeholder="e.g. Riya Sharma"
                      className="w-full h-[50px] px-4 rounded-[14px] border-2 border-[#E8EAF2] bg-[#F7F7FA] focus:bg-white focus:border-[#3B2FD9] text-[15px] font-medium outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-[#111322] mb-1.5">
                      Your neighbourhood / area
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-[#3B2FD9] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={area}
                        onChange={(e) => {
                          setArea(e.target.value);
                          setProfileError('');
                        }}
                        placeholder="e.g. Koramangala"
                        className="w-full h-[50px] pl-10 pr-4 rounded-[14px] border-2 border-[#E8EAF2] bg-[#F7F7FA] focus:bg-white focus:border-[#3B2FD9] text-[15px] font-medium outline-none transition"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2.5">
                      {QUICK_AREAS.map((a) => (
                        <button
                          key={a}
                          type="button"
                          onClick={() => setArea(a)}
                          className={`px-3 py-1.5 rounded-full text-[12px] font-semibold border transition cursor-pointer ${
                            area === a
                              ? 'bg-[#3B2FD9] text-white border-[#3B2FD9]'
                              : 'bg-[#F7F7FA] text-[#4E5369] border-[#E8EAF2] hover:border-[#3B2FD9]/40'
                          }`}
                        >
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {profileError && (
                  <div className="flex items-center gap-1.5 text-[13px] font-medium text-[#DC2626]">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{profileError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full h-[54px] rounded-[16px] bg-[#3B2FD9] hover:bg-[#2E23B8] active:scale-[0.99] text-white text-[15px] font-bold flex items-center justify-center gap-2 shadow-indigo transition cursor-pointer"
                >
                  <span>Start exploring SnapSell</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

          {/* Mobile Trust Footnote */}
          <div className="mt-4 flex items-center justify-center gap-4 text-[12px] font-medium text-[#4E5369]">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#157F3E]" />
              SafePay
            </span>
            <span>·</span>
            <span>100% Free to Browse</span>
            <span>·</span>
            <span>Zero Spam</span>
          </div>
        </div>
      </div>
    </div>
  );
}
