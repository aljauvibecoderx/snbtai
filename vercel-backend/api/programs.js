const axios = require('axios');
const cheerio = require('cheerio');

const SNPMB_ENDPOINTS = {
  snbp: 'https://sidatagrun-public-1076756628210.asia-southeast2.run.app/ptn_sn.php',
  snbt: 'https://sidatagrun-public-1076756628210.asia-southeast2.run.app/ptn_sb.php'
};

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
};

const cache = new Map();
const CACHE_DURATION = 3600000;

async function fetchPrograms(universityCode, dataType = 'snbp') {
  const cacheKey = `programs_${dataType}_${universityCode}`;
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
  }

  const url = `${SNPMB_ENDPOINTS[dataType]}?ptn=${universityCode}`;
  const response = await axios.get(url, { headers: HEADERS, timeout: 30000 });
  const $ = cheerio.load(response.data);
  const programs = [];

  $('table.table tbody tr').each((_, row) => {
    const cols = $(row).find('td');
    if (cols.length >= 6) {
      const progCode = $(cols[1]).text().trim();
      const progName = $(cols[2]).text().trim();
      const jenjang = $(cols[3]).text().trim();
      const capacity = $(cols[4]).text().trim().replace(/\./g, '');
      const applicants = $(cols[5]).text().trim().replace(/\./g, '');

      if (progCode && progName && progName !== 'Program Studi') {
        const capNum = parseInt(capacity) || 0;
        const appNum = parseInt(applicants) || 0;
        const ratio = capNum > 0 ? (appNum / capNum).toFixed(1) : '-';
        const chance = appNum > 0 ? ((capNum / appNum) * 100).toFixed(2) : '0';

        programs.push({
          code: progCode,
          name: progName.replace(/\s+/g, ' '),
          jenjang,
          capacity,
          applicants,
          ratio,
          admissionChance: chance + '%'
        });
      }
    }
  });

  cache.set(cacheKey, { data: programs, timestamp: Date.now() });
  return programs;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { code } = req.query;
    const dataType = req.query.type || 'snbp';
    
    if (!code) {
      return res.status(400).json({ success: false, error: 'University code required' });
    }

    const programs = await fetchPrograms(code, dataType);
    res.json({ success: true, universityCode: code, dataType, count: programs.length, data: programs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
