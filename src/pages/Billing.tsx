
import { useState } from "react";
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

const Billing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentPlan, setCurrentPlan] = useState<string>("merchant");
  const [paymentMethod, setPaymentMethod] = useState<string>("gpay");
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");
  const [hasPaymentMethod, setHasPaymentMethod] = useState<boolean>(true);

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
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing & Subscription</h1>
          <p className="text-muted-foreground">Manage your subscription and payment methods</p>
        </div>
        <Button 
          className="bg-brand hover:bg-brand-dark text-white"
          onClick={() => navigate("/billing/plans")}
        >
          Change Plan
        </Button>
      </div>

      {showSuccess && (
        <SubscriptionSuccessModal setShowSuccess={setShowSuccess} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <CurrentPackageCard />
        <BillingCycleCard 
          billingPeriod={billingPeriod}
          setBillingPeriod={setBillingPeriod}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-2">
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
        
        <SubscriptionSummary />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <BillingHistory />
        <BillingInformation />
      </div>
    </div>
  );
};

export default Billing;
