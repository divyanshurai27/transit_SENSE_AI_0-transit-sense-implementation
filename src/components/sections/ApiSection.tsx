import { Code, Plug, Play, Lock } from "lucide-react";

const tiers = [
  {
    name: "Government Authority",
    access: "Full Access",
    description: "Complete API access for Ministry, Railways, and STU integrations.",
    highlight: true,
  },
  {
    name: "Research & Academic",
    access: "Read-Only",
    description: "Access to forecast data and historical datasets for research purposes.",
    highlight: false,
  },
  {
    name: "Commercial",
    access: "Licensed",
    description: "For ticketing apps and transport aggregators — surge warnings and demand feeds.",
    highlight: false,
  },
];

const ApiSection = () => {
  return (
    <section className="relative z-10 bg-secondary/50 px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm uppercase tracking-widest text-festive-amber">
          API & Integration Hub
        </p>
        <h2
          className="mt-4 max-w-4xl font-display text-4xl sm:text-5xl md:text-6xl"
          style={{ lineHeight: 1.05, letterSpacing: "-1.5px" }}
        >
          Open architecture.{" "}
          <em className="text-festive-amber">Seamless integration.</em>
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          REST APIs for demand forecasts, corridor risk scores, and advisory
          feeds — designed for STUs, municipal bodies, and app developers.
        </p>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {/* API features */}
          <div className="space-y-6">
            {[
              {
                icon: Code,
                title: "API Documentation",
                text: "REST endpoints for demand forecasts, corridor risk scores, and advisory feeds with comprehensive OpenAPI specs.",
              },
              {
                icon: Plug,
                title: "Integration Use Cases",
                text: "How an STU can plug into capacity recommendations. How a ticketing app can surface surge warnings to users.",
              },
              {
                icon: Play,
                title: "Live Sandbox",
                text: "Interactive API tester with sample festival and corridor queries. Try before you integrate.",
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary">
                  <item.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display text-lg">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Access tiers */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span>Access Tiers</span>
            </div>
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl border p-6 transition-all duration-300 ${
                  tier.highlight
                    ? "border-foreground bg-primary text-primary-foreground"
                    : "border-border bg-card hover:shadow-lg hover:shadow-foreground/5"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg">{tier.name}</h3>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      tier.highlight
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {tier.access}
                  </span>
                </div>
                <p
                  className={`mt-2 text-sm leading-relaxed ${
                    tier.highlight ? "text-primary-foreground/80" : "text-muted-foreground"
                  }`}
                >
                  {tier.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApiSection;
