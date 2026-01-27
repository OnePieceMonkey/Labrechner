'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  FileText,
  Plus,
  Download,
  Eye,
  Trash2,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Filter,
  ChevronDown,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { Invoice, InvoiceItem, Client } from '@/types/database';
import type { InvoiceWithItems } from '@/hooks/useInvoices';

interface InvoicesViewProps {
  invoices: InvoiceWithItems[];
  clients: Client[];
  loading: boolean;
  onCreateInvoice: () => void;
  onEditInvoice: (invoice: InvoiceWithItems) => void;
  onDeleteInvoice: (id: string) => void;
  onDownloadPDF: (invoice: Invoice, items: InvoiceItem[]) => void;
  onOpenPreview: (invoice: Invoice, items: InvoiceItem[]) => void;
  onRequestPreviewUrl: (invoice: Invoice, items: InvoiceItem[]) => Promise<string | null>;
  onStatusChange: (id: string, status: Invoice['status']) => void;
}

const statusConfig = {
  draft: {
    label: 'Entwurf',
    color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    accent: 'border-gray-200 dark:border-gray-700',
    iconColor: 'text-gray-500',
    icon: FileText,
  },
  sent: {
    label: 'Gesendet',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    accent: 'border-blue-200 dark:border-blue-700/60',
    iconColor: 'text-blue-600 dark:text-blue-300',
    icon: Send,
  },
  paid: {
    label: 'Bezahlt',
    color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    accent: 'border-green-200 dark:border-green-700/60',
    iconColor: 'text-green-600 dark:text-green-300',
    icon: CheckCircle,
  },
  overdue: {
    label: 'Überfällig',
    color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    accent: 'border-red-200 dark:border-red-700/60',
    iconColor: 'text-red-600 dark:text-red-300',
    icon: AlertCircle,
  },
  cancelled: {
    label: 'Storniert',
    color: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500',
    accent: 'border-gray-200 dark:border-gray-700',
    iconColor: 'text-gray-500',
    icon: X,
  },
};

type FilterStatus = 'all' | Invoice['status'];

export function InvoicesView({
  invoices,
  clients,
  loading,
  onCreateInvoice,
  onEditInvoice,
  onDeleteInvoice,
  onDownloadPDF,
  onOpenPreview,
  onRequestPreviewUrl,
  onStatusChange,
}: InvoicesViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [showStatusMenu, setShowStatusMenu] = useState<string | null>(null);

  // Statistiken berechnen
  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = invoices.filter((i) => {
      const date = new Date(i.invoice_date);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    });

    return {
      total: invoices.length,
      draft: invoices.filter((i) => i.status === 'draft').length,
      sent: invoices.filter((i) => i.status === 'sent').length,
      paid: invoices.filter((i) => i.status === 'paid').length,
      overdue: invoices.filter((i) => i.status === 'overdue').length,
      thisMonthTotal: thisMonth.reduce((sum, i) => sum + Number(i.total), 0),
      paidTotal: invoices
        .filter((i) => i.status === 'paid')
        .reduce((sum, i) => sum + Number(i.total), 0),
      pendingTotal: invoices
        .filter((i) => ['sent', 'overdue'].includes(i.status))
        .reduce((sum, i) => sum + Number(i.total), 0),
    };
  }, [invoices]);

  // Gefilterte Rechnungen
  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      // Status Filter
      if (statusFilter !== 'all' && invoice.status !== statusFilter) {
        return false;
      }

      // Suche
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const client = clients.find((c) => c.id === invoice.client_id);
        const searchFields = [
          invoice.invoice_number,
          client?.last_name,
          client?.first_name,
          client?.practice_name,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        if (!searchFields.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [invoices, clients, statusFilter, searchQuery]);

  // Hilfsfunktionen
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getClientName = (clientId: string | null) => {
    if (!clientId) return 'Kein Kunde';
    const client = clients.find((c) => c.id === clientId);
    if (!client) return 'Unbekannt';
    return client.practice_name || `${client.first_name || ''} ${client.last_name}`.trim();
  };

  const PdfThumbnail = ({ invoice }: { invoice: InvoiceWithItems }) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
      let active = true;
      onRequestPreviewUrl(invoice, invoice.items)
        .then((url) => {
          if (active) setPreviewUrl(url);
        })
        .catch(() => {
          if (active) setPreviewUrl(null);
        });
      return () => {
        active = false;
      };
    }, [invoice.id, onRequestPreviewUrl]);

    return (
      <div className="w-16 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-center">
        {previewUrl ? (
          <object
            data={previewUrl}
            type="application/pdf"
            className="w-full h-full pointer-events-none"
          />
        ) : (
          <FileText className="w-6 h-6 text-gray-400" />
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistik-Karten */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">Diesen Monat</div>
          <div className="text-2xl font-bold text-brand-600">{formatCurrency(stats.thisMonthTotal)}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">Offen</div>
          <div className="text-2xl font-bold text-orange-500">{formatCurrency(stats.pendingTotal)}</div>
          <div className="text-xs text-gray-400">{stats.sent + stats.overdue} Rechnungen</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">Bezahlt</div>
          <div className="text-2xl font-bold text-green-500">{formatCurrency(stats.paidTotal)}</div>
          <div className="text-xs text-gray-400">{stats.paid} Rechnungen</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">Entwürfe</div>
          <div className="text-2xl font-bold text-gray-500">{stats.draft}</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-1 gap-4">
          {/* Suche */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechnung oder Kunde suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <button
              onClick={() => setShowStatusMenu(showStatusMenu ? null : 'filter')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Filter className="w-4 h-4" />
              <span>{statusFilter === 'all' ? 'Alle' : statusConfig[statusFilter].label}</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {showStatusMenu === 'filter' && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 overflow-hidden">
                <button
                  onClick={() => {
                    setStatusFilter('all');
                    setShowStatusMenu(null);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                >
                  Alle ({invoices.length})
                </button>
                {(Object.keys(statusConfig) as Invoice['status'][]).map((status) => {
                  const config = statusConfig[status];
                  const count = invoices.filter((i) => i.status === status).length;
                  return (
                    <button
                      key={status}
                      onClick={() => {
                        setStatusFilter(status);
                        setShowStatusMenu(null);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-200"
                    >
                      <config.icon className="w-4 h-4" />
                      <span>
                        {config.label} ({count})
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <Button variant="primary" onClick={onCreateInvoice}>
          <Plus className="w-4 h-4 mr-2" />
          Neue Rechnung
        </Button>
      </div>

      {/* Rechnungsliste */}
      {filteredInvoices.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">Keine Rechnungen</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchQuery || statusFilter !== 'all'
              ? 'Keine Rechnungen gefunden mit diesen Filtern.'
              : 'Erstellen Sie Ihre erste Rechnung.'}
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <Button variant="primary" onClick={onCreateInvoice}>
              <Plus className="w-4 h-4 mr-2" />
              Rechnung erstellen
            </Button>
          )}
        </div>
      ) : (
                <div className="space-y-3">
          {filteredInvoices.map((invoice) => {
            const config = statusConfig[invoice.status];
            const StatusIcon = config.icon;

            return (
              <div
                key={invoice.id}
                className={`flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-xl border ${config.accent} bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all cursor-pointer`}
                onClick={() => onEditInvoice(invoice)}
                title="Klicken zum Bearbeiten"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <PdfThumbnail invoice={invoice} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {invoice.invoice_number}
                      </div>
                      <span className="text-xs text-gray-400">
                        {invoice.items.length} Position{invoice.items.length !== 1 && 'en'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {getClientName(invoice.client_id)}
                    </div>
                    {invoice.patient_name && (
                      <div className="text-xs text-gray-400">Patient: {invoice.patient_name}</div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="text-right">
                    <div className="font-bold text-gray-900 dark:text-white">
                      {formatCurrency(Number(invoice.total))}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(invoice.invoice_date)}
                    </div>
                  </div>

                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowStatusMenu(showStatusMenu === invoice.id ? null : invoice.id);
                      }}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}
                    >
                      <StatusIcon className={`w-3.5 h-3.5 ${config.iconColor}`} />
                      {config.label}
                      <ChevronDown className="w-3 h-3" />
                    </button>

                    {showStatusMenu === invoice.id && (
                      <div className="absolute top-full left-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 overflow-hidden">
                        {(Object.keys(statusConfig) as Invoice['status'][]).map((status) => {
                          const statusCfg = statusConfig[status];
                          return (
                            <button
                              key={status}
                              onClick={(e) => {
                                e.stopPropagation();
                                onStatusChange(invoice.id, status);
                                setShowStatusMenu(null);
                              }}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-200"
                            >
                              <statusCfg.icon className="w-4 h-4" />
                              {statusCfg.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenPreview(invoice, invoice.items);
                      }}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                      title="Vorschau"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDownloadPDF(invoice, invoice.items);
                      }}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                      title="Herunterladen"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    {invoice.status === 'draft' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Rechnung wirklich l?schen?')) {
                            onDeleteInvoice(invoice.id);
                          }
                        }}
                        className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600"
                        title="L?schen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* Click outside handler */}
      {showStatusMenu && (
        <div className="fixed inset-0 z-0" onClick={() => setShowStatusMenu(null)} />
      )}
    </div>
  );
}

export default InvoicesView;
