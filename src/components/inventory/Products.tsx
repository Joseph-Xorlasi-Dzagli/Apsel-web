import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { 
  Card,
  CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { ProductFilters } from "./ProductFilters";
import { useToast } from "@/hooks/use-toast";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { sampleProducts, Product } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProductDetails } from "./ProductDetails";

interface ProductsProps {
  viewMode?: "list" | "tile";
  onProductSelect?: (product: Product) => void;
  selectedProduct;
  selectedOption;
  detailsMode;
  handleOptionSave;
  handleOptionDelete;
  setDetailsMode;
  handleCloseDetails;
  handleAddOption;
  handleOptionSelect;
}
       
export function Products({
  viewMode = "list",
  onProductSelect,
  selectedProduct,
  selectedOption,
  detailsMode,
  handleOptionSave,
  handleOptionDelete,
  setDetailsMode,
  handleCloseDetails,
  handleAddOption,
  handleOptionSelect
}: ProductsProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "price" | "stock">("name");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;
  const [SelectedproductId, setSelectedproductId] = useState<string | null>(null);


  const handleView = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    if (onProductSelect) {
      onProductSelect(product);
    } else {
      toast({
        title: "View Product",
        description: `Viewing product: ${product.name}`,
      });
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedproductId(product.id);
    if (onProductSelect) {
      onProductSelect(product);
    }
  };

  // Filter and sort products
  const filterProducts = () => {
    let filtered = [...sampleProducts];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(term)
      );
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (product) => product.category === categoryFilter
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "price") {
        return a.price - b.price;
      } else {
        return a.stock - b.stock;
      }
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

  return (
    <div className="space-y-6">
      <ProductFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="pb-6">
            {viewMode === "list" ? (
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Stock</TableHead>
                      <TableHead className="text-right">Sold</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentProducts.map((product) => (
                      <TableRow
                        key={product.id}
                        className={`${
                          SelectedproductId === product.id
                            ? "hover:bg-blue-100 bg-blue-100"
                            : "hover:bg-muted/50"
                        } cursor-pointer`}
                        onClick={() => handleProductClick(product)}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage
                                src={product.image}
                                alt={product.name}
                              />
                              <AvatarFallback>
                                {product.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{product.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell className="text-right">
                          GHC {product.price.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          {product.stock}
                        </TableCell>
                        <TableCell className="text-right">
                          {product.sold}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => handleView(e, product)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentProducts.map((product) => (
                  <Card
                    key={product.id}
                    className={`cursor-pointer hover:shadow-md transition-shadow ${
                      SelectedproductId === product.id ? "border-blue-500" : ""
                    }`}
                    onClick={() => handleProductClick(product)}>
                    <CardContent className="p-4">
                      <div className="aspect-square w-full relative mb-4 bg-muted/50 rounded-md overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.svg";
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{product.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {product.category}
                            </p>
                          </div>
                          <p className="font-bold">
                            GHC {product.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex justify-between pt-2 border-t">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Stock
                            </p>
                            <p
                              className={`font-medium ${
                                product.stock < 10 ? "text-red-500" : ""
                              }`}>
                              {product.stock} items
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Sold
                            </p>
                            <p className="font-medium">{product.sold} items</p>
                          </div>
                          <div className="flex items-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => handleView(e, product)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Showing {Math.min(1, totalProducts)} to{" "}
              {Math.min(currentPage * productsPerPage, totalProducts)} of{" "}
              {totalProducts} products
            </p>

            {totalProducts > productsPerPage && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) {
                          setCurrentPage(currentPage - 1);
                        }
                      }}
                      aria-disabled={currentPage === 1}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(index + 1);
                        }}
                        isActive={currentPage === index + 1}>
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) {
                          setCurrentPage(currentPage + 1);
                        }
                      }}
                      aria-disabled={currentPage === totalPages}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </div>

        <div className="col-span-3 lg:col-span-1 h-[calc(100vh-12rem)] overflow-auto">
          <ProductDetails
            product={selectedProduct}
            productOption={selectedOption}
            mode={detailsMode}
            onSave={handleOptionSave}
            onDelete={handleOptionDelete}
            onModeChange={setDetailsMode}
            onClose={handleCloseDetails}
            onAddOption={handleAddOption}
            onOptionSelect={handleOptionSelect}
          />
        </div>
      </div>
    </div>
  );
}
