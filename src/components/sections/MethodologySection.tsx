import { Database, Brain, Target, AlertCircle, Download } from "lucide-react";

const items = [
  {
    icon: Database,
    title: "Data Sources",
    description:
      "Festival calendar APIs (Calendarific), IRCTC ticketing data, population mobility signals, NOAA weather data, and social media sentiment indexing.",
  },
  {
    icon: Brain,
    title: "Model Architecture",
    description:
      "Ensemble forecasting combining time-series analysis, gradient boosting, and NLP-based social signal processing for 85%+ directional accuracy.",
  },
  {
    icon: Target,
    title: "Accuracy Reports",
    description:
      "Published quarterly accuracy scores segmented by corridor type. Transparent forecast vs. actuals comparison.",
  },
  {
    icon: AlertCircle,
    title: "Bias & Limitations",
    description:
      "Honest disclosure of model limitations — first-year festivals, low-data corridors, and emerging travel patterns.",
  },
  {
    icon: Download,
    title: "Open Data",
    description:
      "Downloadable aggregate forecast datasets for researchers and academic institutions via data.gov.in.",
  },
];

const MethodologySection = () => {
  return (
    <section className="relative z-10 bg-background px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm uppercase tracking-widest text-festive-gold">
          Data & Model Transparency
        </p>
        <h2
          className="mt-4 max-w-4xl font-display text-4xl sm:text-5xl md:text-6xl"
          style={{ lineHeight: 1.05, letterSpacing: "-1.5px" }}
        >
          Built on trust.{" "}
          <em className="text-festive-gold">Verified by data.</em>
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          We believe institutional trust is earned through transparency. Every
          data source, model decision, and accuracy metric is openly documented.
        </p>

        <div className="mt-16 space-y-6">
          {items.map((item, i) => (
            <div
              key={item.title}
              className="group flex items-start gap-6 rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:shadow-lg hover:shadow-foreground/5"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-secondary">
                <item.icon className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-display text-sm text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-xl">{item.title}</h3>
                </div>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MethodologySection;
