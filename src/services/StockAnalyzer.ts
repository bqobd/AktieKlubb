import axios from 'axios';
import type { StockAnalysis, AnalysisScores, AnalysisDetails } from '../types';

export class StockAnalyzer {
  private scores: AnalysisScores = {
    growth: 0,
    profitability: 0,
    financialHealth: 0,
    valuation: 0,
    momentum: 0,
    dividend: 0,
    institutionalOwnership: 0
  };

  private maxScore = 5;
  private analysisDetails: AnalysisDetails = {};

  async analyzeStock(symbol: string): Promise<StockAnalysis> {
    try {
      // Mock analysis for demo purposes since we can't access real APIs
      await this.mockAnalysis();
      
      return this.generateRecommendation();
    } catch (error) {
      console.error('Analysis error:', error);
      throw new Error('Failed to analyze stock');
    }
  }

  private async mockAnalysis() {
    // Mock growth analysis
    this.scores.growth = Math.floor(Math.random() * 5) + 1;
    this.analysisDetails.growth = [
      `Revenue Growth: ${(Math.random() * 30).toFixed(1)}%`,
      `Earnings Growth: ${(Math.random() * 25).toFixed(1)}%`
    ];

    // Mock profitability
    this.scores.profitability = Math.floor(Math.random() * 5) + 1;
    this.analysisDetails.profitability = [
      `Profit Margin: ${(Math.random() * 20).toFixed(1)}%`,
      `Operating Margin: ${(Math.random() * 25).toFixed(1)}%`,
      `Return on Equity: ${(Math.random() * 30).toFixed(1)}%`
    ];

    // Mock financial health
    this.scores.financialHealth = Math.floor(Math.random() * 5) + 1;
    this.analysisDetails.financialHealth = [
      `Current Ratio: ${(1 + Math.random() * 2).toFixed(2)}`,
      `Debt to Equity: ${(Math.random() * 100).toFixed(1)}%`
    ];

    // Mock valuation
    this.scores.valuation = Math.floor(Math.random() * 5) + 1;
    this.analysisDetails.valuation = [
      `P/E Ratio: ${(10 + Math.random() * 20).toFixed(1)}`,
      `P/S Ratio: ${(1 + Math.random() * 5).toFixed(1)}`,
      `P/B Ratio: ${(0.5 + Math.random() * 3).toFixed(1)}`
    ];

    // Mock momentum
    this.scores.momentum = Math.floor(Math.random() * 5) + 1;
    this.analysisDetails.momentum = [
      `Price vs MA50: ${Math.random() > 0.5 ? 'Above' : 'Below'}`,
      `Price vs MA200: ${Math.random() > 0.5 ? 'Above' : 'Below'}`,
      `RSI: ${(30 + Math.random() * 40).toFixed(1)}`
    ];

    // Mock dividend
    this.scores.dividend = Math.floor(Math.random() * 5) + 1;
    this.analysisDetails.dividend = [
      `Dividend Yield: ${(Math.random() * 5).toFixed(1)}%`,
      `Payout Ratio: ${(Math.random() * 75).toFixed(1)}%`
    ];

    // Mock institutional ownership
    this.scores.institutionalOwnership = Math.floor(Math.random() * 5) + 1;
    this.analysisDetails.institutionalOwnership = [
      `Institutional Ownership: ${(Math.random() * 80).toFixed(1)}%`,
      `Insider Ownership: ${(Math.random() * 20).toFixed(1)}%`
    ];
  }

  private generateRecommendation(): StockAnalysis {
    const totalScore = Object.values(this.scores).reduce((a, b) => a + b, 0);
    const maxPossibleScore = Object.keys(this.scores).length * this.maxScore;
    const scorePercentage = (totalScore / maxPossibleScore) * 100;

    let recommendation: 'STRONG BUY' | 'BUY' | 'NEUTRAL' | 'HOLD';
    let recommendationText: string;

    if (scorePercentage >= 80) {
      recommendation = 'STRONG BUY';
      recommendationText = 'The stock looks very attractive on all key metrics.';
    } else if (scorePercentage >= 60) {
      recommendation = 'BUY';
      recommendationText = 'The stock looks generally good but has some weaker points.';
    } else if (scorePercentage >= 40) {
      recommendation = 'NEUTRAL';
      recommendationText = 'The stock has both strengths and weaknesses. More research needed.';
    } else {
      recommendation = 'HOLD';
      recommendationText = 'The stock has several red flags. Look for better alternatives.';
    }

    return {
      scores: this.scores,
      details: this.analysisDetails,
      totalScore,
      maxScore: maxPossibleScore,
      scorePercentage,
      recommendation,
      recommendationText
    };
  }
}