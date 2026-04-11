import React from 'react';
import {
  LayoutDashboard,
  Camera,
  Trophy,
  Home,
  History,
  BookOpen,
  Swords,
  Building2,
  GraduationCap,
  GitBranch,
  ChevronRight
} from 'lucide-react';

// ─── PTNPedia Mobile App Screen ─────────────────────────────────────────────
const PTNPediaMobileScreen = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8">
      {/* Phone Frame */}
      <div className="relative w-full max-w-[390px] bg-white rounded-[40px] shadow-2xl overflow-hidden border-8 border-slate-900">
        {/* Status Bar */}
        <div className="bg-white px-6 pt-3 pb-2 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-900">9:41</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-slate-900 rounded-sm"></div>
            <div className="w-4 h-4 bg-slate-900 rounded-sm"></div>
            <div className="w-6 h-4 bg-slate-900 rounded-sm"></div>
          </div>
        </div>

        {/* Top Navigation */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-slate-100">
          <button className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-slate-50 transition-colors">
            <LayoutDashboard className="w-5 h-5 text-violet-600" strokeWidth={2.5} />
            <span className="text-[10px] font-medium text-slate-600">Overview</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-slate-50 transition-colors">
            <Camera className="w-5 h-5 text-slate-400" strokeWidth={2} />
            <span className="text-[10px] font-medium text-slate-400">AI Lens</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-slate-50 transition-colors">
            <Trophy className="w-5 h-5 text-slate-400" strokeWidth={2} />
            <span className="text-[10px] font-medium text-slate-400">Trophy</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-white px-5 py-6">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h1 className="text-xl font-bold text-slate-900 mb-4">
              Selamat Datang di PTNPedia
            </h1>
            <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
              <p>
                Jelajahi informasi lengkap tentang Perguruan Tinggi Negeri di Indonesia. 
                Temukan kampus impianmu dengan mudah.
              </p>
              <p>
                Dari daya tampung, passing grade, hingga akreditasi program studi—
                semua ada di sini.
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {/* Blue Card - 50+ PTN */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 shadow-lg shadow-blue-200 transform hover:scale-[1.02] transition-transform">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                <Building2 className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <p className="text-2xl font-bold text-white">50+</p>
              <p className="text-xs text-blue-100 font-medium">PTN</p>
            </div>

            {/* Purple Card - 1000+ Prodi */}
            <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-4 shadow-lg shadow-violet-200 transform hover:scale-[1.02] transition-transform">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                <GraduationCap className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <p className="text-2xl font-bold text-white">1000+</p>
              <p className="text-xs text-violet-100 font-medium">Prodi</p>
            </div>

            {/* Pink Card - 2 Jalur */}
            <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl p-4 shadow-lg shadow-pink-200 transform hover:scale-[1.02] transition-transform">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                <GitBranch className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <p className="text-2xl font-bold text-white">2</p>
              <p className="text-xs text-pink-100 font-medium">Jalur</p>
            </div>
          </div>

          {/* CTA Button */}
          <button className="w-full bg-violet-600 text-white rounded-xl py-3.5 px-4 flex items-center justify-between hover:bg-violet-700 transition-colors">
            <span className="text-sm font-semibold">Mulai Jelajahi</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom Navigation */}
        <div className="bg-white border-t border-slate-100 px-2 py-3">
          <div className="flex items-center justify-around">
            <button className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <Home className="w-5 h-5 text-slate-400" strokeWidth={2} />
              <span className="text-[10px] font-medium text-slate-400">Beranda</span>
            </button>
            <button className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <History className="w-5 h-5 text-slate-400" strokeWidth={2} />
              <span className="text-[10px] font-medium text-slate-400">Riwayat</span>
            </button>
            
            {/* Central Book Icon - Highlighted */}
            <button className="flex flex-col items-center gap-1 p-2 -mt-6">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-200">
                <BookOpen className="w-7 h-7 text-white" strokeWidth={2} />
              </div>
            </button>
            
            <button className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <Swords className="w-5 h-5 text-slate-400" strokeWidth={2} />
              <span className="text-[10px] font-medium text-slate-400">Battle</span>
            </button>
            <button className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <Building2 className="w-5 h-5 text-slate-400" strokeWidth={2} />
              <span className="text-[10px] font-medium text-slate-400">PTN</span>
            </button>
          </div>
        </div>

        {/* Home Indicator */}
        <div className="bg-white pb-2 flex justify-center">
          <div className="w-32 h-1 bg-slate-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default PTNPediaMobileScreen;
