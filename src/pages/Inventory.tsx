
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Products } from "@/components/inventory/Products";
import { Categories } from "@/components/inventory/Categories";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Inventory = () => {
  const [activeTab, setActiveTab] = useState<"products" | "categories">("products");
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
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add New {activeTab === "products" ? "Product" : "Category"}
        </Button>
      </div>

      <Tabs defaultValue="products" onValueChange={(value) => setActiveTab(value as "products" | "categories")}>
        <TabsList className="grid w-full grid-cols-2 sm:w-[400px]">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        <TabsContent value="products" className="mt-6">
          <Products />
        </TabsContent>
        <TabsContent value="categories" className="mt-6">
          <Categories />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Inventory;
