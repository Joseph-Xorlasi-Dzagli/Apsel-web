
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProductFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  sortBy: "name" | "price" | "stock";
  setSortBy: (sortBy: "name" | "price" | "stock") => void;
  categories?: string[];
}

export function ProductFilters({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  sortBy,
  setSortBy,
  categories = ["Electronics", "Clothing", "Food & Beverages", "Home & Garden"],
}: ProductFiltersProps) {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-4">
      <div className="relative w-full sm:w-64 mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <h3 className="mb-2 text-sm font-medium">Category</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={categoryFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setCategoryFilter("all")}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={categoryFilter === category ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter(category)}
              >
                {category}
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
              onClick={() => setSortBy("name")}
            >
              Name
            </Button>
            <Button
              variant={sortBy === "price" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("price")}
            >
              Price
            </Button>
            <Button
              variant={sortBy === "stock" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("stock")}
            >
              Stock
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
