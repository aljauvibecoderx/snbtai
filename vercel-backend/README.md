# Deploy PTNPedia Backend ke Vercel

## Cara Deploy

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login ke Vercel
```bash
vercel login
```

### 3. Deploy
```bash
vercel
```

Ikuti prompt:
- Set up and deploy? **Y**
- Which scope? Pilih account Anda
- Link to existing project? **N**
- Project name? **ptnpedia-api** (atau nama lain)
- In which directory? **./** (root)
- Override settings? **N**

### 4. Deploy Production
```bash
vercel --prod
```

### 5. Dapatkan URL
Setelah deploy, Vercel akan memberikan URL:
```
https://your-project.vercel.app
```

### 6. Update Frontend
Edit file `.env` di root project:
```
REACT_APP_BACKEND_URL=https://your-project.vercel.app
```

## Test API

```bash
# Health check
curl https://your-project.vercel.app/api/ptnpedia/health

# Get universities
curl https://your-project.vercel.app/api/ptnpedia/universities?type=snbp

# Get programs
curl https://your-project.vercel.app/api/ptnpedia/programs/0001?type=snbp
```

## Endpoints

- `GET /api/ptnpedia/universities?type=snbp|snbt`
- `GET /api/ptnpedia/programs/:code?type=snbp|snbt`
- `GET /api/ptnpedia/health`

## Notes

- Vercel serverless functions memiliki timeout 10 detik (hobby plan)
- Cache digunakan untuk mengurangi request ke SNPMB
- CORS sudah diaktifkan untuk semua origin
