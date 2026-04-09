import React from 'react';

/**
 * SplitPanel - Split screen layout component for desktop
 * 
 * Creates a left-right split layout with independent scrolling.
 * Commonly used for gameplay (stimulus left, answers right).
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.left - Left panel content
 * @param {React.ReactNode} props.right - Right panel content
 * @param {string} props.leftWidth - Left panel width (default: w-3/5 = 60%)
 * @param {string} props.rightWidth - Right panel width (default: w-2/5 = 40%)
 * @param {string} props.className - Additional CSS classes
 */
const SplitPanel = ({ 
  left, 
  right, 
  leftWidth = 'w-3/5', 
  rightWidth = 'w-2/5',
  className = '' 
}) => {
  return (
    <div className={`lg:flex lg:h-screen lg:overflow-hidden ${className}`}>
      {/* Left Panel */}
      <div className={`lg:${leftWidth} lg:h-full lg:overflow-y-auto lg:p-8 lg:border-r lg:border-slate-200 lg:bg-white`}>
        {left}
      </div>
      
      {/* Right Panel */}
      <div className={`lg:${rightWidth} lg:h-full lg:overflow-y-auto lg:p-8 lg:bg-slate-50`}>
        {right}
      </div>
    </div>
  );
};

export default SplitPanel;
