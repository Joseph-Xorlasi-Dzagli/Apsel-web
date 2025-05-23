import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAnalytics } from "@/hooks/useAnalytics";

export function OrderStatusChart() {
  const { loading, orders, getOrdersByStatus } = useAnalytics();

  const orderStatusData = getOrdersByStatus(orders);

  const data = [
    { name: "Completed", value: orderStatusData.completed, color: "#10B981" },
    { name: "Pending", value: orderStatusData.pending, color: "#F97316" },
    { name: "Processing", value: orderStatusData.processing, color: "#6366F1" },
    { name: "Canceled", value: orderStatusData.canceled, color: "#EF4444" },
  ].filter((item) => item.value > 0);

  return (
    <Card className="col-span-1 animate-in-slide">
      <CardHeader>
        <CardTitle>Order Status</CardTitle>
        <CardDescription>Distribution by status</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[240px] flex items-center justify-center">
            <div className="h-40 w-40 bg-muted rounded-full animate-pulse"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="h-[240px] flex flex-col items-center justify-center">
            <p className="text-muted-foreground">No order data available</p>
          </div>
        ) : (
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [value, "Orders"]}
                  labelFormatter={(index) => data[index]?.name || ""}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default OrderStatusChart;