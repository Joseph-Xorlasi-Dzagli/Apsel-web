
import { useState, useEffect, ChangeEvent } from "react";
import { Product, ProductOption } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, Edit, Trash2, PackageOpen, ArrowLeft, X, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AspectRatio } from "@/components/ui/aspect-ratio";

type Mode = "view" | "edit" | "add";

interface ProductDetailsProps {
  product: Product | null;
  productOption: ProductOption | null;
  mode: Mode;
  onSave: (option: ProductOption) => void;
  onDelete?: (optionId: string) => void;
  onModeChange: (mode: Mode) => void;
  onClose?: () => void;
  onAddOption?: () => void;
  onOptionSelect?: (option: ProductOption) => void;
}

export function ProductDetails({
  product,
  productOption,
  mode,
  onSave,
  onDelete,
  onModeChange,
  onClose,
  onAddOption,
  onOptionSelect,
}: ProductDetailsProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ProductOption | null>(productOption);
  
  useEffect(() => {
    if (mode === "add" && product) {
      // Creating a new product option
      setFormData({
        id: `option-${Date.now()}`,
        productId: product.id,
        name: "",
        price: product.price,
        stock: product.stock,
        image: "",
        description: "",
        termsOfService: "",
        availableForDelivery: product.availableForDelivery || false,
        availableForPickup: product.availableForPickup || true,
      });
    } else if (mode === "add" && !product) {
      // Creating a new product
      setFormData({
        id: `option-${Date.now()}`,
        productId: `prod-${Date.now()}`,
        name: "Standard",
        price: 0,
        stock: 0,
        image: "",
        description: "",
        termsOfService: "",
        availableForDelivery: false,
        availableForPickup: true,
      });
    } else {
      // Editing an existing product option
      setFormData(productOption);
    }
  }, [productOption, product, mode]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: name === "price" || name === "stock" ? Number(value) : value,
      };
    });
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: checked,
      };
    });
  };

  const handleSave = () => {
    if (formData) {
      onSave(formData);
    }
  };

  const handleDelete = () => {
    if (onDelete && productOption) {
      onDelete(productOption.id);
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

  // If no product is selected and not adding a new product
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

  const isNewProduct = mode === "add" && !product;
  const isNewOption = mode === "add" && product;

  return (
    <Card className="h-full overflow-auto">
      <CardHeader className="sticky top-0 z-10 bg-card pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {(mode === "view" || mode === "edit") &&
              mode !== "view" &&
              product && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onClose && onClose()}
                  className="mr-1">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
            <CardTitle>
              {isNewProduct && "Add New Product"}
              {isNewOption && "Add Product Option"}
              {mode === "edit" && "Edit Product Option"}
              {mode === "view" && "Product"}
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
                  src={
                    productOption?.image || product?.image || "/placeholder.svg"
                  }
                  alt={productOption?.name || product?.name}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
              </AspectRatio>
              <div className="absolute top-2 right-2 bg-white px-3 py-1 rounded-full text-sm font-medium">
                {productOption?.stock || product?.stock || 0}pcs
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium">
                {product?.name}
                {productOption?.name !== "Standard" && productOption?.name
                  ? `: ${productOption.name}`
                  : ""}
              </h3>
              <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                {productOption ? (
                  productOption.availableForDelivery &&
                  productOption.availableForPickup ? (
                    <span>Delivery & Pickup</span>
                  ) : productOption.availableForDelivery ? (
                    <span>Delivery Only</span>
                  ) : productOption.availableForPickup ? (
                    <span>Pickup Only</span>
                  ) : (
                    <span>No Delivery Options</span>
                  )
                ) : product?.availableForDelivery &&
                  product?.availableForPickup ? (
                  <span>Delivery & Pickup</span>
                ) : product?.availableForDelivery ? (
                  <span>Delivery Only</span>
                ) : product?.availableForPickup ? (
                  <span>Pickup Only</span>
                ) : (
                  <span>No Delivery Options</span>
                )}
              </div>
              <div className="text-xl font-bold mt-2">
                GHC {(productOption?.price || product?.price || 0).toFixed(2)}
              </div>
            </div>

            {/* Product Options */}
            {product?.options && product.options.length > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Options</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onAddOption}
                    className="h-8">
                    <Plus className="h-3 w-3 mr-1" /> Option
                  </Button>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {product.options.map((option) => (
                    <Button
                      key={option.id}
                      variant={
                        productOption?.id === option.id ? "default" : "outline"
                      }
                      className="whitespace-nowrap"
                      onClick={() => onOptionSelect && onOptionSelect(option)}>
                      {option.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-medium flex justify-between">
                Description
                <span className="text-sm text-blue-500 cursor-pointer">
                  MORE
                </span>
              </h3>
              <p className="mt-2 text-muted-foreground">
                {productOption?.description ||
                  product?.description ||
                  "No description available."}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium flex justify-between">
                Terms of Service
                <span className="text-sm text-blue-500 cursor-pointer">
                  MORE
                </span>
              </h3>
              <p className="mt-2 text-muted-foreground">
                {productOption?.termsOfService ||
                  product?.termsOfService ||
                  "No terms of service available."}
              </p>
            </div>
          </>
        ) : (
          <>
            {isNewOption && (
              <div className="space-y-2">
                <Label htmlFor="name">OPTION NAME</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData?.name || ""}
                  onChange={handleInputChange}
                  placeholder="Enter option name (e.g., Extra Cheese)"
                  maxLength={20}
                />
                <p className="text-xs text-muted-foreground">20 chars max</p>
              </div>
            )}

            {isNewProduct && (
              <div className="space-y-2">
                <Label htmlFor="name">PRODUCT NAME</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData?.name || ""}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>UPLOAD PHOTO</Label>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className="border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50"
                  onClick={handleImageUpload}>
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
                          value={formData?.price || ""}
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
                          value={formData?.stock || ""}
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
                        checked={formData?.availableForPickup || false}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(
                            "availableForPickup",
                            checked as boolean
                          )
                        }
                      />
                      <Label htmlFor="pickup">Pick up</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="delivery"
                        checked={formData?.availableForDelivery || false}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(
                            "availableForDelivery",
                            checked as boolean
                          )
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
                value={formData?.description || ""}
                onChange={handleInputChange}
                placeholder="Enter product description"
                rows={4}
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground">200 chars max</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="termsOfService">TERMS OF SERVICE</Label>
              <Textarea
                id="termsOfService"
                name="termsOfService"
                value={formData?.termsOfService || ""}
                onChange={handleInputChange}
                placeholder="Enter terms of service"
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
