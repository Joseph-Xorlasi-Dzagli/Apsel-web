import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { CustomerType, mockCustomers } from "@/lib/data";


export function useCustomers() {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<CustomerType[]>(mockCustomers);
  const [filteredCustomers, setFilteredCustomers] =
    useState<CustomerType[]>(mockCustomers);
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
        customer.phone.toLowerCase().includes(query.toLowerCase())
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
      if (a[field] < b[field]) return sortOrder === "asc" ? -1 : 1;
      if (a[field] > b[field]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredCustomers(sorted);
  };

  // Add new customer
  const handleAddCustomer = (customer: CustomerType) => {
    const newCustomers = [
      ...customers,
      { ...customer, id: `customer-${customers.length + 1}` },
    ];
    setCustomers(newCustomers);
    setFilteredCustomers(newCustomers);
    setIsAddingCustomer(false);
    setIsDetailOpen(false);
    toast({
      title: "Customer added",
      description: `${customer.name} has been added to your customers.`,
    });
  };

  // Update customer
  const handleUpdateCustomer = (updatedCustomer: CustomerType) => {
    const newCustomers = customers.map((c) =>
      c.id === updatedCustomer.id ? updatedCustomer : c
    );
    setCustomers(newCustomers);
    setFilteredCustomers(newCustomers);
    toast({
      title: "Customer updated",
      description: `${updatedCustomer.name}'s information has been updated.`,
    });
  };

  // Delete customer
  const handleDeleteCustomer = () => {
    if (!selectedCustomer) return;

    const newCustomers = customers.filter((c) => c.id !== selectedCustomer.id);
    setCustomers(newCustomers);
    setFilteredCustomers(newCustomers);
    setIsDeleteConfirmOpen(false);
    setSelectedCustomer(null);
    setIsDetailOpen(false);

    toast({
      title: "Customer deleted",
      description: `${selectedCustomer.name} has been removed from your customers.`,
      variant: "destructive",
    });
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
    },
  };
}
