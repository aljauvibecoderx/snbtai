// Backend API untuk PTNPedia - letakkan di folder backend/routes atau gunakan Firebase Cloud Functions
// Atau bisa ditambahkan ke Express server yang sudah ada

import axios from 'axios';
import * as cheerio from 'cheerio';

// Endpoint untuk mendapatkan daftar universitas
export async function getUniversitiesAPI(dataType = 'snbp') {
  const url = dataType === 'snbp'
    ? 'https://sidatagrun-public-1076756628210.asia-southeast2.run.app/ptn_sn.php'
    : 'https://sidatagrun-public-1076756628210.asia-southeast2.run.app/ptn_sb.php';

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 30000
    });

    const $ = cheerio.load(response.data);
    const universities = [];

    $('table tbody tr').each((i, row) => {
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
              name: name
            });
          }
        }
      }
    });

    return universities;
  } catch (error) {
    console.error('Error fetching universities:', error);
    throw error;
  }
}

// Endpoint untuk mendapatkan program studi per universitas
export async function getProgramsAPI(universityCode, dataType = 'snbp') {
  const baseUrl = dataType === 'snbp'
    ? 'https://sidatagrun-public-1076756628210.asia-southeast2.run.app/ptn_sn.php'
    : 'https://sidatagrun-public-1076756628210.asia-southeast2.run.app/ptn_sb.php';

  try {
    const response = await axios.get(`${baseUrl}?ptn=${universityCode}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 30000
    });

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
            name: progName,
            jenjang,
            capacity,
            applicants,
            ratio,
            admissionChance: chance + '%'
          });
        }
      }
    });

    return programs;
  } catch (error) {
    console.error('Error fetching programs:', error);
    throw error;
  }
}

// Express route handler (jika menggunakan Express)
export function setupPTNPediaRoutes(app) {
  app.get('/api/ptnpedia/universities', async (req, res) => {
    try {
      const dataType = req.query.type || 'snbp';
      const universities = await getUniversitiesAPI(dataType);
      res.json(universities);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/ptnpedia/programs/:code', async (req, res) => {
    try {
      const { code } = req.params;
      const dataType = req.query.type || 'snbp';
      const programs = await getProgramsAPI(code, dataType);
      res.json(programs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
}
