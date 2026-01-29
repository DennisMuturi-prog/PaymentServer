export function validateKenyanPhoneNumber(phoneNumber) {
  // Remove spaces
  let cleaned = phoneNumber.replace(/\s+/g, '');
  
  // If starts with 0, remove it
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }
  
  // If starts with 254, remove it
  if (cleaned.startsWith('254')) {
    cleaned = cleaned.substring(3);
  }
  
  // Kenyan phone numbers: 7 or 1, then 8 more digits
  const kenyanPhoneRegex = /^(7|1)\d{8}$/;
  return kenyanPhoneRegex.test(cleaned);
}

export function normalizeKenyanPhoneNumber(phoneNumber) {
  // Remove spaces
  let cleaned = phoneNumber.replace(/\s+/g, '');
  
  // If starts with 0, remove it
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }
  
  // If doesn't start with 254, add it
  if (!cleaned.startsWith('254')) {
    cleaned = cleaned.substring(3);;
  }
  
  return cleaned;
}

module.exports = { validateKenyanPhoneNumber, normalizeKenyanPhoneNumber };