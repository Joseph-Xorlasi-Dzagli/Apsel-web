
import { useState, useEffect, ChangeEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Edit, Trash2, FolderIcon, ArrowLeft, X, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Category } from "@/lib/data";

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
  const [formData, setFormData] = useState<Category | null>(category);
  
  useEffect(() => {
    if (mode === "add") {
      // Creating a new category
      setFormData({
        id: `category-${Date.now()}`,
        name: "",
        description: "",
        image: "",
        productCount: 0,
      });
    } else {
      // Editing an existing category
      setFormData(category);
    }
  }, [category, mode]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSave = () => {
    if (formData) {
      onSave(formData);
    }
  };

  const handleDelete = () => {
    if (onDelete && category) {
      onDelete(category.id);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleImageUpload = () => {
    toast({
      title: "Image Upload",
      description: "Image upload functionality will be available soon!",
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
            Select a category to view its details or click Add New Category to create one.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full overflow-auto">
      <CardHeader className="sticky top-0 z-10 bg-card pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {(mode === "edit") && (
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
              {mode === "view" && "Category"}
            </CardTitle>
          </div>
          {mode === "view" && (
            <Button
              variant="ghost"
              className="text-orange-500 hover:text-orange-600 hover:bg-orange-50"
              onClick={() => onModeChange("edit")}>
              EDIT
            </Button>
          )}
          {(mode === "edit" || mode === "add") && (
            <div>
              {mode === "add" && (
                <Button variant="ghost" size="icon" onClick={handleClose}>
                  <X className="h-4 w-4" />
                </Button>
              )}
              {mode === "edit" && (
                <Button
                  variant="ghost"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={handleDelete}>
                  DELETE
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
                <img
                  src={category?.image || "/placeholder.svg"}
                  alt={category?.name}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
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
                <span className="text-sm text-muted-foreground">Click to upload image</span>
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
          <Button className="w-full" onClick={handleSave}>
            SAVE
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
