
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { LightbulbIcon, TrendingUp, BarChart3, ShoppingBag, Target, Calendar, ArrowRight, Filter, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function GrowthOpportunities() {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const handleImplement = (opportunity: string) => {
    toast({
      title: "Opportunity Selected",
      description: `You've selected to implement: ${opportunity}`,
    });
  };
  
  // Sample growth opportunities
  const growthOpportunities = [
    {
      id: 1,
      title: 'Expand Premium Phone Case Line',
      description: 'Market analysis shows high demand for premium phone cases in the GHS 150-250 range. Adding these products could increase revenue by an estimated 18%.',
      impact: 'high',
      effort: 'medium',
      timeframe: '3 months',
      confidence: 85,
      category: 'Product Expansion',
      icon: <ShoppingBag className="h-5 w-5" />
    },
    {
      id: 2,
      title: 'Social Media Advertising Campaign',
      description: 'Instagram and TikTok marketing targeting 18-30 age group with focused ads on new phone accessories could grow your customer base by an estimated 25%.',
      impact: 'medium',
      effort: 'low',
      timeframe: '1 month',
      confidence: 75,
      category: 'Marketing',
      icon: <Users className="h-5 w-5" />
    },
    {
      id: 3,
      title: 'Launch Loyalty Program',
      description: 'Implementing a points-based loyalty program could increase customer retention by 30% and increase average order value by 15% based on market benchmarks.',
      impact: 'high',
      effort: 'high',
      timeframe: '6 months',
      confidence: 90,
      category: 'Customer Retention',
      icon: <Target className="h-5 w-5" />
    },
    {
      id: 4,
      title: 'Seasonal Promotion Strategy',
      description: 'Developing a calendar of seasonal promotions aligned with phone releases and holidays could boost quarterly sales by an estimated 22%.',
      impact: 'medium',
      effort: 'medium',
      timeframe: '3 months',
      confidence: 80,
      category: 'Sales Strategy',
      icon: <Calendar className="h-5 w-5" />
    }
  ];
  
  // Sample key performance indicators
  const keyMetrics = [
    {
      metric: 'Conversion Rate',
      value: '3.5%',
      target: '5.0%',
      progress: 70,
      improvement: '+0.5%',
      recommendation: 'Optimize product pages with better images and descriptions'
    },
    {
      metric: 'Average Order Value',
      value: 'GHS 267',
      target: 'GHS 300',
      progress: 89,
      improvement: '+GHS 12',
      recommendation: 'Implement product bundling and recommendation engine'
    },
    {
      metric: 'Customer Retention',
      value: '45%',
      target: '60%',
      progress: 75,
      improvement: '+3%',
      recommendation: 'Launch email re-engagement campaign'
    }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Growth Opportunities</h2>
          <p className="text-muted-foreground">
            Data-driven recommendations to grow your business
          </p>
        </div>
        
        <Button>
          <Filter className="mr-2 h-4 w-4" />
          Filter Opportunities
        </Button>
      </div>
      
      {/* Top Growth Opportunities */}
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'md:grid-cols-2 gap-6'}`}>
        {growthOpportunities.map((opportunity) => (
          <Card key={opportunity.id} className="overflow-hidden">
            <CardHeader className="bg-brand-light bg-opacity-20 border-b">
              <div className="flex justify-between items-center">
                <Badge className="bg-brand text-white">
                  {opportunity.category}
                </Badge>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={
                    opportunity.impact === 'high' 
                      ? 'border-green-500 text-green-500' 
                      : opportunity.impact === 'medium'
                        ? 'border-yellow-500 text-yellow-500'
                        : 'border-blue-500 text-blue-500'
                  }>
                    {opportunity.impact.charAt(0).toUpperCase() + opportunity.impact.slice(1)} Impact
                  </Badge>
                  <Badge variant="outline" className={
                    opportunity.effort === 'low' 
                      ? 'border-green-500 text-green-500' 
                      : opportunity.effort === 'medium'
                        ? 'border-yellow-500 text-yellow-500'
                        : 'border-red-500 text-red-500'
                  }>
                    {opportunity.effort.charAt(0).toUpperCase() + opportunity.effort.slice(1)} Effort
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <div className="p-2 rounded-full bg-brand bg-opacity-20">
                  {opportunity.icon}
                </div>
                <CardTitle className="text-lg">{opportunity.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">
                {opportunity.description}
              </p>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center">
                  <LightbulbIcon className="h-4 w-4 mr-2 text-brand" />
                  <span className="text-sm">{opportunity.confidence}% Confidence</span>
                </div>
                <span className="text-sm text-muted-foreground">{opportunity.timeframe} timeframe</span>
              </div>
              
              <div className="mt-4">
                <Button className="w-full" onClick={() => handleImplement(opportunity.title)}>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Implement This Opportunity
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Key Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Key Performance Opportunities</CardTitle>
          <CardDescription>
            Priority metrics to improve for maximum growth
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {keyMetrics.map((item, index) => (
              <div key={index} className={`${index < keyMetrics.length - 1 ? 'pb-6 border-b' : ''}`}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="font-medium flex items-center">
                      <BarChart3 className="mr-2 h-4 w-4 text-brand" />
                      {item.metric}
                    </h3>
                    <div className="flex items-center mt-1">
                      <span className="text-xl font-bold">{item.value}</span>
                      <span className="text-muted-foreground mx-2">of</span>
                      <span className="text-muted-foreground">{item.target} target</span>
                      <Badge className="ml-3 bg-status-completed text-white">
                        {item.improvement}
                      </Badge>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3 md:mt-0"
                    onClick={() => handleImplement(item.recommendation)}
                  >
                    Improve Metric
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                
                <div className="mt-3 space-y-2">
                  <Progress value={item.progress} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Recommendation:</span> {item.recommendation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Growth Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Growth Resources</CardTitle>
          <CardDescription>
            Tools and guides to help you implement growth strategies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <h3 className="font-medium">Marketing Playbook</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Step-by-step guide for creating effective marketing campaigns for mobile accessories.
              </p>
              <Button variant="link" className="mt-2 h-auto p-0">
                Download Playbook
              </Button>
            </div>
            
            <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <h3 className="font-medium">Pricing Calculator</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Tool to calculate optimal pricing based on costs, market data, and profit targets.
              </p>
              <Button variant="link" className="mt-2 h-auto p-0">
                Use Calculator
              </Button>
            </div>
            
            <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <h3 className="font-medium">Customer Retention Guide</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Strategies and tactics to increase customer loyalty and repeat purchases.
              </p>
              <Button variant="link" className="mt-2 h-auto p-0">
                View Guide
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
