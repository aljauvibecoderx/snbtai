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

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const dataType = req.query.type || 'snbp';
    const universities = await fetchUniversities(dataType);
    res.json({ success: true, dataType, count: universities.length, data: universities });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
