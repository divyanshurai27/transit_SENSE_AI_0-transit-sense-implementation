import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Bell, Mail, Phone, MessageSquare, Settings, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";

interface Subscription {
  id: string;
  route: {
    origin: string;
    destination: string;
  };
  alertTypes: {
    surge: boolean;
    capacity: boolean;
    fareDrop: boolean;
    advisory: boolean;
  };
  channels: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  isActive: boolean;
  createdDate: Date;
}

interface SubscriptionManagerProps {}

const SubscriptionManager = ({}: SubscriptionManagerProps) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(getInitialSubscriptions());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [newRoute, setNewRoute] = useState({ origin: "", destination: "" });

  function getInitialSubscriptions(): Subscription[] {
    return [
      {
        id: "1",
        route: { origin: "Mumbai", destination: "Delhi" },
        alertTypes: { surge: true, capacity: true, fareDrop: false, advisory: true },
        channels: { email: true, sms: true, push: false },
        isActive: true,
        createdDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) // 7 days ago
      },
      {
        id: "2",
        route: { origin: "Kolkata", destination: "Chennai" },
        alertTypes: { surge: true, capacity: false, fareDrop: true, advisory: true },
        channels: { email: true, sms: false, push: true },
        isActive: true,
        createdDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14) // 14 days ago
      },
      {
        id: "3",
        route: { origin: "Bangalore", destination: "Hyderabad" },
        alertTypes: { surge: false, capacity: true, fareDrop: true, advisory: false },
        channels: { email: false, sms: true, push: true },
        isActive: false,
        createdDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30) // 30 days ago
      },
    ];
  }

  const cities = [
    "Mumbai", "Delhi", "Bangalore", "Kolkata", "Chennai", "Hyderabad",
    "Pune", "Ahmedabad", "Jaipur", "Lucknow", "Kanpur", "Nagpur"
  ];

  const handleToggleSubscription = (id: string) => {
    setSubscriptions(prev => 
      prev.map(sub => 
        sub.id === id ? { ...sub, isActive: !sub.isActive } : sub
      )
    );
    toast.success("Subscription status updated");
  };

  const handleUpdateAlertTypes = (id: string, alertType: keyof Subscription['alertTypes']) => {
    setSubscriptions(prev => 
      prev.map(sub => 
        sub.id === id 
          ? { ...sub, alertTypes: { ...sub.alertTypes, [alertType]: !sub.alertTypes[alertType] } }
          : sub
      )
    );
  };

  const handleUpdateChannels = (id: string, channel: keyof Subscription['channels']) => {
    setSubscriptions(prev => 
      prev.map(sub => 
        sub.id === id 
          ? { ...sub, channels: { ...sub.channels, [channel]: !sub.channels[channel] } }
          : sub
      )
    );
  };

  const handleDeleteSubscription = (id: string) => {
    setSubscriptions(prev => prev.filter(sub => sub.id !== id));
    toast.success("Subscription deleted");
  };

  const handleAddSubscription = () => {
    if (!newRoute.origin || !newRoute.destination) {
      toast.error("Please select both origin and destination");
      return;
    }

    const newSubscription: Subscription = {
      id: Date.now().toString(),
      route: { origin: newRoute.origin, destination: newRoute.destination },
      alertTypes: { surge: true, capacity: true, fareDrop: false, advisory: true },
      channels: { email: true, sms: false, push: true },
      isActive: true,
      createdDate: new Date()
    };

    setSubscriptions(prev => [...prev, newSubscription]);
    setNewRoute({ origin: "", destination: "" });
    setIsAddDialogOpen(false);
    toast.success("Subscription added successfully");
  };

  const activeSubscriptions = subscriptions.filter(sub => sub.isActive).length;
  const totalAlertsPerMonth = subscriptions.reduce((sum, sub) => {
    if (!sub.isActive) return sum;
    const alertCount = Object.values(sub.alertTypes).filter(Boolean).length;
    return sum + alertCount * 4; // Assuming ~4 alerts per month per type
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-500" />
                My Alert Subscriptions
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Manage which routes and alert types you want to receive notifications for
              </p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Route
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Route Subscription</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Origin City</Label>
                      <Select value={newRoute.origin} onValueChange={(value) => setNewRoute(prev => ({ ...prev, origin: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select origin" />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Destination City</Label>
                      <Select value={newRoute.destination} onValueChange={(value) => setNewRoute(prev => ({ ...prev, destination: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select destination" />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddSubscription}>
                      Add Subscription
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{activeSubscriptions}</div>
              <div className="text-sm text-muted-foreground">Active Subscriptions</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{subscriptions.length}</div>
              <div className="text-sm text-muted-foreground">Total Routes</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-amber-600">~{totalAlertsPerMonth}</div>
              <div className="text-sm text-muted-foreground">Alerts/Month (est.)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Channels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-purple-500" />
            Notification Channels
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-sm text-muted-foreground">user@email.com</div>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-green-500" />
                <div>
                  <div className="font-medium">SMS</div>
                  <div className="text-sm text-muted-foreground">+91 98765 43210</div>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-purple-500" />
                <div>
                  <div className="font-medium">Push Notifications</div>
                  <div className="text-sm text-muted-foreground">Mobile app</div>
                </div>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions List */}
      <div className="space-y-4">
        {subscriptions.map((subscription) => (
          <Card key={subscription.id} className={!subscription.isActive ? "opacity-60" : ""}>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-lg font-semibold">
                      {subscription.route.origin} → {subscription.route.destination}
                    </div>
                    <Badge variant={subscription.isActive ? "default" : "secondary"}>
                      {subscription.isActive ? "Active" : "Paused"}
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      Added {subscription.createdDate.toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={subscription.isActive}
                      onCheckedChange={() => handleToggleSubscription(subscription.id)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingSubscription(subscription)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSubscription(subscription.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Alert Types */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Alert Types</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(subscription.alertTypes).map(([type, enabled]) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Switch
                          checked={enabled}
                          onCheckedChange={() => handleUpdateAlertTypes(subscription.id, type as keyof Subscription['alertTypes'])}
                          disabled={!subscription.isActive}
                        />
                        <Label className="text-sm capitalize">
                          {type === "surge" ? "Surge Warning" :
                           type === "capacity" ? "Capacity Added" :
                           type === "fareDrop" ? "Fare Drop" :
                           "Advisory Issued"}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notification Channels */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Delivery Channels</Label>
                  <div className="flex gap-4">
                    {Object.entries(subscription.channels).map(([channel, enabled]) => (
                      <div key={channel} className="flex items-center space-x-2">
                        <Switch
                          checked={enabled}
                          onCheckedChange={() => handleUpdateChannels(subscription.id, channel as keyof Subscription['channels'])}
                          disabled={!subscription.isActive}
                        />
                        <Label className="text-sm capitalize flex items-center gap-1">
                          {channel === "email" && <Mail className="h-3 w-3" />}
                          {channel === "sms" && <Phone className="h-3 w-3" />}
                          {channel === "push" && <MessageSquare className="h-3 w-3" />}
                          {channel}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {subscriptions.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No subscriptions yet</h3>
            <p className="text-muted-foreground mb-4">
              Add route subscriptions to stay updated on travel alerts and advisories.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Route
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Save Preferences Button */}
      <div className="flex justify-center">
        <Button size="lg" className="px-8">
          Save All Preferences
        </Button>
      </div>
    </div>
  );
};

export default SubscriptionManager;
