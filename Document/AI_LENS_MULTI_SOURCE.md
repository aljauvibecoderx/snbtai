# 📸 UTBK-AI Lens Multi-Source & PDF Support

## Overview
Upgrade fitur AI Lens untuk mendukung **multiple images** (max 5) dan **PDF documents** dengan parallel processing dan context aggregation.

## Key Features

### 1. Multi-File Input
- **Max 5 files** per generation
- Support format: `.jpg`, `.png`, `.pdf`
- Max file size: 5MB per file
- Drag & drop, upload, atau paste (Ctrl+V)

### 2. Parallel Processing
- **Tesseract.js** untuk OCR gambar (paralel)
- **PDF.js** untuk ekstraksi teks PDF
- Progress indicator per file

### 3. Context Aggregation
- Combine text dari semua sumber dengan separator
- Max 8000 karakter (token economy)
- Auto-truncate jika terlalu panjang

### 4. Enhanced AI Prompt
- Multi-source instruction untuk Gemini
- Sintesis informasi dari multiple sources
- Isomorphic variation tetap terjaga

## Technical Implementation

### Files Modified
1. **src/ImageUploader.js**
   - Support multiple file selection
   - Thumbnail preview untuk setiap file
   - Individual file removal

2. **src/multi-source-processor.js** (NEW)
   - `extractTextFromPDF()`: PDF text extraction
   - `extractTextFromImage()`: OCR with Tesseract
   - `processMultipleFiles()`: Parallel processing
   - `generateMultiSourcePrompt()`: Enhanced prompt

3. **src/App.js**
   - `generateQuestionsFromImage()`: Updated untuk multi-source
   - `handleVisionGenerate()`: Accept array of files

### Dependencies Added
```json
{
  "pdfjs-dist": "^latest"
}
```

## Usage Flow

```
User uploads 5 files (3 images + 2 PDFs)
    ↓
ImageUploader validates & previews
    ↓
processMultipleFiles() runs parallel extraction
    ↓
Context aggregation with separators
    ↓
Enhanced Gemini prompt with multi-source instruction
    ↓
Generate 5 shadow questions
```

## Example Prompt Enhancement

**Before (Single Source):**
```
INPUT TEKS (DARI OCR):
"Teks dari 1 gambar..."
```

**After (Multi-Source):**
```
=== MULTI-SOURCE INPUT (5 SUMBER) ===
Anda menerima teks dari 5 sumber berbeda...

INPUT TEKS:
=== SUMBER 1: image1.jpg ===
Teks dari gambar 1...

=== SUMBER 2: document.pdf ===
Teks dari PDF...
```

## Performance Optimization

1. **Token Economy**
   - Clean non-alphanumeric characters
   - Truncate to 8000 chars max
   - Remove redundant whitespace

2. **Latency Management**
   - Parallel OCR/PDF processing
   - Progress indicator per file
   - Thumbnail preview (instant feedback)

3. **Error Handling**
   - File size validation (5MB)
   - Format validation (image/PDF only)
   - Graceful fallback to MOCK_QUESTIONS

## Rate Limiting
- Same as text generation (19 generations/day for logged users)
- Multi-source counts as 1 generation
- Developer mode: unlimited

## UI/UX Improvements
- Grid layout untuk multiple thumbnails
- Individual remove button per file
- "Hapus Semua" button
- File count indicator
- PDF icon untuk PDF files

## Future Enhancements
- [ ] Page selection untuk PDF (currently all pages)
- [ ] Image preprocessing (contrast, brightness)
- [ ] OCR language auto-detection
- [ ] Batch processing (multiple sets)

## Testing Checklist
- [x] Single image (legacy mode)
- [x] Multiple images (2-5)
- [x] Single PDF
- [x] Mixed (images + PDFs)
- [x] File size validation
- [x] Format validation
- [x] Error handling
- [x] Progress indicator
- [x] Token truncation

## Known Limitations
1. PDF limited to 10 pages (performance)
2. OCR accuracy depends on image quality
3. Max 8000 chars combined text
4. No page selection for PDF

---

**Implementation Date**: 2025-01-XX  
**Status**: ✅ Production Ready  
**Impact**: High - Significantly improves AI Lens capability
