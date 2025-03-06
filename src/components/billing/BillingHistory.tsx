
import React from "react";
import { Receipt, Download, Calendar } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const BillingHistory = () => {
  const navigate = useNavigate();
  
  const billingTransactions = [
    { plan: "Merchant Plan", date: "March 1, 2024", amount: "Ghc 150.00", status: "paid" },
    { plan: "Merchant Plan", date: "February 1, 2024", amount: "Ghc 150.00", status: "paid" },
    { plan: "Merchant Plan", date: "January 1, 2024", amount: "Ghc 150.00", status: "paid" },
  ];
  
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
          <Calendar className="h-4 w-4 mr-1" />
          <span>View All</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {billingTransactions.map((transaction, index) => (
            <div 
              key={index} 
              className="flex justify-between p-4 border rounded-md hover:bg-muted/30 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-brand/10 rounded-md">
                  <Receipt className="h-5 w-5 text-brand" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{transaction.plan}</p>
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                      {transaction.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {transaction.date}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p className="font-medium">{transaction.amount}</p>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BillingHistory;
