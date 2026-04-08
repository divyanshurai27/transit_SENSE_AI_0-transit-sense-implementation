import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Lightbulb, Users, Calendar, Building, CheckCircle, Clock, XCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TravelDataService } from "@/lib/travel-service";
import { Recommendation } from "@/lib/types";

interface CapacityRecommendationCardsProps {}

const CapacityRecommendationCards = ({}: CapacityRecommendationCardsProps) => {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedMode, setSelectedMode] = useState("all");
  const [selectedFestival, setSelectedFestival] = useState("all");
  const [selectedUrgency, setSelectedUrgency] = useState("all");

  const queryClient = useQueryClient();
  const travelService = TravelDataService.getInstance();

  const { data, isLoading } = useQuery({
    queryKey: ["recommendations"],
    queryFn: () => travelService.getRecommendations(),
  });

  const acceptMutation = useMutation({
    mutationFn: (id: string) => travelService.acceptRecommendation(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["recommendations"] }),
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => travelService.rejectRecommendation(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["recommendations"] }),
  });

  const recommendations = data?.recommendations || [];
  const kpis = data?.kpis || { total: 0, accepted: 0, underReview: 0, passengersRelieved: 0 };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted": return "bg-green-100 text-green-800 border-green-200";
      case "under-review": return "bg-amber-100 text-amber-800 border-amber-200";
      case "rejected": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "under-review": return <Clock className="h-4 w-4 text-amber-600" />;
      case "rejected": return <XCircle className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high": return "bg-red-500 text-white";
      case "medium": return "bg-amber-500 text-white";
      case "low": return "bg-green-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const filteredRecommendations = recommendations.filter(rec => {
    const matchesStatus = selectedStatus === "all" || rec.status === selectedStatus;
    const matchesMode = selectedMode === "all" || true;
    const matchesFestival = selectedFestival === "all" || true;
    const matchesUrgency = selectedUrgency === "all" || rec.urgency === selectedUrgency;
    
    return matchesStatus && matchesMode && matchesFestival && matchesUrgency;
  });

  const handleStatusChange = (id: string, newStatus: Recommendation["status"]) => {
    if (newStatus === "accepted") acceptMutation.mutate(id);
    if (newStatus === "rejected") rejectMutation.mutate(id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            AI-Generated Capacity Recommendations
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Actionable insights for optimizing transport capacity during peak periods
          </p>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="under-review">Under Review</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedUrgency} onValueChange={setSelectedUrgency}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Urgency</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedMode} onValueChange={setSelectedMode}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modes</SelectItem>
                <SelectItem value="train">Train</SelectItem>
                <SelectItem value="bus">Bus</SelectItem>
                <SelectItem value="flight">Flight</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedFestival} onValueChange={setSelectedFestival}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Festival" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Festivals</SelectItem>
                <SelectItem value="diwali">Diwali</SelectItem>
                <SelectItem value="kumbh">Kumbh Mela</SelectItem>
                <SelectItem value="durga">Durga Puja</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Lightbulb className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{kpis.total}</div>
                <div className="text-sm text-muted-foreground">Total Recommendations</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {kpis.accepted}
                </div>
                <div className="text-sm text-muted-foreground">Accepted</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-8 w-8 text-amber-500" />
              <div>
                <div className="text-2xl font-bold text-amber-600">
                  {kpis.underReview}
                </div>
                <div className="text-sm text-muted-foreground">Under Review</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-8 w-8 text-purple-500" />
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {kpis.passengersRelieved.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Passengers Relieved</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecommendations.map((recommendation) => (
          <Card key={recommendation.id} className={`border-2 ${getStatusColor(recommendation.status)}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="font-semibold">{recommendation.corridor}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    {new Date(recommendation.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getUrgencyColor(recommendation.urgency)}>
                    {recommendation.urgency}
                  </Badge>
                  {getStatusIcon(recommendation.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Recommendation Text */}
              <div>
                <p className="text-sm font-medium mb-2">Recommendation:</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {recommendation.recommendation}
                </p>
              </div>

              {/* Confidence Score */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Confidence Score</span>
                  <span className="text-sm font-bold">{recommendation.confidence}%</span>
                </div>
                <Progress value={recommendation.confidence} className="h-2" />
              </div>

              {/* Impact Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {recommendation.passengersRelieved}
                  </div>
                  <div className="text-xs text-muted-foreground">Passengers Relieved</div>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 text-xs font-bold">AI</span>
                  </div>
                  <div className="text-xs text-muted-foreground">AI Generated</div>
                </div>
              </div>

              {/* Ministry Assignment */}
              <div className="flex items-center gap-2 text-sm">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Assigned to:</span>
                <span className="font-medium">{recommendation.ministry}</span>
              </div>

              {/* Status Actions */}
              {recommendation.status === "under-review" && (
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => handleStatusChange(recommendation.id, "accepted")}
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleStatusChange(recommendation.id, "rejected")}
                  >
                    Reject
                  </Button>
                </div>
              )}

              {recommendation.status === "accepted" && (
                <div className="text-center pt-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Implementation in Progress
                  </Badge>
                </div>
              )}

              {recommendation.status === "rejected" && (
                <div className="text-center pt-2">
                  <Badge variant="secondary" className="bg-red-100 text-red-800">
                    Rejected - Review Required
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredRecommendations.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No recommendations found</h3>
            <p className="text-muted-foreground">
              Try adjusting the filters to see more recommendations.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CapacityRecommendationCards;
