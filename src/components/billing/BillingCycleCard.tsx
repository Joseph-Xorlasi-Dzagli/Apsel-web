
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BillingCycleCardProps {
  billingPeriod: "monthly" | "annual";
  setBillingPeriod: (period: "monthly" | "annual") => void;
}

const BillingCycleCard = ({ 
  billingPeriod,
  setBillingPeriod 
}: BillingCycleCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Billing Cycle</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={billingPeriod} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger 
              value="annual" 
              onClick={() => setBillingPeriod("annual")}
            >
              Annual (Save 20%)
            </TabsTrigger>
            <TabsTrigger 
              value="monthly" 
              onClick={() => setBillingPeriod("monthly")}
            >
              Monthly
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BillingCycleCard;
