import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { BondTable } from '@/components/BondTable';
import { TradingModal } from '@/components/TradingModal';
import { mockBonds, BondData } from '@/data/mockBonds';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
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
    // Simulate successful swap
    toast({
      title: 'Swap Executed Successfully!',
      description: `Swapped ${amount} ${fromToken} for ${toToken} via AMM smart contract.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isWalletConnected={isWalletConnected}
        walletAddress={walletAddress}
        onWalletConnectionChange={handleWalletConnectionChange}
      />
      
      <main className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Democratizing Indian Corporate Bond Access
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Trade tokenized Indian corporate bonds with AI-powered fair value estimates, 
            instant liquidity via AMM, and transparent blockchain settlement.
          </p>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="trading-card p-6 text-center">
              <div className="text-2xl mb-2">🏦</div>
              <h3 className="font-semibold text-foreground mb-2">SEBI Compliant</h3>
              <p className="text-sm text-muted-foreground">
                Built for Indian regulations with authentic ISIN tracking
              </p>
            </div>
            
            <div className="trading-card p-6 text-center">
              <div className="text-2xl mb-2">🤖</div>
              <h3 className="font-semibold text-foreground mb-2">AI Fair Pricing</h3>
              <p className="text-sm text-muted-foreground">
                Advanced algorithms analyze market data for accurate valuations
              </p>
            </div>
            
            <div className="trading-card p-6 text-center">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-semibold text-foreground mb-2">Instant Liquidity</h3>
              <p className="text-sm text-muted-foreground">
                24/7 trading via automated market makers on blockchain
              </p>
            </div>
          </div>
        </div>

        {/* Main Trading Interface */}
        <BondTable 
          bonds={mockBonds} 
          onTradeClick={handleTradeClick} 
        />

        {/* Trading Modal */}
        <TradingModal
          bond={selectedBond}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          isWalletConnected={isWalletConnected}
          onSwap={handleSwap}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-muted-foreground">
            <p className="mb-2">
              Built for Securities Market Hackathon • Powered by Ethereum & AI
            </p>
            <p className="text-xs">
              Mock Digital Rupee (MDR) • Sepolia Testnet • Educational Prototype
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
