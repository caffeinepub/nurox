import { useState } from 'react';
import { useGetAllTrades, useDeleteTrade } from '../hooks/useQueries';
import { generateTradesCSV, downloadCSV } from '../utils/csvExport';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Download, Search } from 'lucide-react';
import TradesTable from '../components/journal/TradesTable';
import TradeFormDialog from '../components/journal/TradeFormDialog';
import { toast } from 'sonner';

export default function JournalPage() {
  const { data: trades = [], isLoading } = useGetAllTrades();
  const deleteTrade = useDeleteTrade();
  const [searchQuery, setSearchQuery] = useState('');
  const [showTradeForm, setShowTradeForm] = useState(false);
  const [editingTradeId, setEditingTradeId] = useState<string | undefined>();

  const filteredTrades = trades.filter(trade => {
    const query = searchQuery.toLowerCase();
    return (
      trade.pair.toLowerCase().includes(query) ||
      trade.direction.toLowerCase().includes(query) ||
      trade.entryType.toLowerCase().includes(query)
    );
  });

  const handleExport = () => {
    const csv = generateTradesCSV(filteredTrades);
    downloadCSV(csv, `nurox-trades-${new Date().toISOString().split('T')[0]}.csv`);
    toast.success('Trades exported successfully');
  };

  const handleDelete = async (tradeId: string) => {
    try {
      await deleteTrade.mutateAsync(tradeId);
      toast.success('Trade deleted successfully');
    } catch (error) {
      toast.error('Failed to delete trade');
      console.error(error);
    }
  };

  const handleEdit = (tradeId: string) => {
    setEditingTradeId(tradeId);
    setShowTradeForm(true);
  };

  const handleCloseForm = () => {
    setShowTradeForm(false);
    setEditingTradeId(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
            Trading Journal
          </h1>
          <p className="text-muted-foreground mt-1">Track and analyze your trades</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={trades.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button
            onClick={() => setShowTradeForm(true)}
            className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-black font-semibold"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Trade
          </Button>
        </div>
      </div>

      <Card className="border-border/40 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle>All Trades</CardTitle>
          <CardDescription>
            {trades.length} total trades • {filteredTrades.length} shown
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by pair, direction, or strategy..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <TradesTable
            trades={filteredTrades}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <TradeFormDialog
        open={showTradeForm}
        onClose={handleCloseForm}
        editingTradeId={editingTradeId}
      />
    </div>
  );
}
