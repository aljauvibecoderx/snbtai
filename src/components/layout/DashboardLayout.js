import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FileText, BookOpen, History, ArrowLeft, Trophy, Camera, BarChart3 } from 'lucide-react';

export const DashboardLayout = ({ user, onBack }) => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Dashboard - SNBT AI</title>
        <meta name="description" content="Kelola soal SNBT dan pantau progres belajar Anda" />
        <link rel="canonical" href={`${window.location.origin}/dashboard`} />
      </Helmet>

      <div className="min-h-screen bg-[#F3F4F8] relative overflow-x-hidden">
        <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-500 rounded-full blur-[120px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto p-4 sm:p-6 relative z-10">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div className="flex items-center gap-3 sm:gap-4">
              <button onClick={() => { onBack(); navigate('/'); }} className="p-2 hover:bg-white rounded-xl transition-all shadow-sm hover:shadow-md">
                <ArrowLeft size={18} className="sm:w-5 sm:h-5 text-slate-600" />
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">Kelola soal dan pantau progresmu</p>
              </div>
            </div>
          </div>

          <nav className="flex gap-2 mb-6 overflow-x-auto bg-white rounded-2xl p-2 shadow-lg border border-slate-200 scrollbar-hide">
            <NavLink to="/dashboard/ai-lens" className={({ isActive }) => `px-3 sm:px-5 py-2 sm:py-3 rounded-xl text-[11px] sm:text-sm font-medium transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap flex-shrink-0 ${isActive ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Camera size={14} className="sm:w-4 sm:h-4" /><span>AI Lens</span>
            </NavLink>
            <NavLink to="/dashboard/overview" className={({ isActive }) => `px-3 sm:px-5 py-2 sm:py-3 rounded-xl text-[11px] sm:text-sm font-medium transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap flex-shrink-0 ${isActive ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}>
              <BarChart3 size={14} className="sm:w-4 sm:h-4" /><span>Overview</span>
            </NavLink>
            <NavLink to="/dashboard/official-tryouts" className={({ isActive }) => `px-3 sm:px-5 py-2 sm:py-3 rounded-xl text-[11px] sm:text-sm font-medium transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap flex-shrink-0 ${isActive ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Trophy size={14} className="sm:w-4 sm:h-4" /><span>Tryout Resmi</span>
            </NavLink>
            <NavLink to="/dashboard/my-questions" className={({ isActive }) => `px-3 sm:px-5 py-2 sm:py-3 rounded-xl text-[11px] sm:text-sm font-medium transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap flex-shrink-0 ${isActive ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}>
              <FileText size={14} className="sm:w-4 sm:h-4" /><span>Soal Saya</span>
            </NavLink>
            <NavLink to="/dashboard/question-bank" className={({ isActive }) => `px-3 sm:px-5 py-2 sm:py-3 rounded-xl text-[11px] sm:text-sm font-medium transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap flex-shrink-0 ${isActive ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}>
              <BookOpen size={14} className="sm:w-4 sm:h-4" /><span>Bank Soal</span>
            </NavLink>
            <NavLink to="/dashboard/history" className={({ isActive }) => `px-3 sm:px-5 py-2 sm:py-3 rounded-xl text-[11px] sm:text-sm font-medium transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap flex-shrink-0 ${isActive ? 'bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}>
              <History size={14} className="sm:w-4 sm:h-4" /><span>Riwayat</span>
            </NavLink>
          </nav>

          <Outlet />
        </div>
      </div>
    </>
  );
};
