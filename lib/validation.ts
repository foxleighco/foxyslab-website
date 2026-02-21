// Email validation utility
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Sanitize input to prevent XSS
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, "").substring(0, 255); // Limit length
}
