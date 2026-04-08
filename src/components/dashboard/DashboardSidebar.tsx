import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart3, 
  Grid3X3, 
  Lightbulb, 
  Monitor, 
  Shield, 
  TrendingUp,
  Menu,
  X,
  LogOut,
  User
} from "lucide-react";

interface DashboardSidebarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  user: {
    name: string;
    role: string;
  };
}

const DashboardSidebar = ({ activeSection, onNavigate, user }: DashboardSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigationItems = [
    {
      id: "demand-forecast",
      label: "Demand Forecast",
      icon: BarChart3,
      description: "4-8 week rolling forecasts"
    },
    {
      id: "risk-matrix",
      label: "Risk Matrix",
      icon: Grid3X3,
      description: "Corridor risk rankings"
    },
    {
      id: "capacity-recs",
      label: "Capacity Recs",
      icon: Lightbulb,
      description: "AI-generated recommendations"
    },
    {
      id: "terminal-density",
      label: "Terminal Density",
      icon: Monitor,
      description: "Real-time crowd monitoring"
    },
    {
      id: "surge-oversight",
      label: "Surge Oversight",
      icon: Shield,
      description: "Pricing violation monitoring"
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: TrendingUp,
      description: "Historical analysis & reports"
    },
  ];

  return (
    <div className={`bg-card border-r transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">TS</span>
                </div>
                <div>
                  <div className="font-semibold text-sm">TransitSense</div>
                  <div className="text-xs text-muted-foreground">Authority Portal</div>
                </div>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8"
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start ${isCollapsed ? 'px-2' : 'px-3'} ${
                isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
              }`}
              onClick={() => onNavigate(item.id)}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && (
                <div className="ml-3 text-left">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs opacity-70">{item.description}</div>
                </div>
              )}
            </Button>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t space-y-3">
        {!isCollapsed && (
          <>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{user.name}</div>
                <div className="text-xs text-muted-foreground truncate">{user.role}</div>
              </div>
            </div>
            <Separator />
          </>
        )}
        
        <Button
          variant="ghost"
          className={`w-full justify-start ${isCollapsed ? 'px-2' : 'px-3'}`}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span className="ml-3">Logout</span>}
        </Button>
      </div>

      {/* Status Badge */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          {!isCollapsed && (
            <Badge variant="secondary" className="text-xs">
              Live Data
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
