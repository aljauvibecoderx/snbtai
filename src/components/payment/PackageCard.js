// ============================================================
// PackageCard.js — Coin Package Pricing Card
// ============================================================

import React from 'react';
import { Zap, Star, Crown, CheckCircle2, Tag } from 'lucide-react';
import { formatPrice } from '../../services/payment/mockPaymentService';

const PACKAGE_ICONS = {
  starter: Zap,
  pro: Star,
  ultimate: Crown,
};

const PACKAGE_COLORS = {
  starter: {
    gradient: 'from-slate-50 to-slate-100',
    border: 'border-slate-200',
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-600',
    badgeBg: 'bg-slate-600',
    btn: 'bg-violet-600 hover:bg-violet-700 shadow-violet-200',
    discountBg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    ring: 'ring-slate-300',
  },
  pro: {
    gradient: 'from-violet-50 to-indigo-50',
    border: 'border-violet-200',
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
    badgeBg: 'bg-gradient-to-r from-violet-600 to-indigo-600',
    btn: 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 shadow-violet-200',
    discountBg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    ring: 'ring-violet-400',
  },
  ultimate: {
    gradient: 'from-amber-50 to-orange-50',
    border: 'border-amber-200',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    badgeBg: 'bg-gradient-to-r from-amber-500 to-orange-500',
    btn: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 shadow-amber-200',
    discountBg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    ring: 'ring-amber-400',
  },
};

/**
 * @param {object} pkg — Paket dari COIN_PACKAGES
 * @param {function} onSelect — Callback saat "Beli" diklik
 */
export const PackageCard = ({ pkg, onSelect }) => {
  const style = PACKAGE_COLORS[pkg.id] ?? PACKAGE_COLORS.starter;
  const Icon = PACKAGE_ICONS[pkg.id] ?? Zap;

  return (
    <div
      id={`package-card-${pkg.id}`}
      className={`relative flex flex-col bg-gradient-to-br ${style.gradient} border ${style.border} rounded-2xl p-5 
        transition-all duration-300 ease-out 
        hover:scale-[1.02] hover:shadow-lg 
        ${pkg.highlight ? `ring-2 ${style.ring} shadow-lg` : 'shadow-sm'}
        group cursor-pointer`}
      onClick={() => onSelect(pkg)}
    >
      {/* Popular Badge (top absolute) */}
      {pkg.badge && (
        <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white ${style.badgeBg} shadow-md whitespace-nowrap`}>
          {pkg.badge}
        </div>
      )}

      {/* Icon + Name */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-11 h-11 rounded-xl ${style.iconBg} flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110`}>
          <Icon className={`w-5 h-5 ${style.iconColor}`} />
        </div>
        <div>
          <div className="text-sm font-bold text-gray-900">{pkg.name}</div>
          <div className="text-xs text-gray-500">{pkg.description}</div>
        </div>
      </div>

      {/* Coin Amount */}
      <div className="mb-4">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-black text-gray-900">{pkg.coins}</span>
          <span className="text-base font-semibold text-gray-500">Koin</span>
        </div>
        <div className="flex items-center gap-1.5 mt-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
          <span className="text-xs text-emerald-700 font-medium">+{pkg.generateQuota} Generate Soal</span>
        </div>
      </div>

      {/* Price section */}
      <div className="mb-5 space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400 line-through">{formatPrice(pkg.originalPrice)}</span>
          <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border ${style.discountBg}`}>
            <Tag size={10} />
            {pkg.discount}% OFF
          </span>
        </div>
        <div className="text-2xl font-black text-gray-900">{formatPrice(pkg.price)}</div>
      </div>

      {/* CTA Button */}
      <button
        id={`package-buy-btn-${pkg.id}`}
        onClick={(e) => { e.stopPropagation(); onSelect(pkg); }}
        className={`w-full py-3 rounded-xl text-sm font-bold text-white transition-all duration-300 shadow-md active:scale-95 ${style.btn}`}
        style={{ minHeight: '48px' }}
      >
        Beli Sekarang
      </button>
    </div>
  );
};

export default PackageCard;
