import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: 'Hallo! Ich bin Ihr BEL-Assistent. Fragen Sie mich z.B.: "Welche Positionen brauche ich für eine Zirkon-Krone?"' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      let response = "Das habe ich verstanden. Ich suche die passenden BEL-Positionen...";
      if (userMsg.toLowerCase().includes('krone')) {
        response = "Für eine Krone empfehle ich folgende Kette: 0010 (Modell), 0052 (Einartikulieren), 1022 (Vollkrone). Soll ich das als Vorlage speichern?";
      } else if (userMsg.toLowerCase().includes('schiene')) {
         response = "Bei Schienen sind meist 0010, 4010 (Aufbissbehelf) und ggf. 0212 relevant.";
      }

      setMessages(prev => [...prev, { role: 'bot', text: response }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-4">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 md:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl shadow-brand-900/20 border border-gray-200 dark:border-slate-800 overflow-hidden flex flex-col animate-fade-in-up origin-bottom-left h-[500px]">
          {/* Header */}
          <div className="bg-brand-600 p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm">KI-Assistent</div>
                <div className="text-xs text-brand-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span> Online
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-brand-600 text-white rounded-br-none' 
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-gray-100 dark:border-slate-700 shadow-sm rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-brand-500/50 transition-all"
            >
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Frag mich etwas..."
                className="flex-1 bg-transparent border-none focus:outline-none text-sm text-slate-900 dark:text-white placeholder-slate-400"
              />
              <button 
                type="submit" 
                disabled={!input.trim()}
                className="p-1.5 rounded-lg bg-brand-500 text-white disabled:opacity-50 disabled:bg-gray-300 dark:disabled:bg-slate-700 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300 ${
          isOpen 
            ? 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rotate-90' 
            : 'bg-brand-600 text-white hover:bg-brand-700 hover:scale-110'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
        
        {!isOpen && (
            <span className="absolute left-full ml-4 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-xl shadow-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-gray-100 dark:border-slate-700">
                Frag die KI
                <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-white dark:bg-slate-800 rotate-45 border-l border-b border-gray-100 dark:border-slate-700"></div>
            </span>
        )}
      </button>
    </div>
  );
};