
import React from "react";
import PaymentMethodDetails from "./PaymentMethodDetails";

interface AddPaymentMethodFormProps {
  paymentMethod: string;
  handleSelectPaymentMethod: (method: string) => void;
  setHasPaymentMethod: (hasMethod: boolean) => void;
}

const AddPaymentMethodForm = ({ 
  setHasPaymentMethod 
}: AddPaymentMethodFormProps) => {
  const handleSave = (data: any) => {
    console.log("Adding payment method:", data);
    setHasPaymentMethod(true);
  };

  return (
    <div className="mt-6">
      <PaymentMethodDetails
        onClose={() => {}}
        onSave={handleSave}
      />
    </div>
  );
};

export default AddPaymentMethodForm;
