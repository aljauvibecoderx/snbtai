import React from 'react';

/**
 * DesktopLayout - Responsive container wrapper for desktop layouts
 * 
 * Provides a wide container for desktop screens while maintaining
 * mobile-first centered layout for smaller screens.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.maxWidth - Maximum width (default: max-w-6xl)
 */
const DesktopLayout = ({ children, className = '', maxWidth = 'max-w-6xl' }) => {
  return (
    <div className={`max-w-md mx-auto px-4 lg:${maxWidth} lg:px-8 ${className}`}>
      {children}
    </div>
  );
};

export default DesktopLayout;
