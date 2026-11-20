import React, { useState } from 'react';
import {
  Smartphone,
  Monitor,
  ChevronDown,
  ChevronUp,
  Layers,
} from 'lucide-react';
import {
  INITIAL_LISTINGS,
  INITIAL_CHAT_MESSAGES,
  SELLER_ORDERS,
} from './data/mockData';
import { DesktopHeader, BottomNav } from './components/Navigation';

import WelcomeSignIn from './screens/WelcomeSignIn';
import HomeStorefront from './screens/HomeStorefront';
import SellAddPhotos from './screens/SellAddPhotos';
import AIQuestions from './screens/AIQuestions';
import ReviewPublish from './screens/ReviewPublish';
import ListingDetail from './screens/ListingDetail';
import ChatScreen from './screens/ChatScreen';
import SafePayCheckout from './screens/SafePayCheckout';
import OrderStatus from './screens/OrderStatus';
import SellerDashboard from './screens/SellerDashboard';
import AdminDashboard from './screens/AdminDashboard';

const SCREENS = [
  { id: 1, short: '01 Sign-in', label: '1. Welcome & Sign-in' },
  { id: 2, short: '02 Storefront', label: '2. Home Storefront' },
  { id: 3, short: '03 Add Photos', label: '3. Sell – Add Photos' },
  { id: 4, short: '04 AI Questions', label: '4. AI Questions' },
  { id: 5, short: '05 Review', label: '5. Review & Publish' },
  { id: 6, short: '06 Listing', label: '6. Listing Detail' },
  { id: 7, short: '07 Chat', label: '7. Chat' },
  { id: 8, short: '08 SafePay', label: '8. SafePay Checkout' },
  { id: 9, short: '09 Order', label: '9. Order Status' },
  { id: 10, short: '10 Seller Shop', label: '10. Seller Dashboard' },
  { id: 11, short: '11 Admin', label: '11. Admin Dashboard (1440px)' },
];

export default function App() {
  const [activeScreen, setActiveScreen] = useState(2);
  const [previewMode, setPreviewMode] = useState('responsive'); // responsive | mobile
  const [dockCollapsed, setDockCollapsed] = useState(false);

  // User profile state
  const [userProfile, setUserProfile] = useState({
    name: 'Riya',
    fullName: 'Riya Sharma',
    area: 'Koramangala',
    initials: 'RS',
  });

  // Marketplace data & shared flow state
  const [listings, setListings] = useState(INITIAL_LISTINGS);
  const [selectedListingId, setSelectedListingId] = useState(INITIAL_LISTINGS[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusSearchTrigger, setFocusSearchTrigger] = useState(0);

  // Variant state controls
  const [welcomeStep, setWelcomeStep] = useState('phone');
  const [storefrontState, setStorefrontState] = useState('default'); // default | loading | empty | error
  const [aiLoadingMode, setAiLoadingMode] = useState(false);
  const [listingSoldMode, setListingSoldMode] = useState(false);
  const [checkoutPaidMode, setCheckoutPaidMode] = useState(false);
  const [sellerEmptyMode, setSellerEmptyMode] = useState(false);

  // Sell flow state (Screens 3 -> 4 -> 5)
  const [sellPhotos, setSellPhotos] = useState([
    './images/study-table-1.jpg',
    './images/study-table-2.jpg',
    null,
  ]);
  const [aiDraft, setAiDraft] = useState({
    detectedName: 'Wooden study table',
    age: '1–2 years',
    defects: 'Minor scratches',
    included: 'With drawer keys',
    labelPhotoAdded: false,
  });

  // Chat state (Screen 7)
  const [chatMessages, setChatMessages] = useState(INITIAL_CHAT_MESSAGES);

  // Seller orders state (Screens 9 & 10)
  const [sellerOrders, setSellerOrders] = useState(SELLER_ORDERS);
  const [activeOrderId, setActiveOrderId] = useState(SELLER_ORDERS[0].id);

  const selectedListing =
    listings.find((l) => l.id === selectedListingId) || listings[0];
  const activeOrder =
    sellerOrders.find((o) => o.id === activeOrderId) || sellerOrders[0];
  const sellerListings = listings.filter((l) => l.seller.name === 'Riya');

  const isMobileFrame = previewMode === 'mobile' && activeScreen !== 11;

  const navigate = (screenId) => {
    setActiveScreen(screenId);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleContinueToAI = () => {
    setAiLoadingMode(true);
    navigate(4);
    setTimeout(() => {
      setAiLoadingMode(false);
    }, 1850);
  };

  const handlePublishListing = (draft) => {
    const newItem = {
      id: `lst-new-${Date.now()}`,
      title: draft.title,
      price: draft.price,
      mrpHint: '₹2,500–3,500',
      category: 'Furniture',
      condition: draft.condition,
      area: userProfile.area,
      distance: '0.2 km',
      postedAt: 'Just now',
      stock: draft.stock,
      status: 'active',
      images: draft.images,
      seller: {
        name: userProfile.name,
        fullName: userProfile.fullName,
        area: userProfile.area,
        initials: userProfile.initials,
        verifiedSales: 12,
        rating: 4.9,
        responseTime: 'Usually replies in 10 mins',
        shopSlug: 'riya-koramangala',
        joined: 'Member since Jan 2025',
      },
      description: draft.description,
      specs: draft.specs,
      confirmedFacts: [
        { label: 'Age', value: aiDraft.age || '1–2 years' },
        { label: 'Defects', value: aiDraft.defects || 'Minor scratches' },
        { label: 'Included', value: aiDraft.included || 'With drawer keys' },
      ],
      aiVerified: true,
    };
    setListings((prev) => [newItem, ...prev]);
    setSelectedListingId(newItem.id);
    setSellerEmptyMode(false);
  };

  const handleSendMessage = (text) => {
    const now = new Date().toLocaleTimeString('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
    });
    const newMsg = {
      id: `m-${Date.now()}`,
      sender: 'buyer',
      text,
      time: now,
      read: true,
    };
    setChatMessages((prev) => [...prev, newMsg]);

    // Simulated friendly seller reply
    setTimeout(() => {
      let reply = `Sure! You can reserve it with SafePay and pick it up anytime after 5 PM in ${selectedListing.area}.`;
      if (text.toLowerCase().includes('available')) {
        reply = 'Yes, still available! Tap Buy with SafePay if you want me to hold it for you today.';
      } else if (text.includes('5')) {
        reply = '5 PM works great! Let’s meet near Koramangala 4th Block Third Wave Coffee.';
      }
      setChatMessages((prev) => [
        ...prev,
        {
          id: `r-${Date.now()}`,
          sender: 'seller',
          text: reply,
          time: now,
        },
      ]);
    }, 650);
  };

  const handleUpdateListing = (id, patch) => {
    setListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  const handleCompleteOrder = () => {
    setSellerOrders((prev) =>
      prev.map((o) =>
        o.id === activeOrder.id
          ? { ...o, status: 'completed', updatedAt: 'Just now' }
          : o
      )
    );
  };

  const handleResetOrder = () => {
    setSellerOrders((prev) =>
      prev.map((o) =>
        o.id === activeOrder.id
          ? { ...o, status: 'paid', updatedAt: '18 mins ago' }
          : o
      )
    );
  };

  const showConsumerChrome = activeScreen !== 1 && activeScreen !== 11;
  const showBottomNav =
    showConsumerChrome && activeScreen !== 6 && activeScreen !== 7;

  const renderScreen = () => {
    switch (activeScreen) {
      case 1:
        return (
          <WelcomeSignIn
            stepOverride={welcomeStep}
            onStepChange={setWelcomeStep}
            onComplete={() => navigate(2)}
            userProfile={userProfile}
            onUpdateProfile={setUserProfile}
            forceMobile={isMobileFrame}
          />
        );
      case 2:
        return (
          <HomeStorefront
            listings={listings}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectListing={(item) => {
              setSelectedListingId(item.id);
              setListingSoldMode(item.status === 'sold');
              navigate(6);
            }}
            onStartSelling={() => navigate(3)}
            viewState={storefrontState}
            onChangeViewState={setStorefrontState}
            focusSearchTrigger={focusSearchTrigger}
            userProfile={userProfile}
            forceMobile={isMobileFrame}
          />
        );
      case 3:
        return (
          <SellAddPhotos
            photos={sellPhotos}
            onChangePhotos={setSellPhotos}
            onContinue={handleContinueToAI}
            onBack={() => navigate(2)}
            forceMobile={isMobileFrame}
          />
        );
      case 4:
        return (
          <AIQuestions
            photos={sellPhotos}
            aiDraft={aiDraft}
            onUpdateDraft={setAiDraft}
            loadingMode={aiLoadingMode}
            onToggleLoadingMode={setAiLoadingMode}
            onContinue={() => navigate(5)}
            onBack={() => navigate(3)}
            forceMobile={isMobileFrame}
          />
        );
      case 5:
        return (
          <ReviewPublish
            photos={sellPhotos}
            aiDraft={aiDraft}
            onPublish={handlePublishListing}
            onBack={() => navigate(4)}
            onViewListing={() => {
              setListingSoldMode(false);
              navigate(6);
            }}
            onGoToDashboard={() => navigate(10)}
            userProfile={userProfile}
            forceMobile={isMobileFrame}
          />
        );
      case 6:
        return (
          <ListingDetail
            listing={selectedListing}
            soldMode={listingSoldMode}
            onToggleSoldMode={setListingSoldMode}
            onBack={() => navigate(2)}
            onChat={() => navigate(7)}
            onBuySafePay={() => {
              setCheckoutPaidMode(false);
              navigate(8);
            }}
            onViewShop={() => navigate(10)}
            forceMobile={isMobileFrame}
          />
        );
      case 7:
        return (
          <ChatScreen
            listing={selectedListing}
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            onBuySafePay={() => {
              setCheckoutPaidMode(false);
              navigate(8);
            }}
            onViewListing={() => navigate(6)}
            onBack={() => navigate(6)}
            forceMobile={isMobileFrame}
          />
        );
      case 8:
        return (
          <SafePayCheckout
            listing={selectedListing}
            paidMode={checkoutPaidMode}
            onSetPaidMode={setCheckoutPaidMode}
            onBack={() => navigate(6)}
            onGoToOrderStatus={() => navigate(9)}
            onOpenChat={() => navigate(7)}
            forceMobile={isMobileFrame}
          />
        );
      case 9:
        return (
          <OrderStatus
            order={activeOrder}
            onOrderComplete={handleCompleteOrder}
            onResetOrder={handleResetOrder}
            onBack={() => navigate(10)}
            onOpenChat={() => navigate(7)}
            forceMobile={isMobileFrame}
          />
        );
      case 10:
        return (
          <SellerDashboard
            userProfile={userProfile}
            sellerListings={sellerListings}
            sellerOrders={sellerOrders}
            onUpdateListing={handleUpdateListing}
            onStartSelling={() => navigate(3)}
            onOpenOrder={(ord) => {
              setActiveOrderId(ord.id);
              navigate(9);
            }}
            onSelectListing={(item) => {
              setSelectedListingId(item.id);
              setListingSoldMode(item.status === 'sold');
              navigate(6);
            }}
            emptyMode={sellerEmptyMode}
            onToggleEmptyMode={setSellerEmptyMode}
            forceMobile={isMobileFrame}
          />
        );
      case 11:
        return <AdminDashboard onBackToApp={() => navigate(2)} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7FA] text-[#111322] flex flex-col">
      {/* Prototype Screen & Viewport Switcher Bar (Collapsible) */}
      <div className="sticky top-0 z-50 bg-[#111322] text-white border-b border-white/10">
        {dockCollapsed ? (
          <div className="max-w-[1440px] mx-auto px-4 h-9 flex items-center justify-between text-[12px]">
            <span className="font-bold text-white/90 inline-flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-[#FF5A3D]" />
              <span>
                SnapSell UI Kit ·{' '}
                {SCREENS.find((s) => s.id === activeScreen)?.label}
              </span>
            </span>
            <button
              type="button"
              onClick={() => setDockCollapsed(false)}
              className="inline-flex items-center gap-1 text-[#A5B4FC] hover:text-white font-semibold cursor-pointer"
            >
              <span>All 11 screens</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="max-w-[1440px] mx-auto px-3 sm:px-4 py-2 flex items-center justify-between gap-3">
            {/* Screen 1–11 Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-1">
              {SCREENS.map((sc) => {
                const active = activeScreen === sc.id;
                return (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => navigate(sc.id)}
                    className={`shrink-0 px-2.5 py-1.5 rounded-lg text-[11px] sm:text-[12px] font-bold transition cursor-pointer ${
                      active
                        ? 'bg-[#3B2FD9] text-white shadow-sm'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {sc.short}
                  </button>
                );
              })}
            </div>

            {/* Viewport Switcher (Desktop Responsive vs Mobile 390px Frame) */}
            <div className="hidden md:flex items-center gap-1.5 shrink-0 pl-2 border-l border-white/15">
              <button
                type="button"
                onClick={() => setPreviewMode('responsive')}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 transition cursor-pointer ${
                  !isMobileFrame
                    ? 'bg-white text-[#111322]'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Responsive</span>
              </button>
              <button
                type="button"
                disabled={activeScreen === 11}
                onClick={() => setPreviewMode('mobile')}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 transition ${
                  activeScreen === 11
                    ? 'opacity-40 cursor-not-allowed text-white/60'
                    : isMobileFrame
                    ? 'bg-[#FF5A3D] text-white cursor-pointer'
                    : 'text-white/70 hover:text-white cursor-pointer'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>390px Mobile</span>
              </button>
              <button
                type="button"
                onClick={() => setDockCollapsed(true)}
                title="Collapse bar"
                className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main App Viewport (Full Responsive or 390px Mobile Device Frame) */}
      {isMobileFrame ? (
        <div className="flex-1 flex justify-center py-6 px-4 bg-[#E9EBF4]">
          <div className="w-[390px] h-[820px] bg-[#F7F7FA] rounded-[36px] border-[8px] border-[#111322] shadow-2xl overflow-hidden relative flex flex-col">
            {/* Simulated status notch */}
            <div className="h-6 bg-white flex items-center justify-between px-6 text-[11px] font-bold text-[#111322] shrink-0">
              <span>9:41</span>
              <span className="w-20 h-4 bg-[#111322] rounded-full" />
              <span>5G 94%</span>
            </div>

            <div className="flex-1 overflow-y-auto relative no-scrollbar">
              {renderScreen()}
            </div>

            {showBottomNav && (
              <BottomNav
                activeScreen={activeScreen}
                onNavigate={navigate}
                onSearchFocus={() => setFocusSearchTrigger((c) => c + 1)}
                forceMobile
              />
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          {showConsumerChrome && (
            <DesktopHeader
              activeScreen={activeScreen}
              onNavigate={navigate}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              userProfile={userProfile}
            />
          )}

          <div className="flex-1">{renderScreen()}</div>

          {showBottomNav && (
            <BottomNav
              activeScreen={activeScreen}
              onNavigate={navigate}
              onSearchFocus={() => setFocusSearchTrigger((c) => c + 1)}
            />
          )}
        </div>
      )}
    </div>
  );
}
