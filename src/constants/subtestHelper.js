export const SUBTESTS = [
  { id: 'tps_pu', label: 'TPS - Penalaran Umum' },
  { id: 'tps_ppu', label: 'TPS - Pengetahuan & Pemahaman Umum' },
  { id: 'tps_pbm', label: 'TPS - Pemahaman Bacaan & Menulis' },
  { id: 'tps_pk', label: 'TPS - Pengetahuan Kuantitatif' },
  { id: 'lit_ind', label: 'Literasi Bahasa Indonesia' },
  { id: 'lit_ing', label: 'Literasi Bahasa Inggris' },
  { id: 'pm', label: 'Penalaran Matematika' },
];

export const getSubtestLabel = (subtestId) => {
  const subtest = SUBTESTS.find(s => s.id === subtestId);
  return subtest?.label || 'SNBT';
};
