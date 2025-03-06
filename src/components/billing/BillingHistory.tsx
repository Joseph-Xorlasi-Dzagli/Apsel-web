
import React from "react";
import { Receipt } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";


const BillingHistory = () => {
  const navigate = useNavigate();
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>
            View your recent billing transactions
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => navigate("/billing/history")}
          >
          {" "}
          {/* <Receipt className="h-4 w-4" /> */}
          <span>View All</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between p-3 border rounded-md hover:bg-muted/30 transition-colors cursor-pointer">
            <div>
              <p className="font-medium">Merchant Plan</p>
              <p className="text-sm text-muted-foreground">March 1, 2024</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="font-medium">Ghc 150.00</p>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Receipt className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex justify-between p-3 border rounded-md hover:bg-muted/30 transition-colors cursor-pointer">
            <div>
              <p className="font-medium">Merchant Plan</p>
              <p className="text-sm text-muted-foreground">February 1, 2024</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="font-medium">Ghc 150.00</p>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Receipt className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex justify-between p-3 border rounded-md hover:bg-muted/30 transition-colors cursor-pointer">
            <div>
              <p className="font-medium">Merchant Plan</p>
              <p className="text-sm text-muted-foreground">January 1, 2024</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="font-medium">Ghc 150.00</p>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Receipt className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BillingHistory;
