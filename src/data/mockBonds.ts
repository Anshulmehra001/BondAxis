// Mock Indian Corporate Bond Data for BondAxis Platform
// Authentic ISINs and realistic pricing for Indian market

export interface BondData {
  name: string;
  isin: string;
  symbol: string;
  price_inr: number;
  price_history: Array<{
    date: string;
    price: number;
  }>;
  ai_fair_value: number;
  change_24h: number;
  volume_inr: number;
  maturity: string;
  coupon_rate: number;
  credit_rating: string;
  issuer_type: 'Financial' | 'Infrastructure' | 'Manufacturing' | 'Technology';
}

export const mockBonds: BondData[] = [
  {
    name: "Reliance Industries 8.5% 2030",
    isin: "INE002A07935",
    symbol: "REL2030",
    price_inr: 108.75,
    price_history: [
      { date: "Day 1", price: 108.10 },
      { date: "Day 2", price: 108.35 },
      { date: "Day 3", price: 108.20 },
      { date: "Day 4", price: 108.60 },
      { date: "Day 5", price: 108.75 }
    ],
    ai_fair_value: 109.10,
    change_24h: 1.2,
    volume_inr: 15600000,
    maturity: "15 Dec 2030",
    coupon_rate: 8.5,
    credit_rating: "AAA",
    issuer_type: "Manufacturing"
  },
  {
    name: "Tata Steel 7.8% 2028",
    isin: "INE081A08215",
    symbol: "TATA2028",
    price_inr: 103.20,
    price_history: [
      { date: "Day 1", price: 103.00 },
      { date: "Day 2", price: 102.90 },
      { date: "Day 3", price: 103.15 },
      { date: "Day 4", price: 103.10 },
      { date: "Day 5", price: 103.20 }
    ],
    ai_fair_value: 103.50,
    change_24h: -0.8,
    volume_inr: 8900000,
    maturity: "22 Aug 2028",
    coupon_rate: 7.8,
    credit_rating: "AA+",
    issuer_type: "Manufacturing"
  },
  {
    name: "HDFC Bank 7.5% 2029",
    isin: "INE040A08373",
    symbol: "HDFC2029",
    price_inr: 101.90,
    price_history: [
      { date: "Day 1", price: 101.50 },
      { date: "Day 2", price: 101.65 },
      { date: "Day 3", price: 101.80 },
      { date: "Day 4", price: 101.75 },
      { date: "Day 5", price: 101.90 }
    ],
    ai_fair_value: 102.00,
    change_24h: 0.4,
    volume_inr: 23400000,
    maturity: "10 Mar 2029",
    coupon_rate: 7.5,
    credit_rating: "AAA",
    issuer_type: "Financial"
  },
  {
    name: "Infosys 6.9% 2027",
    isin: "INE009A08527",
    symbol: "INFY2027",
    price_inr: 99.85,
    price_history: [
      { date: "Day 1", price: 100.20 },
      { date: "Day 2", price: 100.05 },
      { date: "Day 3", price: 99.95 },
      { date: "Day 4", price: 99.80 },
      { date: "Day 5", price: 99.85 }
    ],
    ai_fair_value: 100.15,
    change_24h: -0.3,
    volume_inr: 12100000,
    maturity: "18 Nov 2027",
    coupon_rate: 6.9,
    credit_rating: "AAA",
    issuer_type: "Technology"
  },
  {
    name: "NTPC 8.1% 2031",
    isin: "INE733E08219",
    symbol: "NTPC2031",
    price_inr: 106.45,
    price_history: [
      { date: "Day 1", price: 106.10 },
      { date: "Day 2", price: 106.25 },
      { date: "Day 3", price: 106.35 },
      { date: "Day 4", price: 106.40 },
      { date: "Day 5", price: 106.45 }
    ],
    ai_fair_value: 106.70,
    change_24h: 0.7,
    volume_inr: 18200000,
    maturity: "25 Jun 2031",
    coupon_rate: 8.1,
    credit_rating: "AAA",
    issuer_type: "Infrastructure"
  }
];

// Mock wallet balances for demo
export const mockWalletBalances = {
  MDR: 50000.00,  // Mock Digital Rupee
  BAT: 1250.50    // BondAxis Token
};

// Helper functions for Indian currency formatting
export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
};

export const formatCompactINR = (amount: number): string => {
  if (amount >= 10000000) { // 1 crore
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  } else if (amount >= 100000) { // 1 lakh
    return `₹${(amount / 100000).toFixed(1)}L`;
  } else if (amount >= 1000) { // 1 thousand
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount.toFixed(0)}`;
};

export const formatPercentage = (value: number): string => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};