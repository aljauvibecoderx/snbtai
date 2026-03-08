# JSON Parsing Quick Reference Guide

## 🚨 Common Error Patterns

### 1. "Unexpected token" Error
**Cause**: Unescaped quotes in string
```javascript
// ❌ WRONG
"text": "He said "hello" to me"

// ✅ CORRECT
"text": "He said \\"hello\\" to me"
```

### 2. "Bad escaped character" Error
**Cause**: Single backslash in LaTeX
```javascript
// ❌ WRONG
"formula": "$\\frac{a}{b}$"

// ✅ CORRECT
"formula": "$\\\\frac{a}{b}$"
```

### 3. "Unexpected end of JSON" Error
**Cause**: Trailing comma
```javascript
// ❌ WRONG
{
  "options": ["A", "B", "C",],
  "correctIndex": 0,
}

// ✅ CORRECT
{
  "options": ["A", "B", "C"],
  "correctIndex": 0
}
```

### 4. "Invalid character" Error
**Cause**: Newline in string
```javascript
// ❌ WRONG
"text": "Line 1
Line 2"

// ✅ CORRECT
"text": "Line 1\\nLine 2"
```

## 🔧 Quick Fixes

### Fix 1: Escape Quotes
```javascript
text = text.replace(/([^\\])"([^":,\]\}\n]*?)"([^:,\[\{])/g, '$1\\"$2\\"$3');
```

### Fix 2: Double LaTeX Backslashes
```javascript
text = text.replace(/\$([^$]+)\$/g, (match, latex) => {
  const fixed = latex.replace(/\\(?!\\)/g, '\\\\');
  return `$${fixed}$`;
});
```

### Fix 3: Remove Trailing Commas
```javascript
text = text.replace(/,\s*([\]}])/g, '$1');
```

### Fix 4: Clean HTML Entities
```javascript
text = text.replace(/&amp;/g, '&')
           .replace(/&lt;/g, '<')
           .replace(/&gt;/g, '>');
```

### Fix 5: Remove Control Characters
```javascript
text = text.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
```

## 📋 Validation Checklist

Before sending JSON to parser:
- [ ] All quotes inside strings are escaped with `\"`
- [ ] All LaTeX backslashes are doubled `\\`
- [ ] No trailing commas in arrays/objects
- [ ] No physical newlines in strings (use `\n`)
- [ ] No HTML entities (`&quot;`, `&amp;`, etc.)
- [ ] Balanced brackets `{}` and `[]`
- [ ] Valid JSON structure

## 🎯 AI Prompt Template

Add this to AI prompts:

```
CRITICAL JSON RULES:
1. Escape quotes: "He said \\"hello\\""
2. Double backslash: $\\\\frac{a}{b}$
3. No trailing commas
4. Use \\n for newlines
5. Output ONLY valid JSON

VALIDATE before output:
✓ All quotes escaped
✓ All backslashes doubled
✓ No trailing commas
✓ Valid JSON structure
```

## 🐛 Debugging Steps

1. **Check Console Log**
   ```javascript
   console.error('Problematic JSON:', text.substring(0, 1000));
   ```

2. **Find Error Position**
   ```javascript
   const position = parseError.message.match(/position (\d+)/)?.[1];
   console.log('Error at:', text.substring(position - 50, position + 50));
   ```

3. **Validate JSON Online**
   - Copy problematic JSON
   - Paste to: https://jsonlint.com/
   - Check error details

4. **Test Regex Fixes**
   ```javascript
   // Test in console
   let test = '"text": "He said "hello""';
   test = test.replace(/([^\\])"([^":,\]\}\n]*?)"([^:,\[\{])/g, '$1\\"$2\\"$3');
   console.log(test); // Should show escaped quotes
   ```

## 📊 Error Rate Monitoring

Track these metrics:
- Total generations per day
- Parse errors per day
- Error rate percentage
- Most common error types

```javascript
// Add to code
const errorStats = {
  total: 0,
  errors: 0,
  errorTypes: {}
};

// On error
errorStats.errors++;
errorStats.errorTypes[error.name] = (errorStats.errorTypes[error.name] || 0) + 1;

// Log daily
console.log('Error Rate:', (errorStats.errors / errorStats.total * 100).toFixed(2) + '%');
```

## 🚀 Performance Tips

1. **Cache Regex Patterns**
   ```javascript
   const QUOTE_REGEX = /([^\\])"([^":,\]\}\n]*?)"([^:,\[\{])/g;
   const LATEX_REGEX = /\$([^$]+)\$/g;
   ```

2. **Early Return on Valid JSON**
   ```javascript
   try {
     return JSON.parse(text);
   } catch {
     // Only clean if parse fails
     text = cleanJSON(text);
     return JSON.parse(text);
   }
   ```

3. **Limit Retry Attempts**
   ```javascript
   let attempts = 0;
   while (attempts < 3) {
     try {
       return JSON.parse(text);
     } catch {
       text = cleanJSON(text);
       attempts++;
     }
   }
   ```

## 📞 Support

If issues persist:
1. Check `JSON_PARSING_FIX.md` for detailed info
2. Run `test-json-parsing.js` for validation
3. Check console logs for patterns
4. Contact dev team with error logs

---

**Quick Access**: Keep this file bookmarked for fast reference during debugging.
