
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { BusinessOverview } from "@/components/business/BusinessOverview";
import { MarketInsights } from "@/components/business/MarketInsights";
import { CompetitorAnalysis } from "@/components/business/CompetitorAnalysis";
import { GrowthOpportunities } from "@/components/business/GrowthOpportunities";
import BusinessProfile from "@/components/business/BusinessProfile";

const BusinessHub = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<string>("profile");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Business Hub</h1>
        <p className="text-muted-foreground">
          Manage your business profile and insights
        </p>
      </div>

      <Card className="border-none">
        <CardContent className="p-0">
          <Tabs 
            defaultValue="profile" 
            onValueChange={(value) => setActiveTab(value)}
            className="w-full"
          >
            <div className="p-6">
              <TabsContent value="profile" className="mt-0 space-y-6">
                <BusinessProfile />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessHub;
