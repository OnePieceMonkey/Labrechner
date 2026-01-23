import {
  Navbar,
  Hero,
  RegionTicker,
  Features,
  Pricing,
  WaitlistSection,
  Footer,
  CookieBanner,
} from "@/components/landing";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 selection:bg-brand-100 selection:text-brand-900 dark:selection:bg-brand-900 dark:selection:text-brand-100 font-sans transition-colors duration-300">
      <Navbar />

      <div id="hero">
        <Hero />
      </div>

      <RegionTicker />

      <div id="features">
        <Features />
      </div>

      <div id="pricing">
        <Pricing />
      </div>

      <WaitlistSection />

      <Footer />

      <CookieBanner />
    </main>
  );
}
