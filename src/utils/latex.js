import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

/**
 * Renders a string that may contain mixed text and LaTeX math expressions.
 * Supports inline math wrapped in $...$ delimiters.
 *
 * Uses katex.renderToString() scoped to each individual segment,
 * injected safely via dangerouslySetInnerHTML.
 *
 * @param {string} text - Input string, may contain $math$ segments
 * @param {string} className - Optional CSS class for the wrapper
 */
const LatexWrapper = ({ text, className = '' }) => {
  if (!text) return null;

  // Split on $...$ boundaries, keeping the delimiters in the array
  const parts = text.split(/(\$[^$]+\$)/g);

  return (
    <span className={className}>
      {parts.map((part, i) => {
        const isMath = part.startsWith('$') && part.endsWith('$') && part.length > 2;

        if (isMath) {
          const mathContent = part.slice(1, -1); // Strip the $ delimiters
          try {
            const html = katex.renderToString(mathContent, {
              throwOnError: false,
              displayMode: false,
              output: 'html',
            });
            return (
              <span
                key={i}
                className="katex-inline"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch (e) {
            // Graceful fallback: render raw text if KaTeX parse fails
            return <span key={i}>{part}</span>;
          }
        }

        // Plain text segment
        return part ? <span key={i}>{part}</span> : null;
      })}
    </span>
  );
};

export default LatexWrapper;
