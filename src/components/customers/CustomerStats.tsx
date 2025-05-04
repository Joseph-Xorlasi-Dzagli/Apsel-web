import React from "react";
import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerType } from "@/lib/data";

interface CustomerStatsProps {
  customers: CustomerType[];
}

export function CustomerStats({ customers }: CustomerStatsProps) {
  // Calculate customer stats
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.status === "active").length;
  const newCustomers = customers.filter((c) => {
    const createdDate = new Date(c.createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return createdDate > thirtyDaysAgo;
  }).length;

  return (
    <div className="grid gap-4 md:grid-cols-3 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Customers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCustomers}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Active Customers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeCustomers}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            New (30 days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{newCustomers}</div>
        </CardContent>
      </Card>
    </div>
  );
}
