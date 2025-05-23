import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Category } from "@/hooks/useInventory";
import { Edit, Eye, MoreVertical, Search, Trash2 } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CategoryDetails } from "./CategoryDetails";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoriesProps {
  viewMode?: "list" | "tile";
  categories: Category[];
  selectedCategory: Category | null;
  onCategorySelect: (category: Category) => void;
  detailsMode: "view" | "edit" | "add";
  setDetailsMode: (mode: "view" | "edit" | "add") => void;
  handleCategorySave: (category: Category) => void;
  handleCategoryDelete: (categoryId: string) => void;
  handleCloseDetails: () => void;
  loading?: boolean;
}

export function Categories({
  viewMode = "list",
  categories,
  selectedCategory,
  onCategorySelect,
  detailsMode,
  setDetailsMode,
  handleCategorySave,
  handleCategoryDelete,
  handleCloseDetails,
  loading = false,
}: CategoriesProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );

  const categoriesPerPage = 6;

  // Reset pagination when categories or search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [categories, searchTerm]);

  const handleView = (e: React.MouseEvent, category: Category) => {
    e.stopPropagation();
    onCategorySelect(category);
  };

  const handleCategoryClick = (category: Category) => {
    setSelectedCategoryId(category.id);
    onCategorySelect(category);
  };

  const handleDeleteClick = (e: React.MouseEvent, category: Category) => {
    e.stopPropagation();
    setCategoryToDelete(category);
    setDialogOpen(true);
  };

  const confirmDelete = () => {
    if (categoryToDelete && handleCategoryDelete) {
      handleCategoryDelete(categoryToDelete.id);
      setDialogOpen(false);
      setCategoryToDelete(null);
      // Close details if the deleted category was selected
      if (selectedCategory?.id === categoryToDelete.id) {
        handleCloseDetails();
      }
    }
  };

  const cancelDelete = () => {
    setDialogOpen(false);
    setCategoryToDelete(null);
  };

  // Filter categories based on search
  const filterCategories = () => {
    if (!searchTerm) return categories;

    const term = searchTerm.toLowerCase();
    return categories.filter((category) =>
      category.name.toLowerCase().includes(term)
    );
  };

  const filteredCategories = filterCategories();
  const totalCategories = filteredCategories.length;
  const totalPages = Math.ceil(totalCategories / categoriesPerPage);
  const currentCategories = filteredCategories.slice(
    (currentPage - 1) * categoriesPerPage,
    currentPage * categoriesPerPage
  );

  // If loading and no categories yet, show skeleton
  if (loading && categories.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center pt-6 mb-4">
          <div className="w-64 h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="pb-6">
              {viewMode === "list" ? (
                <div className="overflow-x-auto rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Products</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array(4)
                        .fill(0)
                        .map((_, i) => (
                          <TableRow key={i}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <Skeleton className="h-4 w-32" />
                              </div>
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
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4 mb-4">
                            <Skeleton className="h-16 w-16 rounded-full" />
                            <div className="space-y-2">
                              <Skeleton className="h-5 w-32" />
                              <Skeleton className="h-4 w-20" />
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <Skeleton className="h-8 w-16 rounded" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </div>
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
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center pt-6 mb-4 ">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="pb-6">
              {viewMode === "list" ? (
                <div className="overflow-x-auto rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Products</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentCategories.map((category) => (
                        <TableRow
                          key={category.id}
                          className={`${
                            selectedCategoryId === category.id
                              ? "hover:bg-blue-100 bg-blue-100"
                              : "hover:bg-muted/50"
                          } cursor-pointer`}
                          onClick={() => handleCategoryClick(category)}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                {category.image_url ? (
                                  <AvatarImage
                                    src={category.image_url}
                                    alt={category.name}
                                  />
                                ) : null}
                                <AvatarFallback>
                                  {category.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{category.name}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {category.productCount || 0}
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-2">
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
                                    onClick={(e) => handleView(e, category)}>
                                    <Eye className=" mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onCategorySelect(category);
                                      setDetailsMode("edit");
                                    }}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={(e) =>
                                      handleDeleteClick(e, category)
                                    }>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {currentCategories.length === 0 && !loading && (
                        <TableRow>
                          <TableCell colSpan={3} className="h-24 text-center">
                            {searchTerm
                              ? "No categories found matching your search."
                              : "No categories found. Create one to get started."}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentCategories.map((category) => (
                    <Card
                      key={category.id}
                      className={`cursor-pointer hover:shadow-md transition-shadow ${
                        selectedCategoryId === category.id
                          ? "border-blue-500"
                          : ""
                      }`}
                      onClick={() => handleCategoryClick(category)}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="h-16 w-16 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                            {category.image_url ? (
                              <img
                                src={category.image_url}
                                alt={category.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = "/placeholder.svg";
                                }}
                              />
                            ) : (
                              <span className="text-2xl font-bold">
                                {category.name.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">
                              {category.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {category.productCount || 0} products
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleView(e, category);
                            }}>
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {currentCategories.length === 0 && !loading && (
                    <div className="col-span-full flex justify-center items-center h-40 bg-muted/20 rounded-lg">
                      <p className="text-muted-foreground">
                        {searchTerm
                          ? "No categories found matching your search."
                          : "No categories found. Create one to get started."}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {totalCategories > categoriesPerPage && (
              <div className="flex justify-center mt-4">
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
              </div>
            )}
          </div>

          <div className="col-span-3 lg:col-span-1 h-[calc(100vh-12rem)] overflow-auto">
            <CategoryDetails
              category={selectedCategory}
              mode={detailsMode}
              onSave={handleCategorySave}
              onDelete={handleCategoryDelete}
              onModeChange={setDetailsMode}
              onClose={handleCloseDetails}
            />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the category "
              {categoryToDelete?.name}"?
              {categoryToDelete?.productCount &&
                categoryToDelete.productCount > 0 && (
                  <span className="block mt-2 text-destructive font-medium">
                    This will also delete {categoryToDelete.productCount}{" "}
                    product
                    {categoryToDelete.productCount === 1 ? "" : "s"} in this
                    category.
                  </span>
                )}
              <span className="block mt-2">This action cannot be undone.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default Categories;
