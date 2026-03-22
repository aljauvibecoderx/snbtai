import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

/**
 * LatexWrapper
 * Renders mixed text + LaTeX math strings.
 * Splits on $...$ boundaries; plain text is rendered as normal text,
 * math segments are rendered via KaTeX.
 *
 * Fix: Plain text spans use `font-family: inherit` to prevent KaTeX CSS
 * (which applies italic math fonts globally) from bleeding onto non-math text.
 */
const LatexWrapper = ({ text, className = '' }) => {
  if (!text) return null;

  // Split into alternating [plain, $math$, plain, $math$, ...] segments
  const parts = text.split(/(\$[^$\n]+\$)/g);

  return (
    <span className={className}>
      {parts.map((part, i) => {
        const isMath = part.startsWith('$') && part.endsWith('$') && part.length > 2;

        if (isMath) {
          const mathContent = part.slice(1, -1).trim();
          try {
            const html = katex.renderToString(mathContent, {
              throwOnError: false,
              displayMode: false,
              output: 'html',
            });
            return (
              <span
                key={i}
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch {
            // Fallback: show raw $...$ if KaTeX fails
            return (
              <span key={i} style={{ fontFamily: 'inherit', fontStyle: 'normal' }}>
                {part}
              </span>
            );
          }
        }

        // Plain text — override KaTeX CSS so text renders normally
        return part ? (
          <span
            key={i}
            style={{
              fontFamily: 'inherit',
              fontStyle: 'normal',
              fontWeight: 'inherit',
              letterSpacing: 'normal',
              wordSpacing: 'normal',
            }}
          >
            {part}
          </span>
        ) : null;
      })}
    </span>
  );
};

export default LatexWrapper;
