
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { DateRange } from 'react-day-picker';
import { sampleCategories } from '@/lib/data';

interface SalesByCategoryChartProps {
  dateRange: DateRange | undefined;
}

export function SalesByCategoryChart({ dateRange }: SalesByCategoryChartProps) {
  const [data, setData] = useState<any[]>([]);
  
  useEffect(() => {
    // Generate random sales data for each category
    const categoryData = sampleCategories.map(category => {
      const thisMonthSales = Math.floor(Math.random() * 5000) + 1000;
      const lastMonthSales = Math.floor(Math.random() * 5000) + 1000;
      
      return {
        name: category.name,
        thisMonth: thisMonthSales,
        lastMonth: lastMonthSales,
        change: ((thisMonthSales - lastMonthSales) / lastMonthSales * 100).toFixed(1)
      };
    });
    
    // Sort by thisMonth sales descending
    categoryData.sort((a, b) => b.thisMonth - a.thisMonth);
    
    setData(categoryData);
  }, [dateRange]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales by Category</CardTitle>
        <CardDescription>
          Comparing current period with previous period
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barGap={0}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis
                tickFormatter={(value) => `GHS ${value}`}
                width={80}
              />
              <Tooltip
                formatter={(value, name) => [
                  `GHS ${(value as number).toFixed(2)}`,
                  name === 'thisMonth' ? 'Current Period' : 'Previous Period'
                ]}
              />
              <Legend 
                payload={[
                  { value: 'Current Period', type: 'square', color: '#00B5CC' },
                  { value: 'Previous Period', type: 'square', color: '#8884d8' }
                ]}
              />
              <Bar dataKey="thisMonth" fill="#00B5CC" name="Current Period" radius={[4, 4, 0, 0]} />
              <Bar dataKey="lastMonth" fill="#8884d8" name="Previous Period" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 font-medium">Category</th>
                <th className="text-right py-3 font-medium">Current</th>
                <th className="text-right py-3 font-medium">Previous</th>
                <th className="text-right py-3 font-medium">Change</th>
              </tr>
            </thead>
            <tbody>
              {data.map((category, index) => (
                <tr key={index} className="border-b">
                  <td className="py-3">{category.name}</td>
                  <td className="text-right py-3">GHS {category.thisMonth.toFixed(2)}</td>
                  <td className="text-right py-3">GHS {category.lastMonth.toFixed(2)}</td>
                  <td className={`text-right py-3 ${parseFloat(category.change) >= 0 ? 'text-status-completed' : 'text-status-canceled'}`}>
                    {parseFloat(category.change) >= 0 ? '+' : ''}{category.change}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
