import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, TrendingUp, ExternalLink, Clock } from "lucide-react";

interface FareWatchWidgetProps {
  route: string;
  currentFare: number;
  baseFare: number;
  fairPriceCeiling: number;
}

const FareWatchWidget = ({ route, currentFare, baseFare, fairPriceCeiling }: FareWatchWidgetProps) => {
  const surgeMultiplier = (currentFare / baseFare).toFixed(1);
  const isOverpriced = currentFare > fairPriceCeiling;
  const surgePercentage = ((currentFare - baseFare) / baseFare) * 100;
  
  // Simulate operator data
  const operatorData = {
    name: "PrivateBusExpress",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    routeType: "Premium AC Sleeper"
  };

  const getSurgeColor = (multiplier: string) => {
    const mult = parseFloat(multiplier);
    if (mult >= 3) return "text-red-600";
    if (mult >= 2) return "text-amber-600";
    return "text-green-600";
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 200) return "bg-red-500";
    if (percentage >= 100) return "bg-amber-500";
    return "bg-green-500";
  };

  return (
    <Card className={`border-2 ${isOverpriced ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Fare Watch</CardTitle>
          <Badge variant="outline" className="text-xs">
            {operatorData.routeType}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">{route}</div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current vs Base Fare Comparison */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Current Fare</span>
            <div className="text-right">
              <div className="text-2xl font-bold text-red-600">₹{currentFare.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Base: ₹{baseFare.toLocaleString()}</div>
            </div>
          </div>
          
          {/* Progress bar showing fare increase */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Fare Increase</span>
              <span>+{surgePercentage.toFixed(0)}%</span>
            </div>
            <div className="relative">
              <Progress 
                value={Math.min(surgePercentage, 300)} 
                className="h-3"
              />
              <div 
                className={`absolute top-0 left-0 h-full rounded-full ${getProgressColor(surgePercentage)} opacity-30`}
                style={{ width: `${Math.min(surgePercentage / 3, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Surge Multiplier Badge */}
        <div className="flex items-center justify-center py-2">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 ${isOverpriced ? 'border-red-300 bg-red-100' : 'border-gray-300 bg-gray-50'}`}>
            <TrendingUp className={`h-5 w-5 ${getSurgeColor(surgeMultiplier)}`} />
            <span className="text-lg font-bold">
              {surgeMultiplier}x
            </span>
            <span className="text-sm text-muted-foreground">normal fare</span>
          </div>
        </div>

        {/* Warning Banner */}
        {isOverpriced && (
          <div className="bg-red-100 border border-red-300 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <div className="font-semibold text-red-800">Price Gouging Detected!</div>
                <div className="text-red-700 mt-1">
                  Fare exceeds fair-price ceiling of ₹{fairPriceCeiling.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Operator Info */}
        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Operator</span>
            <span className="font-medium">{operatorData.name}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Last Updated</span>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{Math.round((Date.now() - operatorData.lastUpdated.getTime()) / (1000 * 60))} min ago</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            variant={isOverpriced ? "default" : "outline"}
            className="flex-1"
            size="sm"
          >
            {isOverpriced ? "Report This Fare" : "Track Price"}
          </Button>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>

        {/* Fair Price Info */}
        <div className="text-xs text-muted-foreground bg-blue-50 rounded p-2 border border-blue-200">
          <div className="font-medium text-blue-800 mb-1">Fair Price Ceiling</div>
          <div>₹{fairPriceCeiling.toLocaleString()} ({(fairPriceCeiling / baseFare).toFixed(1)}x base fare)</div>
          <div className="mt-1">Based on regulatory guidelines for this route</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FareWatchWidget;
