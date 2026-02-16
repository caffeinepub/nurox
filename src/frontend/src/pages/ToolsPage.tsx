import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LotSizeCalculator from '../components/tools/LotSizeCalculator';
import RiskPercentCalculator from '../components/tools/RiskPercentCalculator';
import PipCalculator from '../components/tools/PipCalculator';
import CompoundingGrowthSimulator from '../components/tools/CompoundingGrowthSimulator';
import DrawdownRecoveryCalculator from '../components/tools/DrawdownRecoveryCalculator';
import RiskOfRuinCalculator from '../components/tools/RiskOfRuinCalculator';

export default function ToolsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
          Risk & Position Tools
        </h1>
        <p className="text-muted-foreground mt-1">Professional calculators for risk management</p>
      </div>

      <Tabs defaultValue="lotsize" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="lotsize">Lot Size</TabsTrigger>
          <TabsTrigger value="risk">Risk %</TabsTrigger>
          <TabsTrigger value="pip">Pip Calc</TabsTrigger>
          <TabsTrigger value="compound">Compound</TabsTrigger>
          <TabsTrigger value="drawdown">Drawdown</TabsTrigger>
          <TabsTrigger value="ruin">Risk of Ruin</TabsTrigger>
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
