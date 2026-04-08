import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Copy, Check, Code, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ApiSandboxProps {}

const ApiSandbox = ({}: ApiSandboxProps) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState("forecast");
  const [parameters, setParameters] = useState<Record<string, string>>({
    origin: "Mumbai",
    destination: "Delhi",
    date: "2024-11-15",
    transport_mode: "train",
    days: "7"
  });
  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [copiedResponse, setCopiedResponse] = useState(false);

  const endpoints = [
    {
      id: "forecast",
      name: "Demand Forecast",
      method: "GET",
      url: "/api/v1/forecast/demand",
      description: "Get AI-powered demand forecast",
      parameters: [
        { name: "origin", type: "string", required: true, description: "Origin city" },
        { name: "destination", type: "string", required: true, description: "Destination city" },
        { name: "date", type: "string", required: true, description: "Travel date (YYYY-MM-DD)" },
        { name: "transport_mode", type: "string", required: false, description: "Transport mode" },
        { name: "days", type: "integer", required: false, description: "Forecast horizon" }
      ]
    },
    {
      id: "risk",
      name: "Risk Score",
      method: "GET",
      url: "/api/v1/risk/score",
      description: "Calculate real-time risk score",
      parameters: [
        { name: "origin", type: "string", required: true, description: "Origin city" },
        { name: "destination", type: "string", required: true, description: "Destination city" },
        { name: "date", type: "string", required: true, description: "Travel date" },
        { name: "include_factors", type: "boolean", required: false, description: "Include factors" }
      ]
    },
    {
      id: "advisories",
      name: "Active Advisories",
      method: "GET",
      url: "/api/v1/advisories/active",
      description: "Get active travel advisories",
      parameters: [
        { name: "festival", type: "string", required: false, description: "Filter by festival" },
        { name: "severity", type: "string", required: false, description: "Severity level" },
        { name: "limit", type: "integer", required: false, description: "Number of results" }
      ]
    },
    {
      id: "fare",
      name: "Fare Watch",
      method: "GET",
      url: "/api/v1/fare/watch",
      description: "Monitor current fares",
      parameters: [
        { name: "origin", type: "string", required: true, description: "Origin city" },
        { name: "destination", type: "string", required: true, description: "Destination city" },
        { name: "transport_mode", type: "string", required: false, description: "Transport mode" }
      ]
    }
  ];

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET": return "bg-green-100 text-green-800";
      case "POST": return "bg-blue-100 text-blue-800";
      case "PUT": return "bg-amber-100 text-amber-800";
      case "DELETE": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const generateMockResponse = (endpointId: string) => {
    const startTime = Date.now();
    
    setTimeout(() => {
      let mockResponse;
      let mockStatusCode = 200;

      switch (endpointId) {
        case "forecast":
          mockResponse = {
            status: "success",
            data: {
              route: `${parameters.origin}-${parameters.destination}`,
              forecast: Array.from({ length: parseInt(parameters.days) || 7 }, (_, i) => ({
                date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                demand: Math.floor(Math.random() * 30000) + 70000,
                confidence: Math.floor(Math.random() * 20) + 80,
                risk_level: Math.random() > 0.5 ? "HIGH" : "MODERATE"
              })),
              summary: {
                peak_demand: Math.floor(Math.random() * 30000) + 80000,
                average_demand: Math.floor(Math.random() * 20000) + 70000,
                trend: Math.random() > 0.5 ? "increasing" : "stable"
              }
            }
          };
          break;
          
        case "risk":
          mockResponse = {
            status: "success",
            data: {
              route: `${parameters.origin}-${parameters.destination}`,
              overall_score: Math.floor(Math.random() * 30) + 70,
              risk_level: Math.random() > 0.6 ? "HIGH" : Math.random() > 0.3 ? "MODERATE" : "LOW",
              factors: {
                demand_pressure: Math.floor(Math.random() * 30) + 70,
                weather_risk: Math.floor(Math.random() * 40),
                festival_impact: Math.floor(Math.random() * 30) + 70,
                historical_patterns: Math.floor(Math.random() * 20) + 80
              },
              recommendations: [
                "Book 3 weeks in advance",
                "Consider alternative routes",
                "Travel during off-peak hours"
              ]
            }
          };
          break;
          
        case "advisories":
          mockResponse = {
            status: "success",
            data: {
              advisories: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, i) => ({
                id: `ADV-${String(i + 1).padStart(3, '0')}`,
                title: `${["Critical", "High", "Medium"][Math.floor(Math.random() * 3)]}: ${parameters.origin}-${parameters.destination} advisory`,
                severity: ["critical", "high", "medium", "low"][Math.floor(Math.random() * 4)],
                festival: "Diwali",
                corridor: `${parameters.origin}-${parameters.destination}`,
                issued_date: new Date().toISOString(),
                summary: "Sample advisory text for demonstration purposes..."
              })),
              total: Math.floor(Math.random() * 20) + 5,
              filtered: Math.floor(Math.random() * 5) + 1
            }
          };
          break;
          
        case "fare":
          mockResponse = {
            status: "success",
            data: {
              route: `${parameters.origin}-${parameters.destination}`,
              current_fares: Array.from({ length: Math.floor(Math.random() * 3) + 2 }, (_, i) => ({
                operator: `Operator ${i + 1}`,
                mode: parameters.transport_mode || "train",
                current_fare: Math.floor(Math.random() * 5000) + 2000,
                baseline_fare: Math.floor(Math.random() * 2000) + 1000,
                multiplier: (Math.random() * 3 + 1).toFixed(1),
                last_updated: new Date().toISOString(),
                is_violation: Math.random() > 0.6
              })),
              pricing_ceiling: Math.floor(Math.random() * 3000) + 4000,
              violations_count: Math.floor(Math.random() * 3)
            }
          };
          break;
          
        default:
          mockResponse = { error: "Unknown endpoint" };
          mockStatusCode = 404;
      }

      const endTime = Date.now();
      setResponseTime(endTime - startTime);
      setResponse(mockResponse);
      setStatusCode(mockStatusCode);
      setIsLoading(false);
    }, 1500 + Math.random() * 1000); // Simulate network delay
  };

  const handleSendRequest = () => {
    setIsLoading(true);
    setResponse(null);
    setResponseTime(null);
    setStatusCode(null);
    
    generateMockResponse(selectedEndpoint);
  };

  const handleParameterChange = (name: string, value: string) => {
    setParameters(prev => ({ ...prev, [name]: value }));
  };

  const copyResponseToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(response, null, 2));
      setCopiedResponse(true);
      toast.success("Response copied to clipboard!");
      setTimeout(() => setCopiedResponse(false), 2000);
    } catch (err) {
      toast.error("Failed to copy response");
    }
  };

  const currentEndpoint = endpoints.find(ep => ep.id === selectedEndpoint)!;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5 text-green-500" />
            API Sandbox
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Test API endpoints directly in your browser with live request/response
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Panel */}
        <div className="space-y-4">
          {/* Endpoint Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Request Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Endpoint</Label>
                <Select value={selectedEndpoint} onValueChange={setSelectedEndpoint}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {endpoints.map((endpoint) => (
                      <SelectItem key={endpoint.id} value={endpoint.id}>
                        <div className="flex items-center gap-2">
                          <Badge className={getMethodColor(endpoint.method)}>
                            {endpoint.method}
                          </Badge>
                          {endpoint.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-muted p-3 rounded-lg">
                <div className="font-mono text-sm">
                  <Badge className={getMethodColor(currentEndpoint.method)}>
                    {currentEndpoint.method}
                  </Badge>
                  <span className="ml-2">https://api.transitsense.in{currentEndpoint.url}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {currentEndpoint.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Parameters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentEndpoint.parameters.map((param) => (
                <div key={param.name}>
                  <Label htmlFor={param.name}>
                    {param.name}
                    {param.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  {param.type === "boolean" ? (
                    <Select
                      value={parameters[param.name] || "false"}
                      onValueChange={(value) => handleParameterChange(param.name, value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">true</SelectItem>
                        <SelectItem value="false">false</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id={param.name}
                      type={param.type === "integer" ? "number" : "text"}
                      value={parameters[param.name] || ""}
                      onChange={(e) => handleParameterChange(param.name, e.target.value)}
                      placeholder={param.description}
                    />
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {param.description}
                  </p>
                </div>
              ))}

              <Button 
                onClick={handleSendRequest} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending Request...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Send Request
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Response Panel */}
        <div className="space-y-4">
          {/* Response Status */}
          {statusCode && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={statusCode >= 200 && statusCode < 300 ? "default" : "destructive"}
                      className="text-sm"
                    >
                      {statusCode}
                    </Badge>
                    <span className="text-sm font-medium">
                      {statusCode >= 200 && statusCode < 300 ? "Success" : "Error"}
                    </span>
                  </div>
                  {responseTime && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      {responseTime}ms
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Response Body */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Response</CardTitle>
                {response && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyResponseToClipboard}
                  >
                    {copiedResponse ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : response ? (
                <div className="bg-muted rounded-lg p-4">
                  <pre className="text-sm overflow-x-auto max-h-96">
                    <code>{JSON.stringify(response, null, 2)}</code>
                  </pre>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                  <p>Send a request to see the response</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Request Info */}
          {response && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Code className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <div className="font-semibold mb-1">Request Details</div>
                    <div className="space-y-1 text-blue-700 font-mono text-xs">
                      <div>Method: {currentEndpoint.method}</div>
                      <div>URL: https://api.transitsense.in{currentEndpoint.url}</div>
                      <div>Headers: Authorization: Bearer ••••••••••••••••</div>
                      <div>Response Time: {responseTime}ms</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiSandbox;
