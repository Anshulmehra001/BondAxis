import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TrendingUp, Github, ExternalLink, BarChart3, Home, Droplets } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WalletConnection } from './WalletConnection';

interface HeaderProps {
  isWalletConnected: boolean;
  walletAddress?: string;
  onWalletConnectionChange: (connected: boolean, address?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  isWalletConnected,
  walletAddress,
  onWalletConnectionChange
}) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/liquidity', label: 'Liquidity', icon: Droplets },
    { path: '/analytics', label: 'Analytics', icon: TrendingUp },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <div className="container flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-primary rounded-lg">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">BondAxis</h1>
            <p className="text-xs text-muted-foreground">Indian Bond Market DeFi</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link key={item.path} to={item.path}>
                <Button 
                  variant={isActive ? "default" : "ghost"} 
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
          
          <a 
            href="https://github.com/bondaxis" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 ml-4"
          >
            <Github className="h-4 w-4" />
            GitHub
            <ExternalLink className="h-3 w-3" />
          </a>
        </nav>

        {/* Wallet Connection */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
            <span>Sepolia Testnet</span>
          </div>
          
          <WalletConnection 
            onConnectionChange={onWalletConnectionChange}
          />
        </div>
      </div>
    </header>
  );
};