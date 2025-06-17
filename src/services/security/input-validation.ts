
import DOMPurify from 'dompurify';

export class InputValidationService {
  
  // Sanitize HTML content to prevent XSS attacks
  static sanitizeHtml(input: string): string {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
      ALLOWED_ATTR: []
    });
  }

  // Sanitize plain text input
  static sanitizeText(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }

  // Validate email format
  static validateEmail(email: string): { isValid: boolean; error?: string } {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const sanitized = this.sanitizeText(email);
    
    if (!emailRegex.test(sanitized)) {
      return { isValid: false, error: 'Invalid email format' };
    }
    
    if (sanitized.length > 254) {
      return { isValid: false, error: 'Email too long' };
    }
    
    return { isValid: true };
  }

  // Enhanced password validation
  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 12) {
      errors.push('Password must be at least 12 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    // Check for common weak passwords
    const commonPasswords = [
      'password123', '123456789', 'qwerty123', 'admin123',
      'password1234', 'welcome123', 'letmein123'
    ];
    
    if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
      errors.push('Password contains common patterns and is not secure');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validate age/birth year with complete validation
  static validateBirthYear(birthYear: string): { isValid: boolean; error?: string; age?: number } {
    const sanitized = this.sanitizeText(birthYear);
    const year = parseInt(sanitized, 10);
    const currentYear = new Date().getFullYear();
    
    if (isNaN(year)) {
      return { isValid: false, error: 'Please enter a valid year' };
    }
    
    if (year < 1900 || year > currentYear) {
      return { isValid: false, error: 'Please enter a valid birth year' };
    }
    
    const age = currentYear - year;
    
    if (age < 13) {
      return { isValid: false, error: 'You must be at least 13 years old to use this service' };
    }
    
    if (age > 120) {
      return { isValid: false, error: 'Please enter a valid birth year' };
    }
    
    return { isValid: true, age };
  }

  // Validate trail names and descriptions
  static validateTrailContent(content: string, maxLength: number = 500): { isValid: boolean; error?: string; sanitized: string } {
    const sanitized = this.sanitizeHtml(content);
    
    if (sanitized.length === 0) {
      return { isValid: false, error: 'Content cannot be empty', sanitized };
    }
    
    if (sanitized.length > maxLength) {
      return { isValid: false, error: `Content must be less than ${maxLength} characters`, sanitized };
    }
    
    // Check for spam patterns
    const spamPatterns = [
      /(.)\1{10,}/, // Repeated characters
      /https?:\/\/[^\s]+/gi, // URLs (for descriptions where not allowed)
      /\b(viagra|casino|poker|lottery)\b/gi // Common spam terms
    ];
    
    if (spamPatterns.some(pattern => pattern.test(sanitized))) {
      return { isValid: false, error: 'Content contains inappropriate or spam-like patterns', sanitized };
    }
    
    return { isValid: true, sanitized };
  }

  // Validate coordinates for trails and locations
  static validateCoordinates(lat: number, lng: number): { isValid: boolean; error?: string } {
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return { isValid: false, error: 'Coordinates must be numbers' };
    }
    
    if (lat < -90 || lat > 90) {
      return { isValid: false, error: 'Latitude must be between -90 and 90' };
    }
    
    if (lng < -180 || lng > 180) {
      return { isValid: false, error: 'Longitude must be between -180 and 180' };
    }
    
    return { isValid: true };
  }

  // Rate limiting check with enhanced logic
  static checkRateLimit(identifier: string, action: string, maxAttempts: number = 5, windowMs: number = 900000): { allowed: boolean; retryAfter?: number } {
    try {
      const key = `rate_limit_${action}_${identifier}`;
      const stored = localStorage.getItem(key);
      const now = Date.now();
      
      if (!stored) {
        localStorage.setItem(key, JSON.stringify({ count: 1, firstAttempt: now, lastAttempt: now }));
        return { allowed: true };
      }
      
      const { count, firstAttempt, lastAttempt } = JSON.parse(stored);
      
      // Reset if window has passed
      if (now - firstAttempt > windowMs) {
        localStorage.setItem(key, JSON.stringify({ count: 1, firstAttempt: now, lastAttempt: now }));
        return { allowed: true };
      }
      
      // Check if we're over the limit
      if (count >= maxAttempts) {
        const retryAfter = Math.ceil((firstAttempt + windowMs - now) / 1000);
        return { allowed: false, retryAfter };
      }
      
      // Increment counter
      localStorage.setItem(key, JSON.stringify({ count: count + 1, firstAttempt, lastAttempt: now }));
      return { allowed: true };
      
    } catch (error) {
      console.warn('Rate limiting check failed:', error);
      return { allowed: true }; // Fail open for availability
    }
  }
}
