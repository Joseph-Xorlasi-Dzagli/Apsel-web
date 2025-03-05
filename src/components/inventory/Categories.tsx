
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { sampleCategories, Category } from "@/lib/data";
import { Eye, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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

interface CategoriesProps {
  viewMode?: "list" | "tile";
  selectedCategory: Category | null;
  onCategorySelect: (category: Category) => void;
  detailsMode: "view" | "edit" | "add";
  setDetailsMode: (mode: "view" | "edit" | "add") => void;
  handleCategorySave: (category: Category) => void;
  handleCategoryDelete: (categoryId: string) => void;
  handleCloseDetails: () => void;
}

export function Categories({ 
  viewMode = "list",
  selectedCategory,
  onCategorySelect,
  detailsMode,
  setDetailsMode,
  handleCategorySave,
  handleCategoryDelete,
  handleCloseDetails
}: CategoriesProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const categoriesPerPage = 6;

  const handleView = (e: React.MouseEvent, category: Category) => {
    e.stopPropagation();
    onCategorySelect(category);
  };

  const handleCategoryClick = (category: Category) => {
    setSelectedCategoryId(category.id);
    onCategorySelect(category);
  };

  // Filter categories based on search
  const filterCategories = () => {
    let filtered = [...sampleCategories];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (category) => category.name.toLowerCase().includes(term)
      );
    }

    return filtered;
  };

  const filteredCategories = filterCategories();
  const totalCategories = filteredCategories.length;
  const totalPages = Math.ceil(totalCategories / categoriesPerPage);
  const currentCategories = filteredCategories.slice(
    (currentPage - 1) * categoriesPerPage,
    currentPage * categoriesPerPage
  );

  return (
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
                        onClick={() => handleCategoryClick(category)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={category.image} alt={category.name} />
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
                          {category.productCount}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => handleView(e, category)}>
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
                {currentCategories.map((category) => (
                  <Card
                    key={category.id}
                    className={`cursor-pointer hover:shadow-md transition-shadow ${
                      selectedCategoryId === category.id ? "border-blue-500" : ""
                    }`}
                    onClick={() => handleCategoryClick(category)}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="h-16 w-16 rounded-full overflow-hidden bg-muted/50">
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/placeholder.svg";
                            }}
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{category.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {category.productCount} products
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
                        currentPage === 1 ? "pointer-events-none opacity-50" : ""
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
  );
}
