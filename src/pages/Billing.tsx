
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

// Import refactored components
import SubscriptionSuccessModal from "@/components/billing/SubscriptionSuccessModal";
import CurrentPackageCard from "@/components/billing/CurrentPackageCard";
import BillingCycleCard from "@/components/billing/BillingCycleCard";
import PaymentMethodsList from "@/components/billing/PaymentMethodsList";
import NoPaymentMethod from "@/components/billing/NoPaymentMethod";
import SubscriptionSummary from "@/components/billing/SubscriptionSummary";
import BillingHistory from "@/components/billing/BillingHistory";
import BillingInformation from "@/components/billing/BillingInformation";
import PaymentMethodDetails from "@/components/billing/PaymentMethodDetails";

// Define a type for payment methods
interface PaymentMethod {
  id: string;
  type: string;
  lastFour: string;
  expiryDate: string;
  cardHolderName: string;
}

const Billing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentPlan, setCurrentPlan] = useState<string>("merchant");
  const [paymentMethod, setPaymentMethod] = useState<string>("gpay");
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");
  const [hasPaymentMethod, setHasPaymentMethod] = useState<boolean>(true);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Default payment methods
  const defaultPaymentMethods: PaymentMethod[] = [
    {
      id: '1',
      type: 'gpay',
      lastFour: '4321',
      expiryDate: '12/25',
      cardHolderName: 'John Doe'
    },
    {
      id: '2',
      type: 'visa',
      lastFour: '4242',
      expiryDate: '04/25',
      cardHolderName: 'Jane Doe'
    },
    {
      id: '3',
      type: 'mastercard',
      lastFour: '8412',
      expiryDate: '12/24',
      cardHolderName: 'Alice Smith'
    }
  ];

  // Set default payment method on initial load
  useEffect(() => {
    if (!selectedMethod && hasPaymentMethod) {
      const defaultMethod = defaultPaymentMethods.find(method => method.type === paymentMethod);
      if (defaultMethod) {
        setSelectedMethod(defaultMethod);
      }
    }
  }, [paymentMethod, hasPaymentMethod]);

  const handleSubscribe = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      toast({
        title: "Subscription Confirmed",
        description: "Your Merchant plan is now active.",
      });
    }, 2000);
  };

  const handleSelectPaymentMethod = (method: string) => {
    setPaymentMethod(method);
    
    if (method === 'new') {
      setSelectedMethod(null);
      setIsAdding(true);
      setIsEditing(false);
      return;
    }
    
    // Set the selected method based on the chosen payment method
    const methodDetails = defaultPaymentMethods.find(m => m.type === method);
    if (methodDetails) {
      setSelectedMethod(methodDetails);
    }
    
    setIsAdding(false);
    setIsEditing(false);
  };

  const handleSave = (data: any) => {
    console.log("Saving payment method:", data);
    setHasPaymentMethod(true);
    setIsEditing(false);
    setIsAdding(false);
    
    toast({
      title: isEditing ? "Payment method updated" : "Payment method added",
      description: "Your changes have been saved successfully.",
    });
  };

  const handleDelete = (id: string) => {
    console.log("Deleting payment method:", id);
    // In a real application, you would call an API to delete the payment method
    
    // Set a different payment method as default if the deleted one was selected
    if (selectedMethod && selectedMethod.id === id) {
      const remainingMethods = defaultPaymentMethods.filter(method => method.id !== id);
      if (remainingMethods.length > 0) {
        setPaymentMethod(remainingMethods[0].type);
        setSelectedMethod(remainingMethods[0]);
      } else {
        setHasPaymentMethod(false);
        setSelectedMethod(null);
      }
    }
    
    handleClose();
    
    toast({
      title: "Payment method deleted",
      description: "The payment method has been removed successfully.",
    });
  };

  const handleClose = () => {
    if (isAdding) {
      // If adding was canceled, go back to the default method
      const defaultMethod = defaultPaymentMethods.find(method => method.type === paymentMethod);
      if (defaultMethod) {
        setSelectedMethod(defaultMethod);
      }
    }
    setIsAdding(false);
    setIsEditing(false);
  };

  const handleAddNew = () => {
    setSelectedMethod(null);
    setIsAdding(true);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Billing & Subscription
          </h1>
          <p className="text-muted-foreground">
            Manage your subscription and payment methods
          </p>
        </div>
        <Button
          className="bg-brand hover:bg-brand-dark text-white"
          onClick={() => navigate("/billing/plans")}>
          Choose Plan
        </Button>
      </div>

      {showSuccess && (
        <SubscriptionSuccessModal setShowSuccess={setShowSuccess} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-2">
          <div className="pb-8">
            {hasPaymentMethod ? (
              <PaymentMethodsList
                paymentMethod={paymentMethod}
                handleSelectPaymentMethod={handleSelectPaymentMethod}
                setHasPaymentMethod={setHasPaymentMethod}
              />
            ) : (
              <NoPaymentMethod
                paymentMethod={paymentMethod}
                handleSelectPaymentMethod={handleSelectPaymentMethod}
                setHasPaymentMethod={setHasPaymentMethod}
              />
            )}
          </div>
          <BillingHistory />
        </div>
        <div className="space-y-8">
          <SubscriptionSummary />
          
          {/* Payment Method Details Panel */}
          {hasPaymentMethod && (
            <div className="mt-8">
              <PaymentMethodDetails
                selectedMethod={isAdding ? null : selectedMethod}
                onClose={handleClose}
                onSave={handleSave}
                onDelete={handleDelete}
                isEditing={isEditing}
                onEdit={handleEdit}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Billing;
