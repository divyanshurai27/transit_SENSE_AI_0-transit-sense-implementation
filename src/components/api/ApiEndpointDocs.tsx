import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Copy, Check, Database, AlertTriangle, TrendingUp, Bell } from "lucide-react";
import { toast } from "sonner";

interface Endpoint {
  id: string;
  name: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  url: string;
  description: string;
  parameters: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
  }>;
  responseSchema: {
    status: string;
    data: any;
    message?: string;
  };
  category: "forecast" | "risk" | "advisories" | "fare";
}

interface ApiEndpointDocsProps {}

const ApiEndpointDocs = ({}: ApiEndpointDocsProps) => {
  const [selectedCategory, setSelectedCategory] = useState("forecast");
  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null);
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const endpoints: Endpoint[] = [
    {
      id: "1",
      name: "Demand Forecast",
      method: "GET",
      url: "/api/v1/forecast/demand",
      description: "Get AI-powered demand forecast for specific routes and dates",
      parameters: [
        { name: "origin", type: "string", required: true, description: "Origin city code" },
        { name: "destination", type: "string", required: true, description: "Destination city code" },
        { name: "date", type: "string", required: true, description: "Travel date (YYYY-MM-DD)" },
        { name: "transport_mode", type: "string", required: false, description: "train|bus|flight|all" },
        { name: "days", type: "integer", required: false, description: "Forecast horizon (1-30 days)" }
      ],
      responseSchema: {
        status: "success",
        data: {
          route: "Mumbai-Delhi",
          forecast: [
            { date: "2024-11-15", demand: 85000, confidence: 92, risk_level: "HIGH" },
            { date: "2024-11-16", demand: 82000, confidence: 89, risk_level: "HIGH" }
          ],
          summary: {
            peak_demand: 85000,
            average_demand: 78000,
            trend: "increasing"
          }
        }
      },
      category: "forecast"
    },
    {
      id: "2",
      name: "Risk Score",
      method: "GET",
      url: "/api/v1/risk/score",
      description: "Calculate real-time risk score for route based on multiple factors",
      parameters: [
        { name: "origin", type: "string", required: true, description: "Origin city code" },
        { name: "destination", type: "string", required: true, description: "Destination city code" },
        { name: "date", type: "string", required: true, description: "Travel date (YYYY-MM-DD)" },
        { name: "include_factors", type: "boolean", required: false, description: "Include detailed factor breakdown" }
      ],
      responseSchema: {
        status: "success",
        data: {
          route: "Mumbai-Delhi",
          overall_score: 87,
          risk_level: "HIGH",
          factors: {
            demand_pressure: 92,
            weather_risk: 15,
            festival_impact: 95,
            historical_patterns: 88
          },
          recommendations: [
            "Book 3 weeks in advance",
            "Consider alternative routes"
          ]
        }
      },
      category: "risk"
    },
    {
      id: "3",
      name: "Active Advisories",
      method: "GET",
      url: "/api/v1/advisories/active",
      description: "Retrieve all currently active travel advisories",
      parameters: [
        { name: "festival", type: "string", required: false, description: "Filter by festival name" },
        { name: "severity", type: "string", required: false, description: "critical|high|medium|low" },
        { name: "state", type: "string", required: false, description: "Filter by state" },
        { name: "limit", type: "integer", required: false, description: "Number of results (default: 50)" }
      ],
      responseSchema: {
        status: "success",
        data: {
          advisories: [
            {
              id: "ADV-001",
              title: "Critical: Mumbai-Delhi corridor at maximum capacity",
              severity: "critical",
              festival: "Diwali",
              corridor: "Mumbai-Delhi",
              issued_date: "2024-11-01T10:30:00Z",
              summary: "Unprecedented demand expected...",
              transport_modes: ["train", "flight"]
            }
          ],
          total: 15,
          filtered: 15
        }
      },
      category: "advisories"
    },
    {
      id: "4",
      name: "Fare Watch",
      method: "GET",
      url: "/api/v1/fare/watch",
      description: "Monitor current fares and detect price gouging",
      parameters: [
        { name: "origin", type: "string", required: true, description: "Origin city code" },
        { name: "destination", type: "string", required: true, description: "Destination city code" },
        { name: "transport_mode", type: "string", required: false, description: "train|bus|flight" },
        { name: "date", type: "string", required: false, description: "Travel date (YYYY-MM-DD)" }
      ],
      responseSchema: {
        status: "success",
        data: {
          route: "Mumbai-Delhi",
          current_fares: [
            {
              operator: "PrivateBusExpress",
              mode: "bus",
              current_fare: 8500,
              baseline_fare: 2500,
              multiplier: 3.4,
              last_updated: "2024-11-01T14:30:00Z",
              is_violation: true
            }
          ],
          pricing_ceiling: 7500,
          violations_count: 3
        }
      },
      category: "fare"
    },
    {
      id: "5",
      name: "Create Alert Subscription",
      method: "POST",
      url: "/api/v1/alerts/subscribe",
      description: "Subscribe to route-specific alerts",
      parameters: [
        { name: "route", type: "object", required: true, description: "Route object with origin and destination" },
        { name: "alert_types", type: "array", required: true, description: "Array of alert types: surge|capacity|fare_drop|advisory" },
        { name: "channels", type: "object", required: true, description: "Notification channels: email|sms|push" },
        { name: "contact_info", type: "object", required: true, description: "Contact information" }
      ],
      responseSchema: {
        status: "success",
        data: {
          subscription_id: "SUB-12345",
          route: "Mumbai-Delhi",
          created_at: "2024-11-01T15:00:00Z",
          status: "active"
        },
        message: "Subscription created successfully"
      },
      category: "advisories"
    }
  ];

  const categories = [
    { id: "forecast", name: "Forecast", icon: TrendingUp, color: "text-blue-500" },
    { id: "risk", name: "Risk Score", icon: AlertTriangle, color: "text-red-500" },
    { id: "advisories", name: "Advisories", icon: Bell, color: "text-amber-500" },
    { id: "fare", name: "Fare Watch", icon: Database, color: "text-green-500" }
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

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedEndpoint(type);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopiedEndpoint(null), 2000);
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const generateCodeSnippet = (endpoint: Endpoint, language: string) => {
    const baseUrl = "https://api.transitsense.in";
    const fullUrl = `${baseUrl}${endpoint.url}`;
    
    switch (language) {
      case "curl":
        return `curl -X ${endpoint.method} "${fullUrl}" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`;
      
      case "python":
        return `import requests

url = "${fullUrl}"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

response = requests.${endpoint.method.toLowerCase()}(url, headers=headers)
data = response.json()
print(data)`;
      
      case "javascript":
        return `const response = await fetch('${fullUrl}', {
  method: '${endpoint.method}',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);`;
      
      default:
        return "";
    }
  };

  const filteredEndpoints = endpoints.filter(ep => ep.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5 text-purple-500" />
            REST API Documentation
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Complete API reference with parameters, response schemas, and code examples
          </p>
        </CardHeader>
        <CardContent>
          {/* Authentication Info */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-xs font-bold">!</span>
              </div>
              <div className="text-sm text-blue-800">
                <div className="font-semibold mb-1">Authentication</div>
                <div className="text-blue-700 font-mono text-xs mb-2">
                  Authorization: Bearer YOUR_API_KEY
                </div>
                <div className="text-blue-700">
                  All API requests require authentication using a bearer token. Include your API key in the Authorization header.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Navigation */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2"
            >
              <Icon className={`h-4 w-4 ${category.color}`} />
              {category.name}
            </Button>
          );
        })}
      </div>

      {/* Endpoints List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Endpoints</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {filteredEndpoints.map((endpoint) => (
                  <button
                    key={endpoint.id}
                    onClick={() => setSelectedEndpoint(endpoint.id)}
                    className={`w-full text-left p-4 hover:bg-accent transition-colors border-b ${
                      selectedEndpoint === endpoint.id ? "bg-accent" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getMethodColor(endpoint.method)}>
                        {endpoint.method}
                      </Badge>
                      <span className="font-medium text-sm">{endpoint.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">
                      {endpoint.url}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          {selectedEndpoint ? (
            <Card>
              {filteredEndpoints
                .filter(ep => ep.id === selectedEndpoint)
                .map((endpoint) => (
                  <div key={endpoint.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge className={getMethodColor(endpoint.method)}>
                            {endpoint.method}
                          </Badge>
                          <CardTitle>{endpoint.name}</CardTitle>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(`https://api.transitsense.in${endpoint.url}`, "url")}
                        >
                          {copiedEndpoint === "url" ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div className="font-mono text-sm bg-muted p-2 rounded">
                          https://api.transitsense.in{endpoint.url}
                        </div>
                        <p className="text-muted-foreground">{endpoint.description}</p>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      {/* Parameters */}
                      <div>
                        <h4 className="font-semibold mb-3">Parameters</h4>
                        <div className="space-y-3">
                          {endpoint.parameters.map((param, index) => (
                            <div key={index} className="border rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <code className="text-sm bg-muted px-2 py-1 rounded">{param.name}</code>
                                <Badge variant="outline" className="text-xs">
                                  {param.type}
                                </Badge>
                                {param.required && (
                                  <Badge variant="destructive" className="text-xs">
                                    required
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{param.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Response Schema */}
                      <div>
                        <h4 className="font-semibold mb-3">Response Schema</h4>
                        <div className="bg-muted rounded-lg p-4">
                          <pre className="text-sm overflow-x-auto">
                            <code>{JSON.stringify(endpoint.responseSchema, null, 2)}</code>
                          </pre>
                        </div>
                      </div>

                      {/* Code Examples */}
                      <div>
                        <h4 className="font-semibold mb-3">Code Examples</h4>
                        <Tabs defaultValue="curl">
                          <TabsList>
                            <TabsTrigger value="curl">cURL</TabsTrigger>
                            <TabsTrigger value="python">Python</TabsTrigger>
                            <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                          </TabsList>
                          <TabsContent value="curl" className="mt-3">
                            <div className="relative">
                              <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
                                <code>{generateCodeSnippet(endpoint, "curl")}</code>
                              </pre>
                              <Button
                                variant="outline"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={() => copyToClipboard(generateCodeSnippet(endpoint, "curl"), "curl")}
                              >
                                {copiedEndpoint === "curl" ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </TabsContent>
                          <TabsContent value="python" className="mt-3">
                            <div className="relative">
                              <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
                                <code>{generateCodeSnippet(endpoint, "python")}</code>
                              </pre>
                              <Button
                                variant="outline"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={() => copyToClipboard(generateCodeSnippet(endpoint, "python"), "python")}
                              >
                                {copiedEndpoint === "python" ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </TabsContent>
                          <TabsContent value="javascript" className="mt-3">
                            <div className="relative">
                              <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
                                <code>{generateCodeSnippet(endpoint, "javascript")}</code>
                              </pre>
                              <Button
                                variant="outline"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={() => copyToClipboard(generateCodeSnippet(endpoint, "javascript"), "javascript")}
                              >
                                {copiedEndpoint === "javascript" ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
                    </CardContent>
                  </div>
                ))}
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select an Endpoint</h3>
                <p className="text-muted-foreground">
                  Choose an endpoint from the sidebar to view detailed documentation.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiEndpointDocs;
