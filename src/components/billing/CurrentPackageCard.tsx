
import React from "react";
import { Clock } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

const CurrentPackageCard = () => {
  return (
    <Card className="md:col-span-2 bg-brand-light border-0">
      <CardHeader className="pb-2">
        <p className="text-sm text-muted-foreground uppercase">CURRENT PACKAGE</p>
        <CardTitle className="text-2xl text-brand">Merchant</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-2">You're saving 20%</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-brand" />
            <p className="text-brand font-medium">Renews in 3 days</p>
          </div>
          <p className="text-2xl font-bold">Ghc 150<span className="text-sm font-normal">/month</span></p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentPackageCard;
