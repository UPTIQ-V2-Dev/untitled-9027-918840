import { useState, useCallback, useEffect } from 'react';
import type { CalculatorHistory } from '../types/calculator';

const STORAGE_KEY = 'calculator-history';
const MAX_HISTORY_ITEMS = 50;

export const useCalculatorHistory = () => {
  const [history, setHistory] = useState<CalculatorHistory[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(STORAGE_KEY);
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        // Convert timestamp strings back to Date objects
        const historyWithDates = parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
        setHistory(historyWithDates);
      }
    } catch (error) {
      console.error('Failed to load calculator history:', error);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save calculator history:', error);
    }
  }, [history]);

  const addHistoryEntry = useCallback((equation: string, result: string) => {
    const newEntry: CalculatorHistory = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      equation,
      result,
      timestamp: new Date()
    };

    setHistory(prev => {
      const newHistory = [newEntry, ...prev];
      // Keep only the most recent entries
      return newHistory.slice(0, MAX_HISTORY_ITEMS);
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const removeHistoryEntry = useCallback((id: string) => {
    setHistory(prev => prev.filter(entry => entry.id !== id));
  }, []);

  const getHistoryEntry = useCallback((id: string) => {
    return history.find(entry => entry.id === id);
  }, [history]);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }, []);

  const exportHistory = useCallback(() => {
    const exportData = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      history: history.map(entry => ({
        equation: entry.equation,
        result: entry.result,
        timestamp: entry.timestamp.toISOString()
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `calculator-history-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [history]);

  const importHistory = useCallback((file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const result = event.target?.result;
          if (typeof result === 'string') {
            const importData = JSON.parse(result);
            
            if (importData.history && Array.isArray(importData.history)) {
              const importedHistory = importData.history.map((item: any) => ({
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                equation: item.equation,
                result: item.result,
                timestamp: new Date(item.timestamp)
              }));
              
              setHistory(prev => {
                const combined = [...importedHistory, ...prev];
                return combined.slice(0, MAX_HISTORY_ITEMS);
              });
              
              resolve(true);
            } else {
              resolve(false);
            }
          } else {
            resolve(false);
          }
        } catch (error) {
          console.error('Failed to import history:', error);
          resolve(false);
        }
      };
      
      reader.onerror = () => resolve(false);
      reader.readAsText(file);
    });
  }, []);

  const searchHistory = useCallback((query: string) => {
    if (!query.trim()) return history;
    
    const lowerQuery = query.toLowerCase();
    return history.filter(entry => 
      entry.equation.toLowerCase().includes(lowerQuery) ||
      entry.result.toLowerCase().includes(lowerQuery)
    );
  }, [history]);

  const getHistoryStats = useCallback(() => {
    return {
      totalEntries: history.length,
      todayEntries: history.filter(entry => {
        const today = new Date();
        const entryDate = entry.timestamp;
        return (
          today.getDate() === entryDate.getDate() &&
          today.getMonth() === entryDate.getMonth() &&
          today.getFullYear() === entryDate.getFullYear()
        );
      }).length,
      oldestEntry: history[history.length - 1]?.timestamp,
      newestEntry: history[0]?.timestamp
    };
  }, [history]);

  return {
    history,
    addHistoryEntry,
    clearHistory,
    removeHistoryEntry,
    getHistoryEntry,
    copyToClipboard,
    exportHistory,
    importHistory,
    searchHistory,
    getHistoryStats
  };
};