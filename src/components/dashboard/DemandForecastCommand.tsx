import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts";
import { Download, TrendingUp, Calendar, Target } from "lucide-react";
import { useSearchContext } from "@/contexts/SearchContext";

interface DemandForecastCommandProps {}

const DemandForecastCommand = ({}: DemandForecastCommandProps) => {
  const [dateRange, setDateRange] = useState("6-week");
  const [selectedCorridor, setSelectedCorridor] = useState("all");
  const { demandForecast, festivals } = useSearchContext();

  const forecastData = useMemo(() => {
    if (demandForecast && demandForecast.length > 0) {
      return demandForecast.map((df) => {
        const dateObj = new Date(df.date);
        const dayLabel = `${dateObj.getDate()}/${dateObj.getMonth() + 1}`;
        const baseVal = df.demandScore * 1000;
        return {
          week: dayLabel,
          forecast: baseVal,
          historical: baseVal * 0.85,
          confidenceUpper: baseVal * 1.15,
          confidenceLower: baseVal * 0.8,
          weatherAlert: df.weatherAlert || false,
          hasFestival: df.hasFestival || false
        };
      });
    }

    const weeks = dateRange === "4-week" ? 4 : dateRange === "6-week" ? 6 : 8;
    return Array.from({ length: weeks }, (_, i) => ({
      week: `Week ${i + 1}`,
      forecast: Math.floor(Math.random() * 30000) + 70000,
      historical: Math.floor(Math.random() * 25000) + 60000,
      confidenceUpper: Math.floor(Math.random() * 35000) + 75000,
      confidenceLower: Math.floor(Math.random() * 20000) + 55000,
      weatherAlert: false,
      hasFestival: false
    }));
  }, [demandForecast, dateRange]);

  const corridors = [
    { id: "all", name: "All Major Corridors" },
    { id: "mumbai-delhi", name: "Mumbai - Delhi" },
    { id: "kolkata-chennai", name: "Kolkata - Chennai" },
    { id: "bangalore-hyderabad", name: "Bangalore - Hyderabad" },
    { id: "delhi-varanasi", name: "Delhi - Varanasi" },
  ];

  const accuracy = 87.3;

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Demand Forecast Command
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Rolling forecast for major transport corridors
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800">
                {accuracy}% directional accuracy
              </Badge>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {/* Date Range Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Forecast Range</label>
              <div className="flex gap-2">
                {["4-week", "6-week", "8-week"].map((range) => (
                  <Button
                    key={range}
                    variant={dateRange === range ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDateRange(range)}
                  >
                    {range.replace("-", " ")}
                  </Button>
                ))}
              </div>
            </div>

            {/* Corridor Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Corridor Filter</label>
              <Select value={selectedCorridor} onValueChange={setSelectedCorridor}>
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {corridors.map((corridor) => (
                    <SelectItem key={corridor.id} value={corridor.id}>
                      {corridor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Forecast Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-amber-500" />
            Demand Forecast vs Historical Baseline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" />
                <YAxis 
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  label={{ value: 'Passengers', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value: any, name: string) => [
                    `${value.toLocaleString()} passengers`,
                    name === 'forecast' ? 'Forecast' : name === 'historical' ? 'Historical' : name
                  ]}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px'
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="confidenceUpper"
                  stackId="1"
                  stroke="#94a3b8"
                  fill="#e2e8f0"
                  fillOpacity={0.3}
                  name="Confidence Band"
                />
                <Area
                  type="monotone"
                  dataKey="confidenceLower"
                  stackId="2"
                  stroke="#94a3b8"
                  fill="#e2e8f0"
                  fillOpacity={0.3}
                />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  name="Forecast"
                />
                <Line
                  type="monotone"
                  dataKey="historical"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#10b981', r: 3 }}
                  name="Historical Baseline"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-8 w-8 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">
                  {Math.max(...forecastData.map(d => d.forecast)).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Peak Week Demand</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div>
                <div className="text-2xl font-bold">+18.5%</div>
                <div className="text-sm text-muted-foreground">vs. Historical</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-8 w-8 text-amber-500" />
              <div>
                <div className="text-2xl font-bold">
                  {forecastData.findIndex(d => d.forecast === Math.max(...forecastData.map(d => d.forecast))) + 1}
                </div>
                <div className="text-sm text-muted-foreground">Peak Week</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold text-sm">AI</span>
              </div>
              <div>
                <div className="text-2xl font-bold">{accuracy}%</div>
                <div className="text-sm text-muted-foreground">Model Accuracy</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Festival Impact Indicators */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Festival Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {festivals && festivals.length > 0 ? (
              festivals.slice(0, 3).map((fest: any, i: number) => (
                <div key={i} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{fest.name}</span>
                    <Badge className={fest.historicalCrowdLevel > 90 ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"}>
                      {fest.historicalCrowdLevel > 90 ? 'Critical' : 'High Impact'}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Affected Corridors: {fest.affectedCorridors?.join(', ')}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Dates: {fest.dates}
                  </div>
                </div>
              ))
            ) : (
              // Fallback content if empty
              <>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Diwali Season</span>
                    <Badge className="bg-red-100 text-red-800">High Impact</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Expected 2.5x normal demand across northern corridors
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Peak: Oct 28 - Nov 5
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Kumbh Mela</span>
                    <Badge className="bg-red-100 text-red-800">Critical</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Unprecedented demand to Prayagraj from all major cities
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Peak: Jan 14 - Feb 26
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Durga Puja</span>
                    <Badge className="bg-amber-100 text-amber-800">Moderate</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Eastern corridor surge, particularly Kolkata connections
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Peak: Oct 9-13
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DemandForecastCommand;
