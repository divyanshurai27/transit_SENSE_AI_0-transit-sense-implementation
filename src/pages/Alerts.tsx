import { useState, useEffect } from "react";
import ActiveAdvisoryList from "@/components/alerts/ActiveAdvisoryList";
import SubscriptionManager from "@/components/alerts/SubscriptionManager";
import AdvisoryArchive from "@/components/alerts/AdvisoryArchive";
import Navigation from "@/components/layout/Navigation";
import { usePageTitle } from "@/hooks/usePageTitle";

const Alerts = () => {
  // Set page title using custom hook
  usePageTitle('TransitSense - Travel Alerts');
  
  const [activeTab, setActiveTab] = useState("active");

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Notifications & Alerts Center</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay informed with real-time travel advisories and manage your alert preferences
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center">
          <div className="inline-flex rounded-lg border bg-background p-1">
            <button
              onClick={() => setActiveTab("active")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "active"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Active Advisories
            </button>
            <button
              onClick={() => setActiveTab("subscriptions")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "subscriptions"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              My Subscriptions
            </button>
            <button
              onClick={() => setActiveTab("archive")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "archive"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Advisory Archive
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === "active" && <ActiveAdvisoryList />}
          {activeTab === "subscriptions" && <SubscriptionManager />}
          {activeTab === "archive" && <AdvisoryArchive />}
        </div>
      </div>
    </div>
  );
};

export default Alerts;
