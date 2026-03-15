import React, { useState, useEffect } from 'react';
import { Home, Globe, Camera, Zap } from 'lucide-react';

const MorphingTabBar = ({ activeTab, onTabChange }) => {
  const [morphPosition, setMorphPosition] = useState(0);
  const [ripples, setRipples] = useState([]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home, gradient: 'from-purple-600 via-violet-600 to-purple-700' },
    { id: 'ptnpedia', label: 'PTNPedia', icon: Globe, gradient: 'from-blue-600 via-indigo-600 to-blue-700' },
    { id: 'ailens', label: 'AI Lens', icon: Camera, gradient: 'from-emerald-600 via-teal-600 to-emerald-700' }
  ];

  useEffect(() => {
    const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
    setMorphPosition(activeIndex);
  }, [activeTab]);

  const createRipple = (e, tabId) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    const newRipple = {
      id: Date.now(),
      x,
      y,
      size,
      tabId
    };
    
    setRipples(prev => [...prev, newRipple]);
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Main Container */}
      <div className="relative bg-gradient-to-t from-gray-900 via-gray-800 to-transparent">
        {/* Morphing Background */}
        <div className="absolute top-0 left-0 right-0 h-20">
          <div
            className={`
              absolute top-3 h-14 w-28 rounded-2xl
              bg-gradient-to-r ${tabs[morphPosition]?.gradient}
              shadow-2xl transition-all duration-500 ease-out
              opacity-90
            `}
            style={{
              left: `calc(${morphPosition * 33.333}% + ${morphPosition * 8}px + 20px)`,
              transform: 'translateX(-50%) translateY(-50%)'
            }}
          />

          {/* Glow Effect */}
          <div
            className={`
              absolute top-3 h-12 w-24 rounded-xl
              bg-gradient-to-r ${tabs[morphPosition]?.gradient}
              blur-xl opacity-40 transition-all duration-500
            `}
            style={{
              left: `calc(${morphPosition * 33.333}% + ${morphPosition * 8}px + 20px)`,
              transform: 'translateX(-50%) translateY(-50%)'
            }}
          />
        </div>

        {/* Navigation Items */}
        <div className="relative flex items-center justify-around px-6 pt-6 pb-10">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={(e) => {
                  createRipple(e, tab.id);
                  onTabChange(tab.id);
                }}
                className={`
                  relative flex flex-col items-center justify-center
                  w-24 h-16 rounded-2xl overflow-visible
                  transition-all duration-300 ease-out
                  ${isActive ? 'transform -translate-y-1 scale-105' : 'hover:scale-105'}
                  group
                `}
              >
                {/* Ripple Effects */}
                {ripples
                  .filter(ripple => ripple.tabId === tab.id)
                  .map(ripple => (
                    <div
                      key={ripple.id}
                      className="absolute rounded-full bg-white/30 animate-ping"
                      style={{
                        left: ripple.x,
                        top: ripple.y,
                        width: ripple.size,
                        height: ripple.size,
                        animationDuration: '0.6s'
                      }}
                    />
                  ))}

                {/* Icon */}
                <div className={`
                  relative z-10 mb-1.5 transition-all duration-300
                  ${isActive ? 'transform rotate-12' : 'group-hover:scale-110'}
                `}>
                  <Icon
                    size={22}
                    className={`
                      transition-all duration-300
                      ${isActive ? 'text-white drop-shadow-lg' : 'text-gray-400 group-hover:text-white'}
                    `}
                  />

                  {/* Active Lightning Effect */}
                  {isActive && (
                    <Zap
                      size={10}
                      className="absolute -top-1 -right-1 text-yellow-300 animate-pulse"
                    />
                  )}
                </div>

                {/* Label */}
                <span className={`
                  relative z-10 text-xs font-medium transition-all duration-300
                  ${isActive
                    ? 'text-white font-bold drop-shadow-sm'
                    : 'text-gray-500 group-hover:text-gray-300'
                  }
                `}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bottom Safe Area */}
        <div className="h-safe-bottom bg-gray-900" />
      </div>
    </div>
  );
};

export default MorphingTabBar;