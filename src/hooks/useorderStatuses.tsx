// import { useState, useEffect, useCallback } from "react";
// import { useToast } from "@/hooks/use-toast";
// import { useBusiness } from "@/hooks/useBusiness";
// import {
//   getOrderStatusesByBusiness,
//   addOrderStatus,
//   updateOrderStatus,
//   deleteOrderStatus,
// } from "@/services/firestoreService";
// import { convertFirestoreData } from "@/utils/dbUtils";

// export interface OrderStatus {
//   id: string;
//   business_id: string;
//   name: string;
//   color: string;
//   description: string;
//   is_default?: boolean;
//   created_at: Date;
//   updated_at: Date;
// }

// export function useOrderStatuses() {
//   const { toast } = useToast();
//   const { business, loading: businessLoading } = useBusiness();

//   const [statuses, setStatuses] = useState<OrderStatus[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [refreshTrigger, setRefreshTrigger] = useState(0);

//   // Fetch order statuses when business data is available
//   useEffect(() => {
//     const fetchOrderStatuses = async () => {
//       if (businessLoading || !business) return;

//       try {
//         setLoading(true);
//         setError(null);

//         const statusesData = await getOrderStatusesByBusiness(business.id);
//         const processedStatuses = statusesData.map((status) =>
//           convertFirestoreData(status)
//         ) as OrderStatus[];

//         // If no statuses exist, create default ones
//         if (processedStatuses.length === 0) {
//           const defaultStatuses = [
//             {
//               business_id: business.id,
//               name: "Pending",
//               color: "bg-yellow-500",
//               description: "Order is awaiting processing",
//               is_default: true,
//             },
//             {
//               business_id: business.id,
//               name: "Processing",
//               color: "bg-blue-500",
//               description: "Order is being processed",
//               is_default: false,
//             },
//             {
//               business_id: business.id,
//               name: "Completed",
//               color: "bg-green-500",
//               description: "Order has been fulfilled",
//               is_default: false,
//             },
//             {
//               business_id: business.id,
//               name: "Canceled",
//               color: "bg-red-500",
//               description: "Order has been canceled",
//               is_default: false,
//             },
//           ];

//           // Create default statuses in Firestore
//           const createPromises = defaultStatuses.map((status) =>
//             addOrderStatus(status)
//           );
//           await Promise.all(createPromises);

//           // Refresh the list to get the newly created statuses with IDs
//           const freshStatuses = await getOrderStatusesByBusiness(business.id);
//           setStatuses(
//             freshStatuses.map((status) =>
//               convertFirestoreData(status)
//             ) as OrderStatus[]
//           );
//         } else {
//           setStatuses(processedStatuses);
//         }
//       } catch (err: any) {
//         console.error("Error fetching order statuses:", err);
//         setError(err.message);
//         toast({
//           title: "Error",
//           description: "Failed to load order statuses",
//           variant: "destructive",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrderStatuses();
//   }, [business, businessLoading, refreshTrigger, toast]);

//   // Add a new order status
//   const handleAddStatus = useCallback(
//     async (
//       statusData: Omit<
//         OrderStatus,
//         "id" | "business_id" | "created_at" | "updated_at"
//       >
//     ) => {
//       if (!business) {
//         toast({
//           title: "Error",
//           description: "Business data is required to add a status",
//           variant: "destructive",
//         });
//         return null;
//       }

//       try {
//         // Check if we've reached the maximum limit (7)
//         if (statuses.length >= 7) {
//           toast({
//             title: "Maximum limit reached",
//             description: "You can have up to 7 order statuses.",
//             variant: "destructive",
//           });
//           return null;
//         }

//         // Check if a status with the same name already exists
//         const statusName = statusData.name.trim();
//         const generatedStatusId = statusName
//         .toLowerCase()
//         .replace(/\s+/g, "-");




//         if (statuses.some((status) => status.id === generatedStatusId)) {
//           toast({
//             title: "Status already exists",
//             description: "A status with this name already exists.",
//             variant: "destructive",
//           });
//           return null;
//         }

//         // Add the status
//         const newStatus = {
//           ...statusData,
//           business_id: business.id,
//           is_default: false,
//         };

//         const statusId = await addOrderStatus(newStatus);

//         // Refresh the list
//         setRefreshTrigger((prev) => prev + 1);

//         toast({
//           title: "Status created",
//           description: `${statusData.name} has been added to your order statuses.`,
//         });

//         return statusId;
//       } catch (err: any) {
//         console.error("Error adding order status:", err);
//         toast({
//           title: "Error",
//           description: "Failed to add order status",
//           variant: "destructive",
//         });
//         return null;
//       }
//     },
//     [business, statuses, toast]
//   );

//   // Update an existing order status
//   const handleUpdateStatus = useCallback(
//     async (statusId: string, statusData: Partial<OrderStatus>) => {
//       try {
//         const currentStatus = statuses.find((s) => s.id === statusId);
//         if (!currentStatus) {
//           toast({
//             title: "Error",
//             description: "Order status not found",
//             variant: "destructive",
//           });
//           return false;
//         }

//         await updateOrderStatus(statusId, statusData.);

//         // Update local state
//         setStatuses((prev) =>
//           prev.map((status) =>
//             status.id === statusId ? { ...status, ...statusData } : status
//           )
//         );

//         toast({
//           title: "Status updated",
//           description: `${
//             statusData.name || currentStatus.name
//           } has been updated.`,
//         });

//         return true;
//       } catch (err: any) {
//         console.error("Error updating order status:", err);
//         toast({
//           title: "Error",
//           description: "Failed to update order status",
//           variant: "destructive",
//         });
//         return false;
//       }
//     },
//     [statuses, toast]
//   );

//   // Delete an order status
//   const handleDeleteStatus = useCallback(
//     async (statusId: string) => {
//       try {
//         const statusToDelete = statuses.find((s) => s.id === statusId);
//         if (!statusToDelete) {
//           toast({
//             title: "Error",
//             description: "Order status not found",
//             variant: "destructive",
//           });
//           return false;
//         }

//         // Check if we have enough statuses (need at least 1)
//         if (statuses.length <= 1) {
//           toast({
//             title: "Cannot delete",
//             description: "You must have at least one order status.",
//             variant: "destructive",
//           });
//           return false;
//         }

//         // Prevent deletion of default status
//         if (statusToDelete.is_default) {
//           toast({
//             title: "Cannot delete default status",
//             description: "The default status cannot be deleted.",
//             variant: "destructive",
//           });
//           return false;
//         }

//         await deleteOrderStatus(statusId);

//         // Update local state
//         setStatuses((prev) => prev.filter((status) => status.id !== statusId));

//         toast({
//           title: "Status deleted",
//           description: `${statusToDelete.name} has been removed.`,
//         });

//         return true;
//       } catch (err: any) {
//         console.error("Error deleting order status:", err);
//         toast({
//           title: "Error",
//           description: "Failed to delete order status",
//           variant: "destructive",
//         });
//         return false;
//       }
//     },
//     [statuses, toast]
//   );

//   return {
//     statuses,
//     loading,
//     error,
//     handleAddStatus,
//     handleUpdateStatus,
//     handleDeleteStatus,
//   };
// }