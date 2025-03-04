
import { useState, ChangeEvent } from "react";
import { Product } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, Edit, Trash2, PackageOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AspectRatio } from "@/components/ui/aspect-ratio";

type Mode = "view" | "edit" | "add";

interface ProductDetailsProps {
  product: Product | null;
  mode: Mode;
  onSave: (product: Product) => void;
  onDelete?: (productId: string) => void;
  onModeChange: (mode: Mode) => void;
}

export function ProductDetails({
  product,
  mode,
  onSave,
  onDelete,
  onModeChange,
}: ProductDetailsProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Product>(
    product || {
      id: `prod-${Date.now()}`,
      name: "",
      price: 0,
      stock: 0,
      image: "",
      category: "",
      sold: 0,
      description: "",
      termsOfService: "",
      availableForDelivery: false,
      availableForPickup: true,
    }
  );

  // Update formData when product changes
  useState(() => {
    if (product) {
      setFormData(product);
    } else if (mode === "add") {
      setFormData({
        id: `prod-${Date.now()}`,
        name: "",
        price: 0,
        stock: 0,
        image: "",
        category: "",
        sold: 0,
        description: "",
        termsOfService: "",
        availableForDelivery: false,
        availableForPickup: true,
      });
    }
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  const handleDelete = () => {
    if (onDelete && product) {
      onDelete(product.id);
    }
  };

  const handleImageUpload = () => {
    toast({
      title: "Image Upload",
      description: "Image upload functionality will be available soon!",
    });
  };

  if (!product && mode !== "add") {
    return (
      <Card className="h-full overflow-auto">
        <CardHeader className="sticky top-0 z-10 bg-card pb-4">
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[calc(100%-64px)]">
          <PackageOpen className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-center text-muted-foreground">
            Select a product to view its details or click Add New Product to create one.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full overflow-auto">
      <CardHeader className="sticky top-0 z-10 bg-card pb-4">
        <div className="flex items-center justify-between">
          <CardTitle>
            {mode === "view" && (formData.name || "Product Details")}
            {mode === "edit" && "Edit " + (formData.name || "Product")}
            {mode === "add" && "Add New Product"}
          </CardTitle>
          {mode === "view" && (
            <Button 
              variant="ghost" 
              className="text-orange-500 hover:text-orange-600 hover:bg-orange-50"
              onClick={() => onModeChange("edit")}
            >
              EDIT
            </Button>
          )}
          {mode === "edit" && (
            <Button 
              variant="ghost" 
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleDelete}
            >
              DELETE
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pb-24">
        {mode === "view" ? (
          <>
            <div className="relative">
              <AspectRatio ratio={16 / 9} className="bg-muted rounded-md overflow-hidden">
                <img
                  src={formData.image || "/placeholder.svg"}
                  alt={formData.name}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
              </AspectRatio>
              <div className="absolute top-2 right-2 bg-white px-3 py-1 rounded-full text-sm font-medium">
                {formData.stock}pcs
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                {formData.availableForDelivery && formData.availableForPickup ? (
                  <span>Delivery & Pickup</span>
                ) : formData.availableForDelivery ? (
                  <span>Delivery Only</span>
                ) : formData.availableForPickup ? (
                  <span>Pickup Only</span>
                ) : (
                  <span>No Delivery Options</span>
                )}
              </div>
              <div className="text-xl font-bold mt-2">GHC {formData.price.toFixed(2)}</div>
            </div>

            <div>
              <h3 className="text-lg font-medium flex justify-between">
                Description
                <span className="text-sm text-blue-500 cursor-pointer">MORE</span>
              </h3>
              <p className="mt-2 text-muted-foreground">
                {formData.description || "No description available."}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium flex justify-between">
                Terms of Service
                <span className="text-sm text-blue-500 cursor-pointer">MORE</span>
              </h3>
              <p className="mt-2 text-muted-foreground">
                {formData.termsOfService || "No terms of service available."}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">PRODUCT NAME</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
              />
            </div>

            <div className="space-y-2">
              <Label>UPLOAD PHOTO</Label>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className="border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50"
                  onClick={handleImageUpload}
                >
                  <div className="bg-primary/10 rounded-full p-3 mb-2">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">Add</span>
                </div>
                <div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="price">PRICE</Label>
                      <div className="flex items-center mt-1">
                        <span className="mr-2">GHS</span>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          value={formData.price}
                          onChange={handleInputChange}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="stock">QUANTITY</Label>
                      <div className="flex items-center mt-1">
                        <span className="mr-2">PCS</span>
                        <Input
                          id="stock"
                          name="stock"
                          type="number"
                          value={formData.stock}
                          onChange={handleInputChange}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-6 mt-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="pickup"
                        checked={formData.availableForPickup}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange("availableForPickup", checked as boolean)
                        }
                      />
                      <Label htmlFor="pickup">Pick up</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="delivery"
                        checked={formData.availableForDelivery}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange("availableForDelivery", checked as boolean)
                        }
                      />
                      <Label htmlFor="delivery">Delivery</Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">DESCRIPTION</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                placeholder="Enter product description"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="termsOfService">TERMS OF SERVICE</Label>
              <Textarea
                id="termsOfService"
                name="termsOfService"
                value={formData.termsOfService || ""}
                onChange={handleInputChange}
                placeholder="Enter terms of service"
                rows={4}
              />
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
