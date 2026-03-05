/**
 * PTNPedia Backend API Handler
 * Mengatasi CORS issue dengan melakukan proxy request ke SNPMB API
 * 
 * Deploy sebagai:
 * 1. Firebase Cloud Function
 * 2. Express server standalone
 * 3. Vercel serverless function
 */

const axios = require('axios');
const cheerio = require('cheerio');

// Configuration
const SNPMB_ENDPOINTS = {
  snbp: 'https://sidatagrun-public-1076756628210.asia-southeast2.run.app/ptn_sn.php',
  snbt: 'https://sidatagrun-public-1076756628210.asia-southeast2.run.app/ptn_sb.php'
};

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'id-ID,id;q=0.9,en;q=0.8',
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache'
};

// Cache untuk mengurangi request
const cache = new Map();
const CACHE_DURATION = 3600000; // 1 jam

/**
 * Fetch universities dari SNPMB
 */
async function fetchUniversities(dataType = 'snbp') {
  const cacheKey = `universities_${dataType}`;
  
  // Check cache
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log(`Cache hit: ${cacheKey}`);
      return cached.data;
    }
  }

  try {
    const url = SNPMB_ENDPOINTS[dataType] || SNPMB_ENDPOINTS.snbp;
    console.log(`Fetching universities from: ${url}`);
    
    const response = await axios.get(url, {
      headers: HEADERS,
      timeout: 30000,
      maxRedirects: 5
    });

    const $ = cheerio.load(response.data);
    const universities = [];

    // Parse table rows
    $('table tbody tr').each((i, row) => {
      try {
        const cells = $(row).find('td');
        if (cells.length >= 3) {
          const codeLink = $(cells[1]).find('a').attr('href');
          const nameLink = $(cells[2]).find('a').first();
          const name = nameLink.text().trim();

          if (codeLink && name) {
            const codeMatch = codeLink.match(/ptn=([0-9]+)/);
            if (codeMatch) {
              universities.push({
                code: codeMatch[1],
                name: name.replace(/\s+/g, ' ')
              });
            }
          }
        }
      } catch (err) {
        console.warn(`Warning parsing row ${i}:`, err.message);
      }
    });

    console.log(`Fetched ${universities.length} universities`);
    
    // Cache result
    cache.set(cacheKey, {
      data: universities,
      timestamp: Date.now()
    });

    return universities;
  } catch (error) {
    console.error('Error fetching universities:', error.message);
    throw new Error(`Failed to fetch universities: ${error.message}`);
  }
}

/**
 * Fetch programs untuk universitas tertentu
 */
async function fetchPrograms(universityCode, dataType = 'snbp') {
  const cacheKey = `programs_${dataType}_${universityCode}`;
  
  // Check cache
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log(`Cache hit: ${cacheKey}`);
      return cached.data;
    }
  }

  try {
    const baseUrl = SNPMB_ENDPOINTS[dataType] || SNPMB_ENDPOINTS.snbp;
    const url = `${baseUrl}?ptn=${universityCode}`;
    console.log(`Fetching programs from: ${url}`);
    
    const response = await axios.get(url, {
      headers: HEADERS,
      timeout: 30000,
      maxRedirects: 5
    });

    const $ = cheerio.load(response.data);
    const programs = [];

    // Parse program table
    $('table.table tbody tr').each((_, row) => {
      try {
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
              jenjang: jenjang,
              capacity: capacity,
              applicants: applicants,
              ratio: ratio,
              admissionChance: chance + '%'
            });
          }
        }
      } catch (err) {
        console.warn('Warning parsing program row:', err.message);
      }
    });

    console.log(`Fetched ${programs.length} programs for university ${universityCode}`);
    
    // Cache result
    cache.set(cacheKey, {
      data: programs,
      timestamp: Date.now()
    });

    return programs;
  } catch (error) {
    console.error('Error fetching programs:', error.message);
    throw new Error(`Failed to fetch programs: ${error.message}`);
  }
}

/**
 * Express Route Handlers
 */
function setupPTNPediaRoutes(app) {
  // GET /api/ptnpedia/universities
  app.get('/api/ptnpedia/universities', async (req, res) => {
    try {
      const dataType = req.query.type || 'snbp';
      
      if (!['snbp', 'snbt'].includes(dataType)) {
        return res.status(400).json({ error: 'Invalid data type. Use snbp or snbt.' });
      }

      const universities = await fetchUniversities(dataType);
      
      res.set('Cache-Control', 'public, max-age=3600');
      res.json({
        success: true,
        dataType: dataType,
        count: universities.length,
        data: universities
      });
    } catch (error) {
      console.error('API Error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch universities'
      });
    }
  });

  // GET /api/ptnpedia/programs/:code
  app.get('/api/ptnpedia/programs/:code', async (req, res) => {
    try {
      const { code } = req.params;
      const dataType = req.query.type || 'snbp';
      
      if (!code || !/^\d+$/.test(code)) {
        return res.status(400).json({ error: 'Invalid university code' });
      }
      
      if (!['snbp', 'snbt'].includes(dataType)) {
        return res.status(400).json({ error: 'Invalid data type. Use snbp or snbt.' });
      }

      const programs = await fetchPrograms(code, dataType);
      
      res.set('Cache-Control', 'public, max-age=3600');
      res.json({
        success: true,
        universityCode: code,
        dataType: dataType,
        count: programs.length,
        data: programs
      });
    } catch (error) {
      console.error('API Error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch programs'
      });
    }
  });

  // Health check
  app.get('/api/ptnpedia/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      cacheSize: cache.size
    });
  });
}

module.exports = {
  setupPTNPediaRoutes,
  fetchUniversities,
  fetchPrograms
};
