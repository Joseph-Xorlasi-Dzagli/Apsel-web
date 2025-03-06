import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Receipt from "../components/ui/Receipt";
import { useNavigate } from "react-router-dom";
import { ArrowLeft} from "lucide-react";

const ViewAllBillingHistory = () => {
  const billingTransactions = [
    { plan: "Merchant Plan", date: "March 1, 2024", amount: "Ghc 150.00" },
    { plan: "Merchant Plan", date: "February 1, 2024", amount: "Ghc 150.00" },
    { plan: "Merchant Plan", date: "January 1, 2024", amount: "Ghc 150.00" },
    // Add more transactions as needed
  ];
  const navigate = useNavigate();


  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 p-1"
                onClick={() => navigate(-1)}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              Billing History
            </div>
          </CardTitle>
          <CardDescription>View all your billing transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {billingTransactions.map((transaction, index) => (
              <div
                key={index}
                className="flex justify-between p-3 border rounded-md hover:bg-muted/30 transition-colors cursor-pointer">
                <div>
                  <p className="font-medium">{transaction.plan}</p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.date}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{transaction.amount}</p>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Receipt className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewAllBillingHistory;