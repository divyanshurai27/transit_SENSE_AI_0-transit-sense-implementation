import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown, Search, Filter, TrendingUp, Users, MessageSquare, Calendar } from "lucide-react";
import { useSearchContext } from "@/contexts/SearchContext";
import { useMemo } from "react";

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

interface CorridorRiskMatrixProps {
  onRowClick: (corridor: Corridor) => void;
}

const CorridorRiskMatrix = ({ onRowClick }: CorridorRiskMatrixProps) => {
  const [sortField, setSortField] = useState<keyof Corridor>("riskScore");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFestival, setSelectedFestival] = useState("all");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedMode, setSelectedMode] = useState("all");

  const { corridorRisks } = useSearchContext();

  const corridors: Corridor[] = useMemo(() => {
    if (corridorRisks && corridorRisks.length > 0) {
      return corridorRisks.map((cr, idx) => ({
        id: `cr-${idx}`,
        origin: cr.origin,
        destination: cr.destination,
        festival: "Determined via Map", 
        riskScore: cr.riskScore || 0,
        ticketVelocity: cr.currentDemand ? parseFloat((cr.currentDemand / 100).toFixed(1)) : 8.5,
        socialSignalIndex: cr.incidents ? cr.incidents * 20 : 78,
        daysToEvent: 15,
        transportMode: cr.transportMode
      }));
    }

    return [
      {
        id: "1", origin: "Mumbai", destination: "Delhi", festival: "Diwali", riskScore: 92,
        ticketVelocity: 8.5, socialSignalIndex: 78, daysToEvent: 15, transportMode: "train"
      },
      {
        id: "2", origin: "Delhi", destination: "Varanasi", festival: "Kumbh Mela", riskScore: 95,
        ticketVelocity: 9.2, socialSignalIndex: 85, daysToEvent: 45, transportMode: "bus"
      },
      {
        id: "3", origin: "Kolkata", destination: "Chennai", festival: "Durga Puja", riskScore: 78,
        ticketVelocity: 6.8, socialSignalIndex: 65, daysToEvent: 8, transportMode: "train"
      },
      {
        id: "4", origin: "Bangalore", destination: "Hyderabad", festival: "Normal", riskScore: 35,
        ticketVelocity: 3.2, socialSignalIndex: 25, daysToEvent: 0, transportMode: "flight"
      },
      {
        id: "5", origin: "Pune", destination: "Kolkata", festival: "Durga Puja", riskScore: 82,
        ticketVelocity: 7.1, socialSignalIndex: 70, daysToEvent: 8, transportMode: "train"
      },
      {
        id: "6", origin: "Ahmedabad", destination: "Prayagraj", festival: "Kumbh Mela", riskScore: 88,
        ticketVelocity: 8.0, socialSignalIndex: 75, daysToEvent: 45, transportMode: "bus"
      },
    ];
  }, [corridorRisks]);

  const festivals = ["all", "Diwali", "Kumbh Mela", "Durga Puja", "Eid", "Normal"];
  const states = ["all", "Maharashtra", "Uttar Pradesh", "West Bengal", "Tamil Nadu", "Karnataka"];
  const modes = ["all", "train", "bus", "flight"];

  const getRiskColor = (score: number) => {
    if (score >= 80) return "text-red-600 bg-red-50 border-red-200";
    if (score >= 60) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-green-600 bg-green-50 border-green-200";
  };

  const getRiskBadgeColor = (score: number) => {
    if (score >= 80) return "bg-red-500 text-white";
    if (score >= 60) return "bg-amber-500 text-white";
    return "bg-green-500 text-white";
  };

  const handleSort = (field: keyof Corridor) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const filteredAndSortedCorridors = corridors
    .filter(corridor => {
      const matchesSearch = corridor.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           corridor.destination.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFestival = selectedFestival === "all" || corridor.festival === selectedFestival;
      const matchesMode = selectedMode === "all" || corridor.transportMode === selectedMode;
      
      return matchesSearch && matchesFestival && matchesMode;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === "asc" 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-red-500" />
            Corridor Risk Matrix
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Real-time ranking of all OD pairs by risk level
          </p>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 min-w-64">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search origin or destination..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>

            <Select value={selectedFestival} onValueChange={setSelectedFestival}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by festival" />
              </SelectTrigger>
              <SelectContent>
                {festivals.map((festival) => (
                  <SelectItem key={festival} value={festival}>
                    {festival === "all" ? "All Festivals" : festival}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedMode} onValueChange={setSelectedMode}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Mode" />
              </SelectTrigger>
              <SelectContent>
                {modes.map((mode) => (
                  <SelectItem key={mode} value={mode}>
                    {mode === "all" ? "All" : mode}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>

          {/* Risk Summary */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {corridors.filter(c => c.riskScore >= 80).length}
              </div>
              <div className="text-sm text-muted-foreground">Critical Risk</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">
                {corridors.filter(c => c.riskScore >= 60 && c.riskScore < 80).length}
              </div>
              <div className="text-sm text-muted-foreground">Moderate Risk</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {corridors.filter(c => c.riskScore < 60).length}
              </div>
              <div className="text-sm text-muted-foreground">Low Risk</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {corridors.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Corridors</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => handleSort("origin")}
                  >
                    <div className="flex items-center gap-1">
                      Route
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => handleSort("festival")}
                  >
                    <div className="flex items-center gap-1">
                      Festival
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-accent text-center"
                    onClick={() => handleSort("riskScore")}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Risk Score
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-accent text-center"
                    onClick={() => handleSort("ticketVelocity")}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <Users className="h-4 w-4 mr-1" />
                      Ticket Velocity
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-accent text-center"
                    onClick={() => handleSort("socialSignalIndex")}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Social Signal
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-accent text-center"
                    onClick={() => handleSort("daysToEvent")}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      Days to Event
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedCorridors.map((corridor) => (
                  <TableRow 
                    key={corridor.id}
                    className={`cursor-pointer hover:bg-accent/50 ${getRiskColor(corridor.riskScore)}`}
                    onClick={() => onRowClick(corridor)}
                  >
                    <TableCell className="font-medium">
                      <div>
                        <div>{corridor.origin} → {corridor.destination}</div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {corridor.transportMode}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {corridor.festival}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={getRiskBadgeColor(corridor.riskScore)}>
                        {corridor.riskScore}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center">
                        <span className="font-medium">{corridor.ticketVelocity}</span>
                        <span className="text-xs text-muted-foreground ml-1">/10</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center">
                        <span className="font-medium">{corridor.socialSignalIndex}</span>
                        <span className="text-xs text-muted-foreground ml-1">%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {corridor.daysToEvent > 0 ? (
                        <Badge variant="secondary">
                          {corridor.daysToEvent} days
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-600 text-xs font-bold">i</span>
            </div>
            <div className="text-sm text-blue-800">
              <div className="font-semibold mb-1">How to use this matrix</div>
              <ul className="space-y-1 text-blue-700">
                <li>• Click any row to open detailed corridor analysis and historical comparisons</li>
                <li>• Risk scores combine demand forecasts, ticket velocity, and social media signals</li>
                <li>• Sort by any column to prioritize different risk factors</li>
                <li>• Use filters to focus on specific festivals, regions, or transport modes</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CorridorRiskMatrix;
