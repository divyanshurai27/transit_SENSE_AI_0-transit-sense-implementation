import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import TravelAdvisorySection from "@/components/sections/TravelAdvisorySection";
import DashboardSection from "@/components/sections/DashboardSection";
import MethodologySection from "@/components/sections/MethodologySection";
import ApiSection from "@/components/sections/ApiSection";
import AlertsSection from "@/components/sections/AlertsSection";
import { usePageTitle } from "@/hooks/usePageTitle";

const Index = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoOpacity, setVideoOpacity] = useState(0);
  const rafRef = useRef<number>(0);

  // Set page title using custom hook
  usePageTitle('TransitSense - Smart Transit Management');

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const checkTime = () => {
      if (!video.duration || video.paused) {
        rafRef.current = requestAnimationFrame(checkTime);
        return;
      }
      const { currentTime, duration } = video;
      if (currentTime < 0.5) {
        setVideoOpacity(currentTime / 0.5);
      } else if (currentTime > duration - 0.5) {
        setVideoOpacity((duration - currentTime) / 0.5);
      } else {
        setVideoOpacity(1);
      }
      rafRef.current = requestAnimationFrame(checkTime);
    };

    const handleEnded = () => {
      setVideoOpacity(0);
      setTimeout(() => {
        video.currentTime = 0;
        video.play();
      }, 100);
    };

    video.addEventListener("ended", handleEnded);
    video.play().catch(() => {});
    rafRef.current = requestAnimationFrame(checkTime);

    return () => {
      video.removeEventListener("ended", handleEnded);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-background">
      {/* Hero wrapper */}
      <div className="relative min-h-screen">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            style={{ opacity: videoOpacity, transition: "opacity 0.1s linear" }}
            src="/hero-video.mp4"
            muted
            playsInline
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/60" />
        </div>

        {/* Navigation */}
        <nav className="relative z-10">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
            <a href="/" className="font-display text-3xl tracking-tight text-foreground">
              Transit<span className="text-primary">Sense</span>
            </a>

            <div className="hidden items-center gap-8 md:flex">
              {[
                { label: "Home", active: true, href: "/" },
                { label: "Travel", active: false, href: "/travel" },
                { label: "Dashboard", active: false, href: "/dashboard" },
                { label: "Alerts", active: false, href: "/alerts" },
                { label: "API", active: false, href: "/api" },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`text-sm transition-colors ${
                    item.active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <Link 
              to="/travel"
              className="rounded-full bg-primary px-6 py-2.5 text-sm text-primary-foreground transition-transform hover:scale-[1.03]"
            >
              Begin Journey
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section
          className="relative z-10 flex flex-col items-center justify-center px-6 pb-40 text-center"
          style={{ paddingTop: "calc(8rem - 75px)" }}
        >
          <h1
            className="animate-fade-rise max-w-7xl font-display text-5xl font-normal sm:text-7xl md:text-8xl"
            style={{ lineHeight: 0.95, letterSpacing: "-2.46px" }}
          >
            Beyond the{" "}
            <em className="text-primary">chaos,</em> we forecast{" "}
            <em className="text-primary">the journey.</em>
          </h1>

          <p className="animate-fade-rise-delay mt-8 max-w-2xl text-base leading-relaxed text-foreground sm:text-lg font-semibold drop-shadow-2xl">
            AI-driven demand forecasting and transport coordination for India's
            festival travel. Predicting surges, preventing overcrowding, and
            enabling smarter mobility for a billion journeys.
          </p>

          <Link 
            to="/travel"
            className="animate-fade-rise-delay-2 mt-12 rounded-full bg-primary px-14 py-5 text-base text-primary-foreground transition-transform hover:scale-[1.03]"
          >
            Begin Journey
          </Link>
        </section>
      </div>

      {/* Content Sections */}
      <div id="travel">
        <TravelAdvisorySection />
      </div>
      <div id="dashboard">
        <DashboardSection />
      </div>
      <div id="methodology">
        <MethodologySection />
      </div>
      <div id="api">
        <ApiSection />
      </div>
      <div id="alerts">
        <AlertsSection />
      </div>
    </div>
  );
};

export default Index;
