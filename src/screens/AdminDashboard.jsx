import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Flag,
  Scale,
  Users,
  Wallet,
  TrendingUp,
  IndianRupee,
  CheckCircle2,
  EyeOff,
  ShieldCheck,
  RotateCcw,
  Search,
  AlertTriangle,
  ArrowUpRight,
  SlidersHorizontal,
} from 'lucide-react';
import {
  ADMIN_ORDERS,
  ADMIN_FLAGGED_LISTINGS,
  ADMIN_DISPUTES,
  formatINR,
} from '../data/mockData';
import { SnapSellLogo } from '../components/Brand';

const ORDER_STATUSES = [
  'All',
  'Paid / On Hold',
  'Handed Over',
  'Completed',
  'Disputed',
];

export default function AdminDashboard({ onBackToApp }) {
  const [navSection, setNavSection] = useState('overview');
  const [statusFilter, setStatusFilter] = useState('All');
  const [orderSearch, setOrderSearch] = useState('');
  const [flagged, setFlagged] = useState(ADMIN_FLAGGED_LISTINGS);
  const [disputes, setDisputes] = useState(ADMIN_DISPUTES);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2600);
  };

  const handleFlagAction = (id, action) => {
    setFlagged((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: action } : item
      )
    );
    showToast(
      action === 'hidden'
        ? `Listing ${id} hidden from marketplace`
        : `Listing ${id} approved & restored`
    );
  };

  const handleDisputeAction = (id, action) => {
    setDisputes((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: action } : d))
    );
    showToast(
      action === 'released'
        ? `Dispute ${id}: Payment released to seller`
        : `Dispute ${id}: Full refund initiated to buyer`
    );
  };

  const pendingFlagsCount = flagged.filter((f) => f.status === 'pending').length;
  const openDisputesCount = disputes.filter((d) => d.status === 'open').length;

  const filteredOrders = ADMIN_ORDERS.filter((o) => {
    if (statusFilter !== 'All' && o.status !== statusFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      return `${o.id} ${o.item} ${o.buyer} ${o.seller}`
        .toLowerCase()
        .includes(q);
    }
    return true;
  });

  const kpis = [
    {
      label: 'Total Sales (GMV)',
      value: '₹8,42,600',
      sub: '+18.4% vs last 7d',
      icon: TrendingUp,
      accent: 'bg-[#EEF0FF] text-[#3B2FD9]',
      positive: true,
    },
    {
      label: 'Commission Earned',
      value: '₹42,130',
      sub: '5.0% avg SafePay fee',
      icon: IndianRupee,
      accent: 'bg-[#E7F7EE] text-[#157F3E]',
      positive: true,
    },
    {
      label: 'Orders',
      value: '318',
      sub: '284 completed · 29 on hold',
      icon: ShoppingBag,
      accent: 'bg-[#FFF1EE] text-[#FF5A3D]',
      positive: true,
    },
    {
      label: 'New Sellers',
      value: '64',
      sub: '92% phone + UPI verified',
      icon: Users,
      accent: 'bg-[#FEF3C7] text-[#B45309]',
      positive: true,
    },
  ];

  const statusBadgeStyle = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-[#E7F7EE] text-[#157F3E] border-[#C3ECD4]';
      case 'Paid / On Hold':
        return 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]';
      case 'Handed Over':
        return 'bg-[#EEF0FF] text-[#3B2FD9] border-[#D6DAFF]';
      case 'Disputed':
        return 'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]';
      default:
        return 'bg-[#F3F4F6] text-[#4E5369] border-[#E5E7EB]';
    }
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, count: ADMIN_ORDERS.length },
    { id: 'flagged', label: 'Flagged Queue', icon: Flag, count: pendingFlagsCount, alert: pendingFlagsCount > 0 },
    { id: 'disputes', label: 'Disputes', icon: Scale, count: openDisputesCount, alert: openDisputesCount > 0 },
    { id: 'payouts', label: 'SafePay Payouts', icon: Wallet },
  ];

  return (
    <div className="min-h-[calc(100vh-52px)] bg-[#F7F7FA] pb-16 lg:pb-8">
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row min-h-[calc(100vh-52px)]">
        {/* Desktop 1440px Left Sidebar Navigation */}
        <aside className="w-full lg:w-[252px] shrink-0 bg-white border-b lg:border-b-0 lg:border-r border-[#E8EAF2] p-4 lg:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between lg:block mb-5">
              <div className="flex items-center gap-2">
                <SnapSellLogo size="sm" />
                <span className="px-2 py-0.5 rounded-md bg-[#111322] text-white text-[10px] font-extrabold uppercase tracking-wider">
                  Admin
                </span>
              </div>
              <button
                type="button"
                onClick={onBackToApp}
                className="lg:hidden text-[12px] font-bold text-[#3B2FD9] hover:underline"
              >
                Consumer app →
              </button>
            </div>

            <nav className="flex lg:flex-col gap-1.5 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = navSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setNavSection(item.id)}
                    className={`shrink-0 lg:w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-[12px] text-[13px] font-bold transition cursor-pointer ${
                      active
                        ? 'bg-[#EEF0FF] text-[#3B2FD9]'
                        : 'text-[#4E5369] hover:bg-[#F7F7FA] hover:text-[#111322]'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </span>
                    {item.count !== undefined && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold tabular-nums ${
                          item.alert
                            ? 'bg-[#FF5A3D] text-white'
                            : active
                            ? 'bg-[#3B2FD9] text-white'
                            : 'bg-[#F1F2F7] text-[#4E5369]'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="hidden lg:block pt-5 mt-6 border-t border-[#E8EAF2] space-y-3">
            <div className="bg-[#E7F7EE] border border-[#C3ECD4] rounded-[14px] p-3.5">
              <div className="flex items-center gap-2 text-[12px] font-extrabold text-[#157F3E]">
                <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                <span>Bengaluru Ops Live</span>
              </div>
              <p className="text-[11px] text-[#157F3E]/85 mt-1">
                SafePay payments operational · Avg handover time 4.2 hrs
              </p>
            </div>

            <button
              type="button"
              onClick={onBackToApp}
              className="w-full h-10 rounded-[12px] border border-[#E8EAF2] text-[13px] font-bold text-[#4E5369] hover:text-[#3B2FD9] hover:border-[#3B2FD9] inline-flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <span>Open Marketplace UI</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </aside>

        {/* Main Operations Workspace */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-7 space-y-6">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-[22px] sm:text-[26px] font-extrabold text-[#111322] tracking-[-0.02em]">
                Marketplace Operations
              </h1>
              <p className="text-[13px] text-[#4E5369] mt-0.5">
                Bengaluru Metro · Live SafePay, trust moderation & dispute resolution
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="px-3.5 py-2 rounded-[12px] bg-white border border-[#E8EAF2] text-[12px] font-bold text-[#4E5369]">
                Last 7 days
              </span>
              <span className="px-3.5 py-2 rounded-[12px] bg-[#E7F7EE] border border-[#C3ECD4] text-[12px] font-bold text-[#157F3E] inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Payments healthy</span>
              </span>
            </div>
          </div>

          {/* Live Action Toast */}
          {toast && (
            <div className="bg-[#111322] text-white rounded-[14px] px-4 py-3 text-[13px] font-semibold flex items-center justify-between shadow-lg">
              <span>{toast}</span>
              <span className="text-[#4ADE80] text-[12px] font-bold">Saved</span>
            </div>
          )}

          {/* 4 KPI Tiles */}
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {kpis.map((k) => {
              const Icon = k.icon;
              return (
                <div
                  key={k.label}
                  className="bg-white rounded-[16px] border border-[#E8EAF2] p-5 shadow-card"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[12px] font-bold text-[#7C8199] uppercase tracking-wider">
                      {k.label}
                    </span>
                    <div
                      className={`w-9 h-9 rounded-[10px] flex items-center justify-center ${k.accent}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-[28px] font-extrabold text-[#111322] tabular-nums tracking-[-0.02em]">
                    {k.value}
                  </div>
                  <div className="text-[12px] font-semibold text-[#157F3E] mt-1">
                    {k.sub}
                  </div>
                </div>
              );
            })}
          </section>

          {/* Orders Table by Status */}
          {(navSection === 'overview' || navSection === 'orders' || navSection === 'payouts') && (
            <section className="bg-white rounded-[16px] border border-[#E8EAF2] shadow-card overflow-hidden">
              <div className="p-5 border-b border-[#E8EAF2] flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div>
                  <h2 className="text-[17px] font-extrabold text-[#111322]">
                    Orders by status
                  </h2>
                  <p className="text-[12px] text-[#7C8199]">
                    Real-time SafePay ledger across Bengaluru zones
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <div className="relative">
                    <Search className="w-4 h-4 text-[#7C8199] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      placeholder="Filter order, item, area..."
                      className="h-9 pl-9 pr-3 rounded-[10px] bg-[#F7F7FA] border border-[#E8EAF2] text-[13px] outline-none focus:bg-white focus:border-[#3B2FD9] w-full sm:w-[210px]"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    {ORDER_STATUSES.map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setStatusFilter(st)}
                        className={`shrink-0 px-3 py-1.5 rounded-full text-[12px] font-bold border transition cursor-pointer ${
                          statusFilter === st
                            ? 'bg-[#3B2FD9] text-white border-[#3B2FD9]'
                            : 'bg-[#F7F7FA] text-[#4E5369] border-[#E8EAF2] hover:border-[#3B2FD9]/40'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[760px]">
                  <thead>
                    <tr className="bg-[#F7F7FA] text-[11px] font-bold uppercase tracking-wider text-[#7C8199] border-b border-[#E8EAF2]">
                      <th className="py-3 px-5">Order ID</th>
                      <th className="py-3 px-4">Item</th>
                      <th className="py-3 px-4">Buyer</th>
                      <th className="py-3 px-4">Seller</th>
                      <th className="py-3 px-4 text-right">Amount</th>
                      <th className="py-3 px-4 text-right">Fee (5%)</th>
                      <th className="py-3 px-4">Payment status</th>
                      <th className="py-3 px-5 text-right">Updated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F2F7] text-[13px]">
                    {filteredOrders.map((ord) => (
                      <tr
                        key={ord.id}
                        className="hover:bg-[#F7F7FA]/75 transition"
                      >
                        <td className="py-3.5 px-5 font-bold text-[#3B2FD9] tabular-nums">
                          {ord.id}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-[#111322]">
                          {ord.item}
                        </td>
                        <td className="py-3.5 px-4 text-[#4E5369]">
                          {ord.buyer}
                        </td>
                        <td className="py-3.5 px-4 text-[#4E5369]">
                          {ord.seller}
                        </td>
                        <td className="py-3.5 px-4 text-right font-extrabold text-[#111322] tabular-nums">
                          {formatINR(ord.amount)}
                        </td>
                        <td className="py-3.5 px-4 text-right font-semibold text-[#157F3E] tabular-nums">
                          {formatINR(ord.commission)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusBadgeStyle(
                              ord.status
                            )}`}
                          >
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-right text-[#7C8199] tabular-nums">
                          {ord.updated}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Bottom 2-Column Operations Split: Flagged Listings Queue + Disputes */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Flagged Listings Queue (Hide / Approve) */}
            {(navSection === 'overview' || navSection === 'flagged') && (
              <section
                className={`${
                  navSection === 'flagged' ? 'xl:col-span-12' : 'xl:col-span-6'
                } bg-white rounded-[16px] border border-[#E8EAF2] shadow-card overflow-hidden`}
              >
                <div className="p-5 border-b border-[#E8EAF2] flex items-center justify-between">
                  <div>
                    <h2 className="text-[16px] font-extrabold text-[#111322] flex items-center gap-2">
                      <Flag className="w-4 h-4 text-[#FF5A3D]" />
                      <span>Flagged listings queue</span>
                    </h2>
                    <p className="text-[12px] text-[#7C8199]">
                      Auto-caught by AI pricing & safety rules
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#FFF1EE] text-[#FF5A3D] text-[12px] font-extrabold tabular-nums">
                    {pendingFlagsCount} pending
                  </span>
                </div>

                <div className="divide-y divide-[#F1F2F7]">
                  {flagged.map((item) => (
                    <div key={item.id} className="p-4 sm:p-5 space-y-3">
                      <div className="flex items-start gap-3.5">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-14 h-14 rounded-[12px] object-cover border border-[#E8EAF2] shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-bold text-[#7C8199] tabular-nums">
                              {item.id} · {item.flaggedAt}
                            </span>
                            <span className="text-[14px] font-extrabold text-[#111322] tabular-nums">
                              {formatINR(item.price)}
                            </span>
                          </div>
                          <div className="text-[14px] font-extrabold text-[#111322] mt-0.5">
                            {item.title}
                          </div>
                          <div className="text-[12px] text-[#4E5369]">
                            {item.seller}
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#FFF8EB] border border-[#FDE68A] rounded-[10px] px-3 py-2 text-[12px] text-[#92400E] flex items-center justify-between gap-2">
                        <span className="font-semibold">{item.reason}</span>
                        <span className="shrink-0 text-[11px] font-bold bg-white px-2 py-0.5 rounded-full border border-[#FDE68A]">
                          {item.aiConfidence}
                        </span>
                      </div>

                      {item.status === 'pending' ? (
                        <div className="grid grid-cols-2 gap-2.5">
                          <button
                            type="button"
                            onClick={() => handleFlagAction(item.id, 'hidden')}
                            className="h-10 rounded-[10px] bg-[#FEF2F2] hover:bg-[#DC2626] text-[#DC2626] hover:text-white border border-[#FECACA] text-[13px] font-bold inline-flex items-center justify-center gap-1.5 transition cursor-pointer"
                          >
                            <EyeOff className="w-4 h-4" />
                            <span>Hide</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleFlagAction(item.id, 'approved')}
                            className="h-10 rounded-[10px] bg-[#E7F7EE] hover:bg-[#157F3E] text-[#157F3E] hover:text-white border border-[#C3ECD4] text-[13px] font-bold inline-flex items-center justify-center gap-1.5 transition cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Approve</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between bg-[#F7F7FA] rounded-[10px] px-3 py-2 text-[12px]">
                          <span
                            className={`font-bold ${
                              item.status === 'approved'
                                ? 'text-[#157F3E]'
                                : 'text-[#DC2626]'
                            }`}
                          >
                            {item.status === 'approved'
                              ? '✓ Approved & visible'
                              : '✕ Hidden from storefront'}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleFlagAction(item.id, 'pending')}
                            className="text-[#3B2FD9] font-bold inline-flex items-center gap-1 hover:underline cursor-pointer"
                          >
                            <RotateCcw className="w-3 h-3" />
                            Undo
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Disputes Queue (Release / Refund) */}
            {(navSection === 'overview' || navSection === 'disputes') && (
              <section
                className={`${
                  navSection === 'disputes' ? 'xl:col-span-12' : 'xl:col-span-6'
                } bg-white rounded-[16px] border border-[#E8EAF2] shadow-card overflow-hidden`}
              >
                <div className="p-5 border-b border-[#E8EAF2] flex items-center justify-between">
                  <div>
                    <h2 className="text-[16px] font-extrabold text-[#111322] flex items-center gap-2">
                      <Scale className="w-4 h-4 text-[#3B2FD9]" />
                      <span>SafePay disputes</span>
                    </h2>
                    <p className="text-[12px] text-[#7C8199]">
                      Payment on hold, awaiting Release or Refund decision
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#FEE2E2] text-[#DC2626] text-[12px] font-extrabold tabular-nums">
                    {openDisputesCount} open
                  </span>
                </div>

                <div className="divide-y divide-[#F1F2F7]">
                  {disputes.map((d) => (
                    <div key={d.id} className="p-4 sm:p-5 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 text-[11px] font-bold text-[#7C8199] tabular-nums">
                            <span className="text-[#3B2FD9]">{d.id}</span>
                            <span>·</span>
                            <span>{d.orderId}</span>
                            <span>·</span>
                            <span>{d.openedAt}</span>
                          </div>
                          <div className="text-[15px] font-extrabold text-[#111322] mt-0.5">
                            {d.item}
                          </div>
                          <div className="text-[12px] text-[#4E5369] mt-0.5">
                            Buyer: <strong>{d.buyer}</strong> → Seller:{' '}
                            <strong>{d.seller}</strong>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-[17px] font-extrabold text-[#111322] tabular-nums">
                            {formatINR(d.amount)}
                          </div>
                          <span className="text-[10px] font-bold text-[#B45309] bg-[#FEF3C7] px-2 py-0.5 rounded-full">
                            Payment on hold
                          </span>
                        </div>
                      </div>

                      <div className="bg-[#F7F7FA] border border-[#E8EAF2] rounded-[12px] p-3 text-[12px] text-[#4E5369] space-y-1">
                        <div className="font-semibold text-[#111322]">
                          “{d.issue}”
                        </div>
                        <div className="text-[11px] text-[#3B2FD9] font-semibold">
                          Evidence: {d.evidence}
                        </div>
                      </div>

                      {d.status === 'open' ? (
                        <div className="grid grid-cols-2 gap-2.5">
                          <button
                            type="button"
                            onClick={() => handleDisputeAction(d.id, 'released')}
                            className="h-10 rounded-[10px] bg-[#157F3E] hover:bg-[#166534] text-white text-[13px] font-bold inline-flex items-center justify-center gap-1.5 transition cursor-pointer"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            <span>Release to seller</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDisputeAction(d.id, 'refunded')}
                            className="h-10 rounded-[10px] bg-[#FF5A3D] hover:bg-[#EA472A] text-white text-[13px] font-bold inline-flex items-center justify-center gap-1.5 transition cursor-pointer"
                          >
                            <AlertTriangle className="w-4 h-4" />
                            <span>Refund buyer</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between bg-[#E7F7EE] border border-[#C3ECD4] rounded-[10px] px-3 py-2 text-[12px]">
                          <span className="font-bold text-[#157F3E]">
                            {d.status === 'released'
                              ? `✓ Released ${formatINR(d.amount)} to seller`
                              : `✓ Refunded ${formatINR(d.amount)} to buyer`}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDisputeAction(d.id, 'open')}
                            className="text-[#3B2FD9] font-bold inline-flex items-center gap-1 hover:underline cursor-pointer"
                          >
                            <RotateCcw className="w-3 h-3" />
                            Undo
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
