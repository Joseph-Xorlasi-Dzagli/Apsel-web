import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft, Trash, Plus, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { createOrder } from "@/services/firestoreService"; // Import from services instead of useOrders hook
import { useProducts } from "@/hooks/useProducts";
import { OrderItem } from "@/types/order";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Define the form schema
const formSchema = z.object({
  customerName: z.string().min(2, { message: "Customer name is required" }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .optional()
    .or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
  paymentMethod: z.string(),
  shippingMethod: z.string(),
});

// Order item type for the form
interface FormOrderItem {
  id: string;
  productId: string;
  productOptionId?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export default function CreateOrder() {
  const [orderItems, setOrderItems] = useState<FormOrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { products, loading: productsLoading } = useProducts();

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      notes: "",
      paymentMethod: "mobileMoney",
      shippingMethod: "delivery",
    },
  });

  // Add a new order item
  const addOrderItem = () => {
    if (products.length === 0) {
      toast({
        title: "No products available",
        description: "You need to add products first before creating an order.",
        variant: "destructive",
      });
      return;
    }

    // Get a random product or the first one
    const randomProduct = products[Math.floor(Math.random() * products.length)];

    // Get the first option (or use default values if no options)
    const productOption =
      randomProduct.options && randomProduct.options.length > 0
        ? randomProduct.options[0]
        : { price: 0, name: "Standard" };

    setOrderItems([
      ...orderItems,
      {
        id: `item-${Date.now()}`,
        productId: randomProduct.id,
        productOptionId: productOption.id,
        name: randomProduct.name,
        price: productOption.price || 0,
        quantity: 1,
        image: productOption.image_url,
      },
    ]);
  };

  // Remove an order item
  const removeOrderItem = (itemId: string) => {
    setOrderItems(orderItems.filter((item) => item.id !== itemId));
  };

  // Update item quantity
  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return;

    setOrderItems(
      orderItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  // Calculate subtotal
  const calculateSubtotal = () => {
    return orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  // Calculate shipping
  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return form.watch("shippingMethod") === "delivery" ? subtotal * 0.1 : 0;
  };

  // Calculate tax
  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    return subtotal * 0.05;
  };

  // Calculate total
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = calculateShipping();
    const tax = calculateTax();
    return subtotal + shipping + tax;
  };

  // Form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (orderItems.length === 0) {
      toast({
        title: "No items added",
        description: "Please add at least one item to the order.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Prepare order data
      const orderData = {
        customer: {
          name: values.customerName,
          email: values.email || undefined,
          phone: values.phone || undefined,
        },
        shipping_method: values.shippingMethod as "delivery" | "pickup",
        shipping_address: values.address || undefined,
        city: values.city || undefined,
        payment_method: values.paymentMethod,
        payment_status: "unpaid" as const,
        notes: values.notes || undefined,
        status: "pending" as const,
      };

      // Prepare items
      const items = orderItems.map((item) => ({
        product_id: item.productId,
        product_option_id: item.productOptionId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity,
        image: item.image,
      }));

      // Create the order using the service function
      const newOrder = await createOrder(orderData, items);

      toast({
        title: "Order Created",
        description: `Order #${newOrder.id} has been created successfully.`,
      });
      navigate(`/orders/${newOrder.id}`);
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Error",
        description: "There was a problem creating your order.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" asChild>
          <Link to="/orders">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Order</h1>
          <p className="text-muted-foreground">
            Add a new order to your system
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
                <CardDescription>
                  Enter the customer's details for this order.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter customer name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="customer@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="+233 20 123 4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Shipping address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add any notes or special instructions"
                          className="h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Order Settings */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Settings</CardTitle>
                  <CardDescription>
                    Configure payment and shipping options.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Method</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="mobileMoney">
                              Mobile Money
                            </SelectItem>
                            <SelectItem value="cash">
                              Cash on Delivery
                            </SelectItem>
                            <SelectItem value="bankTransfer">
                              Bank Transfer
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shippingMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shipping Method</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            // Force re-render to update totals
                            form.trigger("shippingMethod");
                          }}
                          defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select shipping method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="delivery">Delivery</SelectItem>
                            <SelectItem value="pickup">Pickup</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          {field.value === "delivery"
                            ? "Delivery fee will be applied"
                            : "No delivery fee will be charged"}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>GHS {calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>GHS {calculateShipping().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (5%)</span>
                    <span>GHS {calculateTax().toFixed(2)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>GHS {calculateTotal().toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Order Items */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Order Items</CardTitle>
                <CardDescription>
                  Add products to this order. At least one item is required.
                </CardDescription>
              </div>
              <Button
                type="button"
                onClick={addOrderItem}
                variant="outline"
                disabled={productsLoading || products.length === 0}>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </CardHeader>
            <CardContent>
              {productsLoading ? (
                <div className="flex justify-center py-8">
                  <p className="text-muted-foreground">Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Package className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">
                    No products available in your inventory.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4"
                    asChild>
                    <Link to="/inventory">Manage Inventory</Link>
                  </Button>
                </div>
              ) : orderItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Package className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">
                    No items added to this order yet.
                  </p>
                  <Button
                    type="button"
                    onClick={addOrderItem}
                    variant="outline"
                    className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-3 flex-1 mr-4">
                        <Avatar className="h-10 w-10 rounded-md border">
                          {item.image ? (
                            <AvatarImage src={item.image} alt={item.name} />
                          ) : null}
                          <AvatarFallback className="rounded-md">
                            {item.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            GHS {item.price.toFixed(2)} each
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center border rounded-md">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 rounded-r-none px-0"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}>
                            -
                          </Button>
                          <div className="w-10 text-center">
                            {item.quantity}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 rounded-l-none px-0"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }>
                            +
                          </Button>
                        </div>

                        <div className="w-24 text-right font-medium">
                          GHS {(item.price * item.quantity).toFixed(2)}
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOrderItem(item.id)}>
                          <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link to="/orders">Cancel</Link>
              </Button>
              <Button
                type="submit"
                disabled={loading || orderItems.length === 0}>
                {loading ? "Creating..." : "Create Order"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
