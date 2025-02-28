
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ArrowDownRight, ArrowUpRight, TrendingUp, Users, ShoppingBag, CreditCard } from "lucide-react";

export function BusinessOverview() {
  const isMobile = useIsMobile();
  
  // Sample data for charts
  const revenueData = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 5000 },
    { name: 'Apr', revenue: 4500 },
    { name: 'May', revenue: 6000 },
    { name: 'Jun', revenue: 5500 },
  ];
  
  const customerSegmentData = [
    { name: 'New', value: 35 },
    { name: 'Returning', value: 45 },
    { name: 'Loyal', value: 20 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];
  
  const channelPerformanceData = [
    { name: 'Website', sales: 2400, returns: 400 },
    { name: 'Mobile App', sales: 1398, returns: 210 },
    { name: 'Social Media', sales: 9800, returns: 380 },
    { name: 'Marketplace', sales: 3908, returns: 590 },
  ];
  
  return (
    <div className="space-y-6">
      {/* Business Metrics */}
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-4 gap-6'}`}>
        <BusinessMetricCard 
          title="Total Revenue"
          value="GHS 145,200"
          change="+12.5%"
          trend="up"
          icon={<CreditCard className="h-6 w-6" />}
          description="vs. previous period"
        />
        <BusinessMetricCard 
          title="Active Customers"
          value="2,315"
          change="+8.1%"
          trend="up"
          icon={<Users className="h-6 w-6" />}
          description="vs. previous period"
        />
        <BusinessMetricCard 
          title="Total Orders"
          value="5,432"
          change="+15.3%"
          trend="up"
          icon={<ShoppingBag className="h-6 w-6" />}
          description="vs. previous period"
        />
        <BusinessMetricCard 
          title="Average Order Value"
          value="GHS 267.15"
          change="-3.2%"
          trend="down"
          icon={<TrendingUp className="h-6 w-6" />}
          description="vs. previous period"
        />
      </div>
      
      {/* Charts */}
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'md:grid-cols-2 gap-6'}`}>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>
              Last 6 months revenue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={revenueData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `GHS ${value}`} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Channel Performance</CardTitle>
            <CardDescription>
              Sales and returns by channel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={channelPerformanceData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `GHS ${value}`} />
                  <Legend />
                  <Bar dataKey="sales" fill="#8884d8" />
                  <Bar dataKey="returns" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'md:grid-cols-2 gap-6'}`}>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Customer Segments</CardTitle>
            <CardDescription>
              Distribution of customer types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={customerSegmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {customerSegmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Business Health</CardTitle>
            <CardDescription>
              Key performance indicators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Customer Acquisition Cost</span>
                  <span className="text-sm font-medium">GHS 45.20</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <p className="text-xs text-muted-foreground">Cost of acquiring a new customer</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Customer Lifetime Value</span>
                  <span className="text-sm font-medium">GHS 1,250.00</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '80%' }}></div>
                </div>
                <p className="text-xs text-muted-foreground">Average revenue from a customer over their lifespan</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Conversion Rate</span>
                  <span className="text-sm font-medium">3.5%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-orange-600 h-2.5 rounded-full" style={{ width: '35%' }}></div>
                </div>
                <p className="text-xs text-muted-foreground">Percentage of visitors who complete a purchase</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Net Profit Margin</span>
                  <span className="text-sm font-medium">15.8%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <p className="text-xs text-muted-foreground">Percentage of revenue that is profit</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface BusinessMetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
  description: string;
}

function BusinessMetricCard({ title, value, change, trend, icon, description }: BusinessMetricCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-brand-light flex items-center justify-center text-brand">
            {icon}
          </div>
        </div>
        <div className="mt-4 flex items-center">
          {trend === 'up' ? (
            <ArrowUpRight className="mr-2 h-4 w-4 text-status-completed" />
          ) : (
            <ArrowDownRight className="mr-2 h-4 w-4 text-status-canceled" />
          )}
          <span className={trend === 'up' ? 'text-status-completed' : 'text-status-canceled'}>
            {change}
          </span>
          <span className="ml-1 text-muted-foreground">{description}</span>
        </div>
      </CardContent>
    </Card>
  );
}
