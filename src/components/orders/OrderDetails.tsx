// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { OrderType, sampleOrders } from "@/lib/data";
// import {
//   ArrowLeft,
//   Printer,
//   MessageSquare,
//   Calendar,
//   CreditCard,
//   User,
//   Phone,
//   Mail,
//   MapPin,
// } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

// const OrderDetails = () => {
//   const { orderId } = useParams<{ orderId: string }>();
//   const [order, setOrder] = useState<OrderType | null>(null);
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   useEffect(() => {
//     // In a real app, this would be an API call
//     const foundOrder = sampleOrders.find((o) => o.id === orderId);
//     setOrder(foundOrder || null);
//   }, [orderId]);

//   const handlePrint = () => {
//     toast({
//       title: "Print Order",
//       description: "Printing functionality will be available soon!",
//     });
//   };

//   const handleContactCustomer = () => {
//     toast({
//       title: "Contact Customer",
//       description: "Messaging functionality will be available soon!",
//     });
//   };

//   if (!order) {
//     return (
//       <div className="flex items-center justify-center h-[60vh]">
//         <p className="text-muted-foreground">Order not found</p>
//       </div>
//     );
//   }

//   const statusColorMap: Record<string, string> = {
//     pending: "bg-yellow-100 text-yellow-800",
//     processing: "bg-blue-100 text-blue-800",
//     completed: "bg-green-100 text-green-800",
//     cancelled: "bg-red-100 text-red-800",
//     refunded: "bg-gray-100 text-gray-800",
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <Button
//             variant="outline"
//             size="icon"
//             onClick={() => navigate("/orders")}>
//             <ArrowLeft className="h-4 w-4" />
//           </Button>
//           <h1 className="text-2xl font-bold">Order #{order.id}</h1>
//         </div>
//         <div className="flex gap-2">
//           <Button variant="outline" onClick={handlePrint}>
//             <Printer className="mr-2 h-4 w-4" />
//             Print
//           </Button>
//           <Button variant="outline" onClick={handleContactCustomer}>
//             <MessageSquare className="mr-2 h-4 w-4" />
//             Contact
//           </Button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="md:col-span-2 space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Order Summary</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="flex flex-wrap gap-y-4 justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground">Status</p>
//                   <Badge
//                     variant="outline"
//                     className={`${
//                       statusColorMap[order.status]
//                     } border-none mt-1`}>
//                     {order.status.charAt(0).toUpperCase() +
//                       order.status.slice(1)}
//                   </Badge>
//                 </div>
//                 <div>
//                   <p className="text-sm text-muted-foreground">Order Date</p>
//                   <div className="flex items-center mt-1">
//                     <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
//                     <span>
//                       {new Date(order.date).toLocaleDateString()}, {order.time}
//                     </span>
//                   </div>
//                 </div>
//                 {order.paymentMethod && (
//                   <div>
//                     <p className="text-sm text-muted-foreground">
//                       Payment Method
//                     </p>
//                     <div className="flex items-center mt-1">
//                       <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
//                       <span>{order.paymentMethod}</span>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <Separator />

//               <div>
//                 <h3 className="font-medium mb-4">Order Items</h3>
//                 <div className="rounded-md border overflow-hidden">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-muted/50">
//                       <tr>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                           Product
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                           Price
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                           Quantity
//                         </th>
//                         <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
//                           Total
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {order.items.map((item) => (
//                         <tr key={item.id}>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="text-sm font-medium">
//                               {item.name}
//                             </div>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="text-sm">
//                               ${item.price.toFixed(2)}
//                             </div>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="text-sm">{item.quantity}</div>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-right">
//                             <div className="text-sm font-medium">
//                               ${(item.quantity * item.price).toFixed(2)}
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>

//               <div className="flex justify-end">
//                 <div className="w-full sm:w-72 space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span>Subtotal</span>
//                     <span>${order.subtotal.toFixed(2)}</span>
//                   </div>
//                   {order.shipping !== undefined && (
//                     <div className="flex justify-between text-sm">
//                       <span>Shipping</span>
//                       <span>${order.shipping.toFixed(2)}</span>
//                     </div>
//                   )}
//                   {order.tax !== undefined && (
//                     <div className="flex justify-between text-sm">
//                       <span>Tax</span>
//                       <span>${order.tax.toFixed(2)}</span>
//                     </div>
//                   )}
//                   <Separator />
//                   <div className="flex justify-between font-bold">
//                     <span>Total</span>
//                     <span>${order.total.toFixed(2)}</span>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {order.notes && (
//             <Card>
//               <CardHeader>
//                 <CardTitle>Order Notes</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p>{order.notes}</p>
//               </CardContent>
//             </Card>
//           )}
//         </div>

//         <div className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Customer Information</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="flex items-center gap-2">
//                 <User className="h-4 w-4 text-muted-foreground" />
//                 <span className="font-medium">{order.customerName}</span>
//               </div>
//               {order.phone && (
//                 <div className="flex items-center gap-2">
//                   <Phone className="h-4 w-4 text-muted-foreground" />
//                   <span>{order.phone}</span>
//                 </div>
//               )}
//               {order.email && (
//                 <div className="flex items-center gap-2">
//                   <Mail className="h-4 w-4 text-muted-foreground" />
//                   <a
//                     href={`mailto:${order.email}`}
//                     className="text-blue-600 hover:underline">
//                     {order.email}
//                   </a>
//                 </div>
//               )}
//             </CardContent>
//           </Card>

//           {order.address && (
//             <Card>
//               <CardHeader>
//                 <CardTitle>Shipping Address</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex items-start gap-2">
//                   <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
//                   <span>{order.address}</span>
//                 </div>
//               </CardContent>
//             </Card>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderDetails;
