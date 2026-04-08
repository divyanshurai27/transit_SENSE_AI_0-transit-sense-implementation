import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Calendar, Download, Filter, CheckCircle, Clock, AlertTriangle, Train, Bus, Plane } from "lucide-react";

interface ArchivedAdvisory {
  id: string;
  date: Date;
  festival: string;
  corridor: string;
  summary: string;
  outcome: "trains-added" | "prices-normalized" | "no-action" | "capacity-increased";
  severity: "critical" | "high" | "medium" | "low";
  affectedPassengers: number;
  duration: number; // in days
}

interface AdvisoryArchiveProps {}

const AdvisoryArchive = ({}: AdvisoryArchiveProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFestival, setSelectedFestival] = useState("all");
  const [selectedOutcome, setSelectedOutcome] = useState("all");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  // Sample archived advisory data
  const archivedAdvisories: ArchivedAdvisory[] = [
    {
      id: "1",
      date: new Date("2024-10-15"),
      festival: "Diwali",
      corridor: "Mumbai - Delhi",
      summary: "Unprecedented demand during Diwali rush",
      outcome: "trains-added",
      severity: "critical",
      affectedPassengers: 250000,
      duration: 12
    },
    {
      id: "2",
      date: new Date("2024-09-20"),
      festival: "Normal",
      corridor: "Bangalore - Chennai",
      summary: "Weekend congestion on IT corridor",
      outcome: "capacity-increased",
      severity: "medium",
      affectedPassengers: 45000,
      duration: 3
    },
    {
      id: "3",
      date: new Date("2024-08-10"),
      festival: "Normal",
      corridor: "Kolkata - Mumbai",
      summary: "Monsoon-related disruptions",
      outcome: "no-action",
      severity: "low",
      affectedPassengers: 12000,
      duration: 2
    },
    {
      id: "4",
      date: new Date("2024-03-15"),
      festival: "Holi",
      corridor: "Delhi - Jaipur",
      summary: "Holi festival travel surge",
      outcome: "prices-normalized",
      severity: "high",
      affectedPassengers: 85000,
      duration: 5
    },
    {
      id: "5",
      date: new Date("2024-01-20"),
      festival: "Republic Day",
      corridor: "All Major Corridors",
      summary: "Republic Day weekend rush",
      outcome: "trains-added",
      severity: "high",
      affectedPassengers: 180000,
      duration: 4
    },
    {
      id: "6",
      date: new Date("2023-12-25"),
      festival: "Christmas",
      corridor: "Southern Corridors",
      summary: "Christmas and New Year travel",
      outcome: "capacity-increased",
      severity: "medium",
      affectedPassengers: 95000,
      duration: 7
    },
    {
      id: "7",
      date: new Date("2023-10-25"),
      festival: "Durga Puja",
      corridor: "Kolkata - All India",
      summary: "Durga Puja massive exodus",
      outcome: "trains-added",
      severity: "critical",
      affectedPassengers: 320000,
      duration: 10
    },
  ];

  const festivals = ["all", "Diwali", "Holi", "Durga Puja", "Christmas", "Republic Day", "Normal"];
  const outcomes = ["all", "trains-added", "prices-normalized", "no-action", "capacity-increased"];
  const years = ["2024", "2023", "2022", "2021"];

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case "trains-added": return "bg-green-100 text-green-800 border-green-200";
      case "prices-normalized": return "bg-blue-100 text-blue-800 border-blue-200";
      case "capacity-increased": return "bg-amber-100 text-amber-800 border-amber-200";
      case "no-action": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case "trains-added": return <Train className="h-3 w-3" />;
      case "prices-normalized": return <CheckCircle className="h-3 w-3" />;
      case "capacity-increased": return <Bus className="h-3 w-3" />;
      case "no-action": return <Clock className="h-3 w-3" />;
      default: return null;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-500 text-white";
      case "high": return "bg-orange-500 text-white";
      case "medium": return "bg-amber-500 text-white";
      case "low": return "bg-blue-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const filteredAdvisories = archivedAdvisories.filter(advisory => {
    const matchesSearch = advisory.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         advisory.corridor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFestival = selectedFestival === "all" || advisory.festival === selectedFestival;
    const matchesOutcome = selectedOutcome === "all" || advisory.outcome === selectedOutcome;
    const matchesYear = advisory.date.getFullYear().toString() === selectedYear;
    
    return matchesSearch && matchesFestival && matchesOutcome && matchesYear;
  });

  const handleExportCSV = () => {
    // In real implementation, this would generate and download a CSV file
    const csvContent = [
      ["Date", "Festival", "Corridor", "Summary", "Outcome", "Severity", "Affected Passengers", "Duration (days)"],
      ...filteredAdvisories.map(advisory => [
        advisory.date.toLocaleDateString(),
        advisory.festival,
        advisory.corridor,
        advisory.summary,
        advisory.outcome,
        advisory.severity,
        advisory.affectedPassengers.toString(),
        advisory.duration.toString()
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `advisory-archive-${selectedYear}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalAdvisories = filteredAdvisories.length;
  const totalPassengersAffected = filteredAdvisories.reduce((sum, advisory) => sum + advisory.affectedPassengers, 0);
  const averageDuration = filteredAdvisories.length > 0 
    ? (filteredAdvisories.reduce((sum, advisory) => sum + advisory.duration, 0) / filteredAdvisories.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-amber-500" />
                Advisory Archive
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Searchable history of past advisories with outcomes and impact analysis
              </p>
            </div>
            <Button onClick={handleExportCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 min-w-64">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search advisories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>

            <Select value={selectedFestival} onValueChange={setSelectedFestival}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Festival" />
              </SelectTrigger>
              <SelectContent>
                {festivals.map((festival) => (
                  <SelectItem key={festival} value={festival}>
                    {festival === "all" ? "All Festivals" : festival}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedOutcome} onValueChange={setSelectedOutcome}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Outcome" />
              </SelectTrigger>
              <SelectContent>
                {outcomes.map((outcome) => (
                  <SelectItem key={outcome} value={outcome}>
                    {outcome === "all" ? "All Outcomes" : 
                     outcome === "trains-added" ? "Trains Added" :
                     outcome === "prices-normalized" ? "Prices Normalized" :
                     outcome === "capacity-increased" ? "Capacity Increased" :
                     "No Action"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Date Range
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalAdvisories}</div>
              <div className="text-sm text-muted-foreground">Total Advisories</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {(totalPassengersAffected / 1000000).toFixed(1)}M
              </div>
              <div className="text-sm text-muted-foreground">Passengers Affected</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">{averageDuration}</div>
              <div className="text-sm text-muted-foreground">Avg Duration (days)</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {filteredAdvisories.filter(a => a.outcome === "trains-added").length}
              </div>
              <div className="text-sm text-muted-foreground">Trains Added</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advisory Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Festival</TableHead>
                  <TableHead>Corridor</TableHead>
                  <TableHead>Summary</TableHead>
                  <TableHead>Outcome</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead className="text-right">Duration</TableHead>
                  <TableHead className="text-right">Passengers</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdvisories.map((advisory) => (
                  <TableRow key={advisory.id} className="hover:bg-accent/50">
                    <TableCell>
                      <div className="font-medium">
                        {advisory.date.toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{advisory.festival}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{advisory.corridor}</TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={advisory.summary}>
                        {advisory.summary}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getOutcomeColor(advisory.outcome)}>
                        <div className="flex items-center gap-1">
                          {getOutcomeIcon(advisory.outcome)}
                          {advisory.outcome === "trains-added" ? "Trains Added" :
                           advisory.outcome === "prices-normalized" ? "Prices Normalized" :
                           advisory.outcome === "capacity-increased" ? "Capacity Increased" :
                           "No Action"}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getSeverityColor(advisory.severity)}>
                        {advisory.severity.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {advisory.duration} days
                    </TableCell>
                    <TableCell className="text-right">
                      {(advisory.affectedPassengers / 1000).toFixed(0)}K
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Outcome Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {["trains-added", "prices-normalized", "capacity-increased", "no-action"].map((outcome) => {
          const count = filteredAdvisories.filter(a => a.outcome === outcome).length;
          const percentage = totalAdvisories > 0 ? (count / totalAdvisories * 100).toFixed(0) : 0;
          
          return (
            <Card key={outcome} className={getOutcomeColor(outcome)}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {getOutcomeIcon(outcome)}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">
                      {outcome === "trains-added" ? "Trains Added" :
                       outcome === "prices-normalized" ? "Prices Normalized" :
                       outcome === "capacity-increased" ? "Capacity Increased" :
                       "No Action"}
                    </div>
                    <div className="text-sm opacity-80">
                      {count} advisories ({percentage}%)
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredAdvisories.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No advisories found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search terms to see more results.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdvisoryArchive;
