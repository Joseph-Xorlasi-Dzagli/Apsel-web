import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Package,
  CreditCard,
  Building,
} from "lucide-react";
import { CustomerType, formatCurrency } from "@/lib/data";


// Format dates
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

interface CustomerViewProps {
  customer: CustomerType;
  onEdit: () => void;
}

export function CustomerView({ customer, onEdit }: CustomerViewProps) {
  return (
    <div className="space-y-6">
      {/* Customer Overview Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                {customer.avatar ? (
                  <AvatarImage src={customer.avatar} alt={customer.name} />
                ) : (
                  <AvatarFallback className="text-lg">
                    {customer.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <CardTitle className="text-xl">{customer.name}</CardTitle>
                <CardDescription className="mt-1">
                  <Badge
                    variant={
                      customer.status === "active"
                        ? "default"
                        : customer.status === "inactive"
                        ? "secondary"
                        : "outline"
                    }>
                    {customer.status}
                  </Badge>
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{customer.company}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a
                href={`mailto:${customer.email}`}
                className="text-sm hover:underline">
                {customer.email}
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <a
                href={`tel:${customer.phone}`}
                className="text-sm hover:underline">
                {customer.phone}
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{customer.location}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Customer since {formatDate(customer.createdAt)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Statistics */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Spent
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <div className="flex items-center">
              <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-xl font-bold">
                {formatCurrency(customer.totalSpent)}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <div className="flex items-center">
              <Package className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-xl font-bold">{customer.orders}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      {customer.notes && (
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <p className="text-sm">{customer.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Last Order */}
      {customer.lastOrder && (
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Last Order
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">{formatDate(customer.lastOrder)}</span>
              <Button variant="link" size="sm" className="h-auto p-0">
                View Order
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end space-x-2 mt-6">
        <Button variant="outline" onClick={onEdit}>
          Edit Customer
        </Button>
      </div>
    </div>
  );
}
