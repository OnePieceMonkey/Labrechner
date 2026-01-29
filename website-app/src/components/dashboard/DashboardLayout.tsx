'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Star,
  Settings,
  Layout,
  Users,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowLeft,
  Moon,
  Sun,
  Coffee,
  LogOut,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { TabType, LabType, BELGroup } from '@/types/erp';
import { BEL_GROUPS } from '@/types/erp';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  labType: LabType;
  onLabTypeChange: (type: LabType) => void;
  selectedGroup: string;
  onGroupChange: (group: string) => void;
  isDark: boolean;
  toggleTheme: () => void;
  regions: string[];
  userName?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  activeTab,
  onTabChange,
  selectedRegion,
  onRegionChange,
  labType,
  onLabTypeChange,
  selectedGroup,
  onGroupChange,
  isDark,
  toggleTheme,
  regions,
  userName,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  // Welcome message on mount
  useEffect(() => {
    setShowWelcome(true);
    const timer = setTimeout(() => setShowWelcome(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 10)
      return {
        text: 'Guten Morgen',
        icon: <Coffee className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      };
    if (hour < 18)
      return {
        text: 'Guten Tag',
        icon: <Sun className="w-5 h-5 text-orange-500" />,
      };
    return {
      text: 'Guten Abend',
      icon: <Moon className="w-5 h-5 text-indigo-400" />,
    };
  };

  const greeting = getGreeting();

  // Hide sidebar for settings and clients tabs
  const showSidebar = activeTab !== 'settings' && activeTab !== 'clients';

  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-300 relative">
      {/* Welcome Toast */}
      {showWelcome && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl border border-white/50 dark:border-slate-700 ring-1 ring-black/5 flex items-center gap-4">
            <div className="p-2 bg-brand-50 dark:bg-brand-900/30 rounded-full">
              {greeting.icon}
            </div>
            <div>
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {greeting.text}
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">
                {userName || 'Willkommen zurück!'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-bold text-xl">
            <span className="hidden md:inline">Labrechner</span>
            <span className="hidden md:inline text-slate-300 font-light">|</span>
            <span className="hidden lg:inline text-slate-600 dark:text-slate-300">
              App
            </span>
            <span className="md:hidden">App</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-1 md:gap-4 text-sm font-medium text-slate-500 dark:text-slate-400 overflow-x-auto no-scrollbar mx-2 py-1">
          {showSidebar && (
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="flex items-center gap-2 hover:text-brand-600 dark:hover:text-brand-400 p-2 md:p-0 shrink-0"
            >
              {isSidebarOpen ? (
                <PanelLeftClose className="w-4 h-4" />
              ) : (
                <PanelLeftOpen className="w-4 h-4" />
              )}
              <span className="hidden lg:inline">Filter</span>
            </button>
          )}
          <div className="w-px h-4 bg-gray-200 dark:bg-slate-700 hidden md:block shrink-0" />

          <NavButton
            id="nav-search"
            active={activeTab === 'search'}
            onClick={() => onTabChange('search')}
          >
            Suche
          </NavButton>
          <NavButton
            id="nav-favorites"
            active={activeTab === 'favorites'}
            onClick={() => onTabChange('favorites')}
          >
            Favoriten
          </NavButton>
          <NavButton
            id="nav-templates"
            active={activeTab === 'templates'}
            onClick={() => onTabChange('templates')}
          >
            Vorlagen
          </NavButton>
          <NavButton
            id="nav-clients"
            active={activeTab === 'clients'}
            onClick={() => onTabChange('clients')}
          >
            Kunden
          </NavButton>
          <NavButton
            id="nav-invoices"
            active={activeTab === 'invoices'}
            onClick={() => onTabChange('invoices')}
          >
            Rechnungen
          </NavButton>

          <div className="w-px h-4 bg-gray-200 dark:bg-slate-700 hidden md:block shrink-0" />

          <button
            id="nav-settings"
            onClick={() => onTabChange('settings')}
            className={`flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'settings'
                ? 'bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 ring-2 ring-brand-500/20'
                : 'text-slate-900 dark:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span className="hidden md:inline">Einstellungen</span>
          </button>
        </div>

        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <a
            href="/"
            className="hidden md:block text-sm font-medium text-slate-600 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          >
            Zur Website
          </a>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            type="button"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Abmelden</span>
          </button>
          <div className="pl-2 border-l border-gray-200 dark:border-slate-800">
            <ThemeToggle isDark={isDark} toggle={toggleTheme} />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative min-h-0">
        {/* Sidebar */}
        {showSidebar && (
          <aside
            className={`bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 transition-all duration-300 ease-in-out hidden md:block shrink-0 h-full overflow-hidden ${
              isSidebarOpen ? 'w-72 border-r' : 'w-0 border-r-0'
            }`}
          >
            <div
              className={`w-72 h-full overflow-y-auto p-6 transition-opacity duration-200 ${
                isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              {/* KZV Region Filter */}
              <div className="mb-8">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  KZV-Region
                </label>
                <div className="relative">
                  <select
                    value={selectedRegion}
                    onChange={(e) => onRegionChange(e.target.value)}
                    className="w-full appearance-none bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all cursor-pointer"
                  >
                    {regions.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ArrowLeft className="w-4 h-4 -rotate-90" />
                  </div>
                </div>
              </div>

              {/* Lab Type Filter */}
              <div className="mb-8">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Labor-Typ
                </label>
                <div className="space-y-3">
                  <RadioButton
                    checked={labType === 'gewerbe'}
                    onChange={() => onLabTypeChange('gewerbe')}
                    label="Gewerbelabor"
                  />
                  <RadioButton
                    checked={labType === 'praxis'}
                    onChange={() => onLabTypeChange('praxis')}
                    label="Praxislabor"
                  />
                </div>
              </div>

              {/* BEL Group Filter */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  BEL-Gruppe
                </label>
                <div className="space-y-1">
                  {BEL_GROUPS.map((group) => (
                    <button
                      key={group.id}
                      onClick={() => onGroupChange(group.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedGroup === group.id
                          ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 font-medium'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {group.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Main Content Area */}
        <main
          className={`flex-1 min-h-0 overflow-y-auto p-6 md:p-10 ${
            !showSidebar ? 'w-full' : ''
          } pb-24`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

// Helper Components
const NavButton: React.FC<{
  id: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ id, active, onClick, children }) => (
  <button
    id={id}
    onClick={onClick}
    className={`p-2 md:px-0 hover:text-brand-600 dark:hover:text-brand-400 transition-colors whitespace-nowrap ${
      active
        ? 'text-brand-600 dark:text-brand-400 ring-2 ring-brand-500/20 rounded-lg px-2'
        : ''
    }`}
  >
    {children}
  </button>
);

const RadioButton: React.FC<{
  checked: boolean;
  onChange: () => void;
  label: string;
}> = ({ checked, onChange, label }) => (
  <label className="flex items-center gap-3 cursor-pointer group">
    <div
      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
        checked
          ? 'border-brand-500 bg-brand-500'
          : 'border-gray-300 dark:border-slate-600 bg-transparent group-hover:border-brand-400'
      }`}
    >
      {checked && <div className="w-2 h-2 bg-white rounded-full" />}
    </div>
    <input
      type="radio"
      className="hidden"
      checked={checked}
      onChange={onChange}
    />
    <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">
      {label}
    </span>
  </label>
);
