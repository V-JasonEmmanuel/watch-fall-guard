import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AlertRequest {
  elderlyName: string;
  location: string;
  alertType: 'fall' | 'medication' | 'geofence' | 'vitals' | 'danger' | 'warning';
  recipientPhone: string;
  timestamp?: string;
  details?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const fromWhatsApp = Deno.env.get('TWILIO_WHATSAPP_FROM');

    if (!accountSid || !authToken || !fromWhatsApp) {
      console.error('Missing Twilio credentials');
      throw new Error('Twilio credentials not configured');
    }

    const { elderlyName, location, alertType, recipientPhone, timestamp, details }: AlertRequest = await req.json();

    if (!elderlyName || !alertType || !recipientPhone) {
      throw new Error('Missing required fields: elderlyName, alertType, recipientPhone');
    }

    const alertTime = timestamp || new Date().toLocaleString();
    
    let messageBody = '';
    switch (alertType) {
      case 'fall':
        messageBody = `🚨 URGENT FALL ALERT 🚨\n\n` +
          `${elderlyName} has fallen!\n\n` +
          `📍 Location: ${location}\n` +
          `⏰ Time: ${alertTime}\n\n` +
          `Please check on them immediately or contact emergency services if needed.`;
        break;
      case 'medication':
        messageBody = `💊 MEDICATION REMINDER ALERT 💊\n\n` +
          `${elderlyName} has missed their medication!\n\n` +
          `💊 Medication: ${details || 'Scheduled medication'}\n` +
          `⏰ Time: ${alertTime}\n\n` +
          `Please ensure they take their medication as prescribed.`;
        break;
      case 'geofence':
        messageBody = `📍 GEOFENCE ALERT 📍\n\n` +
          `${elderlyName} has left their safe zone!\n\n` +
          `📍 Current Location: ${location}\n` +
          `⚠️ Zone: ${details || 'Outside designated area'}\n` +
          `⏰ Time: ${alertTime}\n\n` +
          `Please verify their safety and location.`;
        break;
      case 'vitals':
        messageBody = `❤️ ABNORMAL VITALS ALERT ❤️\n\n` +
          `Abnormal health readings detected for ${elderlyName}!\n\n` +
          `🏥 Details: ${details || 'Abnormal vital signs detected'}\n` +
          `📍 Location: ${location || 'Unknown'}\n` +
          `⏰ Time: ${alertTime}\n\n` +
          `Please check on them or contact healthcare provider.`;
        break;
      case 'danger':
        messageBody = `⚠️ DANGER ALERT ⚠️\n\n` +
          `Critical situation detected for ${elderlyName}\n\n` +
          `📍 Location: ${location}\n` +
          `⏰ Time: ${alertTime}\n` +
          `${details ? `📋 Details: ${details}\n` : ''}\n` +
          `Please verify their safety immediately.`;
        break;
      case 'warning':
        messageBody = `⚡ ACTIVITY WARNING\n\n` +
          `Unusual activity detected for ${elderlyName}\n\n` +
          `📍 Location: ${location}\n` +
          `⏰ Time: ${alertTime}` +
          `${details ? `\n📋 Details: ${details}` : ''}`;
        break;
      default:
        messageBody = `🔔 ALERT\n\n` +
          `Alert for ${elderlyName}\n\n` +
          `📍 Location: ${location || 'Unknown'}\n` +
          `⏰ Time: ${alertTime}` +
          `${details ? `\n📋 Details: ${details}` : ''}`;
    }

    // Format phone number for WhatsApp
    const toWhatsApp = `whatsapp:${recipientPhone.startsWith('+') ? recipientPhone : '+' + recipientPhone}`;
    const fromNumber = `whatsapp:${fromWhatsApp.startsWith('+') ? fromWhatsApp : '+' + fromWhatsApp}`;

    console.log(`Sending WhatsApp ${alertType} alert to ${toWhatsApp} from ${fromNumber}`);
    console.log(`Alert details: ${elderlyName}, ${location}, ${details}`);

    // Send WhatsApp message via Twilio API
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    
    const formData = new URLSearchParams();
    formData.append('To', toWhatsApp);
    formData.append('From', fromNumber);
    formData.append('Body', messageBody);

    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Twilio API error:', result);
      throw new Error(result.message || 'Failed to send WhatsApp message');
    }

    console.log('WhatsApp message sent successfully:', result.sid);

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageSid: result.sid,
        status: result.status 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error in send-whatsapp-alert function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
