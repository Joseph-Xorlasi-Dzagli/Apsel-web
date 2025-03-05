import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Products } from "@/components/inventory/Products";
import { Categories } from "@/components/inventory/Categories";
import { Button } from "@/components/ui/button";
import { Plus, Grid, List as ListIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Product, ProductOption, Category, sampleProducts, sampleCategories } from "@/lib/data";
import { ProductDetails } from "@/components/inventory/ProductDetails";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Inventory = () => {
  const [activeTab, setActiveTab] = useState<"products" | "categories">("products");
  const [viewMode, setViewMode] = useState<"list" | "tile">("list");
  
  // Product state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOption, setSelectedOption] = useState<ProductOption | null>(null);
  const [detailsMode, setDetailsMode] = useState<"view" | "edit" | "add">("view");
  
  // Category state
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryDetailsMode, setCategoryDetailsMode] = useState<"view" | "edit" | "add">("view");
  
  const { toast } = useToast();
  const [productNameInput, setProductNameInput] = useState("");
  const [existingProducts, setExistingProducts] = useState<Product[]>([]);
  const [showExistingProductsList, setShowExistingProductsList] = useState(false);

  useEffect(() => {
    // When productNameInput changes, filter existing products for autocomplete
    if (productNameInput.length > 1) {
      const matchingProducts = sampleProducts.filter(p => 
        p.name.toLowerCase().includes(productNameInput.toLowerCase())
      );
      setExistingProducts(matchingProducts);
      setShowExistingProductsList(matchingProducts.length > 0);
    } else {
      setExistingProducts([]);
      setShowExistingProductsList(false);
    }
  }, [productNameInput]);

  const handleAddNew = () => {
    if (activeTab === "products") {
      // No longer require a category to be selected
      setDetailsMode("add");
      setSelectedProduct(null);
      setSelectedOption(null);
      setProductNameInput("");
    } else {
      setCategoryDetailsMode("add");
      setSelectedCategory(null);
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
    
    if (detailsMode === "add") {
      // Create a new product, using the selected category if available
      const newProduct: Product = {
        ...updatedProduct,
        id: `product-${Date.now()}`,
        // Use selected category if available, otherwise use a default
        category: selectedCategory ? selectedCategory.name : "Uncategorized",
      };
      setSelectedProduct(newProduct);
      setDetailsMode("view");
    }
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
        setProductNameInput("");
        setShowExistingProductsList(false);
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

  // Category handlers
  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setCategoryDetailsMode("view");
  };

  const handleCategorySave = (category: Category) => {
    // In a real app, this would update the backend
    toast({
      title: "Success",
      description: `Category ${categoryDetailsMode === "add" ? "added" : "updated"} successfully!`,
    });
    
    if (categoryDetailsMode === "add") {
      // Simulate adding a new category
      const newCategory: Category = {
        ...category,
        id: `category-${Date.now()}`,
      };
      setSelectedCategory(newCategory);
      setCategoryDetailsMode("view");
    } else {
      setSelectedCategory(category);
      setCategoryDetailsMode("view");
    }
  };

  const handleCategoryDelete = (categoryId: string) => {
    // In a real app, this would delete from the backend
    toast({
      title: "Success",
      description: "Category deleted successfully!",
    });
    setSelectedCategory(null);
  };

  const handleCloseCategoryDetails = () => {
    if (categoryDetailsMode === "add") {
      setSelectedCategory(null);
      setCategoryDetailsMode("view");
    } else if (categoryDetailsMode === "edit") {
      setCategoryDetailsMode("view");
    }
  };

  const handleSelectExistingProduct = (product: Product) => {
    if (detailsMode === "add") {
      // Create a copy of the selected product with the new category if selected
      const productCopy: Product = {
        ...product,
        id: `product-${Date.now()}`, // New ID for the copy
        // Use selected category if available, otherwise keep the original category
        category: selectedCategory ? selectedCategory.name : product.category,
        options: product.options ? product.options.map(option => ({
          ...option,
          id: `option-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          productId: `product-${Date.now()}`
        })) : []
      };
      setSelectedProduct(productCopy);
      setProductNameInput(product.name);
      setShowExistingProductsList(false);
      
      // Set to view mode to show the newly added product
      setDetailsMode("view");
      
      // Select the standard option by default
      const standardOption = productCopy.options?.find(opt => opt.name === "Standard") || productCopy.options?.[0] || null;
      setSelectedOption(standardOption);
      
      toast({
        title: "Success",
        description: "Product added successfully!",
      });
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
            onValueChange={(value) => {
              setActiveTab(value as "products" | "categories");
              // Reset selections when switching tabs
              if (value === "products") {
                setSelectedCategory(null);
                setCategoryDetailsMode("view");
              } else {
                setSelectedProduct(null);
                setSelectedOption(null);
                setDetailsMode("view");
              }
            }}>
            <TabsList className="grid w-full grid-cols-2 sm:w-[400px]">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
            </TabsList>
            <TabsContent value="products" className="mt-6">
              {detailsMode === "add" && !selectedProduct && (
                <div className="mb-4 relative">
                  <Label htmlFor="productName">Product Name</Label>
                  <Input
                    id="productName"
                    value={productNameInput}
                    onChange={(e) => setProductNameInput(e.target.value)}
                    placeholder="Type to search for existing products or enter a new name"
                    className="mb-2"
                  />
                  {showExistingProductsList && (
                    <div className="absolute z-10 bg-white border rounded-md shadow-lg w-full max-h-60 overflow-y-auto">
                      {existingProducts.map((product) => (
                        <div
                          key={product.id}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleSelectExistingProduct(product)}
                        >
                          {product.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
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
              <Categories 
                viewMode={viewMode}
                selectedCategory={selectedCategory}
                onCategorySelect={handleCategorySelect}
                detailsMode={categoryDetailsMode}
                setDetailsMode={setCategoryDetailsMode}
                handleCategorySave={handleCategorySave}
                handleCategoryDelete={handleCategoryDelete}
                handleCloseDetails={handleCloseCategoryDetails}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
