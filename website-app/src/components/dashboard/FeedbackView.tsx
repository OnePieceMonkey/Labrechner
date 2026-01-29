'use client';

import React, { useEffect, useState } from 'react';
import { Star, MessageSquare, Bug, Lightbulb, HelpCircle, ThumbsUp, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/hooks/useUser';

type FeedbackType = 'general' | 'bug' | 'feature' | 'question' | 'praise' | 'other';

const FEEDBACK_TYPES: Array<{ value: FeedbackType; label: string; icon: React.ReactNode }> = [
  { value: 'general', label: 'Allgemein', icon: <MessageSquare className="w-4 h-4" /> },
  { value: 'bug', label: 'Bug', icon: <Bug className="w-4 h-4" /> },
  { value: 'feature', label: 'Idee', icon: <Lightbulb className="w-4 h-4" /> },
  { value: 'question', label: 'Frage', icon: <HelpCircle className="w-4 h-4" /> },
  { value: 'praise', label: 'Lob', icon: <ThumbsUp className="w-4 h-4" /> },
  { value: 'other', label: 'Sonstiges', icon: <MessageSquare className="w-4 h-4" /> },
];

interface FeedbackFormProps {
  source?: 'modal' | 'page';
  onSuccess?: () => void;
  compact?: boolean;
}

function FeedbackForm({ source = 'page', onSuccess, compact = false }: FeedbackFormProps) {
  const { user } = useUser();
  const [rating, setRating] = useState<number | null>(null);
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('general');
  const [message, setMessage] = useState('');
  const [answerGood, setAnswerGood] = useState('');
  const [answerMissing, setAnswerMissing] = useState('');
  const [answerQuestions, setAnswerQuestions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setSubmitError('Bitte zuerst einloggen.');
      return;
    }
    if (!message.trim()) {
      setSubmitError('Bitte eine kurze Nachricht eingeben.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const supabase = createClient();
      const payload = {
        user_id: user.id,
        email: user.email,
        rating: rating ?? null,
        feedback_type: feedbackType,
        message: message.trim(),
        answers: {
          was_gut: answerGood.trim() || null,
          was_fehlt: answerMissing.trim() || null,
          fragen: answerQuestions.trim() || null,
        },
        source,
        page_url: typeof window !== 'undefined' ? window.location.pathname : null,
        context: typeof window !== 'undefined'
          ? {
              userAgent: navigator.userAgent,
              screen: `${window.innerWidth}x${window.innerHeight}`,
            }
          : null,
      };

      const { error } = await (supabase as any)
        .from('beta_feedback')
        .insert(payload);

      if (error) throw error;

      setSubmitSuccess('Danke! Dein Feedback ist angekommen.');
      setMessage('');
      setAnswerGood('');
      setAnswerMissing('');
      setAnswerQuestions('');
      setRating(null);
      setFeedbackType('general');
      if (onSuccess) onSuccess();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Feedback konnte nicht gesendet werden.';
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Worum geht es?
        </label>
        <div className="flex flex-wrap gap-2">
          {FEEDBACK_TYPES.map((t) => (
            <button
              type="button"
              key={t.value}
              onClick={() => setFeedbackType(t.value)}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-colors ${
                feedbackType === t.value
                  ? 'bg-brand-50 dark:bg-brand-900/20 border-brand-300 text-brand-700 dark:text-brand-300'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Wie zufrieden bist du?
        </label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              type="button"
              key={value}
              onClick={() => setRating(value)}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label={`${value} Sterne`}
            >
              <Star
                className={`w-6 h-6 ${rating && value <= rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300 dark:text-slate-600'}`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Dein Feedback
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={compact ? 4 : 5}
          placeholder="Was sollen wir verbessern oder beibehalten?"
          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
        />
      </div>

      {!compact && (
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Was läuft schon richtig gut?
            </label>
            <textarea
              value={answerGood}
              onChange={(e) => setAnswerGood(e.target.value)}
              rows={3}
              placeholder="z.B. Suche, PDF-Ansicht, Templates…"
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Was fehlt dir noch?
            </label>
            <textarea
              value={answerMissing}
              onChange={(e) => setAnswerMissing(e.target.value)}
              rows={3}
              placeholder="z.B. Export, neue Funktion, Report…"
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
            />
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Offene Fragen?
        </label>
        <textarea
          value={answerQuestions}
          onChange={(e) => setAnswerQuestions(e.target.value)}
          rows={compact ? 3 : 4}
          placeholder="Schreib uns deine Fragen oder Unsicherheiten."
          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
        />
      </div>

      {submitError && <p className="text-sm text-red-500">{submitError}</p>}
      {submitSuccess && <p className="text-sm text-green-600">{submitSuccess}</p>}

      <div className="flex items-center justify-end gap-3">
        <Button
          variant="secondary"
          type="button"
          onClick={() => {
            setMessage('');
            setAnswerGood('');
            setAnswerMissing('');
            setAnswerQuestions('');
            setRating(null);
            setFeedbackType('general');
            setSubmitError(null);
            setSubmitSuccess(null);
          }}
        >
          Zuruecksetzen
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Senden...' : 'Feedback senden'}
        </Button>
      </div>
    </form>
  );
}

type FeedbackRow = {
  id: string;
  email: string | null;
  rating: number | null;
  feedback_type: FeedbackType | null;
  message: string;
  answers: Record<string, string | null> | null;
  status: 'new' | 'triaged' | 'resolved' | 'wontfix' | null;
  tags: string[] | null;
  created_at: string;
  page_url: string | null;
  source: string | null;
};
type BetaAllowlistRow = {
  id: string;
  email: string;
  status: 'invited' | 'active' | 'revoked';
  role: 'beta_tester' | 'admin';
  accepted_at: string | null;
  created_at: string;
};


function AdminBetaPanel() {
  const { isAdmin } = useUser();
  const [items, setItems] = useState<BetaAllowlistRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'beta_tester' | 'admin'>('beta_tester');

  const loadAllowlist = async () => {
    if (!isAdmin) return;
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: fetchError } = await (supabase as any)
        .from('beta_allowlist')
        .select('id, email, status, role, accepted_at, created_at')
        .order('created_at', { ascending: false });
      if (fetchError) throw fetchError;
      setItems((data as BetaAllowlistRow[]) || []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Allowlist konnte nicht geladen werden.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) loadAllowlist();
  }, [isAdmin]);

  const addTester = async () => {
    if (!isAdmin) return;
    const email = newEmail.trim().toLowerCase();
    if (!email || !email.includes('@')) {
      setError('Bitte eine gueltige E-Mail-Adresse eingeben.');
      return;
    }
    if (items.some((i) => i.email.toLowerCase() === email)) {
      setError('Diese E-Mail ist bereits in der Allowlist.');
      return;
    }

    setError(null);
    try {
      const supabase = createClient();
      const { error: insertError } = await (supabase as any)
        .from('beta_allowlist')
        .insert({ email, status: 'invited', role: newRole });
      if (insertError) throw insertError;
      setNewEmail('');
      setNewRole('beta_tester');
      await loadAllowlist();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Konnte Beta-Tester nicht anlegen.';
      setError(msg);
    }
  };

  const updateStatus = async (id: string, status: BetaAllowlistRow['status']) => {
    const supabase = createClient();
    await (supabase as any)
      .from('beta_allowlist')
      .update({ status })
      .eq('id', id);
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  };

  const updateRole = async (id: string, role: BetaAllowlistRow['role']) => {
    const supabase = createClient();
    await (supabase as any)
      .from('beta_allowlist')
      .update({ role })
      .eq('id', id);
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, role } : i)));
  };

  const removeTester = async (id: string) => {
    const supabase = createClient();
    await (supabase as any)
      .from('beta_allowlist')
      .delete()
      .eq('id', id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  if (!isAdmin) return null;

  const counts = {
    invited: items.filter((i) => i.status === 'invited').length,
    active: items.filter((i) => i.status === 'active').length,
    revoked: items.filter((i) => i.status === 'revoked').length,
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Admin: Beta-Tester</h3>
          <p className="text-xs text-slate-500">Allowlist verwalten (Einladen, Rollen, Sperren).</p>
        </div>

        <Button variant="secondary" size="sm" onClick={loadAllowlist}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Aktualisieren
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 text-center">
          <div className="text-xs text-slate-500">Eingeladen</div>
          <div className="text-lg font-semibold text-slate-900 dark:text-white">{counts.invited}</div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 text-center">
          <div className="text-xs text-slate-500">Aktiv</div>
          <div className="text-lg font-semibold text-slate-900 dark:text-white">{counts.active}</div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 text-center">
          <div className="text-xs text-slate-500">Gesperrt</div>
          <div className="text-lg font-semibold text-slate-900 dark:text-white">{counts.revoked}</div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <input
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="beta.user@email.de"
          className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-slate-200"
        />
        <select
          value={newRole}
          onChange={(e) => setNewRole(e.target.value as any)}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-slate-200"
        >
          <option value="beta_tester">Beta Tester</option>
          <option value="admin">Admin</option>
        </select>
        <Button onClick={addTester}>Einladen</Button>
      </div>

      {loading && <p className="text-sm text-slate-500">Lade Allowlist...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex flex-col md:flex-row md:items-center gap-3 border border-slate-200 dark:border-slate-800 rounded-xl p-3">
            <div className="flex-1">
              <div className="text-sm font-medium text-slate-900 dark:text-white">{item.email}</div>
              <div className="text-xs text-slate-500">
                Eingeladen: {new Date(item.created_at).toLocaleDateString('de-DE')}
                {item.accepted_at ? ` • Aktiv seit ${new Date(item.accepted_at).toLocaleDateString('de-DE')}` : ''}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={item.status}
                onChange={(e) => updateStatus(item.id, e.target.value as any)}
                className="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-700 dark:text-slate-200"
              >
                <option value="invited">Invited</option>
                <option value="active">Active</option>
                <option value="revoked">Revoked</option>
              </select>
              <select
                value={item.role}
                onChange={(e) => updateRole(item.id, e.target.value as any)}
                className="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-700 dark:text-slate-200"
              >
                <option value="beta_tester">Beta Tester</option>
                <option value="admin">Admin</option>
              </select>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => updateStatus(item.id, item.status === 'revoked' ? 'active' : 'revoked')}
              >
                {item.status === 'revoked' ? 'Aktivieren' : 'Sperren'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeTester(item.id)}
              >
                Entfernen
              </Button>
            </div>
          </div>
        ))}
        {!loading && items.length === 0 && (
          <p className="text-sm text-slate-500">Noch keine Beta-Tester in der Allowlist.</p>
        )}
      </div>
    </div>
  );
}

function AdminFeedbackPanel() {
  const { isAdmin } = useUser();
  const [items, setItems] = useState<FeedbackRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'triaged' | 'resolved' | 'wontfix'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | FeedbackType>('all');
  const [search, setSearch] = useState('');

  const loadFeedback = async () => {
    if (!isAdmin) return;
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: fetchError } = await (supabase as any)
        .from('beta_feedback')
        .select('id, email, rating, feedback_type, message, answers, status, tags, created_at, page_url, source')
        .order('created_at', { ascending: false })
        .limit(200);
      if (fetchError) throw fetchError;
      setItems((data as FeedbackRow[]) || []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Feedback konnte nicht geladen werden.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) loadFeedback();
  }, [isAdmin]);

  const filtered = items.filter((item) => {
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    if (typeFilter !== 'all' && item.feedback_type !== typeFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const hay = [
        item.email,
        item.message,
        item.page_url,
        item.feedback_type,
        item.status,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const ratedItems = items.filter((i) => i.rating !== null);
  const stats = {
    total: items.length,
    avgRating: ratedItems.length
      ? (ratedItems.reduce((sum, i) => sum + (i.rating || 0), 0) / ratedItems.length).toFixed(2)
      : '-',
    byStatus: {
      new: items.filter((i) => i.status === 'new').length,
      triaged: items.filter((i) => i.status === 'triaged').length,
      resolved: items.filter((i) => i.status === 'resolved').length,
      wontfix: items.filter((i) => i.status === 'wontfix').length,
    },
    byType: FEEDBACK_TYPES.reduce((acc, t) => {
      acc[t.value] = items.filter((i) => i.feedback_type === t.value).length;
      return acc;
    }, {} as Record<string, number>),
  };

const updateStatus = async (id: string, status: FeedbackRow['status']) => {
    const supabase = createClient();
    await (supabase as any)
      .from('beta_feedback')
      .update({ status })
      .eq('id', id);
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  };

  if (!isAdmin) return null;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Admin: Feedback-Log</h3>
          <p className="text-xs text-slate-500">Beta-Feedback aus der Datenbank (live).</p>
        </div>
        <Button variant="secondary" size="sm" onClick={loadFeedback}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Aktualisieren
        </Button>
      </div>


      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 text-center">
          <div className="text-xs text-slate-500">Gesamt</div>
          <div className="text-lg font-semibold text-slate-900 dark:text-white">{stats.total}</div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 text-center">
          <div className="text-xs text-slate-500">Durchschnitt</div>
          <div className="text-lg font-semibold text-slate-900 dark:text-white">{stats.avgRating}</div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 text-center">
          <div className="text-xs text-slate-500">Neu</div>
          <div className="text-lg font-semibold text-slate-900 dark:text-white">{stats.byStatus.new}</div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 text-center">
          <div className="text-xs text-slate-500">Erledigt</div>
          <div className="text-lg font-semibold text-slate-900 dark:text-white">{stats.byStatus.resolved}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {FEEDBACK_TYPES.map((t) => (
          <div key={t.value} className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 text-center text-xs">
            <div className="text-slate-500">{t.label}</div>
            <div className="text-base font-semibold text-slate-900 dark:text-white">{stats.byType[t.value] || 0}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-slate-200"
        >
          <option value="all">Alle Stati</option>
          <option value="new">Neu</option>
          <option value="triaged">Triage</option>
          <option value="resolved">Erledigt</option>
          <option value="wontfix">Wontfix</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as any)}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-slate-200"
        >
          <option value="all">Alle Typen</option>
          {FEEDBACK_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Suche (Email, Text, URL...)"
          className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-slate-200"
        />
      </div>

      {loading && <p className="text-sm text-slate-500">Lade Feedback...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && filtered.length === 0 && (
        <p className="text-sm text-slate-500">Noch kein Feedback vorhanden.</p>
      )}

      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50 dark:bg-slate-950/40"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs text-slate-500">
                {new Date(item.created_at).toLocaleString('de-DE')}
                {item.page_url ? ` • ${item.page_url}` : ''}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                  {item.feedback_type || 'general'}
                </span>
                <select
                  value={item.status || 'new'}
                  onChange={(e) => updateStatus(item.id, e.target.value as any)}
                  className="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-700 dark:text-slate-200"
                >
                  <option value="new">Neu</option>
                  <option value="triaged">Triage</option>
                  <option value="resolved">Erledigt</option>
                  <option value="wontfix">Wontfix</option>
                </select>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
              <span className="font-medium">{item.email || 'Unbekannt'}</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <Star
                    key={value}
                    className={`w-4 h-4 ${item.rating && value <= item.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300 dark:text-slate-600'}`}
                  />
                ))}
              </div>
            </div>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap">{item.message}</p>
            {item.answers && (
              <div className="mt-3 text-xs text-slate-500 space-y-1">
                {item.answers.was_gut && <div><strong>Gut:</strong> {item.answers.was_gut}</div>}
                {item.answers.was_fehlt && <div><strong>Fehlt:</strong> {item.answers.was_fehlt}</div>}
                {item.answers.fragen && <div><strong>Fragen:</strong> {item.answers.fragen}</div>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function FeedbackView() {
  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Beta Feedback</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Hilf uns, Labrechner in der Beta zu verbessern. Dein Feedback landet direkt im internen Log.
        </p>
      </div>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <FeedbackForm source="page" />
      </div>
      <AdminBetaPanel />
      <AdminFeedbackPanel />
    </div>
  );
}

export function FeedbackModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Beta Feedback"
      description="Kurzes Feedback hilft uns, die wichtigsten Dinge zuerst zu verbessern."
    >
      <FeedbackForm source="modal" compact onSuccess={onClose} />
    </Modal>
  );
}

export default FeedbackView;
