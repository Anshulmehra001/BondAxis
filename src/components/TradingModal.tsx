import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BondChart } from './BondChart';
import { SwapInterface } from './SwapInterface';
import { BondData } from '@/data/mockBonds';

interface TradingModalProps {
  bond: BondData | null;
  isOpen: boolean;
  onClose: () => void;
  isWalletConnected: boolean;
  onSwap: (fromToken: string, toToken: string, amount: number) => void;
}

export const TradingModal: React.FC<TradingModalProps> = ({
  bond,
  isOpen,
  onClose,
  isWalletConnected,
  onSwap
}) => {
  if (!bond) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-full max-h-[95vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold">
                {bond.name}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                ISIN: {bond.isin} • {bond.issuer_type} • Rating: {bond.credit_rating}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Chart */}
          <div className="flex-1 p-6 border-r border-border overflow-y-auto">
            <BondChart bond={bond} />
          </div>

          {/* Right Panel - Swap Interface */}
          <div className="w-96 p-6 flex flex-col justify-center overflow-y-auto">
            <SwapInterface 
              bond={bond}
              isWalletConnected={isWalletConnected}
              onSwap={onSwap}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};