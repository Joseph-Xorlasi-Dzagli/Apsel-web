import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface Category {
  id: string;
  name: string;
}

interface ProductFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  sortBy: "name" | "price" | "stock" | "sold";
  setSortBy: (sortBy: "name" | "price" | "stock" | "sold") => void;
  categories?: Category[];
}

export function ProductFilters({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  sortBy,
  setSortBy,
  categories = [],
}: ProductFiltersProps) {
  const isMobile = useIsMobile();

  // Add a safety wrapper for categoryFilter changes
  const handleCategoryChange = (categoryId: string) => {
    console.log("Setting category filter to:", categoryId);
    if (typeof setCategoryFilter === "function") {
      setCategoryFilter(categoryId);
    } else {
      console.error("setCategoryFilter is not a function:", setCategoryFilter);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative w-full sm:w-72 h-full pt-6 mr-8">
          <Search className="absolute left-3 bottom-3 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-medium">Category</h3>
          <div className="flex flex-wrap gap-2 max-w-screen-md">
            <Button
              variant={categoryFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryChange("all")}>
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={categoryFilter === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange(category.id)}>
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        <div className={isMobile ? "mt-2" : "ml-auto"}>
          <h3 className="mb-2 text-sm font-medium">Sort By</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={sortBy === "name" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("name")}>
              Name
            </Button>
            <Button
              variant={sortBy === "price" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("price")}>
              Price
            </Button>
            <Button
              variant={sortBy === "stock" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("stock")}>
              Stock
            </Button>
            <Button
              variant={sortBy === "sold" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("sold")}>
              Sold
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
