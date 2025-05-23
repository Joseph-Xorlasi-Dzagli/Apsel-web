import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash2, MoreVertical } from "lucide-react";
import { ProductFilters } from "./ProductFilters";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProductDetails } from "./ProductDetails";
import { Product, Category, ProductOption } from "@/hooks/useInventory";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "../ui/ConfirmDialog";

interface ProductsProps {
  viewMode?: "list" | "tile";
  products: Product[];
  categories: Category[];
  searchTerm: string;
  categoryFilter: string;
  sortBy: "name" | "price" | "stock" | "sold";
  setSearchTerm: (term: string) => void;
  setCategoryFilter: (category: string) => void;
  setSortBy: (sortBy: "name" | "price" | "stock" | "sold") => void;
  onProductSelect: (product: Product) => void;
  selectedProduct: Product | null;
  selectedOption: ProductOption | null;
  detailsMode: "view" | "editOption" | "add"| "editProduct";
  handleOptionSave: (option: ProductOption) => void;
  handleOptionDelete: (optionId: string) => void;
  handleProductSave: (product: Product) => void;
  handleProductDelete: (productId: string) => void;
  setDetailsMode: (mode: "view" | "editOption" | "add"|"editProduct") => void;
  handleCloseDetails: () => void;
  handleAddOption: () => void;
  handleOptionSelect: (option: ProductOption) => void;
  loading?: boolean;
}

export function Products({
  viewMode = "list",
  products,
  categories,
  searchTerm,
  categoryFilter,
  sortBy,
  setSearchTerm,
  setCategoryFilter,
  setSortBy,
  onProductSelect,
  selectedProduct,
  selectedOption,
  detailsMode,
  handleOptionSave,
  handleOptionDelete,
  handleProductSave,
  handleProductDelete,
  setDetailsMode,
  handleCloseDetails,
  handleAddOption,
  handleOptionSelect,
  loading = false,
}: ProductsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({
    title: "",
    description: "",
    confirmLabel: "",
    onConfirm: () => {},
  });

  // Function to show delete confirmation dialog
  const showDeleteConfirmation = (product: Product) => {
    setDialogConfig({
      title: "Delete Product",
      description: `Are you sure you want to delete "${product.name}"? This action cannot be undone and will remove all related options.`,
      confirmLabel: "Delete",
      onConfirm: () => {
        handleProductDelete(product.id);
        setDialogOpen(false);
      },
    });
    setDialogOpen(true);
  };

  // Reset pagination when products change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, sortBy]);

  const handleView = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    onProductSelect(product);
  };

  const handleEdit = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();

    // First, set the selected product
    onProductSelect(product);

    // Then set the mode to edit - ensure editing the product, not an option
    // The order matters here - select the product first, then set edit mode
    setTimeout(() => {
      setDetailsMode("editProduct");
    }, 0);
  };

  const handleDelete = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    showDeleteConfirmation(product);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProductId(product.id);
    onProductSelect(product);
  };

  // Helper function for safely handling product options (fix for the length error)
  const getProductOption = (product: Product) => {
    // Safely check if product and product.options exist
    if (!product || !product.options || !(product.options?.length > 0)) {
      return null;
    }

    // Now it's safe to access options
    return (
      product.options.find((opt) => opt.name === "Standard") ||
      product.options[0]
    );
  };

  // Pagination logic
  const totalProducts = products?.length || 0;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const currentProducts =
    products?.slice(
      (currentPage - 1) * productsPerPage,
      currentPage * productsPerPage
    ) || [];

  // Extract unique category names for the filter
  const categoryNames =
    categories?.map((cat) => ({
      id: cat.id,
      name: cat.name,
    })) || [];

  // If loading and no products yet, show skeleton
  if (loading && (!products || products.length === 0)) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="h-10 w-64 bg-gray-200 rounded animate-pulse"></div>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-2">
            {viewMode === "list" ? (
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Stock</TableHead>
                      <TableHead className="text-right">Sold</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <TableRow key={i}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Skeleton className="h-10 w-10 rounded-full" />
                              <Skeleton className="h-4 w-40" />
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Skeleton className="h-4 w-16 ml-auto" />
                          </TableCell>
                          <TableCell className="text-right">
                            <Skeleton className="h-4 w-10 ml-auto" />
                          </TableCell>
                          <TableCell className="text-right">
                            <Skeleton className="h-4 w-10 ml-auto" />
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end">
                              <Skeleton className="h-8 w-8 rounded-full" />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-4">
                        <Skeleton className="h-40 w-full mb-4" />
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-16" />
                          </div>
                          <Skeleton className="h-4 w-full" />
                          <div className="flex justify-between pt-2">
                            <Skeleton className="h-8 w-16" />
                            <Skeleton className="h-8 w-16" />
                            <Skeleton className="h-8 w-8 rounded-full" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </div>
          <div className="col-span-1">
            <Card className="h-full">
              <Skeleton className="h-full w-full" />
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProductFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        categories={categoryNames}
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
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentProducts.map((product) => {
                      // Get the standard option or first option for price and stock - safely
                      const option = getProductOption(product);

                      return (
                        <TableRow
                          key={product.id}
                          className={`${
                            selectedProductId === product.id
                              ? "hover:bg-blue-100 bg-blue-100"
                              : "hover:bg-muted/50"
                          } cursor-pointer`}
                          onClick={() => handleProductClick(product)}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarImage
                                  src={
                                    product.image_url || option?.image_url || ""
                                  }
                                  alt={product.name}
                                />
                                <AvatarFallback>
                                  {product.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">
                                {product.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell className="text-right">
                            GHC {option ? option.price.toFixed(2) : "0.00"}
                          </TableCell>
                          <TableCell className="text-right">
                            {option ? option.stock : 0}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => e.stopPropagation()}
                                  className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={(e) => handleView(e, product)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => handleEdit(e, product)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={(e) => handleDelete(e, product)}>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {currentProducts.length === 0 && !loading && (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No products found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentProducts.map((product) => {
                  // Get the standard option or first option for price and stock - safely
                  const option = getProductOption(product);

                  return (
                    <Card
                      key={product.id}
                      className={`cursor-pointer hover:shadow-md transition-shadow ${
                        selectedProductId === product.id
                          ? "border-blue-500"
                          : ""
                      }`}
                      onClick={() => handleProductClick(product)}>
                      <CardContent className="p-4">
                        <div className="aspect-square w-full relative mb-4 bg-muted/50 rounded-md overflow-hidden">
                          <img
                            src={
                              product.image_url ||
                              option?.image_url ||
                              "/placeholder.svg"
                            }
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
                              <p className="text-xs text-muted-foreground">
                                {product.category}
                              </p>
                            </div>
                            <p className="font-bold">
                              GHC {option ? option.price.toFixed(2) : "0.00"}
                            </p>
                          </div>
                          <div className="flex justify-between pt-2 border-t">
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Stock
                              </p>
                              <p
                                className={`font-medium ${
                                  option && option.stock < 10
                                    ? "text-red-500"
                                    : ""
                                }`}>
                                {option ? option.stock : 0} items
                              </p>
                            </div>
                            <div className="flex items-center">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => e.stopPropagation()}
                                    className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={(e) => handleView(e, product)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={(e) => handleEdit(e, product)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={(e) => handleDelete(e, product)}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                {currentProducts.length === 0 && !loading && (
                  <div className="col-span-full flex justify-center items-center h-40 bg-muted/20 rounded-lg">
                    <p className="text-muted-foreground">No products found.</p>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              {totalProducts > 0 ? (
                <>
                  Showing {(currentPage - 1) * productsPerPage + 1} to{" "}
                  {Math.min(currentPage * productsPerPage, totalProducts)} of{" "}
                  {totalProducts} products
                </>
              ) : (
                "No products found"
              )}
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
                  {Array.from({ length: Math.min(totalPages, 5) }).map(
                    (_, index) => {
                      // For pagination with many pages, show a limited set around the current page
                      let pageNum = index + 1;
                      if (totalPages > 5) {
                        if (currentPage <= 3) {
                          pageNum = index + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + index;
                        } else {
                          pageNum = currentPage - 2 + index;
                        }
                      }

                      return (
                        <PaginationItem key={index}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(pageNum);
                            }}
                            isActive={currentPage === pageNum}>
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                  )}
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
            onProductSave={handleProductSave}
            onProductDelete={handleProductDelete}
            onModeChange={setDetailsMode}
            onClose={handleCloseDetails}
            onAddOption={handleAddOption}
            onOptionSelect={handleOptionSelect}
            categories={categories}
          />
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        title={dialogConfig.title}
        description={dialogConfig.description}
        onConfirm={dialogConfig.onConfirm}
        confirmLabel={dialogConfig.confirmLabel}
        variant="destructive"
      />
    </div>
  );
}
