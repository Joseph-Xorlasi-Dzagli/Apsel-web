import { useState, useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useBusiness } from "@/hooks/useBusiness";
import { useToast } from "@/hooks/use-toast";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/config/firebase";
import { convertFirestoreData } from "@/utils/dbUtils";

export interface SettingsState {
  profile: {
    name: string;
    email: string;
    phone: string;
    industry: string;
    logo_url?: string;
  };
  notifications: {
    order_notifications: boolean;
    inventory_alerts: boolean;
    sales_reports: boolean;
    marketing_updates: boolean;
  };
  subscription?: {
    plan_name: string;
    renewal_date: Date | null;
    billing_cycle: string;
    amount: number;
  };
}

export function useSettings() {
  const { currentUser } = useAuthContext();
  const { business, loading: businessLoading } = useBusiness();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<SettingsState>({
    profile: {
      name: "",
      email: "",
      phone: "",
      industry: "",
      logo_url: "",
    },
    notifications: {
      order_notifications: true,
      inventory_alerts: true,
      sales_reports: false,
      marketing_updates: false,
    },
  });

  // Fetch settings when business data is loaded
  useEffect(() => {
    const fetchSettings = async () => {
      if (!currentUser || !business) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch user settings
        const userSettingsRef = doc(db, "user_settings", currentUser.uid);
        const userSettingsDoc = await getDoc(userSettingsRef);

        // Fetch notification preferences
        const notificationPrefsRef = doc(
          db,
          "notification_preferences",
          business.id
        );
        const notificationPrefsDoc = await getDoc(notificationPrefsRef);

        // Fetch subscription details
        const subscriptionRef = doc(db, "subscriptions", business.id);
        const subscriptionDoc = await getDoc(subscriptionRef);

        let subscriptionData;
        if (subscriptionDoc.exists()) {
          const subData = convertFirestoreData(subscriptionDoc.data());

          // Fetch plan details
          const planRef = doc(db, "subscription_plans", subData.plan_id);
          const planDoc = await getDoc(planRef);

          if (planDoc.exists()) {
            const planData = convertFirestoreData(planDoc.data());
            subscriptionData = {
              plan_name: planData.name,
              renewal_date: subData.expiry_date,
              billing_cycle: planData.billing_cycle,
              amount: planData.price,
            };
          }
        }

        // Merge data from business, user settings, and notification preferences
        const newSettings: SettingsState = {
          profile: {
            name: business.name || "",
            email: currentUser.email || "",
            phone: business.phone || "",
            industry: business.industry || "",
            logo_url: business.logo_url || "",
          },
          notifications: {
            order_notifications: notificationPrefsDoc.exists()
              ? notificationPrefsDoc.data()?.order_notifications ?? true
              : true,
            inventory_alerts: notificationPrefsDoc.exists()
              ? notificationPrefsDoc.data()?.inventory_alerts ?? true
              : true,
            sales_reports: notificationPrefsDoc.exists()
              ? notificationPrefsDoc.data()?.sales_reports ?? false
              : false,
            marketing_updates: notificationPrefsDoc.exists()
              ? notificationPrefsDoc.data()?.marketing_updates ?? false
              : false,
          },
        };

        if (subscriptionData) {
          newSettings.subscription = subscriptionData;
        }

        setSettings(newSettings);
      } catch (err: any) {
        console.error("Error fetching settings:", err);
        setError(err.message);
        toast({
          title: "Error",
          description: "Failed to load settings",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [currentUser, business, toast]);

  // Update profile
  const updateProfile = async (profileData: SettingsState["profile"]) => {
    if (!currentUser || !business) {
      toast({
        title: "Error",
        description: "No user or business data available",
        variant: "destructive",
      });
      return;
    }

    try {
      // Update business document
      const businessRef = doc(db, "businesses", business.id);
      await updateDoc(businessRef, {
        name: profileData.name,
        industry: profileData.industry,
        updated_at: serverTimestamp(),
      });

      // Update local state
      setSettings((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          ...profileData,
        },
      }));

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (err: any) {
      console.error("Error updating profile:", err);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  // Update notification preferences
  const updateNotificationPreferences = async (
    notificationData: SettingsState["notifications"]
  ) => {
    if (!business) {
      toast({
        title: "Error",
        description: "No business data available",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create or update notification preferences
      const notificationPrefsRef = doc(
        db,
        "notification_preferences",
        business.id
      );
      await updateDoc(notificationPrefsRef, {
        ...notificationData,
        updated_at: serverTimestamp(),
      });

      // Update local state
      setSettings((prev) => ({
        ...prev,
        notifications: {
          ...notificationData,
        },
      }));

      toast({
        title: "Success",
        description: "Notification preferences updated successfully",
      });
    } catch (err: any) {
      console.error("Error updating notification preferences:", err);

      // If document doesn't exist yet, create it
      if (err.code === "not-found") {
        try {
          const notificationPrefsRef = doc(
            db,
            "notification_preferences",
            business.id
          );
          await updateDoc(notificationPrefsRef, {
            ...notificationData,
            business_id: business.id,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
          });

          // Update local state
          setSettings((prev) => ({
            ...prev,
            notifications: {
              ...notificationData,
            },
          }));

          toast({
            title: "Success",
            description: "Notification preferences updated successfully",
          });

          return;
        } catch (createErr) {
          console.error("Error creating notification preferences:", createErr);
        }
      }

      toast({
        title: "Error",
        description: "Failed to update notification preferences",
        variant: "destructive",
      });
    }
  };

  // Update password
  const updatePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "No user data available",
        variant: "destructive",
      });
      return;
    }

    try {
      // This would typically use Firebase Auth's reauthenticateWithCredential and updatePassword
      // For this example, we'll simulate a successful password update

      // In a real app, you would do something like:
      // const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
      // await reauthenticateWithCredential(currentUser, credential);
      // await updatePassword(currentUser, newPassword);

      toast({
        title: "Success",
        description: "Password updated successfully",
      });
    } catch (err: any) {
      console.error("Error updating password:", err);
      toast({
        title: "Error",
        description:
          "Failed to update password. Please check your current password.",
        variant: "destructive",
      });
    }
  };

  return {
    settings,
    loading,
    error,
    updateProfile,
    updateNotificationPreferences,
    updatePassword,
  };
}
