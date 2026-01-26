'use client';

import React, { useState, useEffect } from 'react';
import { Search, Star, Layout, Plus, Settings, MousePointer2, ArrowUp, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

/* --- Animationen für die Vorschau-Videos --- */
const SimulatedVideo: React.FC<{ type: 'search' | 'favorites' | 'templates' | 'clients' | 'settings' }> = ({ type }) => {
    return (
        <div className="w-full h-32 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden relative border border-gray-200 dark:border-slate-700 mb-4 shadow-inner">
            {/* Cursor */}
            <div className={`absolute z-20 transition-all duration-1000 ease-in-out pointer-events-none drop-shadow-md
                ${type === 'search' ? 'animate-[cursor-search_6s_infinite]' : ''}
                ${type === 'favorites' ? 'animate-[cursor-fav_6s_infinite]' : ''}
                ${type === 'templates' ? 'animate-[cursor-temp_6s_infinite]' : ''}
                ${type === 'clients' ? 'animate-[cursor-client_6s_infinite]' : ''}
                ${type === 'settings' ? 'animate-[cursor-settings_6s_infinite]' : ''}
            `}>
                <MousePointer2 className="w-4 h-4 text-brand-600 fill-brand-600" />
            </div>

            {/* Content based on type */}
            <div className="p-4 h-full flex items-center justify-center">
                {type === 'search' && (
                    <div className="w-3/4 h-8 bg-white dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600 flex items-center px-3 relative">
                        <Search className="w-4 h-4 text-slate-400 mr-2" />
                        <div className="h-2 bg-slate-200 dark:bg-slate-500 rounded animate-[width-grow_6s_infinite] w-0"></div>
                    </div>
                )}
                {type === 'favorites' && (
                    <div className="flex items-center gap-3 bg-white dark:bg-slate-700 p-2 rounded-lg border border-gray-200 dark:border-slate-600 w-3/4">
                        <div className="w-8 h-8 bg-slate-200 dark:bg-slate-600 rounded"></div>
                        <div className="flex-1 space-y-1">
                            <div className="h-2 w-16 bg-slate-200 dark:bg-slate-500 rounded"></div>
                            <div className="h-1.5 w-10 bg-slate-100 dark:bg-slate-500/50 rounded"></div>
                        </div>
                        <Star className="w-5 h-5 text-slate-300 animate-[star-pulse_6s_infinite]" />
                    </div>
                )}
                {type === 'templates' && (
                    <div className="flex gap-2">
                        <div className="w-16 h-20 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg p-2 space-y-2">
                             <div className="h-2 w-8 bg-slate-200 dark:bg-slate-500 rounded"></div>
                             <div className="h-1 w-full bg-slate-100 dark:bg-slate-600 rounded"></div>
                        </div>
                         <div className="w-16 h-20 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg p-2 space-y-2 animate-[fade-in-delayed_6s_infinite] opacity-0">
                             <div className="h-2 w-8 bg-brand-200 dark:bg-brand-900 rounded"></div>
                             <div className="h-1 w-full bg-slate-100 dark:bg-slate-600 rounded"></div>
                        </div>
                    </div>
                )}
                {type === 'clients' && (
                    <div className="relative w-full max-w-[180px]">
                        <div className="w-full bg-white dark:bg-slate-700 p-2 rounded-lg border border-gray-200 dark:border-slate-600 mb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-600"></div>
                                <div className="h-2 w-20 bg-slate-200 dark:bg-slate-500 rounded"></div>
                            </div>
                        </div>
                        <div className="absolute -bottom-4 -right-2 bg-brand-500 text-white p-1 rounded-full animate-[pop-in_6s_infinite]">
                            <Plus className="w-3 h-3" />
                        </div>
                    </div>
                )}
                {type === 'settings' && (
                    <div className="w-3/4 space-y-2">
                        <div className="flex justify-between items-center bg-white dark:bg-slate-700 p-2 rounded border border-gray-200 dark:border-slate-600">
                             <div className="h-2 w-16 bg-slate-200 dark:bg-slate-500 rounded"></div>
                             <div className="w-8 h-4 bg-slate-200 dark:bg-slate-600 rounded-full relative overflow-hidden">
                                 <div className="absolute left-0 top-0 bottom-0 w-4 bg-slate-400 rounded-full animate-[toggle_6s_infinite]"></div>
                             </div>
                        </div>
                    </div>
                )}
            </div>
            
            <style>{`
                @keyframes cursor-search { 0% { top: 100%; left: 100%; } 20% { top: 50%; left: 50%; } 40% { top: 50%; left: 60%; } 100% { top: 50%; left: 60%; } }
                @keyframes width-grow { 0%, 25% { width: 0; } 50%, 100% { width: 60%; } }
                
                @keyframes cursor-fav { 0% { top: 100%; left: 100%; } 30% { top: 50%; left: 85%; transform: scale(1); } 35% { transform: scale(0.9); } 40% { transform: scale(1); } 100% { top: 50%; left: 85%; } }
                @keyframes star-pulse { 0%, 35% { color: #cbd5e1; fill: transparent; } 40%, 100% { color: #fbbf24; fill: #fbbf24; } }
                
                @keyframes cursor-temp { 0% { top: 100%; left: 0%; } 30% { top: 50%; left: 50%; transform: scale(1); } 35% { transform: scale(0.9); } 40% { transform: scale(1); } 100% { top: 50%; left: 50%; } }
                @keyframes fade-in-delayed { 0%, 35% { opacity: 0; transform: translateY(10px); } 45%, 100% { opacity: 1; transform: translateY(0); } }

                @keyframes cursor-client { 0% { top: 0%; left: 0%; } 30% { top: 70%; left: 80%; transform: scale(1); } 35% { transform: scale(0.9); } 40% { transform: scale(1); } 100% { top: 70%; left: 80%; } }
                @keyframes pop-in { 0%, 35% { transform: scale(0); } 45%, 100% { transform: scale(1); } }

                @keyframes cursor-settings { 0% { top: 100%; left: 50%; } 30% { top: 50%; left: 80%; transform: scale(1); } 35% { transform: scale(0.9); } 40% { transform: scale(1); } 100% { top: 50%; left: 80%; } }
                @keyframes toggle { 0%, 35% { left: 0; background: #94a3b8; } 40%, 100% { left: 50%; background: #8b5cf6; } }
            `}</style>
        </div>
    );
};

interface OnboardingTourProps {
    isOpen: boolean;
    onComplete: () => void;
    onStepChange: (stepId: string) => void;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ isOpen, onComplete, onStepChange }) => {
    const [step, setStep] = useState(0);

    // Reset step when tour is opened
    useEffect(() => {
        if (isOpen) {
            setStep(0);
        }
    }, [isOpen]);

    const steps = [
        { id: 'search', title: 'Blitzschnelle Suche', desc: 'Finden Sie BEL-Positionen sofort per Nummer oder Text.' },
        { id: 'favorites', title: 'Favoriten speichern', desc: 'Markieren Sie oft genutzte Positionen mit dem Stern.' },
        { id: 'templates', title: 'Vorlagen nutzen', desc: 'Erstellen Sie komplexe Ketten für wiederkehrende Arbeiten.' },
        { id: 'clients', title: 'Kunden verwalten', desc: 'Legen Sie Zahnärzte an, um Rechnungen zu personalisieren.' },
        { id: 'settings', title: 'Alles einstellen', desc: 'Hinterlegen Sie Labordaten, Faktoren und das Design.' },
    ];

    useEffect(() => {
        if (isOpen) {
            onStepChange(steps[step].id);
        }
    }, [step, isOpen]);

    if (!isOpen) return null;

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(prev => prev + 1);
        } else {
            onComplete();
        }
    };

    const handleBack = () => {
        if (step > 0) {
            setStep(prev => prev - 1);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700 relative overflow-hidden flex flex-col">
                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800">
                    <div 
                        className="h-full bg-brand-500 transition-all duration-300" 
                        style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                    ></div>
                </div>

                {/* Content */}
                <div className="p-8 pb-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                            Schritt {step + 1} von {steps.length}
                        </span>
                        <button 
                            onClick={onComplete} 
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-sm font-medium"
                        >
                            Überspringen
                        </button>
                    </div>

                    <SimulatedVideo type={steps[step].id as any} />

                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        {steps[step].title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
                        {steps[step].desc}
                    </p>
                </div>

                {/* Footer Nav */}
                <div className="p-6 pt-0 flex gap-3">
                    {step > 0 && (
                        <Button variant="secondary" onClick={handleBack} className="flex-1 text-lg">
                            Zurück
                        </Button>
                    )}
                    <Button onClick={handleNext} className="flex-[2] text-lg shadow-xl shadow-brand-500/20">
                        {step === steps.length - 1 ? "Los geht's!" : "Weiter"}
                    </Button>
                </div>

                {/* Floating Arrow (Visual Guide) */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-white animate-bounce hidden md:block">
                    <ArrowUp className="w-8 h-8 drop-shadow-lg" />
                </div>
            </div>
        </div>
    );
};
