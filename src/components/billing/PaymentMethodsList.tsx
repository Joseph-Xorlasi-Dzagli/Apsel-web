
import React from "react";
import { Check } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import AddPaymentMethodForm from "./AddPaymentMethodForm";
import { Plus } from "lucide-react";

interface PaymentMethodsListProps {
  paymentMethod: string;
  handleSelectPaymentMethod: (method: string) => void;
  setHasPaymentMethod: (hasMethod: boolean) => void;
}

const PaymentMethodsList = ({ 
  paymentMethod, 
  handleSelectPaymentMethod,
  setHasPaymentMethod
}: PaymentMethodsListProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Payment Methods</h2>
        <Sheet>
          <SheetTrigger asChild>
            <Button size="sm" className="rounded-full bg-brand hover:bg-brand-dark">
              <Plus className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Add Payment Method</SheetTitle>
            </SheetHeader>
            <AddPaymentMethodForm 
              paymentMethod={paymentMethod} 
              handleSelectPaymentMethod={handleSelectPaymentMethod}
              setHasPaymentMethod={setHasPaymentMethod}
            />
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${paymentMethod === 'gpay' ? 'border-brand bg-brand-light/30' : ''}`}
          onClick={() => handleSelectPaymentMethod('gpay')}
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="font-bold text-blue-500">G</span>
            </div>
            <div>
              <p className="font-medium">Google Pay</p>
              <p className="text-sm text-muted-foreground">Default</p>
            </div>
          </div>
          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'gpay' ? 'bg-brand border-0' : ''}`}>
            {paymentMethod === 'gpay' && <Check className="h-3 w-3 text-white" />}
          </div>
        </div>
        <div 
          className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${paymentMethod === 'visa' ? 'border-brand bg-brand-light/30' : ''}`}
          onClick={() => handleSelectPaymentMethod('visa')}
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-700 flex items-center justify-center">
              <span className="font-bold text-white">V</span>
            </div>
            <div>
              <p className="font-medium">Visa •••• 4242</p>
              <p className="text-sm text-muted-foreground">Expires 04/25</p>
            </div>
          </div>
          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'visa' ? 'bg-brand border-0' : ''}`}>
            {paymentMethod === 'visa' && <Check className="h-3 w-3 text-white" />}
          </div>
        </div>
        <div 
          className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${paymentMethod === 'mastercard' ? 'border-brand bg-brand-light/30' : ''}`}
          onClick={() => handleSelectPaymentMethod('mastercard')}
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center">
              <span className="font-bold text-white">M</span>
            </div>
            <div>
              <p className="font-medium">MasterCard •••• 8412</p>
              <p className="text-sm text-muted-foreground">Expires 12/24</p>
            </div>
          </div>
          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'mastercard' ? 'bg-brand border-0' : ''}`}>
            {paymentMethod === 'mastercard' && <Check className="h-3 w-3 text-white" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodsList;
