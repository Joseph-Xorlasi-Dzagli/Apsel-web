
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { DateRange } from 'react-day-picker';

interface SalesByChannelChartProps {
  dateRange: DateRange | undefined;
}

export function SalesByChannelChart({ dateRange }: SalesByChannelChartProps) {
  const [data, setData] = useState<any[]>([]);
  
  useEffect(() => {
    // For demo purposes, generate random data
    const mockChannels = [
      { name: 'Website', value: Math.floor(Math.random() * 5000) + 3000, color: '#00B5CC' },
      { name: 'Mobile App', value: Math.floor(Math.random() * 4000) + 2000, color: '#6366F1' },
      { name: 'In-Store', value: Math.floor(Math.random() * 3000) + 1000, color: '#10B981' },
      { name: 'Marketplaces', value: Math.floor(Math.random() * 2000) + 500, color: '#F97316' },
      { name: 'Social Media', value: Math.floor(Math.random() * 1000) + 300, color: '#8884d8' },
    ];
    
    setData(mockChannels);
  }, [dateRange]);
  
  // Calculate total
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Sales by Channel</CardTitle>
        <CardDescription>
          Distribution of sales across different channels
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any) => [`GHS ${value.toFixed(2)}`, 'Revenue']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="text-2xl font-bold">GHS {total.toFixed(2)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
