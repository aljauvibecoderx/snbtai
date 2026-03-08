# 🎨 SNBT AI - Design System Consistency Guide

## Ringkasan Eksekutif
Panduan ini memastikan konsistensi visual dan UX di seluruh aplikasi SNBT AI (Landing Page, App Page, Dashboard, Community) agar terasa seperti satu kesatuan produk yang kohesif.

---

## 1. BACKGROUND & LAYOUT GLOBAL

### ✅ Background Konsisten
Semua halaman menggunakan:
```css
/* Base Background */
bg-[#F3F4F8]  /* Light slate background */

/* Blur Effects (Fixed) */
fixed inset-0 z-0 pointer-events-none opacity-20
- Top-left: bg-violet-400 (40% width, 40% height)
- Bottom-right: bg-indigo-400 (30% width, 30% height)
blur-[120px]

/* Transition Duration */
transition-all duration-500  /* Smooth animations */
```

### ✅ Container & Spacing
```css
/* Max Width */
max-w-7xl mx-auto  /* Consistent container width */

/* Padding */
px-6 py-6  /* Horizontal & vertical padding */

/* Relative Z-Index */
relative z-10  /* Content above background */
```

---

## 2. NAVBAR GLOBAL (UNIFIED)

### ✅ Navbar Styling
```css
/* Fixed Navbar */
fixed top-0 w-full z-50
transition-all duration-500

/* Glassmorphism Effect */
bg-white/70 backdrop-blur-xl
border-b border-slate-100
shadow-sm

/* Logo */
text-2xl font-extrabold tracking-tight
bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600
bg-clip-text text-transparent
```

### ✅ Navbar Buttons (Konsisten)
```css
/* Primary Button */
px-4 py-2 bg-violet-600 text-white rounded-lg
hover:bg-violet-700 transition-all duration-500
font-medium text-sm

/* Secondary Button */
px-4 py-2 bg-white border border-slate-200 text-slate-700
rounded-lg hover:border-violet-300 hover:bg-slate-50
transition-all duration-500 font-medium text-sm

/* Icon Button */
p-2 text-slate-400 hover:text-slate-600
transition-colors duration-500
```

### ✅ Navbar di Setiap Halaman
- **Landing Page**: Transparent → White on scroll
- **HomeViewRevamp**: Fixed navbar dengan stats badges
- **Dashboard**: Sticky navbar dengan tab navigation
- **Community**: Sticky navbar dengan back button

---

## 3. KARTU STATISTIK (STAT CARDS)

### ✅ Stat Card Template
```css
/* Container */
bg-white rounded-2xl p-6 shadow-sm border border-slate-100
hover:shadow-md transition-all duration-500

/* Icon Container */
w-12 h-12 rounded-xl bg-[COLOR]-100 flex items-center justify-center
text-[COLOR]-600

/* Value */
text-3xl font-extrabold tracking-tight text-slate-900

/* Label */
text-sm text-slate-600 font-medium

/* Progress Bar */
h-1 bg-slate-100 rounded-full overflow-hidden
h-full bg-[COLOR]-500 rounded-full transition-all duration-500
```

### ✅ Color Scheme untuk Stat Cards
- **Indigo**: Total Soal, Paket Soal
- **Teal**: Percobaan, Target Skor
- **Amber**: Rata-rata Skor
- **Rose**: Skor Terbaik

---

## 4. JUDUL HALAMAN (PAGE TITLES)

### ✅ Title Styling
```css
/* Main Title */
text-3xl sm:text-4xl font-black tracking-tighter text-slate-900

/* Subtitle */
text-lg text-slate-500 leading-[1.6] font-medium

/* Container */
text-center space-y-4 max-w-3xl mx-auto
```

### ✅ Judul di Setiap Halaman
- **Landing Page**: "Ubah Cerita Apapun Menjadi Soal SNBT Realistis"
- **App Page**: "Buat Soal SNBT"
- **Dashboard**: "Dashboard" + Tab Navigation
- **Community**: "Community"

---

## 5. MICRO-INTERACTIONS

### ✅ Hover Effects
```css
/* Card Hover */
hover:shadow-md hover:shadow-lg transition-all duration-500

/* Button Hover */
hover:scale-105 hover:shadow-2xl transition-all duration-500

/* Icon Hover */
hover:text-[COLOR]-600 transition-colors duration-500

/* Border Hover */
hover:border-[COLOR]-300 transition-all duration-500
```

### ✅ Focus Effects
```css
/* Input Focus */
focus:outline-none focus:ring-2 focus:ring-[COLOR]-500
focus:border-[COLOR]-300 transition-all duration-500

/* Button Focus */
active:scale-[0.98] transition-all duration-500
```

### ✅ Loading States
```css
/* Spinner */
w-12 h-12 border-4 border-slate-200 border-t-[COLOR]-600
rounded-full animate-spin

/* Disabled Button */
disabled:opacity-50 disabled:cursor-not-allowed
```

---

## 6. BUTTON STYLES (UNIFIED)

### ✅ Primary Button (CTA)
```css
px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600
text-white rounded-full hover:shadow-2xl hover:scale-105
transition-all duration-500 font-bold
flex items-center justify-center gap-2
```

### ✅ Secondary Button
```css
px-8 py-4 bg-white border-2 border-slate-200 text-slate-700
rounded-full hover:border-violet-300 hover:bg-slate-50
transition-all duration-500 font-semibold
```

### ✅ Tertiary Button (Small)
```css
px-3 py-2 text-slate-600 hover:text-slate-900
hover:bg-slate-50 rounded-lg transition-all duration-500
text-sm font-medium
```

---

## 7. FORM INPUTS

### ✅ Input Styling
```css
/* Text Input */
w-full px-4 py-3 rounded-2xl border-2 border-[COLOR]-100
text-slate-900 placeholder:text-slate-400
focus:outline-none focus:ring-2 focus:ring-[COLOR]-500
focus:border-[COLOR]-300 resize-none text-sm
transition-all duration-500 bg-white hover:border-[COLOR]-200

/* Select Input */
w-full px-4 py-3 rounded-xl border border-slate-200
focus:outline-none focus:ring-2 focus:ring-[COLOR]-500
bg-white appearance-none cursor-pointer text-sm
```

---

## 8. MODAL & OVERLAY

### ✅ Modal Styling
```css
/* Overlay */
fixed inset-0 bg-black/40 backdrop-blur-sm
flex items-center justify-center z-50

/* Modal Container */
bg-white rounded-2xl p-8 max-w-sm w-full mx-4
shadow-2xl border border-slate-200
transition-all duration-500
```

---

## 9. GRADIENT COLORS (KONSISTEN)

### ✅ Primary Gradients
```css
/* Violet-Indigo (Main) */
from-violet-600 to-indigo-600
from-violet-700 to-indigo-700 (hover)

/* Gradient Text */
bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600
bg-clip-text text-transparent
```

### ✅ Feature Gradients
- **AI Generator**: violet-500 to purple-500
- **IRT Scoring**: blue-500 to cyan-500
- **Vocab Builder**: pink-500 to rose-500
- **Tryout**: amber-500 to orange-500
- **Bank Soal**: emerald-500 to teal-500
- **PTNPedia**: indigo-500 to blue-500

---

## 10. TYPOGRAPHY (UNIFIED)

### ✅ Font Sizes & Weights
```css
/* Hero Title */
text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter

/* Section Title */
text-4xl sm:text-5xl font-black tracking-tighter

/* Card Title */
text-2xl font-bold text-slate-900 tracking-tight

/* Body Text */
text-sm text-slate-600 leading-relaxed

/* Label */
text-xs font-semibold text-slate-600 uppercase tracking-wide
```

---

## 11. SPACING KONSISTEN

### ✅ Section Spacing
```css
/* Section Padding */
py-32 px-6  /* Vertical: 128px, Horizontal: 24px */

/* Card Padding */
p-6 sm:p-8  /* 24px - 32px */

/* Gap Between Items */
gap-6 gap-8  /* 24px - 32px */

/* Margin Top */
mt-16 mt-20  /* 64px - 80px */
```

---

## 12. SHADOW & BORDER

### ✅ Shadow Levels
```css
/* Subtle */
shadow-sm  /* 0 1px 2px rgba(0,0,0,0.05) */

/* Medium */
shadow-md  /* 0 4px 6px rgba(0,0,0,0.1) */

/* Large */
shadow-lg  /* 0 10px 15px rgba(0,0,0,0.1) */

/* Extra Large */
shadow-xl shadow-2xl  /* 0 20px 25px rgba(0,0,0,0.15) */
```

### ✅ Border Styling
```css
/* Subtle Border */
border border-slate-100

/* Medium Border */
border-2 border-slate-200

/* Colored Border */
border-2 border-[COLOR]-100 hover:border-[COLOR]-200
transition-all duration-500
```

---

## 13. RESPONSIVE DESIGN

### ✅ Breakpoints
```css
/* Mobile First */
sm:  /* 640px */
md:  /* 768px */
lg:  /* 1024px */
xl:  /* 1280px */

/* Example */
text-sm sm:text-base md:text-lg
px-4 sm:px-6 md:px-8
grid-cols-1 md:grid-cols-2 lg:grid-cols-3
```

---

## 14. IMPLEMENTASI CHECKLIST

### ✅ Landing Page
- [x] Background blur effects (opacity-20)
- [x] Navbar glassmorphism
- [x] Stat cards dengan progress bar
- [x] Gradient buttons
- [x] Smooth transitions (duration-500)
- [x] Responsive grid layouts

### ✅ HomeViewRevamp (App Page)
- [x] Background blur effects (opacity-20)
- [x] Fixed navbar dengan stats badges
- [x] Gradient form inputs
- [x] Gradient buttons (h-14)
- [x] Smooth transitions (duration-500)
- [x] Subtest selection buttons

### ✅ Dashboard
- [x] Background blur effects (opacity-40 → opacity-20)
- [x] Sticky navbar dengan tab navigation
- [x] Stat cards dengan gradient backgrounds
- [x] Colored tab buttons
- [x] Smooth transitions (duration-500)
- [x] Grid layouts untuk soal

### ✅ Community
- [x] Background blur effects (opacity-20)
- [x] Sticky navbar dengan back button
- [x] Post cards dengan hover effects
- [x] Smooth transitions (duration-500)
- [x] Fixed input area di bottom

---

## 15. KODE TEMPLATE REUSABLE

### ✅ Stat Card Component
```jsx
<div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-500">
  <div className="flex items-center gap-3 mb-2 text-[COLOR]-600">
    <IconComponent className="w-5 h-5" />
    <div className="text-3xl font-extrabold tracking-tight">{value}</div>
  </div>
  <div className="text-sm text-slate-600 font-medium">{label}</div>
</div>
```

### ✅ Primary Button Component
```jsx
<button className="px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-500 font-bold flex items-center justify-center gap-2 group">
  {text}
  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
</button>
```

### ✅ Input Component
```jsx
<input 
  type="text"
  className="w-full px-4 py-3 rounded-2xl border-2 border-violet-100 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-300 resize-none text-sm transition-all duration-500 bg-white hover:border-violet-200"
  placeholder="Placeholder text"
/>
```

---

## 16. CATATAN PENTING

### ✅ Konsistensi Warna
- **Primary**: Violet-600 to Indigo-600
- **Secondary**: Slate-100 to Slate-200
- **Accent**: Sesuai dengan feature (lihat section 9)

### ✅ Konsistensi Animasi
- **Transition Duration**: 500ms (smooth)
- **Hover Scale**: 1.05 (subtle)
- **Active Scale**: 0.98 (press effect)

### ✅ Konsistensi Spacing
- **Section**: py-32 px-6
- **Card**: p-6 sm:p-8
- **Gap**: gap-6 gap-8

### ✅ Konsistensi Border Radius
- **Large**: rounded-3xl (48px)
- **Medium**: rounded-2xl (16px)
- **Small**: rounded-xl (12px)
- **Tiny**: rounded-lg (8px)

---

## 17. NEXT STEPS

1. **Apply to All Pages**: Gunakan template di section 15 untuk semua halaman
2. **Test Responsiveness**: Pastikan semua breakpoints bekerja dengan baik
3. **Browser Testing**: Test di Chrome, Firefox, Safari, Edge
4. **Performance**: Monitor animation performance (60fps)
5. **Accessibility**: Pastikan contrast ratio memenuhi WCAG AA

---

## 📞 Support
Untuk pertanyaan atau klarifikasi, lihat dokumentasi terkait:
- `SECURITY.md` - Security best practices
- `DEPLOYMENT_CHECKLIST.md` - Pre-deployment checklist
- `README.md` - Project overview

---

**Last Updated**: 2025-01-20  
**Version**: 1.0  
**Status**: ✅ Active
