import React from 'react';
import { Button } from './ui/Button';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';

interface StatusProps {
  onBack: () => void;
  onRetry?: () => void;
}

export const CheckoutSuccess: React.FC<StatusProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 animate-fade-in">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-10 shadow-xl border border-gray-100 dark:border-slate-800 text-center">
        <div className="w-20 h-20 bg-green-50 dark:bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500 dark:text-green-400" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Zahlung erfolgreich!</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Vielen Dank für Ihre Buchung. Ihr Zugriff auf die Premium-Funktionen wurde aktiviert.
        </p>
        <Button onClick={onBack} className="w-full">
          Zur App <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export const CheckoutCancel: React.FC<StatusProps> = ({ onBack, onRetry }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 animate-fade-in">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-10 shadow-xl border border-gray-100 dark:border-slate-800 text-center">
        <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-500 dark:text-red-400" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Zahlung abgebrochen</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Der Bezahlvorgang wurde nicht abgeschlossen. Es wurden keine Kosten berechnet.
        </p>
        <div className="flex flex-col gap-3">
          <Button onClick={onRetry} variant="primary" className="w-full">
            Erneut versuchen <RotateCcw className="w-4 h-4 ml-2" />
          </Button>
          <Button onClick={onBack} variant="ghost" className="w-full">
            Zurück zur Startseite
          </Button>
        </div>
      </div>
    </div>
  );
};