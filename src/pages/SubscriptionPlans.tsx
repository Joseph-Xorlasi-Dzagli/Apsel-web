
import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

const SubscriptionPlans = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string>("merchant");
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");

  const handleSelectPlan = (plan: string) => {
    setSelectedPlan(plan);
  };

  const planFeatures = [
    "Unlock all puzzles",
    "Only $.56 a week",
    "Unlimited access with no ads",
    "New puzzles added daily"
  ];

  return (
    <div className="container mx-auto p-4 max-w-md">
      <div className="flex items-center gap-2 mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Choose a package</h1>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card 
          className={`cursor-pointer ${selectedPlan === 'merchant' ? 'border-brand' : ''}`}
          onClick={() => handleSelectPlan('merchant')}
        >
          <CardContent className="p-4">
            <div className="flex justify-between">
              <h3 className="text-brand font-medium">Merchant</h3>
              {selectedPlan === 'merchant' && <Check className="h-5 w-5 text-green-500" />}
            </div>
            <p className="text-xl font-bold">Ghc 150.00<span className="text-sm font-normal">/month</span></p>
            <p className="text-sm mb-2">You're saving 20%</p>
            <p className="text-sm text-muted-foreground">Renews 30th March 2024</p>
          </CardContent>
        </Card>
        
        <Card 
          className={`cursor-pointer ${selectedPlan === 'shop' ? 'border-brand' : ''}`}
          onClick={() => handleSelectPlan('shop')}
        >
          <CardContent className="p-4">
            <h3 className="text-muted-foreground font-medium">Shop</h3>
            <p className="text-xl font-bold">Ghc 300.00<span className="text-sm font-normal">/month</span></p>
            <p className="text-sm mb-2 opacity-0">Placeholder</p>
            <p className="text-sm text-muted-foreground">Renews 30th April 2024</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={billingPeriod} className="mb-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger 
            value="annual" 
            onClick={() => setBillingPeriod("annual")}
          >
            Annual
          </TabsTrigger>
          <TabsTrigger 
            value="monthly" 
            onClick={() => setBillingPeriod("monthly")}
          >
            Monthly
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-3 mb-10">
        {planFeatures.map((feature, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="h-6 w-6 rounded-full bg-brand flex items-center justify-center">
              <Check className="h-4 w-4 text-white" />
            </div>
            <span>{feature}</span>
          </div>
        ))}
      </div>

      <Button 
        className="w-full bg-brand hover:bg-brand-dark text-white font-bold uppercase"
        onClick={() => navigate("/billing/confirm")}  
      >
        Get Merchant
      </Button>
    </div>
  );
};

export default SubscriptionPlans;
