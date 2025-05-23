import { useState, useEffect, ChangeEvent } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Upload,
  Edit,
  Trash2,
  FolderIcon,
  ArrowLeft,
  X,
  Plus,
  Image,
  AlertTriangle,
  MoreVertical,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Category } from "@/hooks/useInventory";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Mode = "view" | "edit" | "add";

interface CategoryDetailsProps {
  category: Category | null;
  mode: Mode;
  onSave: (category: Category) => void;
  onDelete?: (categoryId: string) => void;
  onModeChange: (mode: Mode) => void;
  onClose?: () => void;
}

export function CategoryDetails({
  category,
  mode,
  onSave,
  onDelete,
  onModeChange,
  onClose,
}: CategoryDetailsProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<Category> | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  // AlertDialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (mode === "add") {
      // Creating a new category
      setFormData({
        name: "",
        description: "",
        image_url: "",
      });
    } else if (mode === "edit" && category) {
      // Editing an existing category
      setFormData({
        ...category,
      });
    } else {
      // Viewing - no form data needed
      setFormData(null);
      setImageError(false);
    }
  }, [category, mode]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSave = async () => {
    if (!formData || !formData.name) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await onSave(formData as Category);
    } catch (error) {
      console.error("Error saving category:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (onDelete && category) {
      onDelete(category.id);
      setDeleteDialogOpen(false);
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  const handleImageUpload = () => {
    toast({
      title: "Image Upload",
      description: "Image upload functionality will be implemented soon!",
    });
  };

  // If no category is selected and not adding a new category
  if (!category && mode !== "add") {
    return (
      <Card className="h-full overflow-auto">
        <CardHeader className="sticky top-0 z-10 bg-card pb-4">
          <CardTitle>Category Details</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[calc(100%-64px)]">
          <FolderIcon className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-center text-muted-foreground">
            Select a category to view its details or click Add New Category to
            create one.
          </p>
        </CardContent>
      </Card>
    );
  }

  // If loading form data
  if ((mode === "edit" || mode === "add") && !formData) {
    return (
      <Card className="h-full overflow-auto">
        <CardHeader className="sticky top-0 z-10 bg-card pb-4">
          <CardTitle>
            <Skeleton className="h-6 w-40" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pb-24">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="h-full overflow-auto">
        <CardHeader className="sticky top-0 z-10 bg-card pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {(mode === "edit" || mode === "add") && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onClose && onClose()}
                  className="mr-1">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <CardTitle>
                {mode === "add" && "Add New Category"}
                {mode === "edit" && "Edit Category"}
                {mode === "view" && category?.name}
              </CardTitle>
            </div>
            {mode === "view" && (
              <div className="flex gap-2">
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
                    <DropdownMenuItem onClick={() => onModeChange("edit")}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={handleDelete}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
            {(mode === "edit" || mode === "add") && (
              <div>
                {mode === "add" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onClose && onClose()}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pb-24">
          {mode === "view" ? (
            <>
              <div className="relative">
                <AspectRatio
                  ratio={16 / 9}
                  className="bg-muted rounded-md overflow-hidden">
                  {imageError || !category?.image_url ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                      <Image className="h-10 w-10 mb-2" />
                      <span className="text-sm">No image available</span>
                    </div>
                  ) : (
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="object-cover w-full h-full"
                      onError={() => setImageError(true)}
                    />
                  )}
                </AspectRatio>
              </div>

              <div>
                <h3 className="text-lg font-medium">{category?.name}</h3>
                <p className="text-muted-foreground mt-1">
                  {category?.productCount || 0} products
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium">Description</h3>
                <p className="mt-2 text-muted-foreground">
                  {category?.description || "No description available."}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">CATEGORY NAME</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData?.name || ""}
                  onChange={handleInputChange}
                  placeholder="Enter category name"
                />
              </div>

              <div className="space-y-2">
                <Label>UPLOAD PHOTO</Label>
                <div
                  className="border-2 border-dashed rounded-md p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50"
                  onClick={handleImageUpload}>
                  <div className="bg-primary/10 rounded-full p-3 mb-2">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Click to upload image
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">DESCRIPTION</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData?.description || ""}
                  onChange={handleInputChange}
                  placeholder="Enter category description"
                  rows={4}
                  maxLength={200}
                />
                <p className="text-xs text-muted-foreground">200 chars max</p>
              </div>
            </>
          )}
        </CardContent>
        {mode !== "view" && (
          <CardFooter className="sticky bottom-0 bg-card py-4 border-t">
            <Button className="w-full" onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "SAVE"}
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* Delete Confirmation AlertDialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the category "{category?.name}"?
              {category?.productCount && category.productCount > 0 && (
                <span className="block mt-2 text-destructive font-medium">
                  This will also delete {category.productCount} product
                  {category.productCount === 1 ? "" : "s"} in this category.
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

export default CategoryDetails;
