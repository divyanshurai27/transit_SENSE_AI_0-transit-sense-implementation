import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, MapPin, TrendingUp, ExternalLink, Users } from "lucide-react";

interface Festival {
  name: string;
  dates: string;
  affectedCorridors: string[];
  historicalCrowdLevel: number;
  travelTips: string;
}

interface FestivalTravelGuideProps {
  festivals: Festival[];
}

const FestivalTravelGuide = ({ festivals }: FestivalTravelGuideProps) => {
  const getCrowdColor = (level: number) => {
    if (level >= 90) return "bg-red-500";
    if (level >= 70) return "bg-amber-500";
    return "bg-green-500";
  };

  const getCrowdBgColor = (level: number) => {
    if (level >= 90) return "bg-red-50 border-red-200";
    if (level >= 70) return "bg-amber-50 border-amber-200";
    return "bg-green-50 border-green-200";
  };

  const getCrowdLevel = (level: number) => {
    if (level >= 90) return "EXTREME";
    if (level >= 70) return "HIGH";
    return "MODERATE";
  };

  // Generate sample historical data for the sparkline chart
  const generateHistoricalData = (baseLevel: number) => {
    return Array.from({ length: 7 }, (_, i) => ({
      day: `Day ${i + 1}`,
      crowd: baseLevel + Math.floor(Math.random() * 20) - 10
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Festival Travel Guides</h2>
        <Badge variant="outline" className="bg-blue-50 text-blue-700">
          {festivals.length} Major Festivals
        </Badge>
      </div>

      {/* Horizontal scroll card row */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-max">
          {festivals.map((festival, index) => {
            const historicalData = generateHistoricalData(festival.historicalCrowdLevel);
            
            return (
              <Card 
                key={index} 
                className={`w-80 border-2 ${getCrowdBgColor(festival.historicalCrowdLevel)} flex-shrink-0`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold">{festival.name}</CardTitle>
                    <Badge className={`${getCrowdColor(festival.historicalCrowdLevel)} text-white`}>
                      {getCrowdLevel(festival.historicalCrowdLevel)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {festival.dates}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Historical Crowd Chart */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Historical Crowd Pattern</span>
                      <span className="text-xs text-muted-foreground">7-day trend</span>
                    </div>
                    <div className="h-16 flex items-end gap-1">
                      {historicalData.map((data, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-blue-500 rounded-t-sm"
                          style={{ 
                            height: `${(data.crowd / 120) * 100}%`,
                            opacity: 0.7 + (i * 0.05)
                          }}
                        />
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground text-center">
                      Peak: {Math.max(...historicalData.map(d => d.crowd))}% capacity
                    </div>
                  </div>

                  {/* Crowd Level Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Crowd Level</span>
                      <span className="text-lg font-bold">{festival.historicalCrowdLevel}%</span>
                    </div>
                    <Progress 
                      value={festival.historicalCrowdLevel} 
                      className="h-2"
                    />
                  </div>

                  {/* Affected Corridors */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <MapPin className="h-4 w-4" />
                      Top Affected Corridors
                    </div>
                    <div className="space-y-1">
                      {festival.affectedCorridors.slice(0, 3).map((corridor, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                          {corridor}
                        </div>
                      ))}
                      {festival.affectedCorridors.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{festival.affectedCorridors.length - 3} more routes
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Travel Tips */}
                  <div className="bg-white/50 rounded-lg p-3 border">
                    <div className="flex items-center gap-2 text-sm font-medium mb-2">
                      <TrendingUp className="h-4 w-4 text-blue-500" />
                      Travel Tips
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {festival.travelTips}
                    </p>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <div className="text-center">
                      <Users className="h-4 w-4 text-blue-500 mx-auto mb-1" />
                      <div className="text-xs font-medium">2M+</div>
                      <div className="text-xs text-muted-foreground">Travelers</div>
                    </div>
                    <div className="text-center">
                      <MapPin className="h-4 w-4 text-green-500 mx-auto mb-1" />
                      <div className="text-xs font-medium">{festival.affectedCorridors.length}</div>
                      <div className="text-xs text-muted-foreground">Corridors</div>
                    </div>
                    <div className="text-center">
                      <Calendar className="h-4 w-4 text-amber-500 mx-auto mb-1" />
                      <div className="text-xs font-medium">5-7</div>
                      <div className="text-xs text-muted-foreground">Days</div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button className="w-full" variant="outline">
                    View Full Advisory
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Summary Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-900">Festival Travel Season Insights</h3>
              <p className="text-sm text-blue-700 mt-1">
                Plan ahead for peak festival periods. High-demand routes see 3-5x normal passenger volumes.
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-900">
                {festivals.reduce((sum, f) => sum + f.affectedCorridors.length, 0)}
              </div>
              <div className="text-xs text-blue-700">Total Corridors Affected</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FestivalTravelGuide;
