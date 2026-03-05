# 🚀 AI Lens Multi-Source - Quick Reference

## Installation
```bash
npm install pdfjs-dist --save
```

## Import
```javascript
import { processMultipleFiles, generateMultiSourcePrompt } from './multi-source-processor';
```

## API Reference

### `processMultipleFiles(files, onProgress)`
Process multiple images/PDFs in parallel.

**Parameters:**
- `files` (Array): Array of file objects `{name, type, data, isImage, isPDF}`
- `onProgress` (Function): Callback `(current, total) => {}`

**Returns:** `Promise<string>` - Combined text with separators

**Example:**
```javascript
const files = [
  { name: 'img1.jpg', type: 'image/jpeg', data: 'base64...', isImage: true, isPDF: false },
  { name: 'doc.pdf', type: 'application/pdf', data: 'base64...', isImage: false, isPDF: true }
];

const combinedText = await processMultipleFiles(files, (current, total) => {
  console.log(`Processing ${current}/${total}`);
});
```

### `extractTextFromPDF(pdfDataUrl)`
Extract text from PDF file.

**Parameters:**
- `pdfDataUrl` (string): Base64 data URL of PDF

**Returns:** `Promise<string>` - Extracted text

**Limits:**
- Max 10 pages
- Returns empty string on error

### `extractTextFromImage(imageDataUrl)`
Extract text from image using Tesseract.js.

**Parameters:**
- `imageDataUrl` (string): Base64 data URL of image

**Returns:** `Promise<string>` - Extracted text

**Languages:** `ind+eng` (Indonesian + English)

### `generateMultiSourcePrompt(combinedText, sourceCount)`
Generate enhanced prompt for multi-source input.

**Parameters:**
- `combinedText` (string): Combined text from all sources
- `sourceCount` (number): Number of sources

**Returns:** `string` - Enhanced prompt instruction

## ImageUploader Component

### Props
```javascript
<ImageUploader
  onImageSelect={(files) => {}}  // Array of files or null
  selectedSubtest="tps_pu"
  selectedModel="gemini"
  onGenerate={() => {}}
  isGenerating={false}
/>
```

### File Object Structure
```javascript
{
  name: "document.pdf",
  type: "application/pdf",
  data: "data:application/pdf;base64,...",
  isImage: false,
  isPDF: true
}
```

## Usage in App.js

### Generate from Multiple Files
```javascript
const handleVisionGenerate = async (filesArray, subtestId, modelType) => {
  const questions = await generateQuestionsFromImage(
    filesArray,  // Array of file objects
    'TPS - Penalaran Umum',
    3,  // complexity
    'gemini',
    apiKey
  );
};
```

### Backward Compatibility
```javascript
// Still works with single base64 string
const questions = await generateQuestionsFromImage(
  'data:image/jpeg;base64,...',  // Single base64
  'TPS - Penalaran Umum',
  3,
  'gemini',
  apiKey
);
```

## Error Handling

### File Validation
```javascript
// Max file size: 5MB
if (file.size > 5 * 1024 * 1024) {
  alert('File terlalu besar (max 5MB)');
  return;
}

// Format validation
const isImage = file.type.startsWith('image/');
const isPDF = file.type === 'application/pdf';

if (!isImage && !isPDF) {
  alert('Format tidak didukung');
  return;
}
```

### Processing Errors
```javascript
try {
  const text = await extractTextFromPDF(pdfDataUrl);
  if (!text || text.length < 20) {
    // Fallback to MOCK_QUESTIONS
  }
} catch (error) {
  console.error('PDF extraction error:', error);
  return '';
}
```

## Performance Tips

1. **Parallel Processing**
   ```javascript
   const promises = files.map(file => extractText(file));
   const results = await Promise.all(promises);
   ```

2. **Token Economy**
   ```javascript
   // Clean text
   const cleaned = text
     .replace(/[^\w\s\d.,;:!?()\-+=\/*%$@#&]/g, '')
     .replace(/\s+/g, ' ')
     .trim();
   
   // Truncate
   const truncated = cleaned.slice(0, 8000);
   ```

3. **Progress Feedback**
   ```javascript
   processMultipleFiles(files, (current, total) => {
     setProgress(`${current}/${total} files processed`);
   });
   ```

## Testing

### Test Cases
```javascript
// 1. Single image (legacy)
await generateQuestionsFromImage('data:image/jpeg;base64,...', ...);

// 2. Multiple images
await generateQuestionsFromImage([file1, file2, file3], ...);

// 3. Single PDF
await generateQuestionsFromImage([pdfFile], ...);

// 4. Mixed (images + PDFs)
await generateQuestionsFromImage([img1, pdf1, img2], ...);
```

### Mock Data
```javascript
const mockFiles = [
  {
    name: 'test.jpg',
    type: 'image/jpeg',
    data: 'data:image/jpeg;base64,/9j/4AAQ...',
    isImage: true,
    isPDF: false
  }
];
```

## Common Issues

### Issue: PDF.js worker not found
**Solution:**
```javascript
import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc = 
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
```

### Issue: OCR returns empty text
**Solution:**
- Check image quality
- Ensure text is readable
- Try preprocessing (contrast/brightness)

### Issue: Token limit exceeded
**Solution:**
- Reduce max text length (8000 → 6000)
- Clean more aggressively
- Limit PDF pages (10 → 5)

## Debugging

### Enable Logging
```javascript
const { data: { text } } = await Tesseract.recognize(
  imageDataUrl,
  'ind+eng',
  { logger: m => console.log(m) }  // Enable logging
);
```

### Check Combined Text
```javascript
console.log('Combined text length:', combinedText.length);
console.log('Source count:', sourceCount);
console.log('First 500 chars:', combinedText.slice(0, 500));
```

---

**Last Updated**: 2025-01-XX  
**Version**: 1.0.0
