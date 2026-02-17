import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LotSizeCalculator from '../components/tools/LotSizeCalculator';
import RiskPercentCalculator from '../components/tools/RiskPercentCalculator';
import PipCalculator from '../components/tools/PipCalculator';
import CompoundingGrowthSimulator from '../components/tools/CompoundingGrowthSimulator';
import DrawdownRecoveryCalculator from '../components/tools/DrawdownRecoveryCalculator';
import RiskOfRuinCalculator from '../components/tools/RiskOfRuinCalculator';

const tools = [
  { value: 'lotsize', label: 'Lot Size Calculator' },
  { value: 'risk', label: 'Risk % Calculator' },
  { value: 'pip', label: 'Pip Calculator' },
  { value: 'compound', label: 'Compounding Growth' },
  { value: 'drawdown', label: 'Drawdown Recovery' },
  { value: 'ruin', label: 'Risk of Ruin' },
];

/**
 * Tools page with mobile dropdown and desktop tabs for six calculators.
 * Controlled state synchronizes tool selection across both UI patterns.
 */
export default function ToolsPage() {
  const [selectedTool, setSelectedTool] = useState('lotsize');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
          Risk & Position Tools
        </h1>
        <p className="text-muted-foreground mt-1">Professional calculators for risk management</p>
      </div>

      <Tabs value={selectedTool} onValueChange={setSelectedTool} className="space-y-4">
        <div className="sm:hidden">
          <Select value={selectedTool} onValueChange={setSelectedTool}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a tool" />
            </SelectTrigger>
            <SelectContent>
              {tools.map((tool) => (
                <SelectItem key={tool.value} value={tool.value}>
                  {tool.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <TabsList className="hidden sm:grid w-full grid-cols-3 lg:grid-cols-6 gap-1">
          <TabsTrigger value="lotsize" className="text-sm">
            Lot Size
          </TabsTrigger>
          <TabsTrigger value="risk" className="text-sm">
            Risk %
          </TabsTrigger>
          <TabsTrigger value="pip" className="text-sm">
            Pip Calc
          </TabsTrigger>
          <TabsTrigger value="compound" className="text-sm">
            Compound
          </TabsTrigger>
          <TabsTrigger value="drawdown" className="text-sm">
            Drawdown
          </TabsTrigger>
          <TabsTrigger value="ruin" className="text-sm">
            Risk of Ruin
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lotsize">
          <LotSizeCalculator />
        </TabsContent>

        <TabsContent value="risk">
          <RiskPercentCalculator />
        </TabsContent>

        <TabsContent value="pip">
          <PipCalculator />
        </TabsContent>

        <TabsContent value="compound">
          <CompoundingGrowthSimulator />
        </TabsContent>

        <TabsContent value="drawdown">
          <DrawdownRecoveryCalculator />
        </TabsContent>

        <TabsContent value="ruin">
          <RiskOfRuinCalculator />
        </TabsContent>
      </Tabs>
    </div>
  );
}
