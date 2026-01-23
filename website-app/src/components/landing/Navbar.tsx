"use client";

import { useState } from "react";
import Link from "next/link";
import { FlaskConical, Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else if (id === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-gray-100/50 dark:border-slate-800/50 transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-7xl h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => scrollToSection("hero")}
        >
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white">
            <FlaskConical className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
            Labrechner
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button
              onClick={() => scrollToSection("features")}
              className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              Funktionen
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              Preise
            </button>
            <Link
              href="/login"
              className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              App starten
            </Link>
          </div>
          <div className="w-px h-6 bg-gray-200 dark:bg-slate-800"></div>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Theme wechseln"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-slate-400 dark:text-slate-300" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Theme wechseln"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-slate-400 dark:text-slate-300" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </button>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-slate-600 dark:text-slate-300"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white dark:bg-slate-950 border-b border-gray-100 dark:border-slate-800 p-6 flex flex-col gap-4 shadow-xl animate-fade-in">
          <button
            onClick={() => scrollToSection("features")}
            className="text-left text-lg font-medium text-slate-900 dark:text-white py-2"
          >
            Funktionen
          </button>
          <button
            onClick={() => scrollToSection("pricing")}
            className="text-left text-lg font-medium text-slate-900 dark:text-white py-2"
          >
            Preise
          </button>
          <Link
            href="/login"
            onClick={() => setIsMenuOpen(false)}
            className="text-left text-lg font-medium text-brand-600 dark:text-brand-400 py-2"
          >
            App starten
          </Link>
        </div>
      )}
    </nav>
  );
}
