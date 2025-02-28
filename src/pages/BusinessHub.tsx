
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { BusinessOverview } from "@/components/business/BusinessOverview";
import { MarketInsights } from "@/components/business/MarketInsights";
import { CompetitorAnalysis } from "@/components/business/CompetitorAnalysis";
import { GrowthOpportunities } from "@/components/business/GrowthOpportunities";

const BusinessHub = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<string>("overview");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Business Hub</h1>
        <p className="text-muted-foreground">
          Insights and tools to grow your business
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Business Center</CardTitle>
          <CardDescription>
            View comprehensive business analytics and find growth opportunities
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs 
            defaultValue="overview" 
            onValueChange={(value) => setActiveTab(value)}
            className="w-full"
          >
            <div className="px-6 pt-2">
              <TabsList className={`w-full grid ${isMobile ? "grid-cols-2 gap-2" : "grid-cols-4"}`}>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="market">Market Insights</TabsTrigger>
                <TabsTrigger value="competitors">Competitor Analysis</TabsTrigger>
                <TabsTrigger value="growth">Growth Opportunities</TabsTrigger>
              </TabsList>
            </div>
            
            <div className="p-6">
              <TabsContent value="overview" className="mt-0 space-y-6">
                <BusinessOverview />
              </TabsContent>
              
              <TabsContent value="market" className="mt-0 space-y-6">
                <MarketInsights />
              </TabsContent>
              
              <TabsContent value="competitors" className="mt-0 space-y-6">
                <CompetitorAnalysis />
              </TabsContent>
              
              <TabsContent value="growth" className="mt-0 space-y-6">
                <GrowthOpportunities />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessHub;
