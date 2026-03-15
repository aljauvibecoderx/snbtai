import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

// Inject modal animation styles
if (typeof document !== 'undefined') {
  const styleId = 'modal-portal-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes modalSlideUp {
        from {
          opacity: 0;
          transform: translateY(24px) scale(0.96);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      .animate-modal-slide-up {
        animation: modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
      }
    `;
    document.head.appendChild(style);
  }
}

/**
 * Modal Portal Component
 * 
 * Renders modal outside main DOM hierarchy to avoid stacking context issues.
 * This ensures modal overlay covers EVERYTHING including headers, navbars, etc.
 * 
 * @param {boolean} isOpen - Control modal visibility
 * @param {function} onClose - Callback when modal should close
 * @param {string} title - Modal title
 * @param {React.ReactNode} children - Modal content
 * @param {string} size - Modal size: 'sm', 'md', 'lg'
 */
export const ModalPortal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg'
  };

  // This creates a true full-viewport overlay that covers EVERYTHING
  const modalContent = (
    <>
      {/* Backdrop Layer - Full viewport, highest z-index */}
      <div 
        className="fixed inset-0 z-[99999]"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          width: '100vw',
          height: '100vh',
          maxWidth: '100vw',
          maxHeight: '100vh'
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        {/* Modal Container - Centered */}
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 pointer-events-none">
          {/* Modal Card */}
          <div 
            className={`bg-white rounded-2xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto pointer-events-auto transform transition-all animate-modal-slide-up`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 px-8 pt-8">
              <h3 
                id="modal-title" 
                className="text-xl font-bold text-slate-900 tracking-tight"
              >
                {title}
              </h3>
              <button 
                onClick={onClose}
                className="p-2.5 hover:bg-slate-100 rounded-xl transition-all duration-200 group"
                aria-label="Tutup modal"
              >
                <X size={20} className="text-slate-500 group-hover:text-slate-700" />
              </button>
            </div>
            
            {/* Content */}
            <div className="px-8 pb-8 pt-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // Render portal to document.body to escape parent stacking contexts
  return createPortal(modalContent, document.body);
};

export default ModalPortal;
