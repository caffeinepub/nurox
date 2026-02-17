import type { Trade } from '../../backend';
import { formatDate, formatNumber, formatPercent } from '../../utils/format';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface TradesTableProps {
  trades: Trade[];
  isLoading: boolean;
  onEdit: (tradeId: string) => void;
  onDelete: (tradeId: string) => void;
}

export default function TradesTable({ trades, isLoading, onEdit, onDelete }: TradesTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (trades.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No trades found. Start by adding your first trade!
      </div>
    );
  }

  return (
    <div className="rounded-md border border-border/40 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">Date</TableHead>
            <TableHead className="whitespace-nowrap">Pair</TableHead>
            <TableHead className="whitespace-nowrap">Direction</TableHead>
            <TableHead className="whitespace-nowrap">Strategy</TableHead>
            <TableHead className="whitespace-nowrap">RR</TableHead>
            <TableHead className="whitespace-nowrap">Trade Grade</TableHead>
            <TableHead className="whitespace-nowrap">Discipline</TableHead>
            <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trades.map((trade) => {
            const hasViolations = trade.violations.length > 0;
            
            return (
              <TableRow 
                key={trade.id}
                className={hasViolations ? 'bg-destructive/5 border-l-4 border-l-destructive' : ''}
              >
                <TableCell className="font-medium whitespace-nowrap">
                  {formatDate(trade.entryTimestamp)}
                </TableCell>
                <TableCell className="whitespace-nowrap">{trade.pair}</TableCell>
                <TableCell>
                  <Badge variant={trade.direction === 'Buy' ? 'default' : 'secondary'} className="whitespace-nowrap">
                    {trade.direction === 'Buy' ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {trade.direction}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm max-w-[150px] truncate">{trade.entryType}</TableCell>
                <TableCell className="whitespace-nowrap">{trade.riskReward ? formatNumber(trade.riskReward) : 'N/A'}</TableCell>
                <TableCell className="whitespace-nowrap">
                  {trade.grade ? (
                    <Badge variant="outline" className="font-semibold">
                      {trade.grade}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <span className={trade.disciplineScore >= 80 ? 'text-green-500' : 'text-yellow-500'}>
                      {formatPercent(trade.disciplineScore, 0)}
                    </span>
                    {hasViolations && (
                      <Badge variant="destructive" className="text-xs">
                        {trade.violations.length}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(trade.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(trade.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
