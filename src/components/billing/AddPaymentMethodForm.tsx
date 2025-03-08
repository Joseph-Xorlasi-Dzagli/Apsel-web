import React, { useState } from "react";
import PaymentMethodDetails from "./PaymentMethodDetails";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { toast } from "@/hooks/use-toast";

interface AddPaymentMethodFormProps {
  paymentMethod: string;
  handleSelectPaymentMethod: (method: string) => void;
  setHasPaymentMethod: (hasMethod: boolean) => void;
}

const AddPaymentMethodForm = ({ 
  setHasPaymentMethod 
}: AddPaymentMethodFormProps) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  const handleSave = (data: any) => {
    setFormData(data);
    setShowConfirmation(true);
  };

  const confirmSave = () => {
    console.log("Adding payment method:", formData);
    setHasPaymentMethod(true);
    setShowConfirmation(false);
    toast({
      title: "Payment method added",
      description: "Your new payment method has been added successfully.",
    });
  };
  
  return (
    <div className="mt-6">
      <PaymentMethodDetails
        onClose={() => {}}
        onSave={handleSave}
      />
      
      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={confirmSave}
        title="Add Payment Method"
        description="Are you sure you want to add this payment method to your account?"
        confirmText="Add"
        cancelText="Cancel"
      />
    </div>
  );
};

export default AddPaymentMethodForm;
