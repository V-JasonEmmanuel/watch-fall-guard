import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Default emergency phone number
const DEFAULT_EMERGENCY_PHONE = '+91-6369739598';

export type AlertType = 'fall' | 'medication' | 'geofence' | 'vitals' | 'danger' | 'warning';

interface SendAlertParams {
  elderlyName: string;
  location?: string;
  alertType: AlertType;
  details?: string;
  recipientPhone?: string;
}

export const useWhatsAppAlert = () => {
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  const [emergencyPhone, setEmergencyPhone] = useState(DEFAULT_EMERGENCY_PHONE);

  const sendAlert = useCallback(async ({
    elderlyName,
    location = 'Unknown',
    alertType,
    details,
    recipientPhone
  }: SendAlertParams) => {
    const phoneToUse = recipientPhone || emergencyPhone;
    
    if (!phoneToUse) {
      toast({
        title: "Configuration Required",
        description: "Please configure an emergency phone number for WhatsApp alerts.",
        variant: "destructive",
      });
      return { success: false, error: 'No phone number configured' };
    }

    setIsSending(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-whatsapp-alert', {
        body: {
          elderlyName,
          location,
          alertType,
          recipientPhone: phoneToUse.replace(/[^+\d]/g, ''), // Clean phone number
          timestamp: new Date().toLocaleString(),
          details
        }
      });

      if (error) throw error;

      const alertTitles: Record<AlertType, string> = {
        fall: '🚨 FALL DETECTED!',
        medication: '💊 MEDICATION ALERT!',
        geofence: '📍 GEOFENCE ALERT!',
        vitals: '❤️ VITALS ALERT!',
        danger: '⚠️ DANGER ALERT!',
        warning: '⚡ WARNING!'
      };

      toast({
        title: alertTitles[alertType],
        description: `WhatsApp alert sent to ${phoneToUse}`,
        variant: alertType === 'fall' || alertType === 'danger' ? "destructive" : "default",
      });

      return { success: true, data };
    } catch (error) {
      console.error(`Failed to send ${alertType} WhatsApp alert:`, error);
      toast({
        title: "Alert Failed",
        description: `Could not send WhatsApp alert. Please check Twilio configuration.`,
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsSending(false);
    }
  }, [emergencyPhone, toast]);

  return {
    sendAlert,
    isSending,
    emergencyPhone,
    setEmergencyPhone,
    DEFAULT_EMERGENCY_PHONE
  };
};
