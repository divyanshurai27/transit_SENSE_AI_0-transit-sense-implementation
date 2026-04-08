import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bell, Mail, Phone, MessageSquare, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface TripAlertSignupProps {
  prefillRoute: {
    origin: string;
    destination: string;
  };
  onSubscribe: (data: {
    route: { origin: string; destination: string };
    contact: { email?: string; phone?: string };
    alertTypes: string[];
  }) => void;
}

const TripAlertSignup = ({ prefillRoute, onSubscribe }: TripAlertSignupProps) => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [alertTypes, setAlertTypes] = useState<string[]>(["surge-warning"]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const alertTypeOptions = [
    { 
      id: "surge-warning", 
      label: "Surge Warning", 
      description: "Get notified when crowd levels spike",
      icon: Bell,
      color: "text-red-600"
    },
    { 
      id: "capacity-added", 
      label: "Capacity Added", 
      description: "New trains/buses added to your route",
      icon: MessageSquare,
      color: "text-green-600"
    },
    { 
      id: "fare-drop", 
      label: "Fare Drop", 
      description: "Price reductions on your preferred route",
      icon: Mail,
      color: "text-blue-600"
    },
    { 
      id: "advisory-issued", 
      label: "Advisory Issued", 
      description: "Official travel advisories and restrictions",
      icon: Phone,
      color: "text-amber-600"
    },
  ];

  const handleAlertTypeChange = (typeId: string, checked: boolean) => {
    if (checked) {
      setAlertTypes(prev => [...prev, typeId]);
    } else {
      setAlertTypes(prev => prev.filter(id => id !== typeId));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email && !phone) {
      toast.error("Please provide either email or phone number");
      return;
    }

    if (alertTypes.length === 0) {
      toast.error("Please select at least one alert type");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const subscriptionData = {
        route: prefillRoute,
        contact: {
          ...(email && { email }),
          ...(phone && { phone })
        },
        alertTypes
      };

      onSubscribe(subscriptionData);
      setIsSubscribed(true);
      toast.success("Alert subscription created successfully!");
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail("");
        setPhone("");
        setAlertTypes(["surge-warning"]);
      }, 3000);
      
    } catch (error) {
      toast.error("Failed to create subscription. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubscribed) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-800 mb-2">Alerts Activated!</h3>
          <p className="text-green-700 mb-4">
            You'll receive notifications for {prefillRoute.origin} → {prefillRoute.destination}
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {alertTypes.map(type => {
              const option = alertTypeOptions.find(opt => opt.id === type);
              return (
                <Badge key={type} variant="secondary" className="bg-green-100 text-green-800">
                  {option?.label}
                </Badge>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-blue-500" />
          Trip Alert Signup
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Get real-time updates for your journey
        </p>
      </CardHeader>
      <CardContent>
        {/* Route Summary */}
        <div className="bg-blue-50 rounded-lg p-3 mb-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-blue-800">Monitoring Route</div>
              <div className="text-lg font-semibold text-blue-900">
                {prefillRoute.origin} → {prefillRoute.destination}
              </div>
            </div>
            <Badge variant="outline" className="bg-blue-100 text-blue-800">
              Active
            </Badge>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Contact Information</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Provide at least one contact method to receive alerts
            </p>
          </div>

          <Separator />

          {/* Alert Types */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Alert Types</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {alertTypeOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <div key={option.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <Checkbox
                      id={option.id}
                      checked={alertTypes.includes(option.id)}
                      onCheckedChange={(checked) => 
                        handleAlertTypeChange(option.id, checked as boolean)
                      }
                    />
                    <div className="flex-1 space-y-1">
                      <Label htmlFor={option.id} className="flex items-center gap-2 font-medium cursor-pointer">
                        <Icon className={`h-4 w-4 ${option.color}`} />
                        {option.label}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting || (!email && !phone) || alertTypes.length === 0}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Subscription...
              </>
            ) : (
              <>
                <Bell className="h-4 w-4 mr-2" />
                Notify Me
              </>
            )}
          </Button>
        </form>

        {/* Privacy Note */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
          <p className="text-xs text-muted-foreground">
            <strong>Privacy:</strong> We'll only send you relevant travel alerts. You can unsubscribe anytime. 
            Message and data rates may apply for SMS notifications.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TripAlertSignup;
