// Existing types
export interface Stock {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  signal: 'buy' | 'sell' | 'neutral';
  technicalScore: number;
  sentimentScore: number;
  newsScore: number;
  lastUpdated: string;
}

export interface StockListProps {
  stocks: Stock[];
  title: string;
  signal: 'buy' | 'sell' | 'neutral';
}

// New types for stock analysis
export interface AnalysisScores {
  growth: number;
  profitability: number;
  financialHealth: number;
  valuation: number;
  momentum: number;
  dividend: number;
  institutionalOwnership: number;
}

export interface AnalysisDetails {
  [key: string]: string[];
}

export interface StockAnalysis {
  scores: AnalysisScores;
  details: AnalysisDetails;
  totalScore: number;
  maxScore: number;
  scorePercentage: number;
  recommendation: 'STRONG BUY' | 'BUY' | 'NEUTRAL' | 'HOLD';
  recommendationText: string;
}