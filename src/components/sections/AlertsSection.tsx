import { Bell, Settings, Archive } from "lucide-react";

const AlertsSection = () => {
  return (
    <section className="relative z-10 bg-background px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm uppercase tracking-widest text-festive-rose">
          Notifications & Alerts
        </p>
        <h2
          className="mt-4 max-w-4xl font-display text-4xl sm:text-5xl md:text-6xl"
          style={{ lineHeight: 1.05, letterSpacing: "-1.5px" }}
        >
          Stay informed.{" "}
          <em className="text-festive-rose">Stay ahead.</em>
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Your citizen-facing hub for active travel advisories — from real-time
          surge alerts to historical advisory outcomes.
        </p>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {[
            {
              icon: Bell,
              title: "Active Advisories",
              description:
                "Sortable list of live advisories by festival, state, corridor, and severity level. Never miss a critical update.",
              stat: "Real-time",
              statLabel: "Updates",
            },
            {
              icon: Settings,
              title: "Subscription Manager",
              description:
                "Choose which routes and festivals trigger alerts for you. Get notifications via SMS, email, or push — your way.",
              stat: "5+",
              statLabel: "Channels",
            },
            {
              icon: Archive,
              title: "Advisory Archive",
              description:
                "Searchable history of past advisories with outcomes — did trains get added? Did prices normalize? Learn from history.",
              stat: "3 yrs",
              statLabel: "Of data",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:shadow-lg hover:shadow-foreground/5"
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                  <item.icon className="h-6 w-6 text-foreground" />
                </div>
                <h3 className="mt-6 font-display text-xl">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
              <div className="mt-8 border-t border-border pt-6">
                <span className="font-display text-3xl">{item.stat}</span>
                <span className="ml-2 text-sm text-muted-foreground">
                  {item.statLabel}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-28 border-t border-border pt-12">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div>
              <h3 className="font-display text-2xl">Festival<span className="text-primary">Flow</span></h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                An initiative by Ministry of Railways, MoRTH & State Transport
                Undertakings — powered by AI for safer, smarter festival travel
                across India.
              </p>
            </div>
            <div className="flex gap-8 text-sm text-muted-foreground">
              <a href="#" className="transition-colors hover:text-foreground">Privacy Policy</a>
              <a href="#" className="transition-colors hover:text-foreground">Data Governance</a>
              <a href="#" className="transition-colors hover:text-foreground">Contact</a>
              <a href="#" className="transition-colors hover:text-foreground">Grievance Portal</a>
            </div>
          </div>
          <p className="mt-8 text-center text-xs text-muted-foreground">
            © 2025 TransitSense — PS IDMSIH25028. WCAG 2.1 AA Compliant. Built for Bharat.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AlertsSection;
