
import { useState } from "react";
import { ArrowLeft, Check, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  const plans = [
    {
      id: "merchant",
      name: "Merchant",
      priceMonthly: 150,
      priceAnnual: 1500,
      savings: "20%",
      renewalDate: "30th March 2024",
      description: "Perfect for small businesses with up to 5 employees",
      features: [
        "Unlimited products",
        "Sales analytics",
        "Customer management",
        "24/7 support"
      ]
    },
    {
      id: "shop",
      name: "Shop",
      priceMonthly: 300,
      priceAnnual: 3000,
      savings: "15%",
      renewalDate: "30th April 2024",
      description: "Designed for growing businesses with up to 20 employees",
      features: [
        "Everything in Merchant",
        "Advanced analytics",
        "Multi-user access",
        "Priority support"
      ]
    },
    {
      id: "enterprise",
      name: "Enterprise",
      priceMonthly: 600,
      priceAnnual: 6000,
      savings: "25%",
      renewalDate: "30th May 2024",
      description: "For established businesses with complex needs",
      features: [
        "Everything in Shop",
        "API access",
        "Custom integrations",
        "Dedicated account manager"
      ]
    }
  ];

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center gap-3 mb-8">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold">Choose a Subscription Plan</h1>
      </div>

      <Tabs value={billingPeriod} className="mb-8">
        <TabsList className="grid w-full max-w-md grid-cols-2 mx-auto">
          <TabsTrigger 
            value="annual" 
            onClick={() => setBillingPeriod("annual")}
          >
            Annual (Save up to 25%)
          </TabsTrigger>
          <TabsTrigger 
            value="monthly" 
            onClick={() => setBillingPeriod("monthly")}
          >
            Monthly
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {plans.map((plan) => (
          <Card 
            key={plan.id}
            className={`cursor-pointer transition-all ${selectedPlan === plan.id ? 'border-brand ring-2 ring-brand ring-opacity-50' : 'hover:shadow-md'}`}
            onClick={() => handleSelectPlan(plan.id)}
          >
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className={`font-medium ${selectedPlan === plan.id ? 'text-brand' : 'text-muted-foreground'}`}>{plan.name}</p>
                  <CardTitle className="text-2xl mt-1">
                    Ghc {billingPeriod === "monthly" ? plan.priceMonthly : plan.priceAnnual}
                    <span className="text-sm font-normal">/{billingPeriod === "monthly" ? "month" : "year"}</span>
                  </CardTitle>
                </div>
                {selectedPlan === plan.id && <Check className="h-5 w-5 text-green-500" />}
              </div>
              <p className="text-sm">{plan.description}</p>
            </CardHeader>
            <CardContent>
              {billingPeriod === "annual" && (
                <p className="text-sm mb-2 text-green-600">You're saving {plan.savings}</p>
              )}
              <p className="text-sm text-muted-foreground mb-4">Renews {plan.renewalDate}</p>
              
              <div className="space-y-2">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-brand flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <Card className="w-full md:w-2/3">
          <CardHeader>
            <CardTitle>Plan Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                {planFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-brand flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                {[
                  "Expert customer support",
                  "Automatic data backups",
                  "Advanced security features",
                  "Regular feature updates"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-brand flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full md:w-1/3">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Plan</span>
                <span className="font-medium">{plans.find(p => p.id === selectedPlan)?.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Billing period</span>
                <span className="font-medium capitalize">{billingPeriod}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount</span>
                <span className="font-medium">
                  Ghc {billingPeriod === "monthly" 
                    ? plans.find(p => p.id === selectedPlan)?.priceMonthly 
                    : plans.find(p => p.id === selectedPlan)?.priceAnnual}
                </span>
              </div>
              <div className="flex justify-between border-t pt-4">
                <span className="font-bold">Total</span>
                <span className="font-bold">
                  Ghc {billingPeriod === "monthly" 
                    ? plans.find(p => p.id === selectedPlan)?.priceMonthly 
                    : plans.find(p => p.id === selectedPlan)?.priceAnnual}
                </span>
              </div>
              
              <Button 
                className="w-full bg-brand hover:bg-brand-dark text-white font-bold mt-4"
                onClick={() => navigate("/billing/confirm")}  
              >
                Get {plans.find(p => p.id === selectedPlan)?.name}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
