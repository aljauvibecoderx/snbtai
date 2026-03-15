/**
 * PTNPedia API
 * Vercel Serverless Function for PTN Data
 * SNBT AI - Competition
 */

const axios = require('axios');
const cheerio = require('cheerio');

// Data sources - replace with your own data source URLs
const SNPMB_ENDPOINTS = {
  snbp: 'https://your-data-source.com/snbp',
  snbt: 'https://your-data-source.com/snbt'
};

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
};

const cache = new Map();
const CACHE_DURATION = 3600000;

async function fetchUniversities(dataType = 'snbp') {
  const cacheKey = `universities_${dataType}`;
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
  }

  const url = SNPMB_ENDPOINTS[dataType];
  const response = await axios.get(url, { headers: HEADERS, timeout: 30000 });
  const $ = cheerio.load(response.data);
  const universities = [];

  $('table tbody tr').each((i, row) => {
    const cells = $(row).find('td');
    if (cells.length >= 3) {
      const codeLink = $(cells[1]).find('a').attr('href');
      const name = $(cells[2]).find('a').first().text().trim();
      if (codeLink && name) {
        const codeMatch = codeLink.match(/ptn=([0-9]+)/);
        if (codeMatch) {
          universities.push({ code: codeMatch[1], name: name.replace(/\s+/g, ' ') });
        }
      }
    }
  });

  cache.set(cacheKey, { data: universities, timestamp: Date.now() });
  return universities;
}

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
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { path } = req.query;
  
  try {
    if (path && path[0] === 'universities') {
      const dataType = req.query.type || 'snbp';
      const universities = await fetchUniversities(dataType);
      return res.json({ success: true, dataType, count: universities.length, data: universities });
    }
    
    if (path && path[0] === 'programs' && path[1]) {
      const code = path[1];
      const dataType = req.query.type || 'snbp';
      const programs = await fetchPrograms(code, dataType);
      return res.json({ success: true, universityCode: code, dataType, count: programs.length, data: programs });
    }
    
    if (path && path[0] === 'health') {
      return res.json({ status: 'ok', timestamp: new Date().toISOString() });
    }
    
    res.status(404).json({ error: 'Not Found' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
