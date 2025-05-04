// Format card number with spaces
export const formatCardNumber = (value: string) => {
  const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  const matches = v.match(/\d{4,16}/g);
  const match = (matches && matches[0]) || "";
  const parts = [];

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }

  if (parts.length) {
    return parts.join(" ");
  } else {
    return value;
  }
};

// Generate a valid business email
export const generateBusinessEmail = (businessName: string = "business") => {
  const sanitizedName = businessName.toLowerCase().replace(/[^a-z0-9]/g, "");
  return `contact@${sanitizedName}.com`;
};

export const formatPhoneNumber = (value: string) => {
  // Remove all non-numeric characters
  const phoneNumber = value.replace(/\D/g, "");

  // Format as (XXX) XXX-XXXX for US numbers
  if (phoneNumber.length >= 10) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
      3,
      6
    )}-${phoneNumber.slice(6, 10)}`;
  }

  return value;
};

// Validate email format
export const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
