import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Star, Shield, Briefcase, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface AccessTier {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  price: string;
  rateLimit: string;
  features: string[];
  limitations: string[];
  endpoints: string[];
  recommendedFor: string;
  popular?: boolean;
}

interface AccessTierCardsProps {}

const AccessTierCards = ({}: AccessTierCardsProps) => {
  const tiers: AccessTier[] = [
    {
      id: "government",
      name: "Government Authority",
      description: "Full access for transport ministries and regulatory bodies",
      icon: Shield,
      color: "text-blue-600",
      price: "Free",
      rateLimit: "Unlimited",
      features: [
        "All API endpoints",
        "Real-time data access",
        "Priority support",
        "Custom integrations",
        "Advanced analytics",
        "Bulk data exports",
        "Dedicated account manager",
        "SLA guarantees"
      ],
      limitations: [],
      endpoints: ["All endpoints"],
      recommendedFor: "Transport ministries, regulatory authorities, disaster management agencies"
    },
    {
      id: "research",
      name: "Research Institution",
      description: "Comprehensive access for academic and research organizations",
      icon: Star,
      color: "text-purple-600",
      price: "Free",
      rateLimit: "10,000 requests/hour",
      features: [
        "Forecast & risk endpoints",
        "Historical data access",
        "Academic support",
        "Data visualization tools",
        "Research collaboration",
        "Publication rights",
        "Conference presentations"
      ],
      limitations: [
        "No real-time fare data",
        "Commercial use prohibited",
        "Data attribution required"
      ],
      endpoints: ["Forecast", "Risk Score", "Advisories", "Historical Analytics"],
      recommendedFor: "Universities, research institutions, think tanks, PhD students"
    },
    {
      id: "commercial",
      name: "Commercial Enterprise",
      description: "Premium access for businesses and commercial applications",
      icon: Briefcase,
      color: "text-green-600",
      price: "Contact Sales",
      rateLimit: "Custom",
      features: [
        "All API endpoints",
        "White-label solutions",
        "Custom branding",
        "Revenue sharing options",
        "Premium support",
        "API customization",
        "Multi-tenant access",
        "Compliance certifications"
      ],
      limitations: [
        "Commercial licensing required",
        "Usage-based pricing",
        "Minimum commitment"
      ],
      endpoints: ["All endpoints + Custom"],
      recommendedFor: "Travel companies, OTAs, logistics firms, fintech startups"
    }
  ];

  const handleRequestAccess = (tierId: string) => {
    toast.success(`Access request initiated for ${tiers.find(t => t.id === tierId)?.name}`);
    // In real implementation, this would open a form or redirect to application page
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">API Access Tiers</CardTitle>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose the right access level for your organization. Each tier is designed to meet specific use cases and requirements.
          </p>
        </CardHeader>
      </Card>

      {/* Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Feature</th>
                  <th className="text-center py-3 px-4">
                    <div className="flex flex-col items-center">
                      <Shield className="h-5 w-5 text-blue-600 mb-1" />
                      <span className="font-medium">Government</span>
                    </div>
                  </th>
                  <th className="text-center py-3 px-4">
                    <div className="flex flex-col items-center">
                      <Star className="h-5 w-5 text-purple-600 mb-1" />
                      <span className="font-medium">Research</span>
                    </div>
                  </th>
                  <th className="text-center py-3 px-4">
                    <div className="flex flex-col items-center">
                      <Briefcase className="h-5 w-5 text-green-600 mb-1" />
                      <span className="font-medium">Commercial</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Price</td>
                  <td className="text-center py-3 px-4">Free</td>
                  <td className="text-center py-3 px-4">Free</td>
                  <td className="text-center py-3 px-4">Contact Sales</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Rate Limit</td>
                  <td className="text-center py-3 px-4">Unlimited</td>
                  <td className="text-center py-3 px-4">10,000/hour</td>
                  <td className="text-center py-3 px-4">Custom</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Real-time Data</td>
                  <td className="text-center py-3 px-4">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Historical Data</td>
                  <td className="text-center py-3 px-4">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Fare Data</td>
                  <td className="text-center py-3 px-4">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <X className="h-5 w-5 text-red-500 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Commercial Use</td>
                  <td className="text-center py-3 px-4">
                    <X className="h-5 w-5 text-red-500 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <X className="h-5 w-5 text-red-500 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Support Level</td>
                  <td className="text-center py-3 px-4">Priority</td>
                  <td className="text-center py-3 px-4">Academic</td>
                  <td className="text-center py-3 px-4">Premium</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((tier) => {
          const Icon = tier.icon;
          return (
            <Card 
              key={tier.id} 
              className={`relative ${tier.popular ? 'border-2 border-primary' : ''}`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
                  <Icon className={`h-6 w-6 ${tier.color}`} />
                </div>
                <CardTitle className="text-xl">{tier.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  {tier.description}
                </p>
                <div className="mt-4">
                  <div className="text-3xl font-bold">{tier.price}</div>
                  <div className="text-sm text-muted-foreground">{tier.rateLimit}</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Features */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Included Features
                  </h4>
                  <ul className="space-y-2">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Limitations */}
                {tier.limitations.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <X className="h-4 w-4 text-red-500" />
                      Limitations
                    </h4>
                    <ul className="space-y-2">
                      {tier.limitations.map((limitation, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <X className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span>{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Available Endpoints */}
                <div>
                  <h4 className="font-semibold mb-3">Available Endpoints</h4>
                  <div className="flex flex-wrap gap-1">
                    {tier.endpoints.map((endpoint, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {endpoint}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Recommended For */}
                <div className="bg-muted rounded-lg p-3">
                  <h4 className="font-semibold text-sm mb-1">Recommended For</h4>
                  <p className="text-xs text-muted-foreground">
                    {tier.recommendedFor}
                  </p>
                </div>

                {/* CTA Button */}
                <Button 
                  className="w-full" 
                  onClick={() => handleRequestAccess(tier.id)}
                  variant={tier.id === "commercial" ? "default" : "outline"}
                >
                  {tier.id === "commercial" ? "Contact Sales" : "Request Access"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Information */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-blue-900">
              Not sure which tier is right for you?
            </h3>
            <p className="text-blue-700 max-w-2xl mx-auto">
              Our team can help you choose the perfect access tier based on your specific requirements, 
              expected usage, and organizational needs.
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline">
                Schedule Consultation
              </Button>
              <Button>
                View Documentation
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-b pb-4">
            <h4 className="font-semibold mb-2">How long does access approval take?</h4>
            <p className="text-sm text-muted-foreground">
              Government and research applications are typically approved within 2-3 business days. 
              Commercial access may take 5-7 business days depending on requirements.
            </p>
          </div>
          <div className="border-b pb-4">
            <h4 className="font-semibold mb-2">Can I change my access tier later?</h4>
            <p className="text-sm text-muted-foreground">
              Yes, you can upgrade or downgrade your access tier at any time. Changes take effect at the start of the next billing cycle.
            </p>
          </div>
          <div className="border-b pb-4">
            <h4 className="font-semibold mb-2">Is there a free trial available?</h4>
            <p className="text-sm text-muted-foreground">
              Government and research tiers are completely free. Commercial tier includes a 30-day free trial with full feature access.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">What kind of support is provided?</h4>
            <p className="text-sm text-muted-foreground">
              All tiers include email support. Government gets priority 24/7 support, research gets academic support during business hours, 
              and commercial gets dedicated account management with SLA guarantees.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessTierCards;
