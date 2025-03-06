
import React from "react";
import { CreditCard, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddPaymentMethodFormProps {
  paymentMethod: string;
  handleSelectPaymentMethod: (method: string) => void;
  setHasPaymentMethod: (hasMethod: boolean) => void;
}

const AddPaymentMethodForm = ({ 
  paymentMethod, 
  handleSelectPaymentMethod,
  setHasPaymentMethod
}: AddPaymentMethodFormProps) => {
  return (
    <div className="mt-6 space-y-4">
      <div 
        className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${paymentMethod === 'card' ? 'border-brand' : ''}`}
        onClick={() => handleSelectPaymentMethod('card')}
      >
        <div className="flex items-center gap-3">
          <CreditCard className="h-5 w-5 text-muted-foreground" />
          <span>Credit/Debit Card</span>
        </div>
        {paymentMethod === 'card' && <CheckCircle className="h-5 w-5 text-brand" />}
      </div>
      <div 
        className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${paymentMethod === 'gpay' ? 'border-brand' : ''}`}
        onClick={() => handleSelectPaymentMethod('gpay')}
      >
        <div className="flex items-center gap-3">
          <span>Google Pay</span>
        </div>
        {paymentMethod === 'gpay' && <CheckCircle className="h-5 w-5 text-brand" />}
      </div>
      <Button className="w-full mt-6" onClick={() => setHasPaymentMethod(true)}>
        Save Payment Method
      </Button>
    </div>
  );
};

export default AddPaymentMethodForm;
