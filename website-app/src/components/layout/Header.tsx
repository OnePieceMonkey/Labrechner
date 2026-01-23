"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "./Logo";
import { Menu, X, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface HeaderProps {
  variant?: "marketing" | "app";
}

export function Header({ variant = "marketing" }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-lg">
      <nav className="container-wide flex h-16 items-center justify-between">
        {/* Logo */}
        <Logo href={variant === "app" ? "/app" : "/"} />

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          {variant === "marketing" ? (
            <>
              <a
                href="#features"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Features
              </a>
              <Link
                href="/app"
                className="btn-primary px-4 py-2 text-sm"
              >
                Jetzt starten
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/app"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Suche
              </Link>
              <Link
                href="/app/settings"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Einstellungen
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-4 w-4" />
                Abmelden
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="rounded-md p-2 text-gray-600 hover:bg-gray-100 md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <div className="container-wide space-y-1 py-4">
            {variant === "marketing" ? (
              <>
                <a
                  href="#features"
                  className="block rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </a>
                <Link
                  href="/app"
                  className="block rounded-md bg-primary px-3 py-2 text-center text-sm font-medium text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Jetzt starten
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/app"
                  className="block rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Suche
                </Link>
                <Link
                  href="/app/settings"
                  className="block rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Einstellungen
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100"
                >
                  <LogOut className="h-4 w-4" />
                  Abmelden
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
