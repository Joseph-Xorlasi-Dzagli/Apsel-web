
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { Download, ExternalLink } from "lucide-react";

export function MarketInsights() {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const handleDownloadReport = () => {
    toast({
      title: "Report Download",
      description: "Market insights report will be available soon!",
    });
  };
  
  // Sample market trend data
  const marketTrendData = [
    { month: 'Jan', industry: 2400, yourBusiness: 1800 },
    { month: 'Feb', industry: 2600, yourBusiness: 2100 },
    { month: 'Mar', industry: 2900, yourBusiness: 2500 },
    { month: 'Apr', industry: 3100, yourBusiness: 2800 },
    { month: 'May', industry: 3300, yourBusiness: 3200 },
    { month: 'Jun', industry: 3600, yourBusiness: 3500 },
  ];
  
  // Sample category trend data
  const categoryTrendData = [
    { category: 'Phones', growth: 15 },
    { category: 'Tablets', growth: 8 },
    { category: 'Laptops', growth: 12 },
    { category: 'Accessories', growth: 22 },
    { category: 'Wearables', growth: 18 },
    { category: 'Audio', growth: 10 },
  ];
  
  // Sample regional data
  const regionalData = [
    { region: 'Greater Accra', sales: 4500 },
    { region: 'Ashanti', sales: 3200 },
    { region: 'Western', sales: 2100 },
    { region: 'Eastern', sales: 1900 },
    { region: 'Central', sales: 1600 },
    { region: 'Northern', sales: 1200 },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Market Insights</h2>
          <p className="text-muted-foreground">
            Understand market trends and how your business compares
          </p>
        </div>
        
        <Button onClick={handleDownloadReport}>
          <Download className="mr-2 h-4 w-4" />
          Download Report
        </Button>
      </div>
      
      {/* Market Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Industry Growth Trends</CardTitle>
          <CardDescription>
            Compare your business growth with industry average
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={marketTrendData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="industry" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                  name="Industry Average"
                />
                <Line 
                  type="monotone" 
                  dataKey="yourBusiness" 
                  stroke="#82ca9d" 
                  activeDot={{ r: 8 }} 
                  name="Your Business"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Category Growth and Regional Sales */}
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'md:grid-cols-2 gap-6'}`}>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Category Growth Rates</CardTitle>
            <CardDescription>
              Year-over-year growth by product category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryTrendData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 25]} />
                  <YAxis dataKey="category" type="category" width={100} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                  <Bar dataKey="growth" fill="#8884d8" name="Growth %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Regional Sales Distribution</CardTitle>
            <CardDescription>
              Sales performance by geographic region
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={regionalData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" />
                  <YAxis />
                  <Tooltip formatter={(value) => `GHS ${value}`} />
                  <Legend />
                  <Bar dataKey="sales" fill="#82ca9d" name="Sales" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Market Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Latest Market Research</CardTitle>
          <CardDescription>
            Recent reports and analysis relevant to your business
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <h3 className="font-medium">Mobile Accessories Market Report 2023</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Comprehensive analysis of the mobile accessories market in Ghana, including growth projections, consumer behavior, and emerging trends.
              </p>
              <div className="mt-3">
                <Button variant="outline" size="sm" className="flex items-center">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Report
                </Button>
              </div>
            </div>
            
            <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <h3 className="font-medium">Consumer Electronics Purchasing Trends</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Insights into how Ghanaian consumers are purchasing electronics in 2023, with key demographic data and channel preferences.
              </p>
              <div className="mt-3">
                <Button variant="outline" size="sm" className="flex items-center">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Report
                </Button>
              </div>
            </div>
            
            <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <h3 className="font-medium">E-commerce Growth in West Africa</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Analysis of e-commerce adoption and growth across West African countries, with focus on mobile device usage.
              </p>
              <div className="mt-3">
                <Button variant="outline" size="sm" className="flex items-center">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Report
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
