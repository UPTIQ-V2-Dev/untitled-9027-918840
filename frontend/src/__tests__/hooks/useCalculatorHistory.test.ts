import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCalculatorHistory } from '../../hooks/useCalculatorHistory';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock navigator.clipboard
const clipboardMock = {
  writeText: vi.fn(() => Promise.resolve()),
};
Object.defineProperty(navigator, 'clipboard', {
  value: clipboardMock
});

describe('useCalculatorHistory Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('Initial State', () => {
    it('should start with empty history', () => {
      const { result } = renderHook(() => useCalculatorHistory());
      expect(result.current.history).toEqual([]);
    });

    it('should load history from localStorage', () => {
      const savedHistory = JSON.stringify([
        {
          id: '1',
          equation: '2 + 3',
          result: '5',
          timestamp: new Date().toISOString()
        }
      ]);
      localStorageMock.getItem.mockReturnValue(savedHistory);

      const { result } = renderHook(() => useCalculatorHistory());
      expect(result.current.history).toHaveLength(1);
      expect(result.current.history[0].equation).toBe('2 + 3');
    });
  });

  describe('Adding History Entries', () => {
    it('should add new history entry', () => {
      const { result } = renderHook(() => useCalculatorHistory());

      act(() => {
        result.current.addHistoryEntry('2 + 3', '5');
      });

      expect(result.current.history).toHaveLength(1);
      expect(result.current.history[0].equation).toBe('2 + 3');
      expect(result.current.history[0].result).toBe('5');
      expect(result.current.history[0].timestamp).toBeInstanceOf(Date);
    });

    it('should add entries at the beginning of history', () => {
      const { result } = renderHook(() => useCalculatorHistory());

      act(() => {
        result.current.addHistoryEntry('2 + 3', '5');
      });
      act(() => {
        result.current.addHistoryEntry('4 × 5', '20');
      });

      expect(result.current.history[0].equation).toBe('4 × 5');
      expect(result.current.history[1].equation).toBe('2 + 3');
    });

    it('should limit history to maximum entries', () => {
      const { result } = renderHook(() => useCalculatorHistory());

      // Add 55 entries (more than MAX_HISTORY_ITEMS = 50)
      act(() => {
        for (let i = 0; i < 55; i++) {
          result.current.addHistoryEntry(`${i} + 1`, `${i + 1}`);
        }
      });

      expect(result.current.history).toHaveLength(50);
    });
  });

  describe('Clearing History', () => {
    it('should clear all history entries', () => {
      const { result } = renderHook(() => useCalculatorHistory());

      act(() => {
        result.current.addHistoryEntry('2 + 3', '5');
        result.current.addHistoryEntry('4 × 5', '20');
      });
      expect(result.current.history).toHaveLength(2);

      act(() => {
        result.current.clearHistory();
      });
      expect(result.current.history).toHaveLength(0);
    });
  });

  describe('Removing Individual Entries', () => {
    it('should remove specific history entry', () => {
      const { result } = renderHook(() => useCalculatorHistory());

      act(() => {
        result.current.addHistoryEntry('2 + 3', '5');
        result.current.addHistoryEntry('4 × 5', '20');
      });

      const entryId = result.current.history[0].id;

      act(() => {
        result.current.removeHistoryEntry(entryId);
      });

      expect(result.current.history).toHaveLength(1);
      expect(result.current.history[0].equation).toBe('2 + 3');
    });
  });

  describe('Getting History Entry', () => {
    it('should get specific history entry by id', () => {
      const { result } = renderHook(() => useCalculatorHistory());

      act(() => {
        result.current.addHistoryEntry('2 + 3', '5');
      });

      const entryId = result.current.history[0].id;
      const entry = result.current.getHistoryEntry(entryId);

      expect(entry).toBeDefined();
      expect(entry?.equation).toBe('2 + 3');
    });

    it('should return undefined for non-existent id', () => {
      const { result } = renderHook(() => useCalculatorHistory());
      const entry = result.current.getHistoryEntry('non-existent-id');
      expect(entry).toBeUndefined();
    });
  });

  describe('Clipboard Operations', () => {
    it('should copy text to clipboard successfully', async () => {
      const { result } = renderHook(() => useCalculatorHistory());
      clipboardMock.writeText.mockResolvedValue(undefined);

      const success = await result.current.copyToClipboard('test text');

      expect(success).toBe(true);
      expect(clipboardMock.writeText).toHaveBeenCalledWith('test text');
    });

    it('should handle clipboard copy failure', async () => {
      const { result } = renderHook(() => useCalculatorHistory());
      clipboardMock.writeText.mockRejectedValue(new Error('Clipboard error'));

      const success = await result.current.copyToClipboard('test text');

      expect(success).toBe(false);
    });
  });

  describe('Search History', () => {
    it('should search history by equation', () => {
      const { result } = renderHook(() => useCalculatorHistory());

      act(() => {
        result.current.addHistoryEntry('2 + 3', '5');
        result.current.addHistoryEntry('4 × 5', '20');
        result.current.addHistoryEntry('10 ÷ 2', '5');
      });

      const searchResults = result.current.searchHistory('2');

      expect(searchResults).toHaveLength(2);
      expect(searchResults.some(entry => entry.equation === '2 + 3')).toBe(true);
      expect(searchResults.some(entry => entry.equation === '10 ÷ 2')).toBe(true);
    });

    it('should search history by result', () => {
      const { result } = renderHook(() => useCalculatorHistory());

      act(() => {
        result.current.addHistoryEntry('2 + 3', '5');
        result.current.addHistoryEntry('4 × 5', '20');
        result.current.addHistoryEntry('10 ÷ 2', '5');
      });

      const searchResults = result.current.searchHistory('5');

      expect(searchResults).toHaveLength(2);
      expect(searchResults.some(entry => entry.result === '5')).toBe(true);
    });

    it('should return all history for empty query', () => {
      const { result } = renderHook(() => useCalculatorHistory());

      act(() => {
        result.current.addHistoryEntry('2 + 3', '5');
        result.current.addHistoryEntry('4 × 5', '20');
      });

      const searchResults = result.current.searchHistory('');
      expect(searchResults).toHaveLength(2);
    });

    it('should be case insensitive', () => {
      const { result } = renderHook(() => useCalculatorHistory());

      act(() => {
        result.current.addHistoryEntry('2 + 3', '5');
      });

      const searchResults = result.current.searchHistory('2 + 3');
      expect(searchResults).toHaveLength(1);
    });
  });

  describe('History Statistics', () => {
    it('should provide correct history statistics', () => {
      const { result } = renderHook(() => useCalculatorHistory());
      const today = new Date();

      act(() => {
        result.current.addHistoryEntry('2 + 3', '5');
        result.current.addHistoryEntry('4 × 5', '20');
      });

      const stats = result.current.getHistoryStats();

      expect(stats.totalEntries).toBe(2);
      expect(stats.todayEntries).toBe(2);
      expect(stats.newestEntry).toBeInstanceOf(Date);
      expect(stats.oldestEntry).toBeInstanceOf(Date);
    });

    it('should handle empty history statistics', () => {
      const { result } = renderHook(() => useCalculatorHistory());
      const stats = result.current.getHistoryStats();

      expect(stats.totalEntries).toBe(0);
      expect(stats.todayEntries).toBe(0);
      expect(stats.newestEntry).toBeUndefined();
      expect(stats.oldestEntry).toBeUndefined();
    });
  });

  describe('Export/Import', () => {
    it('should export history', () => {
      const { result } = renderHook(() => useCalculatorHistory());

      act(() => {
        result.current.addHistoryEntry('2 + 3', '5');
      });

      // Mock DOM methods
      const createElementSpy = vi.spyOn(document, 'createElement');
      const appendChildSpy = vi.spyOn(document.body, 'appendChild');
      const removeChildSpy = vi.spyOn(document.body, 'removeChild');
      const clickSpy = vi.fn();

      const mockElement = {
        href: '',
        download: '',
        click: clickSpy,
      } as any;

      createElementSpy.mockReturnValue(mockElement);
      appendChildSpy.mockImplementation(() => mockElement);
      removeChildSpy.mockImplementation(() => mockElement);

      // Mock URL.createObjectURL and revokeObjectURL
      global.URL.createObjectURL = vi.fn(() => 'mock-url');
      global.URL.revokeObjectURL = vi.fn();

      act(() => {
        result.current.exportHistory();
      });

      expect(clickSpy).toHaveBeenCalled();
      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(global.URL.revokeObjectURL).toHaveBeenCalled();

      // Cleanup
      createElementSpy.mockRestore();
      appendChildSpy.mockRestore();
      removeChildSpy.mockRestore();
    });

    it('should import valid history file', async () => {
      const { result } = renderHook(() => useCalculatorHistory());

      const importData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        history: [
          {
            equation: '2 + 3',
            result: '5',
            timestamp: new Date().toISOString()
          }
        ]
      };

      const file = new File([JSON.stringify(importData)], 'history.json', {
        type: 'application/json'
      });

      const success = await result.current.importHistory(file);

      expect(success).toBe(true);
      expect(result.current.history).toHaveLength(1);
      expect(result.current.history[0].equation).toBe('2 + 3');
    });

    it('should handle invalid history file', async () => {
      const { result } = renderHook(() => useCalculatorHistory());

      const file = new File(['invalid json'], 'history.json', {
        type: 'application/json'
      });

      const success = await result.current.importHistory(file);

      expect(success).toBe(false);
    });
  });

  describe('LocalStorage Integration', () => {
    it('should save history to localStorage', () => {
      const { result } = renderHook(() => useCalculatorHistory());

      act(() => {
        result.current.addHistoryEntry('2 + 3', '5');
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'calculator-history',
        expect.stringContaining('2 + 3')
      );
    });
  });
});