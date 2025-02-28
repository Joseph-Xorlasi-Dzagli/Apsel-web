
import { BarChart, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { sampleProducts, getTopSellingProducts } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export function TopSellingProducts() {
  const isMobile = useIsMobile();
  const topProducts = getTopSellingProducts(sampleProducts, 5);
  
  return (
    <Card className="col-span-1 animate-in-slide">
      <CardHeader>
        <CardTitle>Top Selling Products</CardTitle>
        <CardDescription>Your best performers this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topProducts.map((product) => (
            <div key={product.id} className="flex items-start justify-between">
              <div className="flex items-center">
                <Avatar className="h-9 w-9 mr-3 border">
                  <AvatarImage src={product.image} alt={product.name} />
                  <AvatarFallback className="text-xs">{product.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.category}</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-sm font-medium">GHS {product.price.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">{product.sold} sold</p>
              </div>
            </div>
          ))}
          
          {topProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <BarChart3 className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No sales data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
