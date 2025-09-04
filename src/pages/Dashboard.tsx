import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { BondTable } from '@/components/BondTable';
import { TradingModal } from '@/components/TradingModal';
import { mockBonds, BondData } from '@/data/mockBonds';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Activity, IndianRupee } from 'lucide-react';

const Dashboard = () => {
  const [selectedBond, setSelectedBond] = useState<BondData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const { toast } = useToast();

  const handleTradeClick = (bond: BondData) => {
    setSelectedBond(bond);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBond(null);
  };

  const handleWalletConnectionChange = (connected: boolean, address?: string) => {
    setIsWalletConnected(connected);
    setWalletAddress(address || '');
  };

  const handleSwap = (fromToken: string, toToken: string, amount: number) => {
    toast({
      title: 'Swap Executed Successfully!',
      description: `Swapped ${amount} ${fromToken} for ${toToken} via AMM smart contract.`,
    });
  };

  // Mock portfolio data
  const portfolioStats = {
    totalValue: 25450.75,
    todayChange: 312.50,
    totalBonds: 5,
    avgYield: 8.2
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isWalletConnected={isWalletConnected}
        walletAddress={walletAddress}
        onWalletConnectionChange={handleWalletConnectionChange}
      />
      
      <main className="container mx-auto px-6 py-8">
        {/* Portfolio Overview */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-6">Portfolio Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="trading-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Portfolio</CardTitle>
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{portfolioStats.totalValue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+₹{portfolioStats.todayChange} today</p>
              </CardContent>
            </Card>

            <Card className="trading-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Change</CardTitle>
                <TrendingUp className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-secondary">+1.24%</div>
                <p className="text-xs text-muted-foreground">+₹{portfolioStats.todayChange}</p>
              </CardContent>
            </Card>

            <Card className="trading-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bond Holdings</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{portfolioStats.totalBonds}</div>
                <p className="text-xs text-muted-foreground">Diversified portfolio</p>
              </CardContent>
            </Card>

            <Card className="trading-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Yield</CardTitle>
                <TrendingUp className="h-4 w-4 text-chart-ai" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-chart-ai">{portfolioStats.avgYield}%</div>
                <p className="text-xs text-muted-foreground">Annual yield</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Available Bonds */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Available Bonds</h2>
          <BondTable 
            bonds={mockBonds} 
            onTradeClick={handleTradeClick} 
          />
        </div>

        {/* Trading Modal */}
        <TradingModal
          bond={selectedBond}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          isWalletConnected={isWalletConnected}
          onSwap={handleSwap}
        />
      </main>
    </div>
  );
};

export default Dashboard;