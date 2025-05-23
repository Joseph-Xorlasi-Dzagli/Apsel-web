// utils/date.ts - Simple date utility

/**
 * Format a date safely, handling various input types
 * Returns a fallback string for invalid dates
 */
export const formatDate = (input: any, fallback = "N/A"): string => {
  if (!input) return fallback;

  try {
    let date: Date | null = null;

    // Handle different types of date inputs
    if (input instanceof Date) {
      date = input;
    }
    // Firestore Timestamp
    else if (typeof input.toDate === "function") {
      date = input.toDate();
    }
    // Timestamp-like object
    else if (input.seconds !== undefined) {
      date = new Date(input.seconds * 1000);
    }
    // String
    else if (typeof input === "string") {
      date = new Date(input);
    }
    // Number (timestamp)
    else if (typeof input === "number") {
      date = new Date(input);
    }

    // Check if date is valid
    if (!date || isNaN(date.getTime())) {
      return fallback;
    }

    // Use built-in formatter for simplicity
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    console.error("Date formatting error:", error);
    return fallback;
  }
};

/**
 * Format a date with time
 */
export const formatDateTime = (input: any, fallback = "N/A"): string => {
  if (!input) return fallback;

  try {
    let date: Date | null = null;

    // Convert to Date using same logic as formatDate
    if (input instanceof Date) {
      date = input;
    } else if (typeof input.toDate === "function") {
      date = input.toDate();
    } else if (input.seconds !== undefined) {
      date = new Date(input.seconds * 1000);
    } else if (typeof input === "string") {
      date = new Date(input);
    } else if (typeof input === "number") {
      date = new Date(input);
    }

    if (!date || isNaN(date.getTime())) {
      return fallback;
    }

    // Format with date and time
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("DateTime formatting error:", error);
    return fallback;
  }
};

/**
 * Check if a date is valid
 */
export const isValidDate = (input: any): boolean => {
  if (!input) return false;

  try {
    let date: Date | null = null;

    if (input instanceof Date) {
      date = input;
    } else if (typeof input.toDate === "function") {
      date = input.toDate();
    } else if (input.seconds !== undefined) {
      date = new Date(input.seconds * 1000);
    } else if (typeof input === "string") {
      date = new Date(input);
    } else if (typeof input === "number") {
      date = new Date(input);
    }

    return !!(date && !isNaN(date.getTime()));
  } catch {
    return false;
  }
};
