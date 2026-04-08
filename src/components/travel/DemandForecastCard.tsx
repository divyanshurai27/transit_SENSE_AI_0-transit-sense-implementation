import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AlertTriangle, TrendingUp, Calendar } from "lucide-react";

interface DemandForecastCardProps {
  route: string;
  riskLevel: "HIGH" | "MODERATE" | "LOW" | "CRITICAL";
  demandScore: number;
  forecastSeries: Array<{
    date: Date;
    demand: number;
  }>;
}

const DemandForecastCard = ({ route, riskLevel, demandScore, forecastSeries }: DemandForecastCardProps) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case "HIGH": return "bg-red-500";
      case "CRITICAL": return "bg-red-600";
      case "MODERATE": return "bg-amber-500";
      case "LOW": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case "HIGH": return "bg-red-50 border-red-200";
      case "CRITICAL": return "bg-red-100 border-red-300";
      case "MODERATE": return "bg-amber-50 border-amber-200";
      case "LOW": return "bg-green-50 border-green-200";
      default: return "bg-gray-50 border-gray-200";
    }
  };

  const getRiskTextColor = (level: string) => {
    switch (level) {
      case "HIGH": return "text-red-700";
      case "CRITICAL": return "text-red-800";
      case "MODERATE": return "text-amber-700";
      case "LOW": return "text-green-700";
      default: return "text-gray-700";
    }
  };

  const chartData = forecastSeries.map(item => ({
    date: item.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    demand: item.demand
  }));

  return (
    <Card className={`border-2 ${getRiskBgColor(riskLevel)}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">{route}</CardTitle>
          <Badge className={`${getRiskColor(riskLevel)} text-white`}>
            {riskLevel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Demand Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Demand Index</span>
            <span className="text-2xl font-bold">{demandScore}/100</span>
          </div>
          <Progress value={demandScore} className="h-2" />
        </div>

        {/* Mini Sparkline Chart */}
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 10 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                tick={{ fontSize: 10 }}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="demand" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Indicators */}
        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />
              <span className="text-xs text-muted-foreground">Trend</span>
            </div>
            <span className="text-sm font-semibold">+12%</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Calendar className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-xs text-muted-foreground">Peak</span>
            </div>
            <span className="text-sm font-semibold">Nov 15</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />
              <span className="text-xs text-muted-foreground">Alert</span>
            </div>
            <span className="text-sm font-semibold">Active</span>
          </div>
        </div>

        {/* Sub-label */}
        <div className={`text-xs ${getRiskTextColor(riskLevel)} bg-white/50 rounded px-3 py-2 border`}>
          Based on historical ticketing + festival calendar signals
        </div>
      </CardContent>
    </Card>
  );
};

export default DemandForecastCard;
