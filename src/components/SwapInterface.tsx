import React, { useState, useEffect } from 'react';
import { ArrowUpDown, Info, Zap, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { BondData, mockWalletBalances, formatINR } from '@/data/mockBonds';

interface SwapInterfaceProps {
  bond: BondData;
  isWalletConnected: boolean;
  onSwap: (fromToken: string, toToken: string, amount: number) => void;
}

export const SwapInterface: React.FC<SwapInterfaceProps> = ({ 
  bond, 
  isWalletConnected, 
  onSwap 
}) => {
  const [payAmount, setPayAmount] = useState('');
  const [receiveAmount, setReceiveAmount] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);
  const [payToken, setPayToken] = useState<'MDR' | 'BAT'>('MDR');
  const [balances] = useState(mockWalletBalances);
  const { toast } = useToast();

  // Calculate exchange rate (simplified AMM simulation)
  const exchangeRate = payToken === 'MDR' ? bond.price_inr : (1 / bond.price_inr);
  const slippage = 0.005; // 0.5% slippage
  
  useEffect(() => {
    if (payAmount && !isNaN(Number(payAmount))) {
      const amount = Number(payAmount);
      const received = amount * exchangeRate * (1 - slippage);
      setReceiveAmount(received.toFixed(6));
    } else {
      setReceiveAmount('');
    }
  }, [payAmount, exchangeRate]);

  const handleSwap = async () => {
    if (!isWalletConnected) {
      toast({
        variant: 'destructive',
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet to perform swaps.',
      });
      return;
    }

    const amount = Number(payAmount);
    if (!amount || amount <= 0) {
      toast({
        variant: 'destructive',
        title: 'Invalid Amount',
        description: 'Please enter a valid amount to swap.',
      });
      return;
    }

    const availableBalance = payToken === 'MDR' ? balances.MDR : balances.BAT;
    if (amount > availableBalance) {
      toast({
        variant: 'destructive',
        title: 'Insufficient Balance',
        description: `You don't have enough ${payToken} tokens.`,
      });
      return;
    }

    setIsSwapping(true);
    
    // Simulate swap transaction
    setTimeout(() => {
      onSwap(payToken, payToken === 'MDR' ? 'BAT' : 'MDR', amount);
      
      toast({
        title: 'Swap Successful!',
        description: `Swapped ${amount} ${payToken} for ${receiveAmount} ${payToken === 'MDR' ? 'BAT' : 'MDR'}`,
      });
      
      setPayAmount('');
      setReceiveAmount('');
      setIsSwapping(false);
    }, 2000);
  };

  const switchTokens = () => {
    setPayToken(payToken === 'MDR' ? 'BAT' : 'MDR');
    setPayAmount(receiveAmount);
  };

  const getTokenName = (token: 'MDR' | 'BAT') => {
    return token === 'MDR' ? 'Mock Digital Rupee' : 'BondAxis Token';
  };

  const getTokenBalance = (token: 'MDR' | 'BAT') => {
    return token === 'MDR' ? balances.MDR : balances.BAT;
  };

  return (
    <Card className="trading-card w-full max-w-md">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="h-5 w-5 text-primary" />
          Instant Swap
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Pay Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">You Pay</span>
            <span className="text-muted-foreground">
              Balance: {getTokenBalance(payToken).toFixed(2)} {payToken}
            </span>
          </div>
          
          <div className="relative">
            <Input
              type="number"
              placeholder="0.00"
              value={payAmount}
              onChange={(e) => setPayAmount(e.target.value)}
              className="pr-16 h-14 text-lg font-semibold"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="flex items-center gap-2 bg-accent px-3 py-1 rounded-md">
                <span className="font-semibold text-sm">{payToken}</span>
              </div>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            {getTokenName(payToken)}
          </div>
        </div>

        {/* Switch Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={switchTokens}
            className="rounded-full w-10 h-10 p-0 border-2 hover:bg-primary hover:text-primary-foreground"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>

        {/* Receive Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">You Receive</span>
            <span className="text-muted-foreground">
              Balance: {getTokenBalance(payToken === 'MDR' ? 'BAT' : 'MDR').toFixed(2)} {payToken === 'MDR' ? 'BAT' : 'MDR'}
            </span>
          </div>
          
          <div className="relative">
            <Input
              type="text"
              placeholder="0.00"
              value={receiveAmount}
              readOnly
              className="pr-16 h-14 text-lg font-semibold bg-muted/50"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="flex items-center gap-2 bg-accent px-3 py-1 rounded-md">
                <span className="font-semibold text-sm">{payToken === 'MDR' ? 'BAT' : 'MDR'}</span>
              </div>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            {getTokenName(payToken === 'MDR' ? 'BAT' : 'MDR')}
          </div>
        </div>

        {/* Exchange Rate Info */}
        {payAmount && receiveAmount && (
          <div className="bg-accent/50 p-3 rounded-lg space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Exchange Rate</span>
              <span className="font-medium">1 {payToken} = {exchangeRate.toFixed(6)} {payToken === 'MDR' ? 'BAT' : 'MDR'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Slippage</span>
              <span className="font-medium">0.5%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-chart-ai" />
                <span className="text-muted-foreground">AI Fair Value</span>
              </div>
              <span className="font-medium text-chart-ai">{formatINR(bond.ai_fair_value)}</span>
            </div>
          </div>
        )}

        {/* Swap Button */}
        <Button 
          onClick={handleSwap}
          disabled={!isWalletConnected || isSwapping || !payAmount || Number(payAmount) <= 0}
          className="w-full h-12 btn-trade text-base font-semibold"
        >
          {!isWalletConnected 
            ? 'Connect Wallet' 
            : isSwapping 
              ? 'Swapping...' 
              : 'Swap Tokens'
          }
        </Button>

        {/* Info */}
        <div className="flex items-start gap-2 text-xs text-muted-foreground bg-accent/30 p-3 rounded-lg">
          <Info className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
          <div>
            <p className="mb-1">
              <strong>AI-Powered Pricing:</strong> Our algorithm analyzes SEBI bond data, RBI rates, and credit ratings to provide fair value estimates.
            </p>
            <p>
              Swaps are executed via automated market maker (AMM) smart contracts on Sepolia testnet.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};