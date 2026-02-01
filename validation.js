function validateKenyanPhoneNumber(phoneNumber) {
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
  if (cleaned.startsWith('+254')) {
    cleaned = cleaned.substring(4);
  }
  
  // Kenyan phone numbers: 7 or 1, then 8 more digits
  const kenyanPhoneRegex = /^(7|1)\d{8}$/;
  return kenyanPhoneRegex.test(cleaned);
}

function normalizeKenyanPhoneNumber(phoneNumber) {
  // Remove spaces
  let cleaned = phoneNumber.replace(/\s+/g, '');
  
  // If starts with 0, remove it
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }
  
  
  if (cleaned.startsWith('254')) {
    cleaned = cleaned.substring(3);;
  }
  if (cleaned.startsWith('+254')) {
    cleaned = cleaned.substring(4);;
  }
  
  return cleaned;
}

module.exports = { validateKenyanPhoneNumber, normalizeKenyanPhoneNumber };