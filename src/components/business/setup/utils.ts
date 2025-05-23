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

// Industry options
export const industries = [
  { value: "retail", label: "Retail" },
  { value: "restaurant", label: "Restaurant" },
  { value: "technology", label: "Technology" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "finance", label: "Finance" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "other", label: "Other" },
];

// Employee count options
export const employeeCounts = [
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201-500", label: "201-500 employees" },
  { value: "501-1000", label: "501-1000 employees" },
  { value: "1000+", label: "1000+ employees" },
];

// Banks
export const banks = [
  "GCB Bank",
  "Ecobank Ghana",
  "Standard Chartered Bank Ghana",
  "Absa Bank Ghana",
  "Fidelity Bank Ghana",
  "CAL Bank",
  "Agricultural Development Bank",
  "United Bank for Africa Ghana",
  "Zenith Bank Ghana",
  "Stanbic Bank Ghana",
  "Republic Bank Ghana",
  "First National Bank Ghana",
  "Access Bank Ghana",
  "Consolidated Bank Ghana",
];
