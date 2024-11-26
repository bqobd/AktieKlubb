import axios from 'axios';
import type { Stock } from '../types';
import { formatISO } from 'date-fns';

const PROXY_BASE_URL = 'https://query2.finance.yahoo.com/v8/finance';

export class StockAnalyzer {
  async searchStock(symbol: string): Promise<Stock> {
    try {
      if (!this.isValidSymbol(symbol)) {
        throw new Error('Invalid stock symbol format');
      }

      const response = await axios.get(`${PROXY_BASE_URL}/quote`, {
        params: {
          symbols: symbol,
        },
        headers: {
          'Accept': 'application/json',
        }
      });

      const quote = response.data?.quoteResponse?.result?.[0];

      if (!quote) {
        throw new Error('Stock data not found');
      }

      const technicalScore = this.calculateTechnicalScore(quote);
      const sentimentScore = this.calculateSentimentScore(quote);
      const newsScore = this.calculateNewsScore(quote);
      
      const stock: Stock = {
        id: `${symbol}_${Date.now()}`,
        symbol: symbol.toUpperCase(),
        name: quote.longName || quote.shortName || symbol.toUpperCase(),
        price: quote.regularMarketPrice || 0,
        change: quote.regularMarketChangePercent || 0,
        signal: this.calculateSignal(quote),
        technicalScore,
        sentimentScore,
        newsScore,
        lastUpdated: formatISO(new Date())
      };

      return stock;

    } catch (error) {
      console.error('Error searching stock:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to fetch stock data: ${error.message}`);
      }
      throw new Error('Failed to fetch stock data. Please try again.');
    }
  }

  async getHistoricalData(symbol: string) {
    try {
      const endDate = Math.floor(Date.now() / 1000);
      const startDate = endDate - (365 * 24 * 60 * 60); // 1 year ago

      const response = await axios.get(`${PROXY_BASE_URL}/chart/${symbol}`, {
        params: {
          period1: startDate,
          period2: endDate,
          interval: '1d',
          includePrePost: false,
        },
        headers: {
          'Accept': 'application/json',
        }
      });

      const result = response.data?.chart?.result?.[0];
      if (!result) {
        throw new Error('Historical data not found');
      }

      const { timestamp, indicators } = result;
      const { quote: [quotes] } = indicators;

      return timestamp.map((time: number, i: number) => ({
        time: formatISO(new Date(time * 1000)).split('T')[0],
        open: quotes.open[i],
        high: quotes.high[i],
        low: quotes.low[i],
        close: quotes.close[i],
        volume: quotes.volume[i]
      })).filter((item: any) => 
        item.open && item.high && item.low && item.close && item.volume
      );

    } catch (error) {
      console.error('Error fetching historical data:', error);
      throw new Error('Failed to fetch historical data');
    }
  }

  private isValidSymbol(symbol: string): boolean {
    return /^[A-Za-z.-]{1,10}$/.test(symbol);
  }

  private calculateSignal(quote: any): 'buy' | 'sell' | 'neutral' {
    let signalScore = 0;
    
    // Price momentum
    const priceChange = quote.regularMarketChangePercent || 0;
    if (priceChange > 2) signalScore += 1;
    if (priceChange < -2) signalScore -= 1;
    
    // Moving average
    const currentPrice = quote.regularMarketPrice || 0;
    const fiftyDayAvg = quote.fiftyDayAverage || 0;
    
    if (currentPrice > fiftyDayAvg) signalScore += 1;
    if (currentPrice < fiftyDayAvg) signalScore -= 1;
    
    // Volume analysis
    const avgVolume = quote.averageDailyVolume3Month || 0;
    const currentVolume = quote.regularMarketVolume || 0;
    if (currentVolume > avgVolume * 1.5) signalScore += 1;
    if (currentVolume < avgVolume * 0.5) signalScore -= 1;
    
    // Determine final signal
    if (signalScore >= 2) return 'buy';
    if (signalScore <= -2) return 'sell';
    return 'neutral';
  }

  private calculateTechnicalScore(quote: any): number {
    let score = 5;
    
    const price = quote.regularMarketPrice || 0;
    const ma50 = quote.fiftyDayAverage || 0;
    const ma200 = quote.twoHundredDayAverage || 0;
    
    if (price > ma50) score += 1;
    if (price > ma200) score += 1;
    
    const avgVolume = quote.averageDailyVolume3Month || 0;
    const currentVolume = quote.regularMarketVolume || 0;
    if (currentVolume > avgVolume) score += 1;
    
    const priceChange = quote.regularMarketChangePercent || 0;
    if (priceChange > 0) score += 1;
    if (priceChange > 5) score += 1;
    
    return Math.min(10, Math.max(1, score));
  }

  private calculateSentimentScore(quote: any): number {
    let score = 5;
    
    const priceChange = quote.regularMarketChangePercent || 0;
    if (priceChange > 5) score += 2;
    if (priceChange > 2) score += 1;
    if (priceChange < -2) score -= 1;
    if (priceChange < -5) score -= 2;
    
    const avgVolume = quote.averageDailyVolume3Month || 0;
    const currentVolume = quote.regularMarketVolume || 0;
    if (currentVolume > avgVolume * 2) score += 1;
    if (currentVolume > avgVolume * 3) score += 1;
    
    return Math.min(10, Math.max(1, score));
  }

  private calculateNewsScore(quote: any): number {
    let score = 5;
    
    const price = quote.regularMarketPrice || 0;
    const ma50 = quote.fiftyDayAverage || 0;
    const priceChange = quote.regularMarketChangePercent || 0;
    
    if (price > ma50) score += 1;
    if (price > ma50 * 1.05) score += 1;
    
    if (priceChange > 3) score += 1;
    if (priceChange > 5) score += 1;
    if (priceChange < -3) score -= 1;
    if (priceChange < -5) score -= 1;
    
    return Math.min(10, Math.max(1, score));
  }
}