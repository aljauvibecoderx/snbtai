/**
 * irtSessionUtils.js
 * Utility functions for IRT Simulation session management.
 *
 * URL format:
 *   /irt-simulation/{section}/{sessionCode}
 *   /irt-simulation/snbt-simulation/{sessionCode}
 *
 * Session code encodes a lightweight fingerprint of session config
 * (PTN id, population scale, step) so the URL is shareable and identifiable.
 */

// ── Section slug map ────────────────────────────────────────────────────────
// Maps the 4 wizard steps to slug-friendly section names
export const IRT_SECTIONS = {
  1: 'konfigurasi',
  2: 'metode-input',
  3: 'input-skor',
  4: 'hasil-analisis',
};

export const IRT_SECTION_BY_SLUG = Object.fromEntries(
  Object.entries(IRT_SECTIONS).map(([k, v]) => [v, Number(k)])
);

// ── Session code ────────────────────────────────────────────────────────────

/**
 * Generate a short, URL-safe session code.
 * Format: {ptn2char}{scale1char}{timestamp4char}
 * Example: ui-m-a3f2
 */
export function generateSessionCode(ptnId = 'xx', scaleId = 'x') {
  const ts = Date.now().toString(36).slice(-4); // last 4 base-36 digits
  const ptn = (ptnId || 'xx').slice(0, 3).toLowerCase().replace(/[^a-z0-9]/g, 'x');
  const scale = (scaleId || 'x').slice(0, 1).toLowerCase();
  return `${ptn}-${scale}-${ts}`;
}

/**
 * Build the IRT simulation path for a given section + config.
 */
export function buildIRTPath(section, ptnId, scaleId, sessionCode) {
  const slug = IRT_SECTIONS[section] || 'konfigurasi';
  const code = sessionCode || generateSessionCode(ptnId, scaleId);
  return `/irt-simulation/${slug}/${code}`;
}

/**
 * Build the SNBT Exam path.
 */
export function buildSNBTExamPath(sessionCode) {
  return `/irt-simulation/snbt-simulation/${sessionCode}`;
}

/**
 * Parse an IRT simulation pathname.
 * Returns { section (number|null), sessionCode, isSNBTExam }
 */
export function parseIRTPath(pathname) {
  // /irt-simulation/snbt-simulation/{code}
  const snbtMatch = pathname.match(/^\/irt-simulation\/snbt-simulation\/([^/]+)$/);
  if (snbtMatch) {
    return { section: null, sessionCode: snbtMatch[1], isSNBTExam: true };
  }

  // /irt-simulation/{sectionSlug}/{code}
  const irtMatch = pathname.match(/^\/irt-simulation\/([^/]+)\/([^/]+)$/);
  if (irtMatch) {
    const sectionSlug = irtMatch[1];
    const sessionCode = irtMatch[2];
    const section = IRT_SECTION_BY_SLUG[sectionSlug] || 1;
    return { section, sessionCode, isSNBTExam: false };
  }

  // /irt-simulation (bare root)
  if (pathname === '/irt-simulation') {
    return { section: 1, sessionCode: null, isSNBTExam: false };
  }

  return null;
}
