import React, { useState, useEffect } from 'react';
import { Wallet, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface WalletConnectionProps {
  onConnectionChange?: (connected: boolean, address?: string) => void;
}

export const WalletConnection: React.FC<WalletConnectionProps> = ({ onConnectionChange }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [network, setNetwork] = useState<string>('');
  const { toast } = useToast();

  // Check if wallet is already connected on mount
  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
          onConnectionChange?.(true, accounts[0]);
          
          // Get network info
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          setNetwork(chainId === '0xaa36a7' ? 'Sepolia Testnet' : 'Unknown Network');
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast({
        variant: 'destructive',
        title: 'MetaMask Not Found',
        description: 'Please install MetaMask to connect your wallet.',
      });
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        setIsConnected(true);
        onConnectionChange?.(true, accounts[0]);
        
        // Get network info
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        setNetwork(chainId === '0xaa36a7' ? 'Sepolia Testnet' : 'Unknown Network');
        
        toast({
          title: 'Wallet Connected',
          description: `Successfully connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        });
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        variant: 'destructive',
        title: 'Connection Failed',
        description: 'Failed to connect to MetaMask. Please try again.',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress('');
    setNetwork('');
    onConnectionChange?.(false);
    
    toast({
      title: 'Wallet Disconnected',
      description: 'Successfully disconnected from MetaMask.',
    });
  };

  if (isConnected) {
    return (
      <Card className="trading-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-secondary/20 rounded-full">
              <CheckCircle2 className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </span>
                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
              </div>
              <p className="text-xs text-muted-foreground">{network}</p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={disconnectWallet}
            className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
          >
            Disconnect
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Button 
      onClick={connectWallet}
      disabled={isConnecting}
      className="btn-connect"
    >
      {isConnecting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </>
      )}
    </Button>
  );
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}