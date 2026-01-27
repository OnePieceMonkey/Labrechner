import React, { useState } from 'react';
import { Button } from './ui/Button';
import { CheckCircle2, Loader2 } from 'lucide-react';

export const WaitlistForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1500);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {status === 'success' ? (
        <div className="flex flex-col items-center justify-center p-8 bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20 rounded-2xl text-center animate-fade-in">
          <CheckCircle2 className="w-12 h-12 text-green-500 dark:text-green-400 mb-4" />
          <h3 className="text-lg font-bold text-green-800 dark:text-green-300">Auf der Liste!</h3>
          <p className="text-green-700 dark:text-green-400 mt-2">Wir melden uns, sobald die Beta startet.</p>
          <button 
            onClick={() => setStatus('idle')}
            className="mt-6 text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 underline"
          >
            Weitere E-Mail eintragen
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ihre@email.de"
              required
              disabled={status === 'loading'}
              className="w-full px-5 py-3.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-sm disabled:bg-gray-50 dark:disabled:bg-slate-800"
            />
          </div>
          <Button 
            type="submit" 
            variant="primary" 
            disabled={status === 'loading'}
            className="whitespace-nowrap rounded-xl"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Moment...
              </>
            ) : (
              'Beta-Zugang anfordern'
            )}
          </Button>
        </form>
      )}
    </div>
  );
};