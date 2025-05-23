import { useState, useEffect, ChangeEvent } from "react";
import { Product, ProductOption, Category } from "@/hooks/useInventory";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Upload,
  PackageOpen,
  ArrowLeft,
  X,
  Plus,
  Image,
  AlertTriangle,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Mode = "view" | "editOption" | "add" | "editProduct";

interface ProductDetailsProps {
  product: Product | null;
  productOption: ProductOption | null;
  mode: Mode;
  onSave: (option: ProductOption) => void;
  onProductSave: (product: Product) => void;
  onDelete?: (optionId: string) => void;
  onProductDelete?: (productId: string) => void;
  onModeChange: (mode: Mode) => void;
  onClose?: () => void;
  onAddOption?: () => void;
  onOptionSelect?: (option: ProductOption) => void;
  categories: Category[];
}

export function ProductDetails({
  product,
  productOption,
  mode,
  onSave,
  onProductSave,
  onDelete,
  onProductDelete,
  onModeChange,
  onClose,
  onAddOption,
  onOptionSelect,
  categories = [],
}: ProductDetailsProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  // ADD THESE NEW STATE VARIABLES:
  const [editingQty, setEditingQty] = useState(false);
  const [qty, setQty] = useState(0);
  const [saving, setSaving] = useState(false);

  const [editingPrice, setEditingPrice] = useState(false);
  const [price, setPrice] = useState(0);
  const [savingPrice, setSavingPrice] = useState(false);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({
    title: "",
    description: "",
    confirmLabel: "",
    onConfirm: () => {},
  });

  useEffect(() => {
    if (mode === "add" && product) {
      // Creating a new product option
      setFormData({
        product_id: product.id,
        name: "",
        price: 0,
        stock: 0,
        image_url: "",
        description: "",
        terms_of_service: "",
        available_for_delivery: false,
        available_for_pickup: true,
      });
    } else if (mode === "add" && !product) {
      // Creating a new product
      setFormData({
        name: "",
        price: 0,
        stock: 0,
        category_id: categories.length > 0 ? categories[0].id : "",
        image_url: "",
        description: "",
        terms_of_service: "",
        available_for_delivery: false,
        available_for_pickup: true,
      });
    } else if (mode === "editOption" && productOption) {
      // Editing an existing product option
      setFormData({
        ...productOption,
      });
    } else if (mode === "editProduct" && product) {
      // Editing product details (not an option)
      setFormData({
        id: product.id,
        name: product.name || "",
        category_id: product.category_id || "",
        description: product.description || "",
        image_url: product.image_url || "",
        terms_of_service: product.terms_of_service || "",
        available_for_delivery: product.available_for_delivery || false,
        available_for_pickup: product.available_for_pickup || true,
      });
    } else if (mode === "view") {
      // Just viewing, reset form
      setFormData(null);
    }
  }, [product, productOption, mode, categories]);

  // Update qty when productOption changes
  useEffect(() => {
    if (productOption?.stock !== undefined) {
      setQty(productOption.stock);
    }
  }, [productOption?.stock]);

  // Update price when productOption changes
  useEffect(() => {
    if (productOption?.price !== undefined) {
      setPrice(productOption.price);
    }
  }, [productOption?.price]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: name === "price" || name === "stock" ? Number(value) : value,
      };
    });
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev: any) => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: checked,
      };
    });
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev: any) => {
      if (!prev) return null;
      return {
        ...prev,
        category_id: value,
      };
    });
  };

  const handleSave = async () => {
    if (!formData) return;

    setLoading(true);
    try {
      if (mode === "add" && !product) {
        // Adding new product
        await onProductSave(formData);
      } else if ((mode === "add" || mode === "editOption") && product) {
        // Adding or editing a product option
        await onSave(formData);
      } else if (mode === "editProduct" && product) {
        // Editing existing product
        await onProductSave(formData);
      }

      // After saving, revert to view mode
      onModeChange("view");
    } catch (error) {
      console.error("Error saving:", error);
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const showDeleteOptionConfirmation = () => {
    if (!productOption) return;

    setDialogConfig({
      title: "Delete Option",
      description: `Are you sure you want to delete the option "${productOption.name}"? This action cannot be undone.`,
      confirmLabel: "Delete",
      onConfirm: () => {
        if (onDelete) {
          onDelete(productOption.id);
        }
        setDialogOpen(false);
      },
    });
    setDialogOpen(true);
  };

  const showDeleteProductConfirmation = () => {
    if (!product) return;

    setDialogConfig({
      title: "Delete Product",
      description: `Are you sure you want to delete the product "${product.name}" and all its options? This action cannot be undone.`,
      confirmLabel: "Delete",
      onConfirm: () => {
        if (onProductDelete) {
          onProductDelete(product.id);
        }
        setDialogOpen(false);
      },
    });
    setDialogOpen(true);
  };

  const handleDelete = () => {
    if (productOption && onDelete) {
      // Delete product option
      showDeleteOptionConfirmation();
    } else if (product && onProductDelete) {
      // Delete entire product
      showDeleteProductConfirmation();
    }
  };

  const handleImageUpload = () => {
    // In a real implementation, this would open a file picker
    toast({
      title: "Image Upload",
      description: "Image upload functionality will be implemented soon!",
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
            Select a product to view its details or click Add New Product to
            create one.
          </p>
        </CardContent>
      </Card>
    );
  }

  // If form data is still loading
  if (
    (mode === "editProduct" || mode === "editOption" || mode === "add") &&
    !formData
  ) {
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

  const isNewProduct = mode === "add" && !product;
  const isNewOption = mode === "add" && product;
  const isEditingProduct = mode === "editProduct" && product;
  const isEditingOption = mode === "editOption" && productOption;

  // For displaying product data in view mode
  const displayImage = productOption?.image_url || product?.image_url;
  const displayName = product?.name;
  const displayOptionName =
    productOption?.name !== "Standard" ? productOption?.name : null;
  const displayDescription = productOption?.description || product?.description;
  const displayTerms =
    productOption?.terms_of_service || product?.terms_of_service;
  const displayPrice = productOption?.price;
  const displayStock = productOption?.stock;
  const isDeliveryAvailable =
    productOption?.available_for_delivery || product?.available_for_delivery;
  const isPickupAvailable =
    productOption?.available_for_pickup || product?.available_for_pickup;

  return (
    <Card className="h-full overflow-auto">
      <CardHeader className="sticky top-0 z-10 bg-card pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {(mode === "editProduct" ||
              mode === "editOption" ||
              mode === "add") && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onClose?.()}
                className="mr-1">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <CardTitle>
              {isNewProduct && "Add New Product"}
              {isNewOption && "Add Product Option"}
              {isEditingProduct && "Edit Product"}
              {isEditingOption && "Edit Product Option"}
              {mode === "view" && (
                <>
                  {displayOptionName
                    ? `${displayName}: ${displayOptionName}`
                    : displayName}
                </>
              )}
            </CardTitle>
          </div>
          {mode === "view" && (
            <>
              <div className="flex gap-2">
                {/* <Button
                  variant="ghost"
                  className="text-orange-500 hover:text-orange-600 hover:bg-orange-50"
                  onClick={() => onModeChange("editOption")}>
                  EDIT
                </Button> */}
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
                      onClick={() => onModeChange("editOption")}>
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
                {/* Show delete button for product options if viewing an option */}
              </div>
            </>
          )}
          {(mode === "editProduct" ||
            mode === "editOption" ||
            mode === "add") && (
            <div>
              {mode === "add" && (
                <Button variant="ghost" size="icon" onClick={() => onClose?.()}>
                  <X className="h-4 w-4" />
                </Button>
              )}
              {/* {(mode === "editOption" || mode === "editProduct") && (
                <Button
                  variant="ghost"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={handleDelete}>
                  DELETE
                </Button>
              )} */}
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
                {imageError || !displayImage ? (
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                    <Image className="h-10 w-10 mb-2" />
                    <span className="text-sm">No image available</span>
                  </div>
                ) : (
                  <img
                    src={displayImage}
                    alt={displayName}
                    className="object-cover w-full h-full"
                    onError={() => setImageError(true)}
                  />
                )}
              </AspectRatio>
              {mode === "view" && (
                <>
                  {/* Existing quantity bubble code stays here */}

                  {/* ADD THIS PRICE EDIT BUBBLE: */}
                  {editingPrice ? (
                    <div className="absolute bottom-2 left-2 bg-white px-3 py-2 rounded-md shadow gap-2 z-10">
                      <div className="pt-4 gap-2 flex items-center ">
                        <span className="text-sm font-medium">GHC</span>
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          value={price}
                          onChange={(e) => setPrice(Number(e.target.value))}
                          className="w-24 h-8"
                        />
                      </div>
                      <div className="pt-4 gap-2 flex items-center ">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingPrice(false)}
                          disabled={savingPrice}>
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={async () => {
                            setSavingPrice(true);
                            try {
                              if (productOption && onSave) {
                                // Create the updated option object with all required fields
                                const updatedOption = {
                                  id: productOption.id,
                                  product_id: productOption.product_id,
                                  name: productOption.name,
                                  price: price, // Updated price
                                  stock: productOption.stock,
                                  image_url: productOption.image_url || "",
                                  description: productOption.description || "",
                                  terms_of_service:
                                    productOption.terms_of_service || "",
                                  available_for_delivery:
                                    productOption.available_for_delivery ||
                                    false,
                                  available_for_pickup:
                                    productOption.available_for_pickup || true,
                                };

                                await onSave(updatedOption);
                                setEditingPrice(false);
                                toast({
                                  title: "Price Updated",
                                  description:
                                    "Product price updated successfully.",
                                });
                              }
                            } catch (error) {
                              console.error("Error updating price:", error);
                              toast({
                                title: "Error",
                                description: "Failed to update price.",
                                variant: "destructive",
                              });
                            } finally {
                              setSavingPrice(false);
                            }
                          }}
                          disabled={savingPrice}>
                          Done
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      className="absolute bottom-2 left-2 bg-white px-3 py-1 rounded-full text-sm font-medium"
                      variant="outline"
                      onClick={() => setEditingPrice(true)}>
                      GHC {(displayPrice || 0).toFixed(2)}
                    </Button>
                  )}
                </>
              )}
              {mode === "view" && (
                <>
                  {editingQty ? (
                    <div className="absolute bottom-2 right-2 bg-white px-3 py-2 rounded-md shadow gap-2 z-10">
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() =>
                            setQty((prev) => Math.max(0, prev - 1))
                          }
                          disabled={qty <= 0 || saving}
                          tabIndex={-1}
                          type="button">
                          -
                        </Button>
                        <Input
                          type="number"
                          min={0}
                          value={qty}
                          onChange={(e) => setQty(Number(e.target.value))}
                          className="w-20 h-8 text-center"
                        />
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() => setQty((prev) => prev + 1)}
                          disabled={saving}
                          tabIndex={-1}
                          type="button">
                          +
                        </Button>
                      </div>
                      <div className="pt-4 gap-2 flex items-center ">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingQty(false)}
                          disabled={saving}
                          className="flex-1">
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={async () => {
                            setSaving(true);
                            try {
                              if (productOption && onSave) {
                                // Create the updated option object with all required fields
                                const updatedOption = {
                                  id: productOption.id,
                                  product_id: productOption.product_id,
                                  name: productOption.name,
                                  price: productOption.price,
                                  stock: qty, // Updated quantity
                                  image_url: productOption.image_url || "",
                                  description: productOption.description || "",
                                  terms_of_service:
                                    productOption.terms_of_service || "",
                                  available_for_delivery:
                                    productOption.available_for_delivery ||
                                    false,
                                  available_for_pickup:
                                    productOption.available_for_pickup || true,
                                };

                                await onSave(updatedOption);
                                setEditingQty(false);
                                toast({
                                  title: "Quantity Updated",
                                  description:
                                    "Stock quantity updated successfully.",
                                });
                              }
                            } catch (error) {
                              console.error("Error updating quantity:", error);
                              toast({
                                title: "Error",
                                description: "Failed to update quantity.",
                                variant: "destructive",
                              });
                            } finally {
                              setSaving(false);
                            }
                          }}
                          disabled={saving}>
                          Done
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      className="absolute bottom-2 right-2 bg-white px-3 py-1 rounded-full text-sm font-medium"
                      variant="outline"
                      onClick={() => setEditingQty(true)}>
                      {displayStock || 0} pcs
                    </Button>
                  )}
                </>
              )}
            </div>

            <div>
              <h3 className="text-lg font-medium">
                {displayName}
                {displayOptionName && `: ${displayOptionName}`}
              </h3>
              <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                {isDeliveryAvailable && isPickupAvailable ? (
                  <span>Delivery & Pickup</span>
                ) : isDeliveryAvailable ? (
                  <span>Delivery Only</span>
                ) : isPickupAvailable ? (
                  <span>Pickup Only</span>
                ) : (
                  <span>No Delivery Options</span>
                )}
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
                    onClick={() => onAddOption?.()}
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
                      onClick={() => onOptionSelect?.(option)}>
                      {option.name}
                      {option.name !== "Standard" &&
                        ` (${option.price.toFixed(2)})`}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-medium">Description</h3>
              <p className="mt-2 text-muted-foreground">
                {displayDescription || "No description available."}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium">Terms of Service</h3>
              <p className="mt-2 text-muted-foreground">
                {displayTerms || "No terms of service available."}
              </p>
            </div>
          </>
        ) : (
          <>
            {/* ADD/EDIT PRODUCT FORM */}
            {(isNewProduct || isEditingProduct) && (
              <>
                <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <h3 className="font-medium text-blue-700 mb-1">
                    {isNewProduct ? "Add New Product" : "Edit Product"}
                  </h3>
                  <p className="text-sm text-blue-600">
                    {isNewProduct
                      ? "Create a new product. You'll be able to add options later."
                      : "You are editing the main product details."}
                  </p>
                </div>

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

                <div className="space-y-2">
                  <Label htmlFor="category_id">CATEGORY</Label>
                  <Select
                    value={formData?.category_id || ""}
                    onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>UPLOAD PHOTO</Label>
                  <div
                    className="border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50"
                    onClick={handleImageUpload}>
                    <div className="bg-primary/10 rounded-full p-3 mb-2">
                      <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Click to upload image
                    </span>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="available_for_pickup"
                      checked={formData?.available_for_pickup || false}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(
                          "available_for_pickup",
                          checked as boolean
                        )
                      }
                    />
                    <Label htmlFor="available_for_pickup">Pick up</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="available_for_delivery"
                      checked={formData?.available_for_delivery || false}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(
                          "available_for_delivery",
                          checked as boolean
                        )
                      }
                    />
                    <Label htmlFor="available_for_delivery">Delivery</Label>
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
                  <Label htmlFor="terms_of_service">TERMS OF SERVICE</Label>
                  <Textarea
                    id="terms_of_service"
                    name="terms_of_service"
                    value={formData?.terms_of_service || ""}
                    onChange={handleInputChange}
                    placeholder="Enter terms of service"
                    rows={4}
                    maxLength={200}
                  />
                  <p className="text-xs text-muted-foreground">200 chars max</p>
                </div>
              </>
            )}

            {/* ADD/EDIT OPTION FORM */}
            {(isNewOption || isEditingOption) && (
              <>
                <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-md">
                  <h3 className="font-medium text-amber-700 mb-1">
                    {isEditingOption
                      ? `Edit Option: ${formData?.name}`
                      : `Add Option to ${product?.name}`}
                  </h3>
                  <p className="text-sm text-amber-600">
                    {isEditingOption
                      ? "You are editing this specific product option."
                      : "You are adding a new option for this product."}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">OPTION NAME</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData?.name || ""}
                    onChange={handleInputChange}
                    placeholder="Enter option name (e.g., Extra Large)"
                  />
                </div>

                <div className="space-y-2">
                  <Label>UPLOAD PHOTO</Label>
                  <div
                    className="border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50"
                    onClick={handleImageUpload}>
                    <div className="bg-primary/10 rounded-full p-3 mb-2">
                      <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Click to upload image
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">PRICE</Label>
                    <div className="flex items-center">
                      <span className="mr-2">GHS</span>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        value={formData?.price || ""}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">QUANTITY</Label>
                    <div className="flex items-center">
                      <span className="mr-2">PCS</span>
                      <Input
                        id="stock"
                        name="stock"
                        type="number"
                        value={formData?.stock || ""}
                        onChange={handleInputChange}
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="available_for_pickup"
                      checked={formData?.available_for_pickup || false}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(
                          "available_for_pickup",
                          checked as boolean
                        )
                      }
                    />
                    <Label htmlFor="available_for_pickup">Pick up</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="available_for_delivery"
                      checked={formData?.available_for_delivery || false}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(
                          "available_for_delivery",
                          checked as boolean
                        )
                      }
                    />
                    <Label htmlFor="available_for_delivery">Delivery</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">DESCRIPTION</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData?.description || ""}
                    onChange={handleInputChange}
                    placeholder="Enter option description"
                    rows={4}
                    maxLength={200}
                  />
                  <p className="text-xs text-muted-foreground">200 chars max</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="terms_of_service">TERMS OF SERVICE</Label>
                  <Textarea
                    id="terms_of_service"
                    name="terms_of_service"
                    value={formData?.terms_of_service || ""}
                    onChange={handleInputChange}
                    placeholder="Enter terms of service"
                    rows={4}
                    maxLength={200}
                  />
                  <p className="text-xs text-muted-foreground">200 chars max</p>
                </div>
              </>
            )}
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
    </Card>
  );
}
