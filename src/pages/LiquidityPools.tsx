import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Droplets, TrendingUp, Coins, ArrowRightLeft } from 'lucide-react';

const LiquidityPools = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [liquidityAmount, setLiquidityAmount] = useState('');
  const [isAddingLiquidity, setIsAddingLiquidity] = useState(false);
  const { toast } = useToast();

  const handleWalletConnectionChange = (connected: boolean, address?: string) => {
    setIsWalletConnected(connected);
    setWalletAddress(address || '');
  };

  const handleAddLiquidity = async () => {
    if (!isWalletConnected) {
      toast({
        variant: 'destructive',
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet to add liquidity.',
      });
      return;
    }

    const amount = Number(liquidityAmount);
    if (!amount || amount <= 0) {
      toast({
        variant: 'destructive',
        title: 'Invalid Amount',
        description: 'Please enter a valid amount.',
      });
      return;
    }

    setIsAddingLiquidity(true);
    
    setTimeout(() => {
      toast({
        title: 'Liquidity Added Successfully!',
        description: `Added ₹${amount} to the BAT/MDR pool. You received LP tokens.`,
      });
      setLiquidityAmount('');
      setIsAddingLiquidity(false);
    }, 2000);
  };

  // Mock pool data
  const pools = [
    {
      name: 'BAT/MDR Pool',
      token0: 'BAT',
      token1: 'MDR',
      tvl: 2450000,
      apy: 12.5,
      volume24h: 125000,
      userLiquidity: 5400,
      lpTokens: 2.45
    }
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Liquidity Pools</h1>
          <p className="text-lg text-muted-foreground">
            Provide liquidity to earn fees from bond trading activities
          </p>
        </div>

        {/* Pool Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="trading-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value Locked</CardTitle>
              <Droplets className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹24.5L</div>
              <p className="text-xs text-muted-foreground">Across all pools</p>
            </CardContent>
          </Card>

          <Card className="trading-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
              <ArrowRightLeft className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹1.25L</div>
              <p className="text-xs text-muted-foreground">Trading volume</p>
            </CardContent>
          </Card>

          <Card className="trading-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Liquidity</CardTitle>
              <Coins className="h-4 w-4 text-chart-ai" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹5,400</div>
              <p className="text-xs text-muted-foreground">2.45 LP tokens</p>
            </CardContent>
          </Card>
        </div>

        {/* Add Liquidity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Add Liquidity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount (MDR)</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={liquidityAmount}
                  onChange={(e) => setLiquidityAmount(e.target.value)}
                  className="h-12 text-lg"
                />
                <p className="text-xs text-muted-foreground">
                  Equal amounts of BAT and MDR will be added automatically
                </p>
              </div>

              <div className="bg-accent/50 p-4 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pool Share</span>
                  <span className="font-medium">0.022%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expected LP Tokens</span>
                  <span className="font-medium">~{liquidityAmount ? (Number(liquidityAmount) * 0.001).toFixed(3) : '0.000'}</span>
                </div>
              </div>

              <Button 
                onClick={handleAddLiquidity}
                disabled={!isWalletConnected || isAddingLiquidity}
                className="w-full h-12 btn-trade text-base font-semibold"
              >
                {!isWalletConnected 
                  ? 'Connect Wallet' 
                  : isAddingLiquidity 
                    ? 'Adding Liquidity...' 
                    : 'Add Liquidity'
                }
              </Button>
            </CardContent>
          </Card>

          {/* Pool Information */}
          <Card className="trading-card">
            <CardHeader>
              <CardTitle>Pool Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Pool Tokens</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">BAT</Badge>
                    <span>•</span>
                    <Badge variant="secondary">MDR</Badge>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current APY</span>
                  <span className="font-semibold text-secondary">12.5%</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Trading Fee</span>
                  <span className="font-medium">0.3%</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Your Share</span>
                  <span className="font-medium">0.22%</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <h4 className="font-semibold mb-2">Liquidity Provider Benefits</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Earn 0.3% of all trading fees</li>
                  <li>• Proportional to your pool share</li>
                  <li>• Compounding rewards</li>
                  <li>• Withdraw anytime</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Pools */}
        <Card className="trading-card">
          <CardHeader>
            <CardTitle>Active Liquidity Pools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pools.map((pool, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{pool.token0}</Badge>
                      <span className="text-muted-foreground">/</span>
                      <Badge variant="outline">{pool.token1}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      TVL: ₹{(pool.tvl / 100000).toFixed(1)}L
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-sm font-medium text-secondary">{pool.apy}% APY</div>
                      <div className="text-xs text-muted-foreground">24h Vol: ₹{(pool.volume24h / 1000).toFixed(0)}K</div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm font-medium">₹{pool.userLiquidity.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">{pool.lpTokens} LP tokens</div>
                    </div>
                    
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default LiquidityPools;