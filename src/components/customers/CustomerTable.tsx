import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  ArrowUpDown,
  UserCheck,
  Edit,
  Trash2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { CustomerType } from "@/lib/data";

interface CustomerTableProps {
  customers: CustomerType[];
  selectedCustomer: CustomerType | null;
  sortField: keyof CustomerType;
  sortOrder: "asc" | "desc";
  onSort: (field: keyof CustomerType) => void;
  onView: (customer: CustomerType) => void;
  onEdit: (customer: CustomerType) => void;
  onDelete: (customer: CustomerType) => void;
}

export function CustomerTable({
  customers,
  selectedCustomer,
  sortField,
  sortOrder,
  onSort,
  onView,
  onEdit,
  onDelete,
}: CustomerTableProps) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                onClick={() => onSort("name")}
                className="cursor-pointer w-[240px]">
                Name
                <ArrowUpDown className="ml-1 h-3 w-3 inline" />
              </TableHead>
              <TableHead
                onClick={() => onSort("email")}
                className="cursor-pointer">
                Contact
                <ArrowUpDown className="ml-1 h-3 w-3 inline" />
              </TableHead>
              <TableHead
                onClick={() => onSort("location")}
                className="cursor-pointer max-w-[120px] hidden md:table-cell">
                Location
                <ArrowUpDown className="ml-1 h-3 w-3 inline" />
              </TableHead>
              <TableHead
                onClick={() => onSort("status")}
                className="cursor-pointer w-[100px]">
                Status
                <ArrowUpDown className="ml-1 h-3 w-3 inline" />
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground">
                  No customers found. Try adjusting your search.
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow
                  key={customer.id}
                  className={
                    selectedCustomer?.id === customer.id ? "bg-muted" : ""
                  }>
                  <TableCell
                    className="font-medium"
                    onClick={() => onView(customer)}>
                    <div className="flex items-center gap-3 cursor-pointer hover:text-brand">
                      <Avatar className="h-8 w-8">
                        {customer.avatar ? (
                          <AvatarImage
                            src={customer.avatar}
                            alt={customer.name}
                          />
                        ) : (
                          <AvatarFallback>
                            {customer.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {customer.company}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                        {customer.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                        {customer.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center">
                      <MapPin className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                      {customer.location}
                    </div>
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <span className="sr-only">Open menu</span>
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 15 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4">
                            <path
                              d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z"
                              fill="currentColor"
                              fillRule="evenodd"
                              clipRule="evenodd"></path>
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView(customer)}>
                          <UserCheck className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(customer)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => onDelete(customer)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
