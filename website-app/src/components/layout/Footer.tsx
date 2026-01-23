import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="container-wide py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Logo href="/" size="small" />
            <p className="mt-4 max-w-md text-sm text-gray-600">
              BEL-Abrechnung. Einfach. Aktuell. Der Abrechnungsassistent für
              deutsche Dentallabore.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Produkt</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/app"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  BEL-Suche
                </Link>
              </li>
              <li>
                <a
                  href="#features"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Features
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Rechtliches</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/impressum"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Impressum
                </Link>
              </li>
              <li>
                <Link
                  href="/datenschutz"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link
                  href="/agb"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  AGB
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {currentYear} Labrechner. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );
}
