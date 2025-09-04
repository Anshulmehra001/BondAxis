import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts';
import { BondData } from '@/data/mockBonds';

interface BondChartProps {
  bond: BondData;
  className?: string;
}

export const BondChart: React.FC<BondChartProps> = ({ bond, className = '' }) => {
  const chartData = bond.price_history.map((item, index) => ({
    ...item,
    day: index + 1,
    fairValue: bond.ai_fair_value
  }));

  const minPrice = Math.min(...bond.price_history.map(p => p.price));
  const maxPrice = Math.max(...bond.price_history.map(p => p.price));
  const padding = (maxPrice - minPrice) * 0.1;

  return (
    <div className={`w-full h-80 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">{bond.name}</h3>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full" />
            <span className="text-sm text-muted-foreground">Market Price</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-chart-ai rounded-full" />
            <span className="text-sm text-muted-foreground">AI Fair Value</span>
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="hsl(var(--border))"
            opacity={0.3}
          />
          
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          />
          
          <YAxis 
            domain={[minPrice - padding, maxPrice + padding]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            tickFormatter={(value) => `₹${value.toFixed(2)}`}
          />
          
          {/* AI Fair Value Reference Line */}
          <ReferenceLine 
            y={bond.ai_fair_value} 
            stroke="hsl(var(--chart-ai-line))"
            strokeDasharray="5 5"
            strokeWidth={2}
          />
          
          {/* Custom label for AI Fair Value */}
          <text 
            x="95%" 
            y={15} 
            textAnchor="end" 
            fill="hsl(var(--chart-ai-line))"
            fontSize={12}
            fontWeight={600}
          >
            AI Fair Value: ₹{bond.ai_fair_value}
          </text>
          
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            dot={{ 
              fill: 'hsl(var(--primary))', 
              strokeWidth: 2,
              stroke: 'hsl(var(--background))',
              r: 4 
            }}
            activeDot={{ 
              r: 6, 
              fill: 'hsl(var(--primary))',
              stroke: 'hsl(var(--background))',
              strokeWidth: 2
            }}
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Current Price:</span>
          <span className="font-semibold text-foreground">₹{bond.price_inr.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">AI Fair Value:</span>
          <span className="font-semibold text-chart-ai">₹{bond.ai_fair_value.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Upside Potential:</span>
          <span className={`font-semibold ${
            bond.ai_fair_value > bond.price_inr ? 'text-secondary' : 'text-destructive'
          }`}>
            {((bond.ai_fair_value - bond.price_inr) / bond.price_inr * 100).toFixed(2)}%
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Credit Rating:</span>
          <span className="font-semibold text-foreground">{bond.credit_rating}</span>
        </div>
      </div>
    </div>
  );
};