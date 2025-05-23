import { useState, useEffect, useCallback } from "react";
import { useToast } from "../hooks/use-toast";
import { useBusiness } from "../hooks/useBusiness";
import {
  getCustomersByBusiness,
  addCustomer,
  getCustomer,
  updateCustomer,
  deleteCustomer,
} from "../services/firestoreService";
import { convertFirestoreData } from "../utils/dbUtils";
import { CustomerType } from "../lib/data";

export function useCustomersData() {
  const { toast } = useToast();
  const { business, loading: businessLoading } = useBusiness();

  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerType[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerType | null>(
    null
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortField, setSortField] = useState<keyof CustomerType>("name");
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastVisible, setLastVisible] = useState<any | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // Fetch customers when business data is available
  useEffect(() => {
    const fetchCustomers = async () => {
      if (businessLoading || !business) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { customers: fetchedCustomers, lastDoc } =
          await getCustomersByBusiness(business.id);

        const processedCustomers = fetchedCustomers.map((customer) => {
          const converted = convertFirestoreData(customer);
          return {
            ...converted,
            totalSpent: converted.totalSpent || 0,
            orders: converted.orders || 0,
            createdAt: converted.created_at
              ? converted.created_at.toISOString()
              : new Date().toISOString(),
          };
        });

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

  // Load more customers
  const loadMoreCustomers = useCallback(async () => {
    if (!business || !lastVisible || !hasMore) return;

    try {
      setLoading(true);
      setError(null);

      const { customers: fetchedCustomers, lastDoc } =
        await getCustomersByBusiness(business.id, lastVisible);

      const processedCustomers = fetchedCustomers.map((customer) => {
        const converted = convertFirestoreData(customer);
        return {
          ...converted,
          totalSpent: converted.totalSpent || 0,
          orders: converted.orders || 0,
          createdAt: converted.created_at
            ? converted.created_at.toISOString()
            : new Date().toISOString(),
        };
      });

      setCustomers((prev) => [...prev, ...processedCustomers]);
      setFilteredCustomers((prev) => [...prev, ...processedCustomers]);
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

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredCustomers(customers);
      return;
    }

    const filtered = customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(query.toLowerCase()) ||
        customer.email.toLowerCase().includes(query.toLowerCase()) ||
        customer.phone.toLowerCase().includes(query.toLowerCase()) ||
        (customer.company &&
          customer.company.toLowerCase().includes(query.toLowerCase()))
    );

    setFilteredCustomers(filtered);
  };

  // Handle sorting
  const handleSort = (field: keyof CustomerType) => {
    const newSortOrder =
      field === sortField && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newSortOrder);

    const sorted = [...filteredCustomers].sort((a, b) => {
      const aValue = a[field] || "";
      const bValue = b[field] || "";

      if (typeof aValue === "string" && typeof bValue === "string") {
        return newSortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (aValue < bValue) return newSortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return newSortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredCustomers(sorted);
  };

  // Add new customer
  const handleAddCustomer = async (customerData: CustomerType) => {
    if (!business) {
      toast({
        title: "Error",
        description: "Business data is required to add a customer",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // Prepare customer data for Firestore
      const firestoreData = {
        business_id: business.id,
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        company: customerData.company || "",
        location: customerData.location,
        status: customerData.status,
        notes: customerData.notes || "",
        totalSpent: 0,
        orders: 0,
      };

      // Add to Firestore
      const customerId = await addCustomer(business.id, firestoreData);

      // Fetch the newly created customer to get the complete data
      const newCustomer = await getCustomer(customerId);

      if (newCustomer) {
        const processedCustomer = {
          ...convertFirestoreData(newCustomer),
          id: customerId,
          createdAt: new Date().toISOString(),
          totalSpent: 0,
          orders: 0,
        };

        // Update local state
        setCustomers((prev) => [processedCustomer, ...prev]);
        setFilteredCustomers((prev) => [processedCustomer, ...prev]);
        setSelectedCustomer(processedCustomer);

        toast({
          title: "Success",
          description: `${customerData.name} has been added to your customers.`,
        });

        setIsAddingCustomer(false);
        setIsDetailOpen(false);

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
    } finally {
      setLoading(false);
    }
  };

  // Update customer
  const handleUpdateCustomer = async (updatedCustomer: CustomerType) => {
    if (!updatedCustomer.id) {
      toast({
        title: "Error",
        description: "Customer ID is required for update",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // Prepare update data
      const updateData = {
        name: updatedCustomer.name,
        email: updatedCustomer.email,
        phone: updatedCustomer.phone,
        company: updatedCustomer.company || "",
        location: updatedCustomer.location,
        status: updatedCustomer.status,
        notes: updatedCustomer.notes || "",
      };

      // Update in Firestore
      await updateCustomer(updatedCustomer.id, updateData);

      // Update local state
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === updatedCustomer.id ? { ...c, ...updatedCustomer } : c
        )
      );
      setFilteredCustomers((prev) =>
        prev.map((c) =>
          c.id === updatedCustomer.id ? { ...c, ...updatedCustomer } : c
        )
      );
      setSelectedCustomer((prev) =>
        prev && prev.id === updatedCustomer.id
          ? { ...prev, ...updatedCustomer }
          : prev
      );
      setIsEditMode(false);

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
    } finally {
      setLoading(false);
    }
  };

  // Delete customer
  const handleDeleteCustomer = async () => {
    if (!selectedCustomer) return;

    try {
      setLoading(true);

      // Delete from Firestore
      await deleteCustomer(selectedCustomer.id);

      // Update local state
      setCustomers((prev) => prev.filter((c) => c.id !== selectedCustomer.id));
      setFilteredCustomers((prev) =>
        prev.filter((c) => c.id !== selectedCustomer.id)
      );
      setIsDeleteConfirmOpen(false);
      setSelectedCustomer(null);
      setIsDetailOpen(false);

      toast({
        title: "Customer deleted",
        description: `${selectedCustomer.name} has been removed from your customers.`,
        variant: "destructive",
      });
    } catch (err: any) {
      console.error("Error deleting customer:", err);
      toast({
        title: "Error",
        description: "Failed to delete customer",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // View customer details
  const handleViewCustomer = (customer: CustomerType) => {
    setSelectedCustomer(customer);
    setIsAddingCustomer(false);
    setIsDetailOpen(true);
    setIsEditMode(false);
  };

  // Edit customer
  const handleEditCustomer = (customer: CustomerType) => {
    setSelectedCustomer(customer);
    setIsAddingCustomer(false);
    setIsDetailOpen(true);
    setIsEditMode(true);
  };

  // Open delete confirmation
  const confirmDelete = (customer: CustomerType) => {
    setSelectedCustomer(customer);
    setIsDeleteConfirmOpen(true);
  };

  // Start adding new customer
  const startAddCustomer = () => {
    setSelectedCustomer(null);
    setIsAddingCustomer(true);
    setIsDetailOpen(true);
  };

  // Close detail panel
  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedCustomer(null);
    setIsAddingCustomer(false);
    setIsEditMode(false);
  };

  return {
    customers,
    filteredCustomers,
    searchQuery,
    selectedCustomer,
    isDetailOpen,
    sortOrder,
    sortField,
    isAddingCustomer,
    isDeleteConfirmOpen,
    isEditMode,
    loading,
    error,
    hasMore,
    actions: {
      handleSearch,
      handleSort,
      handleAddCustomer,
      handleUpdateCustomer,
      handleDeleteCustomer,
      handleViewCustomer,
      handleEditCustomer,
      confirmDelete,
      startAddCustomer,
      handleCloseDetail,
      setIsDeleteConfirmOpen,
      loadMoreCustomers,
    },
  };
}
