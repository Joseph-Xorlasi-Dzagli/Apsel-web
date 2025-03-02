
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Products } from "@/components/inventory/Products";
import { Categories } from "@/components/inventory/Categories";
import { Button } from "@/components/ui/button";
import { Plus, Grid, List as ListIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Inventory = () => {
  const [activeTab, setActiveTab] = useState<"products" | "categories">("products");
  const [viewMode, setViewMode] = useState<"list" | "tile">("list");
  const { toast } = useToast();

  const handleAddNew = () => {
    toast({
      title: `Add New ${activeTab === "products" ? "Product" : "Category"}`,
      description: "This feature will be available soon!",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">Manage your products and categories</p>
        </div>
        <div className="flex gap-2">
          <div className="flex">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              className="rounded-r-none"
              onClick={() => setViewMode("list")}
            >
              <ListIcon className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "tile" ? "default" : "outline"}
              size="icon"
              className="rounded-l-none"
              onClick={() => setViewMode("tile")}
            >
              <Grid className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" />
            Add New {activeTab === "products" ? "Product" : "Category"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="products" onValueChange={(value) => setActiveTab(value as "products" | "categories")}>
        <TabsList className="grid w-full grid-cols-2 sm:w-[400px]">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        <TabsContent value="products" className="mt-6">
          <Products viewMode={viewMode} />
        </TabsContent>
        <TabsContent value="categories" className="mt-6">
          <Categories viewMode={viewMode} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Inventory;
