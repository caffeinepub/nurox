import { useState, useEffect } from 'react';
import { useGetAllTrades, useSaveTrade, useGetSettings } from '../../hooks/useQueries';
import type { TradeFormData } from '../../domain/types';
import { mapFormDataToTrade } from '../../domain/mappers';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface TradeFormDialogProps {
  open: boolean;
  onClose: () => void;
  editingTradeId?: string;
}

export default function TradeFormDialog({ open, onClose, editingTradeId }: TradeFormDialogProps) {
  const { data: trades = [] } = useGetAllTrades();
  const { data: settings } = useGetSettings();
  const saveTrade = useSaveTrade();

  const editingTrade = editingTradeId ? trades.find(t => t.id === editingTradeId) : undefined;

  const [formData, setFormData] = useState<TradeFormData>({
    date: new Date(),
    pair: 'EURUSD',
    direction: 'Buy',
    entryPrice: 0,
    stopLoss: 0,
    takeProfit: 0,
    lotSize: 0.01,
    riskPercent: settings?.defaultRiskPercent || 1,
    accountBalance: settings?.defaultAccount || 10000,
    strategy: 'Structure Break',
    timeframe: 'H1',
    session: 'London',
    emotionBefore: '',
    emotionAfter: '',
    notes: '',
    structureBreakConfirmed: false,
    liquiditySweepConfirmed: false,
    riskRespected: false,
    noEmotionalEntry: false,
  });

  useEffect(() => {
    if (editingTrade) {
      setFormData({
        date: new Date(Number(editingTrade.entryTimestamp) / 1_000_000),
        pair: editingTrade.pair,
        direction: editingTrade.direction as 'Buy' | 'Sell',
        entryPrice: 0,
        stopLoss: 0,
        takeProfit: 0,
        lotSize: editingTrade.positionSize,
        riskPercent: (editingTrade.riskAmount / editingTrade.accountSize) * 100,
        accountBalance: editingTrade.accountSize,
        strategy: editingTrade.entryType as any,
        timeframe: 'H1',
        session: 'London',
        emotionBefore: editingTrade.emotions.split('|')[0]?.replace('Before:', '').trim() || '',
        emotionAfter: editingTrade.emotions.split('|')[1]?.replace('After:', '').trim() || '',
        notes: '',
        structureBreakConfirmed: editingTrade.structureBreakConfirmed,
        liquiditySweepConfirmed: editingTrade.liquiditySweepConfirmed,
        riskRespected: editingTrade.violations.length === 0,
        noEmotionalEntry: editingTrade.violations.length === 0,
      });
    } else if (settings) {
      setFormData(prev => ({
        ...prev,
        riskPercent: settings.defaultRiskPercent,
        accountBalance: settings.defaultAccount,
      }));
    }
  }, [editingTrade, settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.structureBreakConfirmed || !formData.liquiditySweepConfirmed || 
        !formData.riskRespected || !formData.noEmotionalEntry) {
      toast.error('Please complete all checklist items before saving');
      return;
    }

    try {
      const trade = mapFormDataToTrade(formData, editingTradeId);
      await saveTrade.mutateAsync(trade);
      toast.success(editingTradeId ? 'Trade updated successfully' : 'Trade saved successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to save trade');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{editingTradeId ? 'Edit Trade' : 'New Trade'}</DialogTitle>
          <DialogDescription>
            Enter your trade details and complete the discipline checklist
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date.toISOString().split('T')[0]}
                  onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value) })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pair">Pair</Label>
                <Input
                  id="pair"
                  value={formData.pair}
                  onChange={(e) => setFormData({ ...formData, pair: e.target.value })}
                  placeholder="EURUSD"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="direction">Direction</Label>
                <Select
                  value={formData.direction}
                  onValueChange={(value: 'Buy' | 'Sell') => setFormData({ ...formData, direction: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Buy">Buy</SelectItem>
                    <SelectItem value="Sell">Sell</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="strategy">Strategy</Label>
                <Select
                  value={formData.strategy}
                  onValueChange={(value: any) => setFormData({ ...formData, strategy: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Structure Break">Structure Break</SelectItem>
                    <SelectItem value="Liquidity Sweep">Liquidity Sweep</SelectItem>
                    <SelectItem value="Supply/Demand">Supply/Demand</SelectItem>
                    <SelectItem value="Trend Following">Trend Following</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="entryPrice">Entry Price</Label>
                <Input
                  id="entryPrice"
                  type="number"
                  step="0.00001"
                  value={formData.entryPrice}
                  onChange={(e) => setFormData({ ...formData, entryPrice: parseFloat(e.target.value) })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stopLoss">Stop Loss</Label>
                <Input
                  id="stopLoss"
                  type="number"
                  step="0.00001"
                  value={formData.stopLoss}
                  onChange={(e) => setFormData({ ...formData, stopLoss: parseFloat(e.target.value) })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="takeProfit">Take Profit</Label>
                <Input
                  id="takeProfit"
                  type="number"
                  step="0.00001"
                  value={formData.takeProfit}
                  onChange={(e) => setFormData({ ...formData, takeProfit: parseFloat(e.target.value) })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lotSize">Lot Size</Label>
                <Input
                  id="lotSize"
                  type="number"
                  step="0.01"
                  value={formData.lotSize}
                  onChange={(e) => setFormData({ ...formData, lotSize: parseFloat(e.target.value) })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="riskPercent">Risk %</Label>
                <Input
                  id="riskPercent"
                  type="number"
                  step="0.1"
                  value={formData.riskPercent}
                  onChange={(e) => setFormData({ ...formData, riskPercent: parseFloat(e.target.value) })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountBalance">Account Balance</Label>
                <Input
                  id="accountBalance"
                  type="number"
                  step="0.01"
                  value={formData.accountBalance}
                  onChange={(e) => setFormData({ ...formData, accountBalance: parseFloat(e.target.value) })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeframe">Timeframe</Label>
                <Select
                  value={formData.timeframe}
                  onValueChange={(value: any) => setFormData({ ...formData, timeframe: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M1">M1</SelectItem>
                    <SelectItem value="M5">M5</SelectItem>
                    <SelectItem value="M15">M15</SelectItem>
                    <SelectItem value="M30">M30</SelectItem>
                    <SelectItem value="H1">H1</SelectItem>
                    <SelectItem value="H4">H4</SelectItem>
                    <SelectItem value="D1">D1</SelectItem>
                    <SelectItem value="W1">W1</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="session">Session</Label>
                <Select
                  value={formData.session}
                  onValueChange={(value: any) => setFormData({ ...formData, session: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia">Asia</SelectItem>
                    <SelectItem value="London">London</SelectItem>
                    <SelectItem value="New York">New York</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="emotionBefore">Emotion Before Trade</Label>
              <Input
                id="emotionBefore"
                value={formData.emotionBefore}
                onChange={(e) => setFormData({ ...formData, emotionBefore: e.target.value })}
                placeholder="Calm, confident, anxious, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emotionAfter">Emotion After Trade</Label>
              <Input
                id="emotionAfter"
                value={formData.emotionAfter}
                onChange={(e) => setFormData({ ...formData, emotionAfter: e.target.value })}
                placeholder="Satisfied, frustrated, relieved, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional trade notes..."
                rows={3}
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Discipline Checklist</h3>
              <p className="text-sm text-muted-foreground">
                All items must be checked before saving the trade
              </p>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="structureBreak"
                    checked={formData.structureBreakConfirmed}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, structureBreakConfirmed: checked as boolean })
                    }
                  />
                  <Label htmlFor="structureBreak" className="cursor-pointer">
                    Structure break confirmed
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="liquiditySweep"
                    checked={formData.liquiditySweepConfirmed}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, liquiditySweepConfirmed: checked as boolean })
                    }
                  />
                  <Label htmlFor="liquiditySweep" className="cursor-pointer">
                    Liquidity sweep confirmed
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="riskRespected"
                    checked={formData.riskRespected}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, riskRespected: checked as boolean })
                    }
                  />
                  <Label htmlFor="riskRespected" className="cursor-pointer">
                    Risk respected
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="noEmotional"
                    checked={formData.noEmotionalEntry}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, noEmotionalEntry: checked as boolean })
                    }
                  />
                  <Label htmlFor="noEmotional" className="cursor-pointer">
                    No emotional entry
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saveTrade.isPending}
                className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-black font-semibold"
              >
                {saveTrade.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Trade'
                )}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
