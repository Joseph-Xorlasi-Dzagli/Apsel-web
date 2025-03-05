
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Products } from "@/components/inventory/Products";
import { Categories } from "@/components/inventory/Categories";
import { Button } from "@/components/ui/button";
import { Plus, Grid, List as ListIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Product, ProductOption, sampleProducts } from "@/lib/data";
import { ProductDetails } from "@/components/inventory/ProductDetails";

const Inventory = () => {
  const [activeTab, setActiveTab] = useState<"products" | "categories">("products");
  const [viewMode, setViewMode] = useState<"list" | "tile">("list");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOption, setSelectedOption] = useState<ProductOption | null>(null);
  const [detailsMode, setDetailsMode] = useState<"view" | "edit" | "add">("view");
  const { toast } = useToast();

  const handleAddNew = () => {
    if (activeTab === "products") {
      setDetailsMode("add");
      setSelectedProduct(null);
      setSelectedOption(null);
    } else {
      toast({
        title: "Add New Category",
        description: "This feature will be available soon!",
      });
    }
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    // Select the standard option by default
    const standardOption = product.options?.find(opt => opt.name === "Standard") || product.options?.[0] || null;
    setSelectedOption(standardOption);
    setDetailsMode("view");
  };

  const handleOptionSelect = (option: ProductOption) => {
    setSelectedOption(option);
    setDetailsMode("view");
  };

  const handleAddOption = () => {
    if (!selectedProduct) return;
    setSelectedOption(null);
    setDetailsMode("add");
  };

  const handleProductSave = (updatedProduct: Product) => {
    // In a real app, this would update the backend
    toast({
      title: "Success",
      description: `Product ${detailsMode === "add" ? "added" : "updated"} successfully!`,
    });
  };

  const handleOptionSave = (option: ProductOption) => {
    // In a real app, this would update the backend
    toast({
      title: "Success",
      description: `Product option ${detailsMode === "add" ? "added" : "updated"} successfully!`,
    });
    
    if (detailsMode === "add" && selectedProduct) {
      // Simulate adding the option to the product
      const newOption: ProductOption = {
        ...option,
        id: `option-${Date.now()}`,
        productId: selectedProduct.id,
      };
      setSelectedOption(newOption);
      setDetailsMode("view");
    } else if (detailsMode === "edit") {
      setSelectedOption(option);
      setDetailsMode("view");
    }
  };

  const handleProductDelete = (productId: string) => {
    // In a real app, this would delete from the backend
    toast({
      title: "Success",
      description: "Product deleted successfully!",
    });
    setSelectedProduct(null);
    setSelectedOption(null);
  };

  const handleOptionDelete = (optionId: string) => {
    // In a real app, this would delete from the backend
    toast({
      title: "Success",
      description: "Product option deleted successfully!",
    });
    
    if (selectedProduct && selectedProduct.options) {
      // If we delete the currently selected option, select the standard one instead
      const standardOption = selectedProduct.options.find(opt => opt.name === "Standard" && opt.id !== optionId);
      if (standardOption) {
        setSelectedOption(standardOption);
      } else if (selectedProduct.options.length > 1) {
        // If no standard option, select the first one that's not the deleted one
        const firstOption = selectedProduct.options.find(opt => opt.id !== optionId);
        setSelectedOption(firstOption || null);
      } else {
        setSelectedOption(null);
      }
    }
  };

  const handleCloseDetails = () => {
    if (detailsMode === "add") {
      // If adding a new product, clear everything
      if (!selectedProduct) {
        setSelectedProduct(null);
        setSelectedOption(null);
        setDetailsMode("view");
      } else {
        // If adding an option, go back to view mode for the selected product
        setDetailsMode("view");
        if (selectedProduct && selectedProduct.options?.length) {
          setSelectedOption(selectedProduct.options[0]);
        }
      }
    } else if (detailsMode === "edit" && selectedOption) {
      setDetailsMode("view");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">
            Manage your products and categories
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              className="rounded-r-none"
              onClick={() => setViewMode("list")}>
              <ListIcon className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "tile" ? "default" : "outline"}
              size="icon"
              className="rounded-l-none"
              onClick={() => setViewMode("tile")}>
              <Grid className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" />
            Add New {activeTab === "products" ? "Product" : "Category"}
          </Button>
        </div>
      </div>

      <div>
        <div>
          <Tabs
            defaultValue="products"
            onValueChange={(value) =>
              setActiveTab(value as "products" | "categories")
            }>
            <TabsList className="grid w-full grid-cols-2 sm:w-[400px]">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
            </TabsList>
            <TabsContent value="products" className="mt-6">
              <Products
                viewMode={viewMode}
                onProductSelect={handleProductSelect}
                selectedProduct={selectedProduct}
                selectedOption={selectedOption}
                detailsMode={detailsMode}
                handleOptionSave={handleOptionSave}
                handleOptionDelete={handleOptionDelete}
                setDetailsMode={setDetailsMode}
                handleCloseDetails={handleCloseDetails}
                handleAddOption={handleAddOption}
                handleOptionSelect={handleOptionSelect}
              />
            </TabsContent>
            <TabsContent value="categories" className="mt-6">
              <Categories viewMode={viewMode} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
