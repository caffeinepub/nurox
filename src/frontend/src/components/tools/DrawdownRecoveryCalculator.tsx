import { useState } from 'react';
import { calculateDrawdownRecovery } from '../../utils/toolsMath';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatPercent } from '../../utils/format';
import { AlertTriangle } from 'lucide-react';

export default function DrawdownRecoveryCalculator() {
  const [drawdownPercent, setDrawdownPercent] = useState(20);

  const recoveryPercent = calculateDrawdownRecovery(drawdownPercent);

  return (
    <Card className="border-border/40 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle>Drawdown Recovery Calculator</CardTitle>
        <CardDescription>Calculate the return needed to recover from a drawdown</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="drawdown">Drawdown (%)</Label>
          <Input
            id="drawdown"
            type="number"
            step="0.1"
            value={drawdownPercent}
            onChange={(e) => setDrawdownPercent(parseFloat(e.target.value) || 0)}
          />
        </div>

        <div className="p-6 rounded-lg bg-gradient-to-r from-orange-600/10 to-orange-500/10 border border-orange-500/30">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-orange-500">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-semibold">Recovery Required</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Return Needed:</span>
              <span className="text-2xl font-bold text-orange-500">
                {recoveryPercent === Infinity ? '∞' : formatPercent(recoveryPercent)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              A {formatPercent(drawdownPercent, 0)} drawdown requires a{' '}
              {recoveryPercent === Infinity ? 'complete account recovery' : formatPercent(recoveryPercent, 0)}{' '}
              return to break even.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
