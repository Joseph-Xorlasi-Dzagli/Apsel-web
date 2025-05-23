// src/utils/firebase-formatters.ts
// Simple utility functions specifically for Firebase data

import { Timestamp } from "firebase/firestore";

/**
 * Safely formats a Firebase timestamp or any date-like value
 * Specifically handles Firebase Timestamp objects
 */
export const formatFirebaseDate = (
  timestamp: any,
  defaultValue = "N/A"
): string => {
  try {
    let date: Date | null = null;

    // Case 1: Firebase Timestamp object
    if (timestamp instanceof Timestamp) {
      date = timestamp.toDate();
    }
    // Case 2: Object with toDate() method (Firestore timestamp)
    else if (timestamp && typeof timestamp.toDate === "function") {
      date = timestamp.toDate();
    }
    // Case 3: Object with seconds and nanoseconds (Firestore timestamp-like)
    else if (
      timestamp &&
      "seconds" in timestamp &&
      "nanoseconds" in timestamp
    ) {
      const seconds = Number(timestamp.seconds);
      const nanoseconds = Number(timestamp.nanoseconds);
      if (!isNaN(seconds)) {
        date = new Date(seconds * 1000 + nanoseconds / 1000000);
      }
    }
    // Case 4: Already a Date object
    else if (timestamp instanceof Date) {
      date = timestamp;
    }
    // Case 5: ISO string
    else if (typeof timestamp === "string") {
      date = new Date(timestamp);
    }
    // Case 6: Timestamp number
    else if (typeof timestamp === "number") {
      date = new Date(timestamp);
    }

    // Check if we have a valid date
    if (!date || isNaN(date.getTime())) {
      return defaultValue;
    }

    // Format the date (simple locale format)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch (error) {
    console.error("Error formatting Firebase timestamp:", error);
    return defaultValue;
  }
};

/**
 * Safely formats a number with fixed decimal places
 * Handles undefined/null values
 */
export const formatNumber = ( 
  value: any,
  decimals = 2,
  defaultValue = "0.00"
): string => {
  if (value == null) return defaultValue;

  const number = typeof value === "number" ? value : Number(value);
  if (isNaN(number)) return defaultValue;

  try {
    return number.toFixed(decimals);
  } catch (error) {
    console.error("Error formatting number:", error);
    return defaultValue;
  }
};

/**
 * Formats a currency value with GHS prefix 
 */
export const formatCurrency = (value: any, decimals = 2): string => {
  return "GHS " + formatNumber(value, decimals); 
};

/**
 * Safely convert a Firebase document to a plain object
 * Converts timestamps to Date objects
 */
export const convertFirebaseDoc = (doc: any): any => { 
  if (!doc) return null;

  // If it's a Firebase document snapshot with data() method
  if (doc.data && typeof doc.data === "function") {
    return {
      id: doc.id,
      ...convertFirebaseDoc(doc.data()),
    };
  }

  // Handle plain objects (including those from doc.data())
  if (typeof doc === "object" && !Array.isArray(doc)) {
    const result: Record<string, any> = {};

    Object.entries(doc).forEach(([key, value]) => {
      // Skip undefined values
      if (value === undefined) return;

      // Convert Firestore Timestamp to Date
      if (value instanceof Timestamp) {
        result[key] = value.toDate();
      }
      // Convert Timestamp-like objects
      else if (
        value &&
        typeof value === "object" &&
        "seconds" in value &&
        "nanoseconds" in value
      ) {
        const seconds = Number(value.seconds);
        const nanoseconds = Number(value.nanoseconds);
        if (!isNaN(seconds)) {
          result[key] = new Date(seconds * 1000 + nanoseconds / 1000000);
        } else {
          result[key] = value;
        }
      }
      // Recursively convert nested objects
      else if (value && typeof value === "object" && !Array.isArray(value)) {
        result[key] = convertFirebaseDoc(value);
      }
      // Recursively convert arrays
      else if (Array.isArray(value)) {
        result[key] = value.map((item) => {
          if (item && typeof item === "object") {
            return convertFirebaseDoc(item);
          }
          return item;
        });
      }
      // Use value as is
      else {
        result[key] = value;
      }
    });

    return result;
  }

  // Return non-object values as is
  return doc;
};


import { z } from "zod";

// Function to validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Form validation schema for customer data
export const customerFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .refine(isValidEmail, { message: "Invalid email address" }),
  phone: z.string().min(7, "Phone number must be at least 7 digits"),
  company: z.string().min(1, "Company name is required"),
  location: z.string().min(1, "Location is required"),
  status: z.enum(["active", "inactive", "pending"]),
  notes: z.string().optional(),
});

export type CustomerFormValues = z.infer<typeof customerFormSchema>;

// Function to format phone number as user types
export const formatPhoneNumber = (value: string): string => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');
  
  // Format the phone number 
  if (digits.length <= 3) {
    return digits;
  } else if (digits.length <= 6) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  } else {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }
};