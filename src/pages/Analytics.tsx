import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Activity, BarChart3, PieChart as PieChartIcon, Users } from 'lucide-react';

const Analytics = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');

  const handleWalletConnectionChange = (connected: boolean, address?: string) => {
    setIsWalletConnected(connected);
    setWalletAddress(address || '');
  };

  // Mock analytics data
  const volumeData = [
    { day: 'Mon', volume: 85000 },
    { day: 'Tue', volume: 92000 },
    { day: 'Wed', volume: 78000 },
    { day: 'Thu', volume: 105000 },
    { day: 'Fri', volume: 125000 },
    { day: 'Sat', volume: 98000 },
    { day: 'Sun', volume: 112000 }
  ];

  const tvlData = [
    { day: 'Week 1', tvl: 1200000 },
    { day: 'Week 2', tvl: 1450000 },
    { day: 'Week 3', tvl: 1680000 },
    { day: 'Week 4', tvl: 2100000 },
    { day: 'Week 5', tvl: 2450000 }
  ];

  const bondDistribution = [
    { name: 'AAA Rated', value: 45, color: '#10B981' },
    { name: 'AA Rated', value: 30, color: '#3B82F6' },
    { name: 'A Rated', value: 20, color: '#F59E0B' },
    { name: 'BBB Rated', value: 5, color: '#EF4444' }
  ];

  const topBonds = [
    { name: 'Reliance Industries 8.5% 2030', volume: 45000, change: 2.3 },
    { name: 'HDFC Bank 7.5% 2029', volume: 38000, change: 1.8 },
    { name: 'Tata Steel 7.8% 2028', volume: 32000, change: -0.5 },
    { name: 'ICICI Bank 8.2% 2031', volume: 28000, change: 3.1 },
    { name: 'Bharti Airtel 9.1% 2032', volume: 22000, change: 1.2 }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isWalletConnected={isWalletConnected}
        walletAddress={walletAddress}
        onWalletConnectionChange={handleWalletConnectionChange}
      />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Market Analytics</h1>
          <p className="text-lg text-muted-foreground">
            Comprehensive insights into the Indian corporate bond market
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="trading-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Volume (24h)</CardTitle>
              <BarChart3 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹1.12L</div>
              <div className="flex items-center text-xs text-secondary">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8.5% from yesterday
              </div>
            </CardContent>
          </Card>

          <Card className="trading-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value Locked</CardTitle>
              <Activity className="h-4 w-4 text-chart-ai" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹24.5L</div>
              <div className="flex items-center text-xs text-secondary">
                <TrendingUp className="h-3 w-3 mr-1" />
                +15.2% this week
              </div>
            </CardContent>
          </Card>

          <Card className="trading-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Traders</CardTitle>
              <Users className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <div className="flex items-center text-xs text-secondary">
                <TrendingUp className="h-3 w-3 mr-1" />
                +23 new today
              </div>
            </CardContent>
          </Card>

          <Card className="trading-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Yield</CardTitle>
              <PieChartIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8.2%</div>
              <div className="flex items-center text-xs text-destructive">
                <TrendingDown className="h-3 w-3 mr-1" />
                -0.1% this week
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="trading-card">
            <CardHeader>
              <CardTitle>Trading Volume (7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={volumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                  />
                  <Bar dataKey="volume" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="trading-card">
            <CardHeader>
              <CardTitle>Total Value Locked Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={tvlData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="tvl" 
                    stroke="hsl(var(--chart-ai))"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--chart-ai))', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Bond Distribution and Top Performers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="trading-card">
            <CardHeader>
              <CardTitle>Bond Rating Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={bondDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {bondDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {bondDistribution.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs text-muted-foreground">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="trading-card">
            <CardHeader>
              <CardTitle>Top Performing Bonds (24h)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topBonds.map((bond, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs">
                        #{index + 1}
                      </Badge>
                      <div>
                        <div className="font-medium text-sm">{bond.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Volume: ₹{bond.volume.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                      bond.change >= 0 ? 'text-secondary' : 'text-destructive'
                    }`}>
                      {bond.change >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {Math.abs(bond.change)}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Market Insights */}
        <Card className="trading-card">
          <CardHeader>
            <CardTitle>Market Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-secondary">Most Active Sector</h4>
                <p className="text-2xl font-bold">Banking & Financial</p>
                <p className="text-sm text-muted-foreground">42% of total volume</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-chart-ai">Avg. Trade Size</h4>
                <p className="text-2xl font-bold">₹89,500</p>
                <p className="text-sm text-muted-foreground">+12% from last week</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-primary">Liquidity Ratio</h4>
                <p className="text-2xl font-bold">21.8:1</p>
                <p className="text-sm text-muted-foreground">Healthy liquidity depth</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Analytics;