import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Calendar, TrendingDown, DollarSign } from "lucide-react";

interface Alternative {
  date: string;
  route: string;
  crowdLevel: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  fareRange: string;
}

interface AlternativeOptionsPanelProps {
  originalQuery: {
    origin: string;
    destination: string;
    date?: string;
    departureDate?: Date;
  };
  alternatives: Alternative[];
}

const AlternativeOptionsPanel = ({ originalQuery, alternatives }: AlternativeOptionsPanelProps) => {
  const [activeTab, setActiveTab] = useState("best-date");
  const [alertSet, setAlertSet] = useState<number | null>(null);

  const getCrowdColor = (level: string) => {
    switch (level) {
      case "LOW": return "bg-green-500";
      case "MODERATE": return "bg-amber-500";
      case "HIGH": return "bg-red-500";
      case "CRITICAL": return "bg-red-600";
      default: return "bg-gray-500";
    }
  };

  const getCrowdBgColor = (level: string) => {
    switch (level) {
      case "LOW": return "bg-green-50 border-green-200";
      case "MODERATE": return "bg-amber-50 border-amber-200";
      case "HIGH": return "bg-red-50 border-red-200";
      case "CRITICAL": return "bg-red-100 border-red-300";
      default: return "bg-gray-50 border-gray-200";
    }
  };

  // Sort alternatives based on active tab
  const sortedAlternatives = [...alternatives].sort((a, b) => {
    switch (activeTab) {
      case "best-date":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "lowest-crowd":
        const crowdOrder = { "LOW": 1, "MODERATE": 2, "HIGH": 3 };
        return crowdOrder[a.crowdLevel] - crowdOrder[b.crowdLevel];
      case "lowest-fare":
        const aMin = parseInt(a.fareRange.split("-")[0].replace(/[^0-9]/g, ""));
        const bMin = parseInt(b.fareRange.split("-")[0].replace(/[^0-9]/g, ""));
        return aMin - bMin;
      default:
        return 0;
    }
  });

  const handleSetAlert = (index: number) => {
    setAlertSet(index);
    setTimeout(() => setAlertSet(null), 3000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-blue-500" />
          AI-Suggested Alternatives
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Reduce travel stress with these alternative options for {originalQuery.origin} → {originalQuery.destination}
        </p>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="best-date" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Best Date
            </TabsTrigger>
            <TabsTrigger value="lowest-crowd" className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Lowest Crowd
            </TabsTrigger>
            <TabsTrigger value="lowest-fare" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Lowest Fare
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="space-y-4">
              {sortedAlternatives.map((alternative, index) => (
                <Card 
                  key={index} 
                  className={`border-2 ${getCrowdBgColor(alternative.crowdLevel)} transition-all hover:shadow-md`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        {/* Date and Route */}
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="font-semibold text-lg">
                              {new Date(alternative.date).toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {alternative.route}
                            </div>
                          </div>
                        </div>

                        {/* Crowd Level and Fare */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Badge className={`${getCrowdColor(alternative.crowdLevel)} text-white`}>
                              {alternative.crowdLevel} Crowd
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              vs. Original: HIGH
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="font-semibold">{alternative.fareRange}</span>
                          </div>
                        </div>

                        {/* Comparison indicators */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <TrendingDown className="h-3 w-3 text-green-500" />
                            <span className="text-green-600 font-medium">
                              {alternative.crowdLevel === "LOW" ? "60%" : alternative.crowdLevel === "MODERATE" ? "30%" : "0%"} less crowded
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3 text-blue-500" />
                            <span className="text-blue-600 font-medium">
                              {alternative.crowdLevel === "LOW" ? "Save 20-30%" : "Save 10-20%"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Set Alert Button */}
                      <div className="ml-4">
                        <Button
                          variant={alertSet === index ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleSetAlert(index)}
                          className="whitespace-nowrap"
                        >
                          <Bell className="h-4 w-4 mr-2" />
                          {alertSet === index ? "Alert Set!" : "Set Alert"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Summary Stats */}
        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {alternatives.filter(a => a.crowdLevel === "LOW").length}
              </div>
              <div className="text-xs text-muted-foreground">Low Crowd Options</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                ₹{Math.min(...alternatives.map(a => parseInt(a.fareRange.split("-")[0].replace(/[^0-9]/g, ""))))}
              </div>
              <div className="text-xs text-muted-foreground">Lowest Fare</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-600">
                {Math.max(...alternatives.map(a => {
                  const days = Math.abs(new Date(a.date).getTime() - new Date(originalQuery.date).getTime()) / (1000 * 60 * 60 * 24);
                  return Math.round(days);
                }))} days
              </div>
              <div className="text-xs text-muted-foreground">Max Date Flex</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlternativeOptionsPanel;
