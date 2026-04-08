import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, AlertTriangle, Send, TrendingUp, DollarSign, Settings } from "lucide-react";
import { toast } from "sonner";
import { useSearchContext } from "@/contexts/SearchContext";
import { useEffect } from "react";

interface FareData {
  id: string;
  operator: string;
  route: string;
  currentFare: number;
  baselineFare: number;
  multiplier: number;
  status: "normal" | "warning" | "violation";
  lastUpdated: Date;
}

interface SurgePricingOversightProps {}

const SurgePricingOversight = ({}: SurgePricingOversightProps) => {
  const [pricingCeiling, setPricingCeiling] = useState(3.0);
  const [fareData, setFareData] = useState<FareData[]>([]);
  const { fareAlert } = useSearchContext();

  function getInitialFareData(): FareData[] {
    return [
      {
        id: "1",
        operator: "PrivateBusExpress",
        route: "Mumbai - Delhi",
        currentFare: 8500,
        baselineFare: 2500,
        multiplier: 3.4,
        status: "violation",
        lastUpdated: new Date(Date.now() - 1000 * 60 * 5)
      },
      {
        id: "2",
        operator: "QuickTravels",
        route: "Delhi - Varanasi",
        currentFare: 3200,
        baselineFare: 1200,
        multiplier: 2.7,
        status: "warning",
        lastUpdated: new Date(Date.now() - 1000 * 60 * 15)
      },
      {
        id: "3",
        operator: "RoyalWings",
        route: "Bangalore - Hyderabad",
        currentFare: 2800,
        baselineFare: 1500,
        multiplier: 1.9,
        status: "normal",
        lastUpdated: new Date(Date.now() - 1000 * 60 * 8)
      },
      {
        id: "4",
        operator: "FastTrack",
        route: "Kolkata - Chennai",
        currentFare: 4200,
        baselineFare: 1800,
        multiplier: 2.3,
        status: "warning",
        lastUpdated: new Date(Date.now() - 1000 * 60 * 12)
      },
      {
        id: "5",
        operator: "ComfortRide",
        route: "Pune - Nagpur",
        currentFare: 1800,
        baselineFare: 900,
        multiplier: 2.0,
        status: "normal",
        lastUpdated: new Date(Date.now() - 1000 * 60 * 20)
      },
      {
        id: "6",
        operator: "PremiumTrans",
        route: "Ahmedabad - Prayagraj",
        currentFare: 6500,
        baselineFare: 2000,
        multiplier: 3.25,
        status: "violation",
        lastUpdated: new Date(Date.now() - 1000 * 60 * 3)
      },
    ];
  }

  useEffect(() => {
    const initial = getInitialFareData();
    if (fareAlert) {
      const multiplier = parseFloat((fareAlert.currentFare / fareAlert.baseFare).toFixed(2));
      const liveItem: FareData = {
        id: "live-1",
        operator: "Live Searched Route",
        route: fareAlert.route,
        currentFare: fareAlert.currentFare,
        baselineFare: fareAlert.baseFare,
        multiplier,
        status: multiplier >= pricingCeiling ? "violation" : multiplier >= pricingCeiling * 0.8 ? "warning" : "normal",
        lastUpdated: new Date()
      };
      
      const filtered = initial.filter(item => item.route !== fareAlert.route);
      setFareData([liveItem, ...filtered]);
    } else {
      setFareData(initial);
    }
  }, [fareAlert, pricingCeiling]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "violation": return "bg-red-100 text-red-800 border-red-200";
      case "warning": return "bg-amber-100 text-amber-800 border-amber-200";
      case "normal": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getMultiplierColor = (multiplier: number) => {
    if (multiplier >= pricingCeiling) return "text-red-600 font-bold";
    if (multiplier >= pricingCeiling * 0.8) return "text-amber-600 font-semibold";
    return "text-green-600";
  };

  const dispatchAlert = async (route: string) => {
    toast.success(`Consumer alert dispatched for ${route}`);
    
    // In real implementation, this would send alerts to consumers
    setFareData(prevData => 
      prevData.map(item => 
        item.route === route 
          ? { ...item, status: "warning" as const }
          : item
      )
    );
  };

  const updatePricingCeiling = () => {
    toast.success(`Pricing ceiling updated to ${pricingCeiling}x baseline fare`);
    
    // Recalculate statuses based on new ceiling
    setFareData(prevData => 
      prevData.map(item => ({
        ...item,
        status: item.multiplier >= pricingCeiling ? "violation" as const :
                item.multiplier >= pricingCeiling * 0.8 ? "warning" as const :
                "normal" as const
      }))
    );
  };

  const violationsToday = fareData.filter(item => item.status === "violation").length;
  const operatorsFlagged = new Set(fareData.filter(item => item.status === "violation").map(item => item.operator)).size;
  const alertsSent = Math.floor(Math.random() * 50) + 20; // Simulated count

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-500" />
            Surge Pricing Oversight
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Monitor and flag private operator pricing violations in real-time
          </p>
        </CardHeader>
        <CardContent>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-red-600">{violationsToday}</div>
              <div className="text-sm text-muted-foreground">Violations Today</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-amber-600">{operatorsFlagged}</div>
              <div className="text-sm text-muted-foreground">Operators Flagged</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{alertsSent}</div>
              <div className="text-sm text-muted-foreground">Alerts Sent</div>
            </div>
          </div>

          {/* Pricing Ceiling Calculator */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Settings className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <Label htmlFor="pricing-ceiling" className="text-sm font-medium text-blue-900">
                    Fair-Price Ceiling Calculator
                  </Label>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-blue-700">Base fare ×</span>
                    <Input
                      id="pricing-ceiling"
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={pricingCeiling}
                      onChange={(e) => setPricingCeiling(parseFloat(e.target.value))}
                      className="w-20"
                    />
                    <span className="text-sm text-blue-700">= Maximum allowed fare</span>
                    <Button size="sm" onClick={updatePricingCeiling}>
                      Update
                    </Button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-blue-700">Current ceiling</div>
                  <div className="text-lg font-bold text-blue-900">{pricingCeiling}x</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Live Feed Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Live Pricing Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Operator</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead className="text-right">Current Fare</TableHead>
                  <TableHead className="text-right">Baseline</TableHead>
                  <TableHead className="text-right">Multiplier</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fareData.map((fare) => (
                  <TableRow key={fare.id} className={getStatusColor(fare.status)}>
                    <TableCell className="font-medium">{fare.operator}</TableCell>
                    <TableCell>{fare.route}</TableCell>
                    <TableCell className="text-right font-semibold">
                      ₹{fare.currentFare.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      ₹{fare.baselineFare.toLocaleString()}
                    </TableCell>
                    <TableCell className={`text-right ${getMultiplierColor(fare.multiplier)}`}>
                      {fare.multiplier.toFixed(1)}x
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={getStatusColor(fare.status)}>
                        {fare.status === "violation" && (
                          <AlertTriangle className="h-3 w-3 mr-1" />
                        )}
                        {fare.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        {fare.status === "violation" && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => dispatchAlert(fare.route)}
                          >
                            <Send className="h-4 w-4 mr-1" />
                            Alert
                          </Button>
                        )}
                        {fare.status === "warning" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => dispatchAlert(fare.route)}
                          >
                            Monitor
                          </Button>
                        )}
                        {fare.status === "normal" && (
                          <Badge variant="secondary">OK</Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Violations Details */}
      {violationsToday > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Active Violations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {fareData.filter(item => item.status === "violation").map((violation) => (
                <div key={violation.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div>
                      <div className="font-medium">{violation.operator}</div>
                      <div className="text-sm text-muted-foreground">{violation.route}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-red-600">
                      {violation.multiplier.toFixed(1)}x baseline
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Exceeds by {(violation.multiplier - pricingCeiling).toFixed(1)}x
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => dispatchAlert(violation.route)}
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Dispatch Alert
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Regulatory Information */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="text-sm text-amber-800">
              <div className="font-semibold mb-1">Regulatory Guidelines</div>
              <ul className="space-y-1 text-amber-700">
                <li>• Maximum allowed surge: {pricingCeiling}x baseline fare during festival periods</li>
                <li>• Operators must display baseline fare prominently</li>
                <li>• Consumer alerts automatically triggered for violations</li>
                <li>• Repeated violations may result in license penalties</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SurgePricingOversight;
