
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Edit, MoreHorizontal, Search, Trash } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { sampleProducts, sampleCategories } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { ProductFilters } from "./ProductFilters";

export function Products() {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<"all" | "in-stock" | "low-stock" | "out-of-stock">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<"name" | "price" | "stock" | "sold">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const productsPerPage = 10;

  const handleEdit = (product: any) => {
    toast({
      title: "Edit Product",
      description: `You are editing ${product.name}`,
    });
  };

  const handleDelete = (product: any) => {
    toast({
      title: "Delete Product",
      description: `You want to delete ${product.name}`,
      variant: "destructive",
    });
  };

  // Filter products based on search, category and stock
  const filterProducts = () => {
    let filtered = [...sampleProducts];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.category.toLowerCase().includes(term)
      );
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter((product) => product.category === categoryFilter);
    }

    // Filter by stock
    if (stockFilter === "in-stock") {
      filtered = filtered.filter((product) => product.stock > 10);
    } else if (stockFilter === "low-stock") {
      filtered = filtered.filter((product) => product.stock > 0 && product.stock <= 10);
    } else if (stockFilter === "out-of-stock") {
      filtered = filtered.filter((product) => product.stock === 0);
    }

    // Sort products
    filtered.sort((a, b) => {
      let compareResult = 0;

      switch (sortBy) {
        case "name":
          compareResult = a.name.localeCompare(b.name);
          break;
        case "price":
          compareResult = a.price - b.price;
          break;
        case "stock":
          compareResult = a.stock - b.stock;
          break;
        case "sold":
          compareResult = a.sold - b.sold;
          break;
      }

      return sortOrder === "asc" ? compareResult : -compareResult;
    });

    return filtered;
  };

  const filteredProducts = filterProducts();
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const getStockStatus = (stock: number) => {
    if (stock === 0) return <Badge variant="destructive">Out of stock</Badge>;
    if (stock <= 10) return <Badge variant="outline" className="text-status-pending border-status-pending">Low stock</Badge>;
    return <Badge variant="outline" className="text-status-completed border-status-completed">In stock</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col-reverse md:flex-row gap-4 justify-between">
        <ProductFilters 
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          stockFilter={stockFilter}
          setStockFilter={setStockFilter}
          categories={sampleCategories.map(cat => cat.name)}
        />
        
        <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={`${sortBy}-${sortOrder}`} onValueChange={(val) => {
            const [newSortBy, newSortOrder] = val.split('-') as ["name" | "price" | "stock" | "sold", "asc" | "desc"];
            setSortBy(newSortBy);
            setSortOrder(newSortOrder);
          }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="price-asc">Price (Low to High)</SelectItem>
              <SelectItem value="price-desc">Price (High to Low)</SelectItem>
              <SelectItem value="stock-asc">Stock (Low to High)</SelectItem>
              <SelectItem value="stock-desc">Stock (High to Low)</SelectItem>
              <SelectItem value="sold-asc">Sales (Low to High)</SelectItem>
              <SelectItem value="sold-desc">Sales (High to Low)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>
            {totalProducts} products found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isMobile ? (
            <div className="space-y-4">
              {currentProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-4 border rounded-lg space-y-3 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 rounded-md border">
                        <AvatarImage src={product.image} alt={product.name} />
                        <AvatarFallback className="rounded-md">
                          {product.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(product)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDelete(product)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold">GHS {product.price.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">{product.sold} sold</p>
                    </div>
                    <div className="flex flex-col items-end">
                      {getStockStatus(product.stock)}
                      <span className="text-sm mt-1">{product.stock} in stock</span>
                    </div>
                  </div>
                </div>
              ))}
              
              {currentProducts.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No products found</p>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left p-3 font-medium text-xs uppercase text-muted-foreground">
                        Product
                      </th>
                      <th className="text-left p-3 font-medium text-xs uppercase text-muted-foreground">
                        Category
                      </th>
                      <th className="text-right p-3 font-medium text-xs uppercase text-muted-foreground">
                        Price
                      </th>
                      <th className="text-right p-3 font-medium text-xs uppercase text-muted-foreground">
                        Stock
                      </th>
                      <th className="text-right p-3 font-medium text-xs uppercase text-muted-foreground">
                        Total Sales
                      </th>
                      <th className="text-right p-3 font-medium text-xs uppercase text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="border-t hover:bg-muted/50 transition-colors"
                      >
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 rounded-md border">
                              <AvatarImage src={product.image} alt={product.name} />
                              <AvatarFallback className="rounded-md">
                                {product.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{product.name}</span>
                          </div>
                        </td>
                        <td className="p-3">{product.category}</td>
                        <td className="p-3 text-right font-medium">
                          GHS {product.price.toFixed(2)}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex flex-col items-end">
                            {getStockStatus(product.stock)}
                            <span className="text-sm mt-1">{product.stock} units</span>
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          {product.sold} units
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-1">
                            <Button size="icon" variant="ghost" onClick={() => handleEdit(product)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDelete(product)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    
                    {currentProducts.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-10 text-center text-muted-foreground">
                          No products found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * productsPerPage + 1} to{" "}
                {Math.min(currentPage * productsPerPage, totalProducts)} of{" "}
                {totalProducts} products
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
