import { db } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where,
  doc, 
  getDoc,
  updateDoc, 
  deleteDoc,
  serverTimestamp,
  DocumentData,
  writeBatch
} from 'firebase/firestore';
import type { Stock, StockAnalysis } from '../types';

const normalizeTimestamp = (data: DocumentData) => {
  const createdAt = data.createdAt?.toDate?.();
  const updatedAt = data.updatedAt?.toDate?.();
  return {
    ...data,
    createdAt: createdAt ? createdAt.toISOString() : new Date().toISOString(),
    updatedAt: updatedAt ? updatedAt.toISOString() : new Date().toISOString()
  };
};

export const stockService = {
  async addStock(userId: string, stock: Stock): Promise<Stock> {
    if (!userId) throw new Error('User ID is required');
    
    try {
      const batch = writeBatch(db);
      
      // First, ensure user document exists
      const userRef = doc(db, 'users', userId);
      batch.set(userRef, { 
        updatedAt: serverTimestamp() 
      }, { merge: true });
      
      // Create the stock document with a specific ID based on userId and symbol
      const stockId = `${userId}_${stock.symbol}`;
      const stockRef = doc(db, 'stocks', stockId);
      const stockData = {
        ...stock,
        id: stockId,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      batch.set(stockRef, stockData);

      // Create a user-stocks mapping
      const userStockRef = doc(db, 'users', userId, 'stocks', stockId);
      batch.set(userStockRef, {
        stockId,
        symbol: stock.symbol,
        createdAt: serverTimestamp()
      });

      await batch.commit();
      
      return {
        ...stock,
        id: stockId
      };
    } catch (error) {
      console.error('Error adding stock:', error);
      throw new Error('Failed to add stock. Please try again.');
    }
  },

  async getUserStocks(userId: string): Promise<Stock[]> {
    if (!userId) throw new Error('User ID is required');

    try {
      const userStocksRef = collection(db, 'users', userId, 'stocks');
      const userStocksSnapshot = await getDocs(userStocksRef);
      
      if (userStocksSnapshot.empty) {
        return [];
      }

      const stocks: Stock[] = [];
      
      for (const userStockDoc of userStocksSnapshot.docs) {
        const stockId = userStockDoc.data().stockId;
        const stockRef = doc(db, 'stocks', stockId);
        const stockDoc = await getDoc(stockRef);
        
        if (stockDoc.exists()) {
          const stockData = stockDoc.data();
          stocks.push({
            ...normalizeTimestamp(stockData),
            id: stockDoc.id
          } as Stock);
        }
      }

      return stocks;
    } catch (error) {
      console.error('Error getting stocks:', error);
      throw new Error('Failed to fetch stocks. Please try again.');
    }
  },

  async updateStock(userId: string, stockId: string, updates: Partial<Stock>) {
    if (!userId) throw new Error('User ID is required');
    
    try {
      const batch = writeBatch(db);
      
      const stockRef = doc(db, 'stocks', stockId);
      batch.update(stockRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });

      const userStockRef = doc(db, 'users', userId, 'stocks', stockId);
      if (updates.symbol) {
        batch.update(userStockRef, {
          updatedAt: serverTimestamp(),
          symbol: updates.symbol
        });
      }

      await batch.commit();
    } catch (error) {
      console.error('Error updating stock:', error);
      throw new Error('Failed to update stock. Please try again.');
    }
  },

  async deleteStock(userId: string, stockId: string) {
    if (!userId) throw new Error('User ID is required');
    
    try {
      const batch = writeBatch(db);
      
      const stockRef = doc(db, 'stocks', stockId);
      batch.delete(stockRef);

      const userStockRef = doc(db, 'users', userId, 'stocks', stockId);
      batch.delete(userStockRef);

      await batch.commit();
    } catch (error) {
      console.error('Error deleting stock:', error);
      throw new Error('Failed to delete stock. Please try again.');
    }
  }
};