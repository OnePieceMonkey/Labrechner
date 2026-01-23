import React, { useState, useEffect, useRef } from 'react';
import { Search, Star, Settings, Layout, Plus, Wand2, Trash2, ArrowLeft, Mic, X, Calculator, Building2, MapPin, FileText, Printer, Check, Save, Info, Sparkles, Loader2, Zap, User, Moon, Sun, PanelLeftClose, PanelLeftOpen, Coffee, Sunset, Sunrise, Users, FileCheck, Eye, Download, Edit2, PenTool, PlayCircle, MousePointer2, ArrowUp, Upload, Image as ImageIcon, CreditCard, FlaskConical, Scale } from 'lucide-react';
import { Button } from './ui/Button';
import { ThemeToggle } from './ui/ThemeToggle';

// Mock Data
const REGIONS = [
  "Bayern", "Berlin", "Brandenburg", "Bremen", "Hamburg", "Hessen", "Nordrhein", "Westfalen-Lippe"
];

const BEL_GROUPS = [
  { id: 'all', label: 'Alle Gruppen' },
  { id: '001-032', label: '001-032 Modelle & Hilfsmittel' },
  { id: '101-165', label: '101-165 Kronen & Brücken' },
  { id: '201-213', label: '201-213 Metallbasis / Modellguss' },
  { id: '301-382', label: '301-382 Verblendungen' },
  { id: '401-413', label: '401-413 Schienen & Behelfe' },
  { id: '801-815', label: '801-815 Reparaturen' },
];

const MOCK_POSITIONS = [
  { id: '0010', name: 'Modell', price: 14.50, group: '001-032' },
  { id: '0052', name: 'Einartikulieren', price: 9.80, group: '001-032' },
  { id: '0120', name: 'Mittelwertartikulator', price: 22.10, group: '001-032' },
  { id: '0212', name: 'Guss der Basis', price: 45.80, group: '201-213' },
  { id: '1022', name: 'Vollgusskrone', price: 120.00, group: '101-165' },
  { id: '3800', name: 'Verblendung Keramik', price: 145.00, group: '301-382' },
  { id: '4010', name: 'Aufbissbehelf justiert', price: 89.50, group: '401-413' },
  { id: '9330', name: 'Versandkosten', price: 6.90, group: '801-815' },
  { id: '9800', name: 'Provisorium', price: 45.00, group: '101-165' },
  // Specific AI Test Item
  { id: '9999', name: 'KI-Test Krone', price: 5.00, group: '101-165' }, 
];

// Data Structures
interface TemplateItem {
    id: string;
    isAi: boolean;
    quantity: number; 
}

interface Template {
    id: number;
    name: string;
    items: TemplateItem[];
    factor: number;
}

interface Recipient {
    id: string;
    customerNumber: string;
    salutation: string;
    title: string;
    firstName: string;
    lastName: string;
    practiceName: string;
    street: string;
    zip: string;
    city: string;
}

interface UserSettings {
    name: string;
    labName: string;
    street: string;
    zip: string;
    city: string;
    taxId: string;
    nextInvoiceNumber: string;
    // Bank Details
    bankName: string;
    iban: string;
    bic: string;
    // Logo
    logoUrl: string | null;
    jurisdiction: string;
}

interface CustomPosition {
    id: string;
    name: string;
    price: number;
}

const MOCK_TEMPLATES_INIT: Template[] = [
  { 
      id: 1, 
      name: 'Standard Zirkonkrone', 
      items: [
          { id: '0010', isAi: false, quantity: 1 },
          { id: '0052', isAi: false, quantity: 1 },
          { id: '1022', isAi: false, quantity: 1 },
          { id: '3800', isAi: false, quantity: 1 }
      ], 
      factor: 1.0 
  },
  { 
      id: 2, 
      name: 'Michiganschiene', 
      items: [
          { id: '0010', isAi: false, quantity: 1 },
          { id: '4010', isAi: false, quantity: 1 }
      ], 
      factor: 1.2 
  },
];

/* --- ONBOARDING COMPONENTS --- */

const SimulatedVideo: React.FC<{ type: 'search' | 'favorites' | 'templates' | 'clients' | 'settings' }> = ({ type }) => {
    return (
        <div className="w-full h-32 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden relative border border-gray-200 dark:border-slate-700 mb-4 shadow-inner">
            {/* Cursor */}
            <div className={`absolute z-20 transition-all duration-1000 ease-in-out pointer-events-none drop-shadow-md
                ${type === 'search' ? 'animate-[cursor-search_4s_infinite]' : ''}
                ${type === 'favorites' ? 'animate-[cursor-fav_4s_infinite]' : ''}
                ${type === 'templates' ? 'animate-[cursor-temp_4s_infinite]' : ''}
                ${type === 'clients' ? 'animate-[cursor-client_4s_infinite]' : ''}
                ${type === 'settings' ? 'animate-[cursor-settings_4s_infinite]' : ''}
            `}>
                <MousePointer2 className="w-4 h-4 text-brand-600 fill-brand-600" />
            </div>

            {/* Content based on type */}
            <div className="p-4 h-full flex items-center justify-center">
                {type === 'search' && (
                    <div className="w-3/4 h-8 bg-white dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600 flex items-center px-3 relative">
                        <Search className="w-4 h-4 text-slate-400 mr-2" />
                        <div className="h-2 bg-slate-200 dark:bg-slate-500 rounded animate-[width-grow_4s_infinite] w-0"></div>
                    </div>
                )}
                {type === 'favorites' && (
                    <div className="flex items-center gap-3 bg-white dark:bg-slate-700 p-2 rounded-lg border border-gray-200 dark:border-slate-600 w-3/4">
                        <div className="w-8 h-8 bg-slate-200 dark:bg-slate-600 rounded"></div>
                        <div className="flex-1 space-y-1">
                            <div className="h-2 w-16 bg-slate-200 dark:bg-slate-500 rounded"></div>
                            <div className="h-1.5 w-10 bg-slate-100 dark:bg-slate-500/50 rounded"></div>
                        </div>
                        <Star className="w-5 h-5 text-slate-300 animate-[star-pulse_4s_infinite]" />
                    </div>
                )}
                {type === 'templates' && (
                    <div className="flex gap-2">
                        <div className="w-16 h-20 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg p-2 space-y-2">
                             <div className="h-2 w-8 bg-slate-200 dark:bg-slate-500 rounded"></div>
                             <div className="h-1 w-full bg-slate-100 dark:bg-slate-600 rounded"></div>
                        </div>
                         <div className="w-16 h-20 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg p-2 space-y-2 animate-[fade-in-delayed_4s_infinite] opacity-0">
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
                        <div className="absolute -bottom-4 -right-2 bg-brand-500 text-white p-1 rounded-full animate-[pop-in_4s_infinite]">
                            <Plus className="w-3 h-3" />
                        </div>
                    </div>
                )}
                {type === 'settings' && (
                    <div className="w-3/4 space-y-2">
                        <div className="flex justify-between items-center bg-white dark:bg-slate-700 p-2 rounded border border-gray-200 dark:border-slate-600">
                             <div className="h-2 w-16 bg-slate-200 dark:bg-slate-500 rounded"></div>
                             <div className="w-8 h-4 bg-slate-200 dark:bg-slate-600 rounded-full relative overflow-hidden">
                                 <div className="absolute left-0 top-0 bottom-0 w-4 bg-slate-400 rounded-full animate-[toggle_4s_infinite]"></div>
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


interface AppViewProps {
  onBack: () => void;
  isDark: boolean;
  toggleTheme: () => void;
}

export const AppView: React.FC<AppViewProps> = ({ onBack, isDark, toggleTheme }) => {
  const [activeTab, setActiveTab] = useState<'search' | 'favorites' | 'templates' | 'clients' | 'settings'>('search');
  const [selectedRegion, setSelectedRegion] = useState('Bayern');
  const [labType, setLabType] = useState<'gewerbe' | 'praxis'>('gewerbe');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [templates, setTemplates] = useState<Template[]>(MOCK_TEMPLATES_INIT);
  const [isListening, setIsListening] = useState(false);
  const [globalPriceFactor, setGlobalPriceFactor] = useState<number>(1.0);
  
  // Custom Positions State
  const [customPositions, setCustomPositions] = useState<CustomPosition[]>([]);
  const [showCustomPosModal, setShowCustomPosModal] = useState(false);
  const [newCustomPos, setNewCustomPos] = useState<CustomPosition>({ id: '', name: '', price: 0 });
  
  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  // Onboarding State
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);

  // Settings State
  const [userSettings, setUserSettings] = useState<UserSettings>({
      name: '',
      labName: '',
      street: '',
      zip: '',
      city: '',
      taxId: '',
      nextInvoiceNumber: '2024-1001',
      bankName: '',
      iban: '',
      bic: '',
      logoUrl: null,
      jurisdiction: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Client / Recipient State
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [isEditingRecipient, setIsEditingRecipient] = useState<string | null>(null); 
  const [newRecipientData, setNewRecipientData] = useState<Partial<Recipient>>({ salutation: 'Herr', customerNumber: '' });

  // Load Data
  useEffect(() => {
      const savedSettings = localStorage.getItem('labrechner-settings');
      if (savedSettings) try { setUserSettings(JSON.parse(savedSettings)); } catch (e) {}
      
      const savedClients = localStorage.getItem('labrechner-clients');
      if (savedClients) try { setRecipients(JSON.parse(savedClients)); } catch (e) {}

      const savedCustomPos = localStorage.getItem('labrechner-custom-pos');
      if (savedCustomPos) try { setCustomPositions(JSON.parse(savedCustomPos)); } catch (e) {}

      // Onboarding Check
      const onboardingDone = localStorage.getItem('labrechner-onboarding-done');
      if (!onboardingDone) {
          setShowOnboarding(true);
      }

      setShowWelcome(true);
      const timer = setTimeout(() => setShowWelcome(false), 4000); 
      return () => clearTimeout(timer);
  }, []);

  useEffect(() => { localStorage.setItem('labrechner-settings', JSON.stringify(userSettings)); }, [userSettings]);
  useEffect(() => { localStorage.setItem('labrechner-clients', JSON.stringify(recipients)); }, [recipients]);
  useEffect(() => { localStorage.setItem('labrechner-custom-pos', JSON.stringify(customPositions)); }, [customPositions]);

  // Selection State for Bulk Actions
  const [selectedForTemplate, setSelectedForTemplate] = useState<string[]>([]);

  // Modal States
  const [addItemModal, setAddItemModal] = useState<number | null>(null); 
  const [addItemQuery, setAddItemQuery] = useState('');
  const [invoicePreview, setInvoicePreview] = useState<{items: TemplateItem[], name: string, factor: number} | null>(null);
  const [createTemplateModal, setCreateTemplateModal] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<number | null>(null);
  
  // New Template Form State
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateFactor, setNewTemplateFactor] = useState(1.0);
  const [newTemplateItems, setNewTemplateItems] = useState<TemplateItem[]>([]); 

  // Invoice Generation States
  const [showRecipientModal, setShowRecipientModal] = useState(false);
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>('');
  const [showFinalInvoice, setShowFinalInvoice] = useState<{recipient: Recipient, items: TemplateItem[], factor: number, invoiceNumber: string, date: string} | null>(null);

  // AI States
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [aiButtonLoading, setAiButtonLoading] = useState<number | null>(null);

  const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 10) return { text: "Guten Morgen", icon: <Coffee className="w-5 h-5 text-amber-600 dark:text-amber-400" /> };
      if (hour < 18) return { text: "Guten Tag", icon: <Sun className="w-5 h-5 text-orange-500" /> };
      return { text: "Guten Abend", icon: <Moon className="w-5 h-5 text-indigo-400" /> };
  };
  const greeting = getGreeting();

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]);
  };

  const toggleSelection = (id: string) => {
      setSelectedForTemplate(prev => prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]);
  };

  const clearSelection = () => {
    setSelectedForTemplate([]);
    setAiSuggestions([]);
    setNewTemplateName('');
    setNewTemplateItems([]);
  };

  const getAllPositions = () => {
      return [...MOCK_POSITIONS, ...customPositions.map(c => ({...c, group: 'Eigenpositionen'}))];
  };

  const getPositionPrice = (id: string) => {
    const all = getAllPositions();
    return all.find(p => p.id === id)?.price || 0;
  };

  const getPositionName = (id: string) => {
    const all = getAllPositions();
    return all.find(p => p.id === id)?.name || id;
  };

  const calculateTemplateTotal = (items: TemplateItem[], factor: number) => {
    const sum = items.reduce((s, item) => s + (getPositionPrice(item.id) * item.quantity), 0);
    return sum * factor;
  };

  // Handle Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size > 3 * 1024 * 1024) {
          alert("Das Bild ist zu groß (Max 3MB).");
          return;
      }

      const reader = new FileReader();
      reader.onload = (ev) => {
          setUserSettings(prev => ({ ...prev, logoUrl: ev.target?.result as string }));
      };
      reader.readAsDataURL(file);
  };

  // Custom Position Handlers
  const handleSaveCustomPosition = () => {
      if (!newCustomPos.id || !newCustomPos.name) return;
      
      setCustomPositions(prev => {
          // Remove if ID exists to allow update
          const filtered = prev.filter(p => p.id !== newCustomPos.id);
          return [...filtered, newCustomPos];
      });
      setShowCustomPosModal(false);
      setNewCustomPos({ id: '', name: '', price: 0 });
      // If triggered from add Item modal, clear query
      if (addItemModal !== null) {
          setAddItemQuery('');
      }
  };

  const handleDeleteCustomPosition = (id: string) => {
      if(confirm('Position löschen?')) {
          setCustomPositions(prev => prev.filter(p => p.id !== id));
      }
  };

  const editCustomPosition = (pos: CustomPosition) => {
      setNewCustomPos(pos);
      setShowCustomPosModal(true);
  };

  // Prepare Template Items for Modal (Merging selection with state)
  useEffect(() => {
    if (createTemplateModal && !editingTemplateId) {
        const currentIds = newTemplateItems.map(i => i.id);
        const manualItems = selectedForTemplate
            .filter(id => !currentIds.includes(id))
            .map(id => ({ id, isAi: false, quantity: 1 }));
        
        if (manualItems.length > 0) {
            setNewTemplateItems(prev => [...prev, ...manualItems]);
        }
        setNewTemplateItems(prev => prev.filter(item => selectedForTemplate.includes(item.id) || item.isAi || editingTemplateId));
    }
  }, [selectedForTemplate, createTemplateModal, editingTemplateId]);

  // Also sync AI suggestions
  useEffect(() => {
     if (createTemplateModal && aiSuggestions.length > 0) {
         const currentIds = newTemplateItems.map(i => i.id);
         const newAiItems = aiSuggestions
            .filter(id => !currentIds.includes(id))
            .map(id => ({ id, isAi: true, quantity: 1 }));
         
         if (newAiItems.length > 0) {
             setNewTemplateItems(prev => [...prev, ...newAiItems]);
         }
     }
  }, [aiSuggestions, createTemplateModal]);

  const updateNewTemplateItemQuantity = (id: string, qty: number) => {
      setNewTemplateItems(prev => prev.map(item => item.id === id ? { ...item, quantity: qty } : item));
  };

  const handleSaveClient = () => {
      if (!newRecipientData.lastName && !newRecipientData.practiceName) return;
      const newClient: Recipient = {
          id: isEditingRecipient || Date.now().toString(),
          customerNumber: newRecipientData.customerNumber || '',
          salutation: newRecipientData.salutation || 'Herr',
          title: newRecipientData.title || '',
          firstName: newRecipientData.firstName || '',
          lastName: newRecipientData.lastName || '',
          practiceName: newRecipientData.practiceName || '',
          street: newRecipientData.street || '',
          zip: newRecipientData.zip || '',
          city: newRecipientData.city || ''
      };
      if (isEditingRecipient) {
          setRecipients(prev => prev.map(c => c.id === isEditingRecipient ? newClient : c));
      } else {
          setRecipients(prev => [...prev, newClient]);
          if (showRecipientModal) setSelectedRecipientId(newClient.id);
      }
      setNewRecipientData({ salutation: 'Herr', customerNumber: '' });
      setIsEditingRecipient(null);
      // Close modal if we are in management mode
      if (!invoicePreview) {
          setShowRecipientModal(false);
      }
  };

  const handleDeleteClient = (id: string) => {
      if (confirm('Kunden wirklich löschen?')) setRecipients(prev => prev.filter(c => c.id !== id));
  };

  const startEditClient = (client: Recipient) => {
      setNewRecipientData(client);
      setIsEditingRecipient(client.id);
  };

  const handleGenerateInvoice = () => {
      let recipient: Recipient;
      if (selectedRecipientId === 'new') {
          recipient = {
            id: 'temp',
            customerNumber: newRecipientData.customerNumber || '',
            salutation: newRecipientData.salutation || 'Herr',
            title: newRecipientData.title || '',
            firstName: newRecipientData.firstName || '',
            lastName: newRecipientData.lastName || '',
            practiceName: newRecipientData.practiceName || '',
            street: newRecipientData.street || '',
            zip: newRecipientData.zip || '',
            city: newRecipientData.city || ''
          };
      } else {
          const found = recipients.find(r => r.id === selectedRecipientId);
          if (!found) return;
          recipient = found;
      }
      if (!invoicePreview) return;

      const currentInvNum = userSettings.nextInvoiceNumber;
      const match = currentInvNum.match(/(\d+)$/);
      let nextInvNum = currentInvNum;
      if (match) {
          const num = parseInt(match[0], 10) + 1;
          const padded = num.toString().padStart(match[0].length, '0');
          nextInvNum = currentInvNum.replace(/(\d+)$/, padded);
      }
      
      setUserSettings(prev => ({ ...prev, nextInvoiceNumber: nextInvNum }));
      setShowFinalInvoice({
          recipient,
          items: invoicePreview.items,
          factor: invoicePreview.factor,
          invoiceNumber: currentInvNum,
          date: new Date().toLocaleDateString('de-DE')
      });
      setShowRecipientModal(false);
      setInvoicePreview(null);
  };

  const filteredPositions = getAllPositions().filter(pos => {
    const matchesSearch = pos.name.toLowerCase().includes(searchQuery.toLowerCase()) || pos.id.includes(searchQuery);
    const matchesGroup = selectedGroup === 'all' || pos.group === selectedGroup || (selectedGroup === 'Eigenpositionen' && pos.group === 'Eigenpositionen');
    const isFavorite = activeTab === 'favorites' ? favorites.includes(pos.id) : true;
    return matchesSearch && matchesGroup && isFavorite;
  });

  const filteredAddPositions = getAllPositions().filter(pos => 
    pos.name.toLowerCase().includes(addItemQuery.toLowerCase()) || pos.id.includes(addItemQuery)
  );

  const handleEditTemplate = (template: Template) => {
      setEditingTemplateId(template.id);
      setNewTemplateName(template.name);
      setNewTemplateFactor(template.factor);
      setNewTemplateItems(JSON.parse(JSON.stringify(template.items))); // Deep copy
      setCreateTemplateModal(true);
  };

  const handleSaveTemplate = () => {
    if (!newTemplateName.trim()) return;
    
    if (editingTemplateId) {
        setTemplates(prev => prev.map(t => t.id === editingTemplateId ? {
            ...t,
            name: newTemplateName,
            items: newTemplateItems,
            factor: newTemplateFactor
        } : t));
    } else {
        const newTemplate: Template = {
            id: Date.now(),
            name: newTemplateName,
            items: newTemplateItems, 
            factor: newTemplateFactor
        };
        setTemplates([...templates, newTemplate]);
    }
    
    setCreateTemplateModal(false);
    setEditingTemplateId(null);
    clearSelection();
    setNewTemplateName('');
    setNewTemplateFactor(1.0);
    setIsAiAnalyzing(false);
    setAiSuggestions([]);
    setActiveTab('templates'); 
  };

  const handleAiAnalysis = () => {
    setIsAiAnalyzing(true);
    setTimeout(() => {
        const newSuggestions: string[] = [];
        if (!selectedForTemplate.includes('9999')) newSuggestions.push('9999'); 
        if (selectedForTemplate.includes('0010') && !selectedForTemplate.includes('0052')) newSuggestions.push('0052'); 
        const finalSuggestions = newSuggestions.filter(s => !selectedForTemplate.includes(s));
        setAiSuggestions(finalSuggestions);
        setIsAiAnalyzing(false);
    }, 1500);
  };

  const removeAiSuggestion = (id: string) => { setAiSuggestions(prev => prev.filter(x => x !== id)); };
  const handleTemplateAiOptimize = (templateId: number) => {
      setAiButtonLoading(templateId);
      setTimeout(() => { setAiButtonLoading(null); alert("Vorlage wurde durch KI optimiert (Simulation)."); }, 1500);
  };
  const handleVoiceInput = () => {
    setIsListening(true);
    setTimeout(() => { setIsListening(false); setSearchQuery("Krone"); }, 2000);
  };
  const handleSelectItemForTemplate = (positionId: string) => {
    if (addItemModal === null) return;
    // Add item with default quantity 1
    setTemplates(prev => prev.map(t => t.id === addItemModal ? { ...t, items: [...t.items, { id: positionId, isAi: false, quantity: 1 }] } : t));
    setAddItemModal(null);
    setAddItemQuery('');
  };
  const handleRemoveItemFromTemplate = (templateId: number, itemIndexToRemove: number) => {
    setTemplates(prev => prev.map(t => t.id === templateId ? { ...t, items: t.items.filter((_, idx) => idx !== itemIndexToRemove) } : t));
  };

  // Onboarding Logic
  const onboardingSteps = [
      { id: 'search', title: 'Blitzschnelle Suche', desc: 'Finden Sie BEL-Positionen sofort per Nummer oder Text.', target: 'nav-search' },
      { id: 'favorites', title: 'Favoriten speichern', desc: 'Markieren Sie oft genutzte Positionen mit dem Stern.', target: 'nav-favorites' },
      { id: 'templates', title: 'Vorlagen nutzen', desc: 'Erstellen Sie komplexe Ketten für wiederkehrende Arbeiten.', target: 'nav-templates' },
      { id: 'clients', title: 'Kunden verwalten', desc: 'Legen Sie Zahnärzte an, um Rechnungen zu personalisieren.', target: 'nav-clients' },
      { id: 'settings', title: 'Alles einstellen', desc: 'Hinterlegen Sie Labordaten, Faktoren und das Design.', target: 'nav-settings' },
  ];

  const handleOnboardingNext = () => {
      if (onboardingStep < onboardingSteps.length - 1) {
          setOnboardingStep(prev => prev + 1);
          const nextTarget = onboardingSteps[onboardingStep + 1].target;
          if(nextTarget) {
             const tab = nextTarget.replace('nav-', '');
             // Switch tab visually to guide user
             if(['search', 'favorites', 'templates', 'clients', 'settings'].includes(tab)) {
                 setActiveTab(tab as any);
             }
          }
      } else {
          handleOnboardingComplete();
      }
  };

  const handleOnboardingComplete = () => {
      setShowOnboarding(false);
      localStorage.setItem('labrechner-onboarding-done', 'true');
      setActiveTab('search'); // Reset to start
  };

  const handleRestartOnboarding = () => {
      setOnboardingStep(0);
      setShowOnboarding(true);
      setActiveTab('search');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-300 relative">
      
      {/* Onboarding Overlay */}
      {showOnboarding && (
          <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700 relative overflow-hidden flex flex-col">
                  {/* Progress Bar */}
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800">
                      <div className="h-full bg-brand-500 transition-all duration-300" style={{ width: `${((onboardingStep + 1) / onboardingSteps.length) * 100}%` }}></div>
                  </div>

                  {/* Content */}
                  <div className="p-8 pb-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-center mb-6">
                          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">Schritt {onboardingStep + 1} von {onboardingSteps.length}</span>
                          <button onClick={handleOnboardingComplete} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-sm font-medium">Überspringen</button>
                      </div>

                      <SimulatedVideo type={onboardingSteps[onboardingStep].id as any} />

                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{onboardingSteps[onboardingStep].title}</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">{onboardingSteps[onboardingStep].desc}</p>
                  </div>

                  {/* Footer Nav */}
                  <div className="p-6 pt-0 flex gap-3">
                      <Button onClick={handleOnboardingNext} className="w-full text-lg shadow-xl shadow-brand-500/20">
                          {onboardingStep === onboardingSteps.length - 1 ? "Los geht's!" : "Weiter"}
                      </Button>
                  </div>

                  {/* Floating Arrow (Visual Guide) */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-white animate-bounce hidden md:block">
                      <ArrowUp className="w-8 h-8 drop-shadow-lg" />
                  </div>
              </div>
          </div>
      )}

      {showWelcome && !showOnboarding && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
              <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl border border-white/50 dark:border-slate-700 ring-1 ring-black/5 flex items-center gap-4">
                  <div className="p-2 bg-brand-50 dark:bg-brand-900/30 rounded-full">{greeting.icon}</div>
                  <div><div className="text-sm font-medium text-slate-500 dark:text-slate-400">{greeting.text}</div><div className="text-lg font-bold text-slate-900 dark:text-white">{userSettings.name ? userSettings.name : 'Willkommen zurück!'}</div></div>
              </div>
          </div>
      )}

      {/* Header */}
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30 relative">
        {/* Onboarding Highlight Layer (Only visible during specific steps on Desktop to point to Nav) */}
        {showOnboarding && (
            <div className="absolute inset-0 z-40 pointer-events-none hidden md:block">
                {/* We rely on the Modal arrow, but we could add a spotlight ring here if we used refs. Keeping it simple with the active tab state change. */}
            </div>
        )}

        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-bold text-xl">
             <div className="w-px h-6 bg-transparent"></div>
             <span className="hidden md:inline">Labrechner</span>
             <span className="hidden md:inline text-slate-300 font-light">|</span> 
             <span className="hidden lg:inline text-slate-600 dark:text-slate-300">App</span>
             <span className="md:hidden">App</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 md:gap-4 text-sm font-medium text-slate-500 dark:text-slate-400 overflow-x-auto no-scrollbar mx-2">
           {activeTab !== 'settings' && activeTab !== 'clients' && (
             <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="flex items-center gap-2 hover:text-brand-600 dark:hover:text-brand-400 p-2 md:p-0">
                {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
                <span className="hidden lg:inline">Filter</span>
             </button>
           )}
           <div className="w-px h-4 bg-gray-200 dark:bg-slate-700 hidden md:block"></div>

          <button id="nav-search" onClick={() => setActiveTab('search')} className={`p-2 md:px-0 hover:text-brand-600 dark:hover:text-brand-400 transition-colors whitespace-nowrap ${activeTab === 'search' ? 'text-brand-600 dark:text-brand-400 ring-2 ring-brand-500/20 rounded-lg px-2' : ''}`}>Suche</button>
          <button id="nav-favorites" onClick={() => setActiveTab('favorites')} className={`p-2 md:px-0 hover:text-brand-600 dark:hover:text-brand-400 transition-colors whitespace-nowrap ${activeTab === 'favorites' ? 'text-brand-600 dark:text-brand-400 ring-2 ring-brand-500/20 rounded-lg px-2' : ''}`}>Favoriten</button>
          <button id="nav-templates" onClick={() => setActiveTab('templates')} className={`p-2 md:px-0 hover:text-brand-600 dark:hover:text-brand-400 transition-colors whitespace-nowrap ${activeTab === 'templates' ? 'text-brand-600 dark:text-brand-400 ring-2 ring-brand-500/20 rounded-lg px-2' : ''}`}>Vorlagen</button>
          <button id="nav-clients" onClick={() => setActiveTab('clients')} className={`p-2 md:px-0 hover:text-brand-600 dark:hover:text-brand-400 transition-colors whitespace-nowrap ${activeTab === 'clients' ? 'text-brand-600 dark:text-brand-400 ring-2 ring-brand-500/20 rounded-lg px-2' : ''}`}>Kunden</button>
          
          <div className="w-px h-4 bg-gray-200 dark:bg-slate-700 hidden md:block"></div>
          
          <button id="nav-settings" onClick={() => setActiveTab('settings')} className={`flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${activeTab === 'settings' ? 'bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 ring-2 ring-brand-500/20' : 'text-slate-900 dark:text-white'}`}>
            <Settings className="w-4 h-4" />
            <span className="hidden md:inline">Einstellungen</span>
          </button>
        </div>

        <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <button onClick={onBack} className="hidden md:block hover:text-slate-900 dark:hover:text-white transition-colors">Zur Website</button>
            <div className="pl-2 border-l border-gray-200 dark:border-slate-800"><ThemeToggle isDark={isDark} toggle={toggleTheme} /></div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Sidebar */}
        {activeTab !== 'settings' && activeTab !== 'clients' && (
          <aside className={`bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 overflow-hidden transition-all duration-300 ease-in-out hidden md:block shrink-0 ${isSidebarOpen ? 'w-72 border-r' : 'w-0 border-r-0'}`}>
              <div className="w-72 h-full overflow-y-auto p-6"> 
                {/* Filters Content */}
                <div className="mb-8">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">KZV-Region</label>
                    <div className="relative">
                        <select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)} className="w-full appearance-none bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all cursor-pointer">
                            {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"><ArrowLeft className="w-4 h-4 -rotate-90" /></div>
                    </div>
                </div>
                <div className="mb-8">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Labor-Typ</label>
                    <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${labType === 'gewerbe' ? 'border-brand-500 bg-brand-500' : 'border-gray-300 dark:border-slate-600 bg-transparent group-hover:border-brand-400'}`}>{labType === 'gewerbe' && <div className="w-2 h-2 bg-white rounded-full"></div>}</div>
                            <input type="radio" className="hidden" checked={labType === 'gewerbe'} onChange={() => setLabType('gewerbe')} />
                            <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">Gewerbelabor</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${labType === 'praxis' ? 'border-brand-500 bg-brand-500' : 'border-gray-300 dark:border-slate-600 bg-transparent group-hover:border-brand-400'}`}>{labType === 'praxis' && <div className="w-2 h-2 bg-white rounded-full"></div>}</div>
                            <input type="radio" className="hidden" checked={labType === 'praxis'} onChange={() => setLabType('praxis')} />
                            <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">Praxislabor</span>
                        </label>
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">BEL-Gruppe</label>
                    <div className="space-y-1">
                        {BEL_GROUPS.map(group => (
                            <button key={group.id} onClick={() => setSelectedGroup(group.id)} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedGroup === group.id ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 font-medium' : 'text-slate-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'}`}>
                                {group.label}
                            </button>
                        ))}
                    </div>
                </div>
              </div>
          </aside>
        )}

        {/* Main Content Area */}
        <main className={`flex-1 overflow-y-auto p-6 md:p-10 ${activeTab === 'settings' || activeTab === 'clients' ? 'w-full' : ''} pb-24`}>
            
            {/* View: Settings */}
            {activeTab === 'settings' && (
              <div className="max-w-2xl mx-auto animate-fade-in">
                 <div className="mb-10">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Einstellungen</h2>
                    <p className="text-slate-500 dark:text-slate-400">Verwalten Sie Ihre Labordaten und Rechnungsdetails.</p>
                 </div>
                 
                 <div className="space-y-6">
                    {/* Stammdaten */}
                    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                       <div className="flex items-start gap-4 mb-6">
                          <div className="p-3 bg-brand-50 dark:bg-brand-900/20 rounded-xl text-brand-600 dark:text-brand-400"><Building2 className="w-6 h-6" /></div>
                          <div><h3 className="text-lg font-bold text-slate-900 dark:text-white">Labor-Stammdaten</h3><p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Diese Daten erscheinen auf den generierten Rechnungen (PDF).</p></div>
                       </div>
                       <div className="grid md:grid-cols-2 gap-4">
                            <div className="md:col-span-2"><label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Laborname</label><input type="text" value={userSettings.labName} onChange={(e) => setUserSettings(prev => ({ ...prev, labName: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500" /></div>
                            <div className="md:col-span-2"><label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Ansprechpartner</label><input type="text" value={userSettings.name} onChange={(e) => setUserSettings(prev => ({ ...prev, name: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500" /></div>
                            <div className="md:col-span-2"><label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Straße & Nr.</label><input type="text" value={userSettings.street} onChange={(e) => setUserSettings(prev => ({ ...prev, street: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500" /></div>
                            <div><label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">PLZ</label><input type="text" value={userSettings.zip} onChange={(e) => setUserSettings(prev => ({ ...prev, zip: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500" /></div>
                            <div><label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Stadt</label><input type="text" value={userSettings.city} onChange={(e) => setUserSettings(prev => ({ ...prev, city: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500" /></div>
                            <div className="md:col-span-2"><label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">USt-IdNr.</label><input type="text" value={userSettings.taxId} onChange={(e) => setUserSettings(prev => ({ ...prev, taxId: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500" /></div>
                            <div className="md:col-span-2"><label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Gerichtsstand</label><div className="relative"><input type="text" value={userSettings.jurisdiction} onChange={(e) => setUserSettings(prev => ({ ...prev, jurisdiction: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="z.B. Amtsgericht Musterstadt" /><div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"><Scale className="w-4 h-4" /></div></div></div>
                       </div>
                    </div>

                    {/* Logo Upload (Premium) */}
                    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-100 to-transparent dark:from-amber-900/30 px-4 py-1 rounded-bl-xl text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Premium
                        </div>
                        <div className="flex items-start gap-4 mb-6">
                            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-amber-600 dark:text-amber-400"><ImageIcon className="w-6 h-6" /></div>
                            <div><h3 className="text-lg font-bold text-slate-900 dark:text-white">Firmenlogo</h3><p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Erscheint auf der Rechnung oben rechts.</p></div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 flex items-center justify-center overflow-hidden relative group">
                                {userSettings.logoUrl ? (
                                    <>
                                        <img src={userSettings.logoUrl} alt="Logo Preview" className="w-full h-full object-contain p-2" />
                                        <button onClick={() => setUserSettings(prev => ({...prev, logoUrl: null}))} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"><Trash2 className="w-5 h-5" /></button>
                                    </>
                                ) : (
                                    <span className="text-xs text-slate-400 text-center px-2">Kein Logo</span>
                                )}
                            </div>
                            <div className="flex-1">
                                <input type="file" ref={fileInputRef} onChange={handleLogoUpload} accept="image/png, image/jpeg, image/jpg" className="hidden" />
                                <Button onClick={() => fileInputRef.current?.click()} variant="secondary" size="sm" className="mb-2"><Upload className="w-4 h-4 mr-2" /> Bild hochladen</Button>
                                <p className="text-xs text-slate-400">Max. 500x500px, 3 MB. (JPG, PNG)</p>
                            </div>
                        </div>
                    </div>

                    {/* Bank Details */}
                    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600 dark:text-emerald-400"><CreditCard className="w-6 h-6" /></div>
                            <div><h3 className="text-lg font-bold text-slate-900 dark:text-white">Bankverbindung</h3><p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Wird in der Fußzeile der Rechnung angezeigt.</p></div>
                        </div>
                        <div className="space-y-4">
                            <div><label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Bankname</label><input type="text" value={userSettings.bankName} onChange={(e) => setUserSettings(prev => ({ ...prev, bankName: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="z.B. Sparkasse Musterstadt" /></div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div><label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">IBAN</label><input type="text" value={userSettings.iban} onChange={(e) => setUserSettings(prev => ({ ...prev, iban: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono" placeholder="DE00 0000 0000 0000 00" /></div>
                                <div><label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">BIC</label><input type="text" value={userSettings.bic} onChange={(e) => setUserSettings(prev => ({ ...prev, bic: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono" placeholder="ABCDEF12" /></div>
                            </div>
                        </div>
                    </div>

                    {/* Custom Positions Management */}
                    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                       <div className="flex items-center justify-between mb-6">
                           <div className="flex items-start gap-4">
                              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-purple-600 dark:text-purple-400"><PenTool className="w-6 h-6" /></div>
                              <div><h3 className="text-lg font-bold text-slate-900 dark:text-white">Eigenpositionen verwalten</h3><p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Eigene Nummern und Preise anlegen.</p></div>
                           </div>
                           <Button onClick={() => { setNewCustomPos({ id: '', name: '', price: 0 }); setShowCustomPosModal(true); }} size="sm" variant="secondary"><Plus className="w-4 h-4 mr-2" /> Neu</Button>
                       </div>
                       
                       <div className="space-y-2">
                           {customPositions.length === 0 && <p className="text-sm text-slate-400 italic text-center py-4">Keine eigenen Positionen vorhanden.</p>}
                           {customPositions.map(pos => (
                               <div key={pos.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 group">
                                   <div className="flex items-center gap-3">
                                       <span className="font-mono font-bold text-sm text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 px-2 py-1 rounded border border-gray-200 dark:border-slate-600">{pos.id}</span>
                                       <span className="font-medium text-slate-900 dark:text-white text-sm">{pos.name}</span>
                                   </div>
                                   <div className="flex items-center gap-4">
                                       <span className="font-bold text-slate-900 dark:text-white text-sm">{pos.price.toFixed(2)} €</span>
                                       <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                           <button onClick={() => editCustomPosition(pos)} className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-500"><Edit2 className="w-3.5 h-3.5" /></button>
                                           <button onClick={() => handleDeleteCustomPosition(pos.id)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                                       </div>
                                   </div>
                               </div>
                           ))}
                       </div>
                    </div>

                    {/* Invoice Config */}
                    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-start gap-4 mb-6"><div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400"><FileCheck className="w-6 h-6" /></div><div><h3 className="text-lg font-bold text-slate-900 dark:text-white">Rechnungskonfiguration</h3></div></div>
                        <div className="grid md:grid-cols-2 gap-6">
                             <div><label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Nächste Rechnungsnummer</label><div className="relative"><input type="text" value={userSettings.nextInvoiceNumber} onChange={(e) => setUserSettings(prev => ({ ...prev, nextInvoiceNumber: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono font-medium focus:outline-none focus:ring-2 focus:ring-brand-500" /></div></div>
                             <div><label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Globaler Faktor</label><input type="number" step="0.01" value={globalPriceFactor} onChange={(e) => setGlobalPriceFactor(parseFloat(e.target.value))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono font-medium focus:outline-none focus:ring-2 focus:ring-brand-500" /></div>
                        </div>
                    </div>

                    {/* Region */}
                    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex items-center justify-between">
                         <div className="flex items-center gap-4"><div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 dark:text-indigo-400"><MapPin className="w-6 h-6" /></div><div><h3 className="font-bold text-slate-900 dark:text-white">KZV-Region</h3><p className="text-xs text-slate-500">Basis für Höchstpreise</p></div></div>
                         <select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)} className="bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm">{REGIONS.map(r => <option key={r} value={r}>{r}</option>)}</select>
                    </div>

                    {/* Dark Mode & Onboarding */}
                    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                       <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400">
                                    {isDark ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
                                </div>
                                <div><h3 className="text-lg font-bold text-slate-900 dark:text-white">Dunkelmodus</h3><p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Erscheinungsbild anpassen.</p></div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={isDark} onChange={toggleTheme} />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-600"></div>
                            </label>
                       </div>
                       
                       <div className="border-t border-gray-100 dark:border-slate-800 pt-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-teal-50 dark:bg-teal-900/20 rounded-xl text-teal-600 dark:text-teal-400">
                                    <PlayCircle className="w-6 h-6" />
                                </div>
                                <div><h3 className="text-lg font-bold text-slate-900 dark:text-white">Hilfe & Tour</h3><p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Onboarding erneut starten.</p></div>
                            </div>
                            <Button variant="secondary" onClick={handleRestartOnboarding}>Tour starten</Button>
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {/* View: Clients */}
            {activeTab === 'clients' && (
                <div className="max-w-4xl mx-auto animate-fade-in">
                    <div className="flex items-center justify-between mb-8">
                        <div><h2 className="text-3xl font-bold text-slate-900 dark:text-white">Kundenverwaltung</h2></div>
                        <Button onClick={() => { setIsEditingRecipient(null); setNewRecipientData({ salutation: 'Herr', customerNumber: '' }); setShowRecipientModal(true); }}><Plus className="w-4 h-4 mr-2" /> Neuer Kunde</Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recipients.map(client => (
                            <div key={client.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm flex justify-between items-start group">
                                <div>
                                    <div className="flex items-center gap-2 mb-1"><h3 className="font-bold text-slate-900 dark:text-white">{client.practiceName || `${client.firstName} ${client.lastName}`}</h3><span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded font-mono">#{client.customerNumber}</span></div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{client.salutation} {client.title} {client.firstName} {client.lastName}</p>
                                    <div className="text-xs text-slate-400 mt-2 flex items-center gap-1"><MapPin className="w-3 h-3" />{client.street}, {client.zip} {client.city}</div>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => { startEditClient(client); setShowRecipientModal(true); }} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500"><Edit2 className="w-4 h-4" /></button>
                                    <button onClick={() => handleDeleteClient(client.id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-500"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* View: Templates */}
            {activeTab === 'templates' && (
                <div className="max-w-4xl mx-auto animate-fade-in">
                    <div className="flex items-center justify-between mb-8">
                        <div><h2 className="text-3xl font-bold text-slate-900 dark:text-white">Meine Vorlagen</h2><p className="text-slate-500 dark:text-slate-400 mt-1">Sparen Sie Zeit mit vordefinierten Positionsketten.</p></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {templates.map(template => (
                            <div key={template.id} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group relative flex flex-col h-full">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3"><div className="p-2 bg-brand-50 dark:bg-brand-900/20 rounded-lg text-brand-600 dark:text-brand-400"><Layout className="w-5 h-5" /></div><div><h3 className="font-bold text-slate-900 dark:text-white">{template.name}</h3><div className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded inline-block text-slate-500 mt-1">Faktor {template.factor.toFixed(2)}</div></div></div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handleEditTemplate(template)} className="text-slate-400 hover:text-brand-500 transition-colors opacity-0 group-hover:opacity-100"><Edit2 className="w-4 h-4" /></button>
                                        <button onClick={() => setTemplates(prev => prev.filter(t => t.id !== template.id))} className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-6 flex-1 content-start">
                                    {template.items.map((item, i) => (
                                        <div key={i} className={`group/item relative px-2.5 py-1 text-xs font-mono rounded-lg flex items-center gap-1 transition-colors cursor-pointer ${item.isAi ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30' : 'bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`} onClick={() => handleRemoveItemFromTemplate(template.id, i)}>
                                            {item.quantity > 1 && <span className="font-bold mr-1 text-slate-900 dark:text-white">{item.quantity}x</span>}
                                            {item.id}
                                            {item.isAi && <Sparkles className="w-2.5 h-2.5 text-purple-500" />}<X className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity ml-1" />
                                        </div>
                                    ))}
                                    <button onClick={() => setAddItemModal(template.id)} className="px-2 py-1 border border-dashed border-gray-300 dark:border-slate-600 text-xs text-slate-400 rounded-lg hover:border-brand-500 hover:text-brand-500 transition-colors"><Plus className="w-3 h-3" /></button>
                                </div>
                                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
                                    <div className="text-xs text-slate-500">{template.items.length} Positionen</div>
                                    <div className="flex flex-col items-end"><div className="font-bold text-slate-900 dark:text-white">{calculateTemplateTotal(template.items, template.factor).toFixed(2)} €</div><div className="text-[10px] text-slate-400">inkl. Faktor</div></div>
                                </div>
                                <div className="mt-4"><Button onClick={() => setInvoicePreview({ items: template.items, name: template.name, factor: template.factor })} variant="secondary" size="sm" className="w-full">In Rechnung übernehmen</Button></div>
                            </div>
                        ))}
                         <button onClick={() => { setCreateTemplateModal(true); setSelectedForTemplate([]); }} className="border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-400 hover:text-brand-500 hover:border-brand-500/50 hover:bg-brand-50/50 dark:hover:bg-brand-900/10 transition-all gap-3 min-h-[250px]">
                            <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-full"><Plus className="w-6 h-6" /></div><span className="font-medium">Manuelle Vorlage erstellen</span>
                         </button>
                    </div>
                </div>
            )}

            {/* View: Search & Favorites */}
            {(activeTab === 'search' || activeTab === 'favorites') && (
                <div className="max-w-4xl mx-auto animate-fade-in relative">
                    <div className="mb-10 text-center md:text-left">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{activeTab === 'favorites' ? 'Meine Favoriten' : 'BEL-Suche'}</h2>
                        <p className="text-slate-500 dark:text-slate-400">{activeTab === 'favorites' ? 'Ihre gespeicherten Positionen für schnellen Zugriff.' : 'Finden Sie BEL-Positionen nach Nummer oder Bezeichnung.'}</p>
                    </div>
                    <div className="relative mb-8">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Position suchen (z.B. 'Vollkrone' oder '1022')..." className="w-full pl-14 pr-14 py-4 rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-900 dark:text-white placeholder-slate-400" />
                        <button onClick={handleVoiceInput} className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-slate-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20'}`} title="Diktieren"><Mic className="w-5 h-5" /></button>
                    </div>
                    <div className="space-y-4 pb-20">
                        {filteredPositions.map(pos => (
                            <div key={pos.id} className={`group bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-center justify-between ${selectedForTemplate.includes(pos.id) ? 'border-brand-500 ring-1 ring-brand-500' : 'border-gray-100 dark:border-slate-800 hover:border-brand-200 dark:hover:border-brand-800'}`}>
                                <div className="flex items-center gap-4">
                                    <div onClick={() => toggleSelection(pos.id)} className={`w-6 h-6 rounded-md border flex items-center justify-center cursor-pointer transition-colors ${selectedForTemplate.includes(pos.id) ? 'bg-brand-500 border-brand-500 text-white' : 'border-gray-300 dark:border-slate-600 hover:border-brand-400'}`}>{selectedForTemplate.includes(pos.id) && <Check className="w-4 h-4" />}</div>
                                    <div className="w-16 h-12 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center font-mono font-bold text-slate-700 dark:text-slate-300 text-sm border border-gray-100 dark:border-slate-700">{pos.id}</div>
                                    <div><div className="font-bold text-slate-900 dark:text-white text-lg">{pos.name}</div><div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2"><span>Gruppe {pos.group || 'Eigenposition'}</span><span className="w-1 h-1 bg-slate-300 rounded-full"></span><span>{labType === 'gewerbe' ? 'Gewerbe' : 'Praxis'}</span></div></div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right"><div className="text-xl font-bold text-slate-900 dark:text-white">{(getPositionPrice(pos.id) * globalPriceFactor).toFixed(2)} €</div><div className="flex items-center justify-end gap-1 text-[10px] uppercase font-bold text-slate-400">{globalPriceFactor !== 1 && <span className="text-brand-500">x{globalPriceFactor}</span>}<span>Höchstpreis</span></div></div>
                                    <button onClick={() => toggleFavorite(pos.id)} className={`p-2 rounded-full transition-colors ${favorites.includes(pos.id) ? 'text-amber-400 bg-amber-50 dark:bg-amber-900/20' : 'text-slate-300 hover:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}><Star className={`w-6 h-6 ${favorites.includes(pos.id) ? 'fill-current' : ''}`} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {selectedForTemplate.length > 0 && (
                        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-6 animate-fade-in-up">
                            <div className="font-medium text-sm flex items-center gap-2"><span className="bg-white text-slate-900 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">{selectedForTemplate.length}</span> ausgewählt</div><div className="h-4 w-px bg-slate-700"></div><button onClick={() => setCreateTemplateModal(true)} className="flex items-center gap-2 hover:text-brand-300 transition-colors font-bold text-sm"><Layout className="w-4 h-4" /> Als Vorlage speichern</button><button onClick={clearSelection} className="text-slate-400 hover:text-white transition-colors p-1"><X className="w-4 h-4" /></button>
                        </div>
                    )}
                </div>
            )}
        </main>
      </div>

      {/* --- OVERLAYS / MODALS --- */}
      
      {/* Create Custom Position Modal */}
      {showCustomPosModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
             <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 p-6 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Eigenposition {newCustomPos.id ? 'bearbeiten' : 'anlegen'}</h3>
                    <button onClick={() => setShowCustomPosModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Positions-Nr. (z.B. E-100)</label>
                        <input autoFocus type="text" value={newCustomPos.id} onChange={(e) => setNewCustomPos({...newCustomPos, id: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-brand-500 focus:outline-none dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bezeichnung</label>
                        <input type="text" value={newCustomPos.name} onChange={(e) => setNewCustomPos({...newCustomPos, name: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-brand-500 focus:outline-none dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Preis (€)</label>
                        <input type="number" step="0.01" value={newCustomPos.price} onChange={(e) => setNewCustomPos({...newCustomPos, price: parseFloat(e.target.value)})} className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-brand-500 focus:outline-none dark:text-white" />
                    </div>
                </div>
                <div className="flex gap-3 mt-8">
                    <Button onClick={() => setShowCustomPosModal(false)} variant="secondary" className="flex-1 justify-center">Abbrechen</Button>
                    <Button onClick={handleSaveCustomPosition} className="flex-1 justify-center">Speichern</Button>
                </div>
             </div>
        </div>
      )}

      {/* Create Template Modal - With Quantity Input */}
      {createTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
             <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 p-6 max-h-[90vh] overflow-y-auto flex flex-col">
                <div className="flex justify-between items-center mb-6 shrink-0">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{editingTemplateId ? 'Vorlage bearbeiten' : 'Vorlage erstellen'}</h3>
                    <button onClick={() => { setCreateTemplateModal(false); setEditingTemplateId(null); setNewTemplateName(''); setNewTemplateItems([]); }} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                </div>
                
                <div className="space-y-6 flex-1 overflow-y-auto pr-1">
                    <div className="space-y-4">
                        <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name der Vorlage</label><input autoFocus type="text" placeholder="z.B. Reparatur UK" value={newTemplateName} onChange={(e) => setNewTemplateName(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-none dark:text-white" /></div>
                        <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Preisfaktor</label><div className="flex items-center gap-2"><input type="number" step="0.1" value={newTemplateFactor} onChange={(e) => setNewTemplateFactor(parseFloat(e.target.value))} className="w-24 px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-none dark:text-white" /><span className="text-xs text-slate-500">Standard: 1.0</span></div></div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-purple-100 dark:border-purple-500/20 relative overflow-hidden">
                        <div className="absolute top-3 right-3"><span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">PRO</span></div>
                        <div className="flex items-center gap-2 text-purple-800 dark:text-purple-300 font-bold text-sm mb-3"><Sparkles className="w-4 h-4" /> KI-Assistent</div>
                        {!isAiAnalyzing && aiSuggestions.length === 0 && (
                            <div className="text-center py-2"><p className="text-xs text-purple-700/70 dark:text-purple-300/70 mb-3">Basierend auf Ihrer Auswahl können wir fehlende Positionen ergänzen.</p><Button onClick={handleAiAnalysis} variant="secondary" size="sm" className="bg-white/50 border-purple-200 text-purple-700 hover:bg-white"><Wand2 className="w-3 h-3 mr-2" /> Vorschläge generieren</Button></div>
                        )}
                        {isAiAnalyzing && <div className="flex flex-col items-center justify-center py-4 text-purple-600 dark:text-purple-400"><Loader2 className="w-6 h-6 animate-spin mb-2" /><span className="text-xs font-medium">Analysiere...</span></div>}
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-800 overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-800 text-xs font-bold text-slate-500 uppercase tracking-wider flex justify-between"><span>Positionen & Menge</span><span>{newTemplateItems.length} Ges.</span></div>
                        <div className="max-h-60 overflow-y-auto p-2 space-y-1">
                            {newTemplateItems.map(item => (
                                <div key={item.id} className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono text-xs text-slate-500">{item.id}</span>
                                        <div className="flex flex-col"><span className="text-sm font-medium text-slate-700 dark:text-slate-200">{getPositionName(item.id)}</span>{item.isAi && <span className="text-[10px] text-purple-500 flex items-center gap-1"><Sparkles className="w-2 h-2" /> KI-Vorschlag</span>}</div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center border border-gray-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900">
                                            <input 
                                                type="number" 
                                                min="1" 
                                                value={item.quantity} 
                                                onChange={(e) => updateNewTemplateItemQuantity(item.id, parseInt(e.target.value) || 1)}
                                                className="w-12 text-center text-sm bg-transparent focus:outline-none dark:text-white p-1"
                                            />
                                        </div>
                                        <button onClick={() => toggleSelection(item.id)} className="text-slate-400 hover:text-red-500"><X className="w-3.5 h-3.5" /></button>
                                    </div>
                                </div>
                            ))}
                            {newTemplateItems.length === 0 && <div className="text-center py-6 text-slate-400 text-sm">Noch keine Positionen ausgewählt.</div>}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button onClick={() => { setCreateTemplateModal(false); setEditingTemplateId(null); setNewTemplateName(''); setNewTemplateItems([]); }} variant="secondary" className="flex-1 justify-center">Abbrechen</Button>
                        <Button onClick={handleSaveTemplate} className="flex-1 justify-center gap-2"><Save className="w-4 h-4" /> Speichern</Button>
                    </div>
                </div>
             </div>
        </div>
      )}

      {/* Add Item Modal */}
      {addItemModal !== null && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
             <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[60vh] border border-gray-200 dark:border-slate-800">
                 <div className="p-4 border-b dark:border-slate-700 flex justify-between items-center">
                     <h3 className="font-bold text-slate-900 dark:text-white">Position hinzufügen</h3>
                     <button onClick={() => setAddItemModal(null)}><X className="w-5 h-5 text-slate-400 dark:text-white"/></button>
                 </div>
                 <div className="p-4 flex gap-2">
                     <input 
                        className="flex-1 p-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none" 
                        placeholder="Suche..." 
                        value={addItemQuery} 
                        onChange={e => setAddItemQuery(e.target.value)} 
                        autoFocus
                     />
                     <Button onClick={() => { setNewCustomPos({ id: '', name: '', price: 0 }); setShowCustomPosModal(true); }} size="sm" variant="secondary" className="whitespace-nowrap"><Plus className="w-4 h-4" /> Eigenposition</Button>
                 </div>
                 <div className="overflow-y-auto p-2">
                     {filteredAddPositions.map(pos => (
                         <button key={pos.id} onClick={() => handleSelectItemForTemplate(pos.id)} className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded flex justify-between text-slate-700 dark:text-slate-300">
                             <div className="flex flex-col">
                                 <span className="font-medium">{pos.name}</span>
                                 <span className="text-xs text-slate-400">{pos.id}</span>
                             </div>
                             <span className="font-mono">{pos.price.toFixed(2)}€</span>
                         </button>
                     ))}
                     {filteredAddPositions.length === 0 && (
                         <div className="text-center py-4 text-slate-400 text-sm">Keine Treffer.</div>
                     )}
                 </div>
             </div>
         </div>
      )}

      {/* Recipient / Client Selection Modal */}
      {showRecipientModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
              <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
                  <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
                      <h3 className="font-bold text-xl text-slate-900 dark:text-white">{isEditingRecipient ? 'Kunde bearbeiten' : invoicePreview ? 'Rechnungsempfänger wählen' : 'Neuer Kunde'}</h3>
                      <button onClick={() => { setShowRecipientModal(false); setIsEditingRecipient(null); }}><X className="w-6 h-6 text-slate-400" /></button>
                  </div>
                  <div className="p-6 overflow-y-auto">
                      {!isEditingRecipient && invoicePreview && (
                          <div className="mb-8">
                              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Gespeicherten Kunden wählen</label>
                              <select value={selectedRecipientId} onChange={(e) => setSelectedRecipientId(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500">
                                  <option value="">Bitte wählen...</option>
                                  {recipients.map(r => (<option key={r.id} value={r.id}>{r.practiceName || `${r.lastName}, ${r.firstName}`} ({r.city})</option>))}
                                  <option value="new">+ Neuen Kunden anlegen</option>
                              </select>
                          </div>
                      )}
                      {(isEditingRecipient || !invoicePreview || selectedRecipientId === 'new') && (
                          <div className="space-y-5 animate-fade-in bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-gray-100 dark:border-slate-800">
                              <div><label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Kundennummer</label><input type="text" placeholder="z.B. 10050" value={newRecipientData.customerNumber || ''} onChange={e => setNewRecipientData({...newRecipientData, customerNumber: e.target.value})} className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 font-medium" /></div>
                              <div className="grid grid-cols-2 gap-4">
                                  <div><label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Anrede</label><select value={newRecipientData.salutation} onChange={e => setNewRecipientData({...newRecipientData, salutation: e.target.value})} className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"><option value="Herr">Herr</option><option value="Frau">Frau</option><option value="">Keine</option></select></div>
                                  <div><label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Titel (opt)</label><input type="text" value={newRecipientData.title || ''} onChange={e => setNewRecipientData({...newRecipientData, title: e.target.value})} className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500" placeholder="Dr. / Dr. med." /></div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                  <div><label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Vorname</label><input type="text" placeholder="Vorname" value={newRecipientData.firstName || ''} onChange={e => setNewRecipientData({...newRecipientData, firstName: e.target.value})} className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500" /></div>
                                  <div><label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Nachname</label><input type="text" placeholder="Nachname" value={newRecipientData.lastName || ''} onChange={e => setNewRecipientData({...newRecipientData, lastName: e.target.value})} className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500" /></div>
                              </div>
                              <div><label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Praxisname (optional)</label><input type="text" placeholder="Praxis Dr. Beispiel" value={newRecipientData.practiceName || ''} onChange={e => setNewRecipientData({...newRecipientData, practiceName: e.target.value})} className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500" /></div>
                              <div><label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Straße & Nr.</label><input type="text" placeholder="Straße & Nr." value={newRecipientData.street || ''} onChange={e => setNewRecipientData({...newRecipientData, street: e.target.value})} className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500" /></div>
                              <div className="grid grid-cols-3 gap-4">
                                  <div><label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">PLZ</label><input type="text" placeholder="PLZ" value={newRecipientData.zip || ''} onChange={e => setNewRecipientData({...newRecipientData, zip: e.target.value})} className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500" /></div>
                                  <div className="col-span-2"><label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Ort</label><input type="text" placeholder="Ort" value={newRecipientData.city || ''} onChange={e => setNewRecipientData({...newRecipientData, city: e.target.value})} className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500" /></div>
                              </div>
                          </div>
                      )}
                  </div>
                  <div className="p-6 bg-slate-50 dark:bg-slate-950 border-t border-gray-100 dark:border-slate-800 flex justify-end gap-3">
                      {invoicePreview ? (<>{selectedRecipientId === 'new' ? (<Button onClick={handleSaveClient}>Kunde speichern & weiter</Button>) : (<Button onClick={handleGenerateInvoice} disabled={!selectedRecipientId}>PDF generieren</Button>)}</>) : (<Button onClick={handleSaveClient}>Speichern</Button>)}
                  </div>
              </div>
          </div>
      )}

      {/* Final Invoice PDF View */}
      {showFinalInvoice && (
        <div className="fixed inset-0 z-[60] bg-slate-800/90 backdrop-blur-sm overflow-y-auto p-4 md:p-8 flex items-start justify-center">
            <div className="bg-white text-black w-full max-w-[210mm] min-h-[297mm] shadow-2xl p-[20mm] relative flex flex-col justify-between">
                <button onClick={() => setShowFinalInvoice(null)} className="absolute top-4 right-4 print:hidden p-2 bg-gray-100 hover:bg-red-100 text-slate-500 hover:text-red-500 rounded-full"><X className="w-6 h-6"/></button>
                
                {/* Invoice Content */}
                <div>
                    <div className="flex justify-between items-start mb-16">
                        <div>
                            <div className="text-xs text-slate-500 underline mb-2">{userSettings.labName} • {userSettings.street} • {userSettings.zip} {userSettings.city}</div>
                            <div className="text-sm font-medium text-black mt-4">
                                {showFinalInvoice.recipient.practiceName && <div className="font-bold">{showFinalInvoice.recipient.practiceName}</div>}
                                <div>{showFinalInvoice.recipient.salutation} {showFinalInvoice.recipient.title} {showFinalInvoice.recipient.firstName} {showFinalInvoice.recipient.lastName}</div>
                                <div>{showFinalInvoice.recipient.street}</div>
                                <div>{showFinalInvoice.recipient.zip} {showFinalInvoice.recipient.city}</div>
                            </div>
                        </div>
                        <div className="text-right">
                            {/* Logo */}
                            <div className="mb-6 flex justify-end">
                                {userSettings.logoUrl ? (
                                    <img src={userSettings.logoUrl} alt="Firmenlogo" className="max-h-24 max-w-[200px] object-contain" />
                                ) : (
                                    <div className="flex items-center gap-2 text-slate-800 opacity-50">
                                        <div className="w-8 h-8 bg-slate-200 rounded flex items-center justify-center">
                                            <FlaskConical className="w-5 h-5" />
                                        </div>
                                        <span className="font-bold text-xl">Labrechner</span>
                                    </div>
                                )}
                            </div>

                            <h1 className="text-2xl font-bold text-black mb-4">RECHNUNG</h1>
                            <table className="text-sm ml-auto text-black">
                                <tbody>
                                    <tr><td className="text-slate-500 pr-4">Rechnungs-Nr.:</td><td className="font-mono font-medium">{showFinalInvoice.invoiceNumber}</td></tr>
                                    <tr><td className="text-slate-500 pr-4">Datum:</td><td>{showFinalInvoice.date}</td></tr>
                                    <tr><td className="text-slate-500 pr-4">Kunden-Nr.:</td><td>{showFinalInvoice.recipient.customerNumber || '-'}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <table className="w-full text-left text-sm mb-12 text-black">
                        <thead className="border-b-2 border-black">
                            <tr><th className="py-2 w-16 text-black">Pos.</th><th className="py-2 text-black">Leistung</th><th className="py-2 text-right text-black w-16">Menge</th><th className="py-2 text-right text-black">Einzelpreis</th><th className="py-2 text-right text-black">Faktor</th><th className="py-2 text-right text-black">Gesamt</th></tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {showFinalInvoice.items.map((item, i) => {
                                const price = getPositionPrice(item.id);
                                const total = price * item.quantity * showFinalInvoice.factor;
                                return (
                                    <tr key={i}>
                                        <td className="py-2 font-mono text-black">{item.id}</td>
                                        <td className="py-2 text-black">{getPositionName(item.id)}</td>
                                        <td className="py-2 text-right text-black font-bold">{item.quantity}</td>
                                        <td className="py-2 text-right text-black">{price.toFixed(2)} €</td>
                                        <td className="py-2 text-right text-black">{showFinalInvoice.factor.toFixed(2)}</td>
                                        <td className="py-2 text-right font-medium text-black">{total.toFixed(2)} €</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <div className="flex justify-end mb-20">
                        <table className="text-sm w-64 text-black">
                            <tbody>
                                <tr><td className="py-1 text-slate-500">Summe Netto</td><td className="py-1 text-right">{calculateTemplateTotal(showFinalInvoice.items, showFinalInvoice.factor).toFixed(2)} €</td></tr>
                                <tr><td className="py-1 text-slate-500">Umsatzsteuer 7%</td><td className="py-1 text-right">{(calculateTemplateTotal(showFinalInvoice.items, showFinalInvoice.factor) * 0.07).toFixed(2)} €</td></tr>
                                <tr className="border-t border-black font-bold text-lg"><td className="py-3 text-black">Gesamtbetrag</td><td className="py-3 text-right text-black">{(calculateTemplateTotal(showFinalInvoice.items, showFinalInvoice.factor) * 1.07).toFixed(2)} €</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer with Bank Details & Jurisdiction */}
                <div className="text-xs text-slate-500 flex justify-between border-t border-slate-200 pt-4 pb-4">
                     <div>
                         <div className="font-bold text-black mb-1">{userSettings.labName}</div>
                         <div>{userSettings.street}, {userSettings.zip} {userSettings.city}</div>
                         <div>Geschäftsführer: {userSettings.name}</div>
                     </div>
                     <div className="text-right">
                         <div>USt-IdNr.: {userSettings.taxId}</div>
                         {userSettings.jurisdiction && <div>Gerichtsstand: {userSettings.jurisdiction}</div>}
                         <div className="mt-1 font-medium text-black">Bankverbindung:</div>
                         <div>{userSettings.bankName || 'Bank nicht hinterlegt'}</div>
                         <div className="font-mono">IBAN: {userSettings.iban || '-'}</div>
                         <div className="font-mono">BIC: {userSettings.bic || '-'}</div>
                     </div>
                </div>
                
                <div className="absolute top-4 left-1/2 -translate-x-1/2 print:hidden flex gap-4">
                     <Button onClick={() => window.print()} className="shadow-xl"><Printer className="w-4 h-4 mr-2" /> Drucken / PDF speichern</Button>
                </div>
            </div>
        </div>
      )}

      {/* Invoice Preview Modal */}
      {invoicePreview !== null && !showFinalInvoice && !showRecipientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
                    <div className="flex items-center gap-3"><div className="p-2.5 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-xl"><FileText className="w-6 h-6" /></div><div><h3 className="font-bold text-xl text-slate-900 dark:text-white">Rechnungs-Vorschau</h3><p className="text-sm text-slate-500 dark:text-slate-400">Vorlage: {invoicePreview.name}</p></div></div>
                    <button onClick={() => setInvoicePreview(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-slate-500"><X className="w-6 h-6" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                   <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead><tr className="border-b border-gray-200 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider"><th className="p-4 w-16">Nr.</th><th className="p-4">Leistung</th><th className="p-4 text-right w-16">Menge</th><th className="p-4 text-right">Einzel</th><th className="p-4 text-right">Faktor</th></tr></thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                                {invoicePreview.items.map((item, idx) => (
                                    <tr key={idx} className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 ${item.isAi ? 'bg-purple-50/30 dark:bg-purple-900/10' : ''}`}>
                                        <td className="p-4 font-mono text-sm text-slate-500 dark:text-slate-400">{item.id}</td>
                                        <td className="p-4 font-medium text-slate-900 dark:text-white flex items-center gap-2">{getPositionName(item.id)}{item.isAi && <span className="text-[10px] bg-purple-100 text-purple-700 px-1 rounded">KI</span>}</td>
                                        <td className="p-4 text-right text-slate-600 dark:text-slate-300 font-bold">{item.quantity}</td>
                                        <td className="p-4 text-right text-slate-600 dark:text-slate-300">{(getPositionPrice(item.id) * invoicePreview.factor).toFixed(2)} €</td>
                                        <td className="p-4 text-right text-xs text-slate-400">{invoicePreview.factor !== 1 ? `x${invoicePreview.factor}` : '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                   </div>
                </div>
                <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col gap-4">
                    <div className="flex items-center justify-between"><span className="text-slate-500 dark:text-slate-400 font-medium">Gesamtsumme (Netto)</span><span className="text-3xl font-bold text-brand-600 dark:text-brand-400">{calculateTemplateTotal(invoicePreview.items, invoicePreview.factor).toFixed(2)} €</span></div>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <Button variant="secondary" onClick={() => setInvoicePreview(null)}>Zurück</Button>
                        <Button onClick={() => { setShowRecipientModal(true); setSelectedRecipientId(''); }} className="gap-2"><Printer className="w-4 h-4" /> Rechnung erstellen</Button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};