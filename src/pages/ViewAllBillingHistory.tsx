
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Receipt, Calendar, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ViewAllBillingHistory = () => {
  const billingTransactions = [
    { plan: "Merchant Plan", date: "March 1, 2024", amount: "Ghc 150.00", status: "paid", id: "INV-001" },
    { plan: "Merchant Plan", date: "February 1, 2024", amount: "Ghc 150.00", status: "paid", id: "INV-002" },
    { plan: "Merchant Plan", date: "January 1, 2024", amount: "Ghc 150.00", status: "paid", id: "INV-003" },
    { plan: "Merchant Plan", date: "December 1, 2023", amount: "Ghc 150.00", status: "paid", id: "INV-004" },
    { plan: "Merchant Plan", date: "November 1, 2023", amount: "Ghc 150.00", status: "paid", id: "INV-005" },
    { plan: "Merchant Plan", date: "October 1, 2023", amount: "Ghc 150.00", status: "paid", id: "INV-006" },
  ];
  
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
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
          <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search invoices..." 
                className="pl-9 w-full sm:w-[260px]" 
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select defaultValue="newest">
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest first</SelectItem>
                  <SelectItem value="oldest">Oldest first</SelectItem>
                  <SelectItem value="amount-high">Amount (high to low)</SelectItem>
                  <SelectItem value="amount-low">Amount (low to high)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-4">
            {billingTransactions.map((transaction, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-brand/10 rounded-lg">
                    <Receipt className="h-5 w-5 text-brand" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{transaction.plan}</p>
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        {transaction.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-muted-foreground">
                        <span className="inline-block mr-1">{transaction.id}</span> • 
                        <Calendar className="h-3 w-3 inline mx-1" />
                        {transaction.date}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 sm:mt-0">
                  <p className="font-medium">{transaction.amount}</p>
                  <Button variant="outline" size="sm" className="h-8">
                    <Download className="h-4 w-4 mr-1" />
                    <span>Invoice</span>
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
