'use client';

import React, { useState } from 'react';
import { Star, MessageSquare, Bug, Lightbulb, HelpCircle, ThumbsUp } from 'lucide-react';
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

export function FeedbackView() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Beta Feedback</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Hilf uns, Labrechner in der Beta zu verbessern. Dein Feedback landet direkt im internen Log.
        </p>
      </div>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <FeedbackForm source="page" />
      </div>
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
