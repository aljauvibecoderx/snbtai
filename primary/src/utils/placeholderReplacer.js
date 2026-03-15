/**
 * Placeholder Replacer Utility
 * Converts template placeholders like {{strengthen_or_weaken}} into readable text
 * SNBT AI - Competition
 */

const PLACEHOLDER_REPLACEMENTS = {
  strengthen_or_weaken: 'memperkuat atau melemahkan',
  party: 'pihak terkait',
  argument_A: 'Pihak A',
  argument_B: 'Pihak B',
  claim: 'klaim tertentu',
  response: 'tanggapan',
  strongest_support: 'Bukti kuat yang mendukung argumen',
  weak_support: 'Bukti lemah yang mendukung argumen',
  context: 'Konteks situasi atau fenomena',
  correct_inference: 'Simpulan yang langsung didukung oleh teks',
  phenomenon: 'fenomena tersebut',
  most_likely_cause: 'Penyebab yang paling mungkin',
  data_statistic: 'Data statistik',
  text: 'Teks',
  passage: 'Teks bacaan',
  sentence: 'Kalimat'
};

export function replacePlaceholders(text, customReplacements = {}) {
  if (!text || typeof text !== 'string') {
    return text || '';
  }

  const replacements = { ...PLACEHOLDER_REPLACEMENTS, ...customReplacements };

  return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return replacements[key] || formatKeyAsText(key);
  });
}

function formatKeyAsText(key) {
  return key.replace(/_/g, ' ');
}

export function replacePlaceholdersInTemplate(template, customReplacements = {}) {
  if (!template) return template;
  if (typeof template === 'string') return replacePlaceholders(template, customReplacements);
  if (Array.isArray(template)) return template.map(item => replacePlaceholdersInTemplate(item, customReplacements));
  if (typeof template === 'object') {
    const result = {};
    for (const [key, value] of Object.entries(template)) {
      result[key] = replacePlaceholdersInTemplate(value, customReplacements);
    }
    return result;
  }
  return template;
}

export function processPatternForDisplay(pattern) {
  if (!pattern) return null;
  const processed = { ...pattern };
  if (pattern.template) processed.displayTemplate = replacePlaceholdersInTemplate(pattern.template);
  if (pattern.example) processed.displayExample = replacePlaceholdersInTemplate(pattern.example);
  return processed;
}

export default { replacePlaceholders, replacePlaceholdersInTemplate, processPatternForDisplay, PLACEHOLDER_REPLACEMENTS };
