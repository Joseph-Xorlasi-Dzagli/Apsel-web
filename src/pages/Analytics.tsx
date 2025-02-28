
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { TopSellingProducts } from "@/components/dashboard/TopSellingProducts";
import { OrderStatusChart } from "@/components/dashboard/OrderStatusChart";
import { TransactionHistory } from "@/components/analytics/TransactionHistory";
import { useIsMobile } from "@/hooks/use-mobile";

const Analytics = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">View detailed performance metrics for your store.</p>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-grid">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 pt-4">
          <SummaryCards />
          
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-5' : 'grid-cols-4 gap-6'}`}>
            <SalesChart />
            <TopSellingProducts />
            <OrderStatusChart />
          </div>
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-6 pt-4">
          <TransactionHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
