import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, ComposedChart, Area } from "recharts";
import { TrendingUp, Download, Calendar, Target, AlertCircle, CheckCircle } from "lucide-react";

interface HistoricalAnalyticsPanelProps {}

const HistoricalAnalyticsPanel = ({}: HistoricalAnalyticsPanelProps) => {
  const [selectedFestival, setSelectedFestival] = useState("diwali");
  const [yearRange, setYearRange] = useState("2022-2024");

  // Sample historical data for demand comparison
  const generateDemandComparisonData = () => {
    return Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      current2024: Math.floor(Math.random() * 30000) + 70000,
      year2023: Math.floor(Math.random() * 25000) + 65000,
      year2022: Math.floor(Math.random() * 20000) + 60000,
    }));
  };

  // Sample model accuracy audit logs
  const accuracyLogs = [
    {
      corridor: "Mumbai - Delhi",
      date: "2024-10-15",
      predicted: 85000,
      actual: 82000,
      error: 3.5,
      accuracy: 96.5
    },
    {
      corridor: "Delhi - Varanasi",
      date: "2024-10-14",
      predicted: 45000,
      actual: 48000,
      error: -6.7,
      accuracy: 93.3
    },
    {
      corridor: "Kolkata - Chennai",
      date: "2024-10-13",
      predicted: 38000,
      actual: 36500,
      error: 4.1,
      accuracy: 95.9
    },
    {
      corridor: "Bangalore - Hyderabad",
      date: "2024-10-12",
      predicted: 28000,
      actual: 29000,
      error: -3.4,
      accuracy: 96.6
    },
    {
      corridor: "Pune - Nagpur",
      date: "2024-10-11",
      predicted: 22000,
      actual: 21500,
      error: 2.3,
      accuracy: 97.7
    },
  ];

  // Sample intervention impact data
  const generateInterventionData = () => {
    return [
      { phase: "Pre-Advisory", demand: 95000, capacity: 70000 },
      { phase: "Advisory Issued", demand: 85000, capacity: 75000 },
      { phase: "Capacity Added", demand: 80000, capacity: 85000 },
      { phase: "Peak Day", demand: 78000, capacity: 88000 },
      { phase: "Post-Peak", demand: 65000, capacity: 80000 },
    ];
  };

  const demandComparisonData = generateDemandComparisonData();
  const interventionData = generateInterventionData();

  const festivals = [
    { value: "diwali", label: "Diwali" },
    { value: "kumbh", label: "Kumbh Mela" },
    { value: "durga", label: "Durga Puja" },
    { value: "eid", label: "Eid" },
    { value: "pongal", label: "Pongal" },
  ];

  const yearRanges = [
    { value: "2022-2024", label: "2022-2024" },
    { value: "2021-2023", label: "2021-2023" },
    { value: "2020-2022", label: "2020-2022" },
  ];

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 95) return "text-green-600";
    if (accuracy >= 90) return "text-amber-600";
    return "text-red-600";
  };

  const getErrorColor = (error: number) => {
    const absError = Math.abs(error);
    if (absError <= 5) return "text-green-600";
    if (absError <= 10) return "text-amber-600";
    return "text-red-600";
  };

  const averageAccuracy = accuracyLogs.reduce((sum, log) => sum + log.accuracy, 0) / accuracyLogs.length;
  const totalPredictions = accuracyLogs.length;
  const highAccuracyCount = accuracyLogs.filter(log => log.accuracy >= 95).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                Historical Analytics Panel
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Year-on-year comparisons and model audit logs
              </p>
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Controls */}
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Festival</label>
              <Select value={selectedFestival} onValueChange={setSelectedFestival}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {festivals.map((festival) => (
                    <SelectItem key={festival.value} value={festival.value}>
                      {festival.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Year Range</label>
              <Select value={yearRange} onValueChange={setYearRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {yearRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demand Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            Demand Comparison: {festivals.find(f => f.value === selectedFestival)?.label}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Passenger demand comparison across the last 3 years
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={demandComparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" />
                <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                <Tooltip 
                  formatter={(value: any, name: string) => [
                    `${value.toLocaleString()} passengers`,
                    name === 'current2024' ? '2024 (Current)' :
                    name === 'year2023' ? '2023' : '2022'
                  ]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="current2024"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  name="current2024"
                />
                <Line
                  type="monotone"
                  dataKey="year2023"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="year2023"
                />
                <Line
                  type="monotone"
                  dataKey="year2022"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="year2022"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Key Insights */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center p-3 border rounded-lg">
              <div className="text-lg font-bold text-blue-600">+18.5%</div>
              <div className="text-sm text-muted-foreground">vs 2023</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-lg font-bold text-green-600">+27.3%</div>
              <div className="text-sm text-muted-foreground">vs 2022</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-lg font-bold text-amber-600">Peak: Day 3</div>
              <div className="text-sm text-muted-foreground">Highest demand</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Model Accuracy Audit */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-500" />
            Model Accuracy Audit Log
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Forecast accuracy vs actual demand for recent predictions
          </p>
        </CardHeader>
        <CardContent>
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className={`text-2xl font-bold ${getAccuracyColor(averageAccuracy)}`}>
                {averageAccuracy.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Average Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalPredictions}</div>
              <div className="text-sm text-muted-foreground">Total Predictions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{highAccuracyCount}</div>
              <div className="text-sm text-muted-foreground">High Accuracy (95%+)</div>
            </div>
          </div>

          {/* Accuracy Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Corridor</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Predicted</TableHead>
                  <TableHead className="text-right">Actual</TableHead>
                  <TableHead className="text-right">Error %</TableHead>
                  <TableHead className="text-right">Accuracy</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accuracyLogs.map((log, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{log.corridor}</TableCell>
                    <TableCell>{log.date}</TableCell>
                    <TableCell className="text-right">{log.predicted.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{log.actual.toLocaleString()}</TableCell>
                    <TableCell className={`text-right font-medium ${getErrorColor(log.error)}`}>
                      {log.error > 0 ? '+' : ''}{log.error}%
                    </TableCell>
                    <TableCell className={`text-right font-bold ${getAccuracyColor(log.accuracy)}`}>
                      {log.accuracy}%
                    </TableCell>
                    <TableCell className="text-center">
                      {log.accuracy >= 95 ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Excellent
                        </Badge>
                      ) : log.accuracy >= 90 ? (
                        <Badge className="bg-amber-100 text-amber-800">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Good
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Review
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Intervention Impact */}
      <Card>
        <CardHeader>
          <CardTitle>Intervention Impact Report</CardTitle>
          <p className="text-sm text-muted-foreground">
            Pre/post advisory demand shift analysis
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={interventionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="phase" />
                <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                <Tooltip 
                  formatter={(value: any, name: string) => [
                    `${value.toLocaleString()} passengers`,
                    name === 'demand' ? 'Demand' : 'Capacity'
                  ]}
                />
                <Legend />
                <Bar dataKey="capacity" fill="#e2e8f0" name="capacity" />
                <Line
                  type="monotone"
                  dataKey="demand"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  name="demand"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Impact Summary */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 border rounded-lg">
              <div className="text-sm font-medium mb-2">Demand Reduction</div>
              <div className="text-2xl font-bold text-green-600">-17.9%</div>
              <div className="text-sm text-muted-foreground">
                Peak day demand reduced from advisory
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm font-medium mb-2">Capacity Utilization</div>
              <div className="text-2xl font-bold text-blue-600">88.6%</div>
              <div className="text-sm text-muted-foreground">
                Optimal utilization achieved
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export as PDF
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export as CSV
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Raw Data
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleString()}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoricalAnalyticsPanel;
