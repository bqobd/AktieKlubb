import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { stockService } from '../services/stockService';
import { useAuth } from '../contexts/AuthContext';
import type { Stock } from '../types';

export function useStocks() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: stocks = [], isLoading, error } = useQuery({
    queryKey: ['stocks', user?.uid],
    queryFn: () => user ? stockService.getUserStocks(user.uid) : Promise.resolve([]),
    enabled: !!user,
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.error('Error fetching stocks:', error);
    }
  });

  const addStock = useMutation({
    mutationFn: async (stock: Stock) => {
      if (!user) throw new Error('User not authenticated');
      return stockService.addStock(user.uid, stock);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stocks', user?.uid] });
    },
    onError: (error) => {
      console.error('Error adding stock:', error);
      throw new Error('Failed to add stock to dashboard');
    }
  });

  const updateStock = useMutation({
    mutationFn: async ({ stockId, updates }: { stockId: string; updates: Partial<Stock> }) => {
      if (!user) throw new Error('User not authenticated');
      return stockService.updateStock(user.uid, stockId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stocks', user?.uid] });
    }
  });

  const deleteStock = useMutation({
    mutationFn: async (stockId: string) => {
      if (!user) throw new Error('User not authenticated');
      return stockService.deleteStock(user.uid, stockId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stocks', user?.uid] });
    }
  });

  return {
    stocks,
    isLoading,
    error,
    addStock,
    updateStock,
    deleteStock
  };
}