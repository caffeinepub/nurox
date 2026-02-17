import { useState } from 'react';
import { Plus, Download, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useGetAllTrades, useDeleteTrade } from '../hooks/useQueries';
import { generateTradesCSV, downloadCSV } from '../utils/csvExport';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import TradesTable from '../components/journal/TradesTable';
import TradeFormDialog from '../components/journal/TradeFormDialog';

/**
 * Journal page with search, trade table, CSV export, and trade form dialog.
 * Preserves all existing UI and interaction patterns.
 */
export default function JournalPage() {
  const { data: trades = [], isLoading } = useGetAllTrades();
  const deleteTrade = useDeleteTrade();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTradeId, setEditingTradeId] = useState<string | undefined>();

  const filteredTrades = trades.filter((trade) => {
    const query = searchQuery.toLowerCase();
    return (
      trade.pair.toLowerCase().includes(query) ||
      trade.direction.toLowerCase().includes(query) ||
      trade.entryType.toLowerCase().includes(query)
    );
  });

  const handleNewTrade = () => {
    setEditingTradeId(undefined);
    setIsDialogOpen(true);
  };

  const handleEditTrade = (tradeId: string) => {
    setEditingTradeId(tradeId);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTradeId(undefined);
  };

  const handleDeleteTrade = async (tradeId: string) => {
    if (window.confirm('Are you sure you want to delete this trade?')) {
      try {
        await deleteTrade.mutateAsync(tradeId);
        toast.success('Trade deleted successfully');
      } catch (error) {
        toast.error('Failed to delete trade');
        console.error(error);
      }
    }
  };

  const handleExportCSV = () => {
    const csv = generateTradesCSV(trades);
    downloadCSV(csv, `nurox-trades-${new Date().toISOString().split('T')[0]}.csv`);
    toast.success('Trades exported successfully');
  };

  const winsCount = trades.filter((t) => t.winLossResult === 'win').length;

  return (
    <div className="space-y-6">
      <Card className="border-border/40 bg-card/50 backdrop-blur">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                Trading Journal
              </CardTitle>
              <CardDescription className="mt-1">Track and analyze your trades</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleExportCSV} variant="outline" disabled={trades.length === 0} className="flex-1 sm:flex-none">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button
                onClick={handleNewTrade}
                className="flex-1 sm:flex-none bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-black font-semibold"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Trade
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by pair, direction, or strategy..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              {filteredTrades.length} total trades • {winsCount} wins
            </div>

            <TradesTable trades={filteredTrades} isLoading={isLoading} onEdit={handleEditTrade} onDelete={handleDeleteTrade} />
          </div>
        </CardContent>
      </Card>

      <TradeFormDialog open={isDialogOpen} onClose={handleCloseDialog} editingTradeId={editingTradeId} />
    </div>
  );
}
