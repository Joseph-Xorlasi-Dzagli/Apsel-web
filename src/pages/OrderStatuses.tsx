import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Plus, Trash, Save, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { useBusiness } from "@/hooks/useBusiness";
import { convertFirestoreData } from "@/utils/dbUtils";

// Define the OrderStatus type
interface OrderStatus {
  id: string;
  business_id: string;
  name: string;
  color: string;
  description: string;
  is_default: boolean;
  created_at?: Date;
  updated_at?: Date;
}

// Available colors for order statuses
const statusColors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-red-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-orange-500",
  "bg-teal-500",
  "bg-cyan-500",
  "bg-gray-500",
];

export default function OrderStatuses() {
  const [statuses, setStatuses] = useState<OrderStatus[]>([]);
  const [editingStatus, setEditingStatus] = useState<OrderStatus | null>(null);
  const [newStatus, setNewStatus] = useState<Partial<OrderStatus>>({
    name: "",
    color: "bg-blue-500",
    description: "",
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [statusToDelete, setStatusToDelete] = useState<OrderStatus | null>(
    null
  );
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const { business, loading: businessLoading } = useBusiness();
  const [loading, setLoading] = useState(true);

  // Fetch order statuses when business data is available
  useEffect(() => {
    const fetchOrderStatuses = async () => {
      if (businessLoading || !business) return;

      try {
        setLoading(true);

        // Query for custom order statuses
        const statusesRef = collection(db, "order_statuses");
        const q = query(statusesRef, where("business_id", "==", business.id));
        const querySnapshot = await getDocs(q);

        const statusList: OrderStatus[] = [];
        querySnapshot.forEach((doc) => {
          statusList.push({
            id: doc.id,
            ...convertFirestoreData(doc.data()),
          } as OrderStatus);
        });

        // If no custom statuses, add default ones
        if (statusList.length === 0) {
          const defaultStatuses = [
            {
              name: "Processing",
              color: "bg-blue-500",
              description: "Order is being processed",
              is_default: true,
            },
            {
              name: "Completed",
              color: "bg-green-500",
              description: "Order has been fulfilled",
              is_default: true,
            },
            {
              name: "Pending",
              color: "bg-yellow-500",
              description: "Order is awaiting processing",
              is_default: true,
            },
            {
              name: "Canceled",
              color: "bg-red-500",
              description: "Order has been canceled",
              is_default: true,
            },
          ];

          // Create the default statuses in Firestore
          const batch = [];
          for (const status of defaultStatuses) {
            const statusData = {
              ...status,
              business_id: business.id,
              created_at: serverTimestamp(),
              updated_at: serverTimestamp(),
            };

            const docRef = await addDoc(
              collection(db, "order_statuses"),
              statusData
            );
            batch.push({
              id: docRef.id,
              ...status,
              business_id: business.id,
            });
          }

          setStatuses(batch);
        } else {
          // Sort statuses - default first, then alphabetically
          statusList.sort((a, b) => {
            if (a.is_default && !b.is_default) return -1;
            if (!a.is_default && b.is_default) return 1;
            return a.name.localeCompare(b.name);
          });

          setStatuses(statusList);
        }
      } catch (error) {
        console.error("Error fetching order statuses:", error);
        toast({
          title: "Error",
          description: "Failed to load order statuses",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrderStatuses();
  }, [business, businessLoading, toast]);

  const handleColorChange = (status: Partial<OrderStatus>) => {
    const currentColorIndex = statusColors.indexOf(
      status.color || "bg-blue-500"
    );
    const nextColorIndex = (currentColorIndex + 1) % statusColors.length;

    if (isCreating) {
      setNewStatus({ ...newStatus, color: statusColors[nextColorIndex] });
    } else if (editingStatus) {
      setEditingStatus({
        ...editingStatus,
        color: statusColors[nextColorIndex],
      });
    }
  };

  const handleStartCreate = () => {
    if (statuses.length >= 7) {
      toast({
        title: "Maximum limit reached",
        description: "You can have up to 7 order statuses.",
        variant: "destructive",
      });
      return;
    }
    setIsCreating(true);
    setNewStatus({
      name: "",
      color: "bg-blue-500",
      description: "",
    });
  };

  const handleCreateStatus = async () => {
    if (!business) return;

    if (!newStatus.name) {
      toast({
        title: "Name required",
        description: "Please provide a name for the status.",
        variant: "destructive",
      });
      return;
    }

    // Check if status with same name exists
    const existingStatus = statuses.find(
      (status) => status.name.toLowerCase() === newStatus.name?.toLowerCase()
    );

    if (existingStatus) {
      toast({
        title: "Status already exists",
        description: "A status with this name already exists.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // Add the status to Firestore
      const statusData = {
        business_id: business.id,
        name: newStatus.name,
        color: newStatus.color || "bg-blue-500",
        description: newStatus.description || "",
        is_default: false,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "order_statuses"), statusData);

      // Update local state
      const newStatusObj: OrderStatus = {
        id: docRef.id,
        ...statusData,
        created_at: new Date(),
        updated_at: new Date(),
      };

      setStatuses([...statuses, newStatusObj]);
      setIsCreating(false);
      setNewStatus({
        name: "",
        color: "bg-blue-500",
        description: "",
      });

      toast({
        title: "Status created",
        description: `${newStatus.name} has been added to your order statuses.`,
      });
    } catch (error) {
      console.error("Error creating order status:", error);
      toast({
        title: "Error",
        description: "Failed to create order status.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (status: OrderStatus) => {
    setEditingStatus(status);
  };

  const handleUpdateStatus = async () => {
    if (!editingStatus || !business) return;

    if (!editingStatus.name) {
      toast({
        title: "Name required",
        description: "Please provide a name for the status.",
        variant: "destructive",
      });
      return;
    }

    // Check if another status with same name exists
    const existingStatus = statuses.find(
      (status) =>
        status.id !== editingStatus.id &&
        status.name.toLowerCase() === editingStatus.name.toLowerCase()
    );

    if (existingStatus) {
      toast({
        title: "Status already exists",
        description: "Another status with this name already exists.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // Update the status in Firestore
      const statusRef = doc(db, "order_statuses", editingStatus.id);
      await updateDoc(statusRef, {
        name: editingStatus.name,
        color: editingStatus.color,
        description: editingStatus.description,
        updated_at: serverTimestamp(),
      });

      // Update local state
      setStatuses(
        statuses.map((s) =>
          s.id === editingStatus.id
            ? { ...editingStatus, updated_at: new Date() }
            : s
        )
      );
      setEditingStatus(null);

      toast({
        title: "Status updated",
        description: `${editingStatus.name} has been updated.`,
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartDelete = (status: OrderStatus) => {
    if (status.is_default) {
      toast({
        title: "Cannot delete",
        description: "Default order statuses cannot be deleted.",
        variant: "destructive",
      });
      return;
    }

    if (statuses.length <= 1) {
      toast({
        title: "Cannot delete",
        description: "You must have at least one order status.",
        variant: "destructive",
      });
      return;
    }

    setStatusToDelete(status);
    setShowDeleteDialog(true);
  };

  const handleDeleteStatus = async () => {
    if (!statusToDelete || !business) return;

    try {
      setLoading(true);

      // Delete the status from Firestore
      await deleteDoc(doc(db, "order_statuses", statusToDelete.id));

      // Update local state
      setStatuses(statuses.filter((s) => s.id !== statusToDelete.id));
      setShowDeleteDialog(false);
      setStatusToDelete(null);

      toast({
        title: "Status deleted",
        description: `${statusToDelete.name} has been removed.`,
      });
    } catch (error) {
      console.error("Error deleting order status:", error);
      toast({
        title: "Error",
        description: "Failed to delete order status.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingStatus(null);
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <Link to="/orders">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Order Statuses
            </h1>
            <p className="text-muted-foreground">
              Create and manage your order status labels.
            </p>
          </div>
        </div>
        <Button
          onClick={handleStartCreate}
          disabled={isCreating || loading || statuses.length >= 7}>
          <Plus className="mr-2 h-4 w-4" />
          Add Status
        </Button>
      </div>

      <Card className="border-none">
        <CardContent>
          <div className="space-y-4">
            {loading && statuses.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">
                  Loading order statuses...
                </p>
              </div>
            ) : statuses.length === 0 ? (
              <Alert>
                <AlertDescription>
                  You don't have any order statuses yet. Create one to get
                  started.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                {isCreating && (
                  <div className="border p-4 rounded-md space-y-4 bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-5 w-5 rounded cursor-pointer ${newStatus.color}`}
                        onClick={() => handleColorChange(newStatus)}
                      />
                      <Input
                        value={newStatus.name}
                        onChange={(e) =>
                          setNewStatus({ ...newStatus, name: e.target.value })
                        }
                        placeholder="Status name"
                        className="max-w-sm"
                      />
                    </div>
                    <Input
                      value={newStatus.description || ""}
                      onChange={(e) =>
                        setNewStatus({
                          ...newStatus,
                          description: e.target.value,
                        })
                      }
                      placeholder="Description (optional)"
                    />
                    <div className="flex items-center gap-2">
                      <Button onClick={handleCreateStatus} disabled={loading}>
                        <Save className="mr-2 h-4 w-4" />
                        Save
                      </Button>
                      <Button variant="outline" onClick={handleCancelCreate}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {statuses.map((status) => (
                    <div key={status.id} className="border p-4 rounded-md">
                      {editingStatus && editingStatus.id === status.id ? (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`h-5 w-5 rounded cursor-pointer ${editingStatus.color}`}
                              onClick={() => handleColorChange(editingStatus)}
                            />
                            <Input
                              value={editingStatus.name}
                              onChange={(e) =>
                                setEditingStatus({
                                  ...editingStatus,
                                  name: e.target.value,
                                })
                              }
                              placeholder="Status name"
                              className="max-w-sm"
                            />
                          </div>
                          <Input
                            value={editingStatus.description}
                            onChange={(e) =>
                              setEditingStatus({
                                ...editingStatus,
                                description: e.target.value,
                              })
                            }
                            placeholder="Description (optional)"
                          />
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={handleUpdateStatus}
                              disabled={loading}>
                              <Save className="mr-2 h-4 w-4" />
                              Save
                            </Button>
                            <Button
                              variant="outline"
                              onClick={handleCancelEdit}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`h-5 w-5 rounded ${status.color}`}
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{status.name}</p>
                                {status.is_default && (
                                  <Badge variant="outline" className="text-xs">
                                    Default
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {status.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStartEdit(status)}
                              disabled={loading}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStartDelete(status)}
                              disabled={status.is_default || loading}>
                              <Trash className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Status</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the "{statusToDelete?.name}"
              status? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteStatus}
              disabled={loading}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
