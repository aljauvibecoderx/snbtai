import React, { useState, useEffect } from 'react';
import { Home, Globe, Camera, Plus, X, Sparkles, Zap } from 'lucide-react';

const OrbitalNavigation = ({ activeTab, onTabChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedOrb, setSelectedOrb] = useState(null);
  const [particles, setParticles] = useState([]);

  const tabs = [
    { 
      id: 'overview', 
      label: 'Overview', 
      icon: Home, 
      color: 'bg-gradient-to-r from-purple-500 to-violet-600',
      position: { x: -60, y: -40 },
      delay: 0
    },
    { 
      id: 'ptnpedia', 
      label: 'PTNPedia', 
      icon: Globe, 
      color: 'bg-gradient-to-r from-blue-500 to-cyan-600',
      position: { x: 60, y: -40 },
      delay: 100
    },
    { 
      id: 'ailens', 
      label: 'AI Lens', 
      icon: Camera, 
      color: 'bg-gradient-to-r from-emerald-500 to-teal-600',
      position: { x: 0, y: -80 },
      delay: 200
    }
  ];

  const generateParticles = () => {
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 2 + 1
    }));
    setParticles(newParticles);
    
    setTimeout(() => setParticles([]), 2000);
  };

  const handleTabSelect = (tabId) => {
    setSelectedOrb(tabId);
    generateParticles();
    setTimeout(() => {
      onTabChange(tabId);
      setIsExpanded(false);
      setSelectedOrb(null);
    }, 300);
  };

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      {/* Particle System */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-ping"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDuration: `${particle.duration}s`
          }}
        />
      ))}

      {/* Orbital Container */}
      <div className="relative w-32 h-32">
        {/* Background Glow */}
        <div className={`
          absolute inset-0 rounded-full transition-all duration-500
          ${isExpanded 
            ? 'bg-gradient-to-r from-purple-500/20 to-violet-500/20 scale-150 blur-xl' 
            : 'bg-transparent scale-100'
          }
        `} />

        {/* Orbital Items */}
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isSelected = selectedOrb === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabSelect(tab.id)}
              className={`
                absolute w-12 h-12 rounded-full shadow-lg
                flex items-center justify-center
                transition-all duration-500 ease-out
                ${tab.color}
                ${isExpanded 
                  ? 'opacity-100 scale-100' 
                  : 'opacity-0 scale-0 pointer-events-none'
                }
                ${isSelected ? 'scale-125 rotate-180' : 'hover:scale-110'}
                ${isActive ? 'ring-4 ring-white/50' : ''}
                group
              `}
              style={{
                left: isExpanded 
                  ? `calc(50% + ${tab.position.x}px - 24px)` 
                  : 'calc(50% - 24px)',
                top: isExpanded 
                  ? `calc(50% + ${tab.position.y}px - 24px)` 
                  : 'calc(50% - 24px)',
                transitionDelay: isExpanded ? `${tab.delay}ms` : '0ms'
              }}
            >
              <Icon 
                size={20} 
                className={`
                  text-white transition-all duration-300
                  ${isSelected ? 'rotate-180' : 'group-hover:scale-110'}
                `}
              />
              
              {/* Active Indicator */}
              {isActive && (
                <div className="absolute -top-1 -right-1">
                  <Sparkles size={12} className="text-yellow-300 animate-pulse" />
                </div>
              )}
              
              {/* Label Tooltip */}
              <div className={`
                absolute -top-8 left-1/2 transform -translate-x-1/2
                px-2 py-1 bg-slate-700 text-white text-xs rounded-md
                transition-all duration-300 whitespace-nowrap
                ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
              `}>
                {tab.label}
              </div>
            </button>
          );
        })}

        {/* Center FAB */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
            w-16 h-16 rounded-full shadow-2xl
            bg-gradient-to-r from-purple-600 to-violet-700
            flex items-center justify-center
            transition-all duration-300 ease-out
            ${isExpanded ? 'rotate-45 scale-110' : 'hover:scale-105'}
            group
          `}
        >
          {/* Center Icon */}
          <div className="relative">
            {isExpanded ? (
              <X size={24} className="text-white transition-transform duration-300" />
            ) : (
              <Plus size={24} className="text-white transition-transform duration-300" />
            )}
            
            {/* Center Glow */}
            <div className={`
              absolute inset-0 rounded-full
              bg-gradient-to-r from-purple-400 to-violet-400
              transition-all duration-300
              ${isExpanded ? 'scale-150 opacity-30 animate-pulse' : 'scale-0 opacity-0'}
            `} />
          </div>
          
          {/* Ripple Effect */}
          <div className={`
            absolute inset-0 rounded-full border-2 border-white/30
            transition-all duration-1000
            ${isExpanded ? 'scale-200 opacity-0' : 'scale-100 opacity-100'}
          `} />
        </button>

        {/* Active Tab Indicator */}
        {!isExpanded && (
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="px-3 py-1 bg-slate-700/80 backdrop-blur-sm rounded-full">
              <span className="text-white text-xs font-medium">
                {tabs.find(tab => tab.id === activeTab)?.label}
              </span>
            </div>
          </div>
        )}

        {/* Orbital Rings */}
        {isExpanded && (
          <>
            <div className="absolute inset-4 border border-white/10 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
            <div className="absolute inset-8 border border-white/5 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
          </>
        )}
      </div>
    </div>
  );
};

export default OrbitalNavigation;