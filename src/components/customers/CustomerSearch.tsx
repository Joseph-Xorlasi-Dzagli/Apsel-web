import React from "react";
import { Search, Filter, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CustomerSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddCustomer: () => void;
}

export function CustomerSearch({
  searchQuery,
  onSearchChange,
  onAddCustomer,
}: CustomerSearchProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search customers..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex gap-2 w-full sm:w-auto justify-end">
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
        <Button onClick={onAddCustomer} size="sm">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>
    </div>
  );
}
