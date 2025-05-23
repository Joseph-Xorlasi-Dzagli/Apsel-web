import React from "react";
import { Users } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { CustomerDetailsPanel } from "@/components/customers/CustomerDetailsPanel";
import { CustomerStats } from "@/components/customers/CustomerStats";
import { CustomerSearch } from "@/components/customers/CustomerSearch";
import { CustomerTable } from "@/components/customers/CustomerTable";
import { useCustomersData } from "@/hooks/useCustomersData"; // Updated import path
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const Customers = () => {
  const {
    filteredCustomers,
    searchQuery,
    selectedCustomer,
    isDetailOpen,
    sortField,
    sortOrder,
    isAddingCustomer,
    isDeleteConfirmOpen,
    isEditMode,
    loading,
    error,
    hasMore,
    actions,
  } = useCustomersData();

  // Loading state
  if (loading && filteredCustomers.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6">
        <PageHeader
          title="Customer Management"
          description="View and manage your customer database"
          icon={<Users className="h-6 w-6" />}
        />

        <div className="grid gap-4 md:grid-cols-3 mb-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[100px]" />
          ))}
        </div>

        <div className="flex justify-between mb-6">
          <Skeleton className="h-10 w-[300px]" />
          <Skeleton className="h-10 w-[150px]" />
        </div>

        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <PageHeader
          title="Customer Management"
          description="View and manage your customer database"
          icon={<Users className="h-6 w-6" />}
        />

        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}. Please try again later.</AlertDescription>
        </Alert>

        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title="Customer Management"
        description="View and manage your customer database"
        icon={<Users className="h-6 w-6" />}
      />

      {/* Customer Stats */}
      <CustomerStats customers={filteredCustomers} />

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1">
          {/* Search and Actions */}
          <CustomerSearch
            searchQuery={searchQuery}
            onSearchChange={actions.handleSearch}
            onAddCustomer={actions.startAddCustomer}
          />

          {/* Customers Table */}
          <CustomerTable
            customers={filteredCustomers}
            selectedCustomer={selectedCustomer}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={actions.handleSort}
            onView={actions.handleViewCustomer}
            onEdit={actions.handleEditCustomer}
            onDelete={actions.confirmDelete}
          />

          {/* Load More Button */}
          {hasMore && filteredCustomers.length > 0 && (
            <div className="mt-4 text-center">
              <Button
                variant="outline"
                onClick={actions.loadMoreCustomers}
                disabled={loading}>
                {loading ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </div>

        {/* Customer Details Panel */}
        {isDetailOpen && (
          <div className="lg:w-[400px]">
            <CustomerDetailsPanel
              customer={isAddingCustomer ? null : selectedCustomer}
              onClose={actions.handleCloseDetail}
              onSave={actions.handleUpdateCustomer}
              onDelete={actions.confirmDelete}
              onAdd={actions.handleAddCustomer}
            />
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => actions.setIsDeleteConfirmOpen(false)}
        onConfirm={actions.handleDeleteCustomer}
        title="Delete Customer"
        description={`Are you sure you want to delete ${selectedCustomer?.name}? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
};

export default Customers;
