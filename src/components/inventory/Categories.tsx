
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal, Pencil, Search, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { sampleCategories } from "@/lib/data";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Categories() {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState("");

  const handleEdit = (category: any) => {
    toast({
      title: "Edit Category",
      description: `You are editing ${category.name}`,
    });
  };

  const handleDelete = (category: any) => {
    toast({
      title: "Delete Category",
      description: `You want to delete ${category.name}`,
      variant: "destructive",
    });
  };

  // Filter categories based on search
  const filteredCategories = sampleCategories.filter(
    (category) =>
      !searchTerm || category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>
            {filteredCategories.length} categories found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-3"}`}>
            {filteredCategories.map((category) => (
              <div 
                key={category.id} 
                className="group relative overflow-hidden border rounded-lg hover:shadow-md transition-all"
              >
                <div className="absolute top-2 right-2 z-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="h-8 w-8 bg-white/80 backdrop-blur-sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(category)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDelete(category)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="h-40 w-full bg-muted overflow-hidden">
                  <Avatar className="h-full w-full rounded-none">
                    <AvatarImage src={category.image} alt={category.name} className="object-cover" />
                    <AvatarFallback className="rounded-none text-lg">
                      {category.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="p-4">
                  <h3 className="font-medium text-lg">{category.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {category.productCount} products
                  </p>
                </div>
                
                <div className="p-4 border-t flex justify-end">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(category)}>
                    <Pencil className="mr-2 h-3 w-3" />
                    Edit Category
                  </Button>
                </div>
              </div>
            ))}
            
            {filteredCategories.length === 0 && (
              <div className="col-span-3 text-center py-10">
                <p className="text-muted-foreground">No categories found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
