import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import { CustomerType } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { CustomerForm } from "./CustomerForm";
import { CustomerView } from "./CustomerView";
import { CustomerFormValues } from "../../utils/formatters";

interface CustomerDetailsPanelProps {
  customer: CustomerType | null;
  onClose: () => void;
  onSave: (customer: CustomerType) => void;
  onDelete: (customer: CustomerType) => void;
  onAdd: (customer: CustomerType) => void;
}

export function CustomerDetailsPanel({
  customer,
  onClose,
  onSave,
  onDelete,
  onAdd,
}: CustomerDetailsPanelProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset editing state when customer changes
  useEffect(() => {
    if (customer) {
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  }, [customer]);

  const handleFormSubmit = (data: CustomerFormValues) => {
    setIsSubmitting(true);
    try {
      if (customer) {
        // Update existing customer
        const updatedCustomer: CustomerType = {
          ...customer,
          name: data.name,
          email: data.email,
          phone: data.phone,
          company: data.company,
          location: data.location,
          status: data.status,
          notes: data.notes,
        };
        onSave(updatedCustomer);
        setIsEditing(false);
        toast({
          title: "Customer updated",
          description: "Customer details have been saved.",
        });
      } else {
        // Add new customer
        const newCustomer: CustomerType = {
          id: "", // Will be set by the parent component
          name: data.name,
          email: data.email,
          phone: data.phone,
          company: data.company,
          location: data.location,
          status: data.status,
          notes: data.notes,
          createdAt: new Date().toISOString(),
          totalSpent: 0,
          orders: 0,
        };
        onAdd(newCustomer);
        toast({
          title: "Customer added",
          description: "New customer has been added.",
        });
      }
    } catch (error) {
      console.error("Error saving customer:", error);
      toast({
        title: "Error",
        description: "Failed to save customer details.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!customer && !isEditing) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8 text-muted-foreground">
        <p>Select a customer or add a new one to see details</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto p-4 space-y-6 border-l">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {customer
            ? isEditing
              ? "Edit Customer"
              : "Customer Details"
            : "Add New Customer"}
        </h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Separator />

      {isEditing ? (
        <CustomerForm
          customer={customer}
          onSubmit={handleFormSubmit}
          onCancel={customer ? () => setIsEditing(false) : undefined}
          onDelete={customer ? onDelete : undefined}
          isSubmitting={isSubmitting}
        />
      ) : customer ? (
        <CustomerView customer={customer} onEdit={() => setIsEditing(true)} />
      ) : null}
    </div>
  );
}
