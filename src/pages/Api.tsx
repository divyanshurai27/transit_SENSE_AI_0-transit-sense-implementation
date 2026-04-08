import { useState, useEffect } from "react";
import ApiEndpointDocs from "@/components/api/ApiEndpointDocs";
import ApiSandbox from "@/components/api/ApiSandbox";
import AccessTierCards from "@/components/api/AccessTierCards";
import Navigation from "@/components/layout/Navigation";
import { usePageTitle } from "@/hooks/usePageTitle";

const Api = () => {
  // Set page title using custom hook
  usePageTitle('TransitSense - API Documentation');
  
  const [activeTab, setActiveTab] = useState("docs");

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Integration Hub</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Developer-facing REST API reference and live testing tools for TransitSense
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center">
          <div className="inline-flex rounded-lg border bg-background p-1">
            <button
              onClick={() => setActiveTab("docs")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "docs"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              API Documentation
            </button>
            <button
              onClick={() => setActiveTab("sandbox")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "sandbox"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              API Sandbox
            </button>
            <button
              onClick={() => setActiveTab("access")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "access"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Access Tiers
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === "docs" && <ApiEndpointDocs />}
          {activeTab === "sandbox" && <ApiSandbox />}
          {activeTab === "access" && <AccessTierCards />}
        </div>
      </div>
    </div>
  );
};

export default Api;
