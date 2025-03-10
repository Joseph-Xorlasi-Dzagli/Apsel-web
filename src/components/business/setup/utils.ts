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
