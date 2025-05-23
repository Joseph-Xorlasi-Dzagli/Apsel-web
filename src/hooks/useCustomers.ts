import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useBusiness } from "@/hooks/useBusiness";
import {
  getCustomersByBusiness,
  addCustomer,
  getCustomer,
  updateCustomer,
  deleteCustomer,
} from "@/services/firestoreService";
import { convertFirestoreData } from "@/utils/dbUtils";

export function useCustomers() {
  const { toast } = useToast();
  const { business, loading: businessLoading } = useBusiness();

  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [filteredCustomers, setFilteredCustomers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastVisible, setLastVisible] = useState<any | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // Fetch customers when business data is available
  useEffect(() => {
    const fetchCustomers = async () => {
      if (businessLoading || !business) return;

      try {
        setLoading(true);
        setError(null);

        const { customers: fetchedCustomers, lastDoc } =
          await getCustomersByBusiness(business.id);

        const processedCustomers = fetchedCustomers.map((customer) =>
          convertFirestoreData(customer)
        );

        setCustomers(processedCustomers);
        setFilteredCustomers(processedCustomers);
        setLastVisible(lastDoc);
        setHasMore(fetchedCustomers.length === 10); // Assuming pageSize is 10
      } catch (err: any) {
        console.error("Error fetching customers:", err);
        setError(err.message);
        toast({
          title: "Error",
          description: "Failed to load customers",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [business, businessLoading, toast]);

  // Handle search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCustomers(customers);
      return;
    }

    const filtered = customers.filter((customer) => {
      const query = searchQuery.toLowerCase();
      return (
        customer.name?.toLowerCase().includes(query) ||
        customer.email?.toLowerCase().includes(query) ||
        customer.phone?.toLowerCase().includes(query) ||
        customer.company?.toLowerCase().includes(query)
      );
    });

    setFilteredCustomers(filtered);
  }, [searchQuery, customers]);

  // Handle sorting
  useEffect(() => {
    const sorted = [...filteredCustomers].sort((a, b) => {
      const fieldA = a[sortField] || "";
      const fieldB = b[sortField] || "";

      if (typeof fieldA === "string" && typeof fieldB === "string") {
        return sortOrder === "asc"
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      }

      return sortOrder === "asc" ? fieldA - fieldB : fieldB - fieldA;
    });

    setFilteredCustomers(sorted);
  }, [sortField, sortOrder, customers, searchQuery]);

  // Load more customers
  const loadMoreCustomers = useCallback(async () => {
    if (!business || !lastVisible || !hasMore) return;

    try {
      setLoading(true);
      setError(null);

      const { customers: fetchedCustomers, lastDoc } =
        await getCustomersByBusiness(business.id, lastVisible);

      const processedCustomers = fetchedCustomers.map((customer) =>
        convertFirestoreData(customer)
      );

      setCustomers((prev) => [...prev, ...processedCustomers]);
      setLastVisible(lastDoc);
      setHasMore(fetchedCustomers.length === 10); // Assuming pageSize is 10
    } catch (err: any) {
      console.error("Error loading more customers:", err);
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to load more customers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [business, lastVisible, hasMore, toast]);

  // Handle adding a new customer
  const handleAddCustomer = async (customerData: any) => {
    if (!business) {
      toast({
        title: "Error",
        description: "Business data is required to add a customer",
        variant: "destructive",
      });
      return;
    }

    try {
      const customerId = await addCustomer(business.id, customerData);

      // Fetch the newly created customer to get the complete data
      const newCustomer = await getCustomer(customerId);

      if (newCustomer) {
        const processedCustomer = convertFirestoreData(newCustomer);

        // Update local state
        setCustomers((prev) => [processedCustomer, ...prev]);
        setSelectedCustomer(processedCustomer);

        toast({
          title: "Success",
          description: `${customerData.name} has been added to your customers.`,
        });

        return processedCustomer;
      }
    } catch (err: any) {
      console.error("Error adding customer:", err);
      toast({
        title: "Error",
        description: "Failed to add customer",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Handle updating a customer
  const handleUpdateCustomer = async (updatedCustomer: any) => {
    if (!updatedCustomer.id) {
      toast({
        title: "Error",
        description: "Customer ID is required for update",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateCustomer(updatedCustomer.id, updatedCustomer);

      // Update local state
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === updatedCustomer.id ? { ...c, ...updatedCustomer } : c
        )
      );

      setSelectedCustomer((prev) =>
        prev && prev.id === updatedCustomer.id
          ? { ...prev, ...updatedCustomer }
          : prev
      );

      toast({
        title: "Customer updated",
        description: `${updatedCustomer.name}'s information has been updated.`,
      });

      return updatedCustomer;
    } catch (err: any) {
      console.error("Error updating customer:", err);
      toast({
        title: "Error",
        description: "Failed to update customer",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Handle deleting a customer
  const handleDeleteCustomer = async (customerToDelete: any) => {
    if (!customerToDelete.id) {
      toast({
        title: "Error",
        description: "Customer ID is required for deletion",
        variant: "destructive",
      });
      return;
    }

    try {
      await deleteCustomer(customerToDelete.id);

      // Update local state
      setCustomers((prev) => prev.filter((c) => c.id !== customerToDelete.id));

      if (selectedCustomer && selectedCustomer.id === customerToDelete.id) {
        setSelectedCustomer(null);
      }

      toast({
        title: "Customer deleted",
        description: `${customerToDelete.name} has been removed from your customers.`,
        variant: "destructive",
      });
    } catch (err: any) {
      console.error("Error deleting customer:", err);
      toast({
        title: "Error",
        description: "Failed to delete customer",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Handle sorting
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return {
    customers,
    filteredCustomers,
    selectedCustomer,
    setSelectedCustomer,
    searchQuery,
    setSearchQuery,
    sortField,
    sortOrder,
    loading,
    error,
    hasMore,
    handleSort,
    loadMoreCustomers,
    handleAddCustomer,
    handleUpdateCustomer,
    handleDeleteCustomer,
  };
}
