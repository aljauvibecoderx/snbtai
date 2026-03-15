import React, { useEffect } from 'react';

/**
 * LatexWrapper Component
 * Renders LaTeX math expressions using KaTeX
 * SNBT AI - Competition
 * 
 * @param {Object} props
 * @param {string} props.text - Text containing LaTeX expressions
 * @param {string} props.className - Additional CSS class
 */
const LatexWrapper = ({ text, className = "" }) => {
  useEffect(() => {
    if (!document.getElementById('katex-css')) {
      const link = document.createElement('link');
      link.id = 'katex-css';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
      document.head.appendChild(link);
    }

    if (!window.katex && !document.getElementById('katex-js')) {
      const script = document.createElement('script');
      script.id = 'katex-js';
      script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
      script.onload = () => {
        if (window.katex) {
          renderMath();
        }
      };
      document.head.appendChild(script);
    } else if (window.katex) {
      renderMath();
    }

    function renderMath() {
      if (!text || !window.katex) return;

      const elements = document.querySelectorAll('.latex-content');
      elements.forEach(el => {
        try {
          window.katex.render(el.textContent, el.parentNode, {
            displayMode: el.getAttribute('data-display') === 'true',
            throwOnError: false,
            errorColor: '#cc0000'
          });
        } catch (e) {
          console.error('KaTeX render error:', e);
        }
      });
    }

    renderMath();
  }, [text]);

  if (!text) return null;

  const isDisplay = text.includes('$$') || text.includes('\\[');
  const cleanText = text.replace(/\$\$/g, '').replace(/\\\[/g, '').replace(/\\\]/g, '');

  return (
    <span 
      className={`latex-content ${className}`}
      data-display={isDisplay}
    >
      {cleanText}
    </span>
  );
};

export default LatexWrapper;
