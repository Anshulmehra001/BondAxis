import React from 'react';
import { TrendingUp, TrendingDown, BarChart3, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BondData, formatINR, formatCompactINR, formatPercentage } from '@/data/mockBonds';

interface BondTableProps {
  bonds: BondData[];
  onTradeClick: (bond: BondData) => void;
}

export const BondTable: React.FC<BondTableProps> = ({ bonds, onTradeClick }) => {
  const getRatingColor = (rating: string) => {
    if (rating === 'AAA') return 'bg-secondary text-secondary-foreground';
    if (rating.startsWith('AA')) return 'bg-primary text-primary-foreground';
    if (rating.startsWith('A')) return 'bg-accent text-accent-foreground';
    return 'bg-muted text-muted-foreground';
  };

  const getIssuerTypeIcon = (type: string) => {
    switch (type) {
      case 'Financial': return '🏦';
      case 'Infrastructure': return '🏗️';
      case 'Manufacturing': return '🏭';
      case 'Technology': return '💻';
      default: return '🏢';
    }
  };

  return (
    <Card className="trading-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Tokenized Indian Corporate Bonds
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          AI-powered pricing with real-time liquidity via automated market makers
        </p>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Asset</th>
                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">ISIN</th>
                <th className="text-right p-4 text-sm font-semibold text-muted-foreground">Price</th>
                <th className="text-right p-4 text-sm font-semibold text-muted-foreground">24h Change</th>
                <th className="text-right p-4 text-sm font-semibold text-muted-foreground">AI Fair Value</th>
                <th className="text-right p-4 text-sm font-semibold text-muted-foreground">Volume</th>
                <th className="text-center p-4 text-sm font-semibold text-muted-foreground">Rating</th>
                <th className="text-center p-4 text-sm font-semibold text-muted-foreground">Action</th>
              </tr>
            </thead>
            
            <tbody>
              {bonds.map((bond) => (
                <tr 
                  key={bond.isin}
                  className="border-b border-border hover:bg-accent/30 transition-colors cursor-pointer"
                  onClick={() => onTradeClick(bond)}
                >
                  {/* Asset Info */}
                  <td className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-lg">{getIssuerTypeIcon(bond.issuer_type)}</div>
                      <div>
                        <div className="font-semibold text-foreground text-sm leading-tight">
                          {bond.name}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {bond.coupon_rate}% • {bond.maturity}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* ISIN */}
                  <td className="p-4">
                    <div className="font-mono text-sm text-muted-foreground">
                      {bond.isin}
                    </div>
                  </td>

                  {/* Price */}
                  <td className="p-4 text-right">
                    <div className="font-semibold text-foreground">
                      {formatINR(bond.price_inr)}
                    </div>
                  </td>

                  {/* 24h Change */}
                  <td className="p-4 text-right">
                    <div className={`flex items-center justify-end gap-1 font-semibold ${
                      bond.change_24h >= 0 ? 'text-secondary' : 'text-destructive'
                    }`}>
                      {bond.change_24h >= 0 ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      {formatPercentage(bond.change_24h)}
                    </div>
                  </td>

                  {/* AI Fair Value */}
                  <td className="p-4 text-right">
                    <div className="text-chart-ai font-semibold">
                      {formatINR(bond.ai_fair_value)}
                    </div>
                    <div className={`text-xs mt-1 ${
                      bond.ai_fair_value > bond.price_inr ? 'text-secondary' : 'text-destructive'
                    }`}>
                      {((bond.ai_fair_value - bond.price_inr) / bond.price_inr * 100).toFixed(1)}% upside
                    </div>
                  </td>

                  {/* Volume */}
                  <td className="p-4 text-right">
                    <div className="text-sm font-medium text-muted-foreground">
                      {formatCompactINR(bond.volume_inr)}
                    </div>
                  </td>

                  {/* Credit Rating */}
                  <td className="p-4 text-center">
                    <Badge className={getRatingColor(bond.credit_rating)}>
                      {bond.credit_rating}
                    </Badge>
                  </td>

                  {/* Action Button */}
                  <td className="p-4 text-center">
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onTradeClick(bond);
                      }}
                      className="btn-trade h-8 px-4 text-sm"
                    >
                      Trade
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};