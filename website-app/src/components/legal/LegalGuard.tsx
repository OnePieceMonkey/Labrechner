'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { AVVContent } from './content/AVVContent';
import { AIDisclaimerContent } from './content/AIDisclaimerContent';

export const LegalGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings, updateSettings, isLoading } = useUser();
  const [showAVV, setShowAVV] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isLoading || !settings) return;

    // Check 1: AVV
    if (!settings.has_accepted_avv) {
      setShowAVV(true);
      setShowAI(false); // Prioritize AVV
      return;
    } else {
      setShowAVV(false);
    }

    // Check 2: AI Disclaimer
    if (!settings.ai_disclaimer_accepted_at) {
      setShowAI(true);
    } else {
      setShowAI(false);
    }
  }, [settings, isLoading]);

  const handleAcceptAVV = async () => {
    setIsSubmitting(true);
    try {
      await updateSettings({
        has_accepted_avv: true,
        avv_accepted_at: new Date().toISOString(),
      });
      // Modal will close automatically via useEffect
    } catch (error) {
      console.error('Failed to accept AVV', error);
      alert('Fehler beim Speichern. Bitte versuchen Sie es erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcceptAI = async () => {
    setIsSubmitting(true);
    try {
      await updateSettings({
        ai_disclaimer_accepted_at: new Date().toISOString(),
      });
      // Modal will close automatically via useEffect
    } catch (error) {
      console.error('Failed to accept AI Disclaimer', error);
      alert('Fehler beim Speichern. Bitte versuchen Sie es erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If loading user settings, we can just render children (layout handles loading state usually)
  // or a spinner. For a Guard, rendering children might flash content.
  // But DashboardLayout has its own loading. Let's render children but Modals will overlay.

  return (
    <>
      {children}

      {/* AVV Modal - BLOCKING */}
      <Modal
        isOpen={showAVV}
        title="Vertrag zur Auftragsverarbeitung (AVV)"
        description="Bevor Sie Labrechner nutzen können, müssen Sie dem AVV zustimmen, da wir personenbezogene Daten für Sie verarbeiten."
        preventClose={true}
        footer={
          <div className="flex justify-end gap-3">
            <Button 
              onClick={handleAcceptAVV} 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Wird gespeichert...' : 'AVV akzeptieren & fortfahren'}
            </Button>
          </div>
        }
      >
        <AVVContent />
      </Modal>

      {/* AI Disclaimer Modal - BLOCKING (or optional?) Let's make it blocking for MVP safety */}
      <Modal
        isOpen={showAI}
        title="KI-Assistent & Datenschutz"
        description="Bitte bestätigen Sie die Hinweise zur Nutzung unseres KI-Assistenten."
        preventClose={true}
        footer={
          <div className="flex justify-end gap-3">
            <Button 
              onClick={handleAcceptAI} 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Verstanden & Akzeptieren' : 'Verstanden & Akzeptieren'}
            </Button>
          </div>
        }
      >
        <AIDisclaimerContent />
      </Modal>
    </>
  );
};
