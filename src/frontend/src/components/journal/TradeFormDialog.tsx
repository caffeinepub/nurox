import { useState, useEffect, useMemo } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useGetAllTrades, useSaveTrade, useGetSettings } from '../../hooks/useQueries';
import { useStrategyPresets } from '../../hooks/useStrategyPresets';
import { mapFormDataToTrade } from '../../domain/mappers';
import { WinLossResult } from '../../backend';
import type { TradeFormData } from '../../domain/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TradeFormDialogProps {
  open: boolean;
  onClose: () => void;
  editingTradeId?: string;
}

/**
 * Trade form dialog with all fields, validation, and discipline checklist.
 * Preserves existing UI, copy, and form behavior including Win/Loss and P/L fields.
 */
export default function TradeFormDialog({ open, onClose, editingTradeId }: TradeFormDialogProps) {
  const { data: trades = [], isLoading: tradesLoading } = useGetAllTrades();
  const { data: settings, isLoading: settingsLoading } = useGetSettings();
  const saveTrade = useSaveTrade();

  const editingTrade = editingTradeId ? trades.find((t) => t.id === editingTradeId) : undefined;

  const { presets: strategyPresets, hasPresets } = useStrategyPresets(settings);

  const [formData, setFormData] = useState<TradeFormData>({
    date: new Date(),
    pair: 'EURUSD',
    direction: 'Buy',
    entryPrice: 0,
    stopLoss: 0,
    takeProfit: 0,
    lotSize: 0.01,
    riskPercent: 1,
    accountBalance: 10000,
    strategy: '',
    timeframe: 'H1',
    session: 'London',
    emotionBefore: '',
    emotionAfter: '',
    notes: '',
    structureBreakConfirmed: false,
    liquiditySweepConfirmed: false,
    riskRespected: false,
    noEmotionalEntry: false,
    tradeGrade: undefined,
    winLossResult: undefined,
    profitLossAmount: undefined,
  });

  useEffect(() => {
    if (editingTrade) {
      setFormData({
        date: new Date(Number(editingTrade.entryTimestamp) / 1_000_000),
        pair: editingTrade.pair,
        direction: editingTrade.direction as 'Buy' | 'Sell',
        entryPrice: editingTrade.entryPrice,
        stopLoss: editingTrade.stopLossPrice,
        takeProfit: editingTrade.takeProfitPrice,
        lotSize: editingTrade.positionSize,
        riskPercent: (editingTrade.riskAmount / editingTrade.accountSize) * 100,
        accountBalance: editingTrade.accountSize,
        strategy: editingTrade.entryType,
        timeframe: 'H1',
        session: 'London',
        emotionBefore: editingTrade.emotions.split('|')[0]?.replace('Before:', '').trim() || '',
        emotionAfter: editingTrade.emotions.split('|')[1]?.replace('After:', '').trim() || '',
        notes: '',
        structureBreakConfirmed: editingTrade.structureBreakConfirmed,
        liquiditySweepConfirmed: editingTrade.liquiditySweepConfirmed,
        riskRespected: editingTrade.violations.length === 0,
        noEmotionalEntry: editingTrade.violations.length === 0,
        tradeGrade: editingTrade.grade,
        winLossResult: editingTrade.winLossResult,
        profitLossAmount: Math.abs(editingTrade.profitLossAmount),
      });
    }
  }, [editingTrade?.id]);

  useEffect(() => {
    if (!editingTradeId && settings && open) {
      setFormData((prev) => ({
        ...prev,
        riskPercent: settings.defaultRiskPercent || 1,
        accountBalance: settings.defaultAccount || 10000,
        strategy: hasPresets && strategyPresets.length > 0 ? strategyPresets[0] : '',
      }));
    }
  }, [editingTradeId, settings?.defaultRiskPercent, settings?.defaultAccount, hasPresets, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.structureBreakConfirmed || !formData.liquiditySweepConfirmed || !formData.riskRespected || !formData.noEmotionalEntry) {
      toast.error('Please complete all checklist items before saving');
      return;
    }

    if (!formData.winLossResult) {
      toast.error('Please select Win or Loss outcome');
      return;
    }

    if (!formData.profitLossAmount || formData.profitLossAmount <= 0) {
      toast.error('Please enter a valid profit/loss amount');
      return;
    }

    if (!hasPresets && !editingTrade) {
      toast.error('Please configure strategy presets in Settings before creating a trade');
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

  const strategyOptions = useMemo(() => {
    const options = [...strategyPresets];
    if (editingTrade && editingTrade.entryType && !options.includes(editingTrade.entryType)) {
      options.push(editingTrade.entryType);
    }
    return Array.from(new Set(options.filter(Boolean)));
  }, [strategyPresets, editingTrade?.entryType]);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
    }
  };

  const isLoading = settingsLoading || tradesLoading;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary">{editingTradeId ? 'Edit Trade' : 'New Trade'}</DialogTitle>
          <DialogDescription>Enter your trade details and complete the discipline checklist</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <ScrollArea className="max-h-[calc(90vh-140px)] pr-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              {!hasPresets && !editingTrade && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No strategy presets configured. Please add strategy presets in Settings before creating a new trade.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Trade Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <Label htmlFor="pair">Currency Pair</Label>
                    <Select value={formData.pair} onValueChange={(value) => setFormData({ ...formData, pair: value })}>
                      <SelectTrigger id="pair">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EURUSD">EUR/USD</SelectItem>
                        <SelectItem value="GBPUSD">GBP/USD</SelectItem>
                        <SelectItem value="USDJPY">USD/JPY</SelectItem>
                        <SelectItem value="AUDUSD">AUD/USD</SelectItem>
                        <SelectItem value="USDCAD">USD/CAD</SelectItem>
                        <SelectItem value="NZDUSD">NZD/USD</SelectItem>
                        <SelectItem value="EURGBP">EUR/GBP</SelectItem>
                        <SelectItem value="EURJPY">EUR/JPY</SelectItem>
                        <SelectItem value="GBPJPY">GBP/JPY</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="direction">Direction</Label>
                    <Select value={formData.direction} onValueChange={(value: 'Buy' | 'Sell') => setFormData({ ...formData, direction: value })}>
                      <SelectTrigger id="direction">
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
                      onValueChange={(value) => setFormData({ ...formData, strategy: value })}
                      disabled={!hasPresets && !editingTrade}
                    >
                      <SelectTrigger id="strategy">
                        <SelectValue placeholder="Select strategy" />
                      </SelectTrigger>
                      <SelectContent>
                        {strategyOptions.map((strategy) => (
                          <SelectItem key={strategy} value={strategy}>
                            {strategy}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Risk Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="entryPrice">Entry Price</Label>
                    <Input
                      id="entryPrice"
                      type="number"
                      step="0.00001"
                      value={formData.entryPrice || ''}
                      onChange={(e) => setFormData({ ...formData, entryPrice: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stopLoss">Stop Loss</Label>
                    <Input
                      id="stopLoss"
                      type="number"
                      step="0.00001"
                      value={formData.stopLoss || ''}
                      onChange={(e) => setFormData({ ...formData, stopLoss: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="takeProfit">Take Profit</Label>
                    <Input
                      id="takeProfit"
                      type="number"
                      step="0.00001"
                      value={formData.takeProfit || ''}
                      onChange={(e) => setFormData({ ...formData, takeProfit: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lotSize">Lot Size</Label>
                    <Input
                      id="lotSize"
                      type="number"
                      step="0.01"
                      value={formData.lotSize || ''}
                      onChange={(e) => setFormData({ ...formData, lotSize: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="riskPercent">Risk %</Label>
                    <Input
                      id="riskPercent"
                      type="number"
                      step="0.1"
                      value={formData.riskPercent || ''}
                      onChange={(e) => setFormData({ ...formData, riskPercent: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountBalance">Account Balance</Label>
                    <Input
                      id="accountBalance"
                      type="number"
                      step="0.01"
                      value={formData.accountBalance || ''}
                      onChange={(e) => setFormData({ ...formData, accountBalance: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Trade Outcome</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="winLossResult">Win/Loss *</Label>
                    <Select value={formData.winLossResult} onValueChange={(value: WinLossResult) => setFormData({ ...formData, winLossResult: value })}>
                      <SelectTrigger id="winLossResult">
                        <SelectValue placeholder="Select outcome" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={WinLossResult.win}>Win</SelectItem>
                        <SelectItem value={WinLossResult.loss}>Loss</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profitLossAmount">
                      {formData.winLossResult === WinLossResult.win
                        ? 'Profit (pips)'
                        : formData.winLossResult === WinLossResult.loss
                          ? 'Loss (pips)'
                          : 'Amount (pips)'}{' '}
                      *
                    </Label>
                    <Input
                      id="profitLossAmount"
                      type="number"
                      step="0.1"
                      value={formData.profitLossAmount || ''}
                      onChange={(e) => setFormData({ ...formData, profitLossAmount: parseFloat(e.target.value) || 0 })}
                      placeholder="Enter amount"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tradeGrade">Trade Grade</Label>
                    <Select value={formData.tradeGrade || ''} onValueChange={(value) => setFormData({ ...formData, tradeGrade: value || undefined })}>
                      <SelectTrigger id="tradeGrade">
                        <SelectValue placeholder="Select grade (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="S">S - Perfect</SelectItem>
                        <SelectItem value="A">A - Excellent</SelectItem>
                        <SelectItem value="B">B - Good</SelectItem>
                        <SelectItem value="C">C - Acceptable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Emotions & Notes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emotionBefore">Emotion Before Trade</Label>
                    <Textarea
                      id="emotionBefore"
                      value={formData.emotionBefore}
                      onChange={(e) => setFormData({ ...formData, emotionBefore: e.target.value })}
                      placeholder="How did you feel before entering?"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emotionAfter">Emotion After Trade</Label>
                    <Textarea
                      id="emotionAfter"
                      value={formData.emotionAfter}
                      onChange={(e) => setFormData({ ...formData, emotionAfter: e.target.value })}
                      placeholder="How did you feel after closing?"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any additional observations or notes..."
                    rows={3}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Discipline Checklist</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="structureBreak"
                      checked={formData.structureBreakConfirmed}
                      onCheckedChange={(checked) => setFormData({ ...formData, structureBreakConfirmed: checked === true })}
                    />
                    <Label htmlFor="structureBreak" className="text-sm font-normal cursor-pointer">
                      Structure break confirmed before entry
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="liquiditySweep"
                      checked={formData.liquiditySweepConfirmed}
                      onCheckedChange={(checked) => setFormData({ ...formData, liquiditySweepConfirmed: checked === true })}
                    />
                    <Label htmlFor="liquiditySweep" className="text-sm font-normal cursor-pointer">
                      Liquidity sweep identified and confirmed
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="riskRespected"
                      checked={formData.riskRespected}
                      onCheckedChange={(checked) => setFormData({ ...formData, riskRespected: checked === true })}
                    />
                    <Label htmlFor="riskRespected" className="text-sm font-normal cursor-pointer">
                      Risk parameters respected (position size, stop loss)
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="noEmotionalEntry"
                      checked={formData.noEmotionalEntry}
                      onCheckedChange={(checked) => setFormData({ ...formData, noEmotionalEntry: checked === true })}
                    />
                    <Label htmlFor="noEmotionalEntry" className="text-sm font-normal cursor-pointer">
                      No emotional or impulsive entry
                    </Label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saveTrade.isPending}>
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
        )}
      </DialogContent>
    </Dialog>
  );
}
