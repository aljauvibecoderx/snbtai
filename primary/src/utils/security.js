// Security utilities for input sanitization
// SNBT AI - Competition

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

export const sanitizeContext = (context) => {
  if (!context || typeof context !== 'string') return '';
  
  const maxLength = 500;
  const sanitized = sanitizeInput(context);
  return sanitized.slice(0, maxLength);
};

export const validateApiKey = (key) => {
  if (!key || typeof key !== 'string') return false;
  return key.length > 10 && key.length < 200;
};

export const rateLimit = {
  attempts: new Map(),
  
  check: (userId, limit = 5, windowMs = 60000) => {
    const now = Date.now();
    const userAttempts = rateLimit.attempts.get(userId) || [];
    
    const recentAttempts = userAttempts.filter(time => now - time < windowMs);
    
    if (recentAttempts.length >= limit) {
      return false;
    }
    
    recentAttempts.push(now);
    rateLimit.attempts.set(userId, recentAttempts);
    return true;
  },
  
  reset: (userId) => {
    rateLimit.attempts.delete(userId);
  }
};

export default { sanitizeInput, sanitizeContext, validateApiKey, rateLimit };
