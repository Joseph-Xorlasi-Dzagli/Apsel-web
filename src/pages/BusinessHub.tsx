
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { BusinessOverview } from "@/components/business/BusinessOverview";
import { MarketInsights } from "@/components/business/MarketInsights";
import { CompetitorAnalysis } from "@/components/business/CompetitorAnalysis";
import { GrowthOpportunities } from "@/components/business/GrowthOpportunities";
import BusinessProfile from "@/components/business/BusinessProfile";
import { ChartBar, Users, BarChart3, TrendingUp, Building } from "lucide-react";

const BusinessHub = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<string>("profile");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Business Hub</h1>
        <p className="text-muted-foreground">
          Manage your business profile and access valuable insights
        </p>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <Tabs 
            defaultValue="profile" 
            onValueChange={(value) => setActiveTab(value)}
            className="w-full"
          >
            <div className="px-6 pt-4">
              <TabsList className={`w-full grid ${isMobile ? "grid-cols-2 gap-2" : "grid-cols-5"}`}>
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  <span className={isMobile ? "hidden" : "inline"}>Profile</span>
                </TabsTrigger>
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <ChartBar className="h-4 w-4" />
                  <span className={isMobile ? "hidden" : "inline"}>Overview</span>
                </TabsTrigger>
                <TabsTrigger value="market" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className={isMobile ? "hidden" : "inline"}>Market</span>
                </TabsTrigger>
                <TabsTrigger value="competitors" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className={isMobile ? "hidden" : "inline"}>Competitors</span>
                </TabsTrigger>
                <TabsTrigger value="growth" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className={isMobile ? "hidden" : "inline"}>Growth</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="p-6">
              <TabsContent value="profile" className="mt-0 space-y-6">
                <BusinessProfile />
              </TabsContent>
              
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
