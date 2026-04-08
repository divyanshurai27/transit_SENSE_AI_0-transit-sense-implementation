import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { X, TrendingUp, Users, MessageSquare, Cloud, AlertTriangle, Calendar } from "lucide-react";

interface Corridor {
  id: string;
  origin: string;
  destination: string;
  festival: string;
  riskScore: number;
  ticketVelocity: number;
  socialSignalIndex: number;
  daysToEvent: number;
  transportMode: string;
}

interface CorridorDrillDownProps {
  corridor: Corridor;
  onClose: () => void;
}

const CorridorDrillDown = ({ corridor, onClose }: CorridorDrillDownProps) => {
  const [activeTab, setActiveTab] = useState("occupancy");

  // Sample historical data for the past 3 festivals
  const generateHistoricalOccupancy = () => {
    return Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      diwali2023: Math.floor(Math.random() * 30) + 70,
      holi2024: Math.floor(Math.random() * 25) + 65,
      current: Math.floor(Math.random() * 35) + 75,
    }));
  };

  const generateTicketVelocity = () => {
    return Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      velocity: Math.floor(Math.random() * 50) + 30,
      baseline: Math.floor(Math.random() * 30) + 20,
    }));
  };

  const generateSocialSentiment = () => {
    return Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      sentiment: Math.floor(Math.random() * 40) + 60,
      mentions: Math.floor(Math.random() * 1000) + 500,
    }));
  };

  const historicalOccupancy = generateHistoricalOccupancy();
  const ticketVelocity = generateTicketVelocity();
  const socialSentiment = generateSocialSentiment();

  const getRiskColor = (score: number) => {
    if (score >= 80) return "text-red-600 bg-red-50 border-red-200";
    if (score >= 60) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-green-600 bg-green-50 border-green-200";
  };

  const getWeatherRisk = () => {
    // Simulate weather risk assessment
    return Math.floor(Math.random() * 30) + 10;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                {corridor.origin} → {corridor.destination}
              </h2>
              <div className="flex items-center gap-4 mt-2">
                <Badge variant="outline">{corridor.festival}</Badge>
                <Badge variant="outline" className="capitalize">{corridor.transportMode}</Badge>
                <Badge className={getRiskColor(corridor.riskScore)}>
                  Risk Score: {corridor.riskScore}
                </Badge>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="occupancy">Historical Occupancy</TabsTrigger>
              <TabsTrigger value="velocity">Ticket Velocity</TabsTrigger>
              <TabsTrigger value="sentiment">Social Sentiment</TabsTrigger>
              <TabsTrigger value="comparison">Similar Events</TabsTrigger>
            </TabsList>

            <TabsContent value="occupancy" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-500" />
                      Historical Occupancy Patterns
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Comparison with past 3 festivals on this corridor
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={historicalOccupancy}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="day" />
                          <YAxis 
                            domain={[0, 100]}
                            tickFormatter={(value) => `${value}%`}
                          />
                          <Tooltip 
                            formatter={(value: any, name: string) => [
                              `${value}%`,
                              name === 'diwali2023' ? 'Diwali 2023' :
                              name === 'holi2024' ? 'Holi 2024' : 'Current Forecast'
                            ]}
                          />
                          <Line
                            type="monotone"
                            dataKey="diwali2023"
                            stroke="#ef4444"
                            strokeWidth={2}
                            name="diwali2023"
                          />
                          <Line
                            type="monotone"
                            dataKey="holi2024"
                            stroke="#f59e0b"
                            strokeWidth={2}
                            name="holi2024"
                          />
                          <Line
                            type="monotone"
                            dataKey="current"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            name="current"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">92%</div>
                        <div className="text-sm text-muted-foreground">Peak Occupancy (Current)</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-amber-600">85%</div>
                        <div className="text-sm text-muted-foreground">Peak Occupancy (Historical Avg)</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">+7%</div>
                        <div className="text-sm text-muted-foreground">vs. Historical Average</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="velocity" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      Ticket Sales Velocity (24h)
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Real-time booking velocity compared to baseline
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={ticketVelocity}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="hour" />
                          <YAxis />
                          <Tooltip 
                            formatter={(value: any, name: string) => [
                              `${value} tickets/hour`,
                              name === 'velocity' ? 'Current Velocity' : 'Baseline'
                            ]}
                          />
                          <Bar dataKey="baseline" fill="#e2e8f0" name="baseline" />
                          <Bar dataKey="velocity" fill="#3b82f6" name="velocity" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Current Velocity</span>
                          <span className="text-lg font-bold">{corridor.ticketVelocity}/10</span>
                        </div>
                        <Progress value={corridor.ticketVelocity * 10} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Peak Hour</span>
                          <span className="text-lg font-bold">14:00</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Highest booking activity
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="sentiment" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-purple-500" />
                      Social Media Sentiment Index
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      7-day rolling sentiment analysis for this corridor
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={socialSentiment}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="date" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip 
                            formatter={(value: any, name: string) => [
                              name === 'sentiment' ? `${value}%` : value.toLocaleString(),
                              name === 'sentiment' ? 'Sentiment Score' : 'Mentions'
                            ]}
                          />
                          <Line
                            type="monotone"
                            dataKey="sentiment"
                            stroke="#8b5cf6"
                            strokeWidth={3}
                            name="sentiment"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{corridor.socialSignalIndex}%</div>
                        <div className="text-sm text-muted-foreground">Current Sentiment</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">2.4K</div>
                        <div className="text-sm text-muted-foreground">Daily Mentions</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">+15%</div>
                        <div className="text-sm text-muted-foreground">vs. Last Week</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="comparison" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Weather Disruption Risk</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <Cloud className="h-8 w-8 text-blue-500" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Disruption Probability</span>
                          <span className="text-lg font-bold">{getWeatherRisk()}%</span>
                        </div>
                        <Progress value={getWeatherRisk()} className="h-2" />
                      </div>
                      <Badge variant="outline" className="bg-blue-50">
                        Low Risk
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Similar Past Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="font-medium">Diwali 2023</div>
                            <div className="text-sm text-muted-foreground">Same corridor, similar festival</div>
                          </div>
                          <Badge className="bg-red-100 text-red-800">High Demand</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Peak Occupancy:</span>
                            <span className="ml-2 font-medium">88%</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Duration:</span>
                            <span className="ml-2 font-medium">7 days</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Capacity Added:</span>
                            <span className="ml-2 font-medium">+15%</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="font-medium">Holi 2024</div>
                            <div className="text-sm text-muted-foreground">Same corridor, different festival</div>
                          </div>
                          <Badge className="bg-amber-100 text-amber-800">Moderate Demand</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Peak Occupancy:</span>
                            <span className="ml-2 font-medium">75%</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Duration:</span>
                            <span className="ml-2 font-medium">5 days</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Capacity Added:</span>
                            <span className="ml-2 font-medium">+8%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span className="text-sm text-muted-foreground">
                Last updated: {new Date().toLocaleTimeString()}
              </span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Export Report</Button>
              <Button>Generate Recommendation</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorridorDrillDown;
