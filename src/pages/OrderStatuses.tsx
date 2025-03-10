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

// Define the OrderStatus type
interface OrderStatus {
  id: string;
  name: string;
  color: string;
  description: string;
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
  const [statuses, setStatuses] = useState<OrderStatus[]>([
    {
      id: "processing",
      name: "Processing",
      color: "bg-blue-500",
      description: "Order is being processed",
    },
    {
      id: "completed",
      name: "Completed",
      color: "bg-green-500",
      description: "Order has been fulfilled",
    },
    {
      id: "pending",
      name: "Pending",
      color: "bg-yellow-500",
      description: "Order is awaiting processing",
    },
    {
      id: "canceled",
      name: "Canceled",
      color: "bg-red-500",
      description: "Order has been canceled",
    },
  ]);
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

  const handleCreateStatus = () => {
    if (!newStatus.name) {
      toast({
        title: "Name required",
        description: "Please provide a name for the status.",
        variant: "destructive",
      });
      return;
    }

    const id = newStatus.name.toLowerCase().replace(/\s+/g, "-");

    if (statuses.some((status) => status.id === id)) {
      toast({
        title: "Status already exists",
        description: "A status with this name already exists.",
        variant: "destructive",
      });
      return;
    }

    setStatuses([
      ...statuses,
      {
        id,
        name: newStatus.name,
        color: newStatus.color || "bg-blue-500",
        description: newStatus.description || "",
      },
    ]);

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
  };

  const handleStartEdit = (status: OrderStatus) => {
    setEditingStatus(status);
  };

  const handleUpdateStatus = () => {
    if (!editingStatus) return;

    if (!editingStatus.name) {
      toast({
        title: "Name required",
        description: "Please provide a name for the status.",
        variant: "destructive",
      });
      return;
    }

    setStatuses(
      statuses.map((s) => (s.id === editingStatus.id ? editingStatus : s))
    );
    setEditingStatus(null);

    toast({
      title: "Status updated",
      description: `${editingStatus.name} has been updated.`,
    });
  };

  const handleStartDelete = (status: OrderStatus) => {
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

  const handleDeleteStatus = () => {
    if (!statusToDelete) return;

    setStatuses(statuses.filter((s) => s.id !== statusToDelete.id));
    setShowDeleteDialog(false);
    setStatusToDelete(null);

    toast({
      title: "Status deleted",
      description: `${statusToDelete.name} has been removed.`,
    });
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
              Create and manage up to 7 order status labels for your orders.
            </p>
          </div>
        </div>
        <Button
          onClick={handleStartCreate}
          disabled={isCreating || statuses.length >= 7}>
          <Plus className="mr-2 h-4 w-4" />
          Add Status
        </Button>
      </div>

      <Card className="border-none">
        <CardContent>
          <div className="space-y-4">
            {statuses.length === 0 && (
              <Alert>
                <AlertDescription>
                  You don't have any order statuses yet. Create one to get
                  started.
                </AlertDescription>
              </Alert>
            )}

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
                    setNewStatus({ ...newStatus, description: e.target.value })
                  }
                  placeholder="Description (optional)"
                />
                <div className="flex items-center gap-2">
                  <Button onClick={handleCreateStatus}>
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
                        <Button onClick={handleUpdateStatus}>
                          <Save className="mr-2 h-4 w-4" />
                          Save
                        </Button>
                        <Button variant="outline" onClick={handleCancelEdit}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-5 w-5 rounded ${status.color}`} />
                        <div>
                          <p className="font-medium">{status.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {status.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStartEdit(status)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStartDelete(status)}>
                          <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
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
            <Button variant="destructive" onClick={handleDeleteStatus}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
