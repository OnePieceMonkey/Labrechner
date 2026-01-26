'use client';

import { useState, useMemo, useEffect, Fragment } from 'react';
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
import { usePDFGenerator } from '@/hooks/usePDFGenerator';
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
  onPreviewPDF: (invoice: Invoice, items: InvoiceItem[]) => void;
  onStatusChange: (id: string, status: Invoice['status']) => void;
  highlightInvoiceId?: string | null;
}

const statusConfig = {
  draft: {
    label: 'Entwurf',
    color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    accent: 'bg-gray-400',
    icon: FileText,
  },
  sent: {
    label: 'Gesendet',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    accent: 'bg-blue-500',
    icon: Send,
  },
  paid: {
    label: 'Bezahlt',
    color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    accent: 'bg-green-500',
    icon: CheckCircle,
  },
  overdue: {
    label: '\u00dcberf\u00e4llig',
    color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    accent: 'bg-red-500',
    icon: AlertCircle,
  },
  cancelled: {
    label: 'Storniert',
    color: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500',
    accent: 'bg-gray-300 dark:bg-gray-600',
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
  onPreviewPDF,
  onStatusChange,
  highlightInvoiceId,
}: InvoicesViewProps) {
  const { generatePDFBlob } = usePDFGenerator();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [showStatusMenu, setShowStatusMenu] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewInvoiceId, setPreviewInvoiceId] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;
    let nextUrl: string | null = null;

    const buildPreview = async () => {
      try {
        if (!highlightInvoiceId) {
          setPreviewUrl(null);
          setPreviewInvoiceId(null);
          return;
        }

        const invoice = invoices.find((i) => i.id === highlightInvoiceId);
        if (!invoice) return;

        const blob = await generatePDFBlob(invoice, invoice.items);
        if (!isActive) return;

        nextUrl = URL.createObjectURL(blob);
        setPreviewUrl(nextUrl);
        setPreviewInvoiceId(invoice.id);
      } catch (err) {
        console.error('PDF-Vorschau konnte nicht erstellt werden:', err);
      }
    };

    buildPreview();

    return () => {
      isActive = false;
      if (nextUrl) {
        URL.revokeObjectURL(nextUrl);
      }
    };
  }, [highlightInvoiceId, invoices, generatePDFBlob]);

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
          client?.email,
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

  const sortedInvoices = useMemo(() => {
    const toTimestamp = (value?: string | null) => {
      if (!value) return 0;
      const ts = Date.parse(value);
      return Number.isNaN(ts) ? 0 : ts;
    };

    return [...filteredInvoices].sort((a, b) => {
      const dateDiff = toTimestamp(b.invoice_date) - toTimestamp(a.invoice_date);
      if (dateDiff !== 0) return dateDiff;
      const createdDiff = toTimestamp(b.created_at) - toTimestamp(a.created_at);
      if (createdDiff !== 0) return createdDiff;
      return String(b.invoice_number || '').localeCompare(String(a.invoice_number || ''), 'de');
    });
  }, [filteredInvoices]);

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

  const getClientEmail = (clientId: string | null) => {
    if (!clientId) return null;
    const client = clients.find((c) => c.id === clientId);
    return client?.email || null;
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
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-slate-700 dark:text-slate-100 font-medium"
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
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Rechnung
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Kunde
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Datum
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Betrag
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {sortedInvoices.map((invoice) => {
                  const config = statusConfig[invoice.status];
                  const StatusIcon = config.icon;
                  const isHighlighted = highlightInvoiceId === invoice.id;
                  const clientEmail = getClientEmail(invoice.client_id);

                  return (
                    <Fragment key={invoice.id}>
                      <tr
                        className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors ${
                          isHighlighted ? 'bg-amber-50/70 dark:bg-amber-900/20' : ''
                        }`}
                        onClick={() => onEditInvoice(invoice)}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onPreviewPDF(invoice, invoice.items);
                        }}
                        title="Doppelklick für PDF-Vorschau"
                      >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-1.5 h-10 rounded-full ${config.accent}`} />
                          <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded text-red-600">
                             <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {invoice.invoice_number}
                            </div>
                            <div className="text-sm text-gray-500">
                              {invoice.items.length} Position{invoice.items.length !== 1 && 'en'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-gray-900 dark:text-white">
                          {getClientName(invoice.client_id)}
                        </div>
                        {clientEmail && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {clientEmail}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-gray-900 dark:text-white">
                          {invoice.patient_name || '-'}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-gray-900 dark:text-white">
                          {formatDate(invoice.invoice_date)}
                        </div>
                        {invoice.due_date && invoice.status === 'sent' && (
                          <div className="text-sm text-gray-500">
                            Fällig: {formatDate(invoice.due_date)}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowStatusMenu(showStatusMenu === invoice.id ? null : invoice.id);
                            }}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}
                          >
                            <StatusIcon className="w-3.5 h-3.5" />
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
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(Number(invoice.total))}
                        </div>
                        <div className="text-sm text-gray-500">
                          inkl. {invoice.tax_rate}% MwSt.
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onPreviewPDF(invoice, invoice.items);
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
                                if (confirm('Rechnung wirklich löschen?')) {
                                  onDeleteInvoice(invoice.id);
                                }
                              }}
                              className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600"
                              title="Löschen"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                      </tr>
                      {isHighlighted && previewUrl && previewInvoiceId === invoice.id && (
                        <tr className="bg-amber-50/40 dark:bg-amber-900/10">
                          <td colSpan={7} className="px-4 pb-4">
                            <div className="rounded-lg border border-amber-200/60 dark:border-amber-800/40 bg-white dark:bg-slate-900 overflow-hidden">
                              <iframe
                                src={previewUrl}
                                className="w-full h-48"
                                title={`Vorschau ${invoice.invoice_number}`}
                              />
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
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
