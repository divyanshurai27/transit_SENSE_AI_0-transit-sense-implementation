import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Monitor, Users, RefreshCw, AlertTriangle, Camera, Activity } from "lucide-react";
import { toast } from "sonner";

interface Terminal {
  id: string;
  name: string;
  currentOccupancy: number;
  status: "normal" | "warning" | "critical";
  lastUpdated: Date;
  location: string;
  capacity: number;
}

interface TerminalDensityMonitorProps {
  terminals?: Terminal[];
  refreshInterval?: number;
}

const TerminalDensityMonitor = ({ 
  terminals: initialTerminals, 
  refreshInterval = 30000 
}: TerminalDensityMonitorProps) => {
  const [terminals, setTerminals] = useState<Terminal[]>(initialTerminals || getDefaultTerminals());
  const [selectedTerminal, setSelectedTerminal] = useState<Terminal | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  function getDefaultTerminals(): Terminal[] {
    return [
      {
        id: "1",
        name: "Mumbai CST",
        currentOccupancy: 78,
        status: "warning",
        lastUpdated: new Date(),
        location: "Mumbai, Maharashtra",
        capacity: 10000
      },
      {
        id: "2",
        name: "New Delhi",
        currentOccupancy: 92,
        status: "critical",
        lastUpdated: new Date(),
        location: "New Delhi, Delhi",
        capacity: 12000
      },
      {
        id: "3",
        name: "Howrah",
        currentOccupancy: 65,
        status: "normal",
        lastUpdated: new Date(),
        location: "Kolkata, West Bengal",
        capacity: 8000
      },
      {
        id: "4",
        name: "Chennai Central",
        currentOccupancy: 58,
        status: "normal",
        lastUpdated: new Date(),
        location: "Chennai, Tamil Nadu",
        capacity: 9000
      },
      {
        id: "5",
        name: "Bangalore City",
        currentOccupancy: 71,
        status: "warning",
        lastUpdated: new Date(),
        location: "Bangalore, Karnataka",
        capacity: 7500
      },
      {
        id: "6",
        name: "Secunderabad",
        currentOccupancy: 45,
        status: "normal",
        lastUpdated: new Date(),
        location: "Hyderabad, Telangana",
        capacity: 6000
      },
    ];
  }

  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  const refreshData = async () => {
    setIsRefreshing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setTerminals(prevTerminals => 
      prevTerminals.map(terminal => ({
        ...terminal,
        currentOccupancy: Math.max(20, Math.min(95, 
          terminal.currentOccupancy + (Math.random() - 0.5) * 10
        )),
        status: getTerminalStatus(terminal.currentOccupancy + (Math.random() - 0.5) * 10),
        lastUpdated: new Date()
      }))
    );
    
    setIsRefreshing(false);
    toast.success("Terminal data refreshed");
  };

  const getTerminalStatus = (occupancy: number): "normal" | "warning" | "critical" => {
    if (occupancy >= 90) return "critical";
    if (occupancy >= 60) return "warning";
    return "normal";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical": return "bg-red-500";
      case "warning": return "bg-amber-500";
      case "normal": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "critical": return "bg-red-50 border-red-200";
      case "warning": return "bg-amber-50 border-amber-200";
      case "normal": return "bg-green-50 border-green-200";
      default: return "bg-gray-50 border-gray-200";
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "critical": return "text-red-700";
      case "warning": return "text-amber-700";
      case "normal": return "text-green-700";
      default: return "text-gray-700";
    }
  };

  const getThresholdColor = (occupancy: number) => {
    if (occupancy >= 90) return "bg-red-500";
    if (occupancy >= 80) return "bg-amber-500";
    if (occupancy >= 60) return "bg-blue-500";
    return "bg-green-500";
  };

  const openLiveFeed = (terminal: Terminal) => {
    setSelectedTerminal(terminal);
    toast.info(`Opening live feed for ${terminal.name}`);
  };

  const closeLiveFeed = () => {
    setSelectedTerminal(null);
  };

  const criticalTerminals = terminals.filter(t => t.status === "critical");
  const warningTerminals = terminals.filter(t => t.status === "warning");
  const normalTerminals = terminals.filter(t => t.status === "normal");

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-blue-500" />
                Terminal Density Monitor
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Real-time crowd density at major transport terminals
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Live Data
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={refreshData}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{criticalTerminals.length}</div>
              <div className="text-sm text-muted-foreground">Critical (90%+)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">{warningTerminals.length}</div>
              <div className="text-sm text-muted-foreground">Warning (60-89%)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{normalTerminals.length}</div>
              <div className="text-sm text-muted-foreground">Normal (&lt;60%)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{terminals.length}</div>
              <div className="text-sm text-muted-foreground">Total Terminals</div>
            </div>
          </div>

          {/* Alert Banner */}
          {criticalTerminals.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="text-sm font-medium text-red-800">
                  {criticalTerminals.length} terminal(s) at critical capacity. Immediate action required.
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Terminal Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {terminals.map((terminal) => (
          <Card 
            key={terminal.id} 
            className={`border-2 ${getStatusBgColor(terminal.status)} cursor-pointer hover:shadow-md transition-shadow`}
            onClick={() => openLiveFeed(terminal)}
          >
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{terminal.name}</h3>
                    <p className="text-xs text-muted-foreground">{terminal.location}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(terminal.status)} animate-pulse`}></div>
                    <Badge className={getStatusColor(terminal.status)}>
                      {terminal.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                {/* Occupancy Display */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Current Occupancy</span>
                    <span className={`text-2xl font-bold ${getStatusTextColor(terminal.status)}`}>
                      {terminal.currentOccupancy}%
                    </span>
                  </div>
                  <Progress value={terminal.currentOccupancy} className="h-3" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Capacity: {terminal.capacity.toLocaleString()}</span>
                    <span>{Math.round(terminal.capacity * terminal.currentOccupancy / 100).toLocaleString()} present</span>
                  </div>
                </div>

                {/* Threshold Indicators */}
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Normal (&lt;60%)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span>Warning (60%)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Critical (90%)</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Activity className="h-3 w-3" />
                    <span>Last updated: {terminal.lastUpdated.toLocaleTimeString()}</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Live Feed Modal */}
      {selectedTerminal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{selectedTerminal.name} - Live Feed</h3>
                <p className="text-sm text-muted-foreground">{selectedTerminal.location}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={closeLiveFeed}>
                ×
              </Button>
            </div>
            <div className="flex-1 p-4">
              <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center">
                  <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Live camera feed would be displayed here</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Current occupancy: {selectedTerminal.currentOccupancy}%
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    <span className="font-medium">Status:</span>
                    <Badge className={`ml-2 ${getStatusColor(selectedTerminal.status)}`}>
                      {selectedTerminal.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Occupancy:</span>
                    <span className="ml-2 font-bold">{selectedTerminal.currentOccupancy}%</span>
                  </div>
                </div>
                <Button size="sm">Dispatch Crowd Management</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TerminalDensityMonitor;
