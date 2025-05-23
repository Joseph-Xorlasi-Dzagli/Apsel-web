import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Products } from "@/components/inventory/Products";
import { Categories } from "@/components/inventory/Categories";
import { Button } from "@/components/ui/button";
import { Plus, Grid, List as ListIcon } from "lucide-react";
import { useInventory } from "@/hooks/useInventory";
// import { Spinner } from "@/components/ui/spinner";

const Inventory = () => {
  const [activeTab, setActiveTab] = useState<"products" | "categories">(
    "products"
  );
  const [viewMode, setViewMode] = useState<"list" | "tile">("list");

  const {
    // Data
    products,
    filteredProducts,
    categories,
    selectedProduct,
    selectedOption,
    selectedCategory,
    loading,

    // Filters
    searchTerm,
    categoryFilter,
    sortBy,
    setSearchTerm,
    setCategoryFilter,
    setSortBy,

    // Mode Management
    productDetailsMode,
    categoryDetailsMode,
    setProductDetailsMode,
    setCategoryDetailsMode,

    // Handler Functions
    handleAddNew,
    handleProductSelect,
    handleOptionSelect,
    handleCategorySelect,
    handleAddOption,
    handleProductSave,
    handleOptionSave,
    handleProductDelete,
    handleOptionDelete,
    handleCategorySave,
    handleCategoryDelete,
    handleCloseProductDetails,
    handleCloseCategoryDetails,
  } = useInventory();

  const handleAddNewClick = () => {
    if (activeTab === "products") {
      handleAddNew("product");
    } else {
      handleAddNew("category");
    }
  };

  // if (loading && !products.length && !categories.length) {
  //   return (
  //     <div className="flex items-center justify-center h-[80vh]">
  //       <Spinner size="lg" />
  //     </div>
  //   );
  // }

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
          <Button onClick={handleAddNewClick}>
            <Plus className="mr-2 h-4 w-4" />
            Add New {activeTab === "products" ? "Product" : "Category"}
          </Button>
        </div>
      </div>

      <div>
        <div>
          <Tabs
            defaultValue="products"
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value as "products" | "categories");
              // Reset selections when switching tabs
              if (value === "products") {
                setCategoryDetailsMode("view");
              } else {
                setProductDetailsMode("view");
              }
            }}>
            <TabsList className="grid w-full grid-cols-2 sm:w-[400px]">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
            </TabsList>
            <TabsContent value="products" className="mt-6">
              <Products
                viewMode={viewMode}
                products={filteredProducts || []}
                categories={categories || []}
                searchTerm={searchTerm}
                categoryFilter={categoryFilter}
                sortBy={sortBy}
                setSearchTerm={setSearchTerm}
                setCategoryFilter={setCategoryFilter}
                setSortBy={setSortBy}
                onProductSelect={handleProductSelect}
                selectedProduct={selectedProduct}
                selectedOption={selectedOption}
                detailsMode={productDetailsMode}
                handleOptionSave={handleOptionSave}
                handleOptionDelete={handleOptionDelete}
                setDetailsMode={setProductDetailsMode}
                handleCloseDetails={handleCloseProductDetails}
                handleAddOption={handleAddOption}
                handleOptionSelect={handleOptionSelect}
                handleProductSave={handleProductSave}
                handleProductDelete={handleProductDelete}
                loading={loading}
              />
            </TabsContent>
            <TabsContent value="categories" className="mt-6">
              <Categories
                viewMode={viewMode}
                categories={categories || []}
                selectedCategory={selectedCategory}
                onCategorySelect={handleCategorySelect}
                detailsMode={categoryDetailsMode}
                setDetailsMode={setCategoryDetailsMode}
                handleCategorySave={handleCategorySave}
                handleCategoryDelete={handleCategoryDelete}
                handleCloseDetails={handleCloseCategoryDetails}
                loading={loading}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
