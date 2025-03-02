
import React from "react";
import { CreditCard as CardIcon } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const BillingInformation = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing Information</CardTitle>
        <CardDescription>Your billing contact and address details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Billing Contact</p>
              <p className="font-medium">John Doe</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Company</p>
              <p className="font-medium">G-Connect Mobile</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">john.doe@example.com</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Address</p>
            <p className="font-medium">123 Main St, Accra, Ghana</p>
          </div>
          <Button variant="outline" className="mt-2 w-full sm:w-auto">
            <CardIcon className="mr-2 h-4 w-4" />
            Update Information
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BillingInformation;
