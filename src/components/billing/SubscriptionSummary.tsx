
import React from "react";
import { Calendar } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

const SubscriptionSummary = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-brand-light/30 rounded-md">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-brand" />
            <span className="font-medium">Next billing date</span>
          </div>
          <span className="font-medium">June 30, 2024</span>
        </div>
        
        <div className="space-y-3 pt-2">
          <div className="flex justify-between">
            <span>Current plan</span>
            <span className="font-medium">Merchant</span>
          </div>
          <div className="flex justify-between">
            <span>Billing period</span>
            <span className="font-medium">Monthly</span>
          </div>
          <div className="flex justify-between border-t pt-3 mt-2">
            <span className="font-bold">Total</span>
            <span className="font-bold">Ghc 150.00/month</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionSummary;
