import { MapPin, Route, TrendingUp, Bell, BookOpen } from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Journey Planner",
    description:
      "Select origin, destination, date, and transport mode. Get an instant demand forecast — High, Moderate, or Low surge expected.",
    color: "bg-primary",
    iconColor: "text-primary-foreground",
  },
  {
    icon: Route,
    title: "Corridor Risk Map",
    description:
      "Interactive India map color-coded by demand intensity. Click any route for detailed advisories and bottleneck alerts.",
    color: "bg-festive-teal",
    iconColor: "text-festive-teal-foreground",
  },
  {
    icon: TrendingUp,
    title: "Fare Watch",
    description:
      "Live fare tracking vs. expected surge pricing. Flags private operators exceeding fair-pricing thresholds.",
    color: "bg-festive-gold",
    iconColor: "text-festive-gold-foreground",
  },
  {
    icon: Bell,
    title: "My Trip Alerts",
    description:
      "Register phone or email to receive push notifications as your travel date approaches with real-time updates.",
    color: "bg-festive-rose",
    iconColor: "text-festive-rose-foreground",
  },
  {
    icon: BookOpen,
    title: "Festival Travel Guide",
    description:
      "Curated tips per festival — Kumbh, Diwali, Eid, Pongal, Durga Puja — with historical crowd data visualizations.",
    color: "bg-festive-amber",
    iconColor: "text-festive-amber-foreground",
  },
];

const TravelAdvisorySection = () => {
  return (
    <section className="relative z-10 bg-background px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm uppercase tracking-widest text-primary">
          Citizen Travel Advisory
        </p>
        <h2
          className="mt-4 max-w-3xl font-display text-4xl sm:text-5xl md:text-6xl"
          style={{ lineHeight: 1.05, letterSpacing: "-1.5px" }}
        >
          Plan smarter.{" "}
          <em className="text-primary">Travel safer.</em>
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          AI-guided travel planning for India's busiest festival corridors.
          Real-time demand forecasts, alternate route suggestions, and fare
          transparency — all in one place.
        </p>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}>
                <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
              </div>
              <h3 className="mt-6 font-display text-xl">{feature.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TravelAdvisorySection;
