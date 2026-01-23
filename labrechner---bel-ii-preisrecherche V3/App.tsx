import React, { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { WaitlistForm } from './components/WaitlistForm';
import { Footer } from './components/Footer';
import { RegionTicker } from './components/RegionTicker';
import { ThemeToggle } from './components/ui/ThemeToggle';
import { LiveSearch } from './components/LiveSearch';
import { WAITLIST_COPY } from './constants';
import { FlaskConical, Menu, X } from 'lucide-react';
import { AppView } from './components/AppView';
import { Chatbot } from './components/Chatbot';
import { Pricing } from './components/Pricing';
import { Impressum, Datenschutz, AGB } from './components/LegalPages';
import { CheckoutSuccess, CheckoutCancel } from './components/CheckoutStatus';
import { CookieBanner } from './components/CookieBanner';

interface NavbarProps {
  isDark: boolean;
  toggleTheme: () => void;
  onNavigateToApp: () => void;
  onScrollToSection: (id: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isDark, toggleTheme, onNavigateToApp, onScrollToSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNav = (id: string) => {
    setIsMenuOpen(false);
    onScrollToSection(id);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-gray-100/50 dark:border-slate-800/50 transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-7xl h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNav('hero')}>
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white">
              <FlaskConical className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">Labrechner</span>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button onClick={() => handleNav('features')} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Funktionen</button>
            <button onClick={() => handleNav('pricing')} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Preise</button>
            <button onClick={onNavigateToApp} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">App starten</button>
          </div>
          <div className="w-px h-6 bg-gray-200 dark:bg-slate-800"></div>
          <ThemeToggle isDark={isDark} toggle={toggleTheme} />
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-4">
           <ThemeToggle isDark={isDark} toggle={toggleTheme} />
           <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600 dark:text-slate-300">
             {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
           </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white dark:bg-slate-950 border-b border-gray-100 dark:border-slate-800 p-6 flex flex-col gap-4 shadow-xl animate-fade-in">
           <button onClick={() => handleNav('features')} className="text-left text-lg font-medium text-slate-900 dark:text-white py-2">Funktionen</button>
           <button onClick={() => handleNav('pricing')} className="text-left text-lg font-medium text-slate-900 dark:text-white py-2">Preise</button>
           <button onClick={() => { setIsMenuOpen(false); onNavigateToApp(); }} className="text-left text-lg font-medium text-brand-600 dark:text-brand-400 py-2">App starten</button>
        </div>
      )}
    </nav>
  );
};

type ViewState = 'landing' | 'app' | 'success' | 'cancel' | 'impressum' | 'datenschutz' | 'agb';

const App: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('landing');

  // Handle URL hash changes for external links or deep linking
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#app') setCurrentView('app');
      else if (['#impressum', '#datenschutz', '#agb'].includes(hash)) setCurrentView(hash.replace('#', '') as ViewState);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update Theme class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Robust scrolling function that handles view switching
  const scrollToSection = (id: string) => {
    if (currentView !== 'landing') {
      setCurrentView('landing');
      // Wait for React to render the landing view before scrolling
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // Already on landing, just scroll
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else if (id === 'hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
    // Update hash silently without triggering re-render loops if possible, or just ignore hash
    if (id !== 'hero') {
        window.history.pushState(null, '', `#${id}`);
    } else {
        window.history.pushState(null, '', ' ');
    }
  };

  const handleCheckout = (planId: string, interval: 'monthly' | 'yearly') => {
    if (planId === 'free') {
      setCurrentView('app');
      window.scrollTo(0,0);
      return;
    }
    console.log(`Starting Checkout: ${planId} (${interval})`);
    setTimeout(() => {
        setCurrentView('success'); 
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, 1500);
  };

  const navigateToLegal = (page: 'impressum' | 'datenschutz' | 'agb') => {
      setCurrentView(page);
      window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const backToHome = () => {
      setCurrentView('landing');
      window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // View Routing
  if (currentView === 'app') {
    return (
      <div className={isDark ? 'dark' : ''}>
         <div className={isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}>
            <AppView 
              onBack={backToHome} 
              isDark={isDark}
              toggleTheme={() => setIsDark(!isDark)}
            />
            <Chatbot />
            <CookieBanner />
         </div>
      </div>
    );
  }

  if (currentView === 'success') {
      return (
        <div className={isDark ? 'dark' : ''}>
           <CheckoutSuccess onBack={() => { setCurrentView('app'); window.scrollTo(0,0); }} />
        </div>
      );
  }

  if (currentView === 'cancel') {
      return (
        <div className={isDark ? 'dark' : ''}>
           <CheckoutCancel onBack={backToHome} onRetry={() => scrollToSection('pricing')} />
        </div>
      );
  }

  if (currentView === 'impressum') return <div className={isDark ? 'dark' : ''}><Impressum onBack={backToHome} /></div>;
  if (currentView === 'datenschutz') return <div className={isDark ? 'dark' : ''}><Datenschutz onBack={backToHome} /></div>;
  if (currentView === 'agb') return <div className={isDark ? 'dark' : ''}><AGB onBack={backToHome} /></div>;

  // Landing Page View
  return (
    <div className={isDark ? 'dark' : ''}>
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 selection:bg-brand-100 selection:text-brand-900 dark:selection:bg-brand-900 dark:selection:text-brand-100 font-sans transition-colors duration-300">
        <Navbar 
          isDark={isDark} 
          toggleTheme={() => setIsDark(!isDark)} 
          onNavigateToApp={() => { setCurrentView('app'); window.scrollTo(0,0); }}
          onScrollToSection={scrollToSection}
        />
        
        <div id="hero">
          <Hero onStartApp={() => { setCurrentView('app'); window.scrollTo(0,0); }} />
        </div>
        
        <RegionTicker />

        <LiveSearch />
        
        {/* ID used for scrolling */}
        <div id="features"> 
            <Features />
        </div>

        {/* ID used for scrolling */}
        <div id="pricing">
            <Pricing onCheckout={handleCheckout} />
        </div>

        <section id="waitlist" className="py-24 relative overflow-hidden dark:bg-slate-950">
          <div className="absolute inset-0 bg-gradient-to-b from-white to-brand-50/50 dark:from-slate-950 dark:to-slate-900/50 -z-10" />
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-16 shadow-2xl shadow-brand-900/5 dark:shadow-black/30 border border-white dark:border-slate-800 transition-colors">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                  {WAITLIST_COPY.headline}
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  {WAITLIST_COPY.subline}
                </p>
              </div>
              <WaitlistForm />
              <div className="mt-8 text-center">
                <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {WAITLIST_COPY.hint}
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer onNavigate={navigateToLegal} />
        <CookieBanner />
      </main>
    </div>
  );
};

export default App;