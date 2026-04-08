import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, Filter, AlertTriangle, Calendar, MapPin, ExternalLink, Clock } from "lucide-react";

interface Advisory {
  id: string;
  festival: string;
  corridor: string;
  severity: "critical" | "high" | "medium" | "low";
  issuedDate: Date;
  title: string;
  summary: string;
  fullText: string;
  transportModes: string[];
  affectedStates: string[];
}

interface ActiveAdvisoryListProps {}

const ActiveAdvisoryList = ({}: ActiveAdvisoryListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFestival, setSelectedFestival] = useState("all");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [selectedTransport, setSelectedTransport] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [expandedAdvisory, setExpandedAdvisory] = useState<string | null>(null);

  // Sample advisory data
  const advisories: Advisory[] = [
    {
      id: "1",
      festival: "Diwali",
      corridor: "Mumbai - Delhi",
      severity: "critical",
      issuedDate: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      title: "Critical: Mumbai-Delhi corridor at maximum capacity",
      summary: "Unprecedented demand expected on Mumbai-Delhi route. All trains and flights fully booked.",
      fullText: "Due to Diwali festival rush, the Mumbai-Delhi corridor is experiencing unprecedented demand. All premium trains are fully booked for the next 10 days. Airlines have reported 100% load factors with surge pricing up to 4x normal rates. Passengers are advised to consider alternative routes or postpone non-essential travel. Additional special trains are being arranged but will only be available from November 20th onwards.",
      transportModes: ["train", "flight"],
      affectedStates: ["Maharashtra", "Delhi", "Gujarat", "Rajasthan"]
    },
    {
      id: "2",
      festival: "Kumbh Mela",
      corridor: "Delhi - Prayagraj",
      severity: "critical",
      issuedDate: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
      title: "Kumbh Mela: Special transport arrangements announced",
      summary: "Government announces special trains and buses for Kumbh Mela pilgrims. Booking opens tomorrow.",
      fullText: "In preparation for the upcoming Kumbh Mela, the Ministry of Railways has announced 200 special train services to Prayagraj. Additionally, state transport departments will operate 500 special buses from major cities. Online booking for these services will begin tomorrow at 10:00 AM. Expected pilgrim influx: 10 crore over 45 days. Priority will be given to elderly and disabled passengers.",
      transportModes: ["train", "bus"],
      affectedStates: ["Uttar Pradesh", "Delhi", "Madhya Pradesh", "Bihar"]
    },
    {
      id: "3",
      festival: "Durga Puja",
      corridor: "Kolkata - All Major Cities",
      severity: "high",
      issuedDate: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
      title: "Durga Puja: High demand on Kolkata routes",
      summary: "Eastern corridors experiencing 3x normal demand. Additional capacity being deployed.",
      fullText: "Durga Puja celebrations are causing significant strain on transport networks serving Kolkata. Sealdah and Howrah stations are operating at 120% capacity. Eastern Railway has added 15 additional coaches to existing trains. Private operators have increased frequencies but are also charging premium rates. Passengers are advised to book return tickets in advance.",
      transportModes: ["train", "bus", "flight"],
      affectedStates: ["West Bengal", "Jharkhand", "Odisha", "Bihar"]
    },
    {
      id: "4",
      festival: "Normal",
      corridor: "Bangalore - Chennai",
      severity: "medium",
      issuedDate: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      title: "Weekend rush expected on Bangalore-Chennai route",
      summary: "Normal weekend traffic combined with IT sector travel causing moderate congestion.",
      fullText: "Regular weekend travel patterns combined with increased IT sector movement between Bangalore and Chennai is causing moderate congestion. KSRTC and Tamil Nadu buses are operating with 85% occupancy. Indian Railways has adequate capacity but premium trains are filling quickly. No surge pricing reported yet.",
      transportModes: ["train", "bus", "flight"],
      affectedStates: ["Karnataka", "Tamil Nadu"]
    },
    {
      id: "5",
      festival: "Eid",
      corridor: "Hyderabad - Mumbai",
      severity: "low",
      issuedDate: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
      title: "Eid travel: Normal operations expected",
      summary: "Slight increase in demand on Hyderabad-Mumbai route. No major disruptions anticipated.",
      fullText: "Eid celebrations are causing a slight increase in travel demand between Hyderabad and Mumbai. All transport modes are operating normally with adequate capacity. No special arrangements required. Passengers advised to book tickets 2-3 days in advance for better rates.",
      transportModes: ["train", "bus", "flight"],
      affectedStates: ["Telangana", "Maharashtra", "Karnataka"]
    },
  ];

  const festivals = ["all", "Diwali", "Kumbh Mela", "Durga Puja", "Eid", "Normal"];
  const states = ["all", "Maharashtra", "Delhi", "West Bengal", "Uttar Pradesh", "Karnataka", "Tamil Nadu"];
  const severities = ["all", "critical", "high", "medium", "low"];
  const transports = ["all", "train", "bus", "flight"];
  const sortOptions = ["newest", "oldest", "severity", "festival"];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-500 text-white";
      case "high": return "bg-orange-500 text-white";
      case "medium": return "bg-amber-500 text-white";
      case "low": return "bg-blue-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getSeverityBgColor = (severity: string) => {
    switch (severity) {
      case "critical": return "border-red-200 bg-red-50";
      case "high": return "border-orange-200 bg-orange-50";
      case "medium": return "border-amber-200 bg-amber-50";
      case "low": return "border-blue-200 bg-blue-50";
      default: return "border-gray-200 bg-gray-50";
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  const filteredAndSortedAdvisories = advisories
    .filter(advisory => {
      const matchesSearch = advisory.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           advisory.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           advisory.corridor.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFestival = selectedFestival === "all" || advisory.festival === selectedFestival;
      const matchesState = selectedState === "all" || advisory.affectedStates.includes(selectedState);
      const matchesSeverity = selectedSeverity === "all" || advisory.severity === selectedSeverity;
      const matchesTransport = selectedTransport === "all" || advisory.transportModes.includes(selectedTransport);
      
      return matchesSearch && matchesFestival && matchesState && matchesSeverity && matchesTransport;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.issuedDate.getTime() - a.issuedDate.getTime();
        case "oldest":
          return a.issuedDate.getTime() - b.issuedDate.getTime();
        case "severity":
          const severityOrder = { "critical": 4, "high": 3, "medium": 2, "low": 1 };
          return severityOrder[b.severity] - severityOrder[a.severity];
        case "festival":
          return a.festival.localeCompare(b.festival);
        default:
          return 0;
      }
    });

  const criticalCount = advisories.filter(a => a.severity === "critical").length;
  const highCount = advisories.filter(a => a.severity === "high").length;

  return (
    <div className="space-y-6">
      {/* Alert Banner */}
      {(criticalCount > 0 || highCount > 0) && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Active Alert:</strong> {criticalCount} critical and {highCount} high severity advisories currently in effect. 
            Check before planning travel.
          </AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Advisories</CardTitle>
        </CardHeader>
        <CardContent>
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

            <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                {severities.map((severity) => (
                  <SelectItem key={severity} value={severity}>
                    {severity === "all" ? "All" : severity.charAt(0).toUpperCase() + severity.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state === "all" ? "All States" : state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="severity">Severity</SelectItem>
                <SelectItem value="festival">Festival</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Advisory List */}
      <div className="space-y-4">
        {filteredAndSortedAdvisories.map((advisory) => (
          <Card 
            key={advisory.id} 
            className={`cursor-pointer transition-all hover:shadow-md ${getSeverityBgColor(advisory.severity)}`}
            onClick={() => setExpandedAdvisory(expandedAdvisory === advisory.id ? null : advisory.id)}
          >
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className={getSeverityColor(advisory.severity)}>
                        {advisory.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">{advisory.festival}</Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {getTimeAgo(advisory.issuedDate)}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{advisory.title}</h3>
                    <p className="text-muted-foreground mb-3">{advisory.summary}</p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {advisory.corridor}
                      </div>
                      {advisory.transportModes.map((mode) => (
                        <Badge key={mode} variant="secondary" className="text-xs">
                          {mode}
                        </Badge>
                      ))}
                      {advisory.affectedStates.slice(0, 3).map((state) => (
                        <Badge key={state} variant="outline" className="text-xs">
                          {state}
                        </Badge>
                      ))}
                      {advisory.affectedStates.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{advisory.affectedStates.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>

                {/* Expanded Content */}
                {expandedAdvisory === advisory.id && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="prose prose-sm max-w-none">
                      <p className="text-sm leading-relaxed">{advisory.fullText}</p>
                    </div>
                    <div className="mt-4 flex items-center gap-4">
                      <div className="text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        Issued: {advisory.issuedDate.toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <Button size="sm" variant="outline">
                        Share Advisory
                      </Button>
                      <Button size="sm">
                        Subscribe to Updates
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredAndSortedAdvisories.length === 0 && (
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

export default ActiveAdvisoryList;
