
import React, { useState } from "react";
import { Check, Pencil, Trash2, Plus, CreditCard, AlertCircle } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import AddPaymentMethodForm from "./AddPaymentMethodForm";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface PaymentMethod {
  id: string;
  type: string;
  name: string;
  details: string;
  isDefault: boolean;
}

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
  const { toast } = useToast();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 'gpay',
      type: 'gpay',
      name: 'Google Pay',
      details: 'Default',
      isDefault: true,
    },
    {
      id: 'visa',
      type: 'visa',
      name: 'Visa •••• 4242',
      details: 'Expires 04/25',
      isDefault: false,
    },
    {
      id: 'mastercard',
      type: 'mastercard',
      name: 'MasterCard •••• 8412',
      details: 'Expires 12/24',
      isDefault: false,
    }
  ]);
  
  const [methodToEdit, setMethodToEdit] = useState<PaymentMethod | null>(null);
  const [methodToDelete, setMethodToDelete] = useState<string | null>(null);
  
  const handleSetDefault = (id: string) => {
    setPaymentMethods(methods => 
      methods.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
    
    toast({
      title: "Default payment method updated",
      description: "Your default payment method has been updated successfully."
    });
  };
  
  const handleDeletePaymentMethod = (id: string) => {
    setPaymentMethods(methods => methods.filter(method => method.id !== id));
    
    // If there are no payment methods left, update the parent component
    if (paymentMethods.length === 1) {
      setHasPaymentMethod(false);
    }
    
    toast({
      title: "Payment method deleted",
      description: "Your payment method has been removed successfully."
    });
    
    setMethodToDelete(null);
  };
  
  const handleEditPaymentMethod = (method: PaymentMethod) => {
    setMethodToEdit(method);
    handleSelectPaymentMethod(method.type);
  };
  
  const handleCloseEdit = () => {
    setMethodToEdit(null);
  };
  
  const handleSaveEdit = () => {
    // In a real app, this would update the payment method details
    toast({
      title: "Payment method updated",
      description: "Your payment method has been updated successfully."
    });
    
    setMethodToEdit(null);
  };

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
              <SheetTitle>{methodToEdit ? "Edit Payment Method" : "Add Payment Method"}</SheetTitle>
            </SheetHeader>
            <AddPaymentMethodForm 
              paymentMethod={paymentMethod} 
              handleSelectPaymentMethod={handleSelectPaymentMethod}
              setHasPaymentMethod={setHasPaymentMethod}
            />
            {methodToEdit && (
              <div className="flex justify-end mt-4 gap-2">
                <Button variant="outline" onClick={handleCloseEdit}>Cancel</Button>
                <Button onClick={handleSaveEdit}>Save Changes</Button>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paymentMethods.map((method) => (
          <div 
            key={method.id}
            className={`flex items-center justify-between p-4 border rounded-lg ${method.type === paymentMethod ? 'border-brand bg-brand-light/30' : ''}`}
          >
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                method.type === 'gpay' ? 'bg-blue-100' : 
                method.type === 'visa' ? 'bg-blue-700' : 
                'bg-red-500'
              }`}>
                <span className={`font-bold ${method.type === 'gpay' ? 'text-blue-500' : 'text-white'}`}>
                  {method.type === 'gpay' ? 'G' : method.type === 'visa' ? 'V' : 'M'}
                </span>
              </div>
              <div>
                <p className="font-medium">{method.name}</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">{method.details}</p>
                  {method.isDefault && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-brand/10 text-brand font-medium">
                      Default
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {!method.isDefault && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 text-muted-foreground hover:text-brand"
                  onClick={() => handleSetDefault(method.id)}
                  title="Set as default"
                >
                  <Check className="h-4 w-4" />
                </Button>
              )}
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-muted-foreground hover:text-blue-500"
                onClick={() => handleEditPaymentMethod(method)}
                title="Edit"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-muted-foreground hover:text-red-500"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Payment Method</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this payment method? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-500 hover:bg-red-600"
                      onClick={() => handleDeletePaymentMethod(method.id)}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>
      
      {paymentMethods.length === 0 && (
        <div className="flex flex-col items-center justify-center p-10 border border-dashed rounded-lg">
          <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No payment methods</h3>
          <p className="text-center text-muted-foreground mb-4">
            You haven't added any payment methods yet.
          </p>
          <Sheet>
            <SheetTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Payment Method
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
      )}
    </div>
  );
};

export default PaymentMethodsList;
