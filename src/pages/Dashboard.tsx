
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { TopSellingProducts } from "@/components/dashboard/TopSellingProducts";
import { OrderStatusChart } from "@/components/dashboard/OrderStatusChart";
import { useIsMobile } from "@/hooks/use-mobile";

const Dashboard = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">View your store performance at a glance.</p>
      </div>
      
      <SummaryCards />
      
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-5' : 'grid-cols-4 gap-6'}`}>
        <SalesChart />
        <RecentOrders />
        <TopSellingProducts />
        {/* <OrderStatusChart /> */}
      </div>
    </div>
  );
};

export default Dashboard;
