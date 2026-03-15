import React from 'react';
import { AlertCircle, Home, RefreshCw, Sparkles } from 'lucide-react';

const Logo = ({ size = 40 }) => (
  <div className="flex items-center gap-3">
    <div className="relative">
      <div 
        className="rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-sm overflow-hidden"
        style={{ width: size, height: size }}
      >
        <Sparkles className="text-white" size={size * 0.6} strokeWidth={2} />
      </div>
    </div>
    <div className="flex flex-col">
      <span className="font-bold text-lg leading-none text-slate-900">SNBT AI</span>
      <span className="text-xs leading-none text-slate-500">AI-Powered Learning</span>
    </div>
  </div>
);

export const NotFoundPage = () => (
  <div className="min-h-screen bg-[#F3F4F8] flex flex-col relative overflow-hidden">
    <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-500 rounded-full blur-[120px]"></div>
    </div>
    
    <header className="p-6 relative z-10">
      <Logo size={32} />
    </header>

    <div className="flex-1 flex items-center justify-center p-6 relative z-10">
      <div className="max-w-md w-full text-center space-y-6 animate-fade-in-up">
        <div className="relative">
          <div className="text-[150px] font-black text-indigo-600 leading-none opacity-20">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center">
              <AlertCircle size={48} className="text-rose-600" />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-slate-900">Halaman Tidak Ditemukan</h1>
          <p className="text-slate-600 leading-relaxed">
            Maaf, halaman yang kamu cari tidak ada atau telah dipindahkan.
          </p>
        </div>

        <div className="flex gap-3 justify-center pt-4">
          <button 
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg"
          >
            <Home size={18} />
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>

    <style>{`
      @keyframes fade-in-up {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
    `}</style>
  </div>
);

export const ErrorBoundaryPage = ({ error, resetError }) => (
  <div className="min-h-screen bg-[#F3F4F8] flex flex-col relative overflow-hidden">
    <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-600 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-red-500 rounded-full blur-[120px]"></div>
    </div>
    
    <header className="p-6 relative z-10">
      <Logo size={32} />
    </header>

    <div className="flex-1 flex items-center justify-center p-6 relative z-10">
      <div className="max-w-lg w-full space-y-6 animate-fade-in-up">
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200">
          <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={40} className="text-rose-600" />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 text-center mb-3">
            Terjadi Kesalahan
          </h1>
          
          <p className="text-slate-600 text-center mb-6 leading-relaxed">
            Maaf, aplikasi mengalami error yang tidak terduga. Silakan coba lagi atau kembali ke beranda.
          </p>

          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 mb-6">
              <p className="text-xs font-mono text-rose-700 break-all">
                {error.toString()}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button 
              onClick={resetError}
              className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-300 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw size={18} />
              Coba Lagi
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <Home size={18} />
              Beranda
            </button>
          </div>
        </div>
      </div>
    </div>

    <style>{`
      @keyframes fade-in-up {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
    `}</style>
  </div>
);

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorBoundaryPage 
          error={this.state.error} 
          resetError={() => this.setState({ hasError: false, error: null })}
        />
      );
    }

    return this.props.children;
  }
}
