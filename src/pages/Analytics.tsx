// src/pages/Analytics.tsx
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { TopSellingProducts } from "@/components/dashboard/TopSellingProducts";
import { OrderStatusChart } from "@/components/dashboard/OrderStatusChart";
import { TransactionHistory } from "@/components/analytics/TransactionHistory";
import { useIsMobile } from "@/hooks/use-mobile";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Loader2 } from "lucide-react";

const Analytics = () => {
  const isMobile = useIsMobile();
  const { loading, error } = useDashboardData();

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            View detailed performance metrics for your store.
          </p>
        </div>

        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading analytics data...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            View detailed performance metrics for your store.
          </p>
        </div>

        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-red-600 mb-2">Error loading analytics data</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          View detailed performance metrics for your store.
        </p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-grid">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 pt-4">
          <SummaryCards />

          <div
            className={`grid ${
              isMobile ? "grid-cols-1 gap-5" : "grid-cols-4 gap-6"
            }`}>
            <SalesChart />
            <TopSellingProducts />
            <RecentOrders />
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
