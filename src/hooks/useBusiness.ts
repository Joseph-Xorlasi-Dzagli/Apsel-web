import { useState, useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  getBusinessByOwnerId,
  getBusinessData,
  updateBusinessData,
  getBusinessContact,
  updateBusinessContact,
  getBusinessAddress,
  updateBusinessAddress,
} from "@/services/firestoreService";
import { convertFirestoreData } from "@/utils/dbUtils";

export function useBusiness() {
  const { currentUser } = useAuthContext();
  const { toast } = useToast();

  const [business, setBusiness] = useState<any>(null);
  const [businessContact, setBusinessContact] = useState<any>(null);
  const [businessAddress, setBusinessAddress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFirstTimeSetup, setIsFirstTimeSetup] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savingData, setSavingData] = useState(false);

  useEffect(() => {
    const fetchBusinessData = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Find the business associated with the current user
        const businessData = await getBusinessByOwnerId(currentUser.uid);

        // Check if this is the first time setup
        if (!businessData) {
          setIsFirstTimeSetup(true);
          setLoading(false);
          return;
        }

        const businessId = businessData.id;
        setBusiness(convertFirestoreData(businessData));

        // Fetch additional business data
        const [contactData, addressData] = await Promise.all([
          getBusinessContact(businessId),
          getBusinessAddress(businessId),
        ]);

        setBusinessContact(convertFirestoreData(contactData));
        setBusinessAddress(convertFirestoreData(addressData));
      } catch (err: any) {
        console.error("Error fetching business data:", err);
        setError(err.message);
        toast({
          title: "Error",
          description: "Failed to load business data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, [currentUser, toast]);

  const updateBusiness = async (data: any) => {
    if (!business || !business.id) {
      toast({
        title: "Error",
        description: "No business found to update",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateBusinessData(business.id, data);

      // Update local state
      setBusiness((prev) => ({
        ...prev,
        ...data,
      }));

      toast({
        title: "Success",
        description: "Business information updated",
      });

      return true;
    } catch (err: any) {
      console.error("Error updating business:", err);
      toast({
        title: "Error",
        description: "Failed to update business information",
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateContact = async (data: any) => {
    if (!business || !business.id) {
      toast({
        title: "Error",
        description: "No business found to update contact information",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateBusinessContact(business.id, data);

      // Update local state
      setBusinessContact((prev) => ({
        ...prev,
        ...data,
      }));

      toast({
        title: "Success",
        description: "Contact information updated",
      });

      return true;
    } catch (err: any) {
      console.error("Error updating business contact:", err);
      toast({
        title: "Error",
        description: "Failed to update contact information",
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateAddress = async (data: any) => {
    if (!business || !business.id) {
      toast({
        title: "Error",
        description: "No business found to update address",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateBusinessAddress(business.id, data);

      // Update local state
      setBusinessAddress((prev) => ({
        ...prev,
        ...data,
      }));

      toast({
        title: "Success",
        description: "Address information updated",
      });

      return true;
    } catch (err: any) {
      console.error("Error updating business address:", err);
      toast({
        title: "Error",
        description: "Failed to update address information",
        variant: "destructive",
      });
      throw err;
    }
  };

  const toggleBusinessStatus = async () => {
    if (!business || !business.id) {
      toast({
        title: "Error",
        description: "No business found to update status",
        variant: "destructive",
      });
      return;
    }

    try {
      const newStatus = !business.is_open;
      await updateBusinessData(business.id, { is_open: newStatus });

      // Update local state
      setBusiness((prev) => ({
        ...prev,
        is_open: newStatus,
      }));

      toast({
        title: "Success",
        description: `Business is now ${newStatus ? "open" : "closed"}`,
      });

      return true;
    } catch (err: any) {
      console.error("Error updating business status:", err);
      toast({
        title: "Error",
        description: "Failed to update business status",
        variant: "destructive",
      });
      throw err;
    }
  };

  const setupBusiness = async (businessData: any) => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to set up a business",
        variant: "destructive",
      });
      return null;
    }

    try {
      setSavingData(true);

      // Extract data for different collections
      const {
        // Business profile data
        name,
        industry,
        employee_count,
        bio,
        is_open = true,

        // Contact data
        manager,
        email,
        phone,

        // Address data
        street,
        country,
        state,
        postal_code,

        // Payment account data (simplified for this demo)
        account_holder,
        account_number,
        bank_name,

        ...otherData
      } = businessData;

      // 1. Create business record
      const businessProfileData = {
        owner_id: currentUser.uid,
        name,
        industry,
        employee_count,
        bio,
        is_open,
      };

      // Use the setupBusiness method from AuthContext
      const businessId = await currentUser.setupBusiness(businessProfileData);

      // 2. Create contact information
      if (manager || email || phone) {
        const contactData = {
          manager,
          email,
          phone,
        };
        await updateBusinessContact(businessId, contactData);
      }

      // 3. Create address information
      if (street || country || state || postal_code) {
        const addressData = {
          street,
          country,
          state,
          postal_code,
        };
        await updateBusinessAddress(businessId, addressData);
      }

      // Fetch the newly created business data
      const newBusinessData = await getBusinessData(businessId);
      const newBusiness = convertFirestoreData(newBusinessData);

      // Update local state
      setBusiness(newBusiness);
      setIsFirstTimeSetup(false);

      // Fetch additional business data
      const [contactData, addressData] = await Promise.all([
        getBusinessContact(businessId),
        getBusinessAddress(businessId),
      ]);

      setBusinessContact(convertFirestoreData(contactData));
      setBusinessAddress(convertFirestoreData(addressData));

      toast({
        title: "Success",
        description: "Business profile successfully created",
      });

      return businessId;
    } catch (err: any) {
      console.error("Error setting up business:", err);
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to set up business profile",
        variant: "destructive",
      });
      return null;
    } finally {
      setSavingData(false);
    }
  };

  return {
    business,
    businessContact,
    businessAddress,
    loading,
    error,
    isFirstTimeSetup,
    savingData,
    setSavingData,
    updateBusiness,
    updateContact,
    updateAddress,
    toggleBusinessStatus,
    setupBusiness,
  };
}
