import { Timestamp } from "firebase/firestore";

/**
 * Converts Firestore Timestamp objects to JavaScript Date objects
 * and removes undefined fields from the data object
 */
export const convertFirestoreData = (data: any): any => {
  if (!data) return data;

  const result: any = {};

  Object.entries(data).forEach(([key, value]) => {
    // Skip undefined values
    if (value === undefined) return;

    // Convert Timestamp to Date
    if (value instanceof Timestamp) {
      result[key] = value.toDate();
    }
    // Recursively convert nested objects
    else if (value && typeof value === "object" && !Array.isArray(value)) {
      result[key] = convertFirestoreData(value);
    }
    // Recursively convert array items
    else if (Array.isArray(value)) {
      result[key] = value.map((item) =>
        item && typeof item === "object" ? convertFirestoreData(item) : item
      );
    }
    // Use value as is
    else {
      result[key] = value;
    }
  });

  return result;
};

/**
 * Prepares data for Firestore by removing undefined fields
 * and ensuring certain fields are not null
 */
export const prepareDataForFirestore = (data: any): any => {
  if (!data) return data;

  const result: any = {};

  Object.entries(data).forEach(([key, value]) => {
    // Skip undefined values
    if (value === undefined) return;

    // Replace null with empty string for string fields
    if (
      value === null &&
      ["name", "email", "phone", "description", "notes"].includes(key)
    ) {
      result[key] = "";
    }
    // Handle nested objects
    else if (value && typeof value === "object" && !Array.isArray(value)) {
      result[key] = prepareDataForFirestore(value);
    }
    // Handle arrays
    else if (Array.isArray(value)) {
      result[key] = value.map((item) =>
        item && typeof item === "object" ? prepareDataForFirestore(item) : item
      );
    }
    // Use value as is
    else {
      result[key] = value;
    }
  });

  return result;
};

/**
 * Transforms API data model to Firestore data model
 */
export const transformToFirestoreModel = (
  data: any,
  modelType: string
): any => {
  if (!data) return data;

  const result = { ...data };

  // Map generic fields to their Firestore equivalents
  const fieldMappings: Record<string, string> = {
    id: "id", // Keep ID as is
    createdAt: "created_at",
    updatedAt: "updated_at",
    userId: "user_id",
    businessId: "business_id",
    customerId: "customer_id",
    productId: "product_id",
    categoryId: "category_id",
    orderId: "order_id",
  };

  // Specific model mappings
  if (modelType === "customer") {
    Object.assign(fieldMappings, {
      fullName: "name",
      phoneNumber: "phone",
    });
  }

  if (modelType === "product") {
    Object.assign(fieldMappings, {
      productName: "name",
      productDescription: "description",
      productPrice: "price",
    });
  }

  // Apply mappings
  Object.entries(fieldMappings).forEach(([apiField, firestoreField]) => {
    if (apiField in data) {
      result[firestoreField] = data[apiField];
      if (apiField !== firestoreField) {
        delete result[apiField];
      }
    }
  });

  return prepareDataForFirestore(result);
};

/**
 * Transforms Firestore data model to API data model
 */
export const transformFromFirestoreModel = (
  data: any,
  modelType: string
): any => {
  if (!data) return data;

  const convertedData = convertFirestoreData(data);
  const result = { ...convertedData };

  // Map Firestore fields to their API equivalents
  const fieldMappings: Record<string, string> = {
    id: "id", // Keep ID as is
    created_at: "createdAt",
    updated_at: "updatedAt",
    user_id: "userId",
    business_id: "businessId",
    customer_id: "customerId",
    product_id: "productId",
    category_id: "categoryId",
    order_id: "orderId",
  };

  // Specific model mappings
  if (modelType === "customer") {
    Object.assign(fieldMappings, {
      name: "fullName",
      phone: "phoneNumber",
    });
  }

  if (modelType === "product") {
    Object.assign(fieldMappings, {
      name: "productName",
      description: "productDescription",
      price: "productPrice",
    });
  }

  // Apply mappings
  Object.entries(fieldMappings).forEach(([firestoreField, apiField]) => {
    if (firestoreField in convertedData) {
      result[apiField] = convertedData[firestoreField];
      if (apiField !== firestoreField) {
        delete result[firestoreField];
      }
    }
  });

  return result;
};
