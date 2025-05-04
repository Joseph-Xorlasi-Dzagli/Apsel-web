import React from "react";
import { Users } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { CustomerDetailsPanel } from "@/components/customers/CustomerDetailsPanel";
import { CustomerStats } from "@/components/customers/CustomerStats";
import { CustomerSearch } from "@/components/customers/CustomerSearch";
import { CustomerTable } from "@/components/customers/CustomerTable";
import { useCustomers } from "@/components/customers/useCustomers";

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
    actions,
  } = useCustomers();

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
