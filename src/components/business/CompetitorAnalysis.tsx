
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer, Tooltip } from 'recharts';
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowUpRight, ArrowDownRight, Eye, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CompetitorAnalysis() {
  const isMobile = useIsMobile();
  
  // Sample price comparison data
  const priceComparisonData = [
    { product: 'Phone Case', yourPrice: 35, competitor1: 40, competitor2: 30 },
    { product: 'Screen Protector', yourPrice: 25, competitor1: 20, competitor2: 30 },
    { product: 'Earbuds', yourPrice: 70, competitor1: 85, competitor2: 65 },
    { product: 'Charger', yourPrice: 45, competitor1: 40, competitor2: 50 },
    { product: 'Power Bank', yourPrice: 120, competitor1: 110, competitor2: 130 },
  ];
  
  // Sample competitor strength data for radar chart
  const strengthsData = [
    { subject: 'Pricing', A: 90, B: 85, C: 70, fullMark: 100 },
    { subject: 'Quality', A: 80, B: 90, C: 85, fullMark: 100 },
    { subject: 'Selection', A: 85, B: 65, C: 90, fullMark: 100 },
    { subject: 'Customer Service', A: 95, B: 80, C: 75, fullMark: 100 },
    { subject: 'Delivery Speed', A: 75, B: 90, C: 85, fullMark: 100 },
    { subject: 'Online Presence', A: 85, B: 95, C: 70, fullMark: 100 },
  ];
  
  // Sample top competitors
  const topCompetitors = [
    {
      id: 1,
      name: 'MobilePlus Ghana',
      logo: 'MP',
      strengthMetric: '+12%',
      strengthTrend: 'up',
      weakness: 'Higher prices',
      risk: 'medium',
      category: 'Direct Competitor'
    },
    {
      id: 2,
      name: 'TechZone Accessories',
      logo: 'TZ',
      strengthMetric: '+15%',
      strengthTrend: 'up',
      weakness: 'Limited product selection',
      risk: 'high',
      category: 'Direct Competitor'
    },
    {
      id: 3,
      name: 'PhoneWorld',
      logo: 'PW',
      strengthMetric: '-3%',
      strengthTrend: 'down',
      weakness: 'Poor customer service',
      risk: 'low',
      category: 'Indirect Competitor'
    }
  ];
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Competitor Analysis</h2>
      <p className="text-muted-foreground">
        Monitor your competition and identify opportunities
      </p>
      
      {/* Top Competitors */}
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-3 gap-4'}`}>
        {topCompetitors.map((competitor) => (
          <Card key={competitor.id}>
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-muted">{competitor.logo}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{competitor.name}</h3>
                    <div className="flex items-center mt-1">
                      <Badge variant="outline" className="text-xs">
                        {competitor.category}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`ml-2 text-xs ${
                          competitor.risk === 'high' 
                            ? 'border-status-canceled text-status-canceled' 
                            : competitor.risk === 'medium'
                              ? 'border-status-pending text-status-pending'
                              : 'border-status-completed text-status-completed'
                        }`}
                      >
                        {competitor.risk.charAt(0).toUpperCase() + competitor.risk.slice(1)} Risk
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Market Share Growth</span>
                  <div className="flex items-center">
                    {competitor.strengthTrend === 'up' ? (
                      <ArrowUpRight className="h-3 w-3 text-status-canceled mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-status-completed mr-1" />
                    )}
                    <span className={competitor.strengthTrend === 'up' ? 'text-status-canceled' : 'text-status-completed'}>
                      {competitor.strengthMetric}
                    </span>
                  </div>
                </div>
                
                <div className="mt-3">
                  <span className="text-sm text-muted-foreground">Key Weakness:</span>
                  <p className="text-sm">{competitor.weakness}</p>
                </div>
                
                <div className="mt-4">
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Price and Competition Analysis */}
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'md:grid-cols-2 gap-6'}`}>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Price Comparison</CardTitle>
            <CardDescription>
              How your prices compare to top competitors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={priceComparisonData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <Tooltip formatter={(value) => `GHS ${value}`} />
                  <Legend />
                  <Bar dataKey="yourPrice" fill="#8884d8" name="Your Price" />
                  <Bar dataKey="competitor1" fill="#82ca9d" name="MobilePlus" />
                  <Bar dataKey="competitor2" fill="#ffc658" name="TechZone" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Competitive Strengths</CardTitle>
            <CardDescription>
              Analysis of competitive positioning
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={strengthsData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Your Business" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Radar name="MobilePlus" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                  <Radar name="TechZone" dataKey="C" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Competitive Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Competitive Insights</CardTitle>
          <CardDescription>
            Key insights about your competitors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <h3 className="font-medium">Pricing Strategy Gap</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Your prices for charging accessories are on average 15% higher than top competitors. Consider a pricing review for these products to improve competitiveness.
              </p>
              <div className="mt-3">
                <Button variant="outline" size="sm" className="flex items-center">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Take Action
                </Button>
              </div>
            </div>
            
            <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <h3 className="font-medium">Product Range Advantage</h3>
              <p className="text-sm text-muted-foreground mt-1">
                You offer 35% more product variations in screen protectors than your nearest competitor. This is a key competitive advantage to highlight in marketing.
              </p>
              <div className="mt-3">
                <Button variant="outline" size="sm" className="flex items-center">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Take Action
                </Button>
              </div>
            </div>
            
            <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <h3 className="font-medium">Customer Service Opportunity</h3>
              <p className="text-sm text-muted-foreground mt-1">
                PhoneWorld has seen a 3% decline in market share due to poor customer service. There's an opportunity to target their customers with enhanced service offerings.
              </p>
              <div className="mt-3">
                <Button variant="outline" size="sm" className="flex items-center">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Take Action
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
