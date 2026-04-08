import { BarChart3, ShieldCheck, Zap, Radio, AlertTriangle, History } from "lucide-react";

const modules = [
  {
    icon: BarChart3,
    title: "Demand Forecast Command",
    description:
      "4–8 week rolling forecast for all major corridors with confidence intervals and one-click PDF/CSV export.",
    color: "bg-primary",
  },
  {
    icon: ShieldCheck,
    title: "Corridor Risk Matrix",
    description:
      "Origin-destination pairs ranked by risk score. Filter by festival, state, transport mode, and time window.",
    color: "bg-festive-teal",
  },
  {
    icon: Zap,
    title: "Capacity Scaling",
    description:
      'AI-generated action cards: "Add 3 coaches on Patna–Kolkata on Oct 28." Mark as Accepted, Under Review, or Rejected.',
    color: "bg-festive-gold",
  },
  {
    icon: Radio,
    title: "Terminal Density Monitor",
    description:
      "Live crowd density feeds for major terminals. Threshold alerts at 60%, 80%, and 90%+ occupancy with rerouting triggers.",
    color: "bg-festive-rose",
  },
  {
    icon: AlertTriangle,
    title: "Surge Pricing Oversight",
    description:
      "Live fare feed monitoring on cab aggregators and private buses. Fair-pricing ceiling calculator and violation alerts.",
    color: "bg-festive-amber",
  },
  {
    icon: History,
    title: "Historical Analytics",
    description:
      "Year-on-year festival demand comparison. Model accuracy audits and intervention impact reports.",
    color: "bg-accent",
  },
];

const DashboardSection = () => {
  return (
    <section className="relative z-10 bg-secondary/50 px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm uppercase tracking-widest text-festive-teal">
          Authority Planning Dashboard
        </p>
        <h2
          className="mt-4 max-w-4xl font-display text-4xl sm:text-5xl md:text-6xl"
          style={{ lineHeight: 1.05, letterSpacing: "-1.5px" }}
        >
          Operational command.{" "}
          <em className="text-festive-teal">Data-driven decisions.</em>
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          A secured dashboard for transport planners across Railways, MoRTH, and
          State Transport Undertakings — enabling capacity decisions backed by
          AI forecasts.
        </p>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod, i) => (
            <div
              key={mod.title}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="absolute -right-4 -top-4 text-8xl font-display text-secondary opacity-60">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="relative">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${mod.color}`}>
                  <mod.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="mt-6 font-display text-xl">{mod.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {mod.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DashboardSection;
