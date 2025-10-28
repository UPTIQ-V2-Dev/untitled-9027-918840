import { useState } from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { History, Search, Copy, Trash2, Download, Upload, X } from 'lucide-react';
import type { CalculatorHistory } from '../../types/calculator';
import { formatTimestamp, formatHistoryEntry } from '../../utils/formatters';

interface HistoryPanelProps {
  history: CalculatorHistory[];
  onClearHistory: () => void;
  onRemoveEntry: (id: string) => void;
  onCopyToClipboard: (text: string) => Promise<boolean>;
  onExportHistory: () => void;
  onImportHistory: (file: File) => Promise<boolean>;
  onSearchHistory: (query: string) => CalculatorHistory[];
  className?: string;
}

export const HistoryPanel = ({
  history,
  onClearHistory,
  onRemoveEntry,
  onCopyToClipboard,
  onExportHistory,
  onImportHistory,
  onSearchHistory,
  className
}: HistoryPanelProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  
  const filteredHistory = searchQuery ? onSearchHistory(searchQuery) : history;
  
  const handleCopy = async (entry: CalculatorHistory) => {
    const text = formatHistoryEntry(entry.equation, entry.result);
    const success = await onCopyToClipboard(text);
    
    if (success) {
      setCopiedId(entry.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };
  
  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsImporting(true);
    try {
      await onImportHistory(file);
    } finally {
      setIsImporting(false);
      // Reset the input
      event.target.value = '';
    }
  };

  const HistoryContent = () => (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search calculations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            onClick={() => setSearchQuery('')}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onExportHistory}
          disabled={history.length === 0}
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => document.getElementById('history-import')?.click()}
          disabled={isImporting}
        >
          <Upload className="h-4 w-4 mr-2" />
          Import
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={onClearHistory}
          disabled={history.length === 0}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All
        </Button>
        
        <input
          id="history-import"
          type="file"
          accept=".json"
          onChange={handleImportFile}
          className="hidden"
        />
      </div>

      <Separator />

      {/* History stats */}
      {history.length > 0 && (
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{history.length} calculations</span>
          {searchQuery && filteredHistory.length !== history.length && (
            <span>{filteredHistory.length} results</span>
          )}
        </div>
      )}

      {/* History list */}
      <ScrollArea className="h-[400px]">
        <div className="space-y-2">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? 'No calculations found' : 'No calculations yet'}
            </div>
          ) : (
            filteredHistory.map((entry) => (
              <Card key={entry.id} className="p-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 font-mono text-sm">
                      <div className="break-all">{entry.equation}</div>
                      <div className="text-primary font-semibold">= {entry.result}</div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleCopy(entry)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => onRemoveEntry(entry.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary" className="text-xs">
                      {formatTimestamp(entry.timestamp)}
                    </Badge>
                    {copiedId === entry.id && (
                      <Badge variant="default" className="text-xs">
                        Copied!
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className={cn("relative", className)}
          aria-label="View calculation history"
        >
          <History className="h-4 w-4" />
          {history.length > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs"
            >
              {history.length > 99 ? '99+' : history.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Calculation History</SheetTitle>
          <SheetDescription>
            View and manage your calculator history
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          <HistoryContent />
        </div>
      </SheetContent>
    </Sheet>
  );
};