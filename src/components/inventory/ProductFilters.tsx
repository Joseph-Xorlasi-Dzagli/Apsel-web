
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProductFiltersProps {
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  stockFilter: "all" | "in-stock" | "low-stock" | "out-of-stock";
  setStockFilter: (status: "all" | "in-stock" | "low-stock" | "out-of-stock") => void;
  categories: string[];
}

export function ProductFilters({
  categoryFilter,
  setCategoryFilter,
  stockFilter,
  setStockFilter,
  categories,
}: ProductFiltersProps) {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div>
        <h3 className="mb-2 text-sm font-medium text-foreground">Category</h3>
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
        <h3 className="mb-2 text-sm font-medium text-foreground">Stock Status</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={stockFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setStockFilter("all")}
          >
            All
          </Button>
          <Button
            variant={stockFilter === "in-stock" ? "default" : "outline"}
            size="sm"
            onClick={() => setStockFilter("in-stock")}
          >
            In Stock
          </Button>
          <Button
            variant={stockFilter === "low-stock" ? "default" : "outline"}
            size="sm"
            onClick={() => setStockFilter("low-stock")}
          >
            Low Stock
          </Button>
          <Button
            variant={stockFilter === "out-of-stock" ? "default" : "outline"}
            size="sm"
            onClick={() => setStockFilter("out-of-stock")}
          >
            Out of Stock
          </Button>
        </div>
      </div>
    </div>
  );
}
