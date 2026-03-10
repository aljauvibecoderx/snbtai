import React, { useState } from 'react';
import { Home, Globe, Camera, Sparkles } from 'lucide-react';

const GlassmorphismNavbar = ({ activeTab, onTabChange }) => {
  const [pressedTab, setPressedTab] = useState(null);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home, color: 'from-purple-500 to-violet-600' },
    { id: 'ptnpedia', label: 'PTNPedia', icon: Globe, color: 'from-blue-500 to-cyan-600' },
    { id: 'ailens', label: 'AI Lens', icon: Camera, color: 'from-emerald-500 to-teal-600' }
  ];

  return (
    <div className="fixed bottom-6 left-4 right-4 z-50">
      {/* Glassmorphism Container */}
      <div className="relative">
        {/* Background Blur */}
        <div className="absolute inset-0 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 shadow-2xl" />
        
        {/* Navigation Content */}
        <div className="relative flex items-center justify-around px-4 py-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isPressed = pressedTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                onMouseDown={() => setPressedTab(tab.id)}
                onMouseUp={() => setPressedTab(null)}
                onMouseLeave={() => setPressedTab(null)}
                className={`
                  relative flex flex-col items-center justify-center
                  min-w-[64px] h-16 rounded-xl
                  transition-all duration-300 ease-out
                  ${isPressed ? 'scale-95' : 'scale-100'}
                  ${isActive ? 'transform -translate-y-1' : ''}
                  group
                `}
              >
                {/* Active Background Glow */}
                {isActive && (
                  <div className={`
                    absolute inset-0 rounded-xl opacity-20
                    bg-gradient-to-r ${tab.color}
                    animate-pulse
                  `} />
                )}
                
                {/* Icon Container */}
                <div className={`
                  relative flex items-center justify-center
                  w-10 h-10 rounded-lg mb-1
                  transition-all duration-300
                  ${isActive 
                    ? `bg-gradient-to-r ${tab.color} shadow-lg` 
                    : 'bg-white/10 group-hover:bg-white/20'
                  }
                `}>
                  <Icon 
                    size={20} 
                    className={`
                      transition-all duration-300
                      ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-800'}
                    `}
                  />
                  
                  {/* Active Sparkle Effect */}
                  {isActive && (
                    <Sparkles 
                      size={12} 
                      className="absolute -top-1 -right-1 text-white animate-ping" 
                    />
                  )}
                </div>
                
                {/* Label */}
                <span className={`
                  text-xs font-medium transition-all duration-300
                  ${isActive 
                    ? 'text-gray-800 font-semibold' 
                    : 'text-gray-600 group-hover:text-gray-800'
                  }
                `}>
                  {tab.label}
                </span>
                
                {/* Active Indicator Dot */}
                {isActive && (
                  <div className={`
                    absolute -bottom-1 w-1 h-1 rounded-full
                    bg-gradient-to-r ${tab.color}
                    animate-pulse
                  `} />
                )}
              </button>
            );
          })}
        </div>
        
        {/* Bottom Glow Effect */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent rounded-full blur-sm" />
      </div>
    </div>
  );
};

export default GlassmorphismNavbar;