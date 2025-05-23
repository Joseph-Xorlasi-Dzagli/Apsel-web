import { db } from "@/config/firebase";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

/**
 * This utility function initializes the required Firestore collections for the notifications
 * and settings pages. It creates the necessary documents if they don't exist.
 *
 * @param {string} businessId - The ID of the current business
 * @param {string} userId - The ID of the current user
 */
export const initializeCollections = async (
  businessId: string,
  userId: string
) => {
  try {
    // Check if notification_preferences collection exists for this business
    const notificationPrefsRef = doc(
      db,
      "notification_preferences",
      businessId
    );
    const notificationPrefsDoc = await getDoc(notificationPrefsRef);

    // If it doesn't exist, create it with default values
    if (!notificationPrefsDoc.exists()) {
      await setDoc(notificationPrefsRef, {
        business_id: businessId,
        order_notifications: true,
        inventory_alerts: true,
        sales_reports: false,
        marketing_updates: false,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
      console.log("Notification preferences initialized");
    }

    // Check if user_settings collection exists for this user
    const userSettingsRef = doc(db, "user_settings", userId);
    const userSettingsDoc = await getDoc(userSettingsRef);

    // If it doesn't exist, create it with default values
    if (!userSettingsDoc.exists()) {
      await setDoc(userSettingsRef, {
        user_id: userId,
        business_id: businessId,
        theme: "light",
        language: "en",
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
      console.log("User settings initialized");
    }

    return true;
  } catch (error) {
    console.error("Error initializing collections:", error);
    return false;
  }
};

/**
 * This utility function creates a sample notification for testing purposes
 *
 * @param {string} businessId - The ID of the current business
 */
export const createSampleNotifications = async (businessId: string) => {
  try {
    // Create sample order notification
    const orderNotificationRef = doc(collection(db, "order_notifications"));
    await setDoc(orderNotificationRef, {
      business_id: businessId,
      title: "New Order Received",
      message: "You have received a new order #ORD-12345 for $125.99",
      type: "order",
      is_read: false,
      created_at: serverTimestamp(),
    });

    // Create sample inventory notification
    const inventoryNotificationRef = doc(collection(db, "order_notifications"));
    await setDoc(inventoryNotificationRef, {
      business_id: businessId,
      title: "Low Stock Alert",
      message: "Wireless Headphones is running low on stock (Only 3 left)",
      type: "inventory",
      is_read: false,
      created_at: serverTimestamp(),
    });

    // Create sample system notification
    const systemNotificationRef = doc(collection(db, "order_notifications"));
    await setDoc(systemNotificationRef, {
      business_id: businessId,
      title: "System Maintenance",
      message: "Scheduled maintenance will occur tomorrow at 2:00 AM UTC",
      type: "system",
      is_read: true,
      created_at: serverTimestamp(),
    });

    // Create sample promotion notification
    const promotionNotificationRef = doc(collection(db, "order_notifications"));
    await setDoc(promotionNotificationRef, {
      business_id: businessId,
      title: "Flash Sale Starting",
      message: "Your scheduled 24-hour flash sale starts tomorrow",
      type: "promotion",
      is_read: true,
      created_at: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error("Error creating sample notifications:", error);
    return false;
  }
};
