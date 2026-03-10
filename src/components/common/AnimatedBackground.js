import React from 'react';

export const AnimatedBackground = () => (
  <>
    {/* Background floating orbs - same as LandingPage */}
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="lp-orb absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-400/15 rounded-full blur-[120px]" />
      <div className="lp-orb-2 absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-400/15 rounded-full blur-[120px]" />
      <div className="lp-orb-3 absolute top-[40%] right-[10%] w-[25%] h-[25%] bg-purple-300/10 rounded-full blur-[100px]" />
    </div>
    
    {/* Animation styles */}
    <style>{`
      @keyframes lpFloatOrb {
        0%, 100% { transform: translate(0,0) scale(1); }
        50% { transform: translate(12px,-16px) scale(1.06); }
      }
      .lp-orb { animation: lpFloatOrb 9s ease-in-out infinite; }
      .lp-orb-2 { animation: lpFloatOrb 12s ease-in-out infinite reverse; }
      .lp-orb-3 { animation: lpFloatOrb 7s ease-in-out infinite; animation-delay: 3s; }
    `}</style>
  </>
);
